(function() {
  "use strict";

  var modules,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  modules = Namespace('SEQ.modules');

  modules.ButtonNav = (function(_super) {

    __extends(ButtonNav, _super);

    function ButtonNav(options) {
      this.options = options;
      this.goToIndex = __bind(this.goToIndex, this);

      this.setActive = __bind(this.setActive, this);

      this.onClick = __bind(this.onClick, this);

      this.init = __bind(this.init, this);

      this.btns = [];
      ButtonNav.__super__.constructor.call(this, this.options);
    }

    ButtonNav.prototype.init = function() {
      var btn, i, slide, title, _i, _len, _ref;
      this.element = $("<nav />").addClass("button-nav");
      this.element.append($("<ul />"));
      _ref = this.options.slides;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        slide = _ref[i];
        title = $(slide).find(this.options.titleSelector).html();
        btn = $("<li />").html(title);
        this.btns.push(btn);
        this.element.find("ul").append(btn);
      }
      this.element.on("click", this.onClick);
      this.options.parent.append(this.element);
      return ButtonNav.__super__.init.call(this);
    };

    ButtonNav.prototype.onClick = function(e) {
      e.preventDefault();
      this.setActive($(e.target));
      this.element.trigger("change");
      return false;
    };

    ButtonNav.prototype.setActive = function(btn) {
      if (!btn.is("li")) {
        return;
      }
      if (this.active.length > 0) {
        this.active.removeClass('active');
      }
      this.active = btn;
      this.active.addClass('active');
      return this.currentIndex = btn.index();
    };

    ButtonNav.prototype.goToIndex = function(index, skipTransition) {
      ButtonNav.__super__.goToIndex.call(this, index, skipTransition);
      if ((this.btns[index] != null) && this.btns[index].length > 0) {
        return this.setActive(this.btns[index]);
      }
    };

    return ButtonNav;

  })(modules.BaseSlider);

}).call(this);
