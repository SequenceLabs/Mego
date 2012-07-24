(function() {
  "use strict";
  var modules,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  modules = Namespace('SEQ.modules');

  modules.DotNav = (function(_super) {

    __extends(DotNav, _super);

    function DotNav(options) {
      this.options = options;
      this.goToIndex = __bind(this.goToIndex, this);
      this.setActive = __bind(this.setActive, this);
      this.onClick = __bind(this.onClick, this);
      this.init = __bind(this.init, this);
      this.btns = [];
      DotNav.__super__.constructor.call(this, this.options);
    }

    DotNav.prototype.init = function() {
      var btn, i, slide, _len, _ref;
      this.element = $("<nav />").addClass("dot-nav");
      this.element.append($("<ol />"));
      _ref = this.options.slides;
      for (i = 0, _len = _ref.length; i < _len; i++) {
        slide = _ref[i];
        btn = $("<li />").html(i);
        this.btns.push(btn);
        this.element.find("ol").append(btn);
      }
      this.element.on("click", this.onClick);
      this.options.parent.append(this.element);
      return DotNav.__super__.init.call(this);
    };

    DotNav.prototype.onClick = function(e) {
      e.preventDefault();
      this.setActive($(e.target));
      this.element.trigger("change");
      return false;
    };

    DotNav.prototype.setActive = function(btn) {
      if (!btn.is("li")) return;
      if (this.active.length > 0) this.active.removeClass('active');
      this.active = btn;
      this.active.addClass('active');
      return this.currentIndex = btn.index();
    };

    DotNav.prototype.goToIndex = function(index, skipTransition) {
      DotNav.__super__.goToIndex.call(this, index, skipTransition);
      if ((this.btns[index] != null) && this.btns[index].length > 0) {
        return this.setActive(this.btns[index]);
      }
    };

    return DotNav;

  })(modules.BaseSlider);

}).call(this);
