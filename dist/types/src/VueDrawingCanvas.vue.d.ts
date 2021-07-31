declare const _default: import("vue-demi").DefineComponent<{
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
        default: () => any;
    };
    watermark: {
        type: ObjectConstructor;
    };
}, unknown, {
    drawing: boolean;
    offsetX: number;
    offsetY: number;
    context: any;
    images: any[];
    strokes: any[];
    trash: any[];
}, {}, {
    setContext(): void;
    clear(): void;
    setBackground(): Promise<void>;
    drawBackgroundImage(image: any): Promise<void>;
    getCoordinates(event: any): {
        x: any;
        y: any;
    };
    startDraw(event: any): void;
    drawLine(color: any, width: any, from: any, to: any): void;
    draw(event: any): void;
    stopDraw(): void;
    reset(): void;
    undo(): void;
    redo(): void;
    redraw(): Promise<void>;
    save(): string;
    isEmpty(): boolean;
}, import("vue-demi").ComponentOptionsMixin, import("vue-demi").ComponentOptionsMixin, Record<string, any>, string, import("vue-demi").VNodeProps & import("vue-demi").AllowedComponentProps & import("vue-demi").ComponentCustomProps, Readonly<{
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
} & {
    width: string | number;
    height: string | number;
    image: string;
    eraser: boolean;
    color: string;
    lineWidth: number;
    lock: boolean;
    backgroundColor: string;
} & {
    styles?: unknown;
    classes?: unknown;
    backgroundImage?: string;
    watermark?: Record<string, any>;
}>, {
    width: string | number;
    height: string | number;
    image: string;
    eraser: boolean;
    color: string;
    lineWidth: number;
    lock: boolean;
    backgroundColor: string;
    backgroundImage: string;
}>;
export default _default;
