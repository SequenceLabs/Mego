(function() {
  "use strict";

  var gmaps,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  gmaps = Namespace('SEQ.gmaps');

  gmaps.GoogleMapsApiController = (function() {

    function GoogleMapsApiController(options) {
      this._onApiLoaded = __bind(this._onApiLoaded, this);

      this._loadMapsAPI = __bind(this._loadMapsAPI, this);

      this._init = __bind(this._init, this);

      var defaults;
      defaults = {
        sensor: true,
        onLoad: "window.SEQ.gmaps.MapInstance._onApiLoaded"
      };
      this.settings = $.extend(true, defaults, options);
      this._init();
    }

    GoogleMapsApiController.prototype._init = function() {
      return this._loadMapsAPI();
    };

    GoogleMapsApiController.prototype._loadMapsAPI = function() {
      var script;
      if ((typeof google !== "undefined" && google !== null) && (google.maps != null)) {
        console.log("maps API already loaded");
        return this._onApiLoaded();
      }
      gmaps.MapInstance = this;
      script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "http://maps.googleapis.com/maps/api/js?&sensor=" + this.settings.sensor + "&callback=" + this.settings.onLoad;
      if (this.settings.key != null) {
        script.src += "&key=" + this.settings.key;
      }
      return document.body.appendChild(script);
    };

    GoogleMapsApiController.prototype._onApiLoaded = function() {
      if (this.settings.callback != null) {
        return this.settings.callback.call();
      }
    };

    return GoogleMapsApiController;

  })();

}).call(this);
