"use strict"
# namespace
gmaps = Namespace('SEQ.gmaps')

# Abstracts Google Maps. Will fail if maps API is not already loaded.
class gmaps.GoogleMap
  
  constructor: (options) ->

    defaults =
      mapTypeId: google.maps.MapTypeId.ROADMAP      
      mapTypeIds: []
      panControl: false
      zoomControl: false
      mapTypeControl: false
      scaleControl: false
      streetViewControl: false
      overviewMapControl: false
      zoom: 12
      markerOpts: 
        animation: google.maps.Animation.DROP
    
    # map element
    this.gmapEl = {}
    # google.maps.Map 
    this.gmap = {}
    # google.maps.Geocoder
    this.geocoder = {}
    # array of markers
    this.markers = []
    # merge options
    this.settings = $.extend true, defaults, options
    
    this._init()
    this._createMap()
   
  # 
  # Private Methods
  # _____________________________________________________________________________________

  _init: =>
    this.gmapEl = this.settings.mapEl
    
    # if specific size in options, use that
    if this.settings.size?
      this.gmapEl.style.width = this.settings.size.width
      this.gmapEl.style.height = this.settings.size.height
    # otherwise, use client sizes  
    else
      this.settings.size =
        width: this.gmapEl.clientWidth
        height: this.gmapEl.clientHeight
  
  _createMap: =>
    # create map object
    this.gmap = new google.maps.Map(this.gmapEl, this.settings)
    this.gmapEl.style.width = this.settings.size.width + "px"
    this.gmapEl.style.height = this.settings.size.height + "px"
    
  _onGeocodeComplete: (results, status) =>
    if status is google.maps.GeocoderStatus.OK
      this.gmap.setCenter(results[0].geometry.location)
      this.addMarker(results[0].geometry.location)
    else
      console.log("gecode failed: #{status}")
       
  _hasGeoLocation: (position) =>
    pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
    this.gmap.setCenter(pos)
  
  _noGeoLocation: (error) =>
    alert("no geolocation")
  
  # 
  # Public Methods
  # _____________________________________________________________________________________

  # adds a marker at the given pos (a google.maps.LatLng object)

  addMarker: (pos, options) =>
    opts = if options? then options else this.settings.markerOpts

    opts.map = this.gmap
    opts.position = pos

    marker = new google.maps.Marker opts
      
    this.markers.push(marker)

    return marker

  centerOnCurrentPosition: =>
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(this._hasGeoLocation, this._noGeoLocation)
    else
      this.noGeoLocation()
  
  centerOnAddress: (hcard) =>
    street = hcard.find(".street-hcard").html()
    locality = hcard.find(".locality").html()
    postcode = hcard.find(".postal-code").html()
    this.geocoder = new google.maps.Geocoder()
    this.geocoder.geocode
      'address': "#{street}, #{locality}, #{postcode}"
    , this._onGeocodeComplete
  
  fitMarkerBounds: =>
    latLngBounds = new google.maps.LatLngBounds()
    
    for marker, i in this.markers
      latLngBounds.extend(marker.getPosition())
      this.gmap.setCenter(marker.getPosition()) if i is 0
    
    this.gmap.fitBounds(latLngBounds)