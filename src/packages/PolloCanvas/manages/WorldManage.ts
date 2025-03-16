import { ICanvas } from "../types/ICanvas";
import { Canvas, TPointerEventInfo, TPointerEvent } from "fabric";

class WorldManage {

    private canvas: Canvas;
    private isDragging = false;
    private lastPosX  = 0;
    private lastPosY = 0;

    constructor(private application: ICanvas) {
        this.canvas = application.getCanvas();
        this.init();
    }


    public init() {
        this.canvas.on('mouse:down', (opt: TPointerEventInfo<TPointerEvent>) => {
           const evt = opt.e as MouseEvent;
           if (this.canvas.getActiveObject()) {
            return;
           }

           this.isDragging = true;
           this.lastPosX = evt.clientX;
           this.lastPosY = evt.clientY;
           this.canvas.selection = false;
        });

        this.canvas.on('mouse:up', (opt: TPointerEventInfo<TPointerEvent>) => {
            this.isDragging = false;
            this.canvas.selection = true;   
        });

        this.canvas.on('mouse:move', (opt: TPointerEventInfo<TPointerEvent>) => {
            if (!this.isDragging) {
                return;
            }

            const evt = opt.e as MouseEvent;
            const vpt = this.canvas.viewportTransform;
            if (!vpt) {
                return;
            }

            vpt[4] += evt.clientX - this.lastPosX;
            vpt[5] += evt.clientY - this.lastPosY;

            this.lastPosX = evt.clientX;
            this.lastPosY = evt.clientY;
            this.canvas.requestRenderAll();

        });

    }

   
}

export default WorldManage;