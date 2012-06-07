############################################
#
#  @author Nadhim Orfali
#  @version 0.1
#
#  Facebook Stats Widget
#
############################################
modules = SEQ.utils.namespace('SEQ.modules')

# Add dependences
ParseDate = SEQ.utils.dateutils.ParseDate
htmlString = ""

class modules.FacebookStats
  
  constructor: (@options) ->
    # initial settings
    @settings = {} 
    # main element
    @container = {}
    # inner holder
    @inner = {}

    @applySettings(options)
    @initFBStats()
  
  ###*
  @param {Object}  options    User-defined options
  ###

  applySettings:(options) =>
    # merge defaults with options
    @settings =
      url: "https://api.facebook.com/method/fql.query?query=" + encodeURI("SELECT url, normalized_url, share_count, like_count, comment_count, total_count,commentsbox_count, comments_fbid, click_count FROM link_stat WHERE ") + "url="
      page: 'site'   # page or site
      debug: false
      selectors:
        container: @options.container
        inner:    "facebook-item"        # inner container

    $.extend true, @settings, options
        
  initFBStats: =>
    
    if @settings.page?
      if @settings.page == 'page'
        likePage = window.location.href
      else
        if @settings.debug == false
          likePage = 'http://'+ window.location.host
        else
          likePage = 'http://www.sequence.co.uk' # for testing

      $.ajax @settings.url + "'" + likePage + "'",
        dataType: 'xml'
        error: (jqXHR, textStatus, errorThrown) =>
          console.log "Error #{textStatus}"
        success: (data, textStatus, jqXHR) =>
          link_stat = $(data).find('link_stat').length
          console.log "stats: " + link_stat
          if link_stat > 0
            share_count = $(data).find('share_count').text()
            like_count = $(data).find('like_count').text()
            comment_count = $(data).find('comment_count').text()
            total_count = $(data).find('total_count').text()
            htmlString += "<article class='"+@settings.selectors.inner+"'>"
            htmlString += "<p>Shared Count: " + share_count + "</p>"
            htmlString += "<p>Like Count: " + like_count + "</p>"
            htmlString += "<p>Comment Count: " + comment_count + "</p>"
            htmlString += "<p>Total Count: " + total_count + "</p>"
            htmlString += "</article>"
            $(@settings.selectors.container).html htmlString

