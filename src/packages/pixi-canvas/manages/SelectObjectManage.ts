import {PixiRenderEnable} from "@/packages/pixi-canvas/types/PixiRenderable";
import {createNanoEvents} from 'nanoevents';
import {IPolloCanvas} from "@/packages/pixi-canvas/types/IPolloCanvas";
import {debounce} from 'lodash-es';
import KeyboardManager, { KeyMap } from "./KeyboardManager";
import * as PIXI from 'pixi.js';

enum SelectObjectManageEvent {
    push = "push",
    draw = "draw"
}

class SelectObjectManage {

    static instance: SelectObjectManage;
    private selectedObjects: Set<PixiRenderEnable> = new Set();
    private selectEvents = createNanoEvents();
    private _application!: IPolloCanvas;

    static getInstance() {
        if (!SelectObjectManage.instance) {
            SelectObjectManage.instance = new SelectObjectManage();
        }
        return SelectObjectManage.instance;
    }

    constructor() {
        this.selectEvents.on(SelectObjectManageEvent.push, (obj: PixiRenderEnable | PixiRenderEnable[]) => {
            this.setSelectObject(obj);
            this.emitSelectEvent();
        })
    }

    setSelectObject(obj: PixiRenderEnable | PixiRenderEnable[]) {

        const keyboards = KeyboardManager.getInstance().getKeys();
        if(keyboards.size === 1 && keyboards.has(KeyMap.SHIFT)) {
            const addObjects = this.beforeAddObject(obj);
            addObjects.forEach(item => {
                this.selectedObjects.add(item);
            })
        } else {
            this.selectedObjects.clear();
            this.selectedObjects.add(obj as PixiRenderEnable);
        }
       
    }

    beforeAddObject(obj: PixiRenderEnable | PixiRenderEnable[]) {
        return obj instanceof Array ? obj : [obj];
    }

    getSelectedObjects() {
        return this.selectedObjects;
    }

    setApplication(app: IPolloCanvas) {
        this._application = app;
    }

    onSelectObject = (callback: (obj: PixiRenderEnable[]) => void) => {
        this.selectEvents.on(SelectObjectManageEvent.draw, callback);
    }

    emitSelectEvent = debounce(() => {
        this.selectEvents.emit("draw", Array.from(this.selectedObjects));
    }, 50)

    emitPushEvent(obj: PixiRenderEnable | PixiRenderEnable[]) {
        // 如果是文本对象，确保它在最上层
        if (obj instanceof PIXI.Text) {
            obj.zIndex = 10;
            
            // 确保舞台重新排序
            if (this._application?.getPixiInstances()?.stage) {
                this._application.getPixiInstances().stage.sortableChildren = true;
                this._application.getPixiInstances().stage.sortChildren();
            }
        }
        
        this.selectEvents.emit(SelectObjectManageEvent.push, obj);
    }
}

export default SelectObjectManage;