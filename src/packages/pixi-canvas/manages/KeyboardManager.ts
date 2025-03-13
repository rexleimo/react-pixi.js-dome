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