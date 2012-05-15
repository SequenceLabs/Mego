"use strict"
# namespace
maps = Namespace('SEQ.gmaps')


class maps.MapLocationsController extends maps.GoogleMap
  
  constructor: (@options) -> 
    @INFO_BOX_CLASS = "infoBox"
   
    super(@options)
        
  init: =>
    super()
    @loadInfoBoxJs @addMarkers
  
  loadInfoBoxJs: (callback) =>
    script = document.createElement("script")
    script.async = true
    script.type = "text/javascript"
    script.src = "/js/thirdparty/infobox_packed.js"
    #load it by adding to DOM
    script.onload = callback
    
    document.body.appendChild(script)
    
  addMarkers: =>
    
    @markers = []
    for location, i in @options.locations                           
      $location = $(location)
      latLng = $location.attr("data-latLng")
      latLngSplit = latLng.split(",")   
           
      @markers.push(@addMarker(new google.maps.LatLng(latLngSplit[0], latLngSplit[1]), i))
      
    @fitMarkerBounds()
             
  addMarker: (pos, i) =>
    marker = new google.maps.Marker
      position: pos
      map: @gmap
      flat: false
      visible: true
      zIndex: i
      clickable: true
      id: "location-#{i}"
      animation: google.maps.Animation.DROP
    marker.locationDOMElement = @getInfoBoxContentFromDOM(marker)

    google.maps.event.addListener(marker, 'click', @onMarkerClick)
    marker.infoBox = @addInfoBox(marker)
    
    return marker
    
  addInfoBox: (marker) =>
    boxText = document.createElement("div")
    boxText.innerHTML = marker.locationDOMElement.html()

    opts =
      boxClass: @INFO_BOX_CLASS
      content: boxText
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
      
    infoBox = new InfoBox(opts)

    return infoBox

  getLocationFromMarker: (marker) =>
    # fixed decimal point to normalise both sets of LatLng
    DECIMAL_POINT = 3
    # get lat and lng of marker
    markerLat = marker.getPosition().lat().toFixed(DECIMAL_POINT)
    markerLng = marker.getPosition().lng().toFixed(DECIMAL_POINT)
    # store as String
    markerLatLngStr = "#{markerLat}, #{markerLng}"
    # iterate over location DOM elements, retrieving their latLng
    for location in @options.locations
      locationLatLng = $(location).attr("data-latLng")
      locationLat = parseFloat(locationLatLng.split(",")[0]).toFixed(DECIMAL_POINT)
      locationLng = parseFloat(locationLatLng.split(",")[1]).toFixed(DECIMAL_POINT)
      #store as String
      locationLatLngStr = "#{locationLat}, #{locationLng}"
      if markerLatLngStr is locationLatLngStr
        return location

  getInfoBoxContentFromDOM: (marker) =>
    $location = $(@getLocationFromMarker(marker))
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

  onInfoboxLinkClick: (location) =>
    $("html,body").animate
      scrollTop: $(location).offset().top - 10
    , 500
    
  
  onMarkerClick: (e) =>
    marker = @findMarkerFromLatLng(e.latLng)

    if @currInfoBox?
      @currInfoBox.close()

    @currInfoBox = marker.infoBox
    @currInfoBox.open(@gmap, marker)

    $(@currInfoBox.getContent()).find(".more").on("click", (e) => 
      @onInfoboxLinkClick(@getLocationFromMarker(marker))
    )

  findMarkerFromLatLng:(latLng) =>
    for marker in @markers
      if marker.position.lat() is latLng.lat() and marker.position.lng() is latLng.lng()
        return marker