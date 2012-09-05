(function() {
  "use strict";

  var Transition, modules,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  modules = Namespace('SEQ.modules');

  Transition = SEQ.effects.Transition;

  modules.CoffeeSlider = (function(_super) {

    __extends(CoffeeSlider, _super);

    CoffeeSlider.TRANSITION_SLIDE = "slide";

    CoffeeSlider.TRANSITION_FADE = "fade";

    CoffeeSlider.TRANSITION_SLIDE_FADE = "slideFade";

    CoffeeSlider.DIRECTION_HORIZONTAL = "horizontal";

    CoffeeSlider.DIRECTION_VERTICAL = "vertical";

    CoffeeSlider.TOUCH_DRAG = "drag";

    CoffeeSlider.TOUCH_GESTURE = "gesture";

    CoffeeSlider.TOUCH_INVERSE_GESTURE = "inverseGesture";

    CoffeeSlider.TOUCH_NONE = "none";

    CoffeeSlider.LOOP_INFINITE = "infinite";

    CoffeeSlider.LOOP_RETURN = "return";

    CoffeeSlider.LOOP_LIMIT = "limit";

    function CoffeeSlider(options) {
      this.options = options;
      this.find = __bind(this.find, this);

      this.onTransitionComplete = __bind(this.onTransitionComplete, this);

      this.slideFadeTo = __bind(this.slideFadeTo, this);

      this.fadeTo = __bind(this.fadeTo, this);

      this.getStepMultiplier = __bind(this.getStepMultiplier, this);

      this.slideTo = __bind(this.slideTo, this);

      this.updateNavModules = __bind(this.updateNavModules, this);

      this.goToIndex = __bind(this.goToIndex, this);

      this.onTouchEndOrCancel = __bind(this.onTouchEndOrCancel, this);

      this.onTouchMove = __bind(this.onTouchMove, this);

      this.onTouchStart = __bind(this.onTouchStart, this);

      this.onSlideshowTick = __bind(this.onSlideshowTick, this);

      this.initSlideshow = __bind(this.initSlideshow, this);

      this.onWindowResize = __bind(this.onWindowResize, this);

      this.bindUIEvents = __bind(this.bindUIEvents, this);

      this.applySizes = __bind(this.applySizes, this);

      this.applyStyles = __bind(this.applyStyles, this);

      this.onImagesLoadedTransitionComplete = __bind(this.onImagesLoadedTransitionComplete, this);

      this.checkImagesLoaded = __bind(this.checkImagesLoaded, this);

      this.preload = __bind(this.preload, this);

      this.initSlides = __bind(this.initSlides, this);

      this.init = __bind(this.init, this);

      this.settings = {
        transitionType: CoffeeSlider.TRANSITION_SLIDE,
        slideshow: false,
        transitionDirection: CoffeeSlider.DIRECTION_HORIZONTAL,
        transitionDelay: 2000,
        transitionSpeed: 1000,
        hasPrevNext: true,
        hasDotNav: true,
        step: 1,
        snapTolerance: 50,
        responsive: true,
        touchStyle: CoffeeSlider.TOUCH_DRAG,
        loop: CoffeeSlider.LOOP_INFINITE,
        preload: true,
        selectors: {
          slide: ".slide",
          outer: ".outer",
          inner: ".inner",
          prev: ".prev",
          next: ".next",
          btn: ".btn",
          uiParent: ""
        },
        callbacks: {
          onStart: function() {},
          onTransition: function() {},
          onTransitionComplete: function() {}
        }
      };
      this.element = {};
      this.outer = {};
      this.inner = {};
      this.uiParent = {};
      this.prevBtn = {};
      this.nextBtn = {};
      this.slides = {};
      this.slideWidth = 0;
      this.currentIndex = void 0;
      this.numUniqueSlides = 0;
      this.numSlides = 0;
      this.isMoving = false;
      CoffeeSlider.__super__.constructor.call(this, this.options);
    }

    CoffeeSlider.prototype.init = function() {
      var _this = this;
      this.element = this.options.container;
      this.element.addClass("coffee-slider").css({
        opacity: 0
      });
      this.applySettings();
      this.bindToDOM();
      this.initUI();
      this.initSlides(function() {
        _this.applyStyles();
        _this.applySizes();
        _this.bindUIEvents();
        _this.settings.callbacks.onStart();
        return _this.goToIndex(0, true);
      });
      if (this.settings.responsive) {
        return $(window).resize(function() {
          return _this.onWindowResize();
        });
      }
    };

    CoffeeSlider.prototype.applySettings = function() {
      return $.extend(true, this.settings, this.options);
    };

    CoffeeSlider.prototype.bindToDOM = function() {
      var i, slide, _i, _len, _ref;
      this.slides = this.find("slide");
      this.numUniqueSlides = this.numSlides = this.slides.length;
      _ref = this.slides;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        slide = _ref[i];
        $(slide).addClass("slide slide-" + i);
      }
      if ((this.inner = this.find("inner")).length === 0) {
        this.slides.wrapAll($("<div />").addClass(this.getSelector("inner")));
        this.inner = this.find("inner");
      }
      if ((this.outer = this.find("outer")).length === 0) {
        this.inner.wrap($("<div />").addClass(this.getSelector("outer")));
        return this.outer = this.find("outer");
      }
    };

    CoffeeSlider.prototype.initSlides = function(callback) {
      if (this.settings.loop === CoffeeSlider.LOOP_INFINITE && this.settings.transitionType !== CoffeeSlider.TRANSITION_FADE) {
        this.appendClonedSlides();
      }
      if (this.settings.preload) {
        return this.preload(callback);
      } else {
        if (callback != null) {
          return callback();
        }
      }
    };

    CoffeeSlider.prototype.preload = function(callback) {
      this.element.css({
        opacity: 0
      });
      this.images = this.element.find("img");
      this.numImages = this.images.length;
      return this.checkImagesLoaded(callback);
    };

    CoffeeSlider.prototype.checkImagesLoaded = function(callback) {
      var img, imgsLoaded, _i, _len, _ref,
        _this = this;
      imgsLoaded = 0;
      _ref = this.images;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        img = _ref[_i];
        if (img.complete) {
          imgsLoaded++;
        }
      }
      if (imgsLoaded === this.numImages) {
        if (callback != null) {
          callback();
        }
        return Transition.To({
          target: this.element,
          duration: 300,
          props: {
            opacity: 1
          },
          complete: this.onImagesLoadedTransitionComplete
        });
      } else {
        return setTimeout(function() {
          return _this.checkImagesLoaded(callback);
        }, 100);
      }
    };

    CoffeeSlider.prototype.onImagesLoadedTransitionComplete = function() {
      var _this = this;
      return Transition.To({
        target: this.slides,
        duration: 300,
        props: {
          opacity: 1
        },
        complete: function() {
          return _this.element.css({
            height: "auto"
          });
        }
      });
    };

    CoffeeSlider.prototype.appendClonedSlides = function() {
      var float, i;
      float = (this.settings.transitionDirection === CoffeeSlider.DIRECTION_HORIZONTAL ? "left" : "none");
      i = 0;
      while (i < this.settings.step) {
        i++;
        this.inner.append(this.slides.eq(0 + (i - 1)).clone().addClass('clone').css({
          float: float
        }));
        this.inner.prepend(this.slides.eq(this.numSlides - i).clone().addClass('clone').css({
          float: float
        }));
      }
      this.numUniqueSlides = this.numSlides;
      this.slides = this.find("slide");
      return this.numSlides = this.slides.length;
    };

    CoffeeSlider.prototype.applyStyles = function(callback) {
      if (this.settings.transitionType !== CoffeeSlider.TRANSITION_FADE) {
        this.inner.css({
          position: "relative",
          overflow: "hidden"
        });
        this.outer.css({
          overflow: "hidden"
        });
      }
      if (this.settings.transitionType === CoffeeSlider.TRANSITION_SLIDE || this.settings.transitionType === CoffeeSlider.TRANSITION_SLIDE_FADE) {
        if (this.settings.transitionDirection === CoffeeSlider.DIRECTION_HORIZONTAL) {
          return this.slides.css({
            float: "left",
            overflow: "hidden"
          });
        }
      } else if (this.settings.transitionType === CoffeeSlider.TRANSITION_FADE) {
        return this.slides.css({
          position: "absolute",
          left: "0",
          opacity: "0"
        });
      }
    };

    CoffeeSlider.prototype.applySizes = function() {
      var outerHeight, outerWidth;
      if (this.isMoving) {
        return;
      }
      this.slideWidth = this.slides.eq(0).outerWidth(true);
      this.slideHeight = this.slides.eq(0).innerHeight(true);
      this.totalWidth = (this.slideWidth * this.numSlides) * this.settings.step;
      this.totalHeight = this.slideHeight * this.numSlides;
      outerWidth = this.outer.width();
      outerHeight = this.outer.height();
      if (this.settings.responsive) {
        this.slides.css({
          width: outerWidth
        });
      }
      if (this.settings.transitionType === CoffeeSlider.TRANSITION_SLIDE || this.settings.transitionType === CoffeeSlider.TRANSITION_SLIDE_FADE) {
        if (this.settings.transitionDirection === CoffeeSlider.DIRECTION_HORIZONTAL) {
          this.slideWidth = this.slides.eq(0).outerWidth(true);
          this.totalWidth = this.slideWidth * this.numSlides;
          this.inner.css({
            width: this.totalWidth
          });
          return this.outer.css({
            height: this.slideHeight
          });
        } else if (this.settings.transitionDirection === CoffeeSlider.DIRECTION_VERTICAL) {
          this.inner.css({
            height: this.totalHeight
          });
          return this.outer.css({
            height: this.slideHeight
          });
        }
      } else if (this.settings.transitionType === CoffeeSlider.TRANSITION_FADE) {
        return this.inner.css({
          height: this.slideHeight
        });
      }
    };

    CoffeeSlider.prototype.initUI = function() {
      this.uiParent = this.getContainer("uiParent", this.element);
      if (this.settings.hasPrevNext) {
        this.prevBtn = $("<div />").addClass("" + (this.getSelector("prev"))).addClass("" + (this.getSelector("btn"))).html("prev");
        this.nextBtn = $("<div />").addClass("" + (this.getSelector("next"))).addClass("" + (this.getSelector("btn"))).html("next");
        this.uiParent.append(this.prevBtn);
        this.uiParent.append(this.nextBtn);
      }
      if (this.settings.hasDotNav) {
        this.dotNav = new modules.DotNav({
          slides: this.slides,
          parent: this.uiParent
        });
        return this.registerNavModule(this.dotNav);
      }
    };

    CoffeeSlider.prototype.removeUI = function() {
      this.nextBtn.remove();
      return this.prevBtn.remove();
    };

    CoffeeSlider.prototype.bindUIEvents = function() {
      var _this = this;
      if (this.settings.hasPrevNext) {
        this.nextBtn.bind("click", function(e) {
          e.preventDefault();
          if (!$(e.target).hasClass("disabled")) {
            return _this.next();
          }
        });
        this.prevBtn.bind("click", function(e) {
          e.preventDefault();
          if (!$(e.target).hasClass("disabled")) {
            return _this.prev();
          }
        });
        this.nextBtn.bind("mousedown", function(e) {
          e.preventDefault();
          return false;
        });
        this.prevBtn.bind("mousedown", function(e) {
          e.preventDefault();
          return false;
        });
      }
      if (this.settings.touchStyle !== CoffeeSlider.TOUCH_NONE) {
        this.inner.bind("touchstart", this.onTouchStart);
      }
      return this.inner.bind("mousedown", this.onTouchStart);
    };

    CoffeeSlider.prototype.onWindowResize = function() {
      return this.applySizes();
    };

    CoffeeSlider.prototype.initSlideshow = function() {
      clearTimeout(this.timer);
      return this.timer = setTimeout(this.onSlideshowTick, this.settings.transitionDelay);
    };

    CoffeeSlider.prototype.onSlideshowTick = function() {
      return this.next();
    };

    CoffeeSlider.prototype.onTouchStart = function(e) {
      this.innerLeft = parseInt(this.inner.css("left"));
      this.innerTop = parseInt(this.inner.css("top"));
      if (e.type === "touchstart") {
        this.touchStartPoint = {
          x: e.originalEvent.touches[0].pageX,
          y: e.originalEvent.touches[0].pageY
        };
      } else {
        e.preventDefault();
        this.touchStartPoint = {
          x: e.originalEvent.pageX,
          y: e.originalEvent.pageY
        };
      }
      this.distanceMoved = {
        x: 0,
        y: 0
      };
      this.inner.bind("touchend", this.onTouchEndOrCancel);
      this.inner.bind("touchcancel", this.onTouchEndOrCancel);
      this.inner.bind("mouseup", this.onTouchEndOrCancel);
      this.inner.bind("touchmove", this.onTouchMove);
      this.inner.bind("mousemove", this.onTouchMove);
      if (this.settings.slideshow) {
        return clearTimeout(this.timer);
      }
    };

    CoffeeSlider.prototype.onTouchMove = function(e) {
      var dragPos;
      if (e.type === "touchmove") {
        this.touchEndPoint = {
          x: e.originalEvent.touches[0].pageX,
          y: e.originalEvent.touches[0].pageY
        };
      } else {
        e.preventDefault();
        this.touchEndPoint = {
          x: e.originalEvent.pageX,
          y: e.originalEvent.pageY
        };
      }
      this.distanceMoved = {
        x: this.touchStartPoint.x - this.touchEndPoint.x,
        y: this.touchStartPoint.y - this.touchEndPoint.y
      };
      dragPos = {
        x: 0,
        y: 0
      };
      if (this.settings.transitionDirection === CoffeeSlider.DIRECTION_HORIZONTAL) {
        if (Math.abs(this.distanceMoved.x) > 15) {
          e.preventDefault();
        } else if (Math.abs(this.distanceMoved.y) > 15) {
          this.inner.unbind("touchmove", this.onTouchMove);
          this.inner.unbind("mousemove", this.onTouchMove);
        }
      } else if (this.settings.transitionDirection === CoffeeSlider.DIRECTION_VERTICAL) {
        if (Math.abs(this.distanceMoved.y) > 10) {
          e.preventDefault();
        } else if (Math.abs(this.distanceMoved.x) > 10) {
          this.inner.unbind("touchmove", this.onTouchMove);
          this.inner.unbind("mousemove", this.onTouchMove);
        }
      }
      if (this.settings.touchStyle === CoffeeSlider.TOUCH_DRAG) {
        if (this.settings.transitionDirection === CoffeeSlider.DIRECTION_HORIZONTAL) {
          dragPos.x = this.innerLeft - (this.touchStartPoint.x - this.touchEndPoint.x);
          if (this.settings.loop !== CoffeeSlider.LOOP_INFINITE && (dragPos.x >= 10 || dragPos.x <= 0 - (this.totalWidth - this.slideWidth - 10))) {
            this.inner.unbind("touchmove", this.onTouchMove);
            this.inner.unbind("mousemove", this.onTouchMove);
            return this.distanceMoved.x = 0;
          } else {
            return this.inner.css({
              left: dragPos.x
            });
          }
        } else if (this.settings.transitionDirection === CoffeeSlider.DIRECTION_VERTICAL) {
          dragPos.y = this.innerTop - (this.touchStartPoint.x - this.touchEndPoint.x);
          if (this.settings.loop !== CoffeeSlider.LOOP_INFINITE && dragPos.y >= 10) {
            this.inner.unbind("touchmove", this.onTouchMove);
            this.inner.unbind("mousemove", this.onTouchMove);
            return this.distanceMoved.y = 0;
          } else {
            return this.inner.css({
              top: dragPos.y
            });
          }
        }
      }
    };

    CoffeeSlider.prototype.onTouchEndOrCancel = function(e) {
      this.inner.unbind("touchend", this.onTouchEndOrCancel);
      this.inner.unbind("mouseup", this.onTouchEndOrCancel);
      this.inner.unbind("touchcancel", this.onTouchEndOrCancel);
      this.inner.unbind("touchmove", this.onTouchMove);
      this.inner.unbind("mousemove", this.onTouchMove);
      e.preventDefault();
      return this.snapToNearestSlide();
    };

    CoffeeSlider.prototype.snapToNearestSlide = function() {
      if (this.settings.transitionDirection === CoffeeSlider.DIRECTION_HORIZONTAL) {
        if (this.distanceMoved.x > this.settings.snapTolerance) {
          if (this.settings.transitionType === CoffeeSlider.TRANSITION_FADE || this.settings.touchStyle === CoffeeSlider.TOUCH_INVERSE_GESTURE) {
            return this.prev();
          } else {
            return this.next();
          }
        } else if (this.distanceMoved.x < -this.settings.snapTolerance) {
          if (this.settings.transitionType === CoffeeSlider.TRANSITION_FADE || this.settings.touchStyle === CoffeeSlider.TOUCH_INVERSE_GESTURE) {
            return this.next();
          } else {
            return this.prev();
          }
        } else {
          return this.goToIndex(this.currentIndex);
        }
      } else if (this.settings.transitionDirection === CoffeeSlider.DIRECTION_VERTICAL) {
        if (this.distanceMoved.y > this.settings.snapTolerance) {
          if (this.settings.transitionType === CoffeeSlider.TRANSITION_FADE || this.settings.touchStyle === CoffeeSlider.TOUCH_INVERSE_GESTURE) {
            return this.prev();
          } else {
            return this.next();
          }
        } else if (this.distanceMoved.y < -this.settings.snapTolerance) {
          if (this.settings.transitionType === CoffeeSlider.TRANSITION_FADE || this.settings.touchStyle === CoffeeSlider.TOUCH_INVERSE_GESTURE) {
            return this.next();
          } else {
            return this.prev();
          }
        } else {
          return this.goToIndex(this.currentIndex);
        }
      }
    };

    CoffeeSlider.prototype.goToIndex = function(index, skipTransition) {
      var $slide, i, slide, _i, _len, _ref;
      this.settings.callbacks.onTransition();
      if (!skipTransition) {
        this.isMoving = true;
      }
      switch (this.settings.transitionType) {
        case CoffeeSlider.TRANSITION_SLIDE:
          this.slideTo(index, skipTransition);
          break;
        case CoffeeSlider.TRANSITION_FADE:
          this.fadeTo(index, skipTransition);
          break;
        case CoffeeSlider.TRANSITION_SLIDE_FADE:
          this.slideFadeTo(index, skipTransition);
      }
      if (this.settings.slideshow) {
        this.initSlideshow();
      }
      _ref = this.slides;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        slide = _ref[i];
        $slide = $(slide);
        if (i === index) {
          $slide.addClass("current");
        } else {
          $slide.removeClass("current");
        }
      }
      return CoffeeSlider.__super__.goToIndex.call(this, index, skipTransition);
    };

    CoffeeSlider.prototype.updateNavModules = function(index, skipTransition) {
      if (index >= 0 && index <= this.numUniqueSlides - 1) {
        return CoffeeSlider.__super__.updateNavModules.call(this, index, skipTransition);
      }
    };

    CoffeeSlider.prototype.slideTo = function(index, skipTransition) {
      var offset, position, stepMultiplier;
      this.currentIndex = index;
      offset = (this.settings.loop === "infinite" ? this.settings.step : 0);
      stepMultiplier = this.getStepMultiplier();
      switch (this.settings.transitionDirection) {
        case CoffeeSlider.DIRECTION_HORIZONTAL:
          position = {
            left: 0 - ((((index + offset - 1) * this.settings.step) + stepMultiplier) * this.slideWidth)
          };
          break;
        case CoffeeSlider.DIRECTION_VERTICAL:
          position = {
            top: 0 - ((((index + offset - 1) * this.settings.step) + stepMultiplier) * this.slideHeight)
          };
      }
      return Transition.To({
        target: this.inner,
        props: position,
        duration: skipTransition ? 0 : this.settings.transitionSpeed / 2,
        complete: this.onTransitionComplete
      });
    };

    CoffeeSlider.prototype.getStepMultiplier = function() {
      var currentIndexWithStep;
      currentIndexWithStep = this.currentIndex * this.settings.step;
      if ((currentIndexWithStep + this.settings.step) > this.numSlides) {
        return this.numSlides - currentIndexWithStep;
      } else {
        return this.settings.step;
      }
    };

    CoffeeSlider.prototype.fadeTo = function(index, skipTransition) {
      if (this.slides[this.currentIndex] != null) {
        Transition.To({
          target: this.slides[this.currentIndex],
          props: {
            opacity: 0
          },
          duration: skipTransition ? 0 : this.settings.transitionSpeed / 2
        });
      }
      this.currentIndex = index;
      return Transition.To({
        target: this.slides[index],
        props: {
          opacity: 1
        },
        duration: this.settings.transitionSpeed,
        complete: this.onTransitionComplete
      });
    };

    CoffeeSlider.prototype.slideFadeTo = function(index, skipTransition) {
      this.fadeTo(index, skipTransition);
      return this.slideTo(index, skipTransition);
    };

    CoffeeSlider.prototype.prev = function() {
      var prevIndex;
      if (this.isMoving) {
        return false;
      }
      prevIndex = this.currentIndex - 1;
      if ((this.settings.transitionType === CoffeeSlider.TRANSITION_FADE || this.settings.loop === CoffeeSlider.LOOP_RETURN) && prevIndex < 0) {
        prevIndex = this.numSlides - 1;
      }
      return this.goToIndex(prevIndex, false);
    };

    CoffeeSlider.prototype.next = function() {
      var nextIndex;
      if (this.isMoving) {
        return false;
      }
      nextIndex = this.currentIndex + 1;
      if (nextIndex > (this.numSlides - 1)) {
        if (this.settings.transitionType === CoffeeSlider.TRANSITION_FADE || this.settings.loop === CoffeeSlider.LOOP_RETURN) {
          nextIndex = 0;
        } else if (!this.settings.loop) {
          return;
        }
      }
      return this.goToIndex(nextIndex, false);
    };

    CoffeeSlider.prototype.onTransitionComplete = function() {
      if (this.settings.loop === CoffeeSlider.LOOP_LIMIT && this.settings.hasPrevNext === true) {
        if (this.currentIndex === 0) {
          this.prevBtn.addClass("disabled");
        } else {
          this.prevBtn.removeClass("disabled");
        }
        if ((this.numSlides - this.settings.step) <= (this.currentIndex * this.settings.step)) {
          this.nextBtn.addClass("disabled");
        } else {
          this.nextBtn.removeClass("disabled");
        }
      }
      this.isMoving = false;
      if (this.settings.loop === CoffeeSlider.LOOP_INFINITE && this.settings.transitionType !== CoffeeSlider.TRANSITION_FADE) {
        if (this.currentIndex === -1) {
          return this.goToIndex(this.numSlides - (3 + (this.settings.step > 1 ? this.settings.step + 1 : 0)), true);
        } else if (this.currentIndex === (this.numSlides - 2) - (this.settings.step > 1 ? this.settings.step + 1 : 0)) {
          return this.goToIndex(0, true);
        } else {
          return this.settings.callbacks.onTransitionComplete();
        }
      } else {
        return this.settings.callbacks.onTransitionComplete();
      }
    };

    CoffeeSlider.prototype.find = function(selectorName) {
      return this.element.find(this.settings.selectors[selectorName]);
    };

    CoffeeSlider.prototype.getContainer = function(name, _default) {
      if (this.settings.selectors[name] === "") {
        return _default;
      } else {
        return this.find(name);
      }
    };

    CoffeeSlider.prototype.getSelector = function(name) {
      var selector;
      selector = this.settings.selectors[name];
      return selector.slice(1, selector.length);
    };

    return CoffeeSlider;

  })(modules.BaseSlider);

}).call(this);
