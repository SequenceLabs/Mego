(function() {
  "use strict";

  var effects;

  effects = Namespace("SEQ.effects");

  effects.Transition = (function() {

    function Transition() {}

    Transition.TransitionEndNames = {
      WebkitTransition: 'webkitTransitionEnd',
      MozTransition: 'transitionend',
      OTransition: 'oTransitionEnd',
      msTransition: 'msTransitionEnd',
      transition: 'transitionEnd'
    };

    Transition.GetProp = function(prop) {
      var p, prefix, _i, _len, _ref;
      _ref = ["", "Webkit", "Moz", "O", "ms", "Khtml"];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        prefix = _ref[_i];
        p = "" + prefix + prop;
        if (document.body.style[p] != null) {
          return p;
        }
      }
    };

    Transition.To = function(options) {
      var t;
      return t = setTimeout(function() {
        if (effects.Transition.GetProp("Transition") != null) {
          new effects.TransitionController(options);
        } else {
          Transition.jqAnimate(options);
        }
        return clearTimeout(t);
      }, options.delay || 0);
    };

    Transition.jqAnimate = function(options) {
      var target;
      if (options.target instanceof jQuery) {
        target = options.target;
      } else {
        target = $(options.target);
      }
      if (options.props.opacity != null) {
        if (options.props.opacity === 0) {
          target.fadeOut(options.duration, options.complete);
        }
        if (options.props.opacity === 1) {
          target.fadeIn(options.duration, options.complete);
        }
        delete options.opacity;
      }
      return target.animate(options.props, {
        duration: options.duration,
        complete: function(e) {
          if (options.complete != null) {
            return options.complete.call(Transition);
          }
        }
      });
    };

    return Transition;

  }).call(this);

}).call(this);
