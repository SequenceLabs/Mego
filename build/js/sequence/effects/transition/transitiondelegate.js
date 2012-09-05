(function() {
  "use strict";

  var effects,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  effects = Namespace("SEQ.effects");

  effects.TransitionDelegate = (function() {

    function TransitionDelegate(element, property, value, duration) {
      var _this = this;
      this.element = element;
      this.property = property;
      this.value = value;
      this.duration = duration;
      this.removeTransitionStyles = __bind(this.removeTransitionStyles, this);

      this.addTransitionStyles = __bind(this.addTransitionStyles, this);

      this.onTransitionEnd = __bind(this.onTransitionEnd, this);

      this.getClientAutoSize = __bind(this.getClientAutoSize, this);

      this.addStyles = __bind(this.addStyles, this);

      if (this.duration > 0) {
        this.element.addEventListener(effects.Transition.TransitionEndNames[effects.Transition.GetProp('Transition')], this.onTransitionEnd, false);
      }
      this.addTransitionStyles();
      setTimeout(function() {
        _this.addStyles();
        if (_this.duration === 0) {
          return _this.onTransitionEnd();
        }
      }, 10);
    }

    TransitionDelegate.prototype.addStyles = function() {
      var size,
        _this = this;
      if (this.property === "opacity" && this.value === 1) {
        this.element.style["display"] = "block";
      }
      if ((this.property === "height" || "width") && this.value === "auto") {
        size = this.getClientAutoSize(this.element);
        return this.element.style[this.property] = "" + (this.property === "height" ? size.height : size.width) + "px";
      } else if ((this.property === "height" || "width") && this.element.style[this.property] === "auto") {
        this.removeTransitionStyles();
        this.element.style[this.property] = "" + (this.property === "height" ? this.element.clientHeight : this.element.clientWidth) + "px";
        return setTimeout(function() {
          _this.addTransitionStyles();
          return _this.element.style[_this.property] = "" + _this.value + "px";
        }, 50);
      } else {
        return setTimeout(function() {
          return _this.element.style[_this.property] = "" + (_this.value + _this.pxMap(_this.property, _this.value));
        }, 10);
      }
    };

    TransitionDelegate.prototype.getClientAutoSize = function(element) {
      var body, clone, size;
      clone = element.cloneNode(true);
      body = document.querySelector("body");
      body.appendChild(clone);
      clone.style.width = "auto";
      clone.style.height = "auto";
      clone.style.visibility = "hidden";
      clone.style.display = "block";
      size = {
        width: clone.clientWidth,
        height: clone.clientHeight
      };
      body.removeChild(clone);
      return size;
    };

    TransitionDelegate.prototype.onTransitionEnd = function(e) {
      if (e != null) {
        e.target.removeEventListener(e.type, this.onTransitionEnd, false);
      }
      this.removeTransitionStyles();
      if (this.property === "opacity" && this.value === 0) {
        this.element.style["display"] = "none";
      }
      if (this.value === "auto") {
        if (this.property === "height" || "width") {
          return this.element.style[this.property] = "auto";
        }
      }
    };

    TransitionDelegate.prototype.addTransitionStyles = function() {
      this.element.style["" + (effects.Transition.GetProp('TransitionProperty'))] = "all";
      this.element.style["" + (effects.Transition.GetProp('TransitionDuration'))] = "" + (this.duration / 1000) + "s";
      return this.element.style["" + (effects.Transition.GetProp('TransitionTimingFunction'))] = "ease-in-out";
    };

    TransitionDelegate.prototype.removeTransitionStyles = function() {
      this.element.style["" + (effects.Transition.GetProp('TransitionProperty'))] = "";
      this.element.style["" + (effects.Transition.GetProp('TransitionDuration'))] = "";
      return this.element.style["" + (effects.Transition.GetProp('TransitionTimingFunction'))] = "";
    };

    TransitionDelegate.prototype.pxMap = function(property, value) {
      var prop, suffix, _i, _len, _ref;
      suffix = "";
      if ((value.indexOf != null) && value.indexOf("px") > -1) {
        return suffix;
      }
      _ref = ["left", "right", "top", "bottom", "width", "height"];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        prop = _ref[_i];
        if (property === prop) {
          suffix = "px";
        }
      }
      return suffix;
    };

    return TransitionDelegate;

  })();

}).call(this);
