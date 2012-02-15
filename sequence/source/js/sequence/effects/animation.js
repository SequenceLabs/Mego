(function() {
  var effects, getProp;

  effects = SEQ.utils.namespace("effects");

  getProp = SEQ.utils.browser.CSS3Detection.GetProp;

  effects.Animate = (function() {

    function Animate() {}

    Animate.To = function(options) {
      Animate.options = options;
      if (getProp("Transition") != null) {
        return Animate.css3Animate();
      } else {
        return Animate.jqAnimate();
      }
    };

    Animate.jqAnimate = function() {
      var target;
      if (Animate.options.target.get != null) {
        target = Animate.options.target;
      } else {
        target = $(Animate.options.target);
      }
      return target.animate(Animate.options.props, {
        duration: Animate.options.duration,
        complete: Animate.options.complete
      });
    };

    Animate.css3Animate = function() {
      var prop, target, transitionEndNames, value, _ref;
      transitionEndNames = {
        WebkitTransition: 'webkitTransitionEnd',
        MozTransition: 'transitionend',
        OTransition: 'oTransitionEnd',
        msTransition: 'msTransitionEnd',
        transition: 'transitionEnd'
      };
      if (Animate.options.target.get != null) {
        target = Animate.options.target.get(0);
      } else {
        target = Animate.options.target;
      }
      if (Animate.options.duration > 0) {
        target.addEventListener(transitionEndNames[getProp('Transition')], Animate.onTransitionComplete, false);
      }
      _ref = Animate.options.props;
      for (prop in _ref) {
        value = _ref[prop];
        target.style[prop] = "" + (value + Animate.pxMap(prop));
      }
      target.style["" + (getProp('TransitionProperty'))] = "all";
      target.style["" + (getProp('TransitionDuration'))] = "" + (Animate.options.duration / 1000) + "s";
      target.style["" + (getProp('TransitionTimingFunction'))] = "ease-in-out";
      if (Animate.options.duration === 0) return Animate.onTransitionComplete();
    };

    Animate.onTransitionComplete = function(e) {
      var target;
      target = Animate.options.target.get(0);
      target.style["" + (getProp('TransitionProperty'))] = "";
      target.style["" + (getProp('TransitionDuration'))] = "";
      target.style["" + (getProp('TransitionTimingFunction'))] = "";
      if (Animate.options.complete != null) return Animate.options.complete.call();
    };

    Animate.pxMap = function(obj) {
      var prop, _i, _len, _ref;
      _ref = ["left", "right", "top", "bottom", "width", "height"];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        prop = _ref[_i];
        if (obj === prop) {
          return "px";
        } else {
          return "";
        }
      }
    };

    return Animate;

  }).call(this);

}).call(this);
