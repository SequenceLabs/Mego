(function() {
  "use strict";

  var Gallery, modules;

  modules = SEQ.utils.namespace('SEQ.modules');

  SEQ.modules.Gallery = Gallery = (function() {

    function Gallery(options) {
      this.options = options;
    }

    return Gallery;

  })();

}).call(this);
