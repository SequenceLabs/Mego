(function() {
  var browser;

  browser = Namespace('SEQ.utils.browser');

  browser.platform = {
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
