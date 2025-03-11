import * as PIXI from 'pixi.js';
import World from "@/packages/pixi-canvas/World";

export interface IPolloCanvas {
    getCamera: () => World;
    getPixiInstances: () => PIXI.Application<PIXI.ICanvas>;
    getRendererTargetSize: () => { width: number, height: number };
}