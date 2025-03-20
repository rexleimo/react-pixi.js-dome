import {
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Layer, Line } from "react-konva";
import { EDrawMode } from "../../enums/EDrawMode";
import { Vector2d } from "konva/lib/types";

interface Line {
  tool: string;
  points: number[];
}

interface BrushCanvasProps {
  drawMode: EDrawMode;
  mouseType: "mousedown" | "mousemove" | "mouseup";
  mousePosition: Vector2d;
}

interface BrushCanvasRef {
  clearLines: () => void;
  getLines: () => Array<{
    points: number[];
  }>;
}

const BrushCanvas = (
  props: BrushCanvasProps,
  ref: ForwardedRef<BrushCanvasRef>
) => {
  const { drawMode, mouseType, mousePosition } = props;

  const [lines, setLines] = useState<Line[]>([]);
  const lineRef = useRef<Line[]>([]);
  const isDrawing = useRef<boolean | null>(null);

  const isShow = drawMode === EDrawMode.DRAW || drawMode === EDrawMode.ERASER;

  useImperativeHandle(ref, () => ({
    clearLines: () => {
      lineRef.current = [];
      setLines([]);
    },
    getLines: () => {
      return lineRef.current;
    },
  }));

  useEffect(() => {
    if (mouseType === "mousedown") {
      setLines([
        ...lineRef.current,
        { tool: drawMode, points: [mousePosition.x, mousePosition.y] },
      ]);
      isDrawing.current = true;
    } else if (mouseType === "mousemove") {
      if (!isDrawing.current) {
        return;
      }
      const lastLine = lineRef.current[lineRef.current.length - 1];
      lastLine.points = lastLine.points.concat([
        mousePosition.x,
        mousePosition.y,
      ]);
      lineRef.current.splice(lineRef.current.length - 1, 1, lastLine);
      setLines(lineRef.current);
    } else if (mouseType === "mouseup") {
      isDrawing.current = false;
    }
  }, [mousePosition, mouseType, drawMode]);

  useEffect(() => {
    lineRef.current = lines;
  }, [lines]);

  return (
    isShow && (
      <Layer>
        {lines.map((line, i) => (
          <Line
            key={i}
            points={line.points}
            stroke="black"
            strokeWidth={2}
            globalCompositeOperation={
              line.tool === EDrawMode.DRAW ? "source-over" : "destination-out"
            }
            tension={0.5}
            lineCap="round"
            lineJoin="round"
          />
        ))}
      </Layer>
    )
  );
};

const BrushCanvasWithRef = forwardRef<BrushCanvasRef, BrushCanvasProps>(
  BrushCanvas
);

BrushCanvasWithRef.displayName = "BrushCanvasWithRef";

export default BrushCanvasWithRef;
