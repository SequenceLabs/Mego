"use strict"

browser = Namespace "SEQ.utils.browser"

class browser.MediaQueries

  constructor: () ->
    @siteNav = SEQ.mego.app.siteNav
    @init()

  init: =>
    Harvey.attach "screen and (max-width: 480px)",
      setup: =>
      on: =>
      off: =>
    Harvey.attach "screen and (max-width: 767px)",
      setup: =>

      on: =>
        @siteNav.attach()
      off: =>
        @siteNav.detach()
    Harvey.attach "screen and (min-width: 768px) and (max-width: 979px)",
      setup: =>
      on: =>
      off: =>
    Harvey.attach "screen and (min-width: 1200px)",
      setup: =>
      on: =>
      off: =>
