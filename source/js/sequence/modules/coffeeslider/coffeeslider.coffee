#    
# Coffeeslider
# ============

"use strict" 

# namespace
modules = SEQ.utils.namespace('SEQ.modules')
transition = SEQ.effects.Transition


# the main Class
SEQ modules.CoffeeSlider = class CoffeeSlider      
  # Constructor. Creates a CoffeeSlider instance.

  constructor: (@options) ->
    # Intial settings
    # --------------
    @settings =
      # type of animation - "slide", "fade" or "slideFade"
      transitionType: "slide" 
      # slideshow?
      slideshow: true 
      # the direction of transitions
      transitionDirection: "horizontal" 
      # duration between transitions in slideshow mode
      transitionDelay: 2000 
      # duration of transition
      transitionSpeed: 1000 
      # whether to use dot navigation
      hasDotNav: true
      # has prev/next navigation
      hasPrevNext: true 
      # has pagination (eg. 01/05)
      hasPagination: false
      # which style of touch interaction to use, "gesture", "inverseGesture", "drag" or "none"
      touchStyle: "drag"                    
      # "infinite" - slides loop infinitely
      # "return" - loops around to start/end
      # "none" - does nothing when it reaches the start/end
      loop: "infinite"                      
      # preloads the images
      preload: true                   
      # these are the selectors used
      selectors:
        # Coffeeslider uses this selector to define a slide. For example, if your 'slides' are a list, you would enter 'li' here.   
        slide:    ".slide"
        # The outer wrapper.
        outer:    ".outer"
        # The inner wrapper.
        inner:    ".inner"      
        # The 'previous slide' button.
        prev:     ".prev"
        # The 'next slide' button.
        next:     ".next"
        # Generic button class.
        btn:      ".btn"
        # defaults to $carousel.
        uiParent: ""             
        # Same as the uiParent but for the pagination indicators. Defaults to uiParent.
        paginationContainer: ""
        # The class to be used for 'dot' style navigation.
        dotNav: ".dot-nav"
        # The class for pagination indicators. (eg. 01/05)  
        pagination: ".pagination"
        # The class added to the current page indicator (eg. 01/05)    
        paginationCurrent: ".currentPage"
        # The class added to the page total.
        paginationTotal: ".total"
        
      callbacks:
        # Called after the slider is initialised. 
        onStart: ->
        # Called each time the slide transition starts.    
        onTransition: ->
        # Called each time the slide transition completed.
        onTransitionComplete: ->
    
    # Main container element - A jQuery object containing the slides.
    @container = {}
    # outer container
    @outer = {}
    # inner container
    @inner = {}
    # parent for ui elements
    @uiParent = {}
    # previous button
    @prevBtn = {}
    # next buttin
    @nextBtn = {}
    # array of slides
    @slides = {}
    # width of slide
    @slideWidth = 0
    # internal states
    @currentIndex = 1000
    # number of slides
    @numSlides = 0
    # the current slide
    @currentSlide = {}
    # is currently moving
    @isMoving = false;
    # pagination
    @pagination = {}
    # dot nav
    @dotNav = {}
  
    @init()
  
  # initialises the class
  init: () =>
    @container = @options.container
    @container
      .addClass("coffee-slider")
      .css
        opacity: 1
    
    @applySettings()
    @bindToDOM()
    @initUI()
    # init slides and pass in callback for image preloading
    @initSlides =>      
      @applyStyles()            
      @bindUIEvents()
      @settings.callbacks.onStart()
      @goTo(0, true)
   

  # Merges user-defined options with defaults.
  applySettings:() ->
    
    # merge settings defaults
    $.extend true, @settings, @options
  
  # Binds internal properties to DOM elements.
  bindToDOM: ->   
    # bind DOM references
    @slides = @find("slide")
    @numSlides = @slides.length
    @slides.addClass("slide")

    # if inner/outer don't exist, create them
    if (@inner = @find("inner")).length is 0
      @slides.wrapAll($("<div />").addClass(@getSelector("inner")))
      @inner = @find("inner")
  
    if (@outer = @find("outer")).length is 0
      @inner.wrap $("<div />").addClass(@getSelector("outer"))
      @outer = @find("outer")
  
  # Binds internal properties to DOM elements.
  initSlides: (callback) =>
    # add cloned slides for infine scrolling unless fade  
    if @settings.loop is "infinite" and @settings.transitionType isnt "fade"
      @appendClonedSlides()

    if @settings.preload
      @preload(callback)
    else
      callback()

  # Preloads the images. 
  preload: (callback) =>
    @outer.css
      opacity: 0
    @images = @container.find("img")
    @numImages = @images.length
    @checkImagesLoaded(callback)
  

  # Loops through each image and checks if loaded. If ready, calls the callback to continue.
  checkImagesLoaded: (callback) =>
    imgsLoaded = 0

    for img in @images 
      if img.complete
        imgsLoaded++ 
        
    if imgsLoaded is @numImages
      callback()
      transition.To
        target: @outer
        duration: 300
        props:
          opacity: 1
    else
      setTimeout =>
        @checkImagesLoaded(callback)
      , 100
      
  # Appends cloned slides to either side for purposes of creating illusion of infinite scrolling.
  appendClonedSlides: ->     
    float = (if @settings.transitionDirection is "horizontal" then "left" else "none")
    
    # append 1st slide to end
    @inner.append @slides 
      .eq(0)
      .clone()
      .addClass('clone')
      .css
        float: float
    # append last slide to start
    @inner.prepend @slides
      .eq(@numSlides-1)
      .clone()
      .addClass('clone')
      .css
        float: float 
        
    @slides = @find("slide")
    @numSlides = @slides.length
  
  # Applies some basic CSS.
  applyStyles: (callback) =>
    @inner.css 
      position: "relative"
      overflow: "hidden"
    @outer.css
      overflow: "hidden"
    # get width of single slide      
    @slideWidth = @slides.eq(0).outerWidth(true)
    @slideHeight = @slides.eq(0).outerHeight(true)
    @totalWidth = @slideWidth * @numSlides
    @totalHeight = @slideHeight * @numSlides
       
    if @settings.transitionType is "slide" or @settings.transitionType is "slideFade"
      if @settings.transitionDirection is "horizontal"
        # if using 'slide' option
        @slides.css
          float: "left"
          overflow: "hidden"
        # recalculate width
        @slideWidth = @slides.eq(0).outerWidth(true)
        @totalWidth = @slideWidth * @numSlides  
        # set width of inner to accomodate slides
        @inner.css
          width: @totalWidth
          height: @totalHeight
        # set width of outer wrapper
        @outer.css
          width: @slideWidth
          height: @slideHeight
      else if @settings.transitionDirection is "vertical"
        # set width of inner to accomodate slides
        @inner.css
          height: @totalHeight
          width: @slideWidth
        @outer.css
          height: @slideHeight
          width: @slideWidth
    else if @settings.transitionType is "fade"
      @slides.css
        position: "absolute"
        left: "0"
        opacity: "0"
      @inner.css
        width: @slideWidth 
        height: @slideHeight
      @outer.css
        height: @slideHeight
        width: @slideWidth

  # Initialises UI components.
  initUI: ->
    @uiParent = @getContainer "uiParent", @container
    
    # create next/prev buttons
    if @settings.hasPrevNext
      @prevBtn = $("<div />")
        .addClass("#{@getSelector("prev")}")
        .addClass("#{@getSelector("btn")}")
        .html("next")
      @nextBtn = $("<div />")
        .addClass("#{@getSelector("next")}") 
        .addClass("#{@getSelector("btn")}")        
        .html("prev") 
      @uiParent.append(@prevBtn)
      @uiParent.append(@nextBtn)
    
    # create dot navigation
    if @settings.hasDotNav
      @dotNav = $("<nav />").addClass(@getSelector("dotNav"))
      @uiParent.append(@dotNav)
      @dotNav.append($("<ol />"))
      # loop through slides
      for slide, i in @slides
        @dotNav.find("ol").append("<li>#{i}</li>")
    
    #  create pagination
    if @settings.hasPagination   
      @pagination = new modules.Pagination(
        @getContainer("paginationContainer", @uiParent), 
        @getSelector("pagination"), 
        @getSelector("paginationCurrent"),
        @getSelector("paginationTotal"),
        @numSlides
      ) 
      
  # Removes UI components.
  @private
  removeUI: ->
    @nextBtn.remove()
    @prevBtn.remove()
  
  # Binds event-handling to user controls.       
  bindUIEvents: =>
    if @settings.hasPrevNext
    # next / back click events
      @nextBtn.bind "click", (e) =>
        e.preventDefault()
        @next()
      @prevBtn.bind "click", (e) =>
        e.preventDefault()
        @prev()
    
    # # pagination click events 
    if @settings.hasDotNav
      @dotNav.bind "click", (e) =>
        e.preventDefault()
        @goTo $(e.target).index(), false

    #touch events
    @inner.bind "touchstart", @onTouchStart if @settings.touchStyle isnt "none"

  # Initialises the slideshow, if needed.
  initSlideshow: =>    
    clearTimeout(@timer)
    @timer = setTimeout(@onSlideshowTick, @settings.transitionDelay)
    
  onSlideshowTick: () =>
    @next()
        
  # Called when a touch start event fires.
  onTouchStart: (e) =>
    @innerLeft = parseInt(@inner.css("left"))
    @innerTop = parseInt(@inner.css("top"))
    @startX = endX = e.originalEvent.touches[0].pageX
    @startY = endY = e.originalEvent.touches[0].pageY        
    @distanceMovedX = 0
    @distanceMovedY = 0
        
    @inner.bind("touchend", @onTouchEndOrCancel)
    @inner.bind("touchcancel", @onTouchEndOrCancel)
    @inner.bind("touchmove", @onTouchMove)
    
    if @settings.slideshow
      clearTimeout(@timer)
  

  # Called when a touch event finishes.
  onTouchEndOrCancel: ( ) =>
    @inner.unbind("touchend", @onTouchEndOrCancel)
    @inner.unbind("touchcancel", @onTouchEndOrCancel)
    @inner.unbind("touchmove", @onTouchMove)
    
    if @settings.transitionDirection is "horizontal"    
      if @distanceMovedX > 50
        if @settings.transitionType is "fade" or @settings.touchStyle is "inverseGesture"
          @prev()
        else
          @next()
      else if @distanceMovedX < -50
        if @settings.transitionType is "fade" or @settings.touchStyle is "inverseGesture"
          @next()
        else
          @prev()
      else
        @goTo @currentIndex
    else if @settings.transitionDirection is "vertical"    
      if @distanceMovedY > 50
        if @settings.transitionType is "fade" or @settings.touchStyle is "inverseGesture"
          @prev()
        else
          @next()
      else if @distanceMovedY < -50
        if @settings.transitionType is "fade" or @settings.touchStyle is "inverseGesture"
          @next()
        else
          @prev()
      else
        @goTo @currentIndex
                           
  # Called when a touch move event fires.     
  onTouchMove: (e) =>
    @endX = e.originalEvent.touches[0].pageX  
    @endY = e.originalEvent.touches[0].pageY
    
    @distanceMovedX = @startX - @endX
    @distanceMovedY = @startY - @endY
                                 
    if @settings.transitionDirection is "horizontal"
      if Math.abs(@distanceMovedX) > 15
        e.preventDefault()     
      else if Math.abs(@distanceMovedY) > 15
        @inner.unbind "touchmove", @onTouchMove
    
    else if @settings.transitionDirection is "vertical"
      if Math.abs(@distanceMovedY) > 10
        e.preventDefault()     
      else if Math.abs(@distanceMovedX) > 10
        @inner.unbind "touchmove", @onTouchMove
    
    if @settings.touchStyle is "drag"     
      if @settings.transitionDirection is "horizontal"
        dragPosX = @innerLeft - (@startX - @endX) 
        if @settings.loop isnt "infinite" and (dragPosX >= 10  or dragPosX <= 0 - (@totalWidth - @slideWidth - 10))
          @inner.unbind "touchmove", @onTouchMove
          @distanceMovedX = 0
        else
          @inner.css
            left: dragPosX           
      else if @settings.transitionDirection is "vertical"
        dragPosY = @innerTop - (@startY - @endY) 
        if @settings.loop isnt "infinite" and dragPosY >= 10
          @inner.unbind "touchmove", @onTouchMove
          @distanceMovedY = 0
        else  
          @inner.css
            top: dragPosY

  # Goes to a specific slide (as indicated).
  goTo: (index, skipTransition) =>
    # dont proceed if still moving or attempt to goto the current frame
    # return false if @isMoving or @currentIndex is index  
    @settings.callbacks.onTransition()

    if !skipTransition
      @isMoving = true    
     
    if @settings.transitionType is "slide"
      @slideTo(index, skipTransition)
    else if @settings.transitionType is "fade"
      @fadeTo(index, skipTransition)
    else if @settings.transitionType is "slideFade"
      @slideFadeTo(index, skipTransition)
    
    # update dotnav
    if @settings.hasDotNav
      ACTIVE = "active"
      @dotNav.find(".#{ACTIVE}").removeClass(ACTIVE)
      @dotNav.find("li").eq(index).addClass(ACTIVE)
    
    # update pagination 
    if @settings.hasPagination    
      if @currentIndex < 0
        @pagination.setPage @numSlides - 2 
      else if @currentIndex > (@numSlides - 3)
        @pagination.setPage 1
      else
        @pagination.setPage @currentIndex + 1
        
    if @settings.slideshow
      @initSlideshow()
    
  # Uses the 'slide' animation to move to a slide.
  slideTo: (index, skipTransition) =>
    # record the current index
    @currentIndex = index
    # offset to compensate for extra slide if in infinite mode
    offset = (if @settings.loop is "infinite" then 1 else 0)       
    
    if @settings.transitionDirection is "horizontal"
      position = left: 0 - (index + offset) * @slideWidth
    else if @settings.transitionDirection is "vertical"
      position = top: 0 - (index + offset) * @slideHeight
 
    transition.To
      target: @inner
      props: position    
      duration: if skipTransition then 0 else @settings.transitionSpeed / 2
      complete: @onTransitionComplete

  # fades to the index
  fadeTo: (index, skipTransition) =>
    # fade out the current slide, if it exists
    if @slides[@currentIndex]?
      transition.To
        target: @slides[@currentIndex]
        props:
          opacity: 0
        duration: if skipTransition then 0 else @settings.transitionSpeed / 2 
        
    # record the current index
    @currentIndex = index
    
    transition.To
      target: @slides[index]
      props:
        opacity: 1
      duration: @settings.transitionSpeed
      complete: @onTransitionComplete
       
  # Uses the 'slideFade' animation to move to a slide.
  slideFadeTo: (index, skipTransition) =>
    @fadeTo index, skipTransition      
    @slideTo index, skipTransition

  # Goes to the previous page.  
  prev: ->
    prevIndex =  @currentIndex - 1
    if (@settings.transitionType is "fade" or @settings.loop is "return") and prevIndex < 0
      prevIndex = (@numSlides - 1)
    @goTo prevIndex, false
    
  # Goes to the next page. 
  next: ->  
    nextIndex = @currentIndex + 1
    if nextIndex > (@numSlides - 1)
      if (@settings.transitionType is "fade" or @settings.loop is "return") 
        nextIndex = 0
      else if not @settings.loop
        return
        
    @goTo nextIndex, false
        
  # Called whenever a slide transition completes.
  onTransitionComplete: () =>
    @isMoving = false
    if @settings.loop is "infinite" and @settings.transitionType isnt "fade"
      if @currentIndex is -1
        @goTo @numSlides - 3, true
      else if @currentIndex is @numSlides - 2
        @goTo 0, true
      else
        @settings.callbacks.onTransitionComplete()
    else
      @settings.callbacks.onTransitionComplete()
    
  # Utility function. Finds an element in the container for a given selector in the selectors object.
  find: (selectorName) => 
    @container.find @settings.selectors[selectorName]
  
  # Utility function. Gets a container.      
  getContainer: (name, _default) -> 
    if @settings.selectors[name] is "" then _default else @find name

  # Utility function. Gets a container. 
  getSelector: (name) ->
    selector = @settings.selectors[name]
    selector.slice(1, selector.length)

    
class modules.Pagination
  
  paginationCurrent:{}
  paginationTotal:{}
    
  constructor: (paginationContainer, paginationSel, paginationCurrentSel, paginationTotalSel, numSlides) ->
  
    pagination = $("<div />").addClass(paginationSel).append(
      @paginationCurrent = $("<span />").addClass(paginationCurrentSel),
      @paginationTotal = $("<span />").addClass(paginationTotalSel).html("/0#{numSlides}")
    )
    
    i = 1
    
    while i <= numSlides
      @paginationCurrent.append $("<div />").addClass("number").html("0#{i}") 
      i++
    
    paginationContainer.append(pagination)
    
  setPage: (index) ->
      
    SEQ.Tween.To
      target : @paginationCurrent
      props :
        top : "-#{@paginationCurrent.find('.number').outerHeight() * (index-1)}px"
      duration : 500
