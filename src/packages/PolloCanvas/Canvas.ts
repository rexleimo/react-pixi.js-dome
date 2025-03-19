import { Canvas, FabricObject } from "fabric";
import { ICanvas } from "./types/ICanvas";
import WorldManage from "./manages/WorldManage";
import KeyboardManage from "./manages/KeyboardManage";
import UndoRedoManage from "./manages/UndoRedoManage";
import BrushManage from "./manages/BrushManage";
import FabricStateTracker from "./manages/FabricStateTracker";
import { EKeyboard } from "./enums/EKeyboard";

class PolloCanvas implements ICanvas {
  private canvas!: Canvas;
  private selectObjects: FabricObject[] = [];

  constructor(private container: HTMLDivElement) {
    this.container = container;
  }

  public init() {
    const canvasElement = document.createElement("canvas");
    this.container.appendChild(canvasElement);
    this.canvas = new Canvas(canvasElement, {
      preserveObjectStacking: true,
    });

    this.canvas.setDimensions({
      width: this.container.clientWidth,
      height: this.container.clientHeight,
    });
    new WorldManage(this);
    KeyboardManage.getInstance().setApplication(this);
    UndoRedoManage.getInstance();
    BrushManage.getInstance().setApplication(this);
    FabricStateTracker.getInstance().setApplication(this).init();
    this.canvas.renderAll();

    this.canvas.on("selection:created", (e) => {
      console.log("selection:created", e);
      this.selectObjects = e.selected;
    });

    KeyboardManage.getInstance().on(`${EKeyboard.BACKSPACE},${EKeyboard.DELETE}`, { keydown: true }, (e) => {
      console.log("meta", e);
      this.selectObjects.forEach((object) => {
        this.removeObject(object);
      });
    });
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
          this.addObject(object, false);
        },
        redo: () => {
          this.removeObject(object, false);
        },
      });
    }
  }

  toJSON() {
    return this.canvas.toJSON();
  }
}

export default PolloCanvas;
