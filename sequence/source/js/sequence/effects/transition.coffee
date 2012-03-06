effects = SEQ.utils.namespace "effects"
getProp = SEQ.utils.browser.CSS3Detection.GetProp

class effects.Transition
      
  @To: (options) =>
    # apply delay, if present
    t = setTimeout =>
      # if browser supports CSS3 Transitions
      if getProp("Transition")?
        # start the magic
        new effects.Transition.CSSTransition(options)
      else
        # rock it old-skool
        @jqAnimate(options)
      clearTimeout(t)      
    , options.delay or 0   

  @jqAnimate: (options) =>
    # if jQuery object
    if @options.target instanceof jQuery
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
        options.complete.call(@)
    )

class effects.Transition.CSSTransition
  constructor:(@options) ->

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

    for element in elements
      new effects.Transition.TransitionDelegate(@options, element)

class effects.Transition.TransitionDelegate

  constructor: (@options, @element) ->   
    # list of transitionEnd event names
    @transitionEndNames =
      WebkitTransition: 'webkitTransitionEnd'
      MozTransition: 'transitionend'
      OTransition: 'oTransitionEnd'
      msTransition: 'msTransitionEnd'
      transition: 'transitionEnd'

    # if duration, add "transitionEnd" listener
    if @options.duration > 0
      @element.addEventListener(@transitionEndNames[getProp('Transition')], @onTransitionEnd, false)

    # add the transition CSS properties
    @addTransitionStyles()

    # iterate over each CSS property and apply to HTMLElement
    for prop, value of @options.props   
      # if height or width and transitioning to "auto" size
      if (prop is "height" or "width") and value is "auto"         
        size = @getClientAutoSize(@element)
        # set to actual height/width - "auto" will be added back again once transition is complete
        @element.style[prop] = "#{if prop is "height" then size.height else size.width}px"

      # if we're animating from "auto" width to any other value
      else if (prop is "height" or "width") and @element.style[prop] is "auto"      
        # ditch the transition styling temporarily to prevent unwanted animation
        @removeTransitionStyles()
        # set the element to it's actual width/height
        @element.style[prop] = "#{if prop is "height" then @element.clientHeight else @element.clientWidth}px" 
        # wait 15ms for DOM to update
        setTimeout =>
          # add the transition style back
          @addTransitionStyles()
          # set new value
          @element.style[prop] = "#{value}px"
        , 50
      else
        @element.style[prop] = "#{value+@pxMap(prop)}"

    # no duration so fire callback immediately
    if @options.duration is 0
      @onTransitionEnd()

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
    # if there's a callback, call it
    if @options.complete?
      @options.complete.call(@)
    # reset to "auto" if needed
    for prop, value of @options.props
      if value is "auto"
        if prop is "height" or "width"
          @element.style[prop] = "auto"

  addTransitionStyles: =>
    @element.style["#{getProp('TransitionProperty')}"] = "all"  
    @element.style["#{getProp('TransitionDuration')}"] = "#{@options.duration / 1000}s"
    @element.style["#{getProp('TransitionTimingFunction')}"] = "ease-in-out"

  removeTransitionStyles: =>
    @element.style["#{getProp('TransitionProperty')}"] = ""
    @element.style["#{getProp('TransitionDuration')}"] = ""
    @element.style["#{getProp('TransitionTimingFunction')}"] = ""

  # utility function, returns "px" if obj in array
  pxMap: (obj) ->
    for prop in ["left", "right", "top", "bottom", "width", "height"]
      if obj is prop then return "px" else return ""                                        