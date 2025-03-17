import { Canvas, FabricObject } from "fabric";
import { ICanvas } from "./types/ICanvas";
import WorldManage from "./manages/WorldManage";
import KeyboardManage from "./manages/KeyboardManage";
import UndoRedoManage from "./manages/UndoRedoManage";

class PolloCanvas implements ICanvas {
  private canvas: Canvas;

  constructor(private container: HTMLDivElement) {
    this.container = container;
    const canvasElement = document.createElement("canvas");
    this.container.appendChild(canvasElement);
    this.canvas = new Canvas(canvasElement, {
      preserveObjectStacking: true,
    });
  }

  public init() {
    this.canvas.setDimensions({
      width: this.container.clientWidth,
      height: this.container.clientHeight,
    });

    new WorldManage(this);
    KeyboardManage.getInstance().setApplication(this);
    UndoRedoManage.getInstance();
    this.canvas.renderAll();
  }

  public getCanvas() {
    return this.canvas;
  }

  public addObject(object: FabricObject, isUndo: boolean = true) {
    this.canvas.add(object);

    if (isUndo) {
      UndoRedoManage.getInstance().save({
        undo: () => {
          this.removeObject(object, false);
        },
        redo: () => {
          this.addObject(object, false);
        },
      });
    }
  }

  public removeObject(object: FabricObject, isUndo: boolean = true) {
    this.canvas.remove(object);

    if (isUndo) {
      UndoRedoManage.getInstance().save({
        undo: () => {
          this.removeObject(object, false);
        },
        redo: () => {
          this.addObject(object, false);
        },
      });
    }
  }
}

export default PolloCanvas;
