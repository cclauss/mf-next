/*global goog:true, ol:true*/


goog.require('goog.debug.Console');
goog.require('goog.debug.Logger');
goog.require('goog.debug.Logger.Level');

goog.require('ol.parser.ogc.WMSCapabilities');

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
        this.logger = goog.debug.Logger.getLogger('wms.test' + goog.getUid(this));
    }
    var parser = new ol.parser.ogc.WMSCapabilities(), result;
    var url = 'http://wms.geo.admin.ch/?REQUEST=GetCapabilities&SERVICE=WMS&VERSION=1.3.0&lang=de';

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);

    /**
     * onload handler for the XHR request.
     */
    xhr.onload = function() {
        if (xhr.status === 200) {
            result = parser.read(xhr.responseXML);
            document.getElementById('log').innerHTML =
              window.JSON.stringify(result, undefined, 2);
        }
    };
    xhr.send();

};

