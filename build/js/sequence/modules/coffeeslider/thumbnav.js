(function() {
  "use strict";

  var modules,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  modules = Namespace('SEQ.modules');

  modules.ThumbNav = (function(_super) {

    __extends(ThumbNav, _super);

    function ThumbNav(options) {
      this.options = options;
      this.getCurrentIndex = __bind(this.getCurrentIndex, this);

      this.goToIndex = __bind(this.goToIndex, this);

      this.onClick = __bind(this.onClick, this);

      this.init = __bind(this.init, this);

      ThumbNav.__super__.constructor.call(this, this.options);
    }

    ThumbNav.prototype.init = function() {
      ThumbNav.__super__.init.call(this);
      this.element = this.options.element;
      return this.element.on("click", "li", this.onClick);
    };

    ThumbNav.prototype.onClick = function(e) {
      this.goToIndex($(e.currentTarget).index(), false);
      return this.element.trigger("change");
    };

    ThumbNav.prototype.goToIndex = function(index, skipTransition) {
      return this.currentIndex = index;
    };

    ThumbNav.prototype.getCurrentIndex = function() {
      return Math.floor(this.currentIndex / 3);
    };

    return ThumbNav;

  })(modules.BaseSlider);

}).call(this);
