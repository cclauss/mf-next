
goog.provide('ga.ui.Profile');
goog.provide('ga.ui.Profile.Graphics');
goog.provide('ga.ui.Profile.GraphicsEvent');

goog.require('ga.model.Profile');

goog.require('goog.ui.Control');
goog.require('goog.graphics');
goog.require('goog.array');
goog.require('goog.events.Event');

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
    //reference to model. TODO: maybe work with events here instead of accessing
    //this direclty...
    this.model_ = null;
    this.width_ = '100%';
    this.height_ = '100%';
    this.info_ = null;
    this.canvas_ = goog.graphics.createGraphics(this.width_, this.height_, this.width_, this.height_);
    this.addChild(this.canvas_, true);
};

goog.inherits(ga.ui.Profile.Graphics, goog.ui.Control);

ga.ui.Profile.Graphics.prototype.createDom = function () {
    'use strict';

    ga.ui.Profile.Graphics.superClass_.createDom.call(this);

    this.info_ = goog.dom.createDom(goog.dom.TagName.DIV, {
        'class': 'ga-ui-graphics-info'
    });

    goog.dom.appendChild(this.getElement(), this.info_);

    this.updateInfo('Click on the map to start drawing your profile. Double click to create Profile.');


};

ga.ui.Profile.Graphics.prototype.enterDocument = function () {
    'use strict';
    ga.ui.Profile.Graphics.superClass_.enterDocument.call(this);

    //add event handlers here
    var handler = this.getHandler();
    handler.listen(this.canvas_.getElement(), goog.events.EventType.MOUSEMOVE, this.handleMouseMove, false, this);
};

ga.ui.Profile.Graphics.prototype.getComponent = function () {
    'use strict';
    return this.canvas_;
};

ga.ui.Profile.Graphics.prototype.handleMouseMove = function (evt) {
    'use strict';
    var eventPosition = null;
    if (!isNaN(this.canvas_.getPixelScaleX()) &&
        this.model_) {
        var can = this.canvas_;
        eventPosition = goog.style.getRelativePosition(evt, can.getElement());
        var x = can.getCoordOrigin().x + (eventPosition.x / can.getPixelScaleX());
        var nPoint = this.model_.lookupNearestOutPoint(x);
        if (this.info_) {
            this.updateInfo(Math.floor(-nPoint.dh_.y) + ' [m]');
            this.info_.style.top = eventPosition.y - 20 + 'px';
            this.info_.style.left = eventPosition.x + 'px';
        }
        this.dispatchEvent(new ga.ui.Profile.GraphicsEvent('update_point', this, nPoint));
    }

};

ga.ui.Profile.Graphics.prototype.updateInfo = function (info) {
    'use strict';
    if (this.info_) {
        this.info_.innerHTML = info;
    }
};

ga.ui.Profile.Graphics.prototype.draw = function (model) {
    'use strict';
    var mod = model,
        canv = this.canvas_;

    this.model_ = mod;

    this.updateInfo('');
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


ga.ui.Profile.GraphicsEvent = function (type, target, data) {
    'use strict';
    goog.events.Event.call(this, type, target);
    this.data_ = data;
};

goog.inherits(ga.ui.Profile.GraphicsEvent, goog.events.Event);

