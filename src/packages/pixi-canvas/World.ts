import * as PIXI from "pixi.js";
import {PixiRenderEnable} from "@/packages/pixi-canvas/types/PixiRenderable";
import {IPolloCanvas} from "@/packages/pixi-canvas/types/IPolloCanvas";
import GridSystem from "@/packages/pixi-canvas/GridSystem";
import {IGridSystem} from "@/packages/pixi-canvas/types/IGridSystem";


class World {

    //实列
    _instance: PIXI.Container;
    _isDragging: boolean = false;
    _currentScale = 0.5;
    _lastPosition = {x: 0, y: 0};
    _app: PIXI.Application<PIXI.ICanvas>
    _gridSystem: IGridSystem;

    MIN_SCALE = 0.1;
    MAX_SCALE = 80;

    constructor(private _application: IPolloCanvas) {
        this._instance = new PIXI.Container();
        this._instance.scale.set(this._currentScale);
        this._app = this._application.getPixiInstances();
        this._gridSystem = new GridSystem(this._application);
        this._app.stage.addChild(this._instance);
        this._app.stage.addChild(this._gridSystem.getInstance());

        window.addEventListener('mousedown', (e) => {
            this._isDragging = true;
            this._lastPosition = {x: e.clientX, y: e.clientY};
        });

        window.addEventListener('mousemove', (e) => {
            if (!this._isDragging) return;

            const dx = e.clientX - this._lastPosition.x;
            const dy = e.clientY - this._lastPosition.y;

            this._instance.x += dx;
            this._instance.y += dy;

            this._lastPosition = {x: e.clientX, y: e.clientY};
        });

        window.addEventListener('mouseup', () => {
            this._isDragging = false;
        });

        window.addEventListener('wheel', (e) => {
            e.preventDefault();

            const {left, top} = (this._app.view as HTMLCanvasElement).getBoundingClientRect();

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
        })

        window.addEventListener("contextmenu", (e) => e.preventDefault())
    }

    // 添加子类
    addChild(children: PixiRenderEnable) {
        this._instance.addChild(children);
    }

    // 获取缩放比例
    getScale() {
        return this._currentScale;
    }

}

export default World