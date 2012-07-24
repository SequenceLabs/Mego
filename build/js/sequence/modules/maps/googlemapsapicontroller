(function() {
  "use strict";
  var gmaps,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  gmaps = Namespace('SEQ.gmaps');

  gmaps.GoogleMapsApiController = (function() {

    function GoogleMapsApiController(options) {
      this.options = options;
      this.onApiLoaded = __bind(this.onApiLoaded, this);
      this.loadMapsAPI = __bind(this.loadMapsAPI, this);
      this.init = __bind(this.init, this);
      this.init();
    }

    GoogleMapsApiController.prototype.init = function() {
      return this.loadMapsAPI();
    };

    GoogleMapsApiController.prototype.loadMapsAPI = function() {
      var script;
      if ((typeof google !== "undefined" && google !== null) && (google.maps != null)) {
        console.log("maps API already loaded");
        return this.onApiLoaded();
      }
      gmaps.MapInstance = this;
      script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "http://maps.googleapis.com/maps/api/js?&sensor=" + this.options.sensor + "&callback=window.SEQ.gmaps.MapInstance.onApiLoaded";
      return document.body.appendChild(script);
    };

    GoogleMapsApiController.prototype.onApiLoaded = function() {
      if (this.options.callback != null) return this.options.callback.call();
    };

    return GoogleMapsApiController;

  })();

}).call(this);
