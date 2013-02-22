/*global goog:true, ga:true, ol:true */
/*jslint indent: 2, nomen: true, vars: true */

goog.provide('ga.Map');
goog.provide('ga.MapProperty');

goog.require('ol.Projection');
goog.require('ol.RendererHints');
goog.require('ol.Map');
goog.require('ol.Coordinate');
goog.require('ol.View2D');

/**
 * @export
 */
ga.MapProperty = {
  PROJECTION: new ol.Projection('EPSG:21781', ol.ProjectionUnits.METERS,
                                new ol.Extent(485869.5728, 76443.1884, 837076.5648, 299941.7864)),
  projectionAdded_: false
};

/**
 * @constructor
 * @extends {ol.Map}
 * @export
 */
ga.Map = function (mapOptions) {
  'use strict';
  if (!ga.MapProperty.projectionAdded_) {
    ol.Projection.addProjection(ga.MapProperty.PROJECTION);
    ga.MapProperty.projectionAdded_ = true;
  }
  
  ol.Map.call(this, ga.Map.createOLMapOptions_(mapOptions));


};

goog.inherits(ga.Map, ol.Map);


//STATIC FUNCTIONS
ga.Map.createOLMapOptions_ = function (mapOptions) {
  'use strict';

  var olMapOptions = mapOptions;

  if (!olMapOptions.renderers &&
      !goog.isDefAndNotNull(olMapOptions.renderers)) {
    olMapOptions.renderers = ol.RendererHints.createFromQueryData();
  }
/*
  if (!olMapOptions.layers) {
    olMapOptions.layers = undefined;
  }
*/
  if (!olMapOptions.view &&
      !goog.isDef(olMapOptions.view)) {
    olMapOptions.view = new ol.View2D({
      projection: ga.MapProperty.PROJECTION,
      center: new ol.Coordinate(660000, 190000),
      zoom: 2
    });
  }

  return olMapOptions;
};
