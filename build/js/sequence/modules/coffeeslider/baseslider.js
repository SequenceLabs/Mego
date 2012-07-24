(function() {
  "use strict";
  var modules,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  modules = Namespace('SEQ.modules');

  modules.BaseSlider = (function() {

    function BaseSlider(options) {
      this.options = options;
      this.navModulesUpdate = __bind(this.navModulesUpdate, this);
      this.onNavModuleChange = __bind(this.onNavModuleChange, this);
      this.registerNavModule = __bind(this.registerNavModule, this);
      this.updateNavModules = __bind(this.updateNavModules, this);
      this.goToIndex = __bind(this.goToIndex, this);
      this.getCurrentIndex = __bind(this.getCurrentIndex, this);
      this.init = __bind(this.init, this);
      this.currentIndex = 0;
      this.element = {};
      this.active = {};
      this.navModules = [];
      this.init();
    }

    BaseSlider.prototype.init = function() {
      return this.goToIndex(0);
    };

    BaseSlider.prototype.getCurrentIndex = function() {
      return this.currentIndex;
    };

    BaseSlider.prototype.goToIndex = function(index, skipTransition) {
      this.currentIndex = index;
      return this.updateNavModules(index, skipTransition);
    };

    BaseSlider.prototype.updateNavModules = function(index, skipTransition) {
      var module, _i, _len, _ref, _results;
      _ref = this.navModules;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        module = _ref[_i];
        _results.push(module.handler(this.currentIndex, skipTransition));
      }
      return _results;
    };

    BaseSlider.prototype.registerNavModule = function(navModule, changeHandler) {
      var _this = this;
      this.navModules.push({
        module: navModule,
        handler: changeHandler != null ? changeHandler : navModule.goToIndex
      });
      return navModule.element.on("change", function() {
        return _this.onNavModuleChange(navModule);
      });
    };

    BaseSlider.prototype.onNavModuleChange = function(navModule) {
      this.goToIndex(navModule.getCurrentIndex());
      return this.navModulesUpdate(navModule);
    };

    BaseSlider.prototype.navModulesUpdate = function(navModule) {
      var module, _i, _len, _ref, _results;
      _ref = this.navModules;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        module = _ref[_i];
        if (module.module === !navModule) {
          _results.push(module.handler(navModule.getCurrentIndex));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return BaseSlider;

  })();

}).call(this);
