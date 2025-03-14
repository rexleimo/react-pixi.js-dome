import { useEffect, useRef } from "react";
import { PolloCanvas } from "@/packages/pixi-canvas";
import Text from "@/packages/pixi-canvas/objects/Text";
import ImageEntity from "@/packages/pixi-canvas/objects/Image";
export default function Home() {

    const containerRef = useRef<HTMLDivElement>(null);
    const appRef = useRef<PolloCanvas | null>(null);

    useEffect(() => {
        if (containerRef.current) {
            appRef.current = new PolloCanvas(containerRef.current);
            setTimeout(() => {
                const image = new ImageEntity(appRef.current!);
                image.setImage("/1.jpg");
                appRef.current?.addChildren(image);

                const text = new Text(appRef.current!);
                text.setText("Hello World");
                text.setPosition(100, 100);

                appRef.current?.addChildren(text);
            }, 0)
        }
    }, []);

    return (
        <div ref={containerRef}></div>
    );
}
