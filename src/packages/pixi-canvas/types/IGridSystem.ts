import * as PIXI from 'pixi.js';
export interface IGridSystem {
    showGrid: () => void;
    hideGrid: () => void;
    getInstance: ()=> PIXI.Container
}