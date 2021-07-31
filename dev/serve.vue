<script lang="ts">
import { defineComponent } from 'vue';
import VueDrawingCanvas from '@/entry';

export default defineComponent({
  name: 'ServeDev',
  components: {
    VueDrawingCanvas
  },
  data() {
    return {
      x: 0,
      y: 0,
      image: '',
      eraser: false,
      line: 5,
      color: '#000000',
      backgroundImage: null,
      watermark: null
      // watermark: {
      //   type: "Text", // "Text" or "Image"
      //   source: "Watermark", // either Text or Image URL
      //   x: 200,
      //   y: 180,
      //   imageStyle: {
      //     width: 600,
      //     height: 400
      //   },
      //   fontStyle: {
      //     width: 200,
      //     lineHeight: 48,
      //     color: '#FF0000',
      //     font: 'bold 48px serif',
      //     drawType: 'fill', // "fill" or "stroke"
      //     textAlign: 'left',
      //     textBaseline: 'top',
      //     rotate: 45
      //   }
      // }
    }
  },
  methods: {
    async setImage(event) {
      let URL = window.URL;
      this.backgroundImage = URL.createObjectURL(event.target.files[0]);
      await this.$refs.VueCanvasDrawing.redraw();
    },
    async setWatermarkImage(event) {
      let URL = window.URL;
      this.watermark = {
        type: "Image", // "Text" or "Image"
        source: URL.createObjectURL(event.target.files[0]), // either Text or Image URL
        x: 0,
        y: 0,
        imageStyle: {
          width: 600,
          height: 400
        }
      }
      await this.$refs.VueCanvasDrawing.redraw();
    },
    getCoordinate(event) {
      let coordinates = this.$refs.VueCanvasDrawing.getCoordinates(event);
      this.x = coordinates.x;
      this.y = coordinates.y;
    }
  }
});
</script>

<template>
  <div id="app">
    <div class="flex-row">
      <div class="source">
        <p>Canvas:</p>
        <vue-drawing-canvas
          ref="VueCanvasDrawing"
          v-model:image="image"
          v-model:eraser="eraser"
          :lineWidth="line"
          :color="color"
          :background-image="backgroundImage"
          :watermark="watermark"
          :styles="{
            'border': 'solid 1px #000'
          }"
          @mousemove="getCoordinate($event)"
        />
        <p>
          x-axis: <strong>{{ x }}</strong>, y-axis: <strong>{{ y }}</strong>
        </p>
        <div class="button-container">
          <button type="button" @click.prevent="eraser = !eraser">
            Eraser
          </button>
          <select v-model="line">
            <option v-for="n in 25" :key="'option-' + n" :value="n">{{ n }}</option>
          </select>
          <input type="color" v-model="color">
          <button type="button" @click.prevent="$refs.VueCanvasDrawing.undo()" style="margin-left: 50px">
            Undo
          </button>
          <button type="button" @click.prevent="$refs.VueCanvasDrawing.redo()">
            Redo
          </button>
          <button type="button" @click.prevent="$refs.VueCanvasDrawing.redraw()">
            Refresh
          </button>
          <button type="button" @click.prevent="$refs.VueCanvasDrawing.reset()">
            Reset
          </button>
        </div>
        <div class="button-container">
          <div>
            <p style="margin-bottom: 0">
              Upload Background Image:
            </p>
            <input type="file" @change="setImage($event)">
          </div>
          <div>
            <p style="margin-bottom: 0">
              Upload Watermark Image:
            </p>
            <input type="file" @change="setWatermarkImage($event)">
          </div>
        </div>
        <div class="button-container">
          <!-- <div>
            <p style="margin-bottom: 0">
              External Background Image:
            </p>
            <input type="text" v-model="backgroundImage">
          </div> -->
          <!-- <div>
            <p style="margin-bottom: 0">
              External Watermark Image:
            </p>
            <input type="text" v-model="watermark.source">
          </div> -->
        </div>
      </div>
      
      <div class="output">
        <p>Output:</p>
        <img :src="image" style="border: solid 1px #000000">
      </div>
    </div>
  </div>
</template>

<style scoped>
  .flex-row {
    display: flex;
    flex-direction: row;
  }
  .button-container {
    display: flex;
    flex-direction: row;
  }
  .button-container > * {
    margin-top: 5px;
    margin-right: 10px;
  }
</style>