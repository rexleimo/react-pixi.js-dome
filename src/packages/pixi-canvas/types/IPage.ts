import {PixiRenderEnable} from "@/packages/pixi-canvas/types/PixiRenderable";

export interface IPage {
    addChildren: (children: PixiRenderEnable) => void;
    addImage: (url: string) => void;
}