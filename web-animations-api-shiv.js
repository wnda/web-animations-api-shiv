/* WEB ANIMATIONS API SHIV :: https://github.com/wnda/web-animations-api-shiv */
;(function (win, doc) {
  'use strict';

  if ('animate' in Element.prototype) { return; }

  HTMLElement.prototype.animate = function (animations, options) {
    var _element = this;
    var _animation_name = options.id ? options.id.toString() : createAnimationName(win.Date.now(), _element);

    doc.head.insertAdjacentHTML('beforeEnd', 
                                '<style data-waapisid="' + _animation_name + '">' +
                                '@' + getVendorPrefix(_element, 'animationName') + 'keyframes ' + _animation_name + 
                                '{' + generateCSSKeyframes(_element, animations) + 
                                '}</style>');

    _element.setAttribute('style', getAttributeStyles(_element, {
      'animationDuration': options.duration ? options.duration + 'ms' : options + 'ms' || '0s',
      'animationIterationCount': options.iterations === Infinity ? 'infinite' : options.iterations || '1',
      'animationTimingFunction': options.easing || 'linear',
      'animationDirection': options.direction || 'normal',
      'animationFillMode': options.fill || '',
      'animationDelay': options.delay || '0s',
      'animationName': _animation_name || ''
    }));
  };
  
  HTMLElement.prototype.playState = function () {
    return win.getComputedStyle(this).animationPlayState || '';
  };
  
  HTMLElement.prototype.play = function () {
    this.style[getCSSProperty(this, 'animationPlayState')] = 'running';
  };

  HTMLElement.prototype.pause = function () {
    this.style[getCSSProperty(this, 'animationPlayState')] = 'paused';
  };
  
  function generateCSSKeyframes (element, js_keyframes) {
    return js_keyframes.map(function (keyframe, idx, arr) {
      var _offset = keyframe.offset || null;
      var _easing = keyframe.easing || null;
      var _keys = win.Object.keys(keyframe).filter(function (key) { return key !== 'offset' && key !== 'easing'; });
      var _effects = getCSSProperty(element, _keys[0]) + ': ' + keyframe[_keys[0]] + ';';

      if (!!_easing) { _effects += getCSSProperty(element, 'animationTimingFunction') + ':' + _easing + ';'; }
      
      return buildKeyframeString(_effects, _offset, idx, arr.length);
    }).join('');
  }

  function buildKeyframeString (effects, offset, idx, len) {
    switch (true) {
      case !!(!!offset && (offset < 0 || offset > 1)):
        return '';
      case !!(idx === 0):
      case !!(!!offset && offset === 0):
        return '0% {' + effects + '}';;
      case !!(len > 0 && idx === (len - 1)):
      case !!(!!offset && offset === 1):
        return '100% {' + effects + '}';
      case !!(!!offset && offset > 0 && offset < 1):
        return (offset * 100).toFixed(2) + '% {' + effects + '}';
      default:
        return (100 / (idx + 1 * 100)).toFixed(2) + '% {' + effects + '}';
    }
  }

  function getCSSProperty (element, prop) {
    return getVendorPrefix(element, prop) + convertToCSSProp(prop);
  }
  
  function getVendorPrefix (element, prop) {
    var _js_props = element.style;
    var _js_prop = prop.substr(0,1).toUpperCase() + prop.substr(1);
    return prop in _js_props ? 
             '' : 
       'webkit' + _js_prop in _js_props ? '-webkit-': 
          'moz' + _js_prop in _js_props ? '-moz-': 
           'ms' + _js_prop in _js_props ? '-ms-': 
            'o' + _js_prop in _js_props ? '-o-': 
             '';
  }
  
  function convertToCSSProp (str) {
    return str.split('').map(function (char) {
      if (char === char.toLowerCase()) { return char; } 
      else { return '-' + char.toLowerCase() }
    }).join('');
  }
  
  function getAttributeStyles (element, css) {
    return win.Object.keys(css).filter(function (pair) {
      return !!css[pair];
    }).map(function (pair) {
      return getCSSProperty(element, pair) + ': ' + css[pair] + ';';
    }).join('');
  }

  function createAnimationName (current_time, element) {
    return 'WAAPIS-' + current_time.toString() + ([].slice.call(doc.getElementsByTagName('*')).indexOf(element)).toString();
  }
})(window, document);
