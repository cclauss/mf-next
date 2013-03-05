/*global goog:true, ol: true, ga: true */


goog.require('goog.debug.Console');
goog.require('goog.debug.Logger');
goog.require('goog.debug.Logger.Level');
goog.require('goog.dom');

goog.require('ol.Attribution');
goog.require('ol.Collection');
goog.require('ol.Coordinate');
goog.require('ol.Extent');
goog.require('ol.Map');
goog.require('ol.Projection');
goog.require('ol.ProjectionUnits');
goog.require('ol.RendererHints');
goog.require('ol.View2D');
goog.require('ol.layer.ImageLayer');
goog.require('ol.layer.TileLayer');
goog.require('ol.source.SingleImageWMS');
goog.require('ol.source.TiledWMS');

goog.require('ga.factory.olLayer');
goog.require('ga.ui.LayerTree');
goog.require('ga.model.layers');

goog.provide('ga.examples.sample');

window.onload = function() {
    'use strict';

    if (goog.DEBUG) {
        //install the console as output. There are other possible outputs (as seperate window, for instance)
        var debugConsole = new goog.debug.Console();
        debugConsole.setCapturing(true);
        //configure ga namespace logging level
        goog.debug.Logger.getLogger('ga').setLevel(goog.debug.Logger.Level.ALL);
        //configure ol namespace logging level
        goog.debug.Logger.getLogger('ol').setLevel(goog.debug.Logger.Level.OFF);
    }

    var myProjection = new ol.Projection('EPSG:21781', ol.ProjectionUnits.METERS,
      new ol.Extent(485869.5728, 76443.1884, 837076.5648, 299941.7864));

    ol.Projection.addProjection(myProjection);

    var get1Layer = function () {
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
                projection: myProjection,
                extent: myProjection.getExtent()
            })
        })];
    };


    var get2Layers = function () {
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
                projection: myProjection,
                extent: myProjection.getExtent()
            })
        })]);
    };

    var map = new ol.Map({
        layers: new ol.Collection(get2Layers()),
        renderers: ol.RendererHints.createFromQueryData(),
        target: 'map',
        view: new ol.View2D({
            projection: myProjection,
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
    layerdef.projection = myProjection;
    layerdef.extent = myProjection.getExtent();
    map.getLayers().push(ga.factory.olLayer(layerdef));
    var removedLayer = map.getLayers().removeAt(1);
    map.getLayers().push(removedLayer);

};

