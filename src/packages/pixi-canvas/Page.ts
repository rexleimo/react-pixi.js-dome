import * as PIXI from 'pixi.js';
import cuid from "cuid";
import {IPolloCanvas} from "@/packages/pixi-canvas/types/IPolloCanvas";
import {IPage} from "@/packages/pixi-canvas/types/IPage";
import {PixiRenderEnable} from "@/packages/pixi-canvas/types/PixiRenderable";

import ImageEntity from "@/packages/pixi-canvas/objects/Image";

interface PageOptions {
    width?: number;
    height?: number;
}

class Page implements IPage {

    _width: number = 1080;
    _height: number = 1920;
    _id: string = '';
    // 定义实例
    _instances: PIXI.Container;

    constructor(private _app: IPolloCanvas, options: PageOptions) {
        this._id = cuid();
        const {width, height} = options;
        if (width) {
            this._width = width;
        }
        if (height) {
            this._height = height;
        }

        const container = new PIXI.Container();
        this._instances = container;
        container.width = this._width;
        container.height = this._height;

        const background = new PIXI.Graphics();
        const color = new PIXI.Color({r: 255, g: 255, b: 255});
        background.beginFill(color);
        background.drawRect(0, 0, this._width, this._height);
        background.endFill();

        container.addChild(background);

        const {width: rendererWidth, height: rendererHeight} = this._app.getRendererTargetSize();

        container.x = (rendererWidth - this._width) / 2;
        container.y = (rendererHeight - this._height) / 2;

        this._app.getCamera().addChildren(container);
    }

    setId(id: string) {
        this._id = id;
    }

    getId() {
        return this._id;
    }

    addChildren(children: PixiRenderEnable) {
        this._instances.addChild(children);
    }


    addImage(url: string) {
        const image = new ImageEntity(this._app)
        image.setImage(url);
        this._instances.addChild(image.getEntity());
    }

}

export default Page;