############################################
#
#  @author Nadhim Orfali
#  @version 0.1
#
#  Twitter Widget
#
############################################
modules = SEQ.utils.namespace('SEQ.modules')

# Add dependences
ParseDate = SEQ.utils.dateutils.ParseDate
htmlString = ""

class modules.Twitter
  
  constructor: (@options) ->
    # initial settings
    @settings = {} 
    # main element
    @container = {}
    # inner slide holder
    @inner = {}
    # collection of tweets
    @tweets = {}
    # internal states
    @currentIndex = 1000
    # number of tweets
    @numTweets = 0

    @applySettings(options)
    @initTweets()
  
  ###*
  @param {Object}  options    User-defined options
  ### 
  
  applySettings:(options) =>
    # merge defaults with options
    @settings =
      url: "http://twitter.com/statuses/user_timeline/" # URL for Twitter API excluding .json!
      username: "sequence_agency"   # username
      noOfTweet: 2                  # Number of tweets you want to see
      showDate: true                # Show date? 
      currentDate: new Date()
      months: new Array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec')
      selectors:
        container: @options.container
        inner:    "twitter-item"        # inner container

    $.extend true, @settings, options
        
  initTweets: =>
    
    if @settings.username?
      $.ajax @settings.url + @settings.username + '.json',
        dataType: 'jsonp'
        error: (jqXHR, textStatus, errorThrown) =>
            $(@settings.selectors.container).append "Error #{textStatus}"
        success: (data, textStatus, jqXHR) =>
            tweets = data.slice 0, @settings.noOfTweet
            for item, i in tweets
              if @settings.showDate
                tweetDate = new Date(ParseDate(item["created_at"]))
                dayDiff = parseInt(@settings.currentDate.getDate(), 10) - parseInt(tweetDate.getDate(), 10);
                hourDiff = parseInt(parseInt(@settings.currentDate.getHours(), 10) - parseInt(tweetDate.getHours()), 10);
                minDiff = parseInt(@settings.currentDate.getMinutes(), 10) - parseInt(tweetDate.getMinutes(), 10);                
                if (tweetDate.getFullYear() is @settings.currentDate.getFullYear()) and (tweetDate.getMonth() + 1) is (@settings.currentDate.getMonth() + 1)
                  # tweeted just now
                  if (tweetDate.getDate() is @settings.currentDate.getDate()) and (tweetDate.getHours() is @settings.currentDate.getHours()) and (tweetDate.getMinutes() is @settings.currentDate.getMinutes())
                    dateStamp = "Just now"
                  else if @settings.currentDate.getDate() is tweetDate.getDate()
                    if hourDiff is 1
                      dateStamp = hourDiff + " hour ago"
                    else if hourDiff > 1
                      dateStamp = hourDiff + " hours ago"
                    else if hourDiff < 1
                      if minDiff is 1
                        dateStamp = minDiff + " minute ago"
                      else if minDiff > 1
                        dateStamp = minDiff + " minutes ago"
                      else if minDiff < 1
                        dateStamp = "Just now"
                  else if @settings.currentDate.getDate() > tweetDate.getDate()
                    dateStamp = tweetDate.getDate() + " " + @settings.months[tweetDate.getMonth()]
                else
                  dateStamp = @settings.months[tweetDate.getMonth()] + " " + tweetDate.getFullYear()
                  
              htmlString += "<article class='"+@settings.selectors.inner+"'>"
              htmlString += "<h6>" + item["text"] + "</h6>"
              if dateStamp?
                htmlString += "<small class=\"date\">" + dateStamp + "</small>"
              htmlString += "</article>"
            $(@settings.selectors.container).after htmlString

