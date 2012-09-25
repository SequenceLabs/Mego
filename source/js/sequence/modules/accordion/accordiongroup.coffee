"use strict"

modules = Namespace('SEQ.modules')
animate = Namespace('SEQ.effects.Transition')

class modules.AccordionGroup
  # initial settings
  this.settings = {}
  constructor: (@container, options) ->

    this.applySettings(options)
    this.sections = []
    for section in this.container.find(this.settings.selectors.main)
      this.sections.push(new modules.Accordion(section, this.settings))
  #
  # Private Methods
  # _____________________________________________________________________________________

  applySettings: (options) =>

    # merge defaults with options
    this.settings =
      openDuration: 300
      closeDuration: 300
      selectors:
        main: ".section"
        header: "header"
        inner: ".inner"

    $.extend true, this.settings, options

  open: (index, openDuration) =>
    this.sections[index||=0].open(openDuration||=this.settings.openDuration)