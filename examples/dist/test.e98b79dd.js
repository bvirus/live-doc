// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/parcel/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../node_modules/parcel/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"../node_modules/parcel/src/builtins/bundle-url.js"}],"../src/live-styles.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../node_modules/parcel/src/builtins/css-loader.js"}],"../src/util.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clamp = clamp;
exports.distance = distance;
exports.cancelEvent = cancelEvent;
exports.smoothstep = smoothstep;
exports.smoothBetween = smoothBetween;
exports.getPositionOnAxis = exports.getBounds = exports.getWindowSize = void 0;

// force number between two values
function clamp(val, min, max) {
  return Math.max(min, Math.min(val, max));
}

function distance(x, y) {
  return Math.abs(x - y);
}

function cancelEvent(ev) {
  ev.preventDefault();
  ev.stopPropagation();
} // from https://thebookofshaders.com/glossary/?search=smoothstep


function smoothstep(x, min, max) {
  var t = clamp(distance(x, min) / distance(max, min), 0.0, 1.0);
  return t * t * (3.0 - 2.0 * t);
}

function smoothBetween(val, _ref) {
  var min = _ref.min,
      max = _ref.max;
  return clamp(min + distance(max, min) * val, min, max);
}

var getWindowSize = function getWindowSize(isX) {
  return isX ? window.innerWidth : window.innerHeight;
};

exports.getWindowSize = getWindowSize;

var getBounds = function getBounds(isX, el) {
  if (el instanceof Window) {
    return {
      min: 0,
      max: getWindowSize()
    };
  } else {
    var rect = el.getBoundingClientRect();
    var min = isX ? rect.left : rect.top;
    var max = isX ? min + rect.width : min + rect.height;
    return {
      min: min,
      max: el.clientWidth
    };
  }
};

exports.getBounds = getBounds;

var getPositionOnAxis = function getPositionOnAxis(isX, o) {
  return isX ? o.clientX : o.clientY;
};

exports.getPositionOnAxis = getPositionOnAxis;
},{}],"../src/store.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeStore = makeStore;

var _util = require("./util");

var errMessage = "\nmust provide a config object, with range to makeStore!\nExample: makeStore({ range: { min: 0, max: 10 } })";

function makeStore(config) {
  var hasPrev = false;
  var prev = null;
  if (!config || !config.range || !config.range.min || !config.range.max) throw new Error(errMessage);
  var frameId = null;
  var listeners = [];

  function set(x) {
    if (frameId !== null) cancelAnimationFrame(frameId);
    if (listeners.length === 0) return;
    if (hasPrev && x == prev) return;
    x = (0, _util.clamp)(x, config.range.min, config.range.max);
    frameId = requestAnimationFrame(function () {
      frameId = null;
      listeners.forEach(function (l) {
        return config.map ? l(config.map(x)) : l(x);
      });
    });
  }

  function listen(f) {
    listeners.push(f);
    return function () {
      listeners = listeners.filter(function (x) {
        return x !== f;
      });
    };
  }

  var destroy = function destroy() {
    return cancelAnimationFrame(frameId);
  };

  if (!config.start) config.start = config.range.min;
  return {
    set: set,
    listen: listen,
    range: config.range,
    start: config.start,
    destroy: destroy
  };
}
},{"./util":"../src/util.js"}],"../src/live-drag.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeDraggable = makeDraggable;

var _util = require("./util.js");

function makeDraggable(element, store, config) {
  if (!config.axis) config.axis = 'y';

  var isX = function isX() {
    return 'x' === config.axis;
  };

  function handleStart(ev) {
    (0, _util.cancelEvent)(ev);

    function handleMove(ev) {
      (0, _util.cancelEvent)(ev);
      var pos = (0, _util.getPositionOnAxis)(isX(), ev);
      var zeroPos = (0, _util.getBounds)(isX(), element).min;
      var maxPos = (0, _util.getBounds)(isX(), config.container).max;
      var val = (0, _util.smoothBetween)((pos - zeroPos) / maxPos, store.range);
      store.set(val);
    }

    element.classList.add('live-active');
    store.set(store.range.min);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', function () {
      window.removeEventListener("mousemove", handleMove);
      element.classList.remove('live-active');
    }, {
      once: true
    });
    handleMove(ev);
  }

  function handleDblClick() {
    store.set(store.start);
  }

  function destroy() {
    element.removeEventListener('mousedown', handleStart);
    if (config.doubleClickReset) element.removeEventListener('dblclick', handleDblClick);
  }

  element.addEventListener('mousedown', handleStart);
  element.classList.add('live');
  if (config.doubleClickReset) element.addEventListener('dblclick', handleDblClick);
  return destroy;
}
},{"./util.js":"../src/util.js"}],"../src/drag-number.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeDraggableNumber = makeDraggableNumber;

var _liveDrag = require("./live-drag");

var defaultConfig = {
  axis: 'y',
  doubleClickReset: false,
  changeFactor: 3
};

function makeDraggableNumber(element, store, config, render) {
  var _config = Object.assign({}, defaultConfig);

  config = Object.assign(_config, config);

  var destroyDrag = function destroyDrag() {};

  if (!config.disabled) destroyDrag = (0, _liveDrag.makeDraggable)(element, store, config, render);
  var stopListening = store.listen(render);
  store.set(store.start);
  return function () {
    destroyDrag();
    stopListening();
  };
}
},{"./live-drag":"../src/live-drag.js"}],"../src/slider.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sliderPercent = sliderPercent;
exports.slider = slider;
exports.createSlider = createSlider;

var _dragNumber = require("./drag-number");

var _util = require("./util");

function sliderPercent(v, store) {
  return (0, _util.distance)(v, store.range.min) / (0, _util.distance)(store.range.min, store.range.max);
}

function slider(element, store, config) {
  var _createSlider = createSlider(),
      container = _createSlider.container,
      setWidth = _createSlider.setWidth;

  element.classList.add('_live_group'); // add clearfix hack

  element.appendChild(container);
  config.container = element;
  var destroy = (0, _dragNumber.makeDraggableNumber)(element, store, config, function (v) {
    if (config.format) v = config.format(v);
    var amount = sliderPercent(v, store);
    setWidth(amount);
  });
  return function () {
    destroy();
    element.removeChild(container);
  };
}

function createSlider() {
  var container = document.createElement('div');
  container.classList.add('live-slider');
  Object.assign(container.style, {
    position: "relative",
    display: "inline-block",
    width: "100%",
    minHeight: "10px"
  });
  var background = document.createElement("span");
  background.classList.add('live-slider-background');
  Object.assign(background.style, {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#DDD",
    left: "0",
    top: "0"
  });
  var fill = document.createElement("span");
  fill.classList.add('live-slider-fill');
  Object.assign(fill.style, {
    height: "100%",
    backgroundColor: "blue",
    float: "left" // don't use left, or top, properties here
    // we need relative positioning

  });
  background.appendChild(fill);
  container.appendChild(background);
  return {
    container: container,
    setWidth: function setWidth(x) {
      fill.style.width = x * 100 + "%";
    }
  };
}
},{"./drag-number":"../src/drag-number.js","./util":"../src/util.js"}],"../src/number.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.number = number;

var _dragNumber = require("./drag-number");

var _slider = require("./slider");

var _util = require("./util");

function number(element, store, config) {
  element.classList.add('live-number');
  config.container = window;

  function popupSlider() {}

  element.addEventListener('mousedown', function (ev) {
    var slider = (0, _slider.createSlider)();
    var rect = element.getBoundingClientRect();
    var sliderBounds = slider.container.getBoundingClientRect();
    Object.assign(slider.container.style, {
      position: 'absolute',
      top: rect.top + rect.height + 5 + "px",
      left: rect.left - 50 + "px",
      width: "100px" // make dynamic

    });
    document.body.appendChild(slider.container);
    var destroy = store.listen(function (x) {
      slider.setWidth((0, _slider.sliderPercent)(x, store));
    });
    window.addEventListener('mouseup', function () {
      document.body.removeChild(slider.container);
    }, {
      once: true
    });
  });
  var destroyNumber = (0, _dragNumber.makeDraggableNumber)(element, store, config, function (v) {
    if (config.format) v = config.format(v);
    element.textContent = v;
  });
  return function () {
    destroyNumber();
  };
}
},{"./drag-number":"../src/drag-number.js","./slider":"../src/slider.js","./util":"../src/util.js"}],"../index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.text = text;
Object.defineProperty(exports, "makeStore", {
  enumerable: true,
  get: function () {
    return _store.makeStore;
  }
});
Object.defineProperty(exports, "number", {
  enumerable: true,
  get: function () {
    return _number.number;
  }
});
Object.defineProperty(exports, "slider", {
  enumerable: true,
  get: function () {
    return _slider.slider;
  }
});

require("./src/live-styles.css");

var _store = require("./src/store");

var _number = require("./src/number");

var _slider = require("./src/slider");

function text(element) {}
},{"./src/live-styles.css":"../src/live-styles.css","./src/store":"../src/store.js","./src/number":"../src/number.js","./src/slider":"../src/slider.js"}],"test.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../node_modules/parcel/src/builtins/css-loader.js"}],"test.js":[function(require,module,exports) {
"use strict";

var live = _interopRequireWildcard(require("../index"));

require("./test.css");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var $ = function $() {
  var _document;

  return (_document = document).querySelector.apply(_document, arguments);
};

var store = live.makeStore({
  range: {
    min: 1,
    max: 10
  },
  start: 5,
  map: function map(n) {
    return Math.floor(n);
  }
});
var firstOut = $("#first-number-out");
var destroyNumber = live.number($("#first-number"), store, {
  name: 'number',
  axis: 'x',
  changeFactor: 5,
  format: function format(n) {
    return n == 0 ? "zero" : Math.floor(n);
  }
});
var destroySlider = live.slider($("#slider"), store, {
  name: 'slider',
  axis: 'x',
  changeFactor: 2,
  doubleClickReset: true // format: (n) => Math.floor(n)

}); // first.listen(n => firstOut.textContent = n <= 0 ? "n <= 0" : "n > 0")

store.listen(function (n) {
  return firstOut.textContent = n;
});
$("#reset-button").addEventListener("click", function () {
  return store.set(store.start);
});
},{"../index":"../index.js","./test.css":"test.css"}],"../node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "63530" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel/src/builtins/hmr-runtime.js","test.js"], null)
//# sourceMappingURL=/test.e98b79dd.js.map