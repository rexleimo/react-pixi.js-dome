import { ICanvas } from "../types/ICanvas";
import { Canvas, TPointerEventInfo, TPointerEvent, FabricObject } from "fabric";
import KeyboardManage from "./KeyboardManage";
import { EKeyboard } from "../enums/EKeyboard";
class WorldManage {

    private canvas: Canvas;
    private isDragging = false;
    private lastPosX = 0;
    private lastPosY = 0;

    // 最大缩放
    private maxZoom = 10;
    // 最小缩放
    private minZoom = 0.2;

    private keyboardManage: KeyboardManage;
    constructor(private application: ICanvas) {
        this.canvas = application.getCanvas();
        this.keyboardManage = KeyboardManage.getInstance();
        this.init();
    }


    public init() {
        this.canvas.on('mouse:down', (opt: TPointerEventInfo<TPointerEvent>) => {
            if (this.keyboardManage.isKeyDown(EKeyboard.SPACE)) {
                const evt = opt.e as MouseEvent;
                if (this.canvas.getActiveObject()) {
                    return;
                }

                this.isDragging = true;
                this.lastPosX = evt.clientX;
                this.lastPosY = evt.clientY;
            }

        });

        this.canvas.on('mouse:up', (opt: TPointerEventInfo<TPointerEvent>) => {
            this.isDragging = false;

            if (this.keyboardManage.isKeyDown(EKeyboard.SPACE)) {
                const lowerCanvasEl = this.canvas.upperCanvasEl;
                lowerCanvasEl.style.cursor = 'grab'
            } else {
                const lowerCanvasEl = this.canvas.upperCanvasEl;
                lowerCanvasEl.style.cursor = 'default';
            }

            this.canvas.requestRenderAll();
        });


        this.canvas.on('mouse:move', (opt: TPointerEventInfo<TPointerEvent>) => {
            if (!this.isDragging) {

                if (this.keyboardManage.isKeyDown(EKeyboard.SPACE)) {
                    const lowerCanvasEl = this.canvas.upperCanvasEl;
                    lowerCanvasEl.style.cursor = 'grab';
                }

                return;
            }

            this.canvas.selection = false;
            const lowerCanvasEl = this.canvas.upperCanvasEl;
            lowerCanvasEl.style.cursor = 'grabbing';

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

        // 添加放大缩小
        this.canvas.on('mouse:wheel', (opt: TPointerEventInfo<TPointerEvent>) => {
            const evt = opt.e as WheelEvent;
            evt.preventDefault();
            evt.stopPropagation();
            
            // 获取当前缩放级别和鼠标位置
            const currentZoom = this.canvas.getZoom();
            const point = this.canvas.getPointer(evt, true); // true 参数获取绝对坐标
            
            // 计算新的缩放级别
            const delta = evt.deltaY;
            const zoomDelta = delta < 0 ? 0.1 : -0.1;
            let newZoom = currentZoom + zoomDelta;
            
            // 限制缩放范围
            if (newZoom > this.maxZoom) {
                newZoom = this.maxZoom;
            } else if (newZoom < this.minZoom) {
                newZoom = this.minZoom;
            }
            
            // 如果缩放没有变化，就不执行后续操作
            if (newZoom === currentZoom) return;
            
            // 计算缩放前后的画布点位置差异
            const zoomRatio = newZoom / currentZoom;
            
            // 获取画布视口信息
            const vpt = this.canvas.viewportTransform;
            if (!vpt) return;
            
            // 计算新的视口变换
            // 保持鼠标指针下的点在缩放前后位置不变
            const newVptX = point.x - (point.x - vpt[4]) * zoomRatio;
            const newVptY = point.y - (point.y - vpt[5]) * zoomRatio;
            
            // 应用新的缩放和平移
            this.canvas.setZoom(newZoom);
            this.canvas.setViewportTransform([
                newZoom, 0, 0, newZoom, newVptX, newVptY
            ]);
            
            this.canvas.requestRenderAll();
        });


        document.addEventListener('keydown', (evt: KeyboardEvent) => {
            if (evt.key === EKeyboard.SPACE && !this.isDragging) {
                this.canvas.selection = false;
                const lowerCanvasEl = this.canvas.upperCanvasEl;
                lowerCanvasEl.style.cursor = 'grab';

                // Store and disable object interactivity
                this.canvas.getObjects().forEach((obj) => {
                    obj.selectable = false;
                    obj.hoverCursor = 'grab';
                });

            }
        });

        document.addEventListener('keyup', (evt: KeyboardEvent) => {
            if (evt.key === EKeyboard.SPACE && !this.isDragging) {
                this.canvas.selection = true;
                const lowerCanvasEl = this.canvas.upperCanvasEl;
                lowerCanvasEl.style.cursor = 'default';

                // Restore object interactivity
                this.canvas.getObjects().forEach((obj) => {
                    obj.selectable = true;
                    obj.hoverCursor = null;
                });
                this.isDragging = false;
            }
        });

    }


}

export default WorldManage;