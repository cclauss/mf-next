
goog.provide('ga.ui.Profile.Overlay');
goog.provide('ga.ui.Profile.OverlayRenderer');


goog.require('ga.ui.Profile.Graphics');
goog.require('ga.model.Profile');

goog.require('goog.ui.Control');

/**
 * @constructor
 * @extends {goog.ui.Control}
 * @param parent_element 
 */
ga.ui.Profile.Overlay = function() {
    'use strict';
    goog.ui.Control.call(this, null);
    this.addClassName(goog.getCssName('profile-overlay'));

    this.graphics_ = new ga.ui.Profile.Graphics();

    this.addChild(this.graphics_, true);
};

goog.inherits(ga.ui.Profile.Overlay, goog.ui.Control);

ga.ui.Profile.Overlay.prototype.enterDocument = function () {
    'use strict';
    ga.ui.Profile.Overlay.superClass_.enterDocument.call(this);

    //add listeners here, if any
    /*
    var handler = this.getHandler();
    var element = this.getElement();

    handler.
            listen(element, goog.events.EventType.MOUSEMOVE, function (evt) {console.log('mousemove yes...', evt);}).
            listen(element, goog.events.EventType.CLICK, function (evt) {console.log('click yes...', evt);});
    */
};

ga.ui.Profile.Overlay.prototype.update = function (model) {
    'use strict';
    this.graphics_.draw(model);
};

ga.ui.Profile.Overlay.prototype.waitingForProfile = function () {
    'use strict';
    this.graphics_.updateInfo('Profile is calculated, please wait...');
};

ga.ui.Profile.Overlay.prototype.getGraphics = function () {
    'use strict';
    return this.graphics_;
};

