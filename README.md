<h1>vue-drawing-canvas</h1>

VueJS Component for drawing on canvas.

Support for both Vue 3 and Vue 2 + [Composition API](https://github.com/vuejs/composition-api)

<br><br>

<h2>Demo</h2>

### Vue 3

[![Vue 3 Drawing Canvas Demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/vue-3-drawing-canvas-demo-ihmmz)

### Vue 2

> Deployed on a nuxt container which have access to terminal

<br>

[![vue-drawing-canvas](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/vue-drawing-canvas-p4slb)

> Note:
> If you're using nuxt.js and receive error `Object(...) is not a function` please refer to this [issue](https://github.com/razztyfication/vue-drawing-canvas/issues/13)

<br><br>

<h1>Table of Contents</h1>

- [Installation](#installation)
- [Usage](#usage)
  - [Props](#props)
    - [Watermark Object](#watermark-object)
  - [Methods](#methods)
- [Changelog](#changelog)
- [License](#license)

<br><br>

# Installation

Install using package manager:

```bash
npm install --save-dev vue-drawing-canvas

# or with Vue 2

npm install --save-dev vue-drawing-canvas @vue/composition-api
```

Then add it to your component files

```html
<!-- MyComponent.vue -->

<template>
  <vue-drawing-canvas ref="VueCanvasDrawing" />
</template>

<script>
  import VueDrawingCanvas from "vue-drawing-canvas";

  export default {
    name: "MyComponent",
    components: {
      VueDrawingCanvas,
    },
  };
</script>
```

<br><br>

# Usage

## Props

<br>

| Name             |         Type          |   Default Value    | Description                                                                                                                                                                                                                                                    |
| ---------------- | :-------------------: | :----------------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| canvasId         |        String         | `VueDrawingCanvas` | Specifies your canvas id                                                                                                                                                                                                                                       |
| width            |    String, Number     |       `600`        | Specifies canvas width                                                                                                                                                                                                                                         |
| height           |    String, Number     |       `400`        | Specifies canvas height                                                                                                                                                                                                                                        |
| image            |        String         |                    | Your v-model to get canvas output to an base64 image                                                                                                                                                                                                           |
| strokeType       |        String         |      `"dash"`      | Specifies stroke type to draw on canvas.<br><br>Accepted value `"dash"`, `"line"`, `"circle"`, `"square"`, `"triangle"`, `"half_triangle"`                                                                                                                     |
| fillShape        |        Boolean        |      `false`       | Specifies if the shape must be filled with the current fill style                                                                                                                                                                                              |
| eraser           |        Boolean        |      `false`       | Props to change state from drawing to erasing                                                                                                                                                                                                                  |
| color            |        String         |    `"#000000"`     | Specifies the color, gradient, or pattern to use for the strokes                                                                                                                                                                                               |
| lineWidth        |        Number         |        `5`         | Sets the thickness of line                                                                                                                                                                                                                                     |
| lineCap          |        String         |     `"round"`      | Determines the shape used to draw the end points of line.<br><br>Accepted value `"round"`, `"square"`, `"butt"`.<br>Refer to [this site](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineCap) for more information.              |
| lineJoin         |        String         |     `"miter"`      | determines the shape used to join two line segments where they meet.<br><br>Accepted value `"round"`, `"miter"`, `"square"`.<br>Refer to [this site](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineJoin) for more information. |
| lock             |        Boolean        |      `false`       | Lock canvas for drawing                                                                                                                                                                                                                                        |
| backgroundColor  |        String         |    `"#FFFFFF"`     | Set background color on your canvas                                                                                                                                                                                                                            |
| backgroundImage  |        String         |                    | Set background image on your canvas<br><br>**_Be carefull for performance issue when using this props !!_**                                                                                                                                                    |
| initialImage     |         Array         |        `[]`        | Draw strokes and shapes from canvas you've worked before. [Demo](https://codesandbox.io/s/vue-drawing-canvas-107-rc1-dcoiy)                                                                                                                                    |
| additionalImages |         Array         |        `[]`        | Accept Array of [watermark](#watermark-object) Object to draw either text or insert multiple image on canvas<br><br>**_Be carefull for performance issue when using this props !!_**                                                                           |
| classes          | Array, String, Object |                    | Specifies your own classes to canvas                                                                                                                                                                                                                           |
| styles           | Array, String, Object |                    | Specifies your own styles to canvas                                                                                                                                                                                                                            |
| watermark        |        Object         |                    | Put watermark text/image on your image output<br><br>(see details in the next section below)                                                                                                                                                                   |
| saveAs           |        String         |      `"png"`       | Specifies output type. This props accept either `"png"` or `"jpeg"`                                                                                                                                                                                            |
| outputWidth      |        Number         |   `this.width`     | Specifies image output width, if `undefined` then canvas width will be used                                                                                                                                                                                    |
| outputHeight     |        Number         |   `this.height`    | Specifies image output height, if `undefined` then canvas height will be used                                                                                                                                                                                  |

<br>

### Watermark Object

<br>

```js
{
  // Specifies your watermark type. Type can be either "Text" or "Image"
  //
  // type: String
  // required: true
  // validator: (value) => { return ["Text", "Image"].includes(value) }
  type: "Text",
  // Specifies your watermark source
  // If type is "Text" enter your watermark text here
  // if type if "Image" enter your uploaded file createObjectURL(event.target.files[0]) Work best with .png file
  //
  // type: String
  // required: true
  source: "Watermark",
  // The x-axis coordinate of the point at which to begin drawing the watermark,
  // in pixels
  //
  // type: Number
  // required: true
  x: 200,
  // The y-axis coordinate of the point at which to begin drawing the watermark,
  // in pixels
  //
  // type: Number
  // required: true
  y: 180,
  // Specifies width and height for your watermark image
  //
  // type: Object
  // required: false
  imageStyle: {
    // The width to draw the image in the canvas
    //
    // type: Number
    // required: false
    // default: () => this.width
    width: 600,
    // The height to draw the image in the canvas
    //
    // type: Number
    // required: false
    // default: () => this.height
    height: 400
  },
  // Specifies text style for your watermark
  //
  // type: Object
  // required: false
  fontStyle: {
    // The maximum number of pixels wide the text may be once rendered.
    // If not specified, there is no limit to the width of the text.
    //
    // type: Number
    // required: false
    width: 200,
    // Sets the height of text in pixels. Usually this value has same value with font
    //
    // type: Number
    // required: false
    // default: () => 20
    lineHeight: 48,
    // Specifies the color, gradient, or pattern to use for the text
    //
    // type: String
    // required: false
    // default: () => '#000000'
    color: '#FF0000',
    // Specifies the current text style to use when drawing text.
    // font: '{fontWeight} {fontSize} {fontFamily}'
    //
    // type: String
    // required: false
    // default: () => '20px serif'
    font: 'bold 48px serif',
    // Specifies drawing type to use when drawing text.
    //
    // type: String
    // required: false
    // validator: (value) => { return ["fill", "stroke"].includes(value) }
    // default: () => 'fill'
    drawType: 'fill',
    // Specifies the current text alignment used when drawing text
    // The alignment is relative to the x value
    //
    // type: String
    // required: false
    // validator: (value) => { return ["left", "right", "center", "start", "end"].includes(value) }
    // default: () => 'start'
    textAlign: 'left',
    // Specifies the current text baseline used when drawing text
    //
    // type: String
    // required: false
    // validator: (value) => { return ["top", "hanging", "middle", "alphabetic", "ideographic", "bottom"].includes(value) }
    // default: () => 'alphabetic'
    textBaseline: 'top',
    // The rotation angle, clockwise in radians
    //
    // type: Number
    // required: false
    rotate: 45
  }
}
```

<br><br>

## Methods

<br>

| Method Name           |          Return Value           | Description                                           |
| --------------------- | :-----------------------------: | ----------------------------------------------------- |
| getCoordinates(event) |        `{ x: 0, y: 0 }`         | Get x-axis and y-axis coordinates from current canvas |
| reset()               |                                 | Reset current canvas to new state                     |
| undo()                |                                 | Remove last drawing stroke on current canvas          |
| redo()                |                                 | Re-draw last removed stroke on current canvas         |
| redraw()              |                                 | Redraw all strokes on current canvas                  |
| isEmpty()             |        `true` or `false`        | Get current canvas empty state                        |
| getAllStrokes()       | _`Array of strokes and shapes`_ | Get all strokes and shapes from canvas                |

<br><br>

# Changelog

[Read here](https://github.com/razztyfication/vue-drawing-canvas/blob/master/CHANGELOG.md)

<br><br>

# License

[MIT](https://github.com/razztyfication/vue-drawing-canvas/blob/master/LICENSE.md)
