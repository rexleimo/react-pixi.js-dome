import { EKeyboard } from "../enums/EKeyboard";
import Undoo, { UndooItem } from "../utils/undoo";
import KeyboardManage from "./KeyboardManage";

class UndoRedoManage {
  static instance: UndoRedoManage;

  static getInstance() {
    if (!this.instance) {
      this.instance = new UndoRedoManage();
    }
    return this.instance;
  }

  private _undoo: Undoo;
  private _keyboard: KeyboardManage;

  constructor() {
    this._undoo = new Undoo();
    this._keyboard = KeyboardManage.getInstance();

    const unDoKeyDown = `${EKeyboard.META}+${EKeyboard.Z}`;
    const redoKeyDown = `${EKeyboard.META}+${EKeyboard.SHIFT}+${EKeyboard.Z}`;

    this._keyboard.on(unDoKeyDown, { keydown: true }, () => {
      this._undoo.undo();
    });

    this._keyboard.on(redoKeyDown, { keydown: true }, () => {
      this._undoo.redo();
    });

  }

  save(item: UndooItem) {
    this._undoo.save(item);
  }
}

export default UndoRedoManage;
