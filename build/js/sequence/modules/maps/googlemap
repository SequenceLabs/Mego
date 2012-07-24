(function() {
  "use strict";
  var gmaps,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  gmaps = Namespace('SEQ.gmaps');

  gmaps.GoogleMap = (function() {

    function GoogleMap(options) {
      this.options = options;
      this.addMarker = __bind(this.addMarker, this);
      this.noGeoLocation = __bind(this.noGeoLocation, this);
      this.hasGeoLocation = __bind(this.hasGeoLocation, this);
      this.onGeocodeComplete = __bind(this.onGeocodeComplete, this);
      this.fitMarkerBounds = __bind(this.fitMarkerBounds, this);
      this.centerOnAddress = __bind(this.centerOnAddress, this);
      this.centerOnCurrentPosition = __bind(this.centerOnCurrentPosition, this);
      this.createMap = __bind(this.createMap, this);
      this.init = __bind(this.init, this);
      this.gmapEl = {};
      this.gmap = {};
      this.geocoder = {};
      this.markers = [];
      this.init();
      this.createMap();
    }

    GoogleMap.prototype.init = function() {
      this.gmapEl = this.options.mapEl;
      if (this.options.size != null) {
        this.gmapEl.style.width = this.options.size.width;
        return this.gmapEl.style.height = this.options.size.height;
      } else {
        return this.options.size = {
          width: this.gmapEl.clientWidth,
          height: this.gmapEl.clientHeight
        };
      }
    };

    GoogleMap.prototype.createMap = function() {
      this.gmap = new google.maps.Map(this.gmapEl, this.options);
      this.gmapEl.style.width = this.options.size.width + "px";
      return this.gmapEl.style.height = this.options.size.height + "px";
    };

    GoogleMap.prototype.centerOnCurrentPosition = function() {
      if (navigator.geolocation) {
        return navigator.geolocation.getCurrentPosition(this.hasGeoLocation, this.noGeoLocation);
      } else {
        return this.noGeoLocation();
      }
    };

    GoogleMap.prototype.centerOnAddress = function(address) {
      var locality, postcode, street;
      street = address.find(".street-address").html();
      locality = address.find(".locality").html();
      postcode = address.find(".postal-code").html();
      this.geocoder = new google.maps.Geocoder();
      return this.geocoder.geocode({
        'address': "" + street + ", " + locality + ", " + postcode
      }, this.onGeocodeComplete);
    };

    GoogleMap.prototype.fitMarkerBounds = function() {
      var i, latLngBounds, marker, _len, _ref;
      latLngBounds = new google.maps.LatLngBounds();
      _ref = this.markers;
      for (i = 0, _len = _ref.length; i < _len; i++) {
        marker = _ref[i];
        latLngBounds.extend(marker.getPosition());
        if (i === 0) this.gmap.setCenter(marker.getPosition());
      }
      return this.gmap.fitBounds(latLngBounds);
    };

    GoogleMap.prototype.onGeocodeComplete = function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        this.gmap.setCenter(results[0].geometry.location);
        return this.addMarker(results[0].geometry.location);
      } else {
        return console.log("gecode failed: " + status);
      }
    };

    GoogleMap.prototype.hasGeoLocation = function(position) {
      var pos;
      pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      return this.gmap.setCenter(pos);
    };

    GoogleMap.prototype.noGeoLocation = function(error) {
      return alert("no geolocation");
    };

    GoogleMap.prototype.addMarker = function(pos, i) {
      var marker;
      marker = new google.maps.Marker({
        map: this.gmap,
        position: pos,
        animation: google.maps.Animation.DROP
      });
      this.markers.push(marker);
      return marker;
    };

    return GoogleMap;

  })();

}).call(this);
