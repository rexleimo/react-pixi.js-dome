import {PixiRenderEnable} from "@/packages/pixi-canvas/types/PixiRenderable";
import {createNanoEvents} from 'nanoevents';
import {IPolloCanvas} from "@/packages/pixi-canvas/types/IPolloCanvas";
import {debounce} from 'lodash-es';

enum SelectObjectManageEvent {
    push = "push",
    draw = "draw"
}

class SelectObjectManage {

    static instance: SelectObjectManage;
    private selectedObjects: PixiRenderEnable[] = [];
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
        const addObjects = this.beforeAddObject(obj);
        this.selectedObjects.push(...addObjects);
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
        debugger;
        this.selectEvents.emit("draw", this.selectedObjects);
    }, 50)
}

export default SelectObjectManage;