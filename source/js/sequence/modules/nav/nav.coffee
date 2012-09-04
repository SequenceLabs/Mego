"use strict"

modules = Namespace("SEQ.modules")

class modules.Nav

  constructor: (@el) ->
    @menuBtn = document.createElement("div")
    @menuInner = @el.getElementsByTagName("ul")[0]
    @init()

  init: () =>
    @menuBtn.id = "menu-btn"

  attach: () =>
    @el.insertBefore(@menuBtn, @el.firstChild)
    @menuBtn.addEventListener("click", @toggle)
    @close()

  detach: () =>
    @el.removeChild(@menuBtn)

  open: () =>
    @closed = false
    @menuInner.className = ""
    @menuBtn.innerHTML = "CLOSE"

  close: () =>
    @closed = true
    @menuInner.className = "closed"
    @menuBtn.innerHTML = "MENU"

  toggle: =>
    if @closed then @open() else @close()