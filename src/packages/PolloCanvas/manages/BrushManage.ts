import DrawManage from "./DrawManage";
import { ICanvas } from "../types/ICanvas";
import { EDrawMode } from "../enums/EDrawMode";
import { PencilBrush } from "fabric";
class BrushManage {
  static _instance: BrushManage;

  static getInstance() {
    if (!this._instance) {
      this._instance = new BrushManage();
    }
    return this._instance;
  }

  private drawManage: DrawManage;
  private application!: ICanvas;

  constructor() {
    this.drawManage = DrawManage.getInstance();
    this.drawManage.onDrawModeChange((mode) => {
      if (mode === EDrawMode.DRAW) {
        this.application.getCanvas().isDrawingMode = true;
      } else {
        this.application.getCanvas().isDrawingMode = false;
      }
    });
  }

  setApplication(application: ICanvas) {
    this.application = application;

    const pencilBrush = new PencilBrush(this.application.getCanvas());
    pencilBrush.color = "black";
    pencilBrush.width = 10; 

    this.application.getCanvas().freeDrawingBrush = pencilBrush;

  }
}

export default BrushManage;
