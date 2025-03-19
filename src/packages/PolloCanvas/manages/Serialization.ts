import PolloImage from "../objects/Image";
import PolloText from "../objects/text";
import { ICanvas } from "../types/ICanvas";

interface SerializedCanvas {
  objects: Array<SerializedObject>;
  [key: string]: unknown;
}

interface SerializedObject {
  type: string;
  src?: string;
  text?: string;
  [key: string]: unknown;
}

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

  async deserialize(canvas: ICanvas, data: SerializedCanvas) {
    const { objects } = data;
    let i = 0;
    for (const object of objects) {
      if (object.type === "Image") {
        const image = new PolloImage();
        await image.setImage(object.src || "");
        canvas.addObject(image.getEntity(), false);
        canvas.getCanvas().moveObjectTo(image.getEntity(), i);
      } else if (object.type === "Textbox") {
        const text = new PolloText();
        text.setText(object.text || "");
        canvas.addObject(text.getEntity(), false);
        canvas.getCanvas().moveObjectTo(text.getEntity(), i);
      }
      i++;
    }
  }
}
export default Serialization;
