import { Layer, Text, Rect, Transformer } from "react-konva";
import { useRef } from "react";
import Konva from "konva";

import { EditableText as TextComponent } from "./components";

function WordCanvas({
  x,
  y,
  scaleX,
  scaleY,
  selectedObj,
}: {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  selectedObj: Konva.Node[];
}) {
  const trRef = useRef<Konva.Transformer>(null);

  return (
    <Layer x={x} y={y} scaleX={scaleX} scaleY={scaleY}>
      <Text text="Hello World" />
      <Rect
        draggable={true}
        x={100}
        y={60}
        width={100}
        height={100}
        fill="red"
      />

      <TextComponent
        x={100}
        y={100}
        initialText="Hello World"
        onChange={(text) => {
          console.log(text);
        }}
      />

      <Transformer ref={trRef} enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right"]} nodes={selectedObj} />
    </Layer>
  );
}

export default WordCanvas;
