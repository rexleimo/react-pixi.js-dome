import DrawManage from "./DrawManage";
import { ICanvas } from "../types/ICanvas";
import { EDrawMode } from "../enums/EDrawMode";
import { PencilBrush, StaticCanvas } from "fabric";
import PolloImage from "../objects/Image";

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

  private width: number = 10;
  private color: string = "black";

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
        this.mergeFreeDrawingObjects();
      }
    });
    
  }

  setApplication(application: ICanvas) {
    this.application = application;

    this.pencilBrush = new PencilBrush(this.application.getCanvas());
    this.pencilBrush.color = this.color;
    this.pencilBrush.width = this.width;

    this.eraserBrush = new PencilBrush(this.application.getCanvas());
    this.eraserBrush.color = "white";
    this.eraserBrush.width = this.width;
   
  }

  async mergeFreeDrawingObjects() {
    const objects = this.application.getCanvas().getObjects();
    const pathObjects = objects.filter((object) => object.type === "path");
    if (pathObjects.length === 0) return;

    // 计算所有路径对象的边界
    const minX = Math.min(...pathObjects.map((obj) => obj.left));
    const minY = Math.min(...pathObjects.map((obj) => obj.top));
    const maxX = Math.max(
      ...pathObjects.map((obj) => obj.left + obj.width * obj.scaleX)
    );
    const maxY = Math.max(
      ...pathObjects.map((obj) => obj.top + obj.height * obj.scaleY)
    );

    const width = maxX - minX;
    const height = maxY - minY;

    // 创建临时画布
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = width;
    tempCanvas.height = height;

    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return;

    // 创建临时 fabric 画布以正确渲染对象
    const tempFabricCanvas = new StaticCanvas();
    tempFabricCanvas.setDimensions({
      width: width,
      height: height,
    });

    // 复制路径对象到临时画布，并调整位置
    pathObjects.forEach(async (obj) => {
      obj.top = obj.top - minY;
      obj.left = obj.left - minX;
      tempFabricCanvas.add(obj);
    });

    tempFabricCanvas.renderAll();
    //获取临时画布的数据 URL
    const dataUrl = tempFabricCanvas.toDataURL();
    
    //创建新的图像对象
    const image = new PolloImage();
    await image.setImage(dataUrl);

    const entity = image.getEntity();
    entity.left = minX;
    entity.top = minY;

    this.application.getCanvas().add(entity);
    this.application.getCanvas().renderAll();
  }

  getDrawManage() {
    return this.drawManage;
  }

}

export default BrushManage;
