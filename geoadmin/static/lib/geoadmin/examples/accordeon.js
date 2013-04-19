
goog.require('goog.debug.Logger');
goog.require('goog.debug.Console');
goog.require('goog.dom');

goog.require('ga.Map');
goog.require('ga.ui.Accordeon');

var map = null;
var accordeon = null;

window.onload = function() {
    'use strict';
    if (goog.DEBUG) {
        var debugConsole = new goog.debug.Console();
        debugConsole.setCapturing(true);
        goog.debug.Logger.getLogger('ga').setLevel(goog.debug.Logger.Level.ALL);
        goog.debug.Logger.getLogger('ol').setLevel(goog.debug.Logger.Level.OFF);
    }
    map = new ga.Map({
        target: 'map'
    });

    accordeon = new ga.ui.Accordeon();
    accordeon.render();
};

