/*global goog:true, ga:true, ol:true */
/*jslint indent: 2, nomen: true, vars: true */

goog.provide('ga.Map');
goog.provide('ga.MapProperty');

goog.require('ol.Projection');

ga.MapProperty = {
  PROJECTION: new ol.Projection('EPSG:21781', ol.ProjectionUnits.METERS,
                                new ol.Extent(485869.5728, 76443.1884, 837076.5648, 299941.7864))
};

