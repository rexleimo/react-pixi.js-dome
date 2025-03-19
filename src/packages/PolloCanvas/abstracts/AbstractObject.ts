import cuid from "cuid";
import { FabricObject } from "fabric";

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

      if (this.entity.canvas?.getActiveObject() === this.entity) {
        return;
      }
      this.entity.canvas?.requestRenderAll();
    });

    this.entity.on("mouseout", () => {
      this.entity.hoverCursor = "default";
      this.entity.canvas?.requestRenderAll();
    });

    // 设置控制点样式和边框大小
    // 设置选中时的控制点和边框样式
    // 问题：边框宽度(strokeWidth)会影响对象的实际尺寸计算
    // 解决方案：
    // 1. 使用strokeUniform=true确保边框宽度不随缩放变化
    // 2. 在选中状态下使用borderDashArray创建虚线边框，减少视觉干扰
    // 3. 可以考虑在mouseout时将strokeWidth设为0而不是undefined
    // 4. 对于精确定位，可以在获取对象尺寸时手动减去边框宽度的影响
    this.entity.set({
      transparentCorners: true,
      cornerColor: '#00a8ff',
      cornerStrokeColor: '#00a8ff',
      borderColor: '#00a8ff',
      borderScaleFactor: 2, // 设置边框大小/粗细
      cornerSize: 10, // 设置控制点大小
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
