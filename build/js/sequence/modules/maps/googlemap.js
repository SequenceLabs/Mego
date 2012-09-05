(function() {
  "use strict";

  var gmaps,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  gmaps = Namespace('SEQ.gmaps');

  gmaps.GoogleMap = (function() {

    function GoogleMap(options) {
      this.fitMarkerBounds = __bind(this.fitMarkerBounds, this);

      this.centerOnAddress = __bind(this.centerOnAddress, this);

      this.centerOnCurrentPosition = __bind(this.centerOnCurrentPosition, this);

      this.addMarker = __bind(this.addMarker, this);

      this._noGeoLocation = __bind(this._noGeoLocation, this);

      this._hasGeoLocation = __bind(this._hasGeoLocation, this);

      this._onGeocodeComplete = __bind(this._onGeocodeComplete, this);

      this._createMap = __bind(this._createMap, this);

      this._init = __bind(this._init, this);

      var defaults;
      defaults = {
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeIds: [],
        panControl: false,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        overviewMapControl: false,
        zoom: 12,
        markerOpts: {
          animation: google.maps.Animation.DROP
        }
      };
      this.gmapEl = {};
      this.gmap = {};
      this.geocoder = {};
      this.markers = [];
      this.settings = $.extend(true, defaults, options);
      this._init();
      this._createMap();
    }

    GoogleMap.prototype._init = function() {
      this.gmapEl = this.settings.mapEl;
      if (this.settings.size != null) {
        this.gmapEl.style.width = this.settings.size.width;
        return this.gmapEl.style.height = this.settings.size.height;
      } else {
        return this.settings.size = {
          width: this.gmapEl.clientWidth,
          height: this.gmapEl.clientHeight
        };
      }
    };

    GoogleMap.prototype._createMap = function() {
      this.gmap = new google.maps.Map(this.gmapEl, this.settings);
      this.gmapEl.style.width = this.settings.size.width + "px";
      return this.gmapEl.style.height = this.settings.size.height + "px";
    };

    GoogleMap.prototype._onGeocodeComplete = function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        this.gmap.setCenter(results[0].geometry.location);
        return this.addMarker(results[0].geometry.location);
      } else {
        return console.log("gecode failed: " + status);
      }
    };

    GoogleMap.prototype._hasGeoLocation = function(position) {
      var pos;
      pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      return this.gmap.setCenter(pos);
    };

    GoogleMap.prototype._noGeoLocation = function(error) {
      return alert("no geolocation");
    };

    GoogleMap.prototype.addMarker = function(pos, options) {
      var marker, opts;
      opts = options != null ? options : this.settings.markerOpts;
      opts.map = this.gmap;
      opts.position = pos;
      marker = new google.maps.Marker(opts);
      this.markers.push(marker);
      return marker;
    };

    GoogleMap.prototype.centerOnCurrentPosition = function() {
      if (navigator.geolocation) {
        return navigator.geolocation.getCurrentPosition(this._hasGeoLocation, this._noGeoLocation);
      } else {
        return this.noGeoLocation();
      }
    };

    GoogleMap.prototype.centerOnAddress = function(hcard) {
      var locality, postcode, street;
      street = hcard.find(".street-hcard").html();
      locality = hcard.find(".locality").html();
      postcode = hcard.find(".postal-code").html();
      this.geocoder = new google.maps.Geocoder();
      return this.geocoder.geocode({
        'address': "" + street + ", " + locality + ", " + postcode
      }, this._onGeocodeComplete);
    };

    GoogleMap.prototype.fitMarkerBounds = function() {
      var i, latLngBounds, marker, _i, _len, _ref;
      latLngBounds = new google.maps.LatLngBounds();
      _ref = this.markers;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        marker = _ref[i];
        latLngBounds.extend(marker.getPosition());
        if (i === 0) {
          this.gmap.setCenter(marker.getPosition());
        }
      }
      return this.gmap.fitBounds(latLngBounds);
    };

    return GoogleMap;

  })();

}).call(this);
