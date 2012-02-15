#  ____                                       
# / ___|  ___  __ _ _   _  ___ _ __   ___  ___ 
# \___ \ / _ \/ _` | | | |/ _ \ '_ \ / __|/ _ \
#  ___) |  __/ (_| | |_| |  __/ | | | (__|  __/
# |____/ \___|\__, |\__,_|\___|_| |_|\___|\___|
#                |_|   

CientName = SEQ.utils.namespace "SEQ.client"

#init function happens as soon as javascript is loaded
do init = () ->
	# console.log "init"
	$(document).ready ->
		onDocReady.call()
# executes when document is ready
onDocReady = () ->
  initCarousel() if $("#carousel").length > 0
  initAccordion() if $("#help-topics").length > 0    

initCarousel = () ->
  slider = new SEQ.modules.CoffeeSlider $("#carousel"), 
    hasDotNav: true,
    hasPrevNext: false,
    hasPagination: false,
    infinite: false,
    animationType: "slideFade"

initAccordion = () ->
  accordionGroup = new SEQ.modules.AccordionGroup $("#help-topics"),
    openDuration: 100,
    closeDuration: 100,
    selectors:
      main: ".help-section"
      header: "header"
      
    
      
  setTimeout ->
    outerAccordionGroup.open()
  , 500   
