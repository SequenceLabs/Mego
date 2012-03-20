(function() {
  "use strict";
  var modules, transition,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

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
      this.onSlideshowTick = __bind(this.onSlideshowTick, this);
      this.initSlideshow = __bind(this.initSlideshow, this);
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
      this.slideWidth = this.slides.eq(0).outerWidth(true);
      this.slideHeight = this.slides.eq(0).outerHeight(true);
      this.totalWidth = this.slideWidth * this.numSlides;
      this.totalHeight = this.slideHeight * this.numSlides;
      if (this.settings.transitionType === "slide" || this.settings.transitionType === "slideFade") {
        if (this.settings.transitionDirection === "horizontal") {
          this.slides.css({
            float: "left",
            overflow: "hidden"
          });
          this.slideWidth = this.slides.eq(0).outerWidth(true);
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
    Initialises the slideshow, if needed.
    @private
    */

    CoffeeSlider.prototype.initSlideshow = function() {
      clearTimeout(this.timer);
      return this.timer = setTimeout(this.onSlideshowTick, this.settings.transitionDelay);
    };

    CoffeeSlider.prototype.onSlideshowTick = function() {
      return this.next();
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
      this.inner.bind("touchmove", this.onTouchMove);
      if (this.settings.slideshow) return clearTimeout(this.timer);
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
    Goes to a specific slide (as indicated).
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
          this.pagination.setPage(this.numSlides - 2);
        } else if (this.currentIndex > (this.numSlides - 3)) {
          this.pagination.setPage(1);
        } else {
          this.pagination.setPage(this.currentIndex + 1);
        }
      }
      if (this.settings.slideshow) return this.initSlideshow();
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

}).call(this);
