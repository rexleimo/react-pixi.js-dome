import PolloCanvas from "./Canvas";
import DrawManage from "./manages/DrawManage";
import KeyboardManage from "./manages/KeyboardManage";
import UndoRedoManage from "./manages/UndoRedoManage";
import { CanvasProvider, useCanvas } from "./react";
import Serialization from "./manages/Serialization";

export type { ICanvas } from "./types/ICanvas";
export {EDrawMode} from './enums/EDrawMode';

export { PolloCanvas, DrawManage, KeyboardManage, UndoRedoManage, CanvasProvider, useCanvas, Serialization };
