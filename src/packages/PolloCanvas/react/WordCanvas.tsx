import { Layer, Text, Rect } from "react-konva";

function WordCanvas({
  x,
  y,
  scaleX,
  scaleY,
}: {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
}) {
  return (
    <Layer x={x} y={y} scaleX={scaleX} scaleY={scaleY}>
      <Text text="Hello World" />
      <Rect x={100} y={60} width={100} height={100} fill="red" />
    </Layer>
  );
}

export default WordCanvas;
