(function() {
  "use strict";

  var animate, modules,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  modules = Namespace('SEQ.modules');

  animate = Namespace('SEQ.effects.Transition');

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

}).call(this);
