/* global goog:true, ga:true, ol:true */

goog.require('goog.debug.Console');
goog.require('goog.debug.Logger');
goog.require('goog.debug.Logger.Level');

goog.require('goog.dom');
goog.require('goog.ui.Button');

goog.require('ga.Map');

goog.require('ol.parser.ogc.WMSCapabilities');

window.onload = function() {
    'use strict';
    var map;
    if (goog.DEBUG) {
        //install the console as output. There are other possible outputs (as seperate window, for instance)
        var debugConsole = new goog.debug.Console();
        debugConsole.setCapturing(true);
        //configure ga namespace logging level
        goog.debug.Logger.getLogger('ga').setLevel(goog.debug.Logger.Level.ALL);
        //configure ol namespace logging level
        goog.debug.Logger.getLogger('ol').setLevel(goog.debug.Logger.Level.OFF);
        this.logger = goog.debug.Logger.getLogger('wms.browser' + goog.getUid(this));
    }
    map = new ga.Map({
        target: 'map',
        view: new ol.View2D({
            projection: ga.MapDefs.PROJECTION,
            center: new ol.Coordinate(660000, 190000),
            zoom: 1
        })
    });

    var browserDiv = document.getElementById('wmsbrowser');

    var inputUrl = goog.dom.createDom('input', {type: 'text', style: 'width: 200px;', value: 'http://wms.geo.admin.ch/'});

    browserDiv.appendChild(inputUrl);

    var connectButton = new goog.ui.Button('Connect');

    connectButton.render(browserDiv);
    connectButton.inputUrl = inputUrl;

    goog.events.listen(connectButton.getElement(), goog.events.EventType.CLICK,
        function() {
            var parser = new ol.parser.ogc.WMSCapabilities(), result;
            var url = connectButton.inputUrl.value + '?REQUEST=GetCapabilities&SERVICE=WMS&VERSION=1.3.0';

            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);

            /**
             * onload handler for the XHR request.
             */
            xhr.onload = function() {
                if (xhr.status === 200) {
                    result = parser.read(xhr.responseXML);
                    var layerCount = 0;
                    for (var i = 0, len = result.capability.layers.length; i < len; i += 1) {
                        if ('name' in result.capability.layers[i]) {
                            layerCount += 1;
                        }
                    }
                    alert(layerCount + ' layers loaded');
                }
            };
            xhr.send();
        }, false, connectButton);


};

