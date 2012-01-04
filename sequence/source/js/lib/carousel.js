(function() {
  var $, _ref;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  if ((_ref = window.App) == null) window.App = {};

  $ = jQuery;

  App.Carousel = (function() {

    Carousel.prototype.settings = {};

    Carousel.prototype.$carousel = {};

    Carousel.prototype.$outer = {};

    Carousel.prototype.$inner = {};

    Carousel.prototype.$uiParent = {};

    Carousel.prototype.$paginationContainer = {};

    Carousel.prototype.$prevBtn = {};

    Carousel.prototype.$nextBtn = {};

    Carousel.prototype.$paginationNav = {};

    Carousel.prototype.$slides = {};

    Carousel.prototype.totalWidth = 0;

    Carousel.prototype.currentIndex = 0;

    Carousel.prototype.numSlides = 0;

    Carousel.prototype.$currentSlide = {};

    /**
    @param {jQuery}  carousel   The main carousel container
    @param {Object}  options    User-defined options
    */

    function Carousel(carousel, options) {
      this.$find = __bind(this.$find, this);
      this.stop = __bind(this.stop, this);
      this.play = __bind(this.play, this);
      this.goTo = __bind(this.goTo, this);
      this.next = __bind(this.next, this);
      this.prev = __bind(this.prev, this);
      this.onTransitionComplete = __bind(this.onTransitionComplete, this);
      this.drag = __bind(this.drag, this);
      this.onTouchMove = __bind(this.onTouchMove, this);
      this.onTouchEnd = __bind(this.onTouchEnd, this);
      this.onTouchStart = __bind(this.onTouchStart, this);
      this.bindUIEvents = __bind(this.bindUIEvents, this);      this.$carousel = carousel;
      this.$carousel.addClass("carousel");
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

    Carousel.prototype.applySettings = function(options) {
      this.settings = {
        animationType: "slide",
        slideshow: true,
        transitionDelay: 2000,
        transitionSpeed: 1000,
        transitionStep: 1,
        hasPaginationNav: true,
        hasPagination: true,
        touchEnabled: true,
        infinite: false,
        loop: true,
        preloadImages: true,
        selectors: {
          slide: ".slide",
          outer: ".outer",
          inner: ".inner",
          prev: ".prev",
          next: ".next",
          uiParent: "",
          paginationContainer: "",
          paginationNav: ".pagination_nav",
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

    Carousel.prototype.bindToDOM = function() {
      this.$outer = this.$find("outer");
      this.$inner = this.$find("inner");
      return this.$slides = this.$find("slide");
    };

    Carousel.prototype.initSlides = function() {
      var slide, _i, _len, _ref2;
      this.numSlides = this.$slides.length;
      if (this.settings.infinite) this.initInfinite();
      if (this.settings.preloadImages) this.preload();
      _ref2 = this.$slides;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        slide = _ref2[_i];
        this.totalWidth += $(slide).outerWidth(true);
      }
      this.$inner.css("width", this.totalWidth);
      this.$slides.css('float', 'left');
      this.$inner.css('position', "relative");
      if (this.numSlides < this.settings.transitionStep) return this.removeUI();
    };

    Carousel.prototype.preload = function() {
      this.$carousel.css("visibility", "visible");
      return this.$inner.fadeOut(0).fadeIn("500");
    };

    Carousel.prototype.initInfinite = function() {
      this.$inner.append(this.$slides.eq(0).clone());
      this.$inner.prepend(this.$slides.eq(this.numSlides - 1).clone());
      return this.$inner.css({
        left: "-940px"
      });
    };

    Carousel.prototype.initUI = function() {
      this.$uiParent = this.getContainer("uiParent", this.$carousel);
      this.$uiParent.append("<div class='" + (this.getSelector("prev")) + "'>previous</div>");
      this.$uiParent.append("<div class='" + (this.getSelector("next")) + "'>next</div>");
      this.$nextBtn = this.$find("next");
      this.$prevBtn = this.$find("prev");
      this.$paginationContainer = this.getContainer("paginationContainer", this.$uiParent);
      if (this.settings.hasPaginationNav) this.initPaginationNav();
      if (this.settings.hasPagination) return this.initPagination();
    };

    Carousel.prototype.removeUI = function() {
      this.$nextBtn.remove();
      return this.$prevBtn.remove();
    };

    Carousel.prototype.initPaginationNav = function() {
      var i, slide, _len, _ref2, _results;
      this.$paginationContainer.append("<ol class='" + (this.getSelector("paginationNav")) + "'></ol>");
      this.$paginationNav = this.$find("paginationNav");
      _ref2 = this.$slides;
      _results = [];
      for (i = 0, _len = _ref2.length; i < _len; i++) {
        slide = _ref2[i];
        _results.push(this.$paginationNav.append("<li>" + i + "</li>"));
      }
      return _results;
    };

    Carousel.prototype.initPagination = function() {
      return this.$paginationContainer.append("<div class='" + (this.getSelector("pagination")) + "'><span class='" + (this.getSelector("paginationCurrent")) + "'>01</span>/<span class='" + (this.getSelector("paginationTotal")) + "'>01</span></div>");
    };

    Carousel.prototype.bindUIEvents = function() {
      var _this = this;
      this.$nextBtn.bind("click", function(e) {
        e.preventDefault();
        return _this.next();
      });
      this.$prevBtn.bind("click", function(e) {
        e.preventDefault();
        return _this.prev();
      });
      if (this.settings.hasPaginationNav) {
        this.$paginationNav.bind("click", function(e) {
          e.preventDefault();
          return _this.goTo($(e.target).index());
        });
      }
      if (this.settings.touchEnabled) {
        return this.$inner.bind("touchstart", this.onTouchStart);
      }
    };

    Carousel.prototype.onTouchStart = function(e) {
      this.innerLeft = parseInt(this.$inner.css("left"));
      this.startX = e.originalEvent.touches[0].pageX;
      this.$inner.bind("touchend", this.onTouchEnd);
      this.$inner.bind("touchmove", this.onTouchMove);
      return this.drag(e.originalEvent);
    };

    Carousel.prototype.onTouchEnd = function(e) {
      var distance;
      this.$inner.unbind("touchend", this.onTouchEnd);
      distance = this.startX - this.endX;
      if (distance > 150) {
        return this.next();
      } else if (distance < -150) {
        return this.prev();
      } else {
        return this.slideToCurrentIndex();
      }
    };

    Carousel.prototype.onTouchMove = function(e) {
      return this.drag(e.originalEvent);
    };

    Carousel.prototype.drag = function(e) {
      this.endX = e.touches[0].pageX;
      return this.$inner.css({
        left: this.innerLeft - (this.startX - this.endX)
      });
    };

    Carousel.prototype.updatePaginationNav = function() {
      this.$paginationNav.children().removeClass("current");
      return this.$paginationNav.children().eq(this.currentIndex).addClass("current");
    };

    Carousel.prototype.updatePagination = function() {
      this.$paginationContainer.find(this.settings.selectors.paginationCurrent).html(this.currentIndex < 10 ? "0" + (this.currentIndex + 1).toString() : (this.currentIndex + 1).toString());
      return this.$paginationContainer.find(this.settings.selectors.paginationTotal).html(this.numSlides < 10 ? ("0" + this.numSlides).toString() : this.numSlides.toString());
    };

    Carousel.prototype.skipToSlide = function() {
      this.$inner.css({
        left: this.getPos()
      });
      if (this.settings.animationType === "slideFade") {
        this.$slides.each(function() {
          return $(this).children().fadeTo(0, 0);
        });
        return this.$currentSlide.children().fadeTo(0, 1);
      }
    };

    Carousel.prototype.slideToCurrentIndex = function() {
      var pos;
      pos = this.getPos();
      if (this.settings.animationMethod.toLowerCase() === "css3") {
        this.$inner.css({
          left: pos
        });
        return this.onTransitionComplete();
      } else if (this.settings.animationMethod.toLowerCase() === "jquery") {
        return this.$inner.animate({
          left: pos
        }, this.settings.transitionSpeed, this.onTransitionComplete);
      }
    };

    Carousel.prototype.slideFadeToCurrentIndex = function() {
      var _this = this;
      this.slideToCurrentIndex();
      this.$slides.each(function() {
        if ($(this) !== this.$currentSlide) {
          return $(this).delay(200).children().each(function(i) {
            return $(this).stop().delay(i * 100).fadeTo(200, 0);
          });
        }
      });
      return this.$currentSlide.fadeTo(200, 1, function() {
        return _this.$currentSlide.children().each(function(i) {
          return $(this).stop().delay(i * 100).fadeTo(200, 1);
        });
      });
    };

    Carousel.prototype.onTransitionComplete = function() {
      var _base;
      this.$carousel.trigger('changeComplete');
      return typeof (_base = this.settings.callBacks).onChangeComplete === "function" ? _base.onChangeComplete() : void 0;
    };

    Carousel.prototype.getPos = function() {
      return -(this.getLeftOffset() + (this.$currentSlide.outerWidth() - this.$carousel.width()) / 2);
    };

    Carousel.prototype.getLeftOffset = function() {
      return this.$currentSlide.position().left;
    };

    Carousel.prototype.prev = function() {
      var newIndex;
      newIndex = this.currentIndex - this.settings.transitionStep;
      if (this.settings.transitionStep > 1) if (newIndex < 0) newIndex = 0;
      if (newIndex >= 0) {
        return this.goTo(newIndex);
      } else {
        if (this.settings.loop) return this.goTo(this.numSlides - 1);
      }
    };

    Carousel.prototype.next = function() {
      var newIndex;
      newIndex = this.currentIndex + this.settings.transitionStep;
      if (this.settings.transitionStep > 1) {
        if ((newIndex + this.settings.transitionStep) > this.numSlides) {
          newIndex -= (newIndex + this.settings.transitionStep) - this.numSlides;
        }
      }
      if (newIndex < this.numSlides) {
        return this.goTo(newIndex);
      } else {
        if (this.settings.loop) return this.goTo(0);
      }
    };

    Carousel.prototype.goTo = function(index, skipAnimation) {
      var _base;
      this.currentIndex = index;
      this.$currentSlide = this.$slides.eq(this.currentIndex);
      if (this.settings.hasPagination) this.updatePagination();
      if (this.settings.hasPaginationNav) this.updatePaginationNav();
      this.$carousel.trigger('change');
      if (typeof (_base = this.settings.callBacks).onChange === "function") {
        _base.onChange();
      }
      if (skipAnimation) {
        return this.skipToSlide();
      } else {
        switch (this.settings.animationType) {
          case "slide":
            return this.slideToCurrentIndex();
          case "slideFade":
            return this.slideFadeToCurrentIndex();
          case "fade":
            return console.log("fade");
        }
      }
    };

    Carousel.prototype.play = function() {
      return console.log("play");
    };

    Carousel.prototype.stop = function() {
      return console.log("stop");
    };

    Carousel.prototype.$find = function(f) {
      return this.$carousel.find(this.settings.selectors[f]);
    };

    Carousel.prototype.getContainer = function(name, _default) {
      if (this.settings.selectors[name] === "") {
        return _default;
      } else {
        return this.$find(name);
      }
    };

    Carousel.prototype.getSelector = function(name) {
      var selector;
      selector = this.settings.selectors[name];
      return selector.slice(1, selector.length);
    };

    return Carousel;

  })();

  App.ThumbnailCarousel = (function() {

    __extends(ThumbnailCarousel, App.Carousel);

    function ThumbnailCarousel() {
      ThumbnailCarousel.__super__.constructor.apply(this, arguments);
      this.activate();
    }

    ThumbnailCarousel.prototype.getPos = function() {
      return -(this.currentIndex * this.$currentSlide.outerWidth(true));
    };

    ThumbnailCarousel.prototype.activate = function() {
      var _this = this;
      return this.$slides.bind("click", function(e) {
        return _this.onThumnnailClick(e);
      });
    };

    ThumbnailCarousel.prototype.onThumnnailClick = function(e) {
      var $iFrame, $video, poster, src;
      var _this = this;
      $iFrame = $(".videoiframe");
      $video = $("#video");
      e.preventDefault();
      src = $(e.currentTarget).attr("data-src");
      poster = $(e.currentTarget).attr("data-poster");
      return $video.fadeTo(500, 0, function() {
        $iFrame.attr("src", "videoiframe.jsp?src=" + src + "&poster=" + poster + "&autoPlay=true&debug=true");
        return $iFrame.load(function() {
          return $video.delay(800).fadeTo(500, 1);
        });
      });
    };

    return ThumbnailCarousel;

  })();

}).call(this);
