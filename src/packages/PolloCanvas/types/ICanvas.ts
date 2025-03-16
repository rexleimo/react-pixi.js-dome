import { FabricObject, Canvas } from "fabric";

export interface ICanvas {
    init(): void;
    addObject(object: FabricObject): void;
    getCanvas(): Canvas;
}

    
