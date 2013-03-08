/*global goog:true, ga:true*/

goog.provide('ga.control.WmsBrowser');

goog.require('goog.dom');

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
goog.inherits(ga.control.WmsBrowser, ga.control.Control);

