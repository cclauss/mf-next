/*global goog:true */
/*jslint indent: 2, nomen: true, vars: true */

/**
 * This file contains all require statements for geoadmin namespace
 * It should be used to create an api file with closure-compiler
 */

//factory
goog.require('ga.factory.olLayer');
//model
goog.require('ga.model.layers');
//ui
goog.require('ga.ui.LayerTree');
//net
goog.require('ga.net.SwissSearch.EventType');
goog.require('ga.net.SwissSearch');
//./
goog.require('ga.Defs');
goog.require('ga.Map');


//root namespace
goog.provide('ga');



