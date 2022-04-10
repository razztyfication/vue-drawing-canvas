/* eslint-disable no-debugger, no-console */

import { defineComponent, h, isVue2 } from 'vue-demi';

interface WatermarkImageStyle {
  width: number,
  height: number
}

interface WatermarkFontStyle {
  width: number,
  lineHeight: number,
  color: string,
  font: string,
  drawType: string,
  textAlign: string,
  textBaseline: string,
  rotate: number
}

interface WatermarkData {
  type: string,
  source: string,
  x: number,
  y: number,
  imageStyle?: WatermarkImageStyle,
  fontStyle?: WatermarkFontStyle
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

export default /*#__PURE__*/defineComponent({
  name: 'VueDrawingCanvas',
  props: {
    strokeType: {
      type: String,
      validator: (value: string): boolean => {
        return ['dash', 'square', 'circle', 'triangle', 'half_triangle'].indexOf(value) !== -1
      },
      default: () => 'dash'
    },
    fillShape: {
      type: Boolean,
      default: () => false
    },
    width: {
      type: [String, Number],
      default: () => 600
    },
    height: {
      type: [String, Number],
      default: () => 400
    },
    image: {
      type: String,
      default: () => ''
    },
    eraser: {
      type: Boolean,
      default: () => false
    },
    color: {
      type: String,
      default: () => '#000000'
    },
    lineWidth: {
      type: Number,
      default: () => 5
    },
    lock: {
      type: Boolean,
      default: () => false
    },
    styles: {
      type: [Array, String, Object],
    },
    classes: {
      type: [Array, String, Object],
    },
    backgroundColor: {
      type: String,
      default: () => '#FFFFFF'
    },
    backgroundImage: {
      type: String,
      default: (): null | string => null
    },
    watermark: {
      type: Object,
      default: (): null | WatermarkData => null
    },
    saveAs: {
      type: String,
      validator: (value: string) => {
        return ['jpeg', 'png'].indexOf(value) !== -1
      },
      default: () => 'png'
    },
    canvasId: {
      type: String,
      default: () => 'VueDrawingCanvas'
    },
    initialImage: {
      type: Array,
      default: (): any => []
    },
    additionalImages: {
      type: Array,
      default: (): any => []
    },
    scale:{
      type: Number,
      default: () => 1
    }
  },
  data(): DataInit {
    return {
      loadedImage: null,
      drawing: false,
      context: null,
      images: [],
      strokes: {
        type: '',
        from: { x: 0, y: 0 },
        coordinates: [],
        color: '',
        width: '',
        fill: false
      },
      guides: [],
      trash: []
    };
  },
  mounted() {
    this.setContext();
    this.$nextTick(() => {
      this.setScale()
      this.drawInitialImage()
      this.drawAdditionalImages()
    })
  },
  watch: {
    backgroundImage: function () {
      this.loadedImage = null
    }
  },
  methods: {

    setScale(){
      if(this.scale==1) return
      let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.querySelector('#'+this.canvasId);
      let ctx = canvas.getContext("2d");
      if(!ctx) return
      ctx.setTransform(this.scale, 0, 0, this.scale, 0, 0);
    },

    async setContext() {
      let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.querySelector('#'+this.canvasId);
      this.context = this.context ? this.context : canvas.getContext('2d');
      
      await this.setBackground();
    },
    drawInitialImage() {
      if (this.initialImage && this.initialImage.length > 0) {
        // @ts-ignore
        this.images = [].concat(this.images, this.initialImage)
        this.redraw(true)
      }
    },
    drawAdditionalImages() {
      if (this.additionalImages && this.additionalImages.length > 0) {
        let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.querySelector('#'+this.canvasId);
        this.additionalImages.forEach((watermarkObject: any) => {
          this.drawWatermark(canvas, this.context, watermarkObject)
        });
      }
    },
    clear() {
      this.context.clearRect(0, 0, this.width, this.height);
    },
    async setBackground() {
      this.clear();
      this.context.fillStyle = this.backgroundColor;
      this.context.fillRect(0, 0, this.width, this.height);
      
      await this.$nextTick(async () => {
        await this.drawBackgroundImage()
      })
      this.save();
    },
    async drawBackgroundImage() {
      if (!this.loadedImage) {
        return new Promise<void>((resolve) => { 
          if (!this.backgroundImage) {
            resolve()
            return;
          }
          const image = new Image();
          image.src = this.backgroundImage;
          image.onload = () => {
            this.context.drawImage(image, 0, 0, this.width, this.height);
            this.loadedImage = image
            resolve();
          }
        })
      } else {
        this.context.drawImage(this.loadedImage, 0, 0, this.width, this.height);
      }
    },    
    getCoordinates(event: Event) {
      let x, y;
      if ((<TouchEvent>event).touches && (<TouchEvent>event).touches.length > 0) {
        let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.querySelector('#'+this.canvasId);
        let rect = canvas.getBoundingClientRect();
        x = ((<TouchEvent>event).touches[0].clientX - rect.left);
        y = ((<TouchEvent>event).touches[0].clientY - rect.top);
      } else {
        x = (<MouseEvent>event).offsetX;
        y = (<MouseEvent>event).offsetY;
      }
      return {
        x: x,
        y: y
      }
    },
    startDraw(event: Event) {
      if (!this.lock) {
        this.drawing = true;

        let coordinate = this.getCoordinates(event);
        this.strokes = {
          type: this.eraser ? 'eraser' : this.strokeType,
          from: coordinate,
          coordinates: [],
          color: this.eraser ? this.backgroundColor : this.color,
          width: this.lineWidth,
          fill: this.eraser || this.strokeType === 'dash' ? false : this.fillShape
        };
        this.guides = [];
      }
    },
    draw(event: Event) {
      if (this.drawing) {
        if (!this.context) {
          this.setContext();
        }
        let coordinate = this.getCoordinates(event);
        if (this.eraser || this.strokeType === 'dash') {
          this.strokes.coordinates.push(coordinate);
          this.drawShape(this.strokes, false);
        } else {
          let coordinates;
          switch (this.strokeType) {
            case 'square':
              coordinates = [
                { x: coordinate.x, y: this.strokes.from.y },
                { x: coordinate.x, y: coordinate.y },
                { x: this.strokes.from.x, y: coordinate.y }, 
                {x: this.strokes.from.x, y: this.strokes.from.y}
              ];
              break;
            case 'triangle':
              let center = Math.floor((coordinate.x - this.strokes.from.x) / 2) < 0 ? Math.floor((coordinate.x - this.strokes.from.x) / 2) * -1 : Math.floor((coordinate.x - this.strokes.from.x) / 2);
              let width = this.strokes.from.x < coordinate.x ? this.strokes.from.x + center : this.strokes.from.x - center;
              coordinates = [
                { x: coordinate.x, y: this.strokes.from.y },
                { x: width, y: coordinate.y }, 
                {x: this.strokes.from.x, y: this.strokes.from.y}
              ];
              break;
            case 'half_triangle':
              coordinates = [
                { x: coordinate.x, y: this.strokes.from.y },
                { x: this.strokes.from.x, y: coordinate.y }, 
                {x: this.strokes.from.x, y: this.strokes.from.y}
              ];
              break;
            case 'circle':
              let radiusX = this.strokes.from.x - coordinate.x < 0 ? (this.strokes.from.x - coordinate.x) * -1 : this.strokes.from.x - coordinate.x;
              coordinates = [
                { x: this.strokes.from.x > coordinate.x ? this.strokes.from.x - radiusX : this.strokes.from.x + radiusX, y: this.strokes.from.y },
                { x: radiusX, y: radiusX }
              ];
              break;
          }
          this.guides = coordinates;
          this.drawGuide(true);
        }
      }
    },
    drawGuide(closingPath: boolean) {
      this.redraw(false);
      this.context.strokeStyle = '#000000';
      this.context.lineWidth = 1;
      this.context.lineJoin = 'round';
      this.context.lineCap = 'round';

      this.context.beginPath();
      this.context.setLineDash([15, 15]);
      if (this.strokes.type === 'circle') {
        this.context.ellipse(this.guides[0].x, this.guides[0].y, this.guides[1].x, this.guides[1].y, 0, 0, Math.PI * 2);
      } else {
        this.context.moveTo(this.strokes.from.x, this.strokes.from.y);
        this.guides.forEach((coordinate: {x: number, y: number}) => {
          this.context.lineTo(coordinate.x, coordinate.y);
        });
        if (closingPath) {
          this.context.closePath();
        }
      }
      this.context.stroke();
    },
    drawShape(strokes: any, closingPath: boolean) {
      this.context.strokeStyle = strokes.color;
      this.context.fillStyle = strokes.color;
      this.context.lineWidth = strokes.width;
      this.context.lineJoin = 'round';
      this.context.lineCap = 'round';
      
      this.context.beginPath();
      this.context.setLineDash([]);
      if (strokes.type === 'circle') {
        this.context.ellipse(strokes.coordinates[0].x, strokes.coordinates[0].y, strokes.coordinates[1].x, strokes.coordinates[1].y, 0, 0, Math.PI * 2);
      } else {
        this.context.moveTo(strokes.from.x, strokes.from.y);
        strokes.coordinates.forEach((stroke: { x: number, y: number}) => {
          this.context.lineTo(stroke.x, stroke.y);
        });
        if (closingPath) {
          this.context.closePath();
        }
      }
      if (strokes.fill) {
        this.context.fill();
      } else {
        this.context.stroke();
      }
    },
    stopDraw() {
      if (this.drawing) {
        this.strokes.coordinates = this.guides.length > 0 ? this.guides : this.strokes.coordinates;
        this.images.push(this.strokes);
        this.redraw(true);
        this.drawing = false;
        this.trash = [];
      }
    },
    reset() {
      if (!this.lock) {
        this.images = [];
        this.strokes = {
          type: '',
          coordinates: [],
          color: '',
          width: '',
          fill: false
        };
        this.guides = [];
        this.trash = [];
        this.redraw(true);
      }
    },
    undo() {
      if (!this.lock) {
        let strokes = this.images.pop();
        if (strokes) {
          this.trash.push(strokes);
          this.redraw(true);
        }
      }
    },
    redo() {
      if (!this.lock) {
        let strokes = this.trash.pop();
        if (strokes) {
          this.images.push(strokes);
          this.redraw(true);
        }
      }
    },
    async redraw(output: boolean) {
      output = typeof output !== 'undefined' ? output : true;
      await this.setBackground()
      .then(() => {
        this.drawAdditionalImages()
      })
      .then(() => {
        this.images.forEach((strokes: any) => {
          this.drawShape(strokes, strokes.type === 'eraser' || strokes.type === 'dash' ? false : true);
        });
      })
      .then(() => {
        if (output) {
          this.save();
        }
      });
    },
    wrapText(context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth : number, lineHeight: number) {
      const newLineRegex = /(\r\n|\n\r|\n|\r)+/g
      const whitespaceRegex = /\s+/g
      var lines = text.split(newLineRegex).filter(word => word.length > 0)
      for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {      
        var words = lines[lineNumber].split(whitespaceRegex).filter(word => word.length > 0);
        var line = '';
  
        for(var n = 0; n < words.length; n++) {
          var testLine = line + words[n] + ' ';
          var metrics = context.measureText(testLine);
          var testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            if(this.watermark && (this.watermark.fontStyle && this.watermark.fontStyle.drawType && this.watermark.fontStyle.drawType === 'stroke') )
            {
              context.strokeText(line, x, y);
            }
            else{
              context.fillText(line, x, y);
            }  
            line = words[n] + ' ';
            y += lineHeight;
          }
          else {
            line = testLine;
          }
        }
        if(this.watermark && (this.watermark.fontStyle && this.watermark.fontStyle.drawType && this.watermark.fontStyle.drawType === 'stroke') )
        {
          context.strokeText(line, x, y);
        }
        else{
          context.fillText(line, x, y);
        }
        y += words.length > 0 ? lineHeight : 0;
      }
    },
    save() {
      if (this.watermark) {
        let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.querySelector('#'+this.canvasId);
        let temp = document.createElement('canvas');
        let ctx: CanvasRenderingContext2D | null = temp.getContext('2d')
        
        if (ctx) {
          temp.width = Number(this.width);
          temp.height = Number(this.height);
          ctx.drawImage(canvas, 0, 0, Number(this.width), Number(this.height));
          
          this.drawWatermark(temp, ctx, <WatermarkData>this.watermark)
        }
      } else {
        let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.querySelector('#'+this.canvasId);
        this.$emit('update:image', canvas.toDataURL('image/' + this.saveAs, 1));
        return canvas.toDataURL('image/' + this.saveAs, 1);
      }
    },
    drawWatermark(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, watermark: WatermarkData) {
      if (watermark.type === 'Image') {
        let imageWidth = watermark.imageStyle ? (watermark.imageStyle.width ? watermark.imageStyle.width : this.width) : this.width;
        let imageHeight = watermark.imageStyle ? (watermark.imageStyle.height ? watermark.imageStyle.height : this.height) : this.height;

        const image = new Image();
        image.src = watermark.source;
        image.onload = () => {
          if (watermark && ctx) {
            ctx.drawImage(image, watermark.x, watermark.y, Number(imageWidth), Number(imageHeight));
          }
          this.$emit('update:image', canvas.toDataURL('image/' + this.saveAs, 1));
          return(canvas.toDataURL('image/' + this.saveAs, 1));
        }
      } else if (watermark.type === 'Text') {
        let font = watermark.fontStyle ? (watermark.fontStyle.font ? watermark.fontStyle.font : '20px serif') : '20px serif';
        let align = watermark.fontStyle ? (watermark.fontStyle.textAlign ? watermark.fontStyle.textAlign : 'start') : 'start';
        let baseline = watermark.fontStyle ? (watermark.fontStyle.textBaseline ? watermark.fontStyle.textBaseline : 'alphabetic') : 'alphabetic';
        let color = watermark.fontStyle ? (watermark.fontStyle.color ? watermark.fontStyle.color : '#000000') : '#000000';
        
        ctx.font = font;
        ctx.textAlign = align as CanvasTextAlign;
        ctx.textBaseline = baseline as CanvasTextBaseline;

        if (watermark.fontStyle && watermark.fontStyle.rotate) {
          let centerX, centerY;
          if (watermark.fontStyle && watermark.fontStyle.width) {
            centerX = watermark.x + Math.floor(watermark.fontStyle.width / 2);
          } else {
            centerX = watermark.x;
          }
          if (watermark.fontStyle && watermark.fontStyle.lineHeight) {
            centerY = watermark.y + Math.floor(watermark.fontStyle.lineHeight / 2);
          } else {
            centerY = watermark.y;
          }
          
          ctx.translate(centerX, centerY);
          ctx.rotate(watermark.fontStyle.rotate * Math.PI / 180);
          ctx.translate(centerX * -1, centerY * -1);
        }

        if (watermark.fontStyle && watermark.fontStyle.drawType && watermark.fontStyle.drawType === 'stroke') {
          ctx.strokeStyle = watermark.fontStyle.color;
          if (watermark.fontStyle && watermark.fontStyle.width) {
            this.wrapText(ctx, watermark.source,  watermark.x,  watermark.y, watermark.fontStyle.width, watermark.fontStyle.lineHeight);
          } else {
            ctx.strokeText(watermark.source, watermark.x, watermark.y);
          }
        } else {
          ctx.fillStyle = color;
          if (watermark.fontStyle && watermark.fontStyle.width) {
            this.wrapText(ctx, watermark.source,  watermark.x,  watermark.y, watermark.fontStyle.width, watermark.fontStyle.lineHeight);
          } else {
            ctx.fillText(watermark.source, watermark.x, watermark.y);
          }
        }
        this.$emit('update:image', canvas.toDataURL('image/' + this.saveAs, 1));
        return(canvas.toDataURL('image/' + this.saveAs, 1));
      }
    },
    isEmpty() {
      return this.images.length > 0 ? false : true;
    },
    getAllStrokes() {
      return this.images;
    }
  },
  render() {
    if (isVue2) {
      return h('canvas', {
        attrs: {
          id: this.canvasId,
          width: this.width,
          height: this.height
        },
        style: {
          'touchAction': 'none',
          // @ts-ignore
          ...this.styles
        },
        class: this.classes,
        on: {
          mousedown: (event: Event) => this.startDraw(event),
          mousemove: (event: Event) => this.draw(event),
          mouseup: () => this.stopDraw(),
          mouseleave: () => this.stopDraw(),
          touchstart: (event: Event) => this.startDraw(event),
          touchmove: (event: Event) => this.draw(event),
          touchend: () => this.stopDraw(),
          touchleave: () => this.stopDraw(),
          touchcancel: () => this.stopDraw(),
          pointerdown: (event: Event) => this.startDraw(event),
		      pointermove: (event: Event) => this.draw(event),
		      pointerup: () => this.stopDraw(),
          pointerleave: () => this.stopDraw(),
          pointercancel: () => this.stopDraw(),
        },
        ...this.$props
      });
    }
    return h('canvas', {
      id: this.canvasId,
      height: this.height,
      width: this.width,
      style: {
        'touchAction': 'none',
        // @ts-ignore
        ...this.styles
      },
      class: this.classes,
      onMousedown: ($event: Event) => this.startDraw($event),
      onMousemove: ($event: Event) => this.draw($event),
      onMouseup: () => this.stopDraw(),
      onMouseleave: () => this.stopDraw(),
      onTouchstart: ($event: Event) => this.startDraw($event),
      onTouchmove: ($event: Event) => this.draw($event),
      onTouchend: () => this.stopDraw(),
      onTouchleave: () => this.stopDraw(),
      onTouchcancel: () => this.stopDraw(),
      onPointerdown: ($event: Event) => this.startDraw($event),
      onPointermove: ($event: Event) => this.draw($event),
      onPointerup: () => this.stopDraw(),
      onPointerleave: () => this.stopDraw(),
      onPointercancel: () => this.stopDraw()
    });
  }
});
