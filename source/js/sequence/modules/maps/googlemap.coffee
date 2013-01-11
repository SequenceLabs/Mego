"use strict"
# namespace
gmaps = Namespace('SEQ.gmaps')

# Abstracts Google Maps. Will fail if maps API is not already loaded.
class gmaps.GoogleMap

  constructor: (@options) ->
    # map element
    @mapEl = {}
    # google.maps.Map
    @map = {}
    # google.maps.Geocoder
    @geocoder = {}
    # array of markers
    @markers = []

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
    @map = new google.maps.Map(@mapEl, @options)
    @mapEl.style.width = @options.size.width + "px"
    @mapEl.style.height = @options.size.height + "px"

  centerOnCurrentPosition: =>
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(@hasGeoLocation, @noGeoLocation)
    else
      @noGeoLocation()

  addAddressMarker: (address, callback) =>
    street = address.find(".street-address").html()
    locality = address.find(".locality").html()
    postcode = address.find(".postal-code").html()
    @geocoder = new google.maps.Geocoder()

    @geocoder.geocode
      'address': "#{street}, #{locality}, #{postcode}"
    , (results, status) =>
      marker = @onAddressGeocodeComplete(results, status)
      callback(marker) if callback?

  onAddressGeocodeComplete: (results, status) =>
    if status is google.maps.GeocoderStatus.OK
      return @addMarker(results[0].geometry.location)
    else
      console.log("gecode failed: #{status}")
      return null

  centerOnMarker: (marker) =>
    @map.setCenter(marker.getPosition())

  fitMarkerBounds: =>
    latLngBounds = new google.maps.LatLngBounds()

    for marker, i in @markers
      latLngBounds.extend(marker.getPosition())
      @map.setCenter(marker.getPosition()) if i is 0
    @map.setCenter(latLngBounds.getCenter())
    @map.fitBounds(latLngBounds)

  hasGeoLocation: (position) =>
    pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
    @map.setCenter(pos)

  noGeoLocation: (error) =>
    alert("no geolocation")

  addMarker: (latLng, opts) =>
    opts = opts || {}
    opts.map = @map
    opts.position = latLng
    opts.animation = opts.animation || google.maps.Animation.DROP

    marker = new google.maps.Marker(opts)
    @markers.push(marker)
    return marker
