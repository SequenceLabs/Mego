"use strict"

modules = Namespace('SEQ.modules')

class modules.CoffeeModal

	constructor: (this.options) ->
		this._runOnce: false;
		this._container = this.options.container
		this._el = {}
		this._overlay = {}
		this._outer = {}
		this._inner = {}
		this._closeBtn = {}

	#
  # Private Methods
  # _____________________________________________________________________________________

	_onIframeLoaded: =>
		dimensions =
			width:this.iframe.contents().find("object").attr("width")
			height:this.iframe.contents().find("object").attr("height")

		this.iframe.attr
			"width": dimensions.width
			"height": dimensions.height
		this.setDimensions dimensions

		if this.callback?
			this.callback()

	#
  # Public Methods
  # _____________________________________________________________________________________

	render: (html) ->
		if !this.html?
			this.html = html
		this._container.append(
			this._el = $("<div />").addClass("modal-window").append(
				this._overlay = $("<div />").addClass("overlay").append(
				  this._outer = $("<div />").addClass("outer").append(
				    this._closeBtn = $("<div />").addClass("close-btn"),
						this._inner = $("<div />").addClass("inner").html(this.html)
				  )
				)
			)
		)

		if !this._runOnce
			this._overlay.fadeOut(0)
			this._outer.fadeOut(0)
			this._runOnce = true

		this._closeBtn.click =>
			this.remove()

	add: () ->
		this._overlay.fadeIn(300, =>
			this._outer.fadeIn(500)
		)

	remove: () ->
		this._outer.fadeOut(200)
		this._overlay.fadeOut(300, =>
			this._el.remove()
		)

	setDimensions: (dimensions) ->
		this._outer.css dimensions
		this._inner.css dimensions

	renderIframe: (url, width, height, this.callback) ->
		this.iframe = $("<iframe />").attr
			"id": "frame"
			"src": url
			"width": width
			"height": height
			"scrolling": "no"
			"frameBorder": "0"

		this.iframe.bind "load", this._onIframeLoaded
		this.render this.iframe
