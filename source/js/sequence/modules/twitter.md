Twitter
==========

This simple module provides an API for showing latest tweets

Dependencies
------------

- jQuery
- DateUtils

Usage
-----

Twitter is instantiated just like any native Javascript object, via the 'new' keyword. There are a number of options that can be passed in (via an Object-literal). The following is an example of a minimal implementation:
                       
`new SEQ.modules.Twitter({
  container: $("#twitter")
});`


Options *(default)*
-------
**container**           *(none)*                A jQuery object containing the slides.

**showDate**            *(true)*                Set to "true" to show dates.  

**inner**               *(twitter-item)*        An object containing the selector for each item.


`*` If this element already exists, it will be used. If not, it will be created.