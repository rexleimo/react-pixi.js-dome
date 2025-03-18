import { FabricObject, Canvas } from "fabric";

export interface ICanvas {
    init(): void;
    addObject(object: FabricObject, isUndo: boolean): void;
    getCanvas(): Canvas;
    toJSON(): any;
}

    
