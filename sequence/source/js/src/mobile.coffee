window.App ?= {}

# Use local alias
$ = jQuery

class App.Mobile
	constructor: ->
		$("#video_thumbs li").click ->
			src = $(@).attr("data-src")
			window.location = src

	