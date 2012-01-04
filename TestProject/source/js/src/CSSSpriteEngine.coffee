window.App ?= {}

# Use local alias
$ = jQuery

class App.CSSSpriteEngine

    $container: {}
    frameWidth: 0
    frameHeight: 0
    totalFrames: 0
    loop: false
    autoPlay: true
    $spriteSheetImage: {}
    url: ""
    isloaded: false
    imageWidth: 0
    imageHeight: 0
    image: {}
    currentFrame: 1
    updateTimer: {}
    isPlaying: false
  
    ###
      @param {jQuery}  container  The main container
      @param {Object}  options    User-defined options
    ###
    constructor: (container, options) ->
        @$container = container
        @url = options.url
        @frameWidth = options.frameWidth
        @frameHeight = options.frameHeight
        @totalFrames = options.totalFrames
        @loop = options.loop
        @autoPlay = options.autoPlay
        @onReadyCallback = options.onReady
        @onCompleteCallback = options.onComplete
        @init()
  
    init: ->
        @build()
        @load()
        
    build: ->
        #@$container.css "position", "relative"
        @$container.css "width", @frameWidth
        @$container.css "height", @frameHeight
        
    load: ->
        @image = new Image()
        @$spriteSheetImage = $(@image)
        @$spriteSheetImage.bind "load", (e) => @loadComplete()
        @$spriteSheetImage.attr "src", @url
          
    loadComplete: (e) ->
        @isloaded = true
        @imageWidth = @image.width
        @imageHeight = @image.height
        @$container.css "backgroundImage", "url(#{@url} )"
        @positionSpriteSheet @currentFrame
        @play @currentFrame if @autoPlay is true
        @onReadyCallback()
        
    positionSpriteSheet: (frame) ->
        maxCols = @imageWidth / @frameWidth
        row = Math.ceil(frame / maxCols) - 1
        col = (frame - (row * maxCols)) - 1
        x = -(col * @frameWidth)
        y = -(row * @frameHeight)
        @$container.css "backgroundPosition", "#{x}px #{y}px"        

    update: ->
        @currentFrame++
        @validateCurrentFrame()
        @positionSpriteSheet @currentFrame
        if @currentFrame is @totalFrames && @loop is false
            @onCompleteCallback()
        else
            @updateTimer = setTimeout (=> @update()), 33 #need parenthesis around update function call and bind to avoid compiler error
               
    validateCurrentFrame: ->
        if @currentFrame < 1
            @currentFrame = @totalFrames
        if @currentFrame > @totalFrames
            @currentFrame = 1
    
    onReadyCallback: ->
    
    onCompleteCallback: ->
    
        
    ### PUBLIC
    ______________________________________________________________________________________###
    play: (frame) ->
        false if @isLoaded is false
        if @isPlaying is false
            @isPlaying = true
        else
            clearTimeout(@updateTimer)
        if frame is undefined
            frame = @currentFrame
        @currentFrame = frame - 1
        @update()
        
    pause: ->
        if @isPlaying is true
            @isPlaying = false
            clearTimeout(@updateTimer)
        
    stop: ->
        @pause()
        @currentFrame = 1
