window.Sequence ?= {}
window.Sequence.Utils ?= {}

# Use local alias
$ = jQuery

window.Sequence.Utils.Platform = 
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

#namespace util
window.Sequence.Utils.Namespace = (ns_string) ->
  parts = ns_string.split(".")
  parent = window.App
  i = undefined
  parts = parts.slice(1)  if parts[0] is "window.App"
  i = 0
  while i < parts.length
    parent[parts[i]] = {}  if typeof parent[parts[i]] is "undefined"
    parent = parent[parts[i]]
    i += 1
  parent

