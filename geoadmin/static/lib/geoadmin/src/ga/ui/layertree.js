/*global goog:true, ga:true */
/*jslint nomen: true, vars: true */

goog.provide('ga.ui.LayerTree');

goog.require('goog.ui.tree.TreeControl');

/**
 * @constructor
 * @extends {goog.ui.tree.TreeControl}
 * @param {options.map} openlayers map instance
 * @param {options.listdefinition} pre-defined list of layers to display
 * @export
 */

ga.ui.LayerTree = function (treeConfig) {
    'use strict';
    goog.ui.tree.TreeControl.call(this, 'root', treeConfig);
    /**
     * @private
     * @type {ol.Map}
     */
    this.map_ = treeConfig.map;

    /*
     * @private
     * @type {ga.layers.list}
     * */
    this.listdefinition_ = treeConfig.listdefinition;

    this.initList();
};

goog.inherits(ga.ui.LayerTree, goog.ui.tree.TreeControl);

/**
 * @create tree based on list definitions
 */
ga.ui.LayerTree.prototype.initList = function () {
    'use strict';
    var i;

    //actually, we don't have a tree, but just a flat list...
    for (i = 0; i < this.listdefinition_.length; i += 1) {
        var cdef = this.listdefinition_[i];
        var child = this.getTree().createNode(cdef.name);
        this.add(child);
    }

};


