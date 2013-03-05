/* global goog:true, ol:true */

goog.require('goog.debug.Console');
goog.require('goog.debug.Logger');
goog.require('goog.debug.Logger.Level');

goog.require('goog.net.XhrIo');

goog.require('ol.parser.ogc.WMTSCapabilities_v1_0_0');

window.onload = function() {
    'use strict';

    var parser = new ol.parser.ogc.WMTSCapabilities_v1_0_0();
    var url = 'http://wmts.geo.admin.ch/1.0.0/WMTSCapabilities.xml';

    goog.net.XhrIo.send(url, function(e) {
        var xhr, obj, serviceIdentification, serviceProvider, operationsMetadata, contactInfo;
        xhr = e.target;
        obj = parser.read(xhr.getResponseXml());
        serviceIdentification = obj.serviceIdentification;
        serviceProvider = obj.serviceProvider;
        operationsMetadata = obj.operationsMetadata;
        contactInfo = serviceProvider.serviceContact.contactInfo;

        console.log(serviceIdentification);
        console.log(serviceProvider);
    });
};
