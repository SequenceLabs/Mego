"use strict"
# namespace
gmaps = SEQ.utils.namespace('SEQ.gmaps')

# Abstracts Google Maps. Will fail if maps API is not already loaded.
class gmaps.GoogleMap
  
  constructor: (@options) -> 
    # map element
    @mapEl = {}
    # google.maps.Map 
    @map = {}
    # google.maps.Geocoder
    @geocoder = {}
    
    @init()
    @createMap()
    
  init: =>
    @mapEl = @options.mapEl
    
    # if specific size in options, use that
    if @options.size?
      @mapEl.style.width = @options.size.width
      @mapEl.style.height = @options.size.height
    # otherwise, use client sizes  
    else
      @options.size =
        width: @mapEl.clientWidth
        height: @mapEl.clientHeight
  
  createMap: =>
    # create map object
    if @options.center?
      @options.center = new google.maps.LatLng(@options.center[0], @options.center[1])
    
    @map = new google.maps.Map(@mapEl, @options)
    @mapEl.style.width = @options.size.width + "px"
    @mapEl.style.height = @options.size.height + "px"
    
  centerOnCurrentPosition: =>
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(@hasGeoLocation, @noGeoLocation)
    else
      @noGeoLocation()
  
  centerOnAddress: (address) =>
    console.log address
    @geocoder = new google.maps.Geocoder()
    @geocoder.geocode
      'address': address
    , @onGeocodeComplete
  
  onGeocodeComplete: (results, status) =>
    if status is google.maps.GeocoderStatus.OK
      @map.setCenter(results[0].geometry.location)
      @addMarker(results[0].geometry.location)
    else
      console.log("gecode failed: #{status}")
       
  hasGeoLocation: (position)=>
    pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
    @map.setCenter(pos)
  
  noGeoLocation: (error) =>
    alert("no geolocation")
    
  addMarker: (pos) =>
    marker = new google.maps.Marker
      map: @map
      position: pos
      
    @markers.push(marker)