import { Group, Rect, TPointerEvent, TPointerEventInfo } from "fabric";
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
      this.events.emit("mousedown", evt.scenePoint, this.currentName);
    });

    rect.on("mousemove", (e) => {
      const evt = e as TPointerEventInfo<TPointerEvent>;
      this.events.emit("mousemove", evt.scenePoint, this.currentName);
    });

    document.body.addEventListener("mouseup", (e) => {
      this.events.emit("mouseup");
    });

    return rect;
  }
}

export default Controls;
