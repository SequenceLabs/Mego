(function() {
  var CientName, init, initAccordion, initCarousel, onDocReady;

  CientName = SEQ.utils.namespace("SEQ.client");

  (init = function() {
    return $(document).ready(function() {
      return onDocReady.call();
    });
  })();

  onDocReady = function() {
    if ($("#carousel").length > 0) initCarousel();
    if ($("#help-topics").length > 0) return initAccordion();
  };

  initCarousel = function() {
    var slider;
    return slider = new SEQ.modules.CoffeeSlider($("#carousel"), {
      hasDotNav: true,
      hasPrevNext: false,
      hasPagination: false,
      infinite: false,
      animationType: "slideFade"
    });
  };

  initAccordion = function() {
    var accordionGroup;
    accordionGroup = new SEQ.modules.AccordionGroup($("#help-topics"), {
      openDuration: 100,
      closeDuration: 100,
      selectors: {
        main: ".help-section",
        header: "header"
      }
    });
    return setTimeout(function() {
      return outerAccordionGroup.open();
    }, 500);
  };

}).call(this);
