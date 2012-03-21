utils = SEQ.utils.namespace "SEQ.utils"
  
utils.dateutils =
  ParseDate: (@string) ->
    return @string.replace /^([a-z]{3})( [a-z]{3} \d\d?)(.*)( \d{4})$/i, '$1,$2$4$3'
