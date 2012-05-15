"use strict"
# namespace
gmaps = Namespace('SEQ.gmaps')

# Abstracts Google Maps. Will fail if maps API is not already loaded.
class gmaps.GoogleMap
  
  constructor: (@options) -> 
    # map element
    @gmapEl = {}
    # google.maps.Map 
    @gmap = {}
    # google.maps.Geocoder
    @geocoder = {}
    # array of markers
    @markers = []
    
    @init()
    @createMap()
    
  init: =>
    @gmapEl = @options.mapEl
    
    # if specific size in options, use that
    if @options.size?
      @gmapEl.style.width = @options.size.width
      @gmapEl.style.height = @options.size.height
    # otherwise, use client sizes  
    else
      @options.size =
        width: @gmapEl.clientWidth
        height: @gmapEl.clientHeight
  
  createMap: =>
    # create map object

    @gmap = new google.maps.Map(@gmapEl, @options)
    @gmapEl.style.width = @options.size.width + "px"
    @gmapEl.style.height = @options.size.height + "px"
    
  centerOnCurrentPosition: =>
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(@hasGeoLocation, @noGeoLocation)
    else
      @noGeoLocation()
  
  centerOnAddress: (address) =>
    street = address.find(".street-address").html()
    locality = address.find(".locality").html()
    postcode = address.find(".postal-code").html()
    @geocoder = new google.maps.Geocoder()
    @geocoder.geocode
      'address': "#{street}, #{locality}, #{postcode}"
    , @onGeocodeComplete
  
  fitMarkerBounds: =>
  
    latLngBounds = new google.maps.LatLngBounds()
    
    for marker, i in @markers
      latLngBounds.extend(marker.getPosition())
      @gmap.setCenter(marker.getPosition()) if i is 0
    
    @gmap.fitBounds(latLngBounds)
  
  onGeocodeComplete: (results, status) =>
    if status is google.maps.GeocoderStatus.OK
      @gmap.setCenter(results[0].geometry.location)
      @addMarker(results[0].geometry.location)
    else
      console.log("gecode failed: #{status}")
       
  hasGeoLocation: (position) =>
    pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
    @gmap.setCenter(pos)
  
  noGeoLocation: (error) =>
    alert("no geolocation")
    
  addMarker: (pos, i) =>
    marker = new google.maps.Marker
      map: @gmap
      position: pos
      animation: google.maps.Animation.DROP
    @markers.push(marker)
    return marker