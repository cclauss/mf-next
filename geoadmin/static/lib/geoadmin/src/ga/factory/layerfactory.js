/*global goog:true, ga:true, ol:true*/
/*jslint indent: 2 */

goog.provide('ga.factory.OLLayer');

goog.require('ol.source.TiledWMS');

/** @export */
ga.factory.OLLayer = function (options) {
  'use strict';
  return new ol.layer.TileLayer({
    source: new ol.source.TiledWMS({
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
      extent: options.extent
    })
  });
};


