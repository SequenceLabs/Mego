SEQ.utils.namespace('SEQ.utils.browser')

class SEQ.utils.browser.CSS3Detection
  
  prefixes = ["", "Webkit", "Moz", "O", "ms", "Khtml"]
    
  @GetProp = (prop) ->  
    for prefix in prefixes
      p = "#{prefix}#{prop}"
      return p if document.body.style[p]?

  @GetVendorPrefix = (prop) ->
    for prefix in prefixes
      return "-#{prefix}-" if document.body.style["#{prefix}#{prop}"]?


SEQ.utils.browser.platform =
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