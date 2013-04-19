
goog.provide('ga.factory');
goog.provide('ga.factory.olLayer');

goog.require('ol.source.SingleImageWMS');
goog.require('ol.layer.ImageLayer');
goog.require('ol.layer.TileLayer');
goog.require('ol.source.WMTS');
goog.require('ol.tilegrid.WMTS');

goog.require('goog.debug.Logger');

ga.factory.olLayer = function (options) {
    'use strict';
    if (goog.DEBUG) {
        goog.debug.Logger.getLogger('ga.factory.olLayer').info('Creating one openlayers layer');
    }
    if (options.layertype === 'wms') {
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
                resolutions: options.resolutions,
                extent: options.extent,
                ratio: 1,
                crossOrigin: 'anonymous'
            })
        });
    } else if (options.layertype === 'wmts') {
        return new ol.layer.TileLayer({
            source: new ol.source.WMTS({
                url: 'https://wmts{1-4}.geo.admin.ch/1.0.0/{Layer}/{style}/{Time}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.'+options.formatExtension,
                requestEncoding: 'REST',
                layer: options.technicalname,
                matrixSet: '21781',
                format: 'image/' + options.formatExtension,
                projection: options.projection,
                dimensions: {
                    'Time': options.timestamp
                },
                tileGrid: new ol.tilegrid.WMTS({
                    origin: options.extent.getTopLeft(),
                    resolutions: [4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250, 1000, 750, 650.0, 500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0 ,2.5, 2.0, 1.5, 1.0, 0.5],
                    matrixIds: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26]
                }),
                style: 'default',
                extent: options.extent,
                crossOrigin: 'anonymous'
            })
        });
    } else {
        // TODO: Throw an error with unsupported layer type
        alert('unsupported layer type');
    }
};



