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
  new SEQ.modules.Twitter
    container: $("#twitter h5")

  # init CoffeeSlider
  new SEQ.modules.CoffeeSlider
    container: $("#carousel")
    transitionType: "slide"
    loop: "return"
    transitionSpeed: 400
    transitionDirection: "horizontal"
    touchStyle: "drag"
    preload: true
    selectors:
      slide: "figure"
