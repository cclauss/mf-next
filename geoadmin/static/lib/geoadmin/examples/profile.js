/*globals profile_testData: true */

goog.require('goog.debug.Logger');
goog.require('goog.debug.Console');
goog.require('goog.dom');

goog.require('ga.Map');
goog.require('goog.ui.Dialog');
goog.require('ga.ui.Profile.Dialog');

var testdata = profile_testData;
var map = null;
var buttonEl = null;
var prof = null;

var profileHandler = function () {
    'use strict';
    if (!prof) {
        prof = new ga.ui.Profile.Dialog();
        prof.getModel().updateOutPoints(testdata);
        prof.update();
    }
    if (prof.isVisible()) {
        prof.setVisible(false);
    } else {
        prof.setVisible(true);
    }
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
        target: 'map',
        view: new ol.View2D({
            projection: ga.MapDefs.PROJECTION,
            center: new ol.Coordinate(660000, 190000),
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

