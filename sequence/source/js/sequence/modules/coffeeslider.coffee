"use strict" 

modules = SEQ.utils.namespace('SEQ.modules')
transition = SEQ.effects.Transition

###*    
CoffeeSlider is a touch-enabled Coffeescript-based slider module. 
@class CoffeeSlider 
@author Hamish Taplin, Sequence        
###  

class modules.CoffeeSlider      
  ###*  
  Constructor. Creates a CoffeeSlider instance.
  ###
  constructor: (options) ->
    #Intial settings.
    @settings: {}
    #Main container element.
    @container: {}
    @outer: {}
    @inner: {}
    @uiParent: {}
    @prevBtn: {}
    @nextBtn: {}
    @slides: {}
    # width of slide
    @slideWidth: 0
    # total width of all slides
    @totalWidth: 0  
    # internal states
    @currentIndex: 1000
    # number of slides
    @numSlides: 0
    # the current slide
    @currentSlide: {}
    # is currently moving
    @isMoving: false;
    # pagination
    @pagination: {}
    # dot nav
    @dotNav: {}


    # initialise variables
    @container = @options.container
    @container.addClass("coffee-slider")
    @applySettings(options)
    @bindToDOM()
    @initUI()
    @initSlides()
    @bindUIEvents()
    
    @settings.callbacks.onStart()

    @goTo 0, true
  
  ###* 
  Merges user-defined options with defaults.
  @param {Object}  options    User-defined options
  @private
  ### 
  
  applySettings:(options) ->
    # defaults
    @settings =
      transitionType: "slide"      # type of animation - "slide", "fade" or "slideFade"
      slideshow: true             # slideshow?
      transitionDelay: 2000       # duration between transitions
      transitionSpeed: 1000       # duration of transition
      transitionStep: 1           # number of slides to move in "slide" mode
      hasDotNav: true             # whether to use dot navigation
      hasPrevNext: true
      hasPagination: false
      touchEnabled: true
      infinite: true
      preloadImages: true

      selectors:
        slide:    ".slide"
        outer:    ".outer"
        inner:    ".inner"      
        prev:     ".prev"
        next:     ".next"
        uiParent: ""              # defaults to $carousel
        paginationContainer: ""   # defaults to uiParent
        dotNav: ".dot-nav"
        pagination: ".pagination"
        paginationCurrent: ".currentPage"
        paginationTotal: ".total"
        
      callBacks:
        onStart: ->
        onTransition: ->
        onTransitionComplete: ->

    $.extend true, @settings, options
  
  ###*
  Binds internal properties to DOM elements.
  @private
  ###  
    
  bindToDOM: ->   
    # bind DOM references
    
    @slides = @find "slide"
    @numSlides = @slides.length

    # if inner/outer don't exist, create them
    if (@inner = @find "inner").length is 0
      @slides.wrapAll $("<div />").addClass(@getSelector "inner")
      @inner = @find "inner"
  
    if (@outer = @find "outer").length is 0
      @inner.wrap $("<div />").addClass(@getSelector "outer")
      @outer = @find "outer"
  
  ###*
  Binds internal properties to DOM elements.
  @private
  ###
    
  initSlides: ->
    
    if @settings.infinite
      @appendClonedSlides()
      @slides = @find "slide"
      @numSlides = @slides.length
    
    @preload() if @settings.preloadImages    
    @applyStyles()

    if @numSlides < @settings.transitionStep
      @removeUI()
  ###*
  Appends cloned slides to either side for purposes of creating illusion of infinite scrolling.
  @private
  ###   
  appendClonedSlides: ->     
   
    # append 1st slide to end
    @inner.append @slides
      .eq(0)
      .clone()
      .addClass('clone')
      .css
        float: "left"
    # append last slide to start
    @inner.prepend @slides
      .eq(@numSlides-1)
      .clone()
      .addClass('clone')
      .css
        float: "left"
  
  ###*
  Applies some basic CSS.
  @private
  ###
  applyStyles: ->

    allSlides = @find("slide")

    # get width of all slides
    allSlides.each (i, slide) =>
      @totalWidth += $(slide).outerWidth(true)
    # set width of inner to accomodate slides
    @inner.css
      width: @totalWidth
    # set width of single slide
    @slideWidth = allSlides.eq(0).outerWidth(true)
    # set width of outer wrapper
    @outer.css
      width: @slideWidth
      overflow: "hidden"
    
    # if using 'slide' option
    @slides.css
      float: "left"
    @inner.css 
      position: "relative"
      overflow: "hidden"
    @outer.css 'overflow', 'hidden'
  
  ###*
  Preloads images.
  @private
  ###
  preload: ->

    @container.css
      visibility: "visible"

    @inner.fadeOut(0).fadeIn("500")
  
  ###*
  Initialises UI components.
  @private
  ###
  initUI: ->
    @uiParent = @getContainer "uiParent", @container
    
    # create next/prev buttons
    if @settings.hasPrevNext
      @uiParent.append("<div class='#{@getSelector "prev"}'>previous</div>")
      @uiParent.append("<div class='#{@getSelector "next"}'>next</div>")
      
      @nextBtn = @find "next"
      @prevBtn = @find "prev"
    
    # create dot navigation
    if @settings.hasDotNav
      @dotNav = $("<nav />").addClass(@getSelector "dotNav")
      @uiParent.append @dotNav
      @dotNav.append $("<ol />")
      # loop through slides
      for slide, i in @slides
        @dotNav.find("ol").append "<li>#{i}</li>"
    
    #  create pagination
    if @settings.hasPagination   
      @pagination = new modules.Pagination(
        @getContainer("paginationContainer", @uiParent), 
        @getSelector("pagination"), 
        @getSelector("paginationCurrent"),
        @getSelector("paginationTotal"),
        @numSlides
      ) 
      
  ###*
  Removes UI components.
  @private
  ###  
  removeUI: ->
    @nextBtn.remove()
    @prevBtn.remove()
  
  ###*
  Binds event-handling to user controls.
  @private
  ###          
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
    @inner.bind "touchstart", @onTouchStart if @settings.touchEnabled
    
  # ------------------------------ #
  #   TOUCH EVENTS                 #
  # ------------------------------ #
  
  
  ###*
  Called when a touch start event fires.
  @private  
  @param {Object} e the event object.
  ###
  onTouchStart: (e) =>
    @innerLeft = parseInt(@inner.css("left"))
    @startX = endX = e.originalEvent.touches[0].pageX
    @startY = endY = e.originalEvent.touches[0].pageY        
    @distanceMovedX = 0
    @distanceMovedY = 0
        
    @inner.bind("touchend", @onTouchEndOrCancel)
    @inner.bind("touchcancel", @onTouchEndOrCancel)
    @inner.bind("touchmove", @onTouchMove)
  
  ###*
  Called when a touch event finishes.
  @private
  @param {Object} e the event object.
  ###  
  onTouchEndOrCancel: (e) =>
    @inner.unbind("touchend", @onTouchEndOrCancel)
    @inner.unbind("touchcancel", @onTouchEndOrCancel)
    @inner.unbind("touchmove", @onTouchMove)
    
    if @distanceMovedX > 50
      @next()
    else if @distanceMovedX < -50
      @prev()
    else
      @goTo @currentIndex
  
  ###*
  Called when a touch move event fires.
  @private 
  @param {Object} e the event object.
  ###      
  onTouchMove: (e) =>
    @endX = e.originalEvent.touches[0].pageX  
    @endY = e.originalEvent.touches[0].pageY
    
    @distanceMovedX = @startX - @endX
    @distanceMovedY = @startY - @endY  
        
    if @distanceMovedX > 15
      e.preventDefault()     
    
    else if @distanceMovedY > 15
      @inner.unbind "touchmove", @onTouchMove
           
    @inner.css
      left: @innerLeft - (@startX - @endX)
  
  # ------------------------------ #
  #   SLIDE NAVIGATION             #
  # ------------------------------ #
  
  
  ###*
  Goes to a specific slide (as indicate d).
  @public
  @param {Object} index The index (in the Array this.slides) of the slide to go to.
  @param {Boolean} [skipTransition] If 'true', goes directly to slide without animation.
  ###
  goTo: (index, skipTransition) =>
    # dont proceed if still moving or attempt to goto the current frame
    return false if @isMoving or @currentIndex is index
    
    @settings.callbacks.onTransition()

    if !skipTransition
      @isMoving = true    
     
    if @settings.transitionType is "slide"
      @slideTo(index, skipTransition)           
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
  
  ###*
  Uses the 'slide' animation to move to a slide.
  @private
  @param {Object} index The index (in the Array this.slides) of the slide to go to.
  @param {Boolean} [skipTransition] If 'true', goes directly to slide without animation.
  ### 
  slideTo: (index, skipTransition) =>
    # record the current index
    @currentIndex = index
    # offset to compensate for extra slide if in infiite mode
    offset = (if @settings.infinite then 1 else 0)       
    
    transition.To
      target: @inner
      props:
        left: 0 - (index + offset) * @slideWidth
      duration: if skipTransition then 0 else @settings.transitionSpeed
      complete: @onTransitionComplete

  ###*
  Uses the 'slideFade' animation to move to a slide.
  @private
  @param {Object} index The index (in the Array this.slides) of the slide to go to.
  @param {Boolean} [skipTransition] If 'true', goes directly to slide without animation.
  ###
  slideFadeTo: (index, skipTransition) =>
    # if theres a currentIndex
    if @slides[@currentIndex]?
      transition.To
        target: @slides[@currentIndex]
        props:
          opacity: 0
          
        duration: @settings.transitionSpeed  
    
    transition.To
      target: @slides[index]
      props:
        opacity: 1
      duration: @settings.transitionSpeed
          
    @slideTo index, skipTransition

  ###*
  Goes to the previous page.
  @public
  ###   
  prev: ->
    @goTo @currentIndex - 1, false
  ###*
  Goes to the next page.
  @public
  ###    
  next: ->
    @goTo @currentIndex + 1, false
  ###*
  Called whenever a slide transition completes.
  @public
  ###  
  onTransitionComplete: () =>
    @isMoving = false
    
    if @settings.infinite
      if @currentIndex is -1
        @goTo @numSlides - 3, true
      else if @currentIndex is @numSlides - 2
        @goTo 0, true
      else
        @settings.callbacks.onTransitionComplete()
    else
      @settings.callbacks.onTransitionComplete()
    
  # ------------------------------ #
  #   UTILITY FUNCTIONS            #
  # ------------------------------ #
  
  ###*
  Utility function. Finds an element in the container for a given selector in the selectors object.
  @private
  @param {String} selectorName The selectors name. 
  ###
  find: (selectorName) => 
    @container.find @settings.selectors[selectorName]
  
  ###*
  Utility function. Gets a container.
  @private
  @param {String} name The selectors name.
  @param {String} _default The default container to revert to.
  ###        
  getContainer: (name, _default) -> 
    if @settings.selectors[name] is "" then _default else @find name
  ###*
  Utility function. Gets a container.
  @private
  @param {String} name The selectors name.
  ###    
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
