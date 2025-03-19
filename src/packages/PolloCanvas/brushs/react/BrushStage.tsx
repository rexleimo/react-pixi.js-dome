import { KonvaEventObject } from "konva/lib/Node";
import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Line } from "react-konva";
import DrawManage from "../../manages/DrawManage";
import { EDrawMode } from "../../enums/EDrawMode";
import BrushManage from "../../manages/BrushManage";
import Konva from "konva";
import { useCanvas } from "../../react";
import PolloImage from "../../objects/Image";

interface Line {
  tool: string;
  points: number[];
}

const BrushStage = () => {
  const [tool, setTool] = useState<EDrawMode>(
    BrushManage.getInstance().getDrawManage().getDrawMode()
  );
  const [lines, setLines] = useState<Line[]>([]);
  const lineRef = useRef<Line[]>([]);
  const isDrawing = useRef(false);

  const [isShow, setIsShow] = useState(false);
  const brushStageRef = useRef<Konva.Stage>(null);
  const { canvas } = useCanvas();

  useEffect(() => {
   
    DrawManage.getInstance().onDrawModeChange(async (mode) => {
      if (mode === EDrawMode.DRAW || mode === EDrawMode.ERASER) {
        setIsShow(true);
      } else {
        setIsShow(false);

        // 将画布上的所有lines绘制一张图片
        const stage = brushStageRef.current;
        if (!stage) {
          return;
        }

        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        lineRef.current.forEach((line) => {
          for (let i = 0; i < line.points.length; i += 2) {
            const x = line.points[i];
            const y = line.points[i + 1];

            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
          }
        });

        const padding = 10;
        minX = Math.max(0, minX - padding);
        minY = Math.max(0, minY - padding);
        maxX = Math.min(stage.width(), maxX + padding);
        maxY = Math.min(stage.height(), maxY + padding);

        // 计算裁剪区域的宽度和高度
        const width = maxX - minX;
        const height = maxY - minY;

        // 确保有内容可导出
        if (
          width <= 0 ||
          height <= 0 ||
          !isFinite(width) ||
          !isFinite(height)
        ) {
          console.log("没有有效的线条内容可导出");
          return;
        }

        // 获取仅包含线条区域的图片
        const image = stage.toDataURL({
          x: minX,
          y: minY,
          width: width,
          height: height,
        });

        const imageEntity = new PolloImage();
        await imageEntity.setImage(image);
        canvas?.addObject(imageEntity.getEntity(), true);
        setLines([]);
        return;
      }

      setTool(mode);
    });
  }, []);

  useEffect(() => {
    lineRef.current = lines;
  }, [lines]);

  const handleMouseDown = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    isDrawing.current = true;
    const stage = e.target as any;
    const pos = stage.getStage().getPointerPosition();
    setLines([...lines, { tool, points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target as any;
    const point = stage.getStage().getPointerPosition();

    // To draw line
    let lastLine = lines[lines.length - 1];
    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  return (
    isShow && (
      <div className="absolute inset-0 top-40 left-0">
        <Stage
          ref={brushStageRef}
          width={window.innerWidth}
          height={window.innerHeight}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
        >
          <Layer>
            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke="black"
                strokeWidth={2}
                globalCompositeOperation={
                  line.tool === EDrawMode.DRAW
                    ? "source-over"
                    : "destination-out"
                }
                tension={0.5}
                lineCap="round"
                lineJoin="round"
              />
            ))}
          </Layer>
        </Stage>
      </div>
    )
  );
};

export default BrushStage;
