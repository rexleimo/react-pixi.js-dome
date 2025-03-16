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
            this.image.hoverCursor = 'default';

            this.image.on('mouseover', () => {
                // 是否选中态
                const isSelected = this.image.activeOn;
                if(isSelected){
                    this.image.hoverCursor = 'move';
                }else{
                    this.image.hoverCursor = 'default';
                }
            });

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
