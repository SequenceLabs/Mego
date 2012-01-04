(function() {
  var $, _ref;

  if ((_ref = window.App) == null) window.App = {};

  $ = jQuery;

  App.Mobile = (function() {

    function Mobile() {
      $("#video_thumbs li").click(function() {
        var src;
        src = $(this).attr("data-src");
        return window.location = src;
      });
    }

    return Mobile;

  })();

}).call(this);
