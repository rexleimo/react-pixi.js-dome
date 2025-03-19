import { useEffect, useRef, useState } from "react";
import PolloCanvas from "@/packages/PolloCanvas/Canvas";
import PolloImage from "@/packages/PolloCanvas/objects/Image";
import PolloText from "@/packages/PolloCanvas/objects/text";
import TestData from "@/packages/PolloCanvas/data/pollo.json";

import {
  CanvasProvider,
  DrawManage,
  ICanvas,
  EDrawMode,
  Serialization,
} from "@/packages/PolloCanvas";
import PolloDiffusion, {
  DiffusionGroup,
} from "@/packages/PolloCanvas/objects/diffusion";
import dynamic from "next/dynamic";

const BrushStage = dynamic(
  () => import("@/packages/PolloCanvas/brushs/react/BrushStage"),
  {
    ssr: false,
  }
);

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvas, setCanvas] = useState<ICanvas>();

  useEffect(() => {
    async function init() {
      const canvas = new PolloCanvas(containerRef.current!);
      setCanvas(canvas);

      canvas.init();

      const diffusion = new PolloDiffusion(480, 480);
      await diffusion.setImage("/2.png");
      const entity = diffusion.getEntity() as DiffusionGroup;
      entity.aiInfo = "123";
      canvas.addObject(entity);

      // const image = new PolloImage();
      // await image.setImage("/1.jpg");
      // canvas.addObject(image.getEntity());

      // const text = new PolloText();
      // text.setText("HelloWorld 11123");
      // canvas.addObject(text.getEntity());
    }
    init();
  }, []);

  const handleDrawMode = () => {
    DrawManage.getInstance().setDrawMode(EDrawMode.DRAW);
  };

  const handleSelectMode = () => {
    DrawManage.getInstance().setDrawMode(EDrawMode.SELECT);
  };

  const handleEraserMode = () => {
    DrawManage.getInstance().setDrawMode(EDrawMode.ERASER);
  };

  const handleSerialize = () => {
    const data = Serialization.getInstance().serialize(canvas!);
    console.log(data);
  };

  const handleDeserialize = () => {
    Serialization.getInstance().deserialize(canvas!, TestData);
  };

  return (
    <CanvasProvider canvas={canvas}>
      <div>
        <div>
          <button onClick={handleDrawMode} style={{ marginRight: 10 }}>
            画画模式
          </button>
          <button onClick={handleSelectMode} style={{ marginRight: 10 }}>
            选择模式
          </button>
          <button onClick={handleEraserMode} style={{ marginRight: 10 }}>
            橡皮擦模式
          </button>
          <button onClick={handleSerialize} style={{ marginRight: 10 }}>
            序列化
          </button>
          <button onClick={handleDeserialize} style={{ marginRight: 10 }}>
            反序列化
          </button>
        </div>
        <div
          ref={containerRef}
          style={{ width: "100%", height: "1080px" }}
        ></div>
        <BrushStage />
      </div>
    </CanvasProvider>
  );
}
