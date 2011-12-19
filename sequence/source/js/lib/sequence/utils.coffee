window.App ?= {}
window.App.Utils ?= {}

# Use local alias
$ = jQuery

window.App.Utils.Platform = 
  isAndroid: ->
    return navigator.userAgent.toLowerCase().indexOf("android") > -1  
  isiOS: ->
    return navigator.userAgent.toLowerCase().indexOf('like mac os x') > -1  
  isiPhone: ->
    return navigator.userAgent.toLowerCase().indexOf("iphone") > -1;
  isiPad: ->
    return navigator.userAgent.toLowerCase().indexOf("ipad") > -1;
  isRetinaDisplay: ->
    return window.devicePixelRatio >= 2  
  isBlackberry: ->
    return navigator.userAgent.toLowerCase().indexOf("blackberry") > -1  
  isDesktop: () ->
    desktop = true
    if @isAndroid() or @isiOS() or @isBlackberry() 
      desktop = false
    return desktop

# console.log shim

window.log = ->
  log.history = log.history or []
  log.history.push arguments
  if @console
    arguments.callee = arguments.callee.caller
    newarr = [].slice.call(arguments)
    (if typeof console.log is "object" then log.apply.call(console.log, console, newarr) else console.log.apply(console, newarr))

((b) ->
  c = ->
  d = "assert,clear,count,debug,dir,dirxml,error,exception,firebug,group,groupCollapsed,groupEnd,info,log,memoryProfile,memoryProfileEnd,profile,profileEnd,table,time,timeEnd,timeStamp,trace,warn".split(",")
  a = undefined

  while a = d.pop()
    b[a] = b[a] or c
) (->
  try
    console.log()
    return window.console
  catch err
    return window.console = {}
)()