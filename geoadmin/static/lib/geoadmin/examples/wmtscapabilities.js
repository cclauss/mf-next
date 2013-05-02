/* global goog:true, ol:true */

goog.require('goog.debug.Console');
goog.require('goog.debug.Logger');
goog.require('goog.debug.Logger.Level');

goog.require('goog.net.XhrIo');

goog.require('ol.parser.ogc.WMTSCapabilities');

window.onload = function() {
    'use strict';
    var debugConsole, extent, projection, parser, url;

    if (goog.DEBUG) {
        //install the console as output. There are other possible outputs (as seperate window, for instance)
        debugConsole = new goog.debug.Console();
        debugConsole.setCapturing(true);
        //configure ga namespace logging level
        goog.debug.Logger.getLogger('ga').setLevel(goog.debug.Logger.Level.ALL);
        //configure ol namespace logging level
        goog.debug.Logger.getLogger('ol').setLevel(goog.debug.Logger.Level.OFF);
    }

    extent = [485869.5728, 837076.5648, 76443.1884, 299941.7864];
    projection = new ol.Projection('EPSG:21781', ol.ProjectionUnits.METERS, extent);
    ol.projection.addProjection(projection);

    parser = new ol.parser.ogc.WMTSCapabilities();
    url = 'http://wmts.geo.admin.ch/1.0.0/WMTSCapabilities.xml';

    goog.net.XhrIo.send(url, function(e) {
        var xhr, xml, obj, serviceIdentification, serviceProvider, contactInfo, html, layers;

        xhr = e.target;
        xml = xhr.getResponseXml();

        obj = parser.read(xml);
        serviceIdentification = obj.serviceIdentification;
        serviceProvider = obj.serviceProvider;
        contactInfo = serviceProvider.serviceContact.contactInfo;
        layers = obj.contents.layers;

        html = '<a>Title: ' + serviceIdentification.title + '</a><br>';
        html += '<a>Abstract: ' + serviceIdentification.abstract + '</a><br>';
        html += '<a>Provider Name: ' + serviceProvider.providerName + '</a><br>';
        html += '<a>Provider Site: ' + serviceProvider.providerSite + '</a><br>';

        for (var i = 0; i<layers.length; i+=1) {
            html += '<a>' + layers[i].identifier + '</a><br>';
        }

        document.getElementById('wmtscapabilities').innerHTML = html;
    });
};
