import * as PIXI from "pixi.js";
import { PixiRenderEnable } from "@/packages/pixi-canvas/types/PixiRenderable";
import { IPolloCanvas } from "@/packages/pixi-canvas/types/IPolloCanvas";
import GridSystem from "@/packages/pixi-canvas/GridSystem";
import { IGridSystem } from "@/packages/pixi-canvas/types/IGridSystem";
import KeyboardManager, { KeyMap } from "@/packages/pixi-canvas/manages/KeyboardManager";
import { IEntity } from "./types/IEntity";


class World implements IEntity {

    //实列
    _instance: PIXI.Container;
    // 定义可以移动的属性
    _isDragging: boolean = false;
    _currentScale = 1;
    _lastPosition = { x: 0, y: 0 };
    _app: PIXI.Application<PIXI.ICanvas>
    _gridSystem: IGridSystem;
    _keyboardManager: KeyboardManager;

    MIN_SCALE = 0.1;
    MAX_SCALE = 80;


    constructor(private _application: IPolloCanvas) {
        this._instance = new PIXI.Container();
        this._instance.scale.set(this._currentScale);
        this._app = this._application.getPixiInstances();
        this._gridSystem = new GridSystem(this._application);
        this._app.stage.addChild(this._instance);
        this._app.stage.addChild(this._gridSystem.getInstance());
        this._keyboardManager = KeyboardManager.getInstance();
        this.init();
    }

    init() {
        window.addEventListener('mousedown', (e) => {
            if (this._keyboardManager.getKeys().has(KeyMap.SPACE)) {
                this._isDragging = true;
                this._lastPosition = { x: e.clientX, y: e.clientY };
            }
        });

        window.addEventListener('mousemove', (e) => {
            if (!this._isDragging) return;

            const dx = e.clientX - this._lastPosition.x;
            const dy = e.clientY - this._lastPosition.y;

            this._instance.x += dx;
            this._instance.y += dy;

            this._lastPosition = { x: e.clientX, y: e.clientY };
        });

        window.addEventListener('mouseup', () => {
            this._isDragging = false;
        });

        window.addEventListener('wheel', (e) => {
            e.preventDefault();

            const keyboardLength = this._keyboardManager.getKeys().size;
            // 只能是一个按键的时候可以操作
            if (keyboardLength > 1) {
                return;
            }

            const shiftKey = this._keyboardManager.getKeys().has(KeyMap.SHIFT);
            const ctrlKey = this._keyboardManager.getKeys().has(KeyMap.META) || this._keyboardManager.getKeys().has(KeyMap.CONTROL);

            // 按下CTRL 才可以缩放
            if (ctrlKey) {
                const { left, top } = (this._app.view as HTMLCanvasElement).getBoundingClientRect();

                // 获取鼠标相对于 viewport 的位置
                const mouseX = e.clientX - left;
                const mouseY = e.clientY - top;

                // 计算鼠标在世界坐标中的位置
                const worldPos = {
                    x: (mouseX - this._instance.x) / this._instance.scale.x,
                    y: (mouseY - this._instance.y) / this._instance.scale.y
                };

                // 计算新的缩放值
                const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
                const newScale = Math.min(this.MAX_SCALE, Math.max(this.MIN_SCALE, this._currentScale * zoomFactor));

                // 如果缩放值在允许范围内，则应用缩放
                if (newScale !== this._currentScale) {
                    // const scaleDiff = newScale / this._currentScale;
                    this._currentScale = newScale;
                    console.log(this._currentScale);
                    if (this._currentScale > 40) {
                        this._gridSystem.showGrid();
                    } else {
                        this._gridSystem.hideGrid();
                    }

                    this._instance.scale.set(this._currentScale);

                    // 调整位置以保持鼠标指向的点不变
                    this._instance.x = mouseX - worldPos.x * this._instance.scale.x;
                    this._instance.y = mouseY - worldPos.y * this._instance.scale.y;
                }
            } else if (shiftKey) {
                // 水平移动
                this._instance.x += e.deltaX;
            }
        })

        window.addEventListener("contextmenu", (e) => e.preventDefault())
    }



    getEntity() {
        return this._instance;
    }

    // 添加子类
    addChildren(children: PixiRenderEnable) {
        this._instance.addChild(children);
    }


    // 获取缩放比例
    getScale() {
        return this._currentScale;
    }

}

export default World