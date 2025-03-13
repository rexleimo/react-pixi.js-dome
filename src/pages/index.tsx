import {useEffect, useRef} from "react";
import {PolloCanvas} from "@/packages/pixi-canvas";
import Text from "@/packages/pixi-canvas/objects/Text";
export default function Home() {

    const containerRef = useRef<HTMLDivElement>(null);
    const appRef = useRef<PolloCanvas | null>(null);

    useEffect(() => {
        if (containerRef.current) {
            appRef.current = new PolloCanvas(containerRef.current)
        }
    }, []);

    useEffect(() => {
        if (containerRef.current) {
            setTimeout(() => {
                appRef.current?.addPage();
                setTimeout(() => {
                    appRef.current?._pages?.forEach((page) => {
                        page?.addImage("/1.jpg");
                    })

                    const text = new Text(appRef.current!);
                    text.setText("Hello World");
                    text.setPosition(100, 100);

                    appRef.current?.addChildren(text);


                }, 10)
            }, 1000)
        }
    }, []);

    return (
        <div ref={containerRef}></div>
    );
}
