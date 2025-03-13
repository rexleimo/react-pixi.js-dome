import * as PIXI from 'pixi.js';
import World from "@/packages/pixi-canvas/World";
import {IEntity} from "@/packages/pixi-canvas/types/IEntity";
import {PaintingMode} from "@/packages/pixi-canvas/manages/PaintingModeManager";

export interface IPolloCanvas {
    getCamera: () => World;
    getPixiInstances: () => PIXI.Application<PIXI.ICanvas>;
    getRendererTargetSize: () => { width: number, height: number };
    addChildren: (child: IEntity) => void;
    setPaintingMode: (mode: PaintingMode) => void;
}   