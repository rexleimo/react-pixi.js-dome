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
      hasControls: true,
      hasBorders: false,
      flipX:false,
      flipY:false,
    }) as DiffusionGroup;

    this.initEntity();

    this.initButtons();
    this.border = new Border(this.width, this.height);
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
      this.entity.dirty = true;
      this.entity.canvas?.requestRenderAll();
    });

    this.entity.on("deselected", () => {
      this.isSelected = false;
      this.border.getEntity().visible = false;
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
    this.entity.moveObjectTo(this.groups[1], 0);

    return this.entity;
  }
}

export default PolloDiffusion;
