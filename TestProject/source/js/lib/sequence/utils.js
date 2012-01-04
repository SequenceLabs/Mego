(function() {
  var $, _base, _ref, _ref2;

  if ((_ref = window.Sequence) == null) window.Sequence = {};

  if ((_ref2 = (_base = window.Sequence).Utils) == null) _base.Utils = {};

  $ = jQuery;

  window.Sequence.Utils.Platform = {
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

  window.log = function() {
    var newarr;
    log.history = log.history || [];
    log.history.push(arguments);
    if (this.console) {
      arguments.callee = arguments.callee.caller;
      newarr = [].slice.call(arguments);
      if (typeof console.log === "object") {
        return log.apply.call(console.log, console, newarr);
      } else {
        return console.log.apply(console, newarr);
      }
    }
  };

  (function(b) {
    var a, c, d, _results;
    c = function() {};
    d = "assert,clear,count,debug,dir,dirxml,error,exception,firebug,group,groupCollapsed,groupEnd,info,log,memoryProfile,memoryProfileEnd,profile,profileEnd,table,time,timeEnd,timeStamp,trace,warn".split(",");
    a = void 0;
    _results = [];
    while (a = d.pop()) {
      _results.push(b[a] = b[a] || c);
    }
    return _results;
  })((function() {
    try {
      console.log();
      return window.console;
    } catch (err) {
      return window.console = {};
    }
  })());

  window.Sequence.Utils.Namespace = function(ns_string) {
    var i, parent, parts;
    parts = ns_string.split(".");
    parent = window.App;
    i = void 0;
    if (parts[0] === "window.App") parts = parts.slice(1);
    i = 0;
    while (i < parts.length) {
      if (typeof parent[parts[i]] === "undefined") parent[parts[i]] = {};
      parent = parent[parts[i]];
      i += 1;
    }
    return parent;
  };

}).call(this);
