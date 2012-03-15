(function() {
  "use strict";
  var modules;

  modules = SEQ.utils.namespace('SEQ.modules');

  modules.BaseModule = (function() {

    BaseModule.settings = {};

    function BaseModule(container, options) {}

    return BaseModule;

  })();

}).call(this);
