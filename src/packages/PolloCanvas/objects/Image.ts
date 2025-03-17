import { FabricImage } from "fabric";
import AbstractObject from "../abstracts/AbstractObject";

class PolloImage extends AbstractObject {

    constructor() {
        super()
    }

    public setImage(src: string) {
        return FabricImage.fromURL(src).then(img => {
            this.entity = img;
            this.entity.hoverCursor = 'default';
           
            // 设置选中时的控制点和边框样式
            this.initEntity();
        });
    }

    public getEntity() {
        return this.entity;
    }

}

export default PolloImage;
