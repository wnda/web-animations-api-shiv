/*
  WEB ANIMATIONS API SHIV :: https://github.com/wnda/web-animations-api-shiv/
*/

;(function (win, doc) {
  'use strict';

  // Double-check WAAPI is not available
  if ('animate' in Element.prototype) {
    return;
  }

  // Extend Element.prototype to create an API compatible with future syntax
  Element.prototype.animate = function (animations, options) {

    var _element = this;

    // We want the animation to have a unique name,
    // to avoid conflicts with any existing CSS animations
    var _animation_name = createAnimationName(win.Date.now(), _element);

    // Append the _animation_name to the style element itself as a data-attribute
    // this could be used to forcibly remove the animation if desired...
    doc.head.insertAdjacentHTML('beforeEnd', '<style data-waapis-id="'+ _animation_name +'">@keyframes ' + _animation_name + '{' + generateCSSKeyframes(_element, animations) + '}</style>');

    // Apply animation options
    _element.style.animationDuration       = options.duration ? options.duration + 'ms' : options + 'ms' || '0s';
    _element.style.animationIterationCount = options.iterations === Infinity ? 'infinite' : options.iterations || '1';
    _element.style.animationTimingFunction = options.easing    || 'linear';
    _element.style.animationDirection      = options.direction || 'normal';
    _element.style.animationFillMode       = options.fill      || '';
    _element.style.animationDelay          = options.delay     || '0s';
    _element.style.animationName           = _animation_name   || '';
  }

  function generateCSSKeyframes (element, js_keyframes) {
    return js_keyframes.map(function (keyframe, idx, arr) {

      // Initialise the string which will contain all of the JS properties reformatted as CSS properties.
      var _effects = '';

      // Offset corresponds to percentage keyframes expressed as a decimal.
      // According to spec, keyframes must be in ascending order, so this poses no issue
      var _offset = keyframe.offset || null;

      // WAAPI allows variance in timing-function between keyframes.
      var _easing = keyframe.easing || null;

      // To convert JS keyframes to CSS keyframes, we need to get the object keys,
      // but JS keyframes can come with baggage...
      var _keys = win.Object.keys(keyframe).filter(function (key) {
        return key !== 'offset' && key !== 'easing';
      });

      // The only sane way to amend the timing function:
      //   Inject a new value for the property in the CSS itself.
      // We can afford to do this, because CSS3 animation overrides even attribute styles
      // Only an !important declaration can overrule CSS3 animation.
      if (!!_easing) {
        _effects = getCSSProperty(element, _keys[0]) + ': ' + keyframe[_keys[0]] + ';animation-timing-function:' + _easing + ';';
        return buildKeyframeString(_effects, _offset, idx, arr.length);
      }

      _effects = getCSSProperty(element, _keys[0]) + ': ' + keyframe[_keys[0]];
      return buildKeyframeString(_effects, _offset, idx, arr.length);

    }).join('');
  }

  function buildKeyframeString (effects, offset, idx, len) {

    // It's the first object in the keyframes array,
    // or there's only one keyframe, therefore it's 0%
    if (idx === 0) {
      return '0% {' + effects + '}';
    }

    // It's the last object in the keyframes array, therefore it's 100%
    if (len > 0 && idx === (len - 1)) {
      return '100% {' + effects + '}';
    }

    // There are multiple keyframes, and an offset has been specified between 0 and 1,
    // convert decimal to percentage
    if (!!offset && offset > 0 && offset < 1) {
      return offset * 100 + '% {' + effects + '}';
    }

    // There are multiple keyframes, but no offsets were specified,
    // so Spock gives it his 'best shot':
    return 100 / (idx + 1 * 100) + '% {' + effects + '}';
  }

  function getCSSProperty (element, css_property) {
    var _css_properties = element.style;
    var _js_property = '';

    // If the standardised property is supported without a vendor prefix, return it
    if (css_property in _css_properties) {
      return css_property;
    }

    // 'transform' -> 'vendorTransform'
    _js_property = css_property.substr(0,1).toUppercase() + css_property.substr(1);

    switch (true) {

      // Webkit/Blink
      case !!(('webkit' + _js_property) in _css_properties):
      case !!(('Webkit' + _js_property) in _css_properties):
        return '-webkit-' + css_property;

      // Gecko
      case !!(('moz' + _js_property) in _css_properties):
      case !!(('Moz' + _js_property) in _css_properties):
        return '-moz-' + css_property;

      // Trident
      case !!(('ms' + _js_property) in _css_properties):
      case !!(('Ms' + _js_property) in _css_properties):
        return '-ms-' + css_property;

      // Presto
      case !!(('o' + _js_property) in _css_properties):
      case !!(('O' + _js_property) in _css_properties):
        return '-o-' + css_property;

      // The property is not supported or inaccessible from JS
      default:
        return css_property;
    }
  }

  // Generate a unique identifier for the animation to be added to the stylesheet
  function createAnimationName (current_time, element) {
    // Adding the element's index in the DOM results in better 'uniqueness',
    // because even if two times are the same, the index in the DOM will be specific
    // 'WAAPIS-' + '1484748333026' + '02'
    return 'WAAPIS-' + current_time.toString() + ([].slice.call(doc.getElementsByTagName('*')).indexOf(element)).toString();
  }

})(window, document);
