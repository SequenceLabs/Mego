(function() {
  "use strict";
  if (typeof SEQ === "undefined" || SEQ === null) SEQ = {};

  if (SEQ.utils == null) SEQ.utils = {};

  SEQ.utils.namespace = function(ns_string) {
    var i, parent, parts;
    parts = ns_string.split(".");
    parent = SEQ;
    i = void 0;
    if (parts[0] === "SEQ") parts = parts.slice(1);
    i = 0;
    while (i < parts.length) {
      if (typeof parent[parts[i]] === "undefined") parent[parts[i]] = {};
      parent = parent[parts[i]];
      i += 1;
    }
    return parent;
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

}).call(this);
