import * as PIXI from 'pixi.js';
import cuid from "cuid";
import {IPolloCanvas} from "@/packages/pixi-canvas/types/IPolloCanvas";
import {IPage} from "@/packages/pixi-canvas/types/IPage";
import {PixiRenderEnable} from "@/packages/pixi-canvas/types/PixiRenderable";
import SelectObjectManage from "@/packages/pixi-canvas/SelectObjectManage";

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

        this._app.getCamera().addChild(container);
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

    urlToImageData(url: string): Promise<ImageData> {
        return new Promise(async (resolve, reject) => {

            try {
                const response = await fetch(url);
                const blob = await response.blob();
                const bitmap = await createImageBitmap(blob);


                if (typeof OffscreenCanvas !== 'undefined') {
                    const offscreen = new OffscreenCanvas(bitmap.width, bitmap.height);
                    const ctx = offscreen.getContext('2d');
                    if (ctx) {
                        ctx.drawImage(bitmap, 0, 0);
                        const imageData = ctx.getImageData(0, 0, bitmap.width, bitmap.height);
                        resolve(imageData);
                    }
                } else {
                    const canvas = document.createElement('canvas');
                    canvas.width = bitmap.width;
                    canvas.height = bitmap.height;
                    const context = canvas.getContext('2d');
                    if (context) {
                        context.drawImage(bitmap, 0, 0);
                        const imageData = context.getImageData(0, 0, bitmap.width, bitmap.height);
                        resolve(imageData);
                    }
                }
            } catch (e) {
                reject(e);
            }

        })
    }

    addImage(url: string) {
        this.urlToImageData(url).then((imageData) => {
            const texture = PIXI.Texture.fromBuffer(imageData.data, imageData.width, imageData.height);
            const sprite = new PIXI.Sprite(texture);
            sprite.width = Math.min(this._width, texture.width);
            sprite.interactive = true;
            sprite.on('pointerdown', (e) => {
                SelectObjectManage.getInstance().setSelectObject(e.currentTarget as PixiRenderEnable);
            });
            this._instances.addChild(sprite);
        })

    }

}

export default Page;