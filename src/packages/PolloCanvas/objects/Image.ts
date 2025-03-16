import { FabricImage } from "fabric";
import cuid from "cuid";
class PolloImage {

    private image!: FabricImage;
    private uuid: string;

    constructor() {
        this.uuid = cuid();
    }

    public setImage(src: string) {
        return FabricImage.fromURL(src).then(img => {
            this.image = img;
            this.image.hoverCursor = 'default';

            this.image.on('mouseover', () => {
                this.image.hoverCursor = 'default';
                // 绘制边框
                this.image.set({
                    stroke: '#00a8ff',
                    strokeWidth: 2,
                    strokeUniform: true,
                });
                this.image.canvas?.requestRenderAll();
            });
            this.image.on('mouseout', () => {
                this.image.hoverCursor = 'default';
                // 移除边框
                this.image.set({
                    stroke: undefined,
                    strokeUniform: true
                });
                this.image.canvas?.requestRenderAll();
            });

            // 设置选中时的控制点和边框样式
            this.image.set({
                transparentCorners: false,
                borderColor: '#00a8ff',
                borderWidth: 2,
                showControls: true,
                hasControls: true,
                hasBorders: true,
                // 隐藏旋转控制点
                hasRotatingPoint: false,
                cornerColor: '#00a8ff',
                // 设置控制点样式
                cornerStyle: 'circle',
                cornerSize: 10,
            });

            // 隐藏中间的控制点，只保留四个角的控制点
            this.image.setControlsVisibility({
                mt: false,  // 中上
                mb: false,  // 中下
                ml: false,  // 中左
                mr: false,  // 中右
                mtr: false,
                // 保留四个角的控制点
                tl: true,   // 左上
                tr: true,   // 右上
                bl: true,   // 左下
                br: true    // 右下
            });

        });
    }

    public getImage() {
        return this.image;
    }

    public getUuid() {
        return this.uuid;
    }
}

export default PolloImage;
