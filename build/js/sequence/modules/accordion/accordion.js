(function() {
  "use strict";
  var animate, modules,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  modules = SEQ.utils.namespace('SEQ.modules');

  animate = SEQ.effects.Animate;

  modules.AccordionGroup = (function() {

    AccordionGroup.settings = {};

    function AccordionGroup(container, options) {
      var section, _i, _len, _ref;
      this.container = container;
      this.open = __bind(this.open, this);
      this.applySettings = __bind(this.applySettings, this);
      this.applySettings(options);
      this.sections = [];
      _ref = this.container.find(this.settings.selectors.main);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        section = _ref[_i];
        this.sections.push(new modules.Accordion(section, this.settings));
      }
    }

    AccordionGroup.prototype.applySettings = function(options) {
      this.settings = {
        openDuration: 300,
        closeDuration: 300,
        selectors: {
          main: ".section",
          header: "header",
          inner: ".inner"
        }
      };
      return $.extend(true, this.settings, options);
    };

    AccordionGroup.prototype.open = function(index, openDuration) {
      return this.sections[index || (index = 0)].open(openDuration || (openDuration = this.settings.openDuration));
    };

    return AccordionGroup;

  })();

  modules.Accordion = (function() {

    function Accordion(container, settings) {
      var _this = this;
      this.settings = settings;
      this.open = __bind(this.open, this);
      this.close = __bind(this.close, this);
      this.isOpen = false;
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
      this.header.on("click", function() {
        if (_this.isOpen) {
          return _this.close(_this.settings.openDuration);
        } else {
          return _this.open(_this.settings.closeDuration);
        }
      });
      this.close(0);
    }

    Accordion.prototype.close = function(duration) {
      var _this = this;
      this.container.addClass("closed").removeClass("open");
      this.isOpen = false;
      this.inner.css({
        height: this.inner.outerHeight()
      });
      return setTimeout(function() {
        return animate.To({
          target: _this.inner,
          duration: duration,
          props: {
            height: "0px",
            opacity: 0
          }
        });
      }, 1);
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
