/*global goog: true, ga: true */

goog.provide('ga.model.layers');

/** @export */
ga.model.layers = [{
    name: 'National map 1000',
    technicalname: 'ch.swisstopo.pixelkarte-farbe-pk1000.noscale',
    layertype: 'wms'
}, {
    name: 'National parks',
    technicalname: 'ch.bafu.schutzgebiete-paerke_nationaler_bedeutung',
    layertype: 'wms'
}, {
    name: 'National maps',
    technicalname: 'ch.swisstopo.pixelkarte-farbe',
    layertype: 'wmts',
    formatExtension: 'jpeg'
}];



