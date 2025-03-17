import { ICanvas } from "../types/ICanvas";

import hotkeys from "hotkeys-js";

type Options = {
  keyup?: boolean;
  keydown?: boolean;
};

class KeyboardManage {
  // 实现单例
  private static instance: KeyboardManage;

  private application!: ICanvas;
  private keyMap: Map<string, (event: KeyboardEvent) => void> = new Map();

  private constructor() {}

  public static getInstance() {
    if (!KeyboardManage.instance) {
      KeyboardManage.instance = new KeyboardManage();
    }
    return KeyboardManage.instance;
  }

  public setApplication(application: ICanvas) {
    this.application = application;
  }

  public on(
    name: string,
    opts: Options,
    callback: (event: KeyboardEvent) => void
  ): void {

    if (this.keyMap.has(`${name}`)) {
      console.warn(`KeyboardManage: ${name} already exists`);
      return;
    }

    this.keyMap.set(name, callback);
    hotkeys(name, opts, callback);
  }
}

export default KeyboardManage;
