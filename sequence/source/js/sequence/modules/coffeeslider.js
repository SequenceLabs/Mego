(function() {
  var animate, modules,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  modules = SEQ.utils.namespace('SEQ.modules');

  animate = SEQ.effects.Animate;

  modules.CoffeeSlider = (function() {

    function CoffeeSlider(container, options) {
      this.find = __bind(this.find, this);
      this.onAnimationComplete = __bind(this.onAnimationComplete, this);
      this.slideFadeTo = __bind(this.slideFadeTo, this);
      this.slideTo = __bind(this.slideTo, this);
      this.goTo = __bind(this.goTo, this);
      this.drag = __bind(this.drag, this);
      this.onTouchMove = __bind(this.onTouchMove, this);
      this.onTouchEnd = __bind(this.onTouchEnd, this);
      this.onTouchStart = __bind(this.onTouchStart, this);
      this.bindUIEvents = __bind(this.bindUIEvents, this);      this.settings = {};
      this.container = container;
      this.outer = {};
      this.inner = {};
      this.uiParent = {};
      this.prevBtn = {};
      this.nextBtn = {};
      this.slides = {};
      this.slideWidth = 0;
      this.totalWidth = 0;
      this.currentIndex = 1000;
      this.numSlides = 0;
      this.currentSlide = {};
      this.isMoving = false;
      this.pagination = {};
      this.dotNav = {};
      this.container.addClass("coffee-slider");
      this.applySettings(options);
      this.bindToDOM();
      this.initUI();
      this.initSlides();
      this.bindUIEvents();
      this.goTo(0, true);
    }

    /**
    @param {Object}  options    User-defined options
    */

    CoffeeSlider.prototype.applySettings = function(options) {
      this.settings = {
        animationType: "slide",
        slideshow: true,
        transitionDelay: 2000,
        transitionSpeed: 1000,
        transitionStep: 1,
        hasDotNav: true,
        hasPrevNext: true,
        hasPagination: true,
        touchEnabled: true,
        infinite: true,
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
          onChange: function() {},
          onChangeComplete: function() {}
        }
      };
      return $.extend(true, this.settings, options);
    };

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

    CoffeeSlider.prototype.initSlides = function() {
      if (this.settings.infinite) {
        this.appendClonedSlides();
        this.slides = this.find("slide");
        this.numSlides = this.slides.length;
      }
      this.applyStyles();
      if (this.numSlides < this.settings.transitionStep) return this.removeUI();
    };

    CoffeeSlider.prototype.appendClonedSlides = function() {
      this.inner.append(this.slides.eq(0).clone().addClass('clone').css({
        float: "left"
      }));
      return this.inner.prepend(this.slides.eq(this.numSlides - 1).clone().addClass('clone').css({
        float: "left"
      }));
    };

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

    CoffeeSlider.prototype.removeUI = function() {
      this.nextBtn.remove();
      return this.prevBtn.remove();
    };

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

    CoffeeSlider.prototype.onTouchStart = function(e) {
      this.innerLeft = parseInt(this.inner.css("left"));
      this.startX = e.originalEvent.touches[0].pageX;
      this.inner.bind("touchend", this.onTouchEnd);
      this.inner.bind("touchmove", this.onTouchMove);
      return this.drag(e.originalEvent);
    };

    CoffeeSlider.prototype.onTouchEnd = function(e) {
      var distance;
      this.inner.unbind("touchend", this.onTouchEnd);
      distance = this.startX - this.endX;
      if (distance > 50) {
        return this.next();
      } else if (distance < -50) {
        return this.prev();
      } else {
        return this.goTo(this.currentIndex);
      }
    };

    CoffeeSlider.prototype.onTouchMove = function(e) {
      return this.drag(e.originalEvent);
    };

    CoffeeSlider.prototype.drag = function(e) {
      this.endX = e.touches[0].pageX;
      return this.inner.css({
        left: this.innerLeft - (this.startX - this.endX)
      });
    };

    CoffeeSlider.prototype.goTo = function(index, skipAnimation) {
      var ACTIVE;
      if (this.isMoving || this.currentIndex === index) return false;
      if (!skipAnimation) this.isMoving = true;
      if (this.settings.animationType === "slide") {
        this.slideTo(index, skipAnimation);
      } else if (this.settings.animationType === "slideFade") {
        this.slideFadeTo(index, skipAnimation);
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

    CoffeeSlider.prototype.slideTo = function(index, skipAnimation) {
      var offset;
      this.currentIndex = index;
      offset = (this.settings.infinite ? 1 : 0);
      return animate.To({
        target: this.inner,
        props: {
          left: 0 - (index + offset) * this.slideWidth
        },
        duration: skipAnimation ? 0 : this.settings.transitionSpeed,
        complete: this.onAnimationComplete
      });
    };

    CoffeeSlider.prototype.slideFadeTo = function(index, skipAnimation) {
      if (this.slides[this.currentIndex] != null) {
        animate.To({
          target: this.slides[this.currentIndex],
          props: {
            opacity: 0
          },
          duration: this.settings.transitionSpeed
        });
      }
      animate.To({
        target: this.slides[index],
        props: {
          opacity: 1
        },
        duration: this.settings.transitionSpeed
      });
      return this.slideTo(index, skipAnimation);
    };

    CoffeeSlider.prototype.prev = function() {
      return this.goTo(this.currentIndex - 1, false);
    };

    CoffeeSlider.prototype.next = function() {
      return this.goTo(this.currentIndex + 1, false);
    };

    CoffeeSlider.prototype.onAnimationComplete = function() {
      this.isMoving = false;
      if (this.settings.infinite) {
        if (this.currentIndex === -1) {
          return this.goTo(this.numSlides - 3, true);
        } else if (this.currentIndex === this.numSlides - 2) {
          return this.goTo(0, true);
        }
      }
    };

    CoffeeSlider.prototype.find = function(f) {
      return this.container.find(this.settings.selectors[f]);
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
