(function() {

  SEQ.utils.namespace('SEQ.utils.browser');

  SEQ.utils.browser.CSS3Detection = (function() {
    var prefixes;

    function CSS3Detection() {}

    prefixes = ["", "Webkit", "Moz", "O", "ms", "Khtml"];

    CSS3Detection.GetProp = function(prop) {
      var p, prefix, _i, _len;
      for (_i = 0, _len = prefixes.length; _i < _len; _i++) {
        prefix = prefixes[_i];
        p = "" + prefix + prop;
        if (document.body.style[p] != null) return p;
      }
    };

    CSS3Detection.GetVendorPrefix = function(prop) {
      var prefix, _i, _len;
      for (_i = 0, _len = prefixes.length; _i < _len; _i++) {
        prefix = prefixes[_i];
        if (document.body.style["" + prefix + prop] != null) {
          return "-" + prefix + "-";
        }
      }
    };

    return CSS3Detection;

  })();

  SEQ.utils.browser.platform = {
    isAndroid: function() {
      return navigator.userAgent.toLowerCase().indexOf("android") > -1;
    },
    isiOS: function() {
      return navigator.userAgent.toLowerCase().indexOf('like mac os x') > -1;
    },
    isiPhone: function() {
      return navigator.userAgent.toLowerCase().indexOf("iphone") > -1;
    },
    isiPad: function() {
      return navigator.userAgent.toLowerCase().indexOf("ipad") > -1;
    },
    isRetinaDisplay: function() {
      return window.devicePixelRatio >= 2;
    },
    isBlackberry: function() {
      return navigator.userAgent.toLowerCase().indexOf("blackberry") > -1;
    },
    isDesktop: function() {
      var desktop;
      desktop = true;
      if (this.isAndroid() || this.isiOS() || this.isBlackberry()) desktop = false;
      return desktop;
    }
  };

}).call(this);
