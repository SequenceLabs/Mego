(function() {
  "use strict";
  var effects,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  effects = Namespace("effects");

  effects.TransitionController = (function() {

    function TransitionController(options) {
      var element, elements, i, _len, _ref;
      this.options = options;
      this.onTransitionEnd = __bind(this.onTransitionEnd, this);
      this.transition = __bind(this.transition, this);
      this.transitionEndStr = effects.Transition.TransitionEndNames[effects.Transition.GetProp('Transition')];
      this.numTransitions = 0;
      this.numTransitionsComplete = 0;
      elements = [];
      if (this.options.target instanceof jQuery) {
        _ref = this.options.target;
        for (i = 0, _len = _ref.length; i < _len; i++) {
          element = _ref[i];
          elements.push(this.options.target.get(i));
        }
      } else if (this.options.target.constructor === Array) {
        elements = this.options.target;
      } else {
        elements = [this.options.target];
      }
      this.transition(elements);
    }

    TransitionController.prototype.transition = function(elements) {
      var element, prop, value, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = elements.length; _i < _len; _i++) {
        element = elements[_i];
        _results.push((function() {
          var _ref, _results2;
          _ref = this.options.props;
          _results2 = [];
          for (prop in _ref) {
            value = _ref[prop];
            this.numTransitions++;
            if (this.options.duration > 0) {
              element.addEventListener(this.transitionEndStr, this.onTransitionEnd, false);
            } else {
              this.onTransitionEnd({
                target: element
              });
            }
            _results2.push(new effects.TransitionDelegate(element, prop, value, this.options.duration));
          }
          return _results2;
        }).call(this));
      }
      return _results;
    };

    TransitionController.prototype.onTransitionEnd = function(e) {
      e.target.removeEventListener(this.transitionEndStr, this.onTransitionEnd, false);
      this.numTransitionsComplete++;
      if (this.numTransitionsComplete === this.numTransitions) {
        if (this.options.complete != null) return this.options.complete.call(this);
      }
    };

    return TransitionController;

  })();

}).call(this);
