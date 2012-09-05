(function() {
  "use strict";

  var maps,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  maps = Namespace('SEQ.gmaps');

  maps.MapLocationsController = (function() {

    function MapLocationsController(options) {
      this.addMarker = __bind(this.addMarker, this);

      this._addMarkers = __bind(this._addMarkers, this);

      this._findMarkerFromLatLng = __bind(this._findMarkerFromLatLng, this);

      this._onMarkerClick = __bind(this._onMarkerClick, this);

      this._onInfoboxLinkClick = __bind(this._onInfoboxLinkClick, this);

      this._getInfoBoxContentFromDOM = __bind(this._getInfoBoxContentFromDOM, this);

      this._getLocationFromMarker = __bind(this._getLocationFromMarker, this);

      this._addInfoBox = __bind(this._addInfoBox, this);

      this._loadInfoBoxJs = __bind(this._loadInfoBoxJs, this);

      this._createMap = __bind(this._createMap, this);

      this._init = __bind(this._init, this);

      var defaults;
      defaults = {
        infoBoxJsUrl: "/js/thirdparty/infobox_packed.js",
        mapOpts: {
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          zoom: 12,
          mapEl: document.querySelector('#map')
        },
        markerOpts: {
          animation: google.maps.Animation.DROP,
          flat: false,
          visible: true,
          clickable: true
        },
        infoBoxOpts: {
          boxClass: "info-box",
          disableAutoPan: false,
          maxWidth: 0,
          pixelOffset: new google.maps.Size(-155, 10),
          zIndex: null,
          infoBoxClearance: new google.maps.Size(100, 100),
          isHidden: false,
          pane: "floatPane",
          enableEventPropagation: false,
          closeBoxMargin: "2px",
          closeBoxURL: "http://" + window.location.host + "/images/icons/close-btn.png"
        }
      };
      this.settings = $.extend(true, defaults, options);
      this._init();
    }

    MapLocationsController.prototype._init = function() {
      this._createMap();
      if (this.settings.infoBoxJsUrl !== false) {
        return this._loadInfoBoxJs(this._addMarkers);
      } else {
        return this._addMarkers();
      }
    };

    MapLocationsController.prototype._createMap = function() {
      return this.map = new maps.GoogleMap(this.settings.mapOpts);
    };

    MapLocationsController.prototype._loadInfoBoxJs = function(callback) {
      var script;
      script = document.createElement("script");
      script.async = true;
      script.type = "text/javascript";
      script.src = this.settings.infoBoxJsUrl;
      script.onreadystatechange = callback;
      script.onload = callback;
      return document.body.appendChild(script);
    };

    MapLocationsController.prototype._addInfoBox = function(marker) {
      var boxText, infoBox, opts;
      boxText = document.createElement("div");
      boxText.innerHTML = marker.locationDOMElement.html();
      opts = this.settings.infoBoxOpts;
      opts.content = boxText;
      infoBox = new InfoBox(opts);
      return infoBox;
    };

    MapLocationsController.prototype._getLocationFromMarker = function(marker) {
      var DECIMAL_POINT, location, locationLat, locationLatLng, locationLatLngStr, locationLng, markerLat, markerLatLngStr, markerLng, _i, _len, _ref;
      DECIMAL_POINT = 3;
      markerLat = marker.getPosition().lat().toFixed(DECIMAL_POINT);
      markerLng = marker.getPosition().lng().toFixed(DECIMAL_POINT);
      markerLatLngStr = "" + markerLat + ", " + markerLng;
      _ref = this.settings.DOMlocations;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        location = _ref[_i];
        locationLatLng = $(location).attr("data-latLng");
        locationLat = parseFloat(locationLatLng.split(",")[0]).toFixed(DECIMAL_POINT);
        locationLng = parseFloat(locationLatLng.split(",")[1]).toFixed(DECIMAL_POINT);
        locationLatLngStr = "" + locationLat + ", " + locationLng;
        if (markerLatLngStr === locationLatLngStr) {
          return location;
        }
      }
    };

    MapLocationsController.prototype._getInfoBoxContentFromDOM = function(marker) {
      var $button, $content, $link, $location;
      $location = $(this._getLocationFromMarker(marker));
      $content = $("<div />").addClass("infobox-content");
      $content.append($location.find("h3").clone()).append($location.find(".info").clone());
      $button = $location.find(".button");
      $link = $("<a />").addClass("more").attr("href", $button.attr("href")).html($button.html());
      $content.append($link);
      return $content;
    };

    MapLocationsController.prototype._onInfoboxLinkClick = function(location) {
      return $("html,body").animate({
        scrollTop: $(location).offset().top - 10
      }, 500);
    };

    MapLocationsController.prototype._onMarkerClick = function(e) {
      var marker,
        _this = this;
      marker = this._findMarkerFromLatLng(e.latLng);
      if (this.currInfoBox != null) {
        this.currInfoBox.close();
      }
      this.currInfoBox = marker.infoBox;
      this.currInfoBox.open(this.map.gmap, marker);
      return $(this.currInfoBox.getContent()).find(".more").on("click", function(e) {
        return _this._onInfoboxLinkClick(_this._getLocationFromMarker(marker));
      });
    };

    MapLocationsController.prototype._findMarkerFromLatLng = function(latLng) {
      var marker, _i, _len, _ref;
      _ref = this.map.markers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        marker = _ref[_i];
        if (marker.position.lat() === latLng.lat() && marker.position.lng() === latLng.lng()) {
          return marker;
        }
      }
    };

    MapLocationsController.prototype._addMarkers = function() {
      var $location, i, latLng, latLngSplit, location, marker, _i, _len, _ref;
      _ref = this.settings.DOMlocations;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        location = _ref[i];
        $location = $(location);
        latLng = $location.attr("data-latLng");
        latLngSplit = latLng.split(",");
        marker = this.addMarker(new google.maps.LatLng(latLngSplit[0], latLngSplit[1]), i);
      }
      return this.map.fitMarkerBounds();
    };

    MapLocationsController.prototype.addMarker = function(pos, i) {
      var marker, opts;
      opts = this.settings.markerOpts;
      if (i != null) {
        opts.zIndex = i;
      }
      marker = this.map.addMarker(pos, opts);
      marker.locationDOMElement = this._getInfoBoxContentFromDOM(marker);
      marker.infoBox = this._addInfoBox(marker);
      google.maps.event.addListener(marker, 'click', this._onMarkerClick);
      return marker;
    };

    return MapLocationsController;

  })();

}).call(this);
