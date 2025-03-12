import {IPolloCanvas} from "@/packages/pixi-canvas/types/IPolloCanvas";
import {Transformer} from '@pixi-essentials/transformer';
import SelectObjectManage from "@/packages/pixi-canvas/SelectObjectManage";

class TransformerManager {

    _instance!: Transformer;

    constructor(private _application: IPolloCanvas) {
        SelectObjectManage.getInstance().onSelectObject((objs) => {
            console.log(objs);
        })
    }


}

export default TransformerManager;