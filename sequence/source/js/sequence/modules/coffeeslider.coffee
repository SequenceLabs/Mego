modules = SEQ.utils.namespace('SEQ.modules')
animate = SEQ.effects.Animate
  



class modules.CoffeeSlider
  
  constructor: (container, options) ->
    # initial settings
    @settings = {} 
    # main element
    @container = container
    # outer slide holder - defines viewport of slides
    @outer = {}
    # inner slide holder
    @inner = {}
    # UI
    @uiParent = {}
    # previous button
    @prevBtn = {}
    # next button
    @nextBtn = {}
    # collection of slides
    @slides = {}
    # width of slide
    @slideWidth = 0
    # total width of all slides
    @totalWidth = 0  
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
    # initialise variables

    @container.addClass("coffee-slider")
    @applySettings(options)
    @bindToDOM()
    @initUI()
    @initSlides()
    @bindUIEvents()

    @goTo 0, true
  
  ###*
  @param {Object}  options    User-defined options
  ### 
  
  applySettings:(options) ->
    # merge defaults with options
    @settings =
      animationType: "slide"      # type of animation - "slide", "fade" or "slideFade"
      slideshow: true             # slideshow?
      transitionDelay: 2000       # duration between transitions
      transitionSpeed: 1000       # duration of transition
      transitionStep: 1           # number of slides to move in "slide" mode
      hasDotNav: true             # dot navigation
      hasPrevNext: true           # prev next buttons
      hasPagination: true         # pagination
      touchEnabled: true          # touch interactions
      infinite: true              # infinite loop       

      selectors:
        slide:    ".slide"        # a slide
        outer:    ".outer"        # outer container
        inner:    ".inner"        # inner container
        prev:     ".prev"         # prev button
        next:     ".next"         # next button
        uiParent: ""              # defaults to $carousel
        paginationContainer: ""   # defaults to uiParent
        dotNav: ".dot-nav"
        pagination: ".pagination"
        paginationCurrent: ".currentPage"
        paginationTotal: ".total"
        
      callBacks:
        onChange: ->
        onChangeComplete: ->

    $.extend true, @settings, options
    
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
    
  initSlides: ->
    
    if @settings.infinite
      @appendClonedSlides()
      @slides = @find "slide"
      @numSlides = @slides.length
  
    @applyStyles()

    if @numSlides < @settings.transitionStep
      @removeUI()
  
  appendClonedSlides: () ->     
   
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

  removeUI: ->

    @nextBtn.remove()
    @prevBtn.remove()
            
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
  
  onTouchStart: (e) =>
    @innerLeft = parseInt(@inner.css "left")
    @startX = e.originalEvent.touches[0].pageX    
    @inner.bind "touchend", @onTouchEnd
    @inner.bind "touchmove", @onTouchMove    
    @drag e.originalEvent
    
  onTouchEnd: (e) =>
    @inner.unbind "touchend", @onTouchEnd
    distance = @startX - @endX
    
    if distance > 50
      @next()
    else if distance < -50
      @prev()
    else
      @goTo @currentIndex
        
  onTouchMove: (e) =>
    @drag e.originalEvent
  
  drag: (e) =>
    @endX = e.touches[0].pageX
    @inner.css
      left: @innerLeft - (@startX - @endX)
  
  # ------------------------------ #
  #   SLIDE NAVIGATION             #
  # ------------------------------ #
  
  goTo: (index, skipAnimation) =>
    # dont proceed if still moving or attempt to goto the current frame
    return false if @isMoving or @currentIndex is index

    if !skipAnimation
      @isMoving = true    
     
    if @settings.animationType is "slide"
      @slideTo(index, skipAnimation)           
    else if @settings.animationType is "slideFade"
      @slideFadeTo(index, skipAnimation)
    
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
  
  slideTo: (index, skipAnimation) =>
    @currentIndex = index
    
    offset = (if @settings.infinite then 1 else 0)       
    
    animate.To
      target: @inner
      props:
        left: 0 - (index + offset) * @slideWidth
      duration: if skipAnimation then 0 else @settings.transitionSpeed
      complete: @onAnimationComplete
  
  slideFadeTo: (index, skipAnimation) =>
    
    if @slides[@currentIndex]?
      animate.To
        target: @slides[@currentIndex]
        props:
          opacity: 0
          
        duration: @settings.transitionSpeed  
    
    animate.To
      target: @slides[index]
      props:
        opacity: 1
      duration: @settings.transitionSpeed
          
    @slideTo index, skipAnimation
    
  prev: ->
    @goTo @currentIndex - 1, false
 
  next: ->
    @goTo @currentIndex + 1, false
    
  onAnimationComplete: () =>
    @isMoving = false
    
    if @settings.infinite
      if @currentIndex is -1
        @goTo @numSlides - 3, true
      else if @currentIndex is @numSlides - 2
        @goTo 0, true
    
  # ------------------------------ #
  #   UTILITY FUNCTIONS            #
  # ------------------------------ #
  
  find: (f) => 
    @container.find @settings.selectors[f]
        
  getContainer: (name, _default) -> 
    if @settings.selectors[name] is "" then _default else @find name
    
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