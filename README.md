<h1>vue-drawing-canvas</h1>

VueJS Component for drawing on canvas.

Support for both Vue 3 and Vue 2 + [Composition API](https://github.com/vuejs/composition-api)

<br><br>

<h2>Demo</h2>

---

_Work in progress_
<!-- [![Vue Drawing Canvas Demo](https://codesandbox.io/static/img/play-codesandbox.svg)]() -->

<br><br>

<h1>Table of Contents</h1>

- [Installation](#installation)
- [Usage](#usage)
  - [Props](#props)
    - [Watermark Object](#watermark-object)
  - [Methods](#methods)
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
  <vue-drawing-canvas
    ref="VueCanvasDrawing"
  />
</template>

<script>
import VueDrawingCanvas from 'vue-drawing-canvas';

export default {
  name: 'MyComponent',
  components: {
    VueDrawingCanvas
  }
}
</script>
```

<br><br>

# Usage

## Props

---

<br>

| Name            | Type                  | Default Value | Description                                                                                                 |
|-----------------|:---------------------:|:-------------:|-------------------------------------------------------------------------------------------------------------|
| width           | String, Number        | `600`         | Specifies canvas width                                                                                      |
| height          | String, Number        | `400`         | Specifies canvas height                                                                                     |
| image           | String                |               | Your v-model to get canvas output to an base64 image                                                        |
| eraser          | Boolean               | `false`       | Props to change state from drawing to erasing                                                               |
| color           | String                | `"#000000"`   | Specifies the color, gradient, or pattern to use for the strokes                                            |
| lineWidth       | Number                | `5`           | Sets the thickness of line                                                                                  |
| lock            | Boolean               | `false`       | Lock canvas for drawing                                                                                     |
| backgroundColor | String                | `"#FFFFFF"`   | Set background color on your canvas                                                                         |
| backgroundImage | String                |               | Set background image on your canvas<br><br>**_Be carefull for performance issue when using this props !!_** |
| classes         | Array, String, Object |               | Specifies your own classes to canvas                                                                           |
| styles          | Array, String, Object |               | Specifies your own styles to canvas                                                                            |
| watermark       | Object                |               | Put watermark text/image on your image output<br><br>(see details in the next section below)                |

<br>

### Watermark Object

<br>

```js
{
  // Specifies your watermark typpe
  // type can be either "Text" or "Image"
  type: "Text",
  // Specifies your watermark source
  // If type === "Text" enter your watermark text here
  // if "Image" enter your uploaded file createObjectURL(event.target.files[0])
  source: "Watermark",
  // The x-axis coordinate of the point at which to begin drawing the watermark,
  // in pixels
  x: 200,
  // The y-axis coordinate of the point at which to begin drawing the watermark,
  // in pixels
  y: 180,
  // Specifies width and height for your watermark image 
  imageStyle: {
    // The width to draw the image in the canvas
    width: 600,
    // The height to draw the image in the canvas
    height: 400
  },
  // Specifies text style for your watermark
  fontStyle: {
    // The maximum number of pixels wide the text may be once rendered.
    // If not specified, there is no limit to the width of the text. 
    width: 200,
    // Sets the thickness of lines
    lineHeight: 48,
    // Specifies the color, gradient, or pattern to use for the text
    color: '#FF0000',
    // Specifies the current text style to use when drawing text.
    // font: '{fontWeight} {fontSize} {fontFamily}'
    font: 'bold 48px serif',
    // Specifies drawing type to use when drawing text.
    // drawType: "fill" || "stroke"
    drawType: 'fill',
    // Specifies the current text alignment used when drawing text
    // The alignment is relative to the x value
    textAlign: 'left',
    // Specifies the current text baseline used when drawing text
    // textBaseline: "top" || "hanging" || "middle" || "alphabetic" || "ideographic" || "bottom"
    textBaseline: 'top',
    // The rotation angle, clockwise in radians
    rotate: 45
  }
}
```

<br><br>

## Methods

---

<br>

| Method Name           | Return Value      | Description                                           |
|-----------------------|:-----------------:|-------------------------------------------------------|
| getCoordinates(event) | `{ x: 0, y: 0 }`  | Get x-axis and y-axis coordinates from current canvas |
| reset()               |                   | Reset current canvas to new state                     |
| undo()                |                   | Remove last drawing stroke on current canvas          |
| redo()                |                   | Re-draw last removed stroke on current canvas         |
| redraw()              |                   | Redraw all strokes on current canvas                  |
| isEmpty()             | `true` or `false` | Get current canvas empty state                        |

<br><br>

# License
[MIT](https://github.com/razztyfication/vue-drawing-canvas/blob/master/LICENSE.md)
