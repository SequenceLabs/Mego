#  ____                                       
# / ___|  ___  __ _ _   _  ___ _ __   ___  ___ 
# \___ \ / _ \/ _` | | | |/ _ \ '_ \ / __|/ _ \
#  ___) |  __/ (_| | |_| |  __/ | | | (__|  __/
# |____/ \___|\__, |\__,_|\___|_| |_|\___|\___|
#                |_|   

window.App = window.Sequence

#init function happens as soon as javascript is loaded
do init = () ->
	# console.log "init"
	$(window).load ->
		onWindowLoaded.call()
	$(document).ready ->
		onDocReady.call()

	return false

# executes when all assets are loaded
onWindowLoaded = () ->
	# console.log "onWindowLoaded"

# executes when document is ready
onDocReady = () ->

	yepnope
		test: $("#carousel").length > 0
		load: "/js/lib/sequence/carousel.js"
		callback: ->			
			new App.Carousel $("#carousel")