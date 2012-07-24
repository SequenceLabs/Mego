(function() {
  "use strict";
  var browser,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  browser = Namespace("SEQ.utils.browser");

  browser.MediaQueries = (function() {

    function MediaQueries() {
      this.init = __bind(this.init, this);      this.siteNav = SEQ.mego.app.siteNav;
      this.init();
    }

    MediaQueries.prototype.init = function() {
      var _this = this;
      Harvey.attach("screen and (max-width: 480px)", {
        setup: function() {},
        on: function() {},
        off: function() {}
      });
      Harvey.attach("screen and (max-width: 767px)", {
        setup: function() {},
        on: function() {
          return _this.siteNav.attach();
        },
        off: function() {
          return _this.siteNav.detach();
        }
      });
      Harvey.attach("screen and (min-width: 768px) and (max-width: 979px)", {
        setup: function() {},
        on: function() {},
        off: function() {}
      });
      return Harvey.attach("screen and (min-width: 1200px)", {
        setup: function() {},
        on: function() {},
        off: function() {}
      });
    };

    return MediaQueries;

  })();

}).call(this);
