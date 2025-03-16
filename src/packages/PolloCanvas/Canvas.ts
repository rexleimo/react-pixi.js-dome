import { Canvas, FabricObject } from 'fabric';
import { ICanvas } from './types/ICanvas';
import WorldManage from './manages/WorldManage';
import KeyboardManage from './manages/KeyboardManage';

class PolloCanvas implements ICanvas {

    private canvas: Canvas;

    constructor(private container: HTMLDivElement) {
        this.container = container;
        const canvasElement = document.createElement('canvas');
        this.container.appendChild(canvasElement);
        this.canvas = new Canvas(canvasElement);
    }

    public init() {
        this.canvas.setDimensions({
            width: this.container.clientWidth,
            height: this.container.clientHeight
        });
        
        new WorldManage(this);
        KeyboardManage.getInstance().setApplication(this);
        this.canvas.renderAll();
    }

    public getCanvas() {
        return this.canvas;
    }

    public addObject(object: FabricObject) {
        this.canvas.add(object);
    }
}

export default PolloCanvas;
