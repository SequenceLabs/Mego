# TRANSITION
# ==========

# Transition is CSS3 Transition engine with jQuery fallback. 

"use strict"  

effects = SEQ.utils.namespace "effects"

# list of transitionEnd event names
transitionEndNames =
  WebkitTransition: 'webkitTransitionEnd'
  MozTransition: 'transitionend'
  OTransition: 'oTransitionEnd'
  msTransition: 'msTransitionEnd'
  transition: 'transitionEnd'

# utility function for getting vendor-prefixed property     
getProp = (prop) ->  
  for prefix in ["", "Webkit", "Moz", "O", "ms", "Khtml"] 
    p = "#{prefix}#{prop}"
    return p if document.body.style[p]?

class effects.Transition 
  @To: (options) =>
    # apply delay, if present
    t = setTimeout =>
      # if browser supports CSS3 Transitions
      if getProp("Transition")?
        # start the magic
        new effects.CSSTransition(options)
      else
        # rock it old-skool
        @jqAnimate(options)
      clearTimeout(t)      
    , options.delay or 0   
  
  @jqAnimate: (options) =>
    # if jQuery object
    if options.target instanceof jQuery
      # use that
      target = options.target
    else
      # create one
      target = $(options.target)
    # pass user options unti jQuery animation API
    target.animate(
      options.props
    , 
      duration: options.duration
      complete: (e) =>
        if options.complete?
          options.complete.call(@)
    )
    
class effects.CSSTransition
  constructor:(@options) ->
    @transitionEndStr = transitionEndNames[getProp('Transition')]
    @numTransitions = 0
    @numTransitionsComplete = 0
    elements = []
    
    # if jQuery object
    if @options.target instanceof jQuery       
      for element, i in @options.target
        elements.push(@options.target.get(i))           
    # if an Array    
    else if @options.target.constructor is Array
      elements = @options.target
    # otherwise target was a HTMLElement in the first place  
    else
      elements = [@options.target]
    
    @transition(elements)
  
  transition: (elements) =>
    for element in elements
      # iterate over each CSS property and apply to HTMLElement
      for prop, value of @options.props
        @numTransitions++
        if @options.duration > 0
          element.addEventListener(@transitionEndStr, @onTransitionEnd, false)
        else
          @onTransitionEnd(target: element)
        
        new effects.TransitionDelegate(element, prop, value, @options.duration)
    
  onTransitionEnd: (e) =>
    e.target.removeEventListener(@transitionEndStr, @onTransitionEnd, false)
    @numTransitionsComplete++
    if @numTransitionsComplete is @numTransitions      
      if @options.complete?
        @options.complete.call(@)

class effects.TransitionDelegate       
  constructor: (@element, @property, @value, @duration) ->    
    # if duration, add "transitionEnd" listener
    if @duration > 0
      @element.addEventListener(transitionEndNames[getProp('Transition')], @onTransitionEnd, false)
        
    # add the transition CSS properties
    @addTransitionStyles()
    @addStyles()
    # no duration so fire callback immediately
    if @duration is 0
      @onTransitionEnd()
  
  addStyles: =>
    # if height or width and transitioning to "auto" size
    if (@property is "height" or "width") and @value is "auto"         
      size = @getClientAutoSize(@element)
      # set to actual height/width - "auto" will be added back again once transition is complete
      @element.style[@property] = "#{if @property is "height" then size.height else size.width}px"
      
    # if we're animating from "auto" width to any other value
    else if (@property is "height" or "width") and @element.style[@property] is "auto"      
      # ditch the transition styling temporarily to prevent unwanted animation
      @removeTransitionStyles()
      # set the element to it's actual width/height
      @element.style[@property] = "#{if @property is "height" then @element.clientHeight else @element.clientWidth}px" 
      # wait 15ms for DOM to update
      setTimeout =>
        # add the transition style back
        @addTransitionStyles()
        # set new value
        @element.style[@property] = "#{@value}px"
      , 50
    else
      @element.style[@property] = "#{@value+@pxMap(@property)}"
  
  getClientAutoSize: (element) =>
    clone = element.cloneNode(true)
    body = document.querySelector("body")
    body.appendChild(clone)
    clone.style.width = "auto"
    clone.style.height = "auto"
    clone.style.visibility = "hidden"
    clone.style.display = "block"
    size =
      width: clone.clientWidth
      height: clone.clientHeight
    body.removeChild(clone)
    return size
     
  onTransitionEnd: (e) =>
    # if there was an event, remove the listener
    if e?
      e.target.removeEventListener(e.type, @onTransitionEnd, false)
    # remove 
    @removeTransitionStyles()  
    # reset to "auto" if needed
    
    if @value is "auto"
      if @property is "height" or "width"
        @element.style[@property] = "auto"

  addTransitionStyles: =>
    @element.style["#{getProp('TransitionProperty')}"] = "all"  
    @element.style["#{getProp('TransitionDuration')}"] = "#{@duration / 1000}s"
    @element.style["#{getProp('TransitionTimingFunction')}"] = "ease-in-out"
  
  removeTransitionStyles: =>
    @element.style["#{getProp('TransitionProperty')}"] = ""
    @element.style["#{getProp('TransitionDuration')}"] = ""
    @element.style["#{getProp('TransitionTimingFunction')}"] = ""
  
  # utility function, returns "px" if obj in array
  pxMap: (obj) ->
    suffix = ""
    for prop in ["left", "right", "top", "bottom", "width", "height"]
      if obj is prop then suffix = "px"
    return suffix

                                     