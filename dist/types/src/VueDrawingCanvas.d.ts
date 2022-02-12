interface WatermarkImageStyle {
    width: number;
    height: number;
}
interface WatermarkFontStyle {
    width: number;
    lineHeight: number;
    color: string;
    font: string;
    drawType: string;
    textAlign: string;
    textBaseline: string;
    rotate: number;
}
interface WatermarkData {
    type: string;
    source: string;
    x: number;
    y: number;
    imageStyle?: WatermarkImageStyle;
    fontStyle?: WatermarkFontStyle;
}
interface DataInit {
    loadedImage: any;
    drawing: boolean;
    context: any;
    images: any;
    strokes: any;
    guides: any;
    trash: any;
}
declare const _default: import("vue-demi").DefineComponent<{
    strokeType: {
        type: StringConstructor;
        validator: (value: string) => boolean;
        default: () => string;
    };
    fillShape: {
        type: BooleanConstructor;
        default: () => boolean;
    };
    width: {
        type: (StringConstructor | NumberConstructor)[];
        default: () => number;
    };
    height: {
        type: (StringConstructor | NumberConstructor)[];
        default: () => number;
    };
    image: {
        type: StringConstructor;
        default: () => string;
    };
    eraser: {
        type: BooleanConstructor;
        default: () => boolean;
    };
    color: {
        type: StringConstructor;
        default: () => string;
    };
    lineWidth: {
        type: NumberConstructor;
        default: () => number;
    };
    lock: {
        type: BooleanConstructor;
        default: () => boolean;
    };
    styles: {
        type: (StringConstructor | ArrayConstructor | ObjectConstructor)[];
    };
    classes: {
        type: (StringConstructor | ArrayConstructor | ObjectConstructor)[];
    };
    backgroundColor: {
        type: StringConstructor;
        default: () => string;
    };
    backgroundImage: {
        type: StringConstructor;
        default: () => null | string;
    };
    watermark: {
        type: ObjectConstructor;
        default: () => null | WatermarkData;
    };
    saveAs: {
        type: StringConstructor;
        validator: (value: string) => boolean;
        default: () => string;
    };
    canvasId: {
        type: StringConstructor;
        default: () => string;
    };
    initialImage: {
        type: ArrayConstructor;
        default: () => any;
    };
    additionalImages: {
        type: ArrayConstructor;
        default: () => any;
    };
}, unknown, DataInit, {}, {
    setContext(): Promise<void>;
    drawInitialImage(): void;
    drawAdditionalImages(): void;
    clear(): void;
    setBackground(): Promise<void>;
    drawBackgroundImage(): Promise<void>;
    getCoordinates(event: Event): {
        x: number;
        y: number;
    };
    startDraw(event: Event): void;
    draw(event: Event): void;
    drawGuide(closingPath: boolean): void;
    drawShape(strokes: any, closingPath: boolean): void;
    stopDraw(): void;
    reset(): void;
    undo(): void;
    redo(): void;
    redraw(output: boolean): Promise<void>;
    wrapText(context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number): void;
    save(): string | undefined;
    drawWatermark(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, watermark: WatermarkData): string | undefined;
    isEmpty(): boolean;
    getAllStrokes(): any;
}, import("vue-demi").ComponentOptionsMixin, import("vue-demi").ComponentOptionsMixin, Record<string, any>, string, import("vue-demi").VNodeProps & import("vue-demi").AllowedComponentProps & import("vue-demi").ComponentCustomProps, Readonly<{
    strokeType?: unknown;
    fillShape?: unknown;
    width?: unknown;
    height?: unknown;
    image?: unknown;
    eraser?: unknown;
    color?: unknown;
    lineWidth?: unknown;
    lock?: unknown;
    styles?: unknown;
    classes?: unknown;
    backgroundColor?: unknown;
    backgroundImage?: unknown;
    watermark?: unknown;
    saveAs?: unknown;
    canvasId?: unknown;
    initialImage?: unknown;
    additionalImages?: unknown;
} & {
    backgroundImage: string;
    strokeType: string;
    fillShape: boolean;
    width: string | number;
    height: string | number;
    image: string;
    eraser: boolean;
    color: string;
    lineWidth: number;
    lock: boolean;
    backgroundColor: string;
    watermark: Record<string, any>;
    saveAs: string;
    canvasId: string;
} & {
    styles?: string | unknown[] | Record<string, any> | undefined;
    classes?: string | unknown[] | Record<string, any> | undefined;
    initialImage?: unknown[] | undefined;
    additionalImages?: unknown[] | undefined;
}>, {
    backgroundImage: string;
    strokeType: string;
    fillShape: boolean;
    width: string | number;
    height: string | number;
    image: string;
    eraser: boolean;
    color: string;
    lineWidth: number;
    lock: boolean;
    backgroundColor: string;
    watermark: Record<string, any>;
    saveAs: string;
    canvasId: string;
    initialImage: unknown[];
    additionalImages: unknown[];
}>;
export default _default;
