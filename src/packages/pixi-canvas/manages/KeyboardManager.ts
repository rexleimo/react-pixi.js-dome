// 安装 key 的 string 映射枚举
export enum KeyMap {
    SPACE = ' ',
    CONTROL = 'CONTROL',
    META = 'META',
    SHIFT = 'SHIFT',
}

class KeyboardManager {

    static instance: KeyboardManager;
    private keys = new Set<string>();

    private observers: ((keys: Set<string>) => void)[] = [];

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

        const keySetSize = this.keys.size;
        if(keySetSize === 1 && this.keys.has(KeyMap.SPACE)) {
            document.body.style.cursor = 'grabbing';
        }

        this.emit();
    }

    onKeyUp = (e: KeyboardEvent) => {
        const key = e.key.toUpperCase();

        const keySetSize = this.keys.size;
        if(keySetSize === 1 && this.keys.has(key)) {
            document.body.style.cursor = 'default';
        }
        
        this.keys.delete(key);
        this.emit();
    }

    addObserver(observer: (keys: Set<string>) => void) {
        this.observers.push(observer);
    }

    removeObserver(observer: (keys: Set<string>) => void) {
        this.observers = this.observers.filter(o => o !== observer);
    }

    emit() {
        this.observers.forEach(observer => observer(this.keys));
    }

    getKeys() {
        return this.keys;
    }

}

export default KeyboardManager;