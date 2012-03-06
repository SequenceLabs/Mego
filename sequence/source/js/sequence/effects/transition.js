(function() {
  var effects, getProp,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  effects = SEQ.utils.namespace("effects");

  getProp = SEQ.utils.browser.CSS3Detection.GetProp;

  effects.Transition = (function() {

    function Transition() {}

    Transition.To = function(options) {
      var t;
      return t = setTimeout(function() {
        if (getProp("Transition") != null) {
          new effects.Transition.CSSTransition(options);
        } else {
          Transition.jqAnimate(options);
        }
        return clearTimeout(t);
      }, options.delay || 0);
    };

    Transition.jqAnimate = function(options) {
      var target;
      if (Transition.options.target instanceof jQuery) {
        target = options.target;
      } else {
        target = $(options.target);
      }
      return target.animate(options.props, {
        duration: options.duration,
        complete: function(e) {
          return options.complete.call(Transition);
        }
      });
    };

    return Transition;

  }).call(this);

  effects.Transition.CSSTransition = (function() {

    function CSSTransition(options) {
      var element, elements, i, _i, _len, _len2, _ref;
      this.options = options;
      elements = [];
      if (this.options.target instanceof jQuery) {
        _ref = this.options.target;
        for (i = 0, _len = _ref.length; i < _len; i++) {
          element = _ref[i];
          elements.push(this.options.target.get(i));
        }
      } else if (this.options.target.constructor === Array) {
        elements = this.options.target;
      } else {
        elements = [this.options.target];
      }
      for (_i = 0, _len2 = elements.length; _i < _len2; _i++) {
        element = elements[_i];
        new effects.Transition.TransitionDelegate(this.options, element);
      }
    }

    return CSSTransition;

  })();

  effects.Transition.TransitionDelegate = (function() {

    function TransitionDelegate(options, element) {
      var prop, size, value, _ref,
        _this = this;
      this.options = options;
      this.element = element;
      this.removeTransitionStyles = __bind(this.removeTransitionStyles, this);
      this.addTransitionStyles = __bind(this.addTransitionStyles, this);
      this.onTransitionEnd = __bind(this.onTransitionEnd, this);
      this.getClientAutoSize = __bind(this.getClientAutoSize, this);
      this.transitionEndNames = {
        WebkitTransition: 'webkitTransitionEnd',
        MozTransition: 'transitionend',
        OTransition: 'oTransitionEnd',
        msTransition: 'msTransitionEnd',
        transition: 'transitionEnd'
      };
      if (this.options.duration > 0) {
        this.element.addEventListener(this.transitionEndNames[getProp('Transition')], this.onTransitionEnd, false);
      }
      this.addTransitionStyles();
      _ref = this.options.props;
      for (prop in _ref) {
        value = _ref[prop];
        if ((prop === "height" || "width") && value === "auto") {
          size = this.getClientAutoSize(this.element);
          this.element.style[prop] = "" + (prop === "height" ? size.height : size.width) + "px";
        } else if ((prop === "height" || "width") && this.element.style[prop] === "auto") {
          this.removeTransitionStyles();
          this.element.style[prop] = "" + (prop === "height" ? this.element.clientHeight : this.element.clientWidth) + "px";
          setTimeout(function() {
            _this.addTransitionStyles();
            return _this.element.style[prop] = "" + value + "px";
          }, 50);
        } else {
          this.element.style[prop] = "" + (value + this.pxMap(prop));
        }
      }
      if (this.options.duration === 0) this.onTransitionEnd();
    }

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
      var prop, value, _ref, _results;
      if (e != null) {
        e.target.removeEventListener(e.type, this.onTransitionEnd, false);
      }
      this.removeTransitionStyles();
      if (this.options.complete != null) this.options.complete.call(this);
      _ref = this.options.props;
      _results = [];
      for (prop in _ref) {
        value = _ref[prop];
        if (value === "auto") {
          if (prop === "height" || "width") {
            _results.push(this.element.style[prop] = "auto");
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    TransitionDelegate.prototype.addTransitionStyles = function() {
      this.element.style["" + (getProp('TransitionProperty'))] = "all";
      this.element.style["" + (getProp('TransitionDuration'))] = "" + (this.options.duration / 1000) + "s";
      return this.element.style["" + (getProp('TransitionTimingFunction'))] = "ease-in-out";
    };

    TransitionDelegate.prototype.removeTransitionStyles = function() {
      this.element.style["" + (getProp('TransitionProperty'))] = "";
      this.element.style["" + (getProp('TransitionDuration'))] = "";
      return this.element.style["" + (getProp('TransitionTimingFunction'))] = "";
    };

    TransitionDelegate.prototype.pxMap = function(obj) {
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

    return TransitionDelegate;

  })();

}).call(this);
