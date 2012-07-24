(function() {
  "use strict";
  var maps,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  maps = Namespace('SEQ.gmaps');

  maps.MapLocationsController = (function(_super) {

    __extends(MapLocationsController, _super);

    function MapLocationsController(options) {
      this.options = options;
      this.findMarkerFromLatLng = __bind(this.findMarkerFromLatLng, this);
      this.onMarkerClick = __bind(this.onMarkerClick, this);
      this.onInfoboxLinkClick = __bind(this.onInfoboxLinkClick, this);
      this.getInfoBoxContentFromDOM = __bind(this.getInfoBoxContentFromDOM, this);
      this.getLocationFromMarker = __bind(this.getLocationFromMarker, this);
      this.addInfoBox = __bind(this.addInfoBox, this);
      this.addMarker = __bind(this.addMarker, this);
      this.addMarkers = __bind(this.addMarkers, this);
      this.loadInfoBoxJs = __bind(this.loadInfoBoxJs, this);
      this.init = __bind(this.init, this);
      this.INFO_BOX_CLASS = "infoBox";
      MapLocationsController.__super__.constructor.call(this, this.options);
    }

    MapLocationsController.prototype.init = function() {
      MapLocationsController.__super__.init.call(this);
      return this.loadInfoBoxJs(this.addMarkers);
    };

    MapLocationsController.prototype.loadInfoBoxJs = function(callback) {
      var script;
      script = document.createElement("script");
      script.async = true;
      script.type = "text/javascript";
      script.src = "/js/thirdparty/infobox_packed.js";
      script.onload = callback;
      return document.body.appendChild(script);
    };

    MapLocationsController.prototype.addMarkers = function() {
      var $location, i, latLng, latLngSplit, location, _len, _ref;
      this.markers = [];
      _ref = this.options.locations;
      for (i = 0, _len = _ref.length; i < _len; i++) {
        location = _ref[i];
        $location = $(location);
        latLng = $location.attr("data-latLng");
        latLngSplit = latLng.split(",");
        this.markers.push(this.addMarker(new google.maps.LatLng(latLngSplit[0], latLngSplit[1]), i));
      }
      return this.fitMarkerBounds();
    };

    MapLocationsController.prototype.addMarker = function(pos, i) {
      var marker;
      marker = new google.maps.Marker({
        position: pos,
        map: this.gmap,
        flat: false,
        visible: true,
        zIndex: i,
        clickable: true,
        id: "location-" + i,
        animation: google.maps.Animation.DROP
      });
      marker.locationDOMElement = this.getInfoBoxContentFromDOM(marker);
      google.maps.event.addListener(marker, 'click', this.onMarkerClick);
      marker.infoBox = this.addInfoBox(marker);
      return marker;
    };

    MapLocationsController.prototype.addInfoBox = function(marker) {
      var boxText, infoBox, opts;
      boxText = document.createElement("div");
      boxText.innerHTML = marker.locationDOMElement.html();
      opts = {
        boxClass: this.INFO_BOX_CLASS,
        content: boxText,
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
      };
      infoBox = new InfoBox(opts);
      return infoBox;
    };

    MapLocationsController.prototype.getLocationFromMarker = function(marker) {
      var DECIMAL_POINT, location, locationLat, locationLatLng, locationLatLngStr, locationLng, markerLat, markerLatLngStr, markerLng, _i, _len, _ref;
      DECIMAL_POINT = 3;
      markerLat = marker.getPosition().lat().toFixed(DECIMAL_POINT);
      markerLng = marker.getPosition().lng().toFixed(DECIMAL_POINT);
      markerLatLngStr = "" + markerLat + ", " + markerLng;
      _ref = this.options.locations;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        location = _ref[_i];
        locationLatLng = $(location).attr("data-latLng");
        locationLat = parseFloat(locationLatLng.split(",")[0]).toFixed(DECIMAL_POINT);
        locationLng = parseFloat(locationLatLng.split(",")[1]).toFixed(DECIMAL_POINT);
        locationLatLngStr = "" + locationLat + ", " + locationLng;
        if (markerLatLngStr === locationLatLngStr) return location;
      }
    };

    MapLocationsController.prototype.getInfoBoxContentFromDOM = function(marker) {
      var $button, $content, $link, $location;
      $location = $(this.getLocationFromMarker(marker));
      $content = $("<div />").addClass("infobox-content");
      $content.append($location.find("h3").clone()).append($location.find(".info").clone());
      $button = $location.find(".button");
      $link = $("<a />").addClass("more").attr("href", $button.attr("href")).html($button.html());
      $content.append($link);
      return $content;
    };

    MapLocationsController.prototype.onInfoboxLinkClick = function(location) {
      return $("html,body").animate({
        scrollTop: $(location).offset().top - 10
      }, 500);
    };

    MapLocationsController.prototype.onMarkerClick = function(e) {
      var marker,
        _this = this;
      marker = this.findMarkerFromLatLng(e.latLng);
      if (this.currInfoBox != null) this.currInfoBox.close();
      this.currInfoBox = marker.infoBox;
      this.currInfoBox.open(this.gmap, marker);
      return $(this.currInfoBox.getContent()).find(".more").on("click", function(e) {
        return _this.onInfoboxLinkClick(_this.getLocationFromMarker(marker));
      });
    };

    MapLocationsController.prototype.findMarkerFromLatLng = function(latLng) {
      var marker, _i, _len, _ref;
      _ref = this.markers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        marker = _ref[_i];
        if (marker.position.lat() === latLng.lat() && marker.position.lng() === latLng.lng()) {
          return marker;
        }
      }
    };

    return MapLocationsController;

  })(maps.GoogleMap);

}).call(this);
