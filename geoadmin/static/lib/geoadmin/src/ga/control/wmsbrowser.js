/*global goog:true, ga:true, ol:true*/

goog.provide('ga.control');
goog.provide('ga.control.WmsBrowser');

goog.require('goog.dom');

goog.require('ol.control.Control');

/**
 * @constructor
 * @extends {ol.control.Control}
 * @param {ol.control.WmsBrowser} wmsBrowserOptions WMS Browser
 *     options.
 */
ga.control.WmsBrowser = function(wmsBrowserOptions) {
    'use strict';
    var element = goog.dom.createDom(goog.dom.TagName.DIV, {
        'class': 'ga-wms-browser'
    });

    goog.base(this, {
        element: element,
        map: wmsBrowserOptions.map,
        target: wmsBrowserOptions.target
    });

};

goog.inherits(ga.control.WmsBrowser, ol.control.Control);

