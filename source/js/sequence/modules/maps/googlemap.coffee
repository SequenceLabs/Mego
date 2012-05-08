"use strict"
# namespace
gmaps = SEQ.utils.namespace('SEQ.gmaps')

class gmaps.GoogleMap
  
  constructor: (@options) -> 
    # initialise map element
    @mapEl = @options.mapEl
    @init()
    
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
        
    @loadMapsAPI()
  
  # TODO: make sure this doesn't fire twice if more than one map on page     
  loadMapsAPI: (@callback) =>
    # if API already loaded
    if google? and google.maps?
      console.log "maps already loaded"
      return @onApiLoaded()
      
    #global reference to this instance
    window.SEQ.gmaps.MapInstance = this
    #create script tag
    script = document.createElement("script")
    script.type = "text/javascript"
    script.src = "http://maps.googleapis.com/maps/api/js?&sensor=#{@options.sensor}&callback=window.SEQ.gmaps.MapInstance.onApiLoaded"
    #load it by adding to DOM
    document.body.appendChild(script)
  
  onApiLoaded: =>
    # create map object
    # TODO: optimise the options earlier on with defaults/merging and just pass @options in
    
    @options.mapTypeId = google.maps.MapTypeId[@options.mapTypeId]
    if @options.center?
      @options.center = new google.maps.LatLng(@options.center[0], @options.center[1])
    
    @map = new google.maps.Map(@mapEl, @options)
    @mapEl.style.width = @options.size.width + "px"
    @mapEl.style.height = @options.size.height + "px"
    
    if @options.onApiLoaded?
      @options.onApiLoaded.call()

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