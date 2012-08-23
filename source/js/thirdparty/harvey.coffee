###

  Harvey coinManager — Copyright (c) 2012 Joschka Kintscher

###
class this.Harvey

  @coins  : {}
  @queries: []

  @attach: (mediaQuery, callbacks) ->

    unless @coins.hasOwnProperty mediaQuery
      @coins[mediaQuery] = []
      @_add_css_for(mediaQuery) # if userAgent is webkit (to avoid additional DOM manipulation)

    coin = new Coin(mediaQuery, callbacks?.setup, callbacks?.on, callbacks?.off)
    @coins[mediaQuery].push(coin)

    @_watch_query(mediaQuery) unless mediaQuery in @queries
    @_update_coins([coin], yes) if @_window_matchmedia(mediaQuery).matches

    coin


  @detach: (coin) ->

    for c, i in @coins[coin.condition]
      @coins[c.condition][i] = undefined if coin is c


  @_watch_query: (mediaQuery) ->

    @queries.push(mediaQuery)

    @_window_matchmedia(mediaQuery).addListener((mql) =>
      @_update_coins(@coins[mediaQuery], mql.matches)
    )


  @_update_coins: (coins, active) ->

    for coin in coins      
      if active then coin.activate() else coin.deactivate()


  ###

    BEWARE: You're at the edge of the map, mate. Here there be monsters!

    ------------------------------------------------------------------------------------

    Private methods to fix and polyfill the matchMedia interface for several engines

    * Inspired by Nicholas C. Zakas' article on the different problems with matchMedia
      http://www.nczonline.net/blog/2012/01/19/css-media-queries-in-javascript-part-2/

    * Implementing a modified coffeescript version of Paul Irish's matchMedia.js polyfill
      https://github.com/paulirish/matchMedia.js

  ###


  ###
    [FIX] for Firefox/Gecko browsers that lose reference to the
    MediaQueryList object unless it's being stored for runtime
  ###
  @_mediaList : {}

  @_window_matchmedia: (mediaQuery) ->

    if window.matchMedia
      @_mediaList[mediaQuery] = window.matchMedia(mediaQuery) if mediaQuery not of @_mediaList
      return @_mediaList[mediaQuery]


    ###
      [POLYFILL] for all browsers that don't support matchMedia() at all (CSS media query support is mandatory though)
    ###

    # use native window events to listen for changes
    @_listen() unless @_listening

    @_mediaList[mediaQuery] = new _mediaQueryList(mediaQuery) if mediaQuery not of @_mediaList

    # return the corresponding _mediaQueryList object
    @_mediaList[mediaQuery]



  @_listen: () ->

    evt = window.addEventListener || window.attachEvent
    # if IE8 use document.body.onresize = () =>

    evt 'resize', () =>
      mediaList._process() for mediaQuery, mediaList of @_mediaList

    evt 'orientationChange', () =>
      mediaList._process() for mediaQuery, mediaList of @_mediaList

    @_listening = yes



  ###
    [FIX] for Webkit engines that only trigger the MediaQueryListListener
    when there is at least one CSS selector for the respective media query
  ###
  @_add_css_for: (mediaQuery) ->

    unless @style
      @style = document.createElement('style')
      document.getElementsByTagName('head')[0].appendChild(@style)

    @style.appendChild(document.createTextNode("@media #{mediaQuery} {.harvey-test{}}"))



class Coin

  active  : no
  is_setup: no


  constructor: (@condition, @setup, @on, @off) ->


  activate: () ->

    return if @active

    unless @is_setup
      @setup?()
      @is_setup = yes

    @on?()
    @active = yes


  deactivate: () ->

    return unless @active

    @off?()
    @active = no



###
  [FIX]/mimic of the matchMedia interface modified to work as a drop-in replacement for Harvey
###
class _mediaQueryList

  constructor: (@media) ->

    @_callbacks = []
    @matches    = @_matches()


  addListener: (listener) ->

    @_callbacks.push(listener)

    # same return value as native addListener method
    undefined


  _process: () ->

    current = @_matches()
    return if @matches is current

    @matches = current
    callback(this) for callback in @_callbacks


  _matches: () ->
    @_get_tester() unless @_tester

    @_tester.innerHTML = '&shy;<style media="' + @media + '">#harvey-mq-test{width:42px;}</style>'
    @_tester.removeChild(@_tester.firstChild)

    @_tester.offsetWidth is 42


  _get_tester: () ->
    @_tester = document.getElementById('harvey-mq-test')
    @_build_tester() unless @_tester


  _build_tester: () ->
    @_tester = document.createElement('div')
    @_tester.id = 'harvey-mq-test'
    @_tester.style.cssText = 'position:absolute;top:-100em'
    document.body.insertBefore(@_tester, document.body.firstChild)

