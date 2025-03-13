// 定义一个管理绘画模式的管理类
export enum PaintingMode {
    DRAW = 'draw',
    SELECT = 'select',
    TRANSFORM = 'transform',
}

class PaintingModeManager {
    static _instance: PaintingModeManager;

    static getInstance() {
        if (!PaintingModeManager._instance) {
            PaintingModeManager._instance = new PaintingModeManager();
        }
        return PaintingModeManager._instance;
    }

    private _currentMode: PaintingMode = PaintingMode.DRAW;

    constructor() {
        this._currentMode = PaintingMode.DRAW;
    }

    setMode(mode: PaintingMode) {
        this._currentMode = mode;
    }

    getMode() {
        return this._currentMode;
    }
}

export default PaintingModeManager;
