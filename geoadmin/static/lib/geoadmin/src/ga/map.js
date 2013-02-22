/*global goog:true, ga:true, ol:true */
/*jslint indent: 2, nomen: true, vars: true */

goog.provide('ga.Map');

goog.require('ol.Map');

goog.require('ga.factory.OLLayer');
goog.require('ga.model.layers');

ga.MapDefs = {
  PROJECTION: new ol.Projection('EPSG:21781', ol.ProjectionUnits.METERS,
                                new ol.Extent(485869.5728, 76443.1884, 837076.5648, 299941.7864))
};

ga.MapGlobals = {
  projectionAdded: false
};

/**
 * @constructor
 * @extends {ol.Map}
 * @export
 */
ga.Map = function (mapOptions) {
  'use strict';
  if (!ga.MapGlobals.projectionAdded) {
    ol.Projection.addProjection(ga.MapDefs.PROJECTION);
    ga.MapGlobals.projectionAdded = true;
  }
  
  ol.Map.call(this, ga.Map.createOLMapOptions_(mapOptions));


};

goog.inherits(ga.Map, ol.Map);

/**
 * Adding a layer to the map based on a layer definition found in ga.model.layers
 * @export
 */
ga.Map.prototype.addLayerWithDef = function (layerdef) {
  'use strict';
  layerdef.projection = ga.MapDefs.PROJECTION;
  layerdef.extent = ga.MapDefs.PROJECTION.getExtent();
  var olLayer = new ga.factory.OLLayer(layerdef);
  this.getLayers().push(olLayer);
};


//STATIC FUNCTIONS
ga.Map.createOLMapOptions_ = function (mapOptions) {
  'use strict';

  var olMapOptions = mapOptions || {};

  if (!olMapOptions.renderers &&
      !goog.isDefAndNotNull(olMapOptions.renderers)) {
    olMapOptions.renderers = ol.RendererHints.createFromQueryData();
  }

  if (!olMapOptions.view &&
      !goog.isDef(olMapOptions.view)) {
    olMapOptions.view = new ol.View2D({
      projection: ga.MapDefs.PROJECTION,
      center: new ol.Coordinate(660000, 190000),
      zoom: 2
    });
  }

  //we make sure that we have at least one layer loaded
  if (!olMapOptions.layers &&
      !goog.isDefAndNotNull(olMapOptions.layers)) {
    //don't use addLayer...functions here
    var layerdef = ga.model.layers[0];
    layerdef.projection = ga.MapDefs.PROJECTION;
    layerdef.extent = ga.MapDefs.PROJECTION.getExtent();
    var olLayer = new ga.factory.OLLayer(layerdef);
    olMapOptions.layers = new ol.Collection([olLayer]);
  }

  return olMapOptions;
};
