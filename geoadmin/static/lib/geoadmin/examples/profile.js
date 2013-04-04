
goog.require('goog.debug.Logger');
goog.require('goog.debug.Console');
goog.require('goog.dom');

goog.require('ga.Map');
goog.require('ga.control.Profile');

var map = null;
var buttonEl = null;
var prof = null;

var profileHandler = function () {
    'use strict';
    if (!prof) {
        prof = new ga.control.Profile({'map': map});
    }
    prof.toggleActive();
};

window.onload = function() {
    'use strict';
    if (goog.DEBUG) {
        var debugConsole = new goog.debug.Console();
        debugConsole.setCapturing(true);
        goog.debug.Logger.getLogger('ga').setLevel(goog.debug.Logger.Level.ALL);
        goog.debug.Logger.getLogger('ol').setLevel(goog.debug.Logger.Level.OFF);
    }
    map = new ga.Map({
        //TODO: as vector layer is only supported in CANVAS right now (webgl renderer not done yet)
        renderer: ol.RendererHint.CANVAS,
        target: 'map',
        view: new ol.View2D({
            projection: ga.MapDefs.PROJECTION,
            center: [660000, 190000],
            zoom: 1
        })
    });

    //attaching action to activate button
    buttonEl = document.getElementById('button');
    if (!buttonEl) {
        alert('missing button element in html page. Please correct');
    } else {
        buttonEl.onclick = profileHandler;
    }
};

