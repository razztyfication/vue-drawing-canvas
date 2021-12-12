'use strict';var vueDemi=require('vue-demi');function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}var VueDrawingCanvas = /*#__PURE__*/vueDemi.defineComponent({
  name: 'VueDrawingCanvas',
  props: {
    strokeType: {
      type: String,
      validator: function validator(value) {
        return ['dash', 'square', 'circle', 'triangle', 'half_triangle'].indexOf(value) !== -1;
      },
      default: function _default() {
        return 'dash';
      }
    },
    fillShape: {
      type: Boolean,
      default: function _default() {
        return false;
      }
    },
    width: {
      type: [String, Number],
      default: function _default() {
        return 600;
      }
    },
    height: {
      type: [String, Number],
      default: function _default() {
        return 400;
      }
    },
    image: {
      type: String,
      default: function _default() {
        return '';
      }
    },
    eraser: {
      type: Boolean,
      default: function _default() {
        return false;
      }
    },
    color: {
      type: String,
      default: function _default() {
        return '#000000';
      }
    },
    lineWidth: {
      type: Number,
      default: function _default() {
        return 5;
      }
    },
    lock: {
      type: Boolean,
      default: function _default() {
        return false;
      }
    },
    styles: {
      type: [Array, String, Object]
    },
    classes: {
      type: [Array, String, Object]
    },
    backgroundColor: {
      type: String,
      default: function _default() {
        return '#FFFFFF';
      }
    },
    backgroundImage: {
      type: String,
      default: function _default() {
        return null;
      }
    },
    watermark: {
      type: Object
    },
    saveAs: {
      type: String,
      validator: function validator(value) {
        return ['jpeg', 'png'].indexOf(value) !== -1;
      },
      default: function _default() {
        return 'png';
      }
    },
    canvasId: {
      type: String,
      default: function _default() {
        return 'VueDrawingCanvas';
      }
    }
  },
  data: function data() {
    return {
      loadedImage: null,
      drawing: false,
      context: null,
      images: [],
      strokes: {
        type: '',
        from: {
          x: 0,
          y: 0
        },
        coordinates: [],
        color: '',
        width: '',
        fill: false
      },
      guides: [],
      trash: []
    };
  },
  mounted: function mounted() {
    this.setContext();
  },
  watch: {
    backgroundImage: function backgroundImage() {
      this.loadedImage = null;
    }
  },
  methods: {
    setContext: function setContext() {
      var _this = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var canvas;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                canvas = document.querySelector('#' + _this.canvasId);
                _this.context = _this.context ? _this.context : canvas.getContext('2d');
                _context.next = 4;
                return _this.setBackground();

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }))();
    },
    clear: function clear() {
      this.context.clearRect(0, 0, this.width, this.height);
    },
    setBackground: function setBackground() {
      var _this2 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _this2.clear();

                _this2.context.fillStyle = _this2.backgroundColor;

                _this2.context.fillRect(0, 0, _this2.width, _this2.height);

                _context3.next = 5;
                return _this2.$nextTick( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                  return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          _context2.next = 2;
                          return _this2.drawBackgroundImage();

                        case 2:
                        case "end":
                          return _context2.stop();
                      }
                    }
                  }, _callee2);
                })));

              case 5:
                _this2.save();

              case 6:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }))();
    },
    drawBackgroundImage: function drawBackgroundImage() {
      var _this3 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (_this3.loadedImage) {
                  _context4.next = 4;
                  break;
                }

                return _context4.abrupt("return", new Promise(function (resolve) {
                  if (!_this3.backgroundImage) {
                    resolve();
                    return;
                  }

                  var image = new Image();
                  image.src = _this3.backgroundImage;

                  image.onload = function () {
                    _this3.context.drawImage(image, 0, 0, _this3.width, _this3.height);

                    _this3.loadedImage = image;
                    resolve();
                  };
                }));

              case 4:
                _this3.context.drawImage(_this3.loadedImage, 0, 0, _this3.width, _this3.height);

              case 5:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }))();
    },
    getCoordinates: function getCoordinates(event) {
      var x, y;

      if (event.touches && event.touches.length > 0) {
        var canvas = document.querySelector('#' + this.canvasId);
        var rect = canvas.getBoundingClientRect();
        x = event.touches[0].clientX - rect.left;
        y = event.touches[0].clientY - rect.top;
      } else {
        x = event.offsetX;
        y = event.offsetY;
      }

      return {
        x: x,
        y: y
      };
    },
    startDraw: function startDraw(event) {
      if (!this.lock) {
        this.drawing = true;
        var coordinate = this.getCoordinates(event);
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
    draw: function draw(event) {
      if (this.drawing) {
        if (!this.context) {
          this.setContext();
        }

        var coordinate = this.getCoordinates(event);

        if (this.eraser || this.strokeType === 'dash') {
          this.strokes.coordinates.push(coordinate);
          this.drawShape(this.strokes, false);
        } else {
          var coordinates;

          switch (this.strokeType) {
            case 'square':
              coordinates = [{
                x: coordinate.x,
                y: this.strokes.from.y
              }, {
                x: coordinate.x,
                y: coordinate.y
              }, {
                x: this.strokes.from.x,
                y: coordinate.y
              }, {
                x: this.strokes.from.x,
                y: this.strokes.from.y
              }];
              break;

            case 'triangle':
              var center = Math.floor((coordinate.x - this.strokes.from.x) / 2) < 0 ? Math.floor((coordinate.x - this.strokes.from.x) / 2) * -1 : Math.floor((coordinate.x - this.strokes.from.x) / 2);
              var width = this.strokes.from.x < coordinate.x ? this.strokes.from.x + center : this.strokes.from.x - center;
              coordinates = [{
                x: coordinate.x,
                y: this.strokes.from.y
              }, {
                x: width,
                y: coordinate.y
              }, {
                x: this.strokes.from.x,
                y: this.strokes.from.y
              }];
              break;

            case 'half_triangle':
              coordinates = [{
                x: coordinate.x,
                y: this.strokes.from.y
              }, {
                x: this.strokes.from.x,
                y: coordinate.y
              }, {
                x: this.strokes.from.x,
                y: this.strokes.from.y
              }];
              break;

            case 'circle':
              var radiusX = this.strokes.from.x - coordinate.x < 0 ? (this.strokes.from.x - coordinate.x) * -1 : this.strokes.from.x - coordinate.x;
              coordinates = [{
                x: this.strokes.from.x > coordinate.x ? this.strokes.from.x - radiusX : this.strokes.from.x + radiusX,
                y: this.strokes.from.y
              }, {
                x: radiusX,
                y: radiusX
              }];
              break;
          }

          this.guides = coordinates;
          this.drawGuide(true);
        }
      }
    },
    drawGuide: function drawGuide(closingPath) {
      var _this4 = this;

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
        this.guides.forEach(function (coordinate) {
          _this4.context.lineTo(coordinate.x, coordinate.y);
        });

        if (closingPath) {
          this.context.closePath();
        }
      }

      this.context.stroke();
    },
    drawShape: function drawShape(strokes, closingPath) {
      var _this5 = this;

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
        strokes.coordinates.forEach(function (stroke) {
          _this5.context.lineTo(stroke.x, stroke.y);
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
    stopDraw: function stopDraw() {
      if (this.drawing) {
        this.strokes.coordinates = this.guides.length > 0 ? this.guides : this.strokes.coordinates;
        this.images.push(this.strokes);
        this.redraw();
        this.drawing = false;
        this.trash = [];
      }
    },
    reset: function reset() {
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
    undo: function undo() {
      if (!this.lock) {
        var strokes = this.images.pop();

        if (strokes) {
          this.trash.push(strokes);
          this.redraw();
        }
      }
    },
    redo: function redo() {
      if (!this.lock) {
        var strokes = this.trash.pop();

        if (strokes) {
          this.images.push(strokes);
          this.redraw();
        }
      }
    },
    redraw: function redraw(output) {
      var _this6 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                output = typeof output !== 'undefined' ? output : true;
                _context5.next = 3;
                return _this6.setBackground().then(function () {
                  _this6.images.forEach(function (strokes) {
                    _this6.drawShape(strokes, _this6.type = false );
                  });
                }).then(function () {
                  if (output) {
                    _this6.save();
                  }
                });

              case 3:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }))();
    },
    wrapText: function wrapText(context, text, x, y, maxWidth, lineHeight) {
      var newLineRegex = /(\r\n|\n\r|\n|\r)+/g;
      var whitespaceRegex = /\s+/g;
      var lines = text.split(newLineRegex).filter(function (word) {
        return word.length > 0;
      });

      for (var lineNumber = 0; lineNumber < lines.length; lineNumber++) {
        var words = lines[lineNumber].split(whitespaceRegex).filter(function (word) {
          return word.length > 0;
        });
        var line = '';

        for (var n = 0; n < words.length; n++) {
          var testLine = line + words[n] + ' ';
          var metrics = context.measureText(testLine);
          var testWidth = metrics.width;

          if (testWidth > maxWidth && n > 0) {
            if (this.watermark.fontStyle && this.watermark.fontStyle.drawType && this.watermark.fontStyle.drawType === 'stroke') {
              context.strokeText(line, x, y);
            } else {
              context.fillText(line, x, y);
            }

            line = words[n] + ' ';
            y += lineHeight;
          } else {
            line = testLine;
          }
        }

        if (this.watermark.fontStyle && this.watermark.fontStyle.drawType && this.watermark.fontStyle.drawType === 'stroke') {
          context.strokeText(line, x, y);
        } else {
          context.fillText(line, x, y);
        }

        y += words.length > 0 ? lineHeight : 0;
      }
    },
    save: function save() {
      var _this7 = this;

      if (this.watermark) {
        var canvas = document.querySelector('#' + this.canvasId);
        var temp = document.createElement('canvas');
        var ctx = temp.getContext('2d');
        temp.width = this.width;
        temp.height = this.height;
        ctx.drawImage(canvas, 0, 0, this.width, this.height);

        if (this.watermark.type === 'Image') {
          var imageWidth = this.watermark.imageStyle ? this.watermark.imageStyle.width ? this.watermark.imageStyle.width : this.width : this.width;
          var imageHeight = this.watermark.imageStyle ? this.watermark.imageStyle.height ? this.watermark.imageStyle.height : this.height : this.height;
          var image = new Image();
          image.src = this.watermark.source;

          image.onload = function () {
            ctx.drawImage(image, _this7.watermark.x, _this7.watermark.y, imageWidth, imageHeight);

            _this7.$emit('update:image', temp.toDataURL('image/' + _this7.saveAs, 1));

            return temp.toDataURL('image/' + _this7.saveAs, 1);
          };
        } else if (this.watermark.type === 'Text') {
          var font = this.watermark.fontStyle ? this.watermark.fontStyle.font ? this.watermark.fontStyle.font : '20px serif' : '20px serif';
          var align = this.watermark.fontStyle ? this.watermark.fontStyle.textAlign ? this.watermark.fontStyle.textAlign : 'start' : 'start';
          var baseline = this.watermark.fontStyle ? this.watermark.fontStyle.textBaseline ? this.watermark.fontStyle.textBaseline : 'alphabetic' : 'alphabetic';
          var color = this.watermark.fontStyle ? this.watermark.fontStyle.color ? this.watermark.fontStyle.color : '#000000' : '#000000';
          ctx.font = font;
          ctx.textAlign = align;
          ctx.textBaseline = baseline;

          if (this.watermark.fontStyle && this.watermark.fontStyle.rotate) {
            var centerX, centerY;

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
              this.wrapText(ctx, this.watermark.source, this.watermark.x, this.watermark.y, this.watermark.fontStyle.width, this.watermark.fontStyle.lineHeight);
            } else {
              ctx.strokeText(this.watermark.source, this.watermark.x, this.watermark.y);
            }
          } else {
            ctx.fillStyle = color;

            if (this.watermark.fontStyle && this.watermark.fontStyle.width) {
              this.wrapText(ctx, this.watermark.source, this.watermark.x, this.watermark.y, this.watermark.fontStyle.width, this.watermark.fontStyle.lineHeight);
            } else {
              ctx.fillText(this.watermark.source, this.watermark.x, this.watermark.y);
            }
          }

          this.$emit('update:image', temp.toDataURL('image/' + this.saveAs, 1));
          return temp.toDataURL('image/' + this.saveAs, 1);
        }
      } else {
        var _canvas = document.querySelector('#' + this.canvasId);

        this.$emit('update:image', _canvas.toDataURL('image/' + this.saveAs, 1));
        return _canvas.toDataURL('image/' + this.saveAs, 1);
      }
    },
    isEmpty: function isEmpty() {
      return this.images.length > 0 ? false : true;
    }
  },
  render: function render() {
    var _this8 = this;

    if (vueDemi.isVue2) {
      return vueDemi.h('canvas', _objectSpread2({
        attrs: {
          id: this.canvasId,
          width: this.width,
          height: this.height
        },
        style: _objectSpread2({
          'touchAction': 'none'
        }, this.styles),
        class: this.classes,
        on: {
          mousedown: function mousedown(event) {
            return _this8.startDraw(event);
          },
          mousemove: function mousemove(event) {
            return _this8.draw(event);
          },
          mouseup: function mouseup(event) {
            return _this8.stopDraw(event);
          },
          mouseleave: function mouseleave(event) {
            return _this8.stopDraw(event);
          },
          touchstart: function touchstart(event) {
            return _this8.startDraw(event);
          },
          touchmove: function touchmove(event) {
            return _this8.draw(event);
          },
          touchend: function touchend(event) {
            return _this8.stopDraw(event);
          },
          touchleave: function touchleave(event) {
            return _this8.stopDraw(event);
          },
          touchcancel: function touchcancel(event) {
            return _this8.stopDraw(event);
          }
        }
      }, this.$props));
    }

    return vueDemi.h('canvas', {
      id: this.canvasId,
      height: this.height,
      width: this.width,
      style: _objectSpread2({
        'touchAction': 'none'
      }, this.styles),
      class: this.classes,
      onMousedown: function onMousedown($event) {
        return _this8.startDraw($event);
      },
      onMousemove: function onMousemove($event) {
        return _this8.draw($event);
      },
      onMouseup: function onMouseup($event) {
        return _this8.stopDraw($event);
      },
      onMouseleave: function onMouseleave($event) {
        return _this8.stopDraw($event);
      },
      onTouchstart: function onTouchstart($event) {
        return _this8.startDraw($event);
      },
      onTouchmove: function onTouchmove($event) {
        return _this8.draw($event);
      },
      onTouchend: function onTouchend($event) {
        return _this8.stopDraw($event);
      },
      onTouchleave: function onTouchleave($event) {
        return _this8.stopDraw($event);
      },
      onTouchcancel: function onTouchcancel($event) {
        return _this8.stopDraw($event);
      }
    });
  }
});module.exports=VueDrawingCanvas;