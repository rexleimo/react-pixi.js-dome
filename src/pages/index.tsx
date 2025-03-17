import { useEffect, useRef } from "react";
import PolloCanvas from "@/packages/PolloCanvas/Canvas";
import PolloImage from "@/packages/PolloCanvas/objects/Image";
import PolloText from "@/packages/PolloCanvas/objects/text";

export default function Home() {

    const containerRef = useRef<HTMLDivElement>(null);
  

    useEffect(() => {
        async function init() {
            const canvas = new PolloCanvas(containerRef.current!);
            canvas.init();
                
            const image = new PolloImage();
            await image.setImage("/1.jpg");
            canvas.addObject(image.getEntity());

            const text = new PolloText();
            text.setText("Hello World");
            canvas.addObject(text.getEntity());
        }
        init();
    }, []);

    return (
        <div ref={containerRef} style={{ width: '100%', height: '100%' }}></div>
    );
}
