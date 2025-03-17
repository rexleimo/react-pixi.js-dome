import PolloCanvas from "./Canvas";
import DrawManage from "./manages/DrawManage";
import KeyboardManage from "./manages/KeyboardManage";
import UndoRedoManage from "./manages/UndoRedoManage";
import { CanvasProvider, useCanvas } from "./react";

export type { ICanvas } from "./types/ICanvas";
export {EDrawMode} from './enums/EDrawMode';

export { PolloCanvas, DrawManage, KeyboardManage, UndoRedoManage, CanvasProvider, useCanvas };
