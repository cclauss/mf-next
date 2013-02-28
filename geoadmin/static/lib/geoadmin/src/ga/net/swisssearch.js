/*global goog:true, ga:true, setTimeout: true */
/*jslint indent: 2, nomen: true, vars: true */

goog.provide('ga.net.SwissSearch');
goog.provide('ga.net.SwissSearch.EventType');

goog.require('goog.events');
goog.require('goog.events.EventTarget');

goog.require('ga.Defs');

/**
 * @constructor
 * @extend {goog.events.EventTarget}
 * @export
 */
ga.net.SwissSearch = function () {
  'use strict';
  goog.events.EventTarget.call(this);
};

goog.inherits(ga.net.SwissSearch, goog.events.EventTarget);

/**
 * launch a request
 * @param {string} the query to launch
 * @export
 */
ga.net.SwissSearch.prototype.query = function (queryText) {
  'use strict';
  var that = this;
  queryText = null;
  setTimeout(function () {
    that.dispatchEvent(ga.net.SwissSearch.EventType.DONE);
  }, 1);
};

/**
 * @enum {string}
 * @export
 */
ga.net.SwissSearch.EventType = {
  DONE: goog.events.getUniqueId('done')
};

