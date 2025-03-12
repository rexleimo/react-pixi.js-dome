import * as PIXI from 'pixi.js';
import Page from "@/packages/pixi-canvas/Page";
import World from "@/packages/pixi-canvas/World";
import {IPolloCanvas} from "@/packages/pixi-canvas/types/IPolloCanvas";
import {IGridSystem} from "@/packages/pixi-canvas/types/IGridSystem";


class PolloCanvas implements IPolloCanvas {

    _app: PIXI.Application<PIXI.ICanvas>;
    _pages = new Map<string, Page>();
    // 定义摄像机
    _camera!: World;
    _gridSystem!: IGridSystem;

    constructor(private container: HTMLDivElement) {
        this._app = new PIXI.Application({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0xf0f0f0,
            resolution: window.devicePixelRatio || 1,
            antialias: true // 关闭抗锯齿以便在高缩放时看到清晰的像素
        });
        this.init().then(() => {
            this._camera = new World(this);
        })
    }

    async init() {
        this.container.appendChild(this._app.view as HTMLCanvasElement);
        return Promise.resolve();
    }

    addPage() {
        const page = new Page(this, {});
        this._pages.set(page.getId(), page);
    }

    getPixiInstances() {
        return this._app;
    }

    getRendererTargetSize() {
        const {width, height} = this._app.renderer;
        const scale = this.getCamera().getScale();
        return {width: width / scale, height: height / scale};
    }

    getCamera() {
        return this._camera;
    }

}

export default PolloCanvas;