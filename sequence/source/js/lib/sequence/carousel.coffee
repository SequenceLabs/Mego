window.App ?= {}

# Use local alias
$ = jQuery

class App.Carousel
  # initial settings
  settings: {} 
  # main element
  $carousel: {}
  # outer slide holder - defines viewport of slides
  $outer: {}
  # inner slide holder
  $inner: {}

  # UI
  $uiParent: {}
  $paginationContainer: {}
  $prevBtn: {}
  $nextBtn: {}
  $paginationNav: {}

  # collection of slides
  $slides: {}
  # total width of all slides
  totalWidth: 0  
  # internal states
  currentIndex: 0
  numSlides: 0

  $currentSlide: {}
  
  ###*
  @param {jQuery}  carousel   The main carousel container
  @param {Object}  options    User-defined options
  ###
  constructor: (carousel, options) ->
    # initialise variables
    @$carousel = carousel
    @$carousel.addClass("carousel")
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
    # merge defautls with options
    @settings =
      animationType: "slide"      # type of animation - "slide", "fade" or "slideFade"
      slideshow: true             # slideshow?
      transitionDelay: 2000       # duration between transitions
      transitionSpeed: 1000       # duration of transition
      transitionStep: 1           # number of slides to move in "slide" mode
      hasPaginationNav: true      # whether to use pagination controls
      hasPagination: true
      touchEnabled: true
      infinite: false
      loop: true
      preloadImages: true

      selectors:
        slide:    ".slide"
        outer:    ".outer"
        inner:    ".inner"      
        prev:     ".prev"
        next:     ".next"
        uiParent: ""              # defaults to $carousel
        paginationContainer: ""   # defaults to uiParent
        paginationNav: ".pagination_nav"
        pagination: ".pagination"
        paginationCurrent: ".currentPage"
        paginationTotal: ".total"
        
      callBacks:
        onChange: ->
        onChangeComplete: ->

    $.extend true, @settings, options
    
  bindToDOM: ->   
    # bind DOM references
    @$outer = @$find "outer"
    @$inner = @$find "inner"   
    @$slides = @$find "slide" 

  initSlides: ->
    @numSlides = @$slides.length
    @initInfinite() if @settings.infinite
    @preload() if @settings.preloadImages
    
    # get width of all slides
    for slide in @$slides
      @totalWidth += $(slide).outerWidth(true)
    # set width of inner to accomodate slides 
    @$inner.css "width", @totalWidth
    # if using 'slide' option
    @$slides.css 'float', 'left'
    @$inner.css 'position', "relative"
    # @$outer.css 'overflow', 'hidden'

    if @numSlides < @settings.transitionStep
      @removeUI()
  
  preload: ->
    @$carousel.css("visibility", "visible")
    @$inner.fadeOut(0).fadeIn("500")

  initInfinite: ->
    # append 1st slide to end
    @$inner.append @$slides.eq(0).clone()
    # append last slide to start
    @$inner.prepend @$slides.eq(@numSlides-1).clone()
    
    @$inner.css
      left: "-940px"
    
  initUI: ->
    @$uiParent = @getContainer "uiParent", @$carousel
    @$uiParent.append("<div class='#{@getSelector "prev"}'>previous</div>")
    @$uiParent.append("<div class='#{@getSelector "next"}'>next</div>")
    
    @$nextBtn = @$find "next"
    @$prevBtn = @$find "prev"

    @$paginationContainer = @getContainer "paginationContainer", @$uiParent    
        
    @initPaginationNav() if @settings.hasPaginationNav       
    @initPagination() if @settings.hasPagination
  
  removeUI: ->
    @$nextBtn.remove()
    @$prevBtn.remove()
  
  initPaginationNav: ->        
    @$paginationContainer.append "<ol class='#{@getSelector "paginationNav"}'></ol>"
    @$paginationNav = @$find "paginationNav"

    # loop through slides
    for slide, i in @$slides
      @$paginationNav.append "<li>#{i}</li>"
  
  initPagination: ->
    @$paginationContainer.append "<div class='#{@getSelector "pagination"}'><span class='#{@getSelector "paginationCurrent"}'>01</span>/<span class='#{@getSelector "paginationTotal"}'>01</span></div>"  
          
  bindUIEvents: =>
    # next / back click events
    @$nextBtn.bind "click", (e) =>
      e.preventDefault()
      @next()
    @$prevBtn.bind "click", (e) =>
      e.preventDefault()
      @prev()
    
    # pagination click events 
    if @settings.hasPaginationNav
      @$paginationNav.bind "click", (e) =>
        e.preventDefault()
        @goTo $(e.target).index()

    #touch events
    @$inner.bind "touchstart", @onTouchStart if @settings.touchEnabled
  
  onTouchStart: (e) =>
    @innerLeft = parseInt(@$inner.css "left")
    @startX = e.originalEvent.touches[0].pageX;
    
    @$inner.bind "touchend", @onTouchEnd
    @$inner.bind "touchmove", @onTouchMove
    
    @drag e.originalEvent
    
  onTouchEnd: (e) =>
    @$inner.unbind "touchend", @onTouchEnd
    distance = @startX - @endX
    
    if distance > 150
      @next()
    else if distance < -150
      @prev()
    else
      @slideToCurrentIndex()
        
  onTouchMove: (e) =>
    @drag e.originalEvent
  
  drag: (e) =>
    @endX = e.touches[0].pageX
    @$inner.css
      left: @innerLeft - (@startX - @endX)
            
  updatePaginationNav: ->
    @$paginationNav.children().removeClass("current")
    @$paginationNav.children().eq(@currentIndex).addClass("current")
  
  updatePagination: ->
    @$paginationContainer.find(@settings.selectors.paginationCurrent).html(if @currentIndex < 10 then "0" + (@currentIndex + 1).toString() else (@currentIndex + 1).toString())
    @$paginationContainer.find(@settings.selectors.paginationTotal).html(if @numSlides < 10 then ("0" + @numSlides).toString() else @numSlides.toString())
   
  skipToSlide: () ->
    @$inner.css 
      left: @getPos()
    
    if @settings.animationType is "slideFade"     
      @$slides.each ->
        $(this).children().fadeTo 0,0
      @$currentSlide.children().fadeTo 0,1
             
  slideToCurrentIndex: () ->
    pos = @getPos()
    # css3 animation
    if @settings.animationMethod.toLowerCase() is "css3"
      @$inner.css 
        left: pos       
      @onTransitionComplete()
    # jquery animation
    else if @settings.animationMethod.toLowerCase() is "jquery"
      @$inner.animate
        left: pos
      , @settings.transitionSpeed, @onTransitionComplete
  
  slideFadeToCurrentIndex: () ->
    @slideToCurrentIndex()
    @$slides.each ->
      if $(this) isnt @$currentSlide
        $(this).delay(200).children().each( (i) -> 
          $(this).stop().delay(i * 100).fadeTo 200, 0
        )
      
    @$currentSlide.fadeTo 200,1, =>
      @$currentSlide.children().each( (i) -> 
        $(this).stop().delay(i * 100).fadeTo 200, 1
      )
  
  onTransitionComplete: () =>   
    @$carousel.trigger('changeComplete')
    @settings.callBacks.onChangeComplete?() 
        
  getPos: () ->
    return -(@getLeftOffset() + (@$currentSlide.outerWidth() - @$carousel.width()) / 2)
    
  getLeftOffset: () ->
    @$currentSlide.position().left
    
  prev: =>
    newIndex = @currentIndex - @settings.transitionStep
    
    if @settings.transitionStep > 1
      if newIndex < 0
        newIndex = 0

    if newIndex >= 0
      @goTo newIndex
    else
      @goTo @numSlides-1 if @settings.loop
         
  next: =>    
    newIndex = @currentIndex + @settings.transitionStep
   
    if @settings.transitionStep > 1
      if (newIndex + @settings.transitionStep) > @numSlides
        newIndex -= (newIndex + @settings.transitionStep) - @numSlides

    if newIndex < @numSlides
      @goTo newIndex
    else
      @goTo 0 if @settings.loop
  
  goTo: (index, skipAnimation) =>
    @currentIndex = index 
    @$currentSlide = @$slides.eq(@currentIndex)
    
    @updatePagination() if @settings.hasPagination
    @updatePaginationNav() if @settings.hasPaginationNav
    
    @$carousel.trigger('change')
    @settings.callBacks.onChange?()
    
    if skipAnimation
      @skipToSlide()
    else
      switch @settings.animationType
        when "slide"
          @slideToCurrentIndex()
        when "slideFade"
          @slideFadeToCurrentIndex()
        when "fade"
          console.log "fade"
    
  play: =>
    console.log "play"
    
  stop: =>
    console.log "stop"

  # sugar util for finding elements
  $find: (f) => 
    @$carousel.find @settings.selectors[f]
        
  getContainer: (name, _default) -> 
    if @settings.selectors[name] is "" then _default else @$find name
    
  getSelector: (name) ->
    selector = @settings.selectors[name]
    selector.slice(1, selector.length) 

class App.ThumbnailCarousel extends App.Carousel
  constructor: ->
    super
    @activate()
    
  getPos:() ->
    return -((@currentIndex * @$currentSlide.outerWidth(true)))
    
  activate: ->
      @$slides.bind "click", (e) => @onThumnnailClick(e)
 
  onThumnnailClick: (e) ->
      $iFrame = $(".videoiframe")
      $video = $("#video")
      e.preventDefault()
      src = $(e.currentTarget).attr "data-src"
      poster = $(e.currentTarget).attr "data-poster"
      $video.fadeTo 500, 0, =>
        # #TODO access iframe within current video_with_thumbs, as there may be other videos
        $iFrame.attr("src","videoiframe.jsp?src=#{src}&poster=#{poster}&autoPlay=true&debug=true")
        $iFrame.load =>          
          $video.delay(800).fadeTo 500, 1