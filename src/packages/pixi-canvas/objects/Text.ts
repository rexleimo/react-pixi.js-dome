import { IEntity } from "@/packages/pixi-canvas/types/IEntity";
import * as PIXI from 'pixi.js';
import { IPolloCanvas } from "@/packages/pixi-canvas/types/IPolloCanvas";
import SelectObjectManage from "@/packages/pixi-canvas/manages/SelectObjectManage";
import TransformerManager from "@/packages/pixi-canvas/manages/TransformerManager";

class Text implements IEntity {

    _instance: PIXI.Text;
    _clickCount: number = 0;
    _lastClickTime: number = 0;

    _fontSize: number = 16;
    _fontWeight: PIXI.TextStyleFontWeight = 'bold';
    _zIndex: number = 10;


    constructor(private _application: IPolloCanvas) {
        this._instance = new PIXI.Text();
        this._instance.interactive = true;
        this._instance.eventMode = 'static';

        // 设置字体大小
        this._instance.style.fontSize = this._fontSize;
        this._instance.style.fontWeight = this._fontWeight;
        
        // 确保zIndex正确设置并应用
        this._instance.zIndex = this._zIndex;
        

        this._instance.on('pointerdown', (event) => {
            event.stopPropagation();
            const now = Date.now();
            if (!this._clickCount) {
                this._clickCount = 1;
                this._lastClickTime = now;

                SelectObjectManage.getInstance().emitPushEvent(this._instance);
            } else {
                if (now - this._lastClickTime < 300) {
                    this.onDoubleClick(event);
                    this._clickCount = 0;
                    this._lastClickTime = 0;
                } else {
                    this._clickCount = 1;
                    this._lastClickTime = now;

                    SelectObjectManage.getInstance().emitPushEvent(this._instance);
                }
            }
        })
    }


    getEntity() {
        return this._instance;
    }

    setText(text: string) {
        this._instance.text = text;
    }

    setStyle(style: PIXI.TextStyle) {
        this._instance.style = style;
    }

    setPosition(x: number, y: number) {
        this._instance.x = x;
        this._instance.y = y;
    }

    onDoubleClick(event: PIXI.FederatedPointerEvent) {
        event.stopPropagation();
        console.log('onDoubleClick');
        const input = document.createElement('textarea');
        input.value = this._instance.text;
        input.style.position = 'absolute';

        const bounds = this._instance.getBounds();

        // 获取当前属性的缩放情况
        const scale = this._instance.scale;
        // 实际的字体大小
        const fontSize = this._fontSize * scale.x;
        
        input.style.backgroundColor = 'rgba(255,255,255,0.5)';
        input.style.color = '#333';
        input.style.left = `${bounds.x}px`;
        input.style.top = `${bounds.y}px`;
        input.style.width = `${bounds.width}px`;
        input.style.height = `${bounds.height}px`;
        input.style.fontSize = `${fontSize}px`;
        input.style.fontWeight = this._fontWeight;

        document.body.appendChild(input);
        input.focus();
        TransformerManager.getInstance().hide();
        this._instance.visible = false;

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.setText(input.value);
                TransformerManager.getInstance().show();
                this._instance.visible = true;
                input.remove();
            }
        });
    }

    setFontSize(fontSize: number) {
        this._fontSize = fontSize;
        this._instance.style.fontSize = `${fontSize}px`;
    }

    setFontWeight(fontWeight: PIXI.TextStyleFontWeight) {
        this._fontWeight = fontWeight;
        this._instance.style.fontWeight = fontWeight;
    }
    

    
    
}


export default Text;


