"use strict" 

modules = Namespace('SEQ.modules')

class modules.CoffeeModal
	
	@runOnce: false;

	constructor: (@options) ->
		@container = @options.container
		@el = {}
		@overlay = {}
		@outer = {}
		@inner = {}
		@closeBtn = {}

	render: (html) ->
		if !@html?
			@html = html	
			
		@container.append(
			@el = $("<div />").addClass("modal-window").append(
				@overlay = $("<div />").addClass("overlay").append(
				  @outer = $("<div />").addClass("outer").append(
				    @closeBtn = $("<div />").addClass("close-btn"),
						@inner = $("<div />").addClass("inner").html(@html)
				  )
				)
			)
		)

		if !@runOnce

			@overlay.fadeOut(0)
			@outer.fadeOut(0)

			@runOnce = true
		
		@closeBtn.click =>
			@remove()	
				
	add: () ->
		@overlay.fadeIn(300, =>
			@outer.fadeIn(500)
		)		
					
	remove: () ->
		@outer.fadeOut(200)
		@overlay.fadeOut(300, =>
			@el.remove()
		)

	setDimensions: (dimensions) ->
		@outer.css dimensions
		@inner.css dimensions

	renderIframe: (url, width, height, @callback) ->
		@iframe = $("<iframe />").attr
			"id": "frame"
			"src": url
			"width": width
			"height": height
			"scrolling": "no"
			"frameBorder": "0"
		
		@iframe.bind "load", @onIframeLoaded
		@render @iframe

	onIframeLoaded: =>
		dimensions =
			width:@iframe.contents().find("object").attr("width")
			height:@iframe.contents().find("object").attr("height")
		
		@iframe.attr
			"width": dimensions.width
			"height": dimensions.height
		@setDimensions dimensions
		
		if @callback? 
			@callback()
