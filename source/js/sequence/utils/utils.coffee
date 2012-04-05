window.SEQ ?= {}
window.SEQ.utils ?= {}

#namespace util
SEQ.utils.namespace = (ns_string) ->
  parts = ns_string.split(".")
  parent = SEQ
  i = undefined
  parts = parts.slice(1) if parts[0] is "SEQ"
  i = 0
  while i < parts.length
    parent[parts[i]] = {}  if typeof parent[parts[i]] is "undefined"
    parent = parent[parts[i]]
    i += 1
  return parent


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
