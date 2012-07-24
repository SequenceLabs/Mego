(function() {
  "use strict";
  var modules,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  modules = Namespace('SEQ.modules');

  modules.ThumbSlider = (function(_super) {

    __extends(ThumbSlider, _super);

    function ThumbSlider(options) {
      this.options = options;
      this.applySizes = __bind(this.applySizes, this);
      this.onClick = __bind(this.onClick, this);
      this.getCurrentIndex = __bind(this.getCurrentIndex, this);
      this.setCurrentSlide = __bind(this.setCurrentSlide, this);
      this.init = __bind(this.init, this);
      ThumbSlider.__super__.constructor.call(this, this.options);
      window.t = this;
    }

    ThumbSlider.prototype.init = function() {
      ThumbSlider.__super__.init.call(this);
      return this.element.on("click", this.onClick);
    };

    ThumbSlider.prototype.setCurrentSlide = function(index, skipTransition) {
      var delay,
        _this = this;
      if (index === this.getCurrentIndex()) return false;
      if (this.current != null) this.current.removeClass("active");
      this.current = $(this.slides[index]);
      this.current.addClass("active");
      if (skipTransition) {
        delay = 10;
      } else {
        delay = 0;
      }
      return setTimeout(function() {
        return _this.goToIndex(Math.floor(index / _this.settings.step), skipTransition);
      }, delay);
    };

    ThumbSlider.prototype.snapToNearestSlide = function() {
      var fraction;
      fraction = 1 / this.settings.step;
      return this.goToIndex(this.currentIndex + Math.round((this.distanceMoved.x / this.slideWidth) / this.settings.step / fraction) * fraction);
    };

    ThumbSlider.prototype.getCurrentIndex = function() {
      if (this.current != null) {
        return this.current.index();
      } else {
        return null;
      }
    };

    ThumbSlider.prototype.onClick = function(e) {
      var target;
      if (this.distanceMoved.x || this.distanceMoved.y > 50) return;
      target = $(e.target);
      e.preventDefault();
      if (target.hasClass("slide")) {
        this.setCurrentSlide(target.index());
        return this.element.trigger("change");
      }
    };

    ThumbSlider.prototype.applySizes = function() {
      ThumbSlider.__super__.applySizes.call(this);
      return this.element.css({
        width: this.outer.width() * this.settings.step
      });
    };

    return ThumbSlider;

  })(modules.CoffeeSlider);

}).call(this);
