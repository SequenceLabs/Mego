#  ____                                       
# / ___|  ___  __ _ _   _  ___ _ __   ___  ___ 
# \___ \ / _ \/ _` | | | |/ _ \ '_ \ / __|/ _ \
#  ___) |  __/ (_| | |_| |  __/ | | | (__|  __/
# |____/ \___|\__, |\__,_|\___|_| |_|\___|\___|
#                |_|   
                                                               
"use strict"  

Project_Namespace = SEQ.utils.namespace "SEQ.project_namespace"

#init function happens as soon as javascript is loaded
do init = () ->
	# console.log "init"
	$(document).ready ->
    onDocReady()
# executes when document is ready
onDocReady = () ->
  
  # init CoffeeSlider
  coffeeslider = new SEQ.modules.CoffeeSlider
    container: $(".carousel")
    transitionType: "slide"
    loop: "infinite"
    transitionSpeed: 1400
    transitionDelay: 5000
    transitionDirection: "horizontal"
    touchStyle: "drag"
    preload: true
    responsive: false
    selectors:
      slide: "figure"
        
  # init CoffeeSlider
  thumbnails = new SEQ.modules.ThumbSlider
    container: $(".thumbnails")
    transitionType: "slide"
    loop: "infinite"
    transitionSpeed: 1400
    transitionDelay: 5000
    transitionDirection: "horizontal"
    touchStyle: "drag"
    preload: true
    step: 3
    responsive: false
    hasDotNav: false
    selectors:
     slide: "figure"
  
  coffeeslider.registerNavModule(thumbnails)
    
  