import { Rect } from "fabric";

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

  topLeftControl: Rect;
  bottomLeftControl: Rect;
  topRightControl: Rect;
  bottomRightControl: Rect;

  controls: Rect[] = [];

  offset: number = 10;


  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;

    this.topLeftControl = new Rect({
        width: this.cornerSize,
        height: this.cornerSize,
        fill: this.cornerColor,
        stroke: this.cornerStrokeColor,
        top: 0 - this.offset,
        left: 0 - this.offset,
        visible: false,
    });

    this.bottomLeftControl = new Rect({
        width: this.cornerSize,
        height: this.cornerSize,
        fill: this.cornerColor,
        stroke: this.cornerStrokeColor,
        top: this.height - this.cornerSize + this.offset,
        left: 0 - this.offset,
        visible: false,
    });

    this.topRightControl = new Rect({
        width: this.cornerSize,
        height: this.cornerSize,
        fill: this.cornerColor,
        stroke: this.cornerStrokeColor,
        top: 0 - this.offset,
        left: this.width - this.cornerSize + this.offset,
        visible: false,
    });

    this.bottomRightControl = new Rect({
        width: this.cornerSize,
        height: this.cornerSize,
        fill: this.cornerColor,
        stroke: this.cornerStrokeColor,
        top: this.height - this.cornerSize + this.offset,
        left: this.width - this.cornerSize + this.offset,
        visible: false,
    });
    
    this.controls.push(this.topLeftControl, this.bottomLeftControl, this.topRightControl, this.bottomRightControl);

  }

  public getControls() {
    return this.controls;
  }

}


export default Controls;