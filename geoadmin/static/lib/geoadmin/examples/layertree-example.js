/*global goog:true, ol: true, ga: true */


goog.require('goog.debug.Console');
goog.require('goog.debug.Logger');
goog.require('goog.debug.Logger.Level');
goog.require('goog.dom');
goog.require('ol.Collection');
goog.require('ol.Coordinate');
goog.require('ol.Map');

goog.require('ol.RendererHints');
goog.require('ol.View2D');
goog.require('ol.source.TiledWMS');

goog.require('ga.factory.OLLayer');
goog.require('ga.ui.LayerTree');
goog.require('ga.model.layers');
goog.require('ga.MapProperty');

goog.provide('ga.examples.layertree');

if (goog.DEBUG) {
  goog.debug.Console.autoInstall();
  goog.debug.Logger.getLogger('ol').setLevel(goog.debug.Logger.Level.INFO);
}

ol.Projection.addProjection(ga.MapProperty.PROJECTION);

var get1Layer = function () {
  'use strict';
  return [new ol.layer.TileLayer({
    source: new ol.source.TiledWMS({
      url: 'http://wms.geo.admin.ch/',
      attributions: [new ol.Attribution(
        '&copy; ' +
          '<a href="http://www.geo.admin.ch/internet/geoportal/en/home.html">' +
          'Pixelmap 1:1000000 / geo.admin.ch</a>'
      )],
      params: {
        'LAYERS': 'ch.swisstopo.pixelkarte-farbe-pk1000.noscale',
        'FORMAT': 'image/jpeg'
      },
      projection: ga.MapProperty.PROJECTION,
      extent: ga.MapProperty.PROJECTION.getExtent()
    })
  })];
};


var get2Layers = function () {
  'use strict';
  return get1Layer().concat([new ol.layer.TileLayer({
    source: new ol.source.TiledWMS({
      url: 'http://wms.geo.admin.ch/',
      attributions: [new ol.Attribution(
        '&copy; ' +
          '<a href="http://www.geo.admin.ch/internet/geoportal/en/home.html">' +
          'Pärke nationaler Bedeutung / geo.admin.ch</a>'
      )],
      params: {
        'LAYERS': 'ch.bafu.schutzgebiete-paerke_nationaler_bedeutung'
      },
      projection: ga.MapProperty.PROJECTION,
      extent: ga.MapProperty.PROJECTION.getExtent()
    })
  })]);
};

var map = new ol.Map({
  layers: new ol.Collection(get2Layers()),
  renderers: ol.RendererHints.createFromQueryData(),
  target: 'map',
  view: new ol.View2D({
    projection: ga.MapProperty.PROJECTION,
    center: new ol.Coordinate(660000, 190000),
    zoom: 2
  })
});

var treeConfig = goog.ui.tree.TreeControl.defaultConfig;
treeConfig.map = map;
treeConfig.listdefinition = ga.model.layers;
var layertree = new ga.ui.LayerTree(treeConfig);
layertree.setShowRootNode(false);
var $local = goog.dom.getElement;
layertree.render($local('treeContainer'));
var layerdef = ga.model.layers[1];
layerdef.projection = ga.MapProperty.PROJECTION;
layerdef.extent = ga.MapProperty.PROJECTION.getExtent();
map.getLayers().push(new ga.factory.OLLayer(layerdef));
var removedLayer = map.getLayers().removeAt(1);
map.getLayers().push(removedLayer);


