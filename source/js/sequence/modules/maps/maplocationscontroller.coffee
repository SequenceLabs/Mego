"use strict"
# namespace
gmaps = Namespace('SEQ.gmaps')

class gmaps.MapLocationsController

  constructor: (options) ->
    # default options

    defaults =
      infoBoxJsUrl: "/js/thirdparty/infobox_packed.js"
      mapOpts:
        mapTypeId: google.maps.MapTypeId.ROADMAP
        zoom: 12
        mapEl: document.querySelector('#map')
      markerOpts:
        animation: google.maps.Animation.DROP
        flat: false
        visible: true
        clickable: true
        iconFolder: "/images/icons/markers/"
      infoBoxOpts:
        boxClass: "info-box"
        disableAutoPan: false
        maxWidth: 0
        pixelOffset: new google.maps.Size(-155, 10)
        zIndex: null
        infoBoxClearance: new google.maps.Size(100, 100)
        isHidden: false
        pane: "floatPane"
        enableEventPropagation: false
        closeBoxMargin: "2px"
        closeBoxURL: "http://#{window.location.host}/images/icons/close-btn.png"
        linksToLocationPage: false

    this.settings = $.extend true, defaults, options
    this._init()

  #
  # Private Methods
  # _____________________________________________________________________________________

  _init: =>
    this._createMap()

    if this.settings.infoBoxJsUrl != false
      this._loadInfoBoxJs this._addMarkers
    else
      this._addMarkers()

  _createMap: () =>
    this.map = new gmaps.GoogleMap this.settings.mapOpts

  _loadInfoBoxJs: (callback) =>
    script = document.createElement("script")
    script.async = true
    script.type = "text/javascript"
    script.src = this.settings.infoBoxJsUrl
    #load it by adding to DOM
    script.onreadystatechange = callback
    script.onload = callback
    document.body.appendChild(script)

  _addInfoBox: (marker) =>
    boxText = document.createElement("div")
    boxText.innerHTML = marker.locationDOMElement.html()

    opts = this.settings.infoBoxOpts
    opts.content = boxText
    infoBox = new InfoBox(opts)

    return infoBox

  _getLocationFromMarker: (marker) =>
    # fixed decimal point to normalise both sets of LatLng
    DECIMAL_POINT = 3
    # get lat and lng of marker
    markerLat = marker.getPosition().lat().toFixed(DECIMAL_POINT)
    markerLng = marker.getPosition().lng().toFixed(DECIMAL_POINT)
    # store as String
    markerLatLngStr = "#{markerLat}, #{markerLng}"
    # iterate over location DOM elements, retrieving their latLng
    for location in this.settings.DOMlocations
      locationLatLng = $(location).attr("data-latLng")
      locationLat = parseFloat(locationLatLng.split(",")[0]).toFixed(DECIMAL_POINT)
      locationLng = parseFloat(locationLatLng.split(",")[1]).toFixed(DECIMAL_POINT)
      #store as String
      locationLatLngStr = "#{locationLat}, #{locationLng}"
      if markerLatLngStr is locationLatLngStr
        return location

  _getInfoBoxContentFromDOM: (marker) =>
    $location = $(this._getLocationFromMarker(marker))
    $content = $("<div />").addClass("infobox-content")

    # location title
    $content
      .append($location.find("h3").clone())
      .append($location.find(".info").clone())

    $button = $location.find(".button")
    $link = $("<a />")
      .addClass("more")
      .attr("href", $button.attr("href"))
      .html($button.html())

    $content.append($link)

    return $content

  _onInfoboxLinkClick: (location) =>
    $("html,body").animate
      scrollTop: $(location).offset().top - 10
    , 500

  _onMarkerClick: (e) =>
    marker = this._findMarkerFromLatLng(e.latLng)

    if this.currInfoBox?
      this.currInfoBox.close()

    this.currInfoBox = marker.infoBox
    this.currInfoBox.open(this.map.map, marker)

    $(this.currInfoBox.getContent()).find(".more").on("click", (e) =>
      unless this.settings.infoBoxOpts.linksToLocationPage
        this._onInfoboxLinkClick(this._getLocationFromMarker(marker))
        return false
    )

  _findMarkerFromLatLng:(latLng) =>
    for marker in this.map.markers
      if marker.position.lat() is latLng.lat() and marker.position.lng() is latLng.lng()
        return marker

  _addMarkers: =>
    for location in this.settings.DOMlocations
      $location = $(location)
      latLng = $location.attr("data-latLng")
      latLngSplit = latLng.split(",")
      icon = $location.attr("data-markericon")
      marker = this.addMarker(new google.maps.LatLng(latLngSplit[0], latLngSplit[1]), icon)

    this.map.fitMarkerBounds()

  #
  # Public Methods
  # _____________________________________________________________________________________

  addMarker: (pos, icon) =>
    # cache this reference
    opts = this.settings.markerOpts
    if icon?
      opts.icon = opts.iconFolder + icon + ".png"
    #create marker
    marker = this.map.addMarker pos, opts
    marker.locationDOMElement = this._getInfoBoxContentFromDOM(marker)
    marker.infoBox = this._addInfoBox(marker)

    google.maps.event.addListener(marker, 'click', this._onMarkerClick)

    return marker
