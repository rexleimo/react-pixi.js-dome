import { Rect, Group } from "fabric";
import AbstractObject from "../abstracts/AbstractObject";

class Border extends AbstractObject {
  constructor(width: number, height: number) {
    super();
    this.entity = new Rect();

    this.entity.set({
      width: width,
      height: height,
      stroke: "#00a8ff",
      strokeWidth: 2,
      strokeUniform: true,
      selectable: false,
      hasControls: false,
      hasBorders: false,
      fill: "transparent",
      visible: false,
    });
  }

  public getEntity() {
    return this.entity;
  }
}

export default Border;
