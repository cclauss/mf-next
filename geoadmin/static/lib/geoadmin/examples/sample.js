
goog.require('goog.debug.Console');
goog.require('goog.debug.Logger');
goog.require('goog.debug.Logger.Level');

goog.require('ga.model.layers');
goog.require('ga.Map');

goog.provide('ga.examples.sample');

window.onload = function() {
    'use strict';

    if (goog.DEBUG) {
        //install the console as output. There are other possible outputs (as seperate window, for instance)
        var debugConsole = new goog.debug.Console();
        debugConsole.setCapturing(true);
        //configure ga namespace logging level
        goog.debug.Logger.getLogger('ga').setLevel(goog.debug.Logger.Level.ALL);
        //configure ol namespace logging level
        goog.debug.Logger.getLogger('ol').setLevel(goog.debug.Logger.Level.OFF);
    }

    var map = new ga.Map({
        target: 'map'
    });

    map.addLayerWithDef(ga.model.layers[5]);
    map.addLayerWithDef(ga.model.layers[6]);
    map.addLayerWithDef(ga.model.layers[1]);
    map.addLayerWithDef(ga.model.layers[3]);
    map.addLayerWithDef(ga.model.layers[4]);
};

