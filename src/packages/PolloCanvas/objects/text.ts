import { Textbox, Text } from "fabric";
import AbstractObject from "../abstracts/AbstractObject";

class PolloText extends AbstractObject {

    fontSize: number = 16;

  constructor() {
    super();

    this.entity = new Textbox("", {
      left: 0,
      top: 0,
      lockUniScaling: true,
      splitByGrapheme: false,
      lockScalingFlip: true,
    });
    this.initEntity();
  }

  public setText(text: string) {
    // 创建一个临时的 Text 对象来计算宽度
    const tempText = new Text("您的文案内容", {
      fontSize: this.fontSize,
      fontFamily: "Arial",
    });

    tempText.initDimensions();

    (this.entity as Textbox).set({
      fontSize: this.fontSize,
      text: text,
      textAlign: "left",
      width: tempText.width * 1.3,
      lineHeight: 1.2,
      editable: true,
      breakWords: false,
      wordBreak: "keep-all",
    });
  }

  public getEntity() {
    return this.entity;
  }
}

export default PolloText;
