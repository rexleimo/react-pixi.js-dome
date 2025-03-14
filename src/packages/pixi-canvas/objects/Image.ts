import * as PIXI from 'pixi.js';
import {IPolloCanvas} from "@/packages/pixi-canvas/types/IPolloCanvas";
import {IEntity} from "@/packages/pixi-canvas/types/IEntity";
import SelectObjectManage from "@/packages/pixi-canvas/manages/SelectObjectManage";

class ImageEntity implements IEntity {

    _instance: PIXI.Sprite;
    _imageOriginal!: HTMLImageElement;
    _zIndex: number = 11;

    constructor(private _application: IPolloCanvas) {
        this._instance = new PIXI.Sprite();
        this._instance.interactive = true;
        this._instance.eventMode = 'static';
        this._instance.zIndex = this._zIndex;

        this._instance.on('pointerdown', (event) => {
            event.stopPropagation();
            SelectObjectManage.getInstance().emitPushEvent(this._instance);
        })

    }

    getEntity() {
        return this._instance;
    }

    setImage(url: string) {
        this.toImageData(url).then(imageData => {
            const texture = PIXI.Texture.fromBuffer(imageData.data, imageData.width, imageData.height);
            const sprite = new PIXI.Sprite(texture);
            this._instance.addChild(sprite);
        })
    }

    toImageData(url: string): Promise<ImageData> {
        return new Promise(async (resolve, reject) => {
            try {

                const response = await fetch(url);
                const blob = await response.blob();
                const bitmap = await createImageBitmap(blob);
                console.log("xxx");
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

}

export default ImageEntity;
