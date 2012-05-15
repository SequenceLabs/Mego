"use strict"

class EventDispatcher
  
  constructor: () ->
    @eventHashTable = {}

  addEventListener: (eventType, func) =>
    @eventHashTable[eventType] = []  if @eventHashTable[eventType] is `undefined`
    @eventHashTable[eventType].push func  if @eventHashTable[eventType].indexOf(func) is -1

  removeEventListener: (eventType, func) =>
    return false  if @eventHashTable[eventType] is `undefined`
    @eventHashTable[eventType].splice @eventHashTable[eventType].indexOf(func), 1  if @eventHashTable[eventType].indexOf(func) > -1
    true

  dispatchEvent: (eventObject) =>
    a = @eventHashTable[eventObject.eventType]
    return false  if a is `undefined` or a.constructor isnt Array
    i = 0

    while i < a.length
      a[i] eventObject
      i++
      
  Array::indexOf = (value) ->
    i = 0

    while i < @length
      return i  if this[i] is value
      i++
    -1