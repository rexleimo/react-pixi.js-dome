import { ICanvas } from "../types/ICanvas";
import UndoRedoManage from "./UndoRedoManage";
import { cloneDeep } from "lodash-es";

class FabricStateTracker {
  private static instance: FabricStateTracker;
  private application!: ICanvas;

  private lastState: {
    left?: number;
    top?: number;
    width?: number;
    height?: number;
    scaleX?: number;
    scaleY?: number;
    angle?: number;
  } = {};

  private constructor() {}

  public static getInstance(): FabricStateTracker {
    if (!FabricStateTracker.instance) {
      FabricStateTracker.instance = new FabricStateTracker();
    }
    return FabricStateTracker.instance;
  }

  setApplication(application: ICanvas) {
    this.application = application;
    return this;
  }

  init() {
    this.application.getCanvas().on("selection:created", (options) => {
      console.log("selection:created");
      const selectedObject = options.selected[0];
      console.log(selectedObject);
      this.lastState = {
        left: selectedObject.left,
        top: selectedObject.top,
        width: selectedObject.width,
        height: selectedObject.height,
        scaleX: selectedObject.scaleX,
        scaleY: selectedObject.scaleY,
        angle: selectedObject.angle,
      };
    });

    this.application.getCanvas().on("object:modified", (options) => {
      const modifiedObject = options.target;
      const { left, top, width, height, scaleX, scaleY, angle } =
        modifiedObject;
      const lastState = cloneDeep(this.lastState);

      UndoRedoManage.getInstance().save({
        undo: () => {
          modifiedObject.left = lastState.left!;
          modifiedObject.top = lastState.top!;
          modifiedObject.width = lastState.width!;
          modifiedObject.height = lastState.height!;
          modifiedObject.scaleX = lastState.scaleX!;
          modifiedObject.scaleY = lastState.scaleY!;
          modifiedObject.angle = lastState.angle!;
          modifiedObject.setCoords();
          this.application.getCanvas().renderAll();
        },
        redo: () => {
          modifiedObject.left = left;
          modifiedObject.top = top;
          modifiedObject.width = width;
          modifiedObject.height = height;
          modifiedObject.scaleX = scaleX;
          modifiedObject.scaleY = scaleY;
          modifiedObject.angle = angle;
          modifiedObject.setCoords();
          this.application.getCanvas().renderAll();
        },
      });
      // 更新lastState以便下一次修改
      this.lastState = {
        left,
        top,
        width,
        height,
        scaleX,
        scaleY,
        angle,
      };
    });
  }
}

export default FabricStateTracker;
