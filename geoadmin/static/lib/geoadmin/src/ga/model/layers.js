
goog.provide('ga.model');
goog.provide('ga.model.layers');

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
    timestamp: '20130213',
    layertype: 'wmts',
    formatExtension: 'jpeg'
}, {
    name: 'Antennen UMTS',
    technicalname: 'ch.bakom.mobil-antennenstandorte-umts',
    layertype: 'wms'
}, {
    name: 'Antennen LTE',
    technicalname: 'ch.bakom.mobil-antennenstandorte-lte',
    layertype: 'wms'
}, {
    name: 'Wohnungs Register WMTS',
    technicalname: 'ch.bfs.gebaeude_wohnungs_register',
    layertype: 'wmts',
    timestamp: '20130212',
    formatExtension: 'png'
}, {
    name: 'Wasserkraft',
    technicalname: 'ch.bfe.kleinwasserkraftpotentiale',
    layertype: 'wmts',
    timestamp: '20120531',
    formatExtension: 'png'
}, {
    name: 'Smaragd',
    technicalname: 'ch.bafu.schutzgebiete-smaragd',
    layertype: 'wmts',
    timestamp: '20120312',
    formatExtension: 'png'
}, {
    name: 'UNESCO',
    technicalname: 'ch.bak.schutzgebiete-unesco_weltkulturerbe',
    layertype: 'wmts',
    timestamp: '20120203',
    formatExtension: 'png'

}];



