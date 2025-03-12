import {IGridSystem} from "@/packages/pixi-canvas/types/IGridSystem";
import * as PIXI from "pixi.js";
import {debounce} from 'lodash-es';
import {IPolloCanvas} from "@/packages/pixi-canvas/types/IPolloCanvas";

class GridSystem implements IGridSystem {

    private _instance: PIXI.Container;
    private gridSize = 2500; // 网格大小
    private gridColor = 0x000000;
    private gridAlpha = 0.3;

    constructor(private readonly _application: IPolloCanvas) {
        this._instance = new PIXI.Container();
    }

    drawGrid = debounce(() => {
        this._instance.removeChildren();
        const {width, height} = this._application.getPixiInstances().screen;
        const scale = this._application.getCamera().getScale();
        const tW = width / 0.1;
        const tH = height / 0.1;
        const tSize = Math.max(this.gridSize / scale, 50);
        const graphics = new PIXI.Graphics();
        graphics.lineStyle(1, this.gridColor, this.gridAlpha);
// 计算网格范围
        const startX = -Math.floor(tW / 2);
        const endX = Math.floor(tW / 2);
        const startY = -Math.floor(tH / 2);
        const endY = Math.floor(tH / 2);

// 绘制垂直线
        for (let x = startX; x <= endX; x += tSize) {
            graphics.moveTo(x, startY);
            graphics.lineTo(x, endY);
        }

// 绘制水平线
        for (let y = startY; y <= endY; y += tSize) {
            graphics.moveTo(startX, y);
            graphics.lineTo(endX, y);
        }
        this._instance.addChild(graphics);
    }, 0)

    showGrid() {
        this.drawGrid();
    }

    hideGrid() {
        this._instance.removeChildren();
    }

    getInstance() {
        return this._instance;
    }

}

export default GridSystem;