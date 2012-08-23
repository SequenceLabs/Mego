facebook = Namespace "SEQ.modules.facebook"

class facebook.FacebookAPILoader

	constructor: (@options) ->
		@init()

	init: =>
		# @applySettings()
		# @url = @settings.url + @settings.uid + "/statuses?access_token=" + @settings.accessToken
		YOUR_APP_ID = "316388251782445"
		YOUR_APP_SECRET = "03b0e2d1db3b1c18a11a04069d319906"
		@url = "https://graph.facebook.com/oauth/access_token?client_id="+YOUR_APP_ID+"&client_secret="+YOUR_APP_SECRET+"&grant_type=client_credentials"
		@loadData()

	applySettings:() =>
		# merge defaults with options
		@settings =
			url: "https://graph.facebook.com/"
		$.extend true, @settings, @options
	loadData: =>
		$.ajax @url,
			success: @onDataSuccess
			error: @onLoadError
			complete: @onLoadComplete

	onDataSuccess: (data, textStatus, jqXHR) =>
		$.ajax "https://graph.facebook.com/"+699178242+"/statuses?"+data,
      success: (data, textStatus, jqXHR) =>
        console.log data

	onLoadError: (jqXHR, textStatus, errorThrown) =>
		console.log jqXHR, textStatus, errorThrown

	onLoadComplete: (jqXHR, textStatus) =>
		console.log textStatus