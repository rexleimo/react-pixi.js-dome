import cuid from "cuid";
import { FabricObject, Textbox } from "fabric";

abstract class AbstractObject {
  protected uuid: string;
  protected entity!: FabricObject;

  constructor() {
    this.uuid = cuid();
  }

  public initEntity() {
    this.entity = this.getEntity();

    this.entity.on("mouseover", () => {
      this.entity.hoverCursor = "default";
      // 显示边框
      if (this.entity.canvas?.getActiveObject() === this.entity) {
        return;
      }

      this.entity.set({
        stroke: '#00a8ff',
        strokeWidth: 1,
        strokeUniform: true,
      });
      this.entity.canvas?.requestRenderAll();
      
    });

    this.entity.on("mouseout", () => {
      this.entity.hoverCursor = "default";
      // 移除边框
      this.entity.set({
        stroke: undefined,
        strokeUniform: true,
      });
      this.entity.canvas?.requestRenderAll();
    });

    // 设置控制点样式
    this.entity.set({
      transparentCorners: false,
      cornerColor: '#00a8ff',
      cornerStrokeColor: '#00a8ff',
      cornerSize: 10,
      borderColor: '#00a8ff',
      borderScaleFactor: 2,
    });

    // 隐藏中间的控制点，只保留四个角的控制点
    this.entity.setControlsVisibility({
      mt: false, // 中上
      mb: false, // 中下
      ml: false, // 中左
      mr: false, // 中右
      mtr: false,
      // 保留四个角的控制点
      tl: true, // 左上
      tr: true, // 右上
      bl: true, // 左下
      br: true, // 右下
    });
  }

  public getUuid() {
    return this.uuid;
  }

  public abstract getEntity(): FabricObject;
  
}

export default AbstractObject;
