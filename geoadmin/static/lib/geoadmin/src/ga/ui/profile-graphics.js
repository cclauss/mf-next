
goog.provide('ga.ui.Profile');
goog.provide('ga.ui.Profile.Graphics');

goog.require('ga.model.Profile');

goog.require('goog.ui.Control');
goog.require('goog.graphics');
goog.require('goog.array');

/*
 * Simple container to hold a goog.graphics.AbstractGraphics which is
 * attached to parent domHelper
 * Component should always be independant of parent in order for it
 * to be able to be attached to any component/container
 * @constructor
 * @extends {goog.ui.Control}
 * @param {goog.dom.DomHelper} domHelper The DOM helper object for the
 *      document we want to render in.
 */
ga.ui.Profile.Graphics = function () {
    'use strict';
    goog.ui.Control.call(this, null);
    this.width_ = '100%';
    this.height_ = '100%';
    this.canvas_ = goog.graphics.createGraphics(this.width_, this.height_, this.width_, this.height_);
    this.addChild(this.canvas_, true);
};

goog.inherits(ga.ui.Profile.Graphics, goog.ui.Control);

ga.ui.Profile.Graphics.prototype.getComponent = function () {
    'use strict';
    return this.canvas_;
};

ga.ui.Profile.Graphics.prototype.draw = function (model) {
    'use strict';
    var mod = model,
        canv = this.canvas_;

    //delete everything
    canv.clear();

    //set the extends in the canvas
    canv.setCoordOrigin(mod.boundingRect().left, mod.boundingRect().top);
    canv.setCoordSize(mod.boundingRect().width, mod.boundingRect().height);

    var stroke = new goog.graphics.Stroke(50, 'white');
    var path = new goog.graphics.Path();
    var init = false;
    goog.array.map(mod.outPoints(), function (point) {
        if (!init) {
            path.moveTo(point.dh_.x, point.dh_.y);
            init = true;
        } else {
            path.lineTo(point.dh_.x, point.dh_.y);
        }
    });

    //var el = canv.drawPath(path, stroke, null);
    canv.drawPath(path, stroke, null);

    //simple path of profile points
};
