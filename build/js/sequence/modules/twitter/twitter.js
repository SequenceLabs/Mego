(function() {
  var ParseDate, htmlString, modules,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  modules = Namespace('SEQ.modules');

  ParseDate = SEQ.utils.dateutils.ParseDate;

  htmlString = "";

  modules.Twitter = (function() {

    function Twitter(options) {
      this.options = options;
      this.initTweets = __bind(this.initTweets, this);

      this.applySettings = __bind(this.applySettings, this);

      this.settings = {};
      this.container = {};
      this.inner = {};
      this.tweets = {};
      this.currentIndex = 1000;
      this.numTweets = 0;
      this.applySettings(options);
      this.initTweets();
    }

    /**
    @param {Object}  options    User-defined options
    */


    Twitter.prototype.applySettings = function(options) {
      this.settings = {
        url: "http://twitter.com/statuses/user_timeline/",
        username: "sequence_agency",
        noOfTweet: 2,
        showDate: true,
        currentDate: new Date(),
        months: new Array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'),
        selectors: {
          container: this.options.container,
          inner: "twitter-item"
        }
      };
      return $.extend(true, this.settings, options);
    };

    Twitter.prototype.initTweets = function() {
      var _this = this;
      if (this.settings.username != null) {
        return $.ajax(this.settings.url + this.settings.username + '.json', {
          dataType: 'jsonp',
          error: function(jqXHR, textStatus, errorThrown) {
            return $(_this.settings.selectors.container).append("Error " + textStatus);
          },
          success: function(data, textStatus, jqXHR) {
            var dateStamp, dayDiff, hourDiff, i, item, minDiff, tweetDate, tweets, _i, _len;
            tweets = data.slice(0, _this.settings.noOfTweet);
            for (i = _i = 0, _len = tweets.length; _i < _len; i = ++_i) {
              item = tweets[i];
              if (_this.settings.showDate) {
                tweetDate = new Date(ParseDate(item["created_at"]));
                dayDiff = parseInt(_this.settings.currentDate.getDate(), 10) - parseInt(tweetDate.getDate(), 10);
                hourDiff = parseInt(parseInt(_this.settings.currentDate.getHours(), 10) - parseInt(tweetDate.getHours()), 10);
                minDiff = parseInt(_this.settings.currentDate.getMinutes(), 10) - parseInt(tweetDate.getMinutes(), 10);
                if ((tweetDate.getFullYear() === _this.settings.currentDate.getFullYear()) && (tweetDate.getMonth() + 1) === (_this.settings.currentDate.getMonth() + 1)) {
                  if ((tweetDate.getDate() === _this.settings.currentDate.getDate()) && (tweetDate.getHours() === _this.settings.currentDate.getHours()) && (tweetDate.getMinutes() === _this.settings.currentDate.getMinutes())) {
                    dateStamp = "Just now";
                  } else if (_this.settings.currentDate.getDate() === tweetDate.getDate()) {
                    if (hourDiff === 1) {
                      dateStamp = hourDiff + " hour ago";
                    } else if (hourDiff > 1) {
                      dateStamp = hourDiff + " hours ago";
                    } else if (hourDiff < 1) {
                      if (minDiff === 1) {
                        dateStamp = minDiff + " minute ago";
                      } else if (minDiff > 1) {
                        dateStamp = minDiff + " minutes ago";
                      } else if (minDiff < 1) {
                        dateStamp = "Just now";
                      }
                    }
                  } else if (_this.settings.currentDate.getDate() > tweetDate.getDate()) {
                    dateStamp = tweetDate.getDate() + " " + _this.settings.months[tweetDate.getMonth()];
                  }
                } else {
                  dateStamp = _this.settings.months[tweetDate.getMonth()] + " " + tweetDate.getFullYear();
                }
              }
              htmlString += "<article class='" + _this.settings.selectors.inner + "'>";
              htmlString += "<h6>" + item["text"] + "</h6>";
              if (dateStamp != null) {
                htmlString += "<small class=\"date\">" + dateStamp + "</small>";
              }
              htmlString += "</article>";
            }
            return $(_this.settings.selectors.container).after(htmlString);
          }
        });
      }
    };

    return Twitter;

  })();

}).call(this);
