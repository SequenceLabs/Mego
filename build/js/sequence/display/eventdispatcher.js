(function() {
  "use strict";
  var EventDispatcher,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  EventDispatcher = (function() {

    function EventDispatcher() {
      this.dispatchEvent = __bind(this.dispatchEvent, this);
      this.removeEventListener = __bind(this.removeEventListener, this);
      this.addEventListener = __bind(this.addEventListener, this);      this.eventHashTable = {};
    }

    EventDispatcher.prototype.addEventListener = function(eventType, func) {
      if (this.eventHashTable[eventType] === undefined) {
        this.eventHashTable[eventType] = [];
      }
      if (this.eventHashTable[eventType].indexOf(func) === -1) {
        return this.eventHashTable[eventType].push(func);
      }
    };

    EventDispatcher.prototype.removeEventListener = function(eventType, func) {
      if (this.eventHashTable[eventType] === undefined) return false;
      if (this.eventHashTable[eventType].indexOf(func) > -1) {
        this.eventHashTable[eventType].splice(this.eventHashTable[eventType].indexOf(func), 1);
      }
      return true;
    };

    EventDispatcher.prototype.dispatchEvent = function(eventObject) {
      var a, i, _results;
      a = this.eventHashTable[eventObject.eventType];
      if (a === undefined || a.constructor !== Array) return false;
      i = 0;
      _results = [];
      while (i < a.length) {
        a[i](eventObject);
        _results.push(i++);
      }
      return _results;
    };

    Array.prototype.indexOf = function(value) {
      var i;
      i = 0;
      while (i < this.length) {
        if (this[i] === value) return i;
        i++;
      }
      return -1;
    };

    return EventDispatcher;

  })();

}).call(this);
