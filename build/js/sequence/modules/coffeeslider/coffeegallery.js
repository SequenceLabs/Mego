(function() {
  "use strict";

  var CoffeeSlider, ThumbSlider, modules, transition,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  modules = Namespace('SEQ.modules');

  transition = SEQ.effects.Transition;

  CoffeeSlider = modules.CoffeeSlider;

  ThumbSlider = modules.ThumbSlider;

  modules.CoffeeGallery = (function() {

    function CoffeeGallery(options) {
      this.options = options;
      this.createThumbs = __bind(this.createThumbs, this);

      this.initThumbs = __bind(this.initThumbs, this);

      this.initCoffeeSlider = __bind(this.initCoffeeSlider, this);

      this.initCoffeeSlider();
      this.initThumbs();
    }

    CoffeeGallery.prototype.initCoffeeSlider = function() {
      return this.coffeeslider = new CoffeeSlider({
        container: $(this.options.slider),
        transitionType: CoffeeSlider.TRANSITION_SLIDE,
        loop: CoffeeSlider.LOOP_INFINITE,
        transitionSpeed: 1400,
        transitionDelay: 5000,
        transitionDirection: CoffeeSlider.DIRECTION_HORIZONTAL,
        touchStyle: CoffeeSlider.TOUCH_DRAG,
        preload: true,
        responsive: false,
        selectors: {
          slide: "figure"
        }
      });
    };

    CoffeeGallery.prototype.initThumbs = function() {
      if (this.options.autoThumbs) {
        this.createThumbs();
      }
      this.thumbnails = new ThumbSlider({
        container: $(this.options.thumbslider),
        transitionType: ThumbSlider.TRANSITION_SLIDE,
        loop: ThumbSlider.LOOP_LIMIT,
        transitionSpeed: 1400,
        transitionDelay: 5000,
        transitionDirection: ThumbSlider.DIRECTION_HORIZONTAL,
        touchStyle: ThumbSlider.TOUCH_DRAG,
        step: 4,
        responsive: false,
        hasDotNav: false,
        selectors: {
          slide: "figure"
        }
      });
      return this.coffeeslider.registerNavModule(this.thumbnails, this.thumbnails.setCurrentSlide);
    };

    CoffeeGallery.prototype.createThumbs = function() {
      var clone, element, slide, _i, _j, _len, _len1, _ref, _ref1, _results;
      _ref = $(this.options.slider).find(".slide:not(.clone)");
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        slide = _ref[_i];
        clone = $(slide).clone();
        _ref1 = this.options.stripElements;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          element = _ref1[_j];
          clone.find(element).remove();
        }
        _results.push($(this.options.thumbslider).append(clone));
      }
      return _results;
    };

    return CoffeeGallery;

  })();

}).call(this);
