/**
 * This file contains all require statements for geoadmin namespace
 * It should be used to create an api file with closure-compiler
 */

//control
goog.require('ga.control.WmsBrowser');
goog.require('ga.control.Profile');
//factory
goog.require('ga.factory.olLayer');
//model
goog.require('ga.model.layers');
goog.require('ga.model.Profile');
goog.require('ga.model.ProfilePoint');
//ui
goog.require('ga.ui.LayerTree');
goog.require('ga.ui.Profile');
goog.require('ga.ui.Profile.Dialog');
goog.require('ga.ui.Profile.Graphics');
//net
goog.require('ga.net.SwissSearch');
goog.require('ga.net.SwissSearch.Event');
goog.require('ga.net.SwissSearch.EventType');
goog.require('ga.net.Profile');
goog.require('ga.net.Profile.Event');
goog.require('ga.net.Profile.EventType');
//./
goog.require('ga.defs');
goog.require('ga.Map');

goog.provide('ga');

