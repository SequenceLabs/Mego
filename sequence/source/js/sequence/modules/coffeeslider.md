Coffeeslider
------------

Coffeeslider is a touch-enabled slider module written in Coffeescript.   

Dependencies
------------

- Transition (https://github.com/hamishtaplin/Transition)
- jQuery

Usage
-----

Coffeeslider is instantiated just like any native Javascript object, via the 'new' keyword. There are a number of options that can be passed in (via an Object-literal). The following is an example of a minimal implementation:
                       
`new SEQ.modules.CoffeeSlider({
  container: $("#carousel"),
  selectors: {
    slide: "figure"
  }
});`

  
Options *(default)*
-------
**container**           *(none)*                A jQuery object containing the slides.

**transitionType**      *("slide")*             "slide", "fade" or "slideFade" - the type of transition between slides.  

**transitionSpeed**     *(1000)*                The duration of a transition.   

**hasDotNav**           *(true)*                'dot' style navigation.    

**hasPrevNext**         *(true)*                Prev/next buttons.    

**hasPagination**       *(false)*               Pagination (eg. 1/5, etc). 

**touchStyle**          *("drag")*              Which style of touch interaction to use, "gesture", "inverseGesture", "drag" or "none"   

**infinite**            *(true)*                Set to "true" for infinite scrolling.  


**selectors**                                   An object containing all CSS selectors to be used.

**slide**                *(".slide")*           Coffeeslider uses this selector to define a slide. For example, if your 'slides' are a list, you would enter 'li' here.   

**outer**                *(".outer")*           The outer wrapper. *  
                                          
**inner**                *(".inner")*           The inner wrapper.*

**prev**                 *(".prev")*            The 'previous slide' button. *   

**next**                 *(".next")*            The 'next slide' button. *   

**uiParent**             *(none)*               By default, the prev/next buttons will be created inside the main container. If a selector is specified here, this will be used as the container instead. This allows, for example, the prev/next buttons to exist outside the main container and not subject to CSS "overflow:hidden" constraints.    

**paginationContainer**  *(none)*               Same as the uiParent but for the pagination indicators. Defaults to uiParent.   

**dotNav**               *(".dot-nav")*         The class to be used for 'dot' style navigation.  

**pagination**           *(".pagination")*      The class for pagination indicators. (eg. 01/05)  

**paginationCurrent**    *(".currentPage")*     The class added to the current page indicator (eg. 01/05)    

**paginationTotal**      *(".total")*           The class added to the page total.

**callbacks**

**onStart**                                     Called after the slider is initialised. 

**onTransition**                                Called each time the slide transition starts.    

**onTransitionComplete**                        Called each time the slide transition completed.

`*` If this element already exists, it will be used. If not, it will be created.      

Changelog
---------
       
08.03.12

- added fade transition.
- added preload functionality.
- minor bug fixes.

09.03.12

- added "vertical" scrolling.
- minor changes to touch interactions