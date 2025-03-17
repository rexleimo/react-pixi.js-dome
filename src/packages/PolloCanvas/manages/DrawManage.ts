import { createNanoEvents } from "nanoevents";
import { DrawModeEvent, EDrawMode } from "../enums/EDrawMode";

class DrawManage {
  static _instance: DrawManage;

  static getInstance() {
    if (!this._instance) {
      this._instance = new DrawManage();
    }
    return this._instance;
  }

  private drawMode: EDrawMode = EDrawMode.SELECT;

  private listenerDrawMode = createNanoEvents();

  constructor() {}

  public setDrawMode(drawMode: EDrawMode) {
    this.drawMode = drawMode;
    this.listenerDrawMode.emit(DrawModeEvent.CHANGE, this.drawMode);
  }

  public getDrawMode() {
    return this.drawMode;
  }

  public isDrawMode() {
    return this.drawMode === EDrawMode.DRAW;
  }

  public isSelectMode() {
    return this.drawMode === EDrawMode.SELECT;
  }

  public onDrawModeChange(callback: (mode: EDrawMode) => void) {
    return this.listenerDrawMode.on(DrawModeEvent.CHANGE, callback);
  }
}

export default DrawManage;
