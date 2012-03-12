(function() {
  "use strict";
  var Project_Namespace, effects, getProp, init, modules, onDocReady, transition, transitionEndNames, _base,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  if (window.SEQ == null) window.SEQ = {};

  if ((_base = window.SEQ).utils == null) _base.utils = {};

  SEQ.utils.namespace = function(ns_string) {
    var i, parent, parts;
    parts = ns_string.split(".");
    parent = SEQ;
    i = void 0;
    if (parts[0] === "SEQ") parts = parts.slice(1);
    i = 0;
    while (i < parts.length) {
      if (typeof parent[parts[i]] === "undefined") parent[parts[i]] = {};
      parent = parent[parts[i]];
      i += 1;
    }
    return parent;
  };

  window.log = function() {
    var newarr;
    log.history = log.history || [];
    log.history.push(arguments);
    if (this.console) {
      arguments.callee = arguments.callee.caller;
      newarr = [].slice.call(arguments);
      if (typeof console.log === "object") {
        return log.apply.call(console.log, console, newarr);
      } else {
        return console.log.apply(console, newarr);
      }
    }
  };

  (function(b) {
    var a, c, d, _results;
    c = function() {};
    d = "assert,clear,count,debug,dir,dirxml,error,exception,firebug,group,groupCollapsed,groupEnd,info,log,memoryProfile,memoryProfileEnd,profile,profileEnd,table,time,timeEnd,timeStamp,trace,warn".split(",");
    a = void 0;
    _results = [];
    while (a = d.pop()) {
      _results.push(b[a] = b[a] || c);
    }
    return _results;
  })((function() {
    try {
      console.log();
      return window.console;
    } catch (err) {
      return window.console = {};
    }
  })());

  /* -------------------------------------------- 
       Begin browser.coffee 
  --------------------------------------------
  */

  SEQ.utils.namespace('SEQ.utils.browser');

  SEQ.utils.browser.platform = {
    isAndroid: function() {
      return navigator.userAgent.toLowerCase().indexOf("android") > -1;
    },
    isiOS: function() {
      return navigator.userAgent.toLowerCase().indexOf('like mac os x') > -1;
    },
    isiPhone: function() {
      return navigator.userAgent.toLowerCase().indexOf("iphone") > -1;
    },
    isiPad: function() {
      return navigator.userAgent.toLowerCase().indexOf("ipad") > -1;
    },
    isRetinaDisplay: function() {
      return window.devicePixelRatio >= 2;
    },
    isBlackberry: function() {
      return navigator.userAgent.toLowerCase().indexOf("blackberry") > -1;
    },
    isDesktop: function() {
      var desktop;
      desktop = true;
      if (this.isAndroid() || this.isiOS() || this.isBlackberry()) desktop = false;
      return desktop;
    }
  };

  /* -------------------------------------------- 
       Begin transition.coffee 
  --------------------------------------------
  */

  "use strict";

  effects = SEQ.utils.namespace("effects");

  transitionEndNames = {
    WebkitTransition: 'webkitTransitionEnd',
    MozTransition: 'transitionend',
    OTransition: 'oTransitionEnd',
    msTransition: 'msTransitionEnd',
    transition: 'transitionEnd'
  };

  getProp = function(prop) {
    var p, prefix, _i, _len, _ref;
    _ref = ["", "Webkit", "Moz", "O", "ms", "Khtml"];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      prefix = _ref[_i];
      p = "" + prefix + prop;
      if (document.body.style[p] != null) return p;
    }
  };

  /**    
  Transition is CSS3 Transition engine with jQuery fallback. 
  @class Transition 
  @author Hamish Taplin, Sequence
  @version 1.1
  */

  effects.Transition = (function() {

    function Transition() {}

    Transition.To = function(options) {
      var t;
      return t = setTimeout(function() {
        if (getProp("Transition") != null) {
          new effects.CSSTransition(options);
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
      return target.animate(options.props, {
        duration: options.duration,
        complete: function(e) {
          if (options.complete != null) return options.complete.call(Transition);
        }
      });
    };

    return Transition;

  }).call(this);

  effects.CSSTransition = (function() {

    function CSSTransition(options) {
      var element, elements, i, _len, _ref;
      this.options = options;
      this.onTransitionEnd = __bind(this.onTransitionEnd, this);
      this.transition = __bind(this.transition, this);
      this.transitionEndStr = transitionEndNames[getProp('Transition')];
      this.numTransitions = 0;
      this.numTransitionsComplete = 0;
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
      this.transition(elements);
    }

    CSSTransition.prototype.transition = function(elements) {
      var element, prop, value, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = elements.length; _i < _len; _i++) {
        element = elements[_i];
        _results.push((function() {
          var _ref, _results2;
          _ref = this.options.props;
          _results2 = [];
          for (prop in _ref) {
            value = _ref[prop];
            this.numTransitions++;
            if (this.options.duration > 0) {
              element.addEventListener(this.transitionEndStr, this.onTransitionEnd, false);
            } else {
              this.onTransitionEnd({
                target: element
              });
            }
            _results2.push(new effects.TransitionDelegate(element, prop, value, this.options.duration));
          }
          return _results2;
        }).call(this));
      }
      return _results;
    };

    CSSTransition.prototype.onTransitionEnd = function(e) {
      e.target.removeEventListener(this.transitionEndStr, this.onTransitionEnd, false);
      this.numTransitionsComplete++;
      if (this.numTransitionsComplete === this.numTransitions) {
        if (this.options.complete != null) return this.options.complete.call(this);
      }
    };

    return CSSTransition;

  })();

  effects.TransitionDelegate = (function() {

    function TransitionDelegate(element, property, value, duration) {
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
        this.element.addEventListener(transitionEndNames[getProp('Transition')], this.onTransitionEnd, false);
      }
      this.addTransitionStyles();
      this.addStyles();
      if (this.duration === 0) this.onTransitionEnd();
    }

    TransitionDelegate.prototype.addStyles = function() {
      var size,
        _this = this;
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
        return this.element.style[this.property] = "" + (this.value + this.pxMap(this.property));
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
      if (this.value === "auto") {
        if (this.property === "height" || "width") {
          return this.element.style[this.property] = "auto";
        }
      }
    };

    TransitionDelegate.prototype.addTransitionStyles = function() {
      this.element.style["" + (getProp('TransitionProperty'))] = "all";
      this.element.style["" + (getProp('TransitionDuration'))] = "" + (this.duration / 1000) + "s";
      return this.element.style["" + (getProp('TransitionTimingFunction'))] = "ease-in-out";
    };

    TransitionDelegate.prototype.removeTransitionStyles = function() {
      this.element.style["" + (getProp('TransitionProperty'))] = "";
      this.element.style["" + (getProp('TransitionDuration'))] = "";
      return this.element.style["" + (getProp('TransitionTimingFunction'))] = "";
    };

    TransitionDelegate.prototype.pxMap = function(obj) {
      var prop, suffix, _i, _len, _ref;
      suffix = "";
      _ref = ["left", "right", "top", "bottom", "width", "height"];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        prop = _ref[_i];
        if (obj === prop) suffix = "px";
      }
      return suffix;
    };

    return TransitionDelegate;

  })();

  /* -------------------------------------------- 
       Begin coffeeslider.coffee 
  --------------------------------------------
  */

  "use strict";

  modules = SEQ.utils.namespace('SEQ.modules');

  transition = SEQ.effects.Transition;

  /**    
  CoffeeSlider is a touch-enabled Coffeescript-based slider module. 
  @class CoffeeSlider 
  @author Hamish Taplin, Sequence
  */

  modules.CoffeeSlider = (function() {
    /**  
    Constructor. Creates a CoffeeSlider instance.
    */
    function CoffeeSlider(options) {
      this.options = options;
      this.find = __bind(this.find, this);
      this.onTransitionComplete = __bind(this.onTransitionComplete, this);
      this.slideFadeTo = __bind(this.slideFadeTo, this);
      this.fadeTo = __bind(this.fadeTo, this);
      this.slideTo = __bind(this.slideTo, this);
      this.goTo = __bind(this.goTo, this);
      this.onTouchMove = __bind(this.onTouchMove, this);
      this.onTouchEndOrCancel = __bind(this.onTouchEndOrCancel, this);
      this.onTouchStart = __bind(this.onTouchStart, this);
      this.bindUIEvents = __bind(this.bindUIEvents, this);
      this.applyStyles = __bind(this.applyStyles, this);
      this.checkImagesLoaded = __bind(this.checkImagesLoaded, this);
      this.preload = __bind(this.preload, this);
      this.initSlides = __bind(this.initSlides, this);
      this.init = __bind(this.init, this);
      this.settings = {};
      this.container = {};
      this.outer = {};
      this.inner = {};
      this.uiParent = {};
      this.prevBtn = {};
      this.nextBtn = {};
      this.slides = {};
      this.slideWidth = 0;
      this.currentIndex = 1000;
      this.numSlides = 0;
      this.currentSlide = {};
      this.isMoving = false;
      this.pagination = {};
      this.dotNav = {};
      this.init();
    }

    CoffeeSlider.prototype.init = function() {
      var _this = this;
      this.container = this.options.container;
      this.container.addClass("coffee-slider").css({
        opacity: 1
      });
      this.applySettings();
      this.bindToDOM();
      this.initUI();
      return this.initSlides(function() {
        _this.applyStyles();
        _this.bindUIEvents();
        _this.settings.callbacks.onStart();
        return _this.goTo(0, true);
      });
    };

    /** 
    Merges user-defined options with defaults.
    @param {Object}  options    User-defined options
    @private
    */

    CoffeeSlider.prototype.applySettings = function() {
      this.settings = {
        transitionType: "slide",
        slideshow: true,
        transitionDirection: "horizontal",
        transitionDelay: 2000,
        transitionSpeed: 1000,
        hasDotNav: true,
        hasPrevNext: true,
        hasPagination: false,
        touchStyle: "drag",
        loop: "infinite",
        preload: true,
        selectors: {
          slide: ".slide",
          outer: ".outer",
          inner: ".inner",
          prev: ".prev",
          next: ".next",
          btn: ".btn",
          uiParent: "",
          paginationContainer: "",
          dotNav: ".dot-nav",
          pagination: ".pagination",
          paginationCurrent: ".currentPage",
          paginationTotal: ".total"
        },
        callbacks: {
          onStart: function() {},
          onTransition: function() {},
          onTransitionComplete: function() {}
        }
      };
      return $.extend(true, this.settings, this.options);
    };

    /**
    Binds internal properties to DOM elements.
    @private
    */

    CoffeeSlider.prototype.bindToDOM = function() {
      this.slides = this.find("slide");
      this.numSlides = this.slides.length;
      this.slides.addClass("slide");
      if ((this.inner = this.find("inner")).length === 0) {
        this.slides.wrapAll($("<div />").addClass(this.getSelector("inner")));
        this.inner = this.find("inner");
      }
      if ((this.outer = this.find("outer")).length === 0) {
        this.inner.wrap($("<div />").addClass(this.getSelector("outer")));
        return this.outer = this.find("outer");
      }
    };

    /**
    Binds internal properties to DOM elements.
    @private
    */

    CoffeeSlider.prototype.initSlides = function(callback) {
      if (this.settings.loop === "infinite" && this.settings.transitionType !== "fade") {
        this.appendClonedSlides();
      }
      if (this.settings.preload) {
        return this.preload(callback);
      } else {
        return callback();
      }
    };

    /**
    Preloads the images.
    @private
    */

    CoffeeSlider.prototype.preload = function(callback) {
      this.outer.css({
        opacity: 0
      });
      this.images = this.container.find("img");
      this.numImages = this.images.length;
      return this.checkImagesLoaded(callback);
    };

    /**
    Loops through each image and checks if loaded. If ready, calls the callback to continue.
    @private
    */

    CoffeeSlider.prototype.checkImagesLoaded = function(callback) {
      var img, imgsLoaded, _i, _len, _ref,
        _this = this;
      imgsLoaded = 0;
      _ref = this.images;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        img = _ref[_i];
        if (img.complete) imgsLoaded++;
      }
      if (imgsLoaded === this.numImages) {
        callback();
        return transition.To({
          target: this.outer,
          duration: 300,
          props: {
            opacity: 1
          }
        });
      } else {
        return setTimeout(function() {
          return _this.checkImagesLoaded(callback);
        }, 100);
      }
    };

    /**
    Appends cloned slides to either side for purposes of creating illusion of infinite scrolling.
    @private
    */

    CoffeeSlider.prototype.appendClonedSlides = function() {
      var float;
      float = (this.settings.transitionDirection === "horizontal" ? "left" : "none");
      this.inner.append(this.slides.eq(0).clone().addClass('clone').css({
        float: float
      }));
      this.inner.prepend(this.slides.eq(this.numSlides - 1).clone().addClass('clone').css({
        float: float
      }));
      this.slides = this.find("slide");
      return this.numSlides = this.slides.length;
    };

    /**
    Applies some basic CSS.
    @private
    */

    CoffeeSlider.prototype.applyStyles = function(callback) {
      this.inner.css({
        position: "relative",
        overflow: "hidden"
      });
      this.outer.css({
        overflow: "hidden"
      });
      this.slideWidth = this.slides.eq(0).outerWidth();
      this.slideHeight = this.slides.eq(0).outerHeight();
      this.totalWidth = this.slideWidth * this.numSlides;
      this.totalHeight = this.slideHeight * this.numSlides;
      if (this.settings.transitionType === "slide" || this.settings.transitionType === "slideFade") {
        if (this.settings.transitionDirection === "horizontal") {
          this.slides.css({
            float: "left",
            overflow: "hidden"
          });
          this.slideWidth = this.slides.eq(0).outerWidth();
          this.totalWidth = this.slideWidth * this.numSlides;
          this.inner.css({
            width: this.totalWidth,
            height: this.totalHeight
          });
          return this.outer.css({
            width: this.slideWidth,
            height: this.slideHeight
          });
        } else if (this.settings.transitionDirection === "vertical") {
          this.inner.css({
            height: this.totalHeight,
            width: this.slideWidth
          });
          return this.outer.css({
            height: this.slideHeight,
            width: this.slideWidth
          });
        }
      } else if (this.settings.transitionType === "fade") {
        this.slides.css({
          position: "absolute",
          left: "0",
          opacity: "0"
        });
        this.inner.css({
          width: this.slideWidth,
          height: this.slideHeight
        });
        return this.outer.css({
          height: this.slideHeight,
          width: this.slideWidth
        });
      }
    };

    /**
    Initialises UI components.
    @private
    */

    CoffeeSlider.prototype.initUI = function() {
      var i, slide, _len, _ref;
      this.uiParent = this.getContainer("uiParent", this.container);
      if (this.settings.hasPrevNext) {
        this.prevBtn = $("<div />").addClass("" + (this.getSelector("prev"))).addClass("" + (this.getSelector("btn"))).html("next");
        this.nextBtn = $("<div />").addClass("" + (this.getSelector("next"))).addClass("" + (this.getSelector("btn"))).html("prev");
        this.uiParent.append(this.prevBtn);
        this.uiParent.append(this.nextBtn);
      }
      if (this.settings.hasDotNav) {
        this.dotNav = $("<nav />").addClass(this.getSelector("dotNav"));
        this.uiParent.append(this.dotNav);
        this.dotNav.append($("<ol />"));
        _ref = this.slides;
        for (i = 0, _len = _ref.length; i < _len; i++) {
          slide = _ref[i];
          this.dotNav.find("ol").append("<li>" + i + "</li>");
        }
      }
      if (this.settings.hasPagination) {
        return this.pagination = new modules.Pagination(this.getContainer("paginationContainer", this.uiParent), this.getSelector("pagination"), this.getSelector("paginationCurrent"), this.getSelector("paginationTotal"), this.numSlides);
      }
    };

    /**
    Removes UI components.
    @private
    */

    CoffeeSlider.prototype.removeUI = function() {
      this.nextBtn.remove();
      return this.prevBtn.remove();
    };

    /**
    Binds event-handling to user controls.
    @private
    */

    CoffeeSlider.prototype.bindUIEvents = function() {
      var _this = this;
      if (this.settings.hasPrevNext) {
        this.nextBtn.bind("click", function(e) {
          e.preventDefault();
          return _this.next();
        });
        this.prevBtn.bind("click", function(e) {
          e.preventDefault();
          return _this.prev();
        });
      }
      if (this.settings.hasDotNav) {
        this.dotNav.bind("click", function(e) {
          e.preventDefault();
          return _this.goTo($(e.target).index(), false);
        });
      }
      if (this.settings.touchStyle !== "none") {
        return this.inner.bind("touchstart", this.onTouchStart);
      }
    };

    /**
    Called when a touch start event fires.
    @private  
    @param {Object} e the event object.
    */

    CoffeeSlider.prototype.onTouchStart = function(e) {
      var endX, endY;
      this.innerLeft = parseInt(this.inner.css("left"));
      this.innerTop = parseInt(this.inner.css("top"));
      this.startX = endX = e.originalEvent.touches[0].pageX;
      this.startY = endY = e.originalEvent.touches[0].pageY;
      this.distanceMovedX = 0;
      this.distanceMovedY = 0;
      this.inner.bind("touchend", this.onTouchEndOrCancel);
      this.inner.bind("touchcancel", this.onTouchEndOrCancel);
      return this.inner.bind("touchmove", this.onTouchMove);
    };

    /**
    Called when a touch event finishes.
    @private
    @param {Object} e the event object.
    */

    CoffeeSlider.prototype.onTouchEndOrCancel = function() {
      this.inner.unbind("touchend", this.onTouchEndOrCancel);
      this.inner.unbind("touchcancel", this.onTouchEndOrCancel);
      this.inner.unbind("touchmove", this.onTouchMove);
      if (this.settings.transitionDirection === "horizontal") {
        if (this.distanceMovedX > 50) {
          if (this.settings.transitionType === "fade" || this.settings.touchStyle === "inverseGesture") {
            return this.prev();
          } else {
            return this.next();
          }
        } else if (this.distanceMovedX < -50) {
          if (this.settings.transitionType === "fade" || this.settings.touchStyle === "inverseGesture") {
            return this.next();
          } else {
            return this.prev();
          }
        } else {
          return this.goTo(this.currentIndex);
        }
      } else if (this.settings.transitionDirection === "vertical") {
        if (this.distanceMovedY > 50) {
          if (this.settings.transitionType === "fade" || this.settings.touchStyle === "inverseGesture") {
            return this.prev();
          } else {
            return this.next();
          }
        } else if (this.distanceMovedY < -50) {
          if (this.settings.transitionType === "fade" || this.settings.touchStyle === "inverseGesture") {
            return this.next();
          } else {
            return this.prev();
          }
        } else {
          return this.goTo(this.currentIndex);
        }
      }
    };

    /**
    Called when a touch move event fires.
    @private 
    @param {Object} e the event object.
    */

    CoffeeSlider.prototype.onTouchMove = function(e) {
      var dragPosX, dragPosY;
      this.endX = e.originalEvent.touches[0].pageX;
      this.endY = e.originalEvent.touches[0].pageY;
      this.distanceMovedX = this.startX - this.endX;
      this.distanceMovedY = this.startY - this.endY;
      if (this.settings.transitionDirection === "horizontal") {
        if (Math.abs(this.distanceMovedX) > 15) {
          e.preventDefault();
        } else if (Math.abs(this.distanceMovedY) > 15) {
          this.inner.unbind("touchmove", this.onTouchMove);
        }
      } else if (this.settings.transitionDirection === "vertical") {
        if (Math.abs(this.distanceMovedY) > 10) {
          e.preventDefault();
        } else if (Math.abs(this.distanceMovedX) > 10) {
          this.inner.unbind("touchmove", this.onTouchMove);
        }
      }
      if (this.settings.touchStyle === "drag") {
        if (this.settings.transitionDirection === "horizontal") {
          dragPosX = this.innerLeft - (this.startX - this.endX);
          if (this.settings.loop !== "infinite" && (dragPosX >= 10 || dragPosX <= 0 - (this.totalWidth - this.slideWidth - 10))) {
            this.inner.unbind("touchmove", this.onTouchMove);
            return this.distanceMovedX = 0;
          } else {
            return this.inner.css({
              left: dragPosX
            });
          }
        } else if (this.settings.transitionDirection === "vertical") {
          dragPosY = this.innerTop - (this.startY - this.endY);
          if (this.settings.loop !== "infinite" && dragPosY >= 10) {
            this.inner.unbind("touchmove", this.onTouchMove);
            return this.distanceMovedY = 0;
          } else {
            return this.inner.css({
              top: dragPosY
            });
          }
        }
      }
    };

    /**
    Goes to a specific slide (as indicate d).
    @public
    @param {Object} index The index (in the Array this.slides) of the slide to go to.
    @param {Boolean} [skipTransition] If 'true', goes directly to slide without animation.
    */

    CoffeeSlider.prototype.goTo = function(index, skipTransition) {
      var ACTIVE;
      this.settings.callbacks.onTransition();
      if (!skipTransition) this.isMoving = true;
      if (this.settings.transitionType === "slide") {
        this.slideTo(index, skipTransition);
      } else if (this.settings.transitionType === "fade") {
        this.fadeTo(index, skipTransition);
      } else if (this.settings.transitionType === "slideFade") {
        this.slideFadeTo(index, skipTransition);
      }
      if (this.settings.hasDotNav) {
        ACTIVE = "active";
        this.dotNav.find("." + ACTIVE).removeClass(ACTIVE);
        this.dotNav.find("li").eq(index).addClass(ACTIVE);
      }
      if (this.settings.hasPagination) {
        if (this.currentIndex < 0) {
          return this.pagination.setPage(this.numSlides - 2);
        } else if (this.currentIndex > (this.numSlides - 3)) {
          return this.pagination.setPage(1);
        } else {
          return this.pagination.setPage(this.currentIndex + 1);
        }
      }
    };

    /**
    Uses the 'slide' animation to move to a slide.
    @private
    @param {Object} index The index (in the Array this.slides) of the slide to go to.
    @param {Boolean} [skipTransition] If 'true', goes directly to slide without animation.
    */

    CoffeeSlider.prototype.slideTo = function(index, skipTransition) {
      var offset, position;
      this.currentIndex = index;
      offset = (this.settings.loop === "infinite" ? 1 : 0);
      if (this.settings.transitionDirection === "horizontal") {
        position = {
          left: 0 - (index + offset) * this.slideWidth
        };
      } else if (this.settings.transitionDirection === "vertical") {
        position = {
          top: 0 - (index + offset) * this.slideHeight
        };
      }
      return transition.To({
        target: this.inner,
        props: position,
        duration: skipTransition ? 0 : this.settings.transitionSpeed / 2,
        complete: this.onTransitionComplete
      });
    };

    CoffeeSlider.prototype.fadeTo = function(index, skipTransition) {
      if (this.slides[this.currentIndex] != null) {
        transition.To({
          target: this.slides[this.currentIndex],
          props: {
            opacity: 0
          },
          duration: skipTransition ? 0 : this.settings.transitionSpeed / 2
        });
      }
      this.currentIndex = index;
      return transition.To({
        target: this.slides[index],
        props: {
          opacity: 1
        },
        duration: this.settings.transitionSpeed,
        complete: this.onTransitionComplete
      });
    };

    /**
    Uses the 'slideFade' animation to move to a slide.
    @private
    @param {Object} index The index (in the Array this.slides) of the slide to go to.
    @param {Boolean} [skipTransition] If 'true', goes directly to slide without animation.
    */

    CoffeeSlider.prototype.slideFadeTo = function(index, skipTransition) {
      this.fadeTo(index, skipTransition);
      return this.slideTo(index, skipTransition);
    };

    /**
    Goes to the previous page.
    @public
    */

    CoffeeSlider.prototype.prev = function() {
      var prevIndex;
      prevIndex = this.currentIndex - 1;
      if ((this.settings.transitionType === "fade" || this.settings.loop === "return") && prevIndex < 0) {
        prevIndex = this.numSlides - 1;
      }
      return this.goTo(prevIndex, false);
    };

    /**
    Goes to the next page.
    @public
    */

    CoffeeSlider.prototype.next = function() {
      var nextIndex;
      nextIndex = this.currentIndex + 1;
      if (nextIndex > (this.numSlides - 1)) {
        if (this.settings.transitionType === "fade" || this.settings.loop === "return") {
          nextIndex = 0;
        } else if (!this.settings.loop) {
          return;
        }
      }
      return this.goTo(nextIndex, false);
    };

    /**
    Called whenever a slide transition completes.
    @public
    */

    CoffeeSlider.prototype.onTransitionComplete = function() {
      this.isMoving = false;
      if (this.settings.loop === "infinite" && this.settings.transitionType !== "fade") {
        if (this.currentIndex === -1) {
          return this.goTo(this.numSlides - 3, true);
        } else if (this.currentIndex === this.numSlides - 2) {
          return this.goTo(0, true);
        } else {
          return this.settings.callbacks.onTransitionComplete();
        }
      } else {
        return this.settings.callbacks.onTransitionComplete();
      }
    };

    /**
    Utility function. Finds an element in the container for a given selector in the selectors object.
    @private
    @param {String} selectorName The selectors name.
    */

    CoffeeSlider.prototype.find = function(selectorName) {
      return this.container.find(this.settings.selectors[selectorName]);
    };

    /**
    Utility function. Gets a container.
    @private
    @param {String} name The selectors name.
    @param {String} _default The default container to revert to.
    */

    CoffeeSlider.prototype.getContainer = function(name, _default) {
      if (this.settings.selectors[name] === "") {
        return _default;
      } else {
        return this.find(name);
      }
    };

    /**
    Utility function. Gets a container.
    @private
    @param {String} name The selectors name.
    */

    CoffeeSlider.prototype.getSelector = function(name) {
      var selector;
      selector = this.settings.selectors[name];
      return selector.slice(1, selector.length);
    };

    return CoffeeSlider;

  })();

  modules.Pagination = (function() {

    Pagination.prototype.paginationCurrent = {};

    Pagination.prototype.paginationTotal = {};

    function Pagination(paginationContainer, paginationSel, paginationCurrentSel, paginationTotalSel, numSlides) {
      var i, pagination;
      pagination = $("<div />").addClass(paginationSel).append(this.paginationCurrent = $("<span />").addClass(paginationCurrentSel), this.paginationTotal = $("<span />").addClass(paginationTotalSel).html("/0" + numSlides));
      i = 1;
      while (i <= numSlides) {
        this.paginationCurrent.append($("<div />").addClass("number").html("0" + i));
        i++;
      }
      paginationContainer.append(pagination);
    }

    Pagination.prototype.setPage = function(index) {
      return SEQ.Tween.To({
        target: this.paginationCurrent,
        props: {
          top: "-" + (this.paginationCurrent.find('.number').outerHeight() * (index - 1)) + "px"
        },
        duration: 500
      });
    };

    return Pagination;

  })();

  /* -------------------------------------------- 
       Begin app.coffee 
  --------------------------------------------
  */

  "use strict";

  Project_Namespace = SEQ.utils.namespace("SEQ.project_namespace");

  (init = function() {
    return $(document).ready(function() {
      return onDocReady();
    });
  })();

  onDocReady = function() {
    return new SEQ.modules.CoffeeSlider({
      container: $("#carousel"),
      transitionType: "slide",
      loop: "return",
      transitionSpeed: 400,
      transitionDirection: "horizontal",
      touchStyle: "drag",
      preload: true,
      selectors: {
        slide: "figure"
      }
    });
  };

}).call(this);
