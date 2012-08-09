#    
# Thumbslider
# ============

"use strict" 

# namespace
modules = Namespace('SEQ.modules')

class modules.ThumbSlider extends modules.CoffeeSlider
  
  constructor:(@options) -> 
    super(@options)

    window.t = @
      
  init: () =>
    super()
    @element.on "click", @onClick

  setCurrentSlide: (index, skipTransition) =>
    # don't bother
    if index is @getCurrentIndex() then return false
    # if current exists, remove class
    if @current?
      @current.removeClass("active")
    # set current to incoming slide index 
    @current = $(@slides[index])
    @current.addClass("active")

    # some DOM shenanigans happens here necessitating this hack
    # maybe fix this properly one day
    if skipTransition
      delay = 10
    else
      delay = 0

    setTimeout => 
      @goToIndex Math.floor(index / @settings.step), skipTransition
    , delay

  snapToNearestSlide: ->
    fraction = 1 / @settings.step
    @goToIndex @currentIndex + Math.round((@distanceMoved.x / @slideWidth) / @settings.step / fraction) * fraction

  getCurrentIndex: () =>
    if @current? then return @current.index() else return null
    
  onClick: (e) =>
    # prevent accidental clicking when dragging
    if @distanceMoved.x or @distanceMoved.y > 50 then return

    target = $ e.target
    e.preventDefault()
    if target.hasClass("slide")
      @setCurrentSlide target.index()
      @element.trigger("change")

  applySizes: =>
    super()
    
    @element.css
      width: @outer.width() * @settings.step