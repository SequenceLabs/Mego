Transition
==========

This module provides an API for creating and controlling CSS3 transitions programmatically, with a jQuery fallback in non-supported browsers. 

Dependencies
------------

- jQuery

Usage
-----

The Transitions API uses static methods of the 'SEQ.effects.Transition' class. For example:

`SEQ.effects.Transition.To({ // it is recommended that you cache a reference to this.
  target: $("#some-div")
  props: {
    height: "100px",
    width: "100px"
  },
  duration: 1000,
  complete: referenceToCallback
});`


Options
-------  

**target** [HTMLELement, Array, jQuery Object] *This is the target element for the transition. This can be a JS HTMLElement, an Array of HTMLElements or a jQuery Object (including multiple targets, which will be iterated over — eg. $("#selector").children()).*

**props** [Object] *An Object containing the property or properties to be transitioned to. NOTE: if you transition to width/height "auto", there is a 50ms overhead. *

**duration** [int] *The duration of the animation in milliseconds*

**complete** [function] *A function (callback) to be called at the end of the transition*

Changelog
---------
       
08.03.12

- fixed bug with jQuery complete callback.
    
09.03.12

- restructured how individual property transitions occur so they now instantiate their own class and have internal states, event-handling, etc.