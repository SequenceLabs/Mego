"use strict"
# namespace
gmaps = SEQ.utils.namespace('SEQ.gmaps')

# Abstracts Google Maps
class gmaps.GoogleMap
  
  constructor: (@options) -> 
    # initialise map element
    @mapEl = @options.mapEl
    @init()
    @createMap()
    
  init: =>
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
    # TODO: optimise the options earlier on with defaults/merging and just pass @options in
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
  
  hasGeoLocation: (position)=>
    pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
    @map.setCenter(pos)
  
  noGeoLocation: (error) =>
    alert("no geolocation")