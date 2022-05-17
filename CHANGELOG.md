# [v1.0.14](https://github.com/razztyfication/vue-drawing-canvas)

- Bug fix background color not working

<br>

# [v1.0.13](https://github.com/razztyfication/vue-drawing-canvas/tree/v1.0.13)

- Bug fix missing line guide when background image exist

<br>

# [v1.0.12](https://github.com/razztyfication/vue-drawing-canvas/tree/v1.0.12)

- Bug fix canvas break when draw circle with no coordinates

<br>

# [v1.0.11](https://github.com/razztyfication/vue-drawing-canvas/tree/v1.0.11)

- Added new prop **outputWidth** and **outputHeight**
- Bug fixes

<br>

# [v1.0.10](https://github.com/razztyfication/vue-drawing-canvas/tree/v1.0.10)

- Eraser no longer erase background image.
- Added new prop **lineCap** and **lineJoin**
- Added new value `"line"` on **strokeStyle** to draw straight line

<br>

# [v1.0.9](https://github.com/razztyfication/vue-drawing-canvas/tree/v1.0.9)

- BUG FIX redraw function with wrong stroke type
- BUG FIX typescript type declaration not compatible with `noImplicitAny`
- Added new prop **additionalImages** will accept Array of `watermark` Object to draw either text or insert multiple image on canvas
- Remove build for `ssr` and `unpkg`

<br>

# [v1.0.8](https://github.com/razztyfication/vue-drawing-canvas/tree/v1.0.8)

- BUG FIX not working on drawing tablet and stylus

<br>

# [v1.0.7](https://github.com/razztyfication/vue-drawing-canvas/tree/v1.0.7)

- Added new method **getAllStrokes()** to get all strokes and shapes from canvas.
- Added new prop **initialImage** to draw all strokes and shapes from previously worked canvas.

See [demo](https://codesandbox.io/s/vue-drawing-canvas-107-rc1-dcoiy) to see it in action.

<br>

# [v1.0.6](https://github.com/razztyfication/vue-drawing-canvas/tree/v1.0.6)

- Added new props **canvasId** to allow multiple canvas on one page. Thank to [mortegro](https://github.com/mortegro)

<br>

# [v1.0.5](https://github.com/razztyfication/vue-drawing-canvas/tree/v1.0.5)

- BUG FIX missing side when drawing shapes
- BUG FIX add missing return on null background image

<br>

# [v1.0.4](https://github.com/razztyfication/vue-drawing-canvas/tree/v1.0.4)

- Reworked multiline of text for watermark

example:

```js
export default {
  ...
  data() {
    return {
      ...
      watermark: {
        type: "Text",
        source: `This is\nWatermark
        TEXT`,
        x: 200,
        y: 180,
        fontStyle: {
          width: 200,
          lineHeight: 48,
          color: '#FF0000',
          font: 'bold 48px roboto',
          drawType: 'fill',
          textAlign: 'left',
          textBaseline: 'top',
          rotate: 0
        }
      }
    }
}
```

<br>

# [v1.0.3](https://github.com/razztyfication/vue-drawing-canvas/tree/v1.0.3)

- Wrap watermark text to multiline. Thanks to [mishahobanov](https://github.com/mishahobanov)

<br>

# [v1.0.2](https://github.com/razztyfication/vue-drawing-canvas/tree/v1.0.2)

- Bug Fix Background Image not update after redraw()

<br>

# [v1.0.1](https://github.com/razztyfication/vue-drawing-canvas/tree/v1.0.1)

- Rename file from .vue to .ts
- Update [README.md](https://github.com/razztyfication/vue-drawing-canvas/blob/master/README.md)
- Added default value on [Watermark Object](https://github.com/razztyfication/vue-drawing-canvas/blob/master/README.md#watermark-object)
- Bug Fix Redo with Background Color instead of white
- Added Props `saveAs`, `strokeType` and `fillShape`

<br>

# [v1.0.0](https://github.com/razztyfication/vue-drawing-canvas/tree/v1.0.0)