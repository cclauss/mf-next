/**
 * This file contains all require statements for geoadmin namespace
 * It should be used to create an api file with closure-compiler
 */

//control
goog.require('ga.control.WmsBrowser');
//factory
goog.require('ga.factory.olLayer');
//model
goog.require('ga.model.layers');
//ui
goog.require('ga.ui.LayerTree');
//net
goog.require('ga.net.SwissSearch');
goog.require('ga.net.SwissSearch.Event');
goog.require('ga.net.SwissSearch.EventType');
//./
goog.require('ga.defs');
goog.require('ga.Map');

goog.provide('ga');

