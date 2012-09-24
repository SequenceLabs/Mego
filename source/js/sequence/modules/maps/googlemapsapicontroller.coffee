"use strict"
# namespace
gmaps = Namespace('SEQ.gmaps')

class gmaps.GoogleMapsApiController

  constructor: (options) ->

    defaults =
      sensor: true
      onLoad: "window.SEQ.gmaps.MapInstance._onApiLoaded"

    this.settings = $.extend true, defaults, options
    this._init()

  #
  # Private Methods
  # _____________________________________________________________________________________

  _init: =>
    this._loadMapsAPI()

  # TODO: make sure this doesn't fire twice if more than one map on page
  _loadMapsAPI: () =>
    # if API already loaded
    if google? and google.maps?
      console.log "maps API already loaded"
      return this._onApiLoaded()

    #global static reference to this instance
    gmaps.MapInstance = this
    #create script tag
    script = document.createElement("script")
    script.type = "text/javascript"
    script.src = "http://maps.googleapis.com/maps/api/js?&sensor=#{this.settings.sensor}&callback=#{this.settings.onLoad}"
    if this.settings.key?
      script.src += "&key=#{this.settings.key}"
    #load it by adding to DOM
    document.body.appendChild(script)
  _onApiLoaded: =>
    if this.settings.callback?
      this.settings.callback.call()

  #
  # Public Methods
  # _____________________________________________________________________________________