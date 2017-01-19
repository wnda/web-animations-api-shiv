/* WEB ANIMATIONS API SHIV :: https://github.com/wnda/web-animations-api-shiv */
;(function (win, doc) {
  'use strict';

  if ('animate' in HTMLElement.prototype) { return; }

  HTMLElement.prototype.animate = function (animations, options) {
    var _element = this;
    var _animation_name = options.id ? options.id.toString() : createAnimationName(win.Date.now(), _element);

    doc.head.insertAdjacentHTML('beforeEnd', '<style data-waapisid="'+ _animation_name +'">@' + getVendorPrefix(_element, 'animationName') + 'keyframes ' + _animation_name + '{' + generateCSSKeyframes(_element, animations) + '}</style>');

    addStylesToElement(_element, {
      'animationDuration': options.duration ? options.duration + 'ms' : options + 'ms' || '0s';
      'animationIterationCount': options.iterations === Infinity ? 'infinite' : options.iterations || '1';
      'animationTimingFunction': options.easing || 'linear';
      'animationDirection': options.direction || 'normal';
      'animationFillMode': options.fill || '';
      'animationDelay': options.delay || '0s';
      'animationName': _animation_name || '';
    });
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
    if (idx === 0) { return '0% {' + effects + '}'; }
    if (len > 0 && idx === (len - 1)) { return '100% {' + effects + '}'; }
    if (!!offset && offset > 0 && offset < 1) { return offset * 100 + '% {' + effects + '}'; }
    return 100 / (idx + 1 * 100) + '% {' + effects + '}';
  }

  function getCSSProperty (element, prop) {
    var _js_properties = element.style;
    var _js_prop = '';
    var _css_prop = camelCaseToHyphenated(prop);

    if (prop in _js_properties) { return prop; }

    _js_prop = prop.substr(0,1).toUppercase() + prop.substr(1);

    switch (!0) {
      case !!(('webkit' + _js_prop) in _js_properties):
      case !!(('Webkit' + _js_prop) in _js_properties):
        return '-webkit-' + _css_prop;

      case !!(('moz' + _js_prop) in _js_properties):
      case !!(('Moz' + _js_prop) in _js_properties):
        return '-moz-' + _css_prop;

      case !!(('ms' + _js_prop) in _js_properties):
      case !!(('Ms' + _js_prop) in _js_properties):
        return '-ms-' + _css_prop;

      case !!(('o' + _js_prop) in _js_properties):
      case !!(('O' + _js_prop) in _js_properties):
        return '-o-' + _css_prop;

      default:
        return _css_prop;
    }
  }
  
  function getVendorPrefix (element, prop) {
    var _js_props = element.style;
    var _js_prop = prop.substr(0,1).toUppercase() + prop.substr(1);
    return prop in _js_props ? 
             '' : 
       'webkit' + _js_prop in _js_props ? '-webkit-': 
          'moz' + _js_prop in _js_props ? '-moz-': 
           'ms' + _js_prop in _js_props ? '-ms-': 
            'o' + _js_prop in _js_props ? '-o-': 
             '';
  }
  
  function camelCaseToHyphenated (str) {
    return str.split('').map(function (char) {
      if (char === char.toLowerCase()) { return char; } 
      else { return '-' + char.toLowerCase() }
    }).join('');
  }
  
  function addStylesToElement(element, css) {
    return win.Object.keys(css).forEach(function (prop) {
      if (!css.hasOwnProperty || css.hasOwnProperty(prop)) { element.style[getCSSProperty(prop)] = css[prop]; }
    });
  }

  function createAnimationName (current_time, element) {
    return 'WAAPIS-' + current_time.toString() + ([].slice.call(doc.getElementsByTagName('*')).indexOf(element)).toString();
  }

})(window, document);
