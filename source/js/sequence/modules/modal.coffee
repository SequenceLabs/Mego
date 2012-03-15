"use strict" 

SEQ.utils.namespace('SEQ.modules')

class SEQ.modules.CoffeeModal
	
	constructor: (@container) ->
		@el = {}
		@overlay = {}
		@outer = {}
		@inner = {}
		@closeBtn = {}

	render: (html) ->	
		@container.append(
			@el = $("<div />").addClass("modal_window").append(
				@overlay = $("<div />").addClass("overlay").append(
				  @outer = $("<div />").addClass("outer").append(
				    @closeBtn = $("<div />").addClass("close_btn"),
						@inner = $("<div />").addClass("inner").html(html)
				  )
				)
			)
		)
		@outer.fadeOut(0)
		@overlay.fadeOut(0)
		
	add: () ->
		@overlay.fadeIn(300, =>			
			@outer.fadeIn(500)
		)		
		@closeBtn.click =>
			@remove()				

	remove: () ->
		@outer.fadeOut(200)
		@overlay.fadeOut(300, =>
			@el.remove()
		)

	setDimensions: (dimensions) ->
		@outer.css dimensions
		@inner.css dimensions

	renderIframe: (url, width, height, callback) ->
		$iframe = $("<iframe />").attr
			"id": "frame"
			"src": url
			"width": width
			"height": height
			"scrolling": "no"
			"frameBorder": "0"
		
		$iframe.bind "load", (e) =>
			$frame = $iframe
			dimensions =
				width:$iframe.contents().find("object").attr("width")
				height:$iframe.contents().find("object").attr("height")
			
			$iframe.attr
				"width": dimensions.width
				"height": dimensions.height
			@setDimensions dimensions
			callback()

		@render $iframe

class SEQ.FlashModalController
	constructor: () ->
		$("a[rel='flash_modal']").bind "click", (e) =>
			e.preventDefault()			
			url = $(e.target).attr("href")
			modal = new App.Modal $("body")
			
			modal.renderIframe url, 757, 700, ->	
				modal.el.addClass "flash"			
				modal.add()					
			
			return false

class SEQ.LeavingModalController

	constructor: () ->
		modal = {}
		$("a[rel='external']").bind "click", @onExternalLinkClick		
			
	onExternalLinkClick: (e) =>
		e.preventDefault()
		url = $(e.target).attr("href")
		modal = new App.Modal $("body")
		modal.renderIframe(url, 620, 300)
		modal.add()
		modal.el.addClass "leaving"
		
		$("#go_back").bind "click", @onGoBackBtnClick
		$("#continue").bind "click", @onContinueBtnClick

		return false
	
	onGoBackBtnClick: (e) =>
		e.preventDefault()
		modal.remove()
		return false

	onContinueBtnClick: (e) =>
		modal.remove()
