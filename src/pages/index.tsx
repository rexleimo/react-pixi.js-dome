import { useEffect, useRef } from "react";
export default function Home() {

    const containerRef = useRef<HTMLDivElement>(null);
  

    

    return (
        <div ref={containerRef}></div>
    );
}
