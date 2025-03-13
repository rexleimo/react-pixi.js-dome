import { IPolloCanvas } from "@/packages/pixi-canvas/types/IPolloCanvas";
import { Transformer as PixiTransformer } from '@pixi-essentials/transformer';
import SelectObjectManage from "@/packages/pixi-canvas/manages/SelectObjectManage";
import KeyboardManager, { KeyMap } from "./KeyboardManager";
import { Point } from "pixi.js";
import { Matrix } from "@pixi/math";


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

    _currentTransformer: Transformer | null = null;

    constructor(private _application: IPolloCanvas) {
        SelectObjectManage.getInstance().onSelectObject((objs) => {
            if (this._currentTransformer) {
                this._currentTransformer.destroy();
            }

            const app = this._application.getPixiInstances();
            this._currentTransformer = new Transformer({
                rotateEnabled: false,
                lockAspectRatio: true,
                boxRotationEnabled: true,
                boxScalingEnabled: true,
                group: Array.from(objs),
                stage: app.stage,
                wireframeStyle: {
                    thickness: 1,
                    color: 0xff0000,
                },
            })


            app.stage.addChild(this._currentTransformer);
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

    }


}

export default TransformerManager;