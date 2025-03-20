import { Layer, Text, Rect, Transformer } from "react-konva";
import { useRef } from "react";
import Konva from "konva";
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

  const trRef = useRef<Konva.Transformer>(null);

  return (
    <Layer x={x} y={y} scaleX={scaleX} scaleY={scaleY}>
      <Text text="Hello World" />
      <Rect x={100} y={60} width={100} height={100} fill="red" onClick={(e)=>{
        e.target.toObject()
        console.log(e.target.toObject());
        trRef.current?.nodes([e.target]);
      }} />
      <Transformer ref={trRef} />
    </Layer>
  );
}

export default WordCanvas;
