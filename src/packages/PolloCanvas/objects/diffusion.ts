import {
  Group,
  GroupProps,
  SerializedGroupProps,
  TClassProperties,
  classRegistry,
  Text,
  FabricObject,
  Point,
} from "fabric";
import AbstractObject from "../abstracts/AbstractObject";
import PolloImage from "./Image";
import Border from "./border";
import Controls from "./controls";

export class DiffusionGroup extends Group {
  static type: string = "DiffusionGroup";
  // 自定义字段
  aiInfo: string = "";
  constructor() {
    super();
  }

  toObject<
    T extends Omit<
      GroupProps & TClassProperties<this>,
      keyof SerializedGroupProps
    >,
    K extends keyof T = never
  >(propertiesToInclude?: K[] | undefined): Pick<T, K> & SerializedGroupProps {
    return {
      ...super.toObject(propertiesToInclude),
      aiInfo: this.aiInfo,
    };
  }
}

classRegistry.setClass(DiffusionGroup);

class PolloDiffusion extends AbstractObject {
  entity!: DiffusionGroup;
  buttons: Text[] = [];
  border: Border;

  width: number = 768;
  height: number = 1024;
  controls: Controls;
  isSelected: boolean = false;
  groups: FabricObject[] = [];

  // 记录鼠标上一次的位置
  lastMousePoint: Point = new Point(0, 0);
  lastRect: {
    left: number;
    top: number;
    width: number;
    height: number;
    scaleX: number;
    scaleY: number;
  } = {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    scaleX: 1,
    scaleY: 1,
  };

  isResizing: boolean = false;

  private createButton(text: string, left: number, top: number) {
    const button = new Text(text, {
      left,
      top,
      fontSize: 14,
      fill: "#333",
      backgroundColor: "#fff",
      padding: 8,
      selectable: false,
      hoverCursor: "pointer",
    });
    this.buttons.push(button);
    return button;
  }

  private initButtons() {
    const regenerateBtn = this.createButton("重新生成", 10, 10);
    const variationBtn = this.createButton("变体", 90, 10);
    const upscaleBtn = this.createButton("放大", 150, 10);
    // Add event listeners to buttons
    regenerateBtn.on("mousedown", () => {
      console.log("Regenerate button clicked");
      // Add your regeneration logic here
    });

    variationBtn.on("mousedown", () => {
      console.log("Variation button clicked");
      // Add your variation logic here
    });

    upscaleBtn.on("mousedown", () => {
      console.log("Upscale button clicked");
      // Add your upscale logic here
    });

    // Make sure buttons are interactive
    this.buttons.forEach((btn) => {
      btn.set({
        evented: true,
        selectable: false,
        hoverCursor: "pointer",
        visible: true,
      });
    });
  }

  constructor(width: number, height: number) {
    super();
    this.width = width;
    this.height = height;

    this.entity = new Group([], {
      width: this.width,
      height: this.height,
      subTargetCheck: true,
      hasControls: false,
      hasBorders: false,
    }) as DiffusionGroup;

    this.initButtons();
    this.border = new Border(this.width, this.height);
    this.controls = new Controls(this.width, this.height);
    this.groups.push(this.border.getEntity());

    this.entity.on("mouseover", () => {
      console.log("mouseover");
      // 设置visible属性后需要确保父Group也能显示子对象
      this.border.getEntity().visible = true;
      this.entity.dirty = true;
      this.entity.canvas?.requestRenderAll();
    });

    this.entity.on("mouseout", () => {
      if (!this.isSelected) {
        this.border.getEntity().visible = false;
        this.entity.dirty = true;
        this.entity.canvas?.requestRenderAll();
      }
    });

    this.entity.on("selected", () => {
      this.isSelected = true;
      this.controls.getControls().forEach((control) => {
        control.visible = true;
      });
      this.entity.dirty = true;
      this.entity.canvas?.requestRenderAll();
    });

    this.entity.on("deselected", () => {
      this.isSelected = false;
      this.border.getEntity().visible = false;
      this.controls.getControls().forEach((control) => {
        control.visible = false;
      });
      this.entity.dirty = true;
      this.entity.canvas?.requestRenderAll();
    });

    this.controls.events.on("mousedown", (point) => {
      this.isResizing = true;
      this.entity.set({
        lockMovementX: true,
        lockMovementY: true,
      });
      this.lastRect = {
        left: this.entity.left,
        top: this.entity.top,
        width: this.entity.width,
        height: this.entity.height,
        scaleX: this.entity.scaleX,
        scaleY: this.entity.scaleY,
      };
      this.lastMousePoint = point;
    });

    this.controls.events.on("mousemove", (point, name) => {
      if (!this.isResizing) return;

      const deltaX = point.x - this.lastMousePoint.x;
      const deltaY = point.y - this.lastMousePoint.y;

      let newWidth, newHeight, scaleChange;

      // 根据控制点位置计算新的尺寸和位置
      switch (name) {
        case "topLeft":
          // 计算鼠标移动后的新尺寸
          newWidth = this.lastRect.width - deltaX;
          newHeight = this.lastRect.height - deltaY;

          // 计算宽高变化比例
          const widthRatio = newWidth / this.lastRect.width;
          const heightRatio = newHeight / this.lastRect.height;

          // 使用鼠标主导方向的比例进行等比例缩放
          scaleChange =
            Math.abs(deltaX) > Math.abs(deltaY) ? widthRatio : heightRatio;

          newWidth = this.lastRect.width * scaleChange;
          newHeight = this.lastRect.height * scaleChange;

          // 计算右下角坐标
          const rightBottom = {
            x: this.lastRect.left + this.lastRect.width,
            y: this.lastRect.top + this.lastRect.height,
          };

          // 更新位置，保持右下角固定
          this.entity.set({
            left: rightBottom.x - newWidth,
            top: rightBottom.y - newHeight,
            scaleX: this.lastRect.scaleX * scaleChange,
            scaleY: this.lastRect.scaleY * scaleChange,
          });
          break;

        case "topRight":
          // 计算鼠标移动后的新尺寸
          newWidth = this.lastRect.width + deltaX;
          newHeight = this.lastRect.height - deltaY;

          // 计算宽高变化比例
          const widthRatioTR = newWidth / this.lastRect.width;
          const heightRatioTR = newHeight / this.lastRect.height;

          // 使用鼠标主导方向的比例进行等比例缩放
          scaleChange =
            Math.abs(deltaX) > Math.abs(deltaY) ? widthRatioTR : heightRatioTR;

          newWidth = this.lastRect.width * scaleChange;
          newHeight = this.lastRect.height * scaleChange;

          // 计算左下角坐标
          const leftBottom = {
            x: this.lastRect.left,
            y: this.lastRect.top + this.lastRect.height,
          };

          // 更新位置，保持左下角固定
          this.entity.set({
            left: leftBottom.x,
            top: leftBottom.y - newHeight,
            scaleX: this.lastRect.scaleX * scaleChange,
            scaleY: this.lastRect.scaleY * scaleChange,
          });
          break;

        case "bottomLeft":
          // 计算鼠标移动后的新尺寸
          newWidth = this.lastRect.width - deltaX;
          newHeight = this.lastRect.height + deltaY;

          // 计算宽高变化比例
          const widthRatioBL = newWidth / this.lastRect.width;
          const heightRatioBL = newHeight / this.lastRect.height;

          // 使用鼠标主导方向的比例进行等比例缩放
          scaleChange =
            Math.abs(deltaX) > Math.abs(deltaY) ? widthRatioBL : heightRatioBL;

          newWidth = this.lastRect.width * scaleChange;
          newHeight = this.lastRect.height * scaleChange;

          // 计算右上角坐标
          const rightTop = {
            x: this.lastRect.left + this.lastRect.width,
            y: this.lastRect.top,
          };

          // 更新位置，保持右上角固定
          this.entity.set({
            left: rightTop.x - newWidth,
            top: rightTop.y,
            scaleX: this.lastRect.scaleX * scaleChange,
            scaleY: this.lastRect.scaleY * scaleChange,
          });
          break;

        case "bottomRight":
          // 计算鼠标移动后的新尺寸
          newWidth = this.lastRect.width + deltaX;
          newHeight = this.lastRect.height + deltaY;

          // 计算宽高变化比例
          const widthRatioBR = newWidth / this.lastRect.width;
          const heightRatioBR = newHeight / this.lastRect.height;

          // 使用鼠标主导方向的比例进行等比例缩放
          scaleChange =
            Math.abs(deltaX) > Math.abs(deltaY) ? widthRatioBR : heightRatioBR;

          newWidth = this.lastRect.width * scaleChange;
          newHeight = this.lastRect.height * scaleChange;

          // 更新位置，左上角固定，不需要调整位置
          this.entity.set({
            scaleX: this.lastRect.scaleX * scaleChange,
            scaleY: this.lastRect.scaleY * scaleChange,
          });
          break;
      }

      this.entity.dirty = true;
      this.entity.canvas?.requestRenderAll();
    });

    this.controls.events.on("mouseup", (point) => {
      this.isResizing = false;
      this.entity.set({
        lockMovementX: false,
        lockMovementY: false,
      });

      this.entity.dirty = true;
      this.entity.canvas?.requestRenderAll();
    });
  }

  public async setImage(src: string) {
    const image = new PolloImage();
    await image.setImage(src);
    const img = image.getEntity();
    this.groups.push(img);
  }

  public getEntity() {
    this.entity.add(...this.groups);
    this.entity.add(...this.buttons);
    this.entity.add(...this.controls.getControls());
    this.entity.moveObjectTo(this.groups[1], 0);

    return this.entity;
  }
}

export default PolloDiffusion;
