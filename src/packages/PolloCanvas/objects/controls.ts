import { Group, Point, Rect, TPointerEvent, TPointerEventInfo } from "fabric";
import { createNanoEvents } from "nanoevents";

class Controls {
  width: number;
  height: number;

  // 控制点的大小
  cornerSize: number = 20;
  // 控制点的颜色
  cornerColor: string = "#00a8ff";
  // 控制点的边框颜色
  cornerStrokeColor: string = "#00a8ff";
  // 边框颜色
  borderColor: string = "#00a8ff";

  topLeftControl: Group;
  bottomLeftControl: Group;
  topRightControl: Group;
  bottomRightControl: Group;

  controls: Group[] = [];
  offset: number = 10;
  events = createNanoEvents();

  currentName: string | null = null;
  parent: Group | null = null;
  isResizing: boolean = false;

  lastRect: {
    left: number;
    top: number;
    width: number;
    height: number;
    scaleX: number;
    scaleY: number;
  } | null = null;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;

    this.topLeftControl = this.createControl(
      0 - this.offset,
      0 - this.offset,
      "nwse-resize",
      "topLeft"
    );
    this.bottomLeftControl = this.createControl(
      this.height - this.cornerSize + this.offset,
      0 - this.offset,
      "nesw-resize",
      "bottomLeft"
    );
    this.topRightControl = this.createControl(
      0 - this.offset,
      this.width - this.cornerSize + this.offset,
      "nesw-resize",
      "topRight"
    );
    this.bottomRightControl = this.createControl(
      this.height - this.cornerSize + this.offset,
      this.width - this.cornerSize + this.offset,
      "nwse-resize",
      "bottomRight"
    );
    this.controls.push(
      this.topLeftControl,
      this.bottomLeftControl,
      this.topRightControl,
      this.bottomRightControl
    );
  }

  public bindParent(parent: Group) {
    this.parent = parent;
  }

  public getControls() {
    return this.controls;
  }

  public createControl(
    top: number,
    left: number,
    hoverCursor: string = "nwse-resize",
    name: string
  ) {
    const a = new Rect({
      width: this.cornerSize,
      height: this.cornerSize,
      fill: this.cornerColor,
      stroke: this.cornerStrokeColor,
    });

    const b = new Rect({
      width: this.cornerSize - 5,
      height: this.cornerSize - 5,
      fill: "#FFF",
      stroke: this.cornerStrokeColor,
      top: 2.5,
      left: 2.5,
    });

    const rect = new Group([a, b], {
      top: top,
      left: left,
      visible: false,
      hoverCursor: hoverCursor,
      name: name,
    } as any);

    rect.on("mousedown", (e) => {
      const evt = e as TPointerEventInfo<TPointerEvent>;
      evt.e.stopPropagation();
      this.currentName = name;
      this.isResizing = true;
      this.lastRect = {
        left: this.parent?.left || 0,
        top: this.parent?.top || 0,
        width: this.parent?.width || 0,
        height: this.parent?.height || 0,
        scaleX: this.parent?.scaleX || 1,
        scaleY: this.parent?.scaleY || 1,
      };
      this.parent?.set({
        lockMovementX: true,
        lockMovementY: true,
      });
      this.events.emit("mousedown", evt.scenePoint, this.currentName);
    });

    rect.on("mousemove", (e) => {
      const evt = e as TPointerEventInfo<TPointerEvent>;
      this.bindEvents(evt.scenePoint);
      this.events.emit("mousemove", evt.scenePoint, this.currentName);
    });

    document.body.addEventListener("mouseup", (e) => {
      this.isResizing = false;
      this.parent?.set({
        lockMovementX: false,
        lockMovementY: false,
      });
      this.events.emit("mouseup");
    });

    return rect;
  }

  public bindEvents(point: Point) {
    if (this.currentName === "bottomRight") {
      this.bottomRight(point);
    }
  }

  bottomRight(point: Point) {
    if (!this.parent || !this.isResizing || !this.lastRect) return;

    const deltaX = point.x - this.lastRect.left;
    const deltaY = point.y - this.lastRect.top;

    console.log(deltaX,deltaY)

    const scaleChange =
      Math.abs(deltaX) > Math.abs(deltaY)
        ? deltaX / this.lastRect.width
        : deltaY / this.lastRect.height;

    this.parent.set({
      top: this.lastRect.top,
      left: this.lastRect.left,
      scaleX: this.lastRect.scaleX * scaleChange,
      scaleY: this.lastRect.scaleY * scaleChange,
    });

    this.parent.dirty = true;
    this.parent.canvas?.requestRenderAll();
  }
}

export default Controls;

// this.controls.events.on("mousedown", (point) => {
//   this.isResizing = true;
//   this.entity.set({
//     lockMovementX: true,
//     lockMovementY: true,
//   });
//   this.lastRect = {
//     left: this.entity.left,
//     top: this.entity.top,
//     width: this.entity.width,
//     height: this.entity.height,
//     scaleX: this.entity.scaleX,
//     scaleY: this.entity.scaleY,
//   };
//   this.lastMousePoint = point;
// });

// this.controls.events.on("mousemove", (point, name) => {
//   if (!this.isResizing) return;

//   const deltaX = point.x - this.lastMousePoint.x;
//   const deltaY = point.y - this.lastMousePoint.y;

//   let newWidth, newHeight, scaleChange;

//   // 根据控制点位置计算新的尺寸和位置
//   switch (name) {
//     case "topLeft":
//       // 计算鼠标移动后的新尺寸
//       newWidth = this.lastRect.width - deltaX;
//       newHeight = this.lastRect.height - deltaY;

//       // 计算宽高变化比例
//       const widthRatio = newWidth / this.lastRect.width;
//       const heightRatio = newHeight / this.lastRect.height;

//       // 使用鼠标主导方向的比例进行等比例缩放
//       scaleChange =
//         Math.abs(deltaX) > Math.abs(deltaY) ? widthRatio : heightRatio;

//       newWidth = this.lastRect.width * scaleChange;
//       newHeight = this.lastRect.height * scaleChange;

//       // 计算右下角坐标
//       const rightBottom = {
//         x: this.lastRect.left + this.lastRect.width,
//         y: this.lastRect.top + this.lastRect.height,
//       };

//       // 更新位置，保持右下角固定
//       this.entity.set({
//         left: rightBottom.x - newWidth,
//         top: rightBottom.y - newHeight,
//         scaleX: this.lastRect.scaleX * scaleChange,
//         scaleY: this.lastRect.scaleY * scaleChange,
//       });
//       break;

//     case "topRight":
//       // 计算鼠标移动后的新尺寸
//       newWidth = this.lastRect.width + deltaX;
//       newHeight = this.lastRect.height - deltaY;

//       // 计算宽高变化比例
//       const widthRatioTR = newWidth / this.lastRect.width;
//       const heightRatioTR = newHeight / this.lastRect.height;

//       // 使用鼠标主导方向的比例进行等比例缩放
//       scaleChange =
//         Math.abs(deltaX) > Math.abs(deltaY) ? widthRatioTR : heightRatioTR;

//       newWidth = this.lastRect.width * scaleChange;
//       newHeight = this.lastRect.height * scaleChange;

//       // 计算左下角坐标
//       const leftBottom = {
//         x: this.lastRect.left,
//         y: this.lastRect.top + this.lastRect.height,
//       };

//       // 更新位置，保持左下角固定
//       this.entity.set({
//         left: leftBottom.x,
//         top: leftBottom.y - newHeight,
//         scaleX: this.lastRect.scaleX * scaleChange,
//         scaleY: this.lastRect.scaleY * scaleChange,
//       });
//       break;

//     case "bottomLeft":
//       // 计算鼠标移动后的新尺寸
//       newWidth = this.lastRect.width - deltaX;
//       newHeight = this.lastRect.height + deltaY;

//       // 计算宽高变化比例
//       const widthRatioBL = newWidth / this.lastRect.width;
//       const heightRatioBL = newHeight / this.lastRect.height;

//       // 使用鼠标主导方向的比例进行等比例缩放
//       scaleChange =
//         Math.abs(deltaX) > Math.abs(deltaY) ? widthRatioBL : heightRatioBL;

//       newWidth = this.lastRect.width * scaleChange;
//       newHeight = this.lastRect.height * scaleChange;

//       // 计算右上角坐标
//       const rightTop = {
//         x: this.lastRect.left + this.lastRect.width,
//         y: this.lastRect.top,
//       };

//       // 更新位置，保持右上角固定
//       this.entity.set({
//         left: rightTop.x - newWidth,
//         top: rightTop.y,
//         scaleX: this.lastRect.scaleX * scaleChange,
//         scaleY: this.lastRect.scaleY * scaleChange,
//       });
//       break;

//     case "bottomRight":
//       // 计算鼠标移动后的新尺寸
//       newWidth = this.lastRect.width + deltaX;
//       newHeight = this.lastRect.height + deltaY;

//       // 计算宽高变化比例
//       const widthRatioBR = newWidth / this.lastRect.width;
//       const heightRatioBR = newHeight / this.lastRect.height;

//       // 使用鼠标主导方向的比例进行等比例缩放
//       scaleChange =
//         Math.abs(deltaX) > Math.abs(deltaY) ? widthRatioBR : heightRatioBR;

//       newWidth = this.lastRect.width * scaleChange;
//       newHeight = this.lastRect.height * scaleChange;

//       // 更新位置，左上角固定，不需要调整位置
//       this.entity.set({
//         scaleX: this.lastRect.scaleX * scaleChange,
//         scaleY: this.lastRect.scaleY * scaleChange,
//       });
//       break;
//   }

//   this.entity.dirty = true;
//   this.entity.canvas?.requestRenderAll();
// });

// this.controls.events.on("mouseup", (point) => {
//   this.isResizing = false;
//   this.entity.set({
//     lockMovementX: false,
//     lockMovementY: false,
//   });

//   this.entity.dirty = true;
//   this.entity.canvas?.requestRenderAll();
// });
