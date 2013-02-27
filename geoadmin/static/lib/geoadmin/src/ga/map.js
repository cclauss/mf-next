/*global goog:true, ga:true, ol:true */
/*jslint indent: 2, nomen: true, vars: true */

/**
 * @fileoverview ga.Map contains the geoadmin Map class and additional definitions concerning this map
 * @author gilbert.jeiziner@swisstopo.ch
 */

goog.provide('ga.Map');

goog.require('goog.debug.Logger');

goog.require('ol.Map');

goog.require('ga.factory.olLayer');
goog.require('ga.model.layers');

ga.MapDefs = {
  PROJECTION: new ol.Projection('EPSG:21781', ol.ProjectionUnits.METERS,
                                new ol.Extent(485869.5728, 76443.1884, 837076.5648, 299941.7864))
};

ga.MapGlobals = {
  projectionAdded: false
};

/**
 * Create a new map
 * @constructor
 * @extends {ol.Map}
 * @export
 */
ga.Map = function (mapOptions) {
  'use strict';
  ol.Map.call(this, ga.Map.createOLMapOptions_(mapOptions));

  /**
   * Info regarding loggers:: we define an object logger. We could also define a class
   * logger using ga.Map.prototype.logger below.
   * What we do here effectively replaces the ol.map.logger, but ol.map log messages
   * will still appear through this logger.
   * Downside: you can't filter out ol.map messages separately.If we want that,
   * we have to name this logger variable differently.
   * In the closure book, they recommend defining loggers in the prototype.
   * ol3 defines them in the constructor.
   */
  if (goog.DEBUG) {
    this.logger = goog.debug.Logger.getLogger('ga.map.' + goog.getUid(this));
    this.logger.info('creating map with uid ' + goog.getUid(this));
  }

  if (!ga.MapGlobals.projectionAdded) {
    ol.Projection.addProjection(ga.MapDefs.PROJECTION);
    ga.MapGlobals.projectionAdded = true;
  }
  
 
};

goog.inherits(ga.Map, ol.Map);

/**
 * Adding a layer to the map based on a layer definition found in ga.model.layers
 * @export
 */
ga.Map.prototype.addLayerWithDef = function (layerdef) {
  'use strict';
  if (goog.DEBUG) {
    this.logger.info('adding layer to map with addLayerWithDef');
  }
  layerdef.projection = ga.MapDefs.PROJECTION;
  layerdef.extent = ga.MapDefs.PROJECTION.getExtent();
  var olLayer = ga.factory.olLayer(layerdef);
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
    var olLayer = ga.factory.olLayer(layerdef);
    olMapOptions.layers = new ol.Collection([olLayer]);
  }

  return olMapOptions;
};
