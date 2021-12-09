/* eslint-disable no-debugger, no-console */
import { defineComponent, h, isVue2 } from 'vue-demi';

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
      validator: (value: string) => {
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
      default: () => null
    },
    watermark: {
      type: Object
    },
    saveAs: {
      type: String,
      validator: (value: string) => {
        return ['jpeg', 'png'].indexOf(value) !== -1
      },
      default: () => 'png'
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
  },
  watch: {
    backgroundImage: function () {
      this.loadedImage = null
    }
  },
  methods: {
    async setContext() {
      let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.querySelector('#VueDrawingCanvas');
      this.context = this.context ? this.context : canvas.getContext('2d');
      
      await this.setBackground();
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
    getCoordinates(event) {
      let x, y;
      if (event.touches && event.touches.length > 0) {
        let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.querySelector('#VueDrawingCanvas');
        let rect = canvas.getBoundingClientRect();
        x = (event.touches[0].clientX - rect.left);
        y = (event.touches[0].clientY - rect.top);
      } else {
        x = event.offsetX;
        y = event.offsetY;
      }
      return {
        x: x,
        y: y
      }
    },
    startDraw(event) {
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
    draw(event) {
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
    drawGuide(closingPath) {
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
        this.guides.forEach((coordinate) => {
          this.context.lineTo(coordinate.x, coordinate.y);
        });
        if (closingPath) {
          this.context.closePath();
        }
      }
      this.context.stroke();
    },
    drawShape(strokes, closingPath) {
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
        strokes.coordinates.forEach(stroke => {
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
        this.redraw();
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
        this.redraw();
      }
    },
    undo() {
      if (!this.lock) {
        let strokes = this.images.pop();
        if (strokes) {
          this.trash.push(strokes);
          this.redraw();
        }
      }
    },
    redo() {
      if (!this.lock) {
        let strokes = this.trash.pop();
        if (strokes) {
          this.images.push(strokes);
          this.redraw();
        }
      }
    },
    async redraw(output: boolean) {
      output = typeof output !== 'undefined' ? output : true;
      await this.setBackground()
      .then(() => {
        this.images.forEach(strokes => {
          this.drawShape(strokes, this.type = 'eraser' || this.type === 'dash' ? false : true);
        });
      })
      .then(() => {
        if (output) {
          this.save();
        }
      });
    },
    wrapText(context, text, x, y, maxWidth, lineHeight) {
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
            if((this.watermark.fontStyle && this.watermark.fontStyle.drawType && this.watermark.fontStyle.drawType === 'stroke') )
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
        if((this.watermark.fontStyle && this.watermark.fontStyle.drawType && this.watermark.fontStyle.drawType === 'stroke') )
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
        let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.querySelector('#VueDrawingCanvas');
        let temp: HTMLCanvasElement = <HTMLCanvasElement>document.createElement('canvas');
        let ctx = temp.getContext('2d');
        temp.width = this.width;
        temp.height = this.height;
        ctx.drawImage(canvas, 0, 0, this.width, this.height);

        if (this.watermark.type === 'Image') {
          let imageWidth = this.watermark.imageStyle ? (this.watermark.imageStyle.width ? this.watermark.imageStyle.width : this.width) : this.width;
          let imageHeight = this.watermark.imageStyle ? (this.watermark.imageStyle.height ? this.watermark.imageStyle.height : this.height) : this.height;

          const image = new Image();
          image.src = this.watermark.source;
          image.onload = () => {
            ctx.drawImage(image, this.watermark.x, this.watermark.y, imageWidth, imageHeight);
            this.$emit('update:image', temp.toDataURL('image/' + this.saveAs, 1));
            return(temp.toDataURL('image/' + this.saveAs, 1));
          }
        } else if (this.watermark.type === 'Text') {
          let font = this.watermark.fontStyle ? (this.watermark.fontStyle.font ? this.watermark.fontStyle.font : '20px serif') : '20px serif';
          let align = this.watermark.fontStyle ? (this.watermark.fontStyle.textAlign ? this.watermark.fontStyle.textAlign : 'start') : 'start';
          let baseline = this.watermark.fontStyle ? (this.watermark.fontStyle.textBaseline ? this.watermark.fontStyle.textBaseline : 'alphabetic') : 'alphabetic';
          let color = this.watermark.fontStyle ? (this.watermark.fontStyle.color ? this.watermark.fontStyle.color : '#000000') : '#000000';
          
          ctx.font = font;
          ctx.textAlign = align;
          ctx.textBaseline = baseline;

          if (this.watermark.fontStyle && this.watermark.fontStyle.rotate) {
            let centerX, centerY;
            if (this.watermark.fontStyle && this.watermark.fontStyle.width) {
              centerX = this.watermark.x + Math.floor(this.watermark.fontStyle.width / 2);
            } else {
              centerX = this.watermark.x;
            }
            if (this.watermark.fontStyle && this.watermark.fontStyle.lineHeight) {
              centerY = this.watermark.y + Math.floor(this.watermark.fontStyle.lineHeight / 2);
            } else {
              centerY = this.watermark.y;
            }
            
            ctx.translate(centerX, centerY);
            ctx.rotate(this.watermark.fontStyle.rotate * Math.PI / 180);
            ctx.translate(centerX * -1, centerY * -1);
          }

          if (this.watermark.fontStyle && this.watermark.fontStyle.drawType && this.watermark.fontStyle.drawType === 'stroke') {
            ctx.strokeStyle = this.watermark.fontStyle.color;
            if (this.watermark.fontStyle && this.watermark.fontStyle.width) {
              this.wrapText(ctx, this.watermark.source,  this.watermark.x,  this.watermark.y, this.watermark.fontStyle.width, this.watermark.fontStyle.lineHeight);
            } else {
              ctx.strokeText(this.watermark.source, this.watermark.x, this.watermark.y);
            }
          } else {
            ctx.fillStyle = color;
            if (this.watermark.fontStyle && this.watermark.fontStyle.width) {
              this.wrapText(ctx, this.watermark.source,  this.watermark.x,  this.watermark.y, this.watermark.fontStyle.width, this.watermark.fontStyle.lineHeight);
            } else {
              ctx.fillText(this.watermark.source, this.watermark.x, this.watermark.y);
            }
          }
          this.$emit('update:image', temp.toDataURL('image/' + this.saveAs, 1));
          return(temp.toDataURL('image/' + this.saveAs, 1));
        }
      } else {
        let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.querySelector('#VueDrawingCanvas');
        this.$emit('update:image', canvas.toDataURL('image/' + this.saveAs, 1));
        return canvas.toDataURL('image/' + this.saveAs, 1);
      }
    },
    isEmpty() {
      return this.images.length > 0 ? false : true;
    }
  },
  render() {
    if (isVue2) {
      return h('canvas', {
        attrs: {
          id: 'VueDrawingCanvas',
          width: this.width,
          height: this.height
        },
        style: {
          'touchAction': 'none',
          ...this.styles
        },
        class: this.classes,
        on: {
          mousedown: event => this.startDraw(event),
          mousemove: event => this.draw(event),
          mouseup: event => this.stopDraw(event),
          mouseleave: event => this.stopDraw(event),
          touchstart: event => this.startDraw(event),
          touchmove: event => this.draw(event),
          touchend: event => this.stopDraw(event),
          touchleave: event => this.stopDraw(event),
          touchcancel: event => this.stopDraw(event)
        },
        ...this.$props
      });
    }
    return h('canvas', {
      id: 'VueDrawingCanvas',
      height: this.height,
      width: this.width,
      style: {
        'touchAction': 'none',
        ...this.styles
      },
      class: this.classes,
      onMousedown: $event => this.startDraw($event),
      onMousemove: $event => this.draw($event),
      onMouseup: $event => this.stopDraw($event),
      onMouseleave: $event => this.stopDraw($event),
      onTouchstart: $event => this.startDraw($event),
      onTouchmove: $event => this.draw($event),
      onTouchend: $event => this.stopDraw($event),
      onTouchleave: $event => this.stopDraw($event),
      onTouchcancel: $event => this.stopDraw($event)
    });
  }
});
