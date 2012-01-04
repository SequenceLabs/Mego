(function() {
  var init, onDocReady, onWindowLoaded;

  window.App = window.Sequence;

  (init = function() {
    $(window).load(function() {
      return onWindowLoaded.call();
    });
    $(document).ready(function() {
      return onDocReady.call();
    });
    return false;
  })();

  onWindowLoaded = function() {};

  onDocReady = function() {
    return yepnope({
      test: $("#carousel").length > 0,
      load: "/js/lib/sequence/carousel.js",
      callback: function() {
        return new App.Carousel($("#carousel"));
      }
    });
  };

}).call(this);
