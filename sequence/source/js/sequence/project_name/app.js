(function() {
  "use strict";
  var Project_Namespace, init, onDocReady;

  Project_Namespace = SEQ.utils.namespace("SEQ.project_namespace");

  (init = function() {
    return $(document).ready(function() {
      return onDocReady();
    });
  })();

  onDocReady = function() {};

}).call(this);
