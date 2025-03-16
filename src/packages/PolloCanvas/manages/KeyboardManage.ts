import { EKeyboard } from "../enums/EKeyboard";
import { ICanvas } from "../types/ICanvas";



class KeyboardManage {

    // 实现单例
    private static instance: KeyboardManage;
    private application!: ICanvas;

    // 拥有记录键盘按钮的Set
    private keySet: Set<string> = new Set();


    private constructor() {
        this.init();
    }

    public static getInstance() {
        if (!KeyboardManage.instance) {
            KeyboardManage.instance = new KeyboardManage();
        }
        return KeyboardManage.instance;
    }

    public setApplication(application: ICanvas) {
        this.application = application;
    }

    public init() {
        document.addEventListener('keydown', (evt: KeyboardEvent) => {
            const key = evt.key.toLowerCase();
            this.keySet.add(key);
        });

        document.addEventListener('keyup', (evt: KeyboardEvent) => {
            const key = evt.key.toLowerCase();
            this.keySet.delete(key);
        });
    }

    public isKeyDown(key: string) {
        return this.keySet.has(key.toLowerCase());
    }

}

export default KeyboardManage;

