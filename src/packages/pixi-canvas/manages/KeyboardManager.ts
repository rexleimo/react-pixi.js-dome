// 安装 key 的 string 映射枚举
export enum KeyMap {
    SPACE = ' ',
    CONTROL = 'CONTROL',
    META = 'META',
    SHIFT = 'SHIFT',
}

class KeyboardManager {

    static instance: KeyboardManager;
    private keys = new Set<string>()

    static getInstance() {
        if (!KeyboardManager.instance) {
            KeyboardManager.instance = new KeyboardManager();
        }
        return KeyboardManager.instance;
    }

    constructor() {
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp)
    }

    onKeyDown = (e: KeyboardEvent) => {
        const key = e.key.toUpperCase();
        this.keys.add(key);
    }

    onKeyUp = (e: KeyboardEvent) => {
        this.keys.clear();
    }

    getKeys() {
        return this.keys;
    }

}

export default KeyboardManager;