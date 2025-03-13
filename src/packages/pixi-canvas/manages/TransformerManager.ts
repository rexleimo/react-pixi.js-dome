import { IPolloCanvas } from "@/packages/pixi-canvas/types/IPolloCanvas";
import { Transformer as PixiTransformer } from '@pixi-essentials/transformer';
import SelectObjectManage from "@/packages/pixi-canvas/manages/SelectObjectManage";
import KeyboardManager, { KeyMap } from "./KeyboardManager";
import { Point } from "pixi.js";
import { Matrix } from "@pixi/math";
import * as PIXI from 'pixi.js';



class Transformer extends PixiTransformer {

    // 是否约束轴   
    private _constrainAxis: boolean = false;


    constructor(options: any) {
        super(options);

        KeyboardManager.getInstance().addObserver((keys) => {
            if (keys.has(KeyMap.SHIFT)) {
                this._constrainAxis = true;
            } else {
                this._constrainAxis = false;
            }
        })

    }

    translateGroup = (delta: Point): void => {
        // @ts-ignore
        this._transformHandle = null;
        this._transformType = 'translate';

        let deltaDelta = new Point(delta.x, delta.y);
        if (this._constrainAxis) {
            deltaDelta = new Point(
                Math.abs(delta.x) > Math.abs(delta.y) ? delta.x : 0,
                Math.abs(delta.y) > Math.abs(delta.x) ? delta.y : 0
            );
        }

        const matrix = new Matrix().identity().translate(deltaDelta.x, deltaDelta.y);
        this.prependTransform(matrix);
    }


}

class TransformerManager {

    static _instance: TransformerManager | null = null;

    static getInstance() {
        if (!this._instance) {
            this._instance = new TransformerManager();
        }
        return this._instance;
    }

    _currentTransformer: Transformer | null = null;
    _application: IPolloCanvas | null = null;


    setApplication(application: IPolloCanvas) {
        this._application = application;
    }

    init() {
        const app = this._application?.getPixiInstances();
        this._currentTransformer = new Transformer({
            rotateEnabled: false,
            lockAspectRatio: true,
            boxRotationEnabled: true,
            boxScalingEnabled: true,

            stage: app?.stage,
            wireframeStyle: {
                thickness: 1,
                color: 0xff0000,
            },
        })
        // 让事件可以穿透到下面的对象
        this._currentTransformer.hitArea = null;
        this._currentTransformer.interactive = true;
        app?.stage.addChild(this._currentTransformer);

        SelectObjectManage.getInstance().onSelectObject((objs) => {
            if (this._currentTransformer) {
                this._currentTransformer.group = Array.from(objs);
            }
        })

        KeyboardManager.getInstance().addObserver((keys) => {
            if (!this._currentTransformer) {
                return;
            }

            if (keys.has(KeyMap.SPACE)) {
                this._currentTransformer!.boxRotationEnabled = false;
                this._currentTransformer!.rotateEnabled = false;
                this._currentTransformer!.scaleEnabled = false;
                this._currentTransformer!.translateEnabled = false;
            } else {
                this._currentTransformer!.boxRotationEnabled = true;
                this._currentTransformer!.rotateEnabled = true;
                this._currentTransformer!.scaleEnabled = true;
                this._currentTransformer!.translateEnabled = true;
            }
        })

        this._currentTransformer.on('pointerdown', (event) => {
            event.stopPropagation();
            if (SelectObjectManage.getInstance().getSelectedObjects().size === 1) {
                const obj = SelectObjectManage.getInstance().getSelectedObjects().values().next().value;
                if (obj instanceof PIXI.Text) {
                    obj.emit('pointerdown', event);
                }
            }
        });
    }

    // 显示隐藏
    show() {
        if (!this._currentTransformer) {
            return;
        }
        this._currentTransformer.visible = true;
        this._currentTransformer.children.forEach((child) => {
            child.visible = true;
        });
    }

    hide() {
        if (!this._currentTransformer) {
            return;
        }
        this._currentTransformer.visible = false;
        this._currentTransformer.children.forEach((child) => {
            child.visible = false;
        });
    }

}

export default TransformerManager;