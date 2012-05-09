"use strict"
# namespace
gmaps = SEQ.utils.namespace('SEQ.gmaps')

class gmaps.GoogleMapsApiController
  
  constructor: (@options) -> 
    @init()
    
  init: =>
    @loadMapsAPI()
  
  # TODO: make sure this doesn't fire twice if more than one map on page     
  loadMapsAPI: () =>
    # if API already loaded
    if google? and google.maps?
      console.log "maps API already loaded"
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
    if @options.callback?
      @options.callback.call()