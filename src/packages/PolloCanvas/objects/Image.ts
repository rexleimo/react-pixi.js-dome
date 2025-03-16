import { FabricImage } from "fabric";
import cuid from "cuid";

class PolloImage  {

    private image!: FabricImage;
    private uuid: string;

    constructor() { 
        this.uuid = cuid();
    }

    public setImage(src: string) {
        return FabricImage.fromURL(src).then(img=>{
            this.image = img;
        });
    }

    public getImage() {
        return this.image;
    }

    public getUuid() {
        return this.uuid;
    }
}

export default PolloImage;
