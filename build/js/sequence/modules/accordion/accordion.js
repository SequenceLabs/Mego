(function() {
  "use strict";

  var animate, modules,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  modules = Namespace('SEQ.modules');

  animate = Namespace('SEQ.effects.Transition');

  modules.Accordion = (function() {

    function Accordion(container, settings) {
      this.open = __bind(this.open, this);

      this.close = __bind(this.close, this);

      this.onHeaderClick = __bind(this.onHeaderClick, this);

      var _this = this;
      this.isOpen = false;
      this.settings = settings;
      this.container = $(container);
      this.inner = this.container.find(this.settings.selectors.inner);
      this.inner.css({
        overflow: "hidden"
      });
      this.openHeight = this.inner.outerHeight();
      this.header = this.container.find(this.settings.selectors.header);
      this.header.css({
        cursor: "pointer"
      });
      this.header.on("click", this.onHeaderClick);
      this.header.on("mousedown", function(e) {
        return e.preventDefault();
      });
      this.close(0);
    }

    Accordion.prototype.onHeaderClick = function(e) {
      e.preventDefault();
      if (this.isOpen) {
        return this.close(this.settings.openDuration);
      } else {
        return this.open(this.settings.closeDuration);
      }
    };

    Accordion.prototype.close = function(duration) {
      var _this = this;
      this.container.addClass("closed").removeClass("open");
      this.isOpen = false;
      return setTimeout(function() {
        return animate.To({
          target: _this.inner,
          duration: duration,
          props: {
            height: "0px",
            opacity: 0
          }
        });
      }, 100);
    };

    Accordion.prototype.open = function(duration) {
      var _this = this;
      this.container.addClass("open").removeClass("closed");
      this.isOpen = true;
      return animate.To({
        target: this.inner,
        duration: duration,
        props: {
          height: "" + this.openHeight + "px",
          opacity: 1
        },
        complete: function() {
          return _this.inner.css({
            height: "auto"
          });
        }
      });
    };

    return Accordion;

  })();

}).call(this);
