import {PixiRenderEnable} from "@/packages/pixi-canvas/types/PixiRenderable";

export interface IEntity {
    getEntity: () => PixiRenderEnable;
}