#  ____                                       
# / ___|  ___  __ _ _   _  ___ _ __   ___  ___ 
# \___ \ / _ \/ _` | | | |/ _ \ '_ \ / __|/ _ \
#  ___) |  __/ (_| | |_| |  __/ | | | (__|  __/
# |____/ \___|\__, |\__,_|\___|_| |_|\___|\___|
#                |_|   

window.App ?= {}

# Use local alias
$ = jQuery

iPad = false
iPhone = false
desktop = false;
anims = {}

#init function happens as soon as javascript is loaded
do init = () ->
	# console.log "init"

	if App.Utils.Platform.isiPad()
		iPad = true
		$("html").addClass("ipad")
	if App.Utils.Platform.isiPhone()
		iPhone = true
		$("html").addClass("iphone")
	if App.Utils.Platform.isAndroid()
		iPhone = true
		$("html").addClass("android")		
	if App.Utils.Platform.isDesktop()	
		desktop = true;
		anims = new App.AnimController()
		anims.initCharNavAnims()
		
		if $("#homepage").length > 0
			anims.initHomePageAnims()
		if $(".button_up").length > 0
			anims.doButtonAnimation()

	else 
		new App.Mobile()
			
	if $.browser.msie
		$("#background_images").fadeOut 0
		

$(window).load ->
	# console.log "windowLoad"

	if not iPad or not iPhone
		videoThumbsSlider() if $("#video_thumbs").length > 0	
		charPageSlider() if $("#char_page_carousel").length > 0	
		filmPageSlider() if $("#film_page_carousel").length > 0	
		
		modalFlash() if $("a[rel='flash_modal']").length > 0
		leavingModal() if $("a[rel='external']").length > 0
		initVideoOverlayManager() if $("#videoOverlay").length > 0
		
		initSound()
	
	$("html").css
		backgroundImage: "none"
	$("body").animate
		opacity: 1
		, 300, "easeOutSine", =>
			anims.playCharNav() if desktop
			if $.browser.msie
				$("#background_images").fadeIn 1250
						
videoThumbsSlider = () ->
	new App.ThumbnailCarousel $("#video_thumbs"),
		slideMethod: "jquery"
		animationMethod: "jquery"
		hasPaginationNav: false
		hasPagination: false
		transitionStep: 3
		loop: false
		selectors:
			slide: ".thumb"

charPageSlider = () ->			
	new App.Carousel $("#char_page_carousel"),
		animationType: "slideFade"
		slideMethod: "jQuery"
		animationMethod: "jQuery"
		hasPaginationNav: true
		hasPagination: false
		selectors:
			slide: ".slide"
			uiParent: ".controls"

filmPageSlider = () ->		
	new App.Carousel $("#film_page_carousel"),
		animationType: "slideFade"
		slideMethod: "jQuery"
		animationMethod: "jQuery"
		hasPaginationNav: true
		hasPagination: false
		selectors:
			slide: ".slide"
			uiParent: ".controls"

modalFlash = () ->
	new App.FlashModalController()

initSound = () ->
	new App.AudioEngineController()

leavingModal = () ->
	new App.LeavingModalController()
	
initVideoOverlayManager = ->		
	urls = $("#videoOverlay").attr("data-video-overlay-urls").split(",")
	App.videoOverlayManager = new App.VideoOverlayManager(urls)
	$(".button_up").bind("click",App.videoOverlayManager.play)
	$("#videoOverlayCloseButton").bind("click",App.videoOverlayManager.stop)
