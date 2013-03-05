/* global goog:true, ol:true */

goog.require('goog.debug.Console');
goog.require('goog.debug.Logger');
goog.require('goog.debug.Logger.Level');

//goog.require('goog.net.XhrIo');

goog.require('ol.parser.ogc.WMTSCapabilities_v1_0_0');

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

    var parser = new ol.parser.ogc.WMTSCapabilities_v1_0_0();
    var url = 'http://wmts.geo.admin.ch/1.0.0/WMTSCapabilities.xml';

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);

    xhr.onload = function() {
        if (xhr.status === 200) {
            var result = parser.read(xhr.responseXML);
            console.log(result);
        }
    };
    xhr.send();

    /*goog.net.XhrIo.send(url, function(e) {
        var xhr, xml, obj, serviceIdentification, serviceProvider, operationsMetadata, contactInfo;

        xhr = e.target;
        xml = xhr.getResponseXml();
        console.log(parser);

        obj = parser.read(xml);
        serviceIdentification = obj.serviceIdentification;
        serviceProvider = obj.serviceProvider;
        operationsMetadata = obj.operationsMetadata;
        contactInfo = serviceProvider.serviceContact.contactInfo;

        console.log(serviceIdentification);
        console.log(serviceProvider);
    });*/
};
