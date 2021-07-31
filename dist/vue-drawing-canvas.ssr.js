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
}var script = /*#__PURE__*/vueDemi.defineComponent({
  name: 'VueDrawingCanvas',
  props: {
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
    }
  },
  data: function data() {
    return {
      drawing: false,
      offsetX: 0,
      offsetY: 0,
      context: null,
      images: [],
      strokes: [],
      trash: []
    };
  },
  mounted: function mounted() {
    this.setContext();
  },
  methods: {
    setContext: function setContext() {
      var canvas = document.querySelector('#VueDrawingCanvas');
      this.context = this.context ? this.context : canvas.getContext('2d');
      this.setBackground();
      this.save();
    },
    clear: function clear() {
      this.context.clearRect(0, 0, this.width, this.height);
    },
    setBackground: function setBackground() {
      var _this = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var image;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _this.clear();

                _this.context.fillStyle = _this.backgroundColor;

                _this.context.fillRect(0, 0, _this.width, _this.height);

                if (!_this.backgroundImage) {
                  _context.next = 9;
                  break;
                }

                image = new Image();
                image.src = _this.backgroundImage;
                _context.next = 8;
                return _this.drawBackgroundImage(image);

              case 8:
                image.onload = _context.sent;

              case 9:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }))();
    },
    drawBackgroundImage: function drawBackgroundImage(image) {
      var _this2 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _this2.context.drawImage(image, 0, 0, _this2.width, _this2.height);

                _this2.save();

              case 2:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }))();
    },
    getCoordinates: function getCoordinates(event) {
      var x, y;

      if (event.touches && event.touches.length > 0) {
        var canvas = document.querySelector('#VueDrawingCanvas');
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
        this.strokes = [];
        var coordinate = this.getCoordinates(event);
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
    drawLine: function drawLine(color, width, from, to) {
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
    draw: function draw(event) {
      if (this.drawing) {
        if (!this.context) {
          this.setContext();
        }

        var coordinate = this.getCoordinates(event);
        this.drawLine(this.eraser ? this.backgroundColor : this.color, this.lineWidth, {
          x: this.offsetX,
          y: this.offsetY
        }, {
          x: coordinate.x,
          y: coordinate.y
        });
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
    stopDraw: function stopDraw() {
      if (this.drawing) {
        if (this.strokes.length > 1) {
          this.images.push(this.strokes);
        }

        this.drawing = false;
        this.trash = [];
      }
    },
    reset: function reset() {
      if (!this.lock) {
        this.setBackground();
        this.images = [];
        this.strokes = [];
        this.trash = [];
        this.save();
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
    redraw: function redraw() {
      var _this3 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return _this3.setBackground().then(function () {
                  var start;

                  _this3.images.forEach(function (strokes) {
                    start = null;
                    var color = strokes[0].color;
                    var width = strokes[0].width;
                    _this3.context.strokeStyle = color;
                    _this3.context.lineWidth = width;
                    _this3.context.lineJoin = 'round';

                    _this3.context.beginPath();

                    strokes.forEach(function (path) {
                      if (start) {
                        _this3.context.lineTo(path.x, path.y);

                        _this3.context.stroke();
                      } else {
                        _this3.context.moveTo(path.x, path.y);

                        start = path;
                      }
                    });
                  });

                  _this3.save();
                });

              case 2:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }))();
    },
    save: function save() {
      var _this4 = this;

      if (this.watermark) {
        var canvas = document.querySelector('#VueDrawingCanvas');
        var temp = document.createElement('canvas');
        var ctx = temp.getContext('2d');
        temp.width = this.width;
        temp.height = this.height;
        ctx.drawImage(canvas, 0, 0, this.width, this.height);

        if (this.watermark.type === 'Image') {
          var image = new Image();
          image.src = this.watermark.source;

          image.onload = function () {
            ctx.drawImage(image, _this4.watermark.x, _this4.watermark.y, _this4.watermark.imageStyle.width, _this4.watermark.imageStyle.height);

            _this4.$emit('update:image', temp.toDataURL());

            return temp.toDataURL();
          };
        } else if (this.watermark.type === 'Text') {
          ctx.font = this.watermark.fontStyle.font;
          ctx.textAlign = this.watermark.fontStyle.textAlign;
          ctx.textBaseline = this.watermark.fontStyle.textBaseline;
          var centerX = this.watermark.x + Math.floor(this.watermark.fontStyle.width / 2); // kalo ga ada width nya ga usah di translate

          var centerY = this.watermark.y + Math.floor(this.watermark.fontStyle.lineHeight / 2); // kalo ga ada width nya ga usah di translate

          ctx.translate(centerX, centerY);
          ctx.rotate(this.watermark.fontStyle.rotate * Math.PI / 180);
          ctx.translate(centerX * -1, centerY * -1);

          if (this.watermark.fontStyle.drawType === 'stroke') {
            ctx.strokeStyle = this.watermark.fontStyle.color;
            ctx.strokeText(this.watermark.source, this.watermark.x, this.watermark.y, this.watermark.fontStyle.width);
          } else {
            ctx.fillStyle = this.watermark.fontStyle.color;
            ctx.fillText(this.watermark.source, this.watermark.x, this.watermark.y, this.watermark.fontStyle.width);
          }

          this.$emit('update:image', temp.toDataURL());
          return temp.toDataURL();
        }
      } else {
        var _canvas = document.querySelector('#VueDrawingCanvas');

        this.$emit('update:image', _canvas.toDataURL());
        return _canvas.toDataURL();
      }
    },
    isEmpty: function isEmpty() {
      return this.images.length > 0 ? false : true;
    }
  },
  render: function render() {
    var _this5 = this;

    if (vueDemi.isVue2) {
      return vueDemi.h('canvas', _objectSpread2({
        attrs: {
          id: 'VueDrawingCanvas',
          width: this.width,
          height: this.height
        },
        style: _objectSpread2({
          'touchAction': 'none'
        }, this.styles),
        class: this.classes,
        on: {
          mousedown: function mousedown(event) {
            return _this5.startDraw(event);
          },
          mousemove: function mousemove(event) {
            return _this5.draw(event);
          },
          mouseup: function mouseup(event) {
            return _this5.stopDraw(event);
          },
          mouseleave: function mouseleave(event) {
            return _this5.stopDraw(event);
          },
          touchstart: function touchstart(event) {
            return _this5.startDraw(event);
          },
          touchmove: function touchmove(event) {
            return _this5.draw(event);
          },
          touchend: function touchend(event) {
            return _this5.stopDraw(event);
          },
          touchleave: function touchleave(event) {
            return _this5.stopDraw(event);
          },
          touchcancel: function touchcancel(event) {
            return _this5.stopDraw(event);
          }
        }
      }, this.$props));
    }

    return vueDemi.h('canvas', {
      id: 'VueDrawingCanvas',
      height: this.height,
      width: this.width,
      style: this.styles,
      class: this.classes,
      onMousedown: function onMousedown($event) {
        return _this5.startDraw($event);
      },
      onMousemove: function onMousemove($event) {
        return _this5.draw($event);
      },
      onMouseup: function onMouseup($event) {
        return _this5.stopDraw($event);
      },
      onMouseleave: function onMouseleave($event) {
        return _this5.stopDraw($event);
      },
      onTouchstart: function onTouchstart($event) {
        return _this5.startDraw($event);
      },
      onTouchmove: function onTouchmove($event) {
        return _this5.draw($event);
      },
      onTouchend: function onTouchend($event) {
        return _this5.stopDraw($event);
      },
      onTouchleave: function onTouchleave($event) {
        return _this5.stopDraw($event);
      },
      onTouchcancel: function onTouchcancel($event) {
        return _this5.stopDraw($event);
      }
    });
  }
});function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}var css_248z = "\n#VueDrawingCanvas[data-v-73e835f2] {\r\n    touch-action: none;\n}\r\n";
styleInject(css_248z);script.__scopeId = "data-v-73e835f2";module.exports=script;