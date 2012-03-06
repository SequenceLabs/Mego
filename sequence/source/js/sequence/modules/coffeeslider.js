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
      this.find = __bind(this.find, this);
      this.onTransitionComplete = __bind(this.onTransitionComplete, this);
      this.slideFadeTo = __bind(this.slideFadeTo, this);
      this.slideTo = __bind(this.slideTo, this);
      this.goTo = __bind(this.goTo, this);
      this.onTouchMove = __bind(this.onTouchMove, this);
      this.onTouchEndOrCancel = __bind(this.onTouchEndOrCancel, this);
      this.onTouchStart = __bind(this.onTouchStart, this);
      this.bindUIEvents = __bind(this.bindUIEvents, this);      ({
        this.settings: {},
        this.container: {},
        this.outer: {},
        this.inner: {},
        this.uiParent: {},
        this.prevBtn: {},
        this.nextBtn: {},
        this.slides: {},
        this.slideWidth: 0,
        this.totalWidth: 0,
        this.currentIndex: 1000,
        this.numSlides: 0,
        this.currentSlide: {},
        this.isMoving: false,
        this.pagination: {},
        this.dotNav: {}
      });
      this.container = this.options.container;
      this.container.addClass("coffee-slider");
      this.applySettings(options);
      this.bindToDOM();
      this.initUI();
      this.initSlides();
      this.bindUIEvents();
      this.settings.callbacks.onStart();
      this.goTo(0, true);
    }

    /** 
    Merges user-defined options with defaults.
    @param {Object}  options    User-defined options
    @private
    */

    CoffeeSlider.prototype.applySettings = function(options) {
      this.settings = {
        transitionType: "slide",
        slideshow: true,
        transitionDelay: 2000,
        transitionSpeed: 1000,
        transitionStep: 1,
        hasDotNav: true,
        hasPrevNext: true,
        hasPagination: false,
        touchEnabled: true,
        infinite: true,
        preloadImages: true,
        selectors: {
          slide: ".slide",
          outer: ".outer",
          inner: ".inner",
          prev: ".prev",
          next: ".next",
          uiParent: "",
          paginationContainer: "",
          dotNav: ".dot-nav",
          pagination: ".pagination",
          paginationCurrent: ".currentPage",
          paginationTotal: ".total"
        },
        callBacks: {
          onStart: function() {},
          onTransition: function() {},
          onTransitionComplete: function() {}
        }
      };
      return $.extend(true, this.settings, options);
    };

    /**
    Binds internal properties to DOM elements.
    @private
    */

    CoffeeSlider.prototype.bindToDOM = function() {
      this.slides = this.find("slide");
      this.numSlides = this.slides.length;
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

    CoffeeSlider.prototype.initSlides = function() {
      if (this.settings.infinite) {
        this.appendClonedSlides();
        this.slides = this.find("slide");
        this.numSlides = this.slides.length;
      }
      if (this.settings.preloadImages) this.preload();
      this.applyStyles();
      if (this.numSlides < this.settings.transitionStep) return this.removeUI();
    };

    /**
    Appends cloned slides to either side for purposes of creating illusion of infinite scrolling.
    @private
    */

    CoffeeSlider.prototype.appendClonedSlides = function() {
      this.inner.append(this.slides.eq(0).clone().addClass('clone').css({
        float: "left"
      }));
      return this.inner.prepend(this.slides.eq(this.numSlides - 1).clone().addClass('clone').css({
        float: "left"
      }));
    };

    /**
    Applies some basic CSS.
    @private
    */

    CoffeeSlider.prototype.applyStyles = function() {
      var allSlides,
        _this = this;
      allSlides = this.find("slide");
      allSlides.each(function(i, slide) {
        return _this.totalWidth += $(slide).outerWidth(true);
      });
      this.inner.css({
        width: this.totalWidth
      });
      this.slideWidth = allSlides.eq(0).outerWidth(true);
      this.outer.css({
        width: this.slideWidth,
        overflow: "hidden"
      });
      this.slides.css({
        float: "left"
      });
      this.inner.css({
        position: "relative",
        overflow: "hidden"
      });
      return this.outer.css('overflow', 'hidden');
    };

    /**
    Preloads images.
    @private
    */

    CoffeeSlider.prototype.preload = function() {
      this.container.css({
        visibility: "visible"
      });
      return this.inner.fadeOut(0).fadeIn("500");
    };

    /**
    Initialises UI components.
    @private
    */

    CoffeeSlider.prototype.initUI = function() {
      var i, slide, _len, _ref;
      this.uiParent = this.getContainer("uiParent", this.container);
      if (this.settings.hasPrevNext) {
        this.uiParent.append("<div class='" + (this.getSelector("prev")) + "'>previous</div>");
        this.uiParent.append("<div class='" + (this.getSelector("next")) + "'>next</div>");
        this.nextBtn = this.find("next");
        this.prevBtn = this.find("prev");
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
      if (this.settings.touchEnabled) {
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

    CoffeeSlider.prototype.onTouchEndOrCancel = function(e) {
      this.inner.unbind("touchend", this.onTouchEndOrCancel);
      this.inner.unbind("touchcancel", this.onTouchEndOrCancel);
      this.inner.unbind("touchmove", this.onTouchMove);
      if (this.distanceMovedX > 50) {
        return this.next();
      } else if (this.distanceMovedX < -50) {
        return this.prev();
      } else {
        return this.goTo(this.currentIndex);
      }
    };

    /**
    Called when a touch move event fires.
    @private 
    @param {Object} e the event object.
    */

    CoffeeSlider.prototype.onTouchMove = function(e) {
      this.endX = e.originalEvent.touches[0].pageX;
      this.endY = e.originalEvent.touches[0].pageY;
      this.distanceMovedX = this.startX - this.endX;
      this.distanceMovedY = this.startY - this.endY;
      if (this.distanceMovedX > 15) {
        e.preventDefault();
      } else if (this.distanceMovedY > 15) {
        this.inner.unbind("touchmove", this.onTouchMove);
      }
      return this.inner.css({
        left: this.innerLeft - (this.startX - this.endX)
      });
    };

    /**
    Goes to a specific slide (as indicate d).
    @public
    @param {Object} index The index (in the Array this.slides) of the slide to go to.
    @param {Boolean} [skipTransition] If 'true', goes directly to slide without animation.
    */

    CoffeeSlider.prototype.goTo = function(index, skipTransition) {
      var ACTIVE;
      if (this.isMoving || this.currentIndex === index) return false;
      this.settings.callbacks.onTransition();
      if (!skipTransition) this.isMoving = true;
      if (this.settings.transitionType === "slide") {
        this.slideTo(index, skipTransition);
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
      var offset;
      this.currentIndex = index;
      offset = (this.settings.infinite ? 1 : 0);
      return transition.To({
        target: this.inner,
        props: {
          left: 0 - (index + offset) * this.slideWidth
        },
        duration: skipTransition ? 0 : this.settings.transitionSpeed,
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
      if (this.slides[this.currentIndex] != null) {
        transition.To({
          target: this.slides[this.currentIndex],
          props: {
            opacity: 0
          },
          duration: this.settings.transitionSpeed
        });
      }
      transition.To({
        target: this.slides[index],
        props: {
          opacity: 1
        },
        duration: this.settings.transitionSpeed
      });
      return this.slideTo(index, skipTransition);
    };

    /**
    Goes to the previous page.
    @public
    */

    CoffeeSlider.prototype.prev = function() {
      return this.goTo(this.currentIndex - 1, false);
    };

    /**
    Goes to the next page.
    @public
    */

    CoffeeSlider.prototype.next = function() {
      return this.goTo(this.currentIndex + 1, false);
    };

    /**
    Called whenever a slide transition completes.
    @public
    */

    CoffeeSlider.prototype.onTransitionComplete = function() {
      this.isMoving = false;
      if (this.settings.infinite) {
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
