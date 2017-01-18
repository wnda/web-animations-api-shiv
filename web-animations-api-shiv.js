/*
  WEB ANIMATIONS API SHIV
  https://github.com/wnda/web-animations-api-shiv
*/

;(function (win, doc) {
  'use strict';

  Element.prototype.animate = function (animations, options) {
    var _element = this;
    var _name = 'waapip-' + win.Date.now();
    var _keyframes = '@keyframes ' + _name + '{' +
      animations.map(function (keyframe, idx, keyframes) {
        var _offset = keyframe.offset || null;
        var _easing = keyframe.easing || null;

        var _effects = keyframes.map(function (obj) {
          var _keys = win.Object.keys(obj).filter(function (key) {
            return key !== 'offset' && key !== 'easing';
          });
          return getCSSProperty(_element,_keys[0]) + ': ' + obj[_keys[0]];
        });

        if (idx === 0) {
          return '0% {' + _effects[idx] + '}';
        }

        if (idx === (keyframes.length - 1)) {
          return '100% {' + _effects[idx] + '}';
        }

        if (!!_offset && _offset > 0 && _offset < 1) {
          return _offset * 100 + '% {' + _effects[idx] + '}';
        }

        return 100 / (idx + 1 * 100) + '% {' + _effects[idx] + '}';

      }).join('') + '}';

    doc.head.insertAdjacentHTML('beforeEnd', '<style>'+ _keyframes +'</style>');
    _element.style.animationDuration = options.duration ? options.duration + 'ms' : options + 'ms' || 'initial';
    _element.style.animationTimingFunction = options.easing || 'initial';
    _element.style.animationIterationCount = (options.iterations === Infinity ? 'infinite' : options.iterations) || 1;
    _element.style.animationDirection = options.direction || 'initial';
    _element.style.animationFillMode = options.fill || 'initial';
    _element.style.animationDelay = options.delay || 'initial';
    _element.style.animationName = _name || 'initial';
  }

  function getCSSProperty (element, property) {
    var _properties = element.style;
    var _partial;

    if (property in _properties) {
      return property;
    }

    _partial = property.substr(0, 1).toUppercase() + property.substr(1);

    switch (true) {
      case !!(('webkit' + _partial) in _properties):
      case !!(('Webkit' + _partial) in _properties):
        return '-webkit-' + property;

      case !!(('moz' + _partial) in _properties):
      case !!(('Moz' + _partial) in _properties):
        return '-moz-' + property;

      case !!(('ms' + _partial) in _properties):
      case !!(('Ms' + _partial) in _properties):
        return '-ms-' + property;

      case !!(('o' + _partial) in _properties):
      case !!(('O' + _partial) in _properties):
        return '-o-' + property;

      default:
        return property;
    }
  }

})(window, document);
