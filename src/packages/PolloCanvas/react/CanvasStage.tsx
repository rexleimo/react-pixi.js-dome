import { Stage } from "react-konva";
import WordCanvas from "./WordCanvas";
import { BrushCanvas } from "../brushs/react";
import { useCallback, useEffect, useRef, useState } from "react";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { EDrawMode } from "../enums/EDrawMode";
import { Vector2d } from "konva/lib/types";
import DrawManage from "../manages/DrawManage";

function CanvasStage() {
  const stageRef = useRef<Konva.Stage>(null);
  const [mousePosition, setMousePosition] = useState<Vector2d>({ x: 0, y: 0 });
  const [mouseType, setMouseType] = useState<"mousedown" | "mousemove" | "mouseup">("mousedown");
  const [drawMode, setDrawMode] = useState<EDrawMode>(DrawManage.getInstance().getDrawMode());
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState<Konva.Vector2d>({ x: 0, y: 0 });

  const handleMouseDown = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    const stage = e.target as Konva.Stage;
    const pos = stage.getStage().getPointerPosition()!;
    setMousePosition(pos);
    setMouseType("mousedown");
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    const stage = e.target as Konva.Stage;
    const pos = stage.getStage().getPointerPosition()!;
    setMousePosition(pos);
    setMouseType("mousemove");
  };

  const handleMouseUp = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    const stage = e.target as Konva.Stage;
    const pos = stage.getStage().getPointerPosition()!;
    setMousePosition(pos);
    setMouseType("mouseup");
  };

  const handleDragMove = useCallback((e: KonvaEventObject<DragEvent>) => {
    e.evt.preventDefault();
    const stage = e.target as Konva.Stage;
    const pos = stage.getStage().getPointerPosition()!;
    setMousePosition(pos);
  }, []);

  const handleWheel = useCallback((e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    
    const scaleBy = 1.1;
    const oldScale = scale;
    
    // 获取鼠标位置相对于stage的坐标
    const pointer = e.target.getStage()?.getPointerPosition() as Vector2d;
    
    // 计算新的缩放值
    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    
    // 限制缩放范围
    const limitedScale = Math.max(0.1, Math.min(newScale, 10));

    // 计算新的位置,以鼠标位置为中心进行缩放
    const newPos = {
      x: pointer.x - (pointer.x - position.x) * (limitedScale / oldScale),
      y: pointer.y - (pointer.y - position.y) * (limitedScale / oldScale),
    };

    setScale(limitedScale);
    setPosition(newPos);
  }, [position.x, position.y, scale]);

  useEffect(() => {
    DrawManage.getInstance().onDrawModeChange((mode) => {
      setDrawMode(mode);
    });
  }, []);

  return (
    <Stage
      className="absolute top-0 left-0 w-full h-full"
      draggable
      width={window.innerWidth}
      height={window.innerHeight}
      ref={stageRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
      onWheel={handleWheel}
      onDragMove={handleDragMove}
    >
      <WordCanvas x={position.x} y={position.y} scaleX={scale} scaleY={scale} />
      <BrushCanvas drawMode={drawMode} mouseType={mouseType} mousePosition={mousePosition} />
    </Stage>
  );
}

export default CanvasStage;
