/*global goog:true, ga: true */


goog.require('goog.debug.Console');
goog.require('goog.debug.Logger');
goog.require('goog.debug.Logger.Level');

goog.require('ga.Map');

window.onload = function() {
  'use strict';

  var map = new ga.Map({
    target: 'map'
  });
  map.getLayers();
};

