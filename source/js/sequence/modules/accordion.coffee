"use strict"

modules = SEQ.utils.namespace('SEQ.modules')
animate = SEQ.effects.Animate

class modules.AccordionGroup
  
   # initial settings
  @settings = {}
  
  constructor: (@container, options) ->
    
    @applySettings(options)
    @sections = []
    
    for section in @container.find(@settings.selectors.main)
      @sections.push(new modules.Accordion(section, @settings))     
        
  applySettings: (options) =>
    
    # merge defaults with options
    @settings =
      openDuration: 300
      closeDuration: 300
      selectors:
        main: ".section"
        header: "header"
        inner: ".inner"
        
    $.extend true, @settings, options
   
   open: (index, openDuration) =>    
     @sections[index||=0].open(openDuration||=@settings.openDuration)
   
class modules.Accordion
  
  constructor: (container, @settings) ->
    
    @isOpen = false
    
    @container = $(container)
    
    @inner = @container.find(@settings.selectors.inner)
    @inner.css
      overflow: "hidden"
    @openHeight = @inner.outerHeight()
      
    @header = @container.find(@settings.selectors.header)
    @header.css
        cursor: "pointer"
    @header.on("click", =>
      if @isOpen 
        @close(@settings.openDuration)
      else 
        @open(@settings.closeDuration)
    )
    
    @close 0
    
  close:(duration) =>
    @container.addClass("closed").removeClass("open")
    @isOpen = false;
    @inner.css
      height: @inner.outerHeight()       
    setTimeout =>
      animate.To
       target: @inner,
       duration: duration,
       props:
         height: "0px",
         opacity: 0
    , 1
 
  open: (duration) =>
    @container.addClass("open").removeClass("closed")    
    @isOpen = true
 
    animate.To
     target: @inner,
     duration: duration,
     props:
       height: "#{@openHeight}px",
       opacity: 1    
     complete: =>
       @inner.css
        height: "auto"
        
        
  