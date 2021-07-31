<script lang="ts">
/* eslint-disable no-debugger, no-console */
import { defineComponent, h, isVue2 } from 'vue-demi'

export default /*#__PURE__*/defineComponent({
  name: 'VueDrawingCanvas',
  props: {
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
    }
  },
  data: () => {
    return {
      drawing: false,
      offsetX: 0,
      offsetY: 0,
      context: null,
      images: [],
      strokes: [],
      trash: [],
    };
  },
  mounted() {
    this.setContext();
  },
  methods: {
    setContext() {
      let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.querySelector('#VueDrawingCanvas');
      this.context = this.context ? this.context : canvas.getContext('2d');

      this.setBackground();
      this.save();
    },
    clear() {
      this.context.clearRect(0, 0, this.width, this.height);
    },
    async setBackground() {
      this.clear();

      this.context.fillStyle = this.backgroundColor;
      this.context.fillRect(0, 0, this.width, this.height);
      
      if (this.backgroundImage) {
        const image = new Image();
        image.src = this.backgroundImage;
        image.onload = await this.drawBackgroundImage(image);
      }
    },
    async drawBackgroundImage(image) {
      this.context.drawImage(image, 0,0,this.width, this.height);
      this.save();
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
        this.strokes = [];
        let coordinate = this.getCoordinates(event);
        this.strokes.push({
          color: this.eraser ? 'white' : this.color,
          width: this.lineWidth,
          x: coordinate.x,
          y: coordinate.y
        });
        this.offsetX = coordinate.x;
        this.offsetY = coordinate.y;
      }
    },
    drawLine(color, width, from, to) {
      this.context.strokeStyle = color;
      this.context.lineWidth = width;
      this.context.lineJoin = 'round';

      this.context.beginPath();
      this.context.moveTo(from.x, from.y);
      this.context.lineTo(to.x, to.y);
      this.context.closePath();
      this.context.stroke();

      this.save();
    },
    draw(event) {
      if (this.drawing) {
        if (!this.context) {
          this.setContext();
        }

        let coordinate = this.getCoordinates(event);

        this.drawLine(this.eraser ? this.backgroundColor : this.color, this.lineWidth, { x: this.offsetX, y: this.offsetY }, { x: coordinate.x, y: coordinate.y });
        this.strokes.push({
          color: this.eraser ? 'white' : this.color,
          width: this.lineWidth,
          x: coordinate.x,
          y: coordinate.y
        });
        this.offsetX = coordinate.x;
        this.offsetY = coordinate.y;
      }
    },
    stopDraw() {
      if (this.drawing) {
        if (this.strokes.length > 1) {
          this.images.push(this.strokes);
        }
        this.drawing = false;
        this.trash = [];
      }
    },
    reset() {
      if (!this.lock) {
        this.setBackground();
        
        this.images = [];
        this.strokes = [];
        this.trash = [];
        this.save();
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
    async redraw() {
      await this.setBackground()
      .then(() => {
        let start;
        this.images.forEach(strokes => {
          start = null;
          let color = strokes[0].color;
          let width = strokes[0].width;

          this.context.strokeStyle = color;
          this.context.lineWidth = width;
          this.context.lineJoin = 'round';
          this.context.beginPath();
          
          strokes.forEach(path => {
            if (start) {
              this.context.lineTo(path.x, path.y);
              this.context.stroke();
            } else {
              this.context.moveTo(path.x, path.y);
              start = path;
            }
          });
        });
        this.save();
      })
    },
    save() {
      if (this.watermark) {
        let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.querySelector('#VueDrawingCanvas');
        let temp: HTMLCanvasElement = <HTMLCanvasElement>document.createElement('canvas');
        let ctx = temp.getContext('2d');
        temp.width = this.width;
        temp.height = this.height;
        ctx.drawImage(canvas,0,0,this.width, this.height);

        if (this.watermark.type === 'Image') {
          const image = new Image();
          image.src = this.watermark.source;
          image.onload = () => {
            ctx.drawImage(image, this.watermark.x,this.watermark.y,this.watermark.imageStyle.width, this.watermark.imageStyle.height);
            this.$emit('update:image', temp.toDataURL());
            return(temp.toDataURL());
          }
        } else if (this.watermark.type === 'Text') {
          ctx.font = this.watermark.fontStyle.font;
          ctx.textAlign = this.watermark.fontStyle.textAlign;
          ctx.textBaseline = this.watermark.fontStyle.textBaseline;

          let centerX = this.watermark.x + Math.floor(this.watermark.fontStyle.width / 2); // kalo ga ada width nya ga usah di translate
          let centerY = this.watermark.y + Math.floor(this.watermark.fontStyle.lineHeight / 2); // kalo ga ada width nya ga usah di translate
          
          ctx.translate(centerX, centerY);
          ctx.rotate(this.watermark.fontStyle.rotate * Math.PI / 180);
          ctx.translate(centerX * -1, centerY * -1);

          if (this.watermark.fontStyle.drawType === 'stroke') {
            ctx.strokeStyle = this.watermark.fontStyle.color;
            ctx.strokeText(this.watermark.source,this.watermark.x,this.watermark.y, this.watermark.fontStyle.width);
          } else {
            ctx.fillStyle = this.watermark.fontStyle.color;
            ctx.fillText(this.watermark.source,this.watermark.x,this.watermark.y, this.watermark.fontStyle.width);
          }
          this.$emit('update:image', temp.toDataURL());
          return(temp.toDataURL());
        }
      } else {
        let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.querySelector('#VueDrawingCanvas');
        this.$emit('update:image', canvas.toDataURL());
        return canvas.toDataURL();
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
          touchcancel: event => this.stopDraw(event),
        },
        ...this.$props
      });
    }
    return h('canvas', {
      id: 'VueDrawingCanvas',
      height: this.height,
      width: this.width,
      style: this.styles,
      class: this.classes,
      onMousedown: $event => this.startDraw($event),
      onMousemove: $event => this.draw($event),
      onMouseup: $event => this.stopDraw($event),
      onMouseleave: $event => this.stopDraw($event),
      onTouchstart: $event => this.startDraw($event),
      onTouchmove: $event => this.draw($event),
      onTouchend: $event => this.stopDraw($event),
      onTouchleave: $event => this.stopDraw($event),
      onTouchcancel: $event => this.stopDraw($event),
    });
  }
});
</script>

<style scoped>
  #VueDrawingCanvas {
    touch-action: none;
  }
</style>