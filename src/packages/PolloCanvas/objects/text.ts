import { Textbox } from "fabric";
import AbstractObject from "../abstracts/AbstractObject";

class PolloText extends AbstractObject {

    constructor() {
        super();

        this.entity = new Textbox('', {
            left: 0,
            top: 0,
            width: 100,
            height: 100,
            lockUniScaling: true,
            splitByGrapheme: false,
            lockScalingFlip: true
        });
        this.initEntity();
    }

    public setText(text: string) {
        (this.entity as Textbox).set("text",text);
    }

    public getEntity() {
        return this.entity;
    }
  
}

export default PolloText;