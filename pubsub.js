/**
 * This is a pub/sub module that allows objects to broadcast (publish) events and have functions (callbacks)
 * subscribe to these events via the "on" method. Add callback function to eventName array.
 * When broadcast happens, call the functions
 *
 * As it relates to pub/sub: broadcast is pub and on is sub
 *
 * @example
 * Note the "args" is one argument, to get all args, use arguments
 * let subscriber = broadcaster.on('change', function(event, args) {
 *      //do something
 * });
 *
 * broadcaster.broadcast('change', ratingInstance);
 *
 * and at a later point to remove...
 * subscriber.remove();
 *
 * let subscriber = broadcaster.on('change', function(event, args) {
 *      //do something
 * });
 *
 * broadcaster.broadcast('change', ratingInstance);
 *
 * and at a later point to remove...
 * subscriber.remove();
 *
 * @type {{broadcast, on}}
 */

'use strict';

const broadcaster = (function(){
  const listeners = {}; //i.e. listeners[event] = [];

  /**
   * "pub"
   * @description Call anyone that is listening for this event. When broadcast is called, loop through all
   * listeners and call their corresponding listener function.
   * @param {String} eventName the name of the event to broadcast
   * @param {*} args the arguments to pass into the callback function
   */
  function broadcast(eventName, args) {
    const eventListeners = listeners[eventName];
    //can have any number of arguments that we want to send to the callback
    //so arguments 1 through n is what needs to be passed in
    const callbackArgs = getCallbackArguments(arguments);
    callbackArgs.unshift({name:eventName});
    if (eventListeners) {
      for (let i = 0, length = eventListeners.length; i < length; i++) {
        eventListeners[i].apply(null, callbackArgs);
      }
    }
  }

  /**
   * @description Create a new array as optimization of slice is not the best.
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments
   * Want to allow our broadcast method to take any number of arguments.
   * Skip the first element of the array as this is the name of the event.
   * @param {Array} args the arguments passed into the broadcast function
   * @return {Array} an array or arguments to pass into the callback function
   */
  function getCallbackArguments(args) {
    const argsCopy = [];
    //skip first element as that is the eventName
    for (let i = 1, length=args.length; i < length; i++) {
      argsCopy.push(args[i]);
    }
    return argsCopy;
  }

  /**
   * @description add the listener to the array of listeners mapped to this event. Return an object with
   * a remove function that will remove this listener from the list.
   * @param {String} eventName the name of the event to subscribe to
   * @param {Function }listener the listener (callback) function for the event
   * @return {{remove: Function}} An object with a remove function, that when called will remove the listener from the list
   */
  function on(eventName, listener) {
    listeners[eventName] = listeners[eventName] || [];
    const index = listeners[eventName].push(listener) - 1;
    return {
      remove:function() {
        //remove 1 element from the point in the array matching this function
        //which exists at the "index"
        listeners[eventName].splice(index, 1);
      }
    }
  }

  return {
    broadcast,
    on
  }
}());
