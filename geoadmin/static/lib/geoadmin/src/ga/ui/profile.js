
goog.provide('ga.ui.Profile');
goog.provide('ga.ui.Profile.Dialog');
//TODO: probably move into seperate file, because it could be used elsewhere too
goog.provide('ga.ui.Profile.Graphics');

goog.require('ga.model.Profile');

goog.require('goog.ui.Dialog');
goog.require('goog.graphics');
goog.require('goog.array');

/**
 * @constructor
 * @extends {goog.ui.Dialog}
 * @param opt_domHelper 
 */
ga.ui.Profile.Dialog = function (opt_domHelper, model) {
    'use strict';
    goog.ui.Dialog.call(this, 'profile-dialog', undefined, opt_domHelper);

    this.setTitle('This is your profile!');
    this.setModal(false);

    this.setModel(model);
    this.graphics_ = new ga.ui.Profile.Graphics(this.getModel());
    this.addChild(this.graphics_.getComponent(), true);
};

goog.inherits(ga.ui.Profile.Dialog, goog.ui.Dialog);

ga.ui.Profile.Dialog.prototype.update = function (model) {
    'use strict';
    this.graphics_.draw(model);
};


/*
 * Simple container to hold a goog.graphics.AbstractGraphics which is
 * attached to parent domHelper
 * Component should always be independant of parent in order for it
 * to be able to be attached to any component/container
 * @constructor
 * @param {goog.dom.DomHelper} domHelper The DOM helper object for the
 *      document we want to render in.
 */
ga.ui.Profile.Graphics = function () {
    'use strict';
    this.width_ = 600;
    this.height_ = 200;
    this.canvas_ = goog.graphics.createGraphics(this.width_, this.height_, this.width_, this.height_);
};

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

    var stroke = new goog.graphics.Stroke(50, 'red');
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
