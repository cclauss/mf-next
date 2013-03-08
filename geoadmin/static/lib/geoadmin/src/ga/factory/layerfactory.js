/*global goog:true, ga:true, ol:true*/

goog.provide('ga.factory.olLayer');

goog.require('ol.source.SingleImageWMS');
goog.require('ol.layer.ImageLayer');

goog.require('goog.debug.Logger');

/** @export */
ga.factory.olLayer = function (options) {
    'use strict';
    if (goog.DEBUG) {
        goog.debug.Logger.getLogger('ga.factory.olLayer').info('Creating one openlayers layer');
    }
    return new ol.layer.ImageLayer({
        source: new ol.source.SingleImageWMS({
            url: 'http://wms.geo.admin.ch',
            attributions: [new ol.Attribution(
            '&copy; ' +
                '<a href="http://www.geo.admin.ch/internet/geoportal/en/home.html">' +
                options.name + ' / geo.admin.ch</a>'
            )],
            params: {
                'LAYERS': options.technicalname
            },
            projection: options.projection,
            extent: options.extent,
            ratio: 1
        })
    });
};


