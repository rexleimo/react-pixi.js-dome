import {IPolloCanvas} from "@/packages/pixi-canvas/types/IPolloCanvas";
import {Transformer} from '@pixi-essentials/transformer';
import SelectObjectManage from "@/packages/pixi-canvas/SelectObjectManage";

class TransformerManager {

    _instance!: Transformer;

    constructor(private _application: IPolloCanvas) {
        SelectObjectManage.getInstance().onSelectObject((objs) => {

            const app = this._application.getPixiInstances();

            app.stage.addChild(new Transformer({
                rotateEnabled: true,
                boxRotationEnabled: true,
                group: Array.from(objs),
                stage: app.stage,
                wireframeStyle: {
                    thickness: 1,
                    color: 0xff0000,
                }
            }))

        })
    }


}

export default TransformerManager;