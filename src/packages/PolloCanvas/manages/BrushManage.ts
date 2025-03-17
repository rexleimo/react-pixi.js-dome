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

  private pencilBrush!: PencilBrush;
  private eraserBrush!: PencilBrush;

  constructor() {
    this.drawManage = DrawManage.getInstance();
    this.drawManage.onDrawModeChange((mode) => {
      if (mode === EDrawMode.DRAW || mode === EDrawMode.ERASER) {
        this.application.getCanvas().isDrawingMode = true;

        if (mode === EDrawMode.ERASER) {
          this.application.getCanvas().freeDrawingBrush = this.eraserBrush;
        } else {
          this.application.getCanvas().freeDrawingBrush = this.pencilBrush;
        }
      } else {
        this.application.getCanvas().isDrawingMode = false;
      }
    });
  }

  setApplication(application: ICanvas) {
    this.application = application;

    this.pencilBrush = new PencilBrush(this.application.getCanvas());
    this.pencilBrush.color = "black";
    this.pencilBrush.width = 10; 

    this.eraserBrush = new PencilBrush(this.application.getCanvas());
    this.eraserBrush.color = "white";
    this.eraserBrush.width = 10;
    
  }
}

export default BrushManage;
