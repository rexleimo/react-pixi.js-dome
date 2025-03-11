import {useEffect, useRef} from "react";
import {PolloCanvas} from "@/packages/pixi-canvas";

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
                }, 10)
            }, 1000)
        }
    }, []);

    return (
        <div ref={containerRef}></div>
    );
}
