/* WEB ANIMATIONS API SHIV :: https://github.com/wnda/web-animations-api-shiv */
;(function (win, doc) {
  'use strict';

  if ('animate' in HTMLElement.prototype) { return; }

  HTMLElement.prototype.animate = function (js_keyframes, options) {
    var _element = this;
    var _animation_name = options.id ? options.id.toString() : createAnimationName(win.Date.now(), _element);
    
    doc.head.insertAdjacentHTML('beforeEnd', 
      '<style data-waapiid="' + _animation_name + '">' +
      '@' + getVendorPrefix(_element, 'animationName', true) + 'keyframes ' + _animation_name + '{' + 
        generateCSSKeyframes(_element, js_keyframes) + 
      '}' + 
      '[data-waapiel="' + _animation_name + '"] {' +
        getAnimationCSS(_element, {
          'animationDuration': options.duration ? options.duration + 'ms' : options + 'ms' || '0s',
          'animationIterationCount': options.iterations === Infinity ? 'infinite' : options.iterations || '1',
          'animationTimingFunction': options.easing || 'linear',
          'animationDirection': options.direction || 'normal',
          'animationFillMode': options.fill || '',
          'animationDelay': options.delay || '0s',
          'animationName': _animation_name || ''
        }) + getVendorPrefix(_element, 'animationPlayState', true) + ': running;' + 
      '}' +
      '</style>'
    );
    
    _element.setAttribute('data-waapiel', _animation_name);
    
    _element.playState = (function () {
      return win.getComputedStyle(_element)[getVendorPrefix(_element, 'animationPlayState', false)] || '';
    }).call(_element);
    
    _element.play = function () {
      _element.style[getCSSProperty(_element, 'animationPlayState')] = 'running';
    };

    _element.pause = function () {
      _element.style[getCSSProperty(_element, 'animationPlayState')] = 'paused';
    };
    
    _element.cancel = function () {
      var _stylesheet = doc.querySelector('[data-waapiid="' + _animation_name + '"]');
      _stylesheet.parentNode.removeChild(_stylesheet);
      _element.removeAttribute('data-waapiel');
      delete(_element.playState);
      delete(_element.play);
      delete(_element.pause);
      delete(_element.cancel);
    };
    
    return _element;
  };
  
  function generateCSSKeyframes (element, js_keyframes) {
    return js_keyframes.map(function (keyframe, idx, arr) {
      var _offset = keyframe.offset || null;
      var _easing = keyframe.easing || null;
      var _keys = win.Object.keys(keyframe).filter(function (key) { return key !== 'offset' && key !== 'easing'; });
      var _effects = getCSSProperty(element, _keys[0]) + ': ' + keyframe[_keys[0]] + '; ' + 
                       (!!_easing ? getCSSProperty(element, 'animationTimingFunction') + ':' + _easing + ';' : '');      
      return buildKeyframeString(_effects, _offset, idx, arr.length);
    }).join('');
  }

  function buildKeyframeString (effects, offset, idx, len) {
    switch (!0) {
      case !!(!!offset && (offset < 0 || offset > 1)):
        return '';
        
      case !!(idx === 0 && idx === (len - 1)):
        return '0%, 100% {' + effects + '}';
        
      case !!(idx === 0):
      case !!(!!offset && offset === 0):
        return '0% {' + effects + '}';
        
      case !!(idx === (len - 1)):
      case !!(!!offset && offset === 1):
        return '100% {' + effects + '}';
        
      case !!(!!offset && offset > 0 && offset < 1):
        return (offset * 1e2).toFixed(2) + '% {' + effects + '}';
        
      default:
        return (((idx + 1) / len) * 1e2).toFixed(2) + '% {' + effects + '}';
    }
  }

  function getCSSProperty (element, prop) {
    return getVendorPrefix(element, prop, true) + convertToCSSProp(prop);
  }
  
  function getVendorPrefix (element, prop, css) {
    var _js_props = element.style;
    var _js_prop = prop.substr(0,1).toUpperCase() + prop.substr(1);
    var _prefix = prop in _js_props     ? ''       : 
       'webkit' + _js_prop in _js_props ? 'webkit' : 
          'moz' + _js_prop in _js_props ? 'moz'    : 
           'ms' + _js_prop in _js_props ? 'ms'     : 
            'o' + _js_prop in _js_props ? 'o'      : 
             '';
    return !!css && !!_prefix ? '-' + _prefix + '-' : _prefix;
  }
  
  function convertToCSSProp (str) {
    return str.split('').map(function (char) {
      if (char === char.toLowerCase()) { return char; } 
      else { return '-' + char.toLowerCase() }
    }).join('');
  }
  
  function getAnimationCSS (element, css) {
    return win.Object.keys(css).filter(function (pair) {
      return !!css[pair];
    }).map(function (pair) {
      return getCSSProperty(element, pair) + ': ' + css[pair] + '; ';
    }).join('');
  }

  function createAnimationName (current_time, element) {
    return 'WAAPI-' + current_time.toString() + ([].slice.call(doc.getElementsByTagName('*')).indexOf(element)).toString();
  }
})(window, document);
