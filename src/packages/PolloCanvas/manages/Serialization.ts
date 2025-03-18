import PolloImage from "../objects/Image";
import PolloText from "../objects/text";
import { ICanvas } from "../types/ICanvas";

class Serialization {
  static instance: Serialization;

  static getInstance() {
    if (!Serialization.instance) {
      Serialization.instance = new Serialization();
    }
    return Serialization.instance;
  }

  serialize(canvas: ICanvas) {
    const data = canvas.toJSON();
    return data;
  }

  deserialize(canvas: ICanvas, data: any) {
    const { objects } = data;

    (objects as any[]).forEach(async (object: any, index: number) => {
      const sleep = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

      if (object.type === "Image") {
        const image = new PolloImage();
        await image.setImage(object.src);
        canvas.addObject(image.getEntity(), false);
        canvas.getCanvas().moveObjectTo(image.getEntity(), index);
      } else if (object.type === "Textbox") {
        const text = new PolloText();
        text.setText(object.text);
        canvas.addObject(text.getEntity(), false);
        canvas.getCanvas().moveObjectTo(text.getEntity(), index);
      }
    });
  }
}
export default Serialization;
