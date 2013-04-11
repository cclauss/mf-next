
goog.provide('ga.ui.Profile.Overlay');
goog.provide('ga.ui.Profile.OverlayRenderer');


goog.require('ga.ui.Profile.Graphics');
goog.require('ga.model.Profile');

goog.require('goog.ui.Container');
goog.require('goog.ui.ContainerRenderer');

ga.ui.Profile.OverlayRenderer = function () {
    'use strict';
    goog.ui.ContainerRenderer.call(this);
};
goog.inherits(ga.ui.Profile.OverlayRenderer, goog.ui.ContainerRenderer);

ga.ui.Profile.OverlayRenderer.prototype.getCssClass = function () {
    'use strict';
    return goog.getCssName('profile-overlay');
};

/**
 * @constructor
 * @extends {goog.ui.Container}
 * @param parent_element 
 */
ga.ui.Profile.Overlay = function() {
    'use strict';
    var rend = new ga.ui.Profile.OverlayRenderer();

    goog.ui.Container.call(this, goog.ui.Container.Orientation.HORIZONTAL, rend);

    this.graphics_ = new ga.ui.Profile.Graphics();
    this.addChild(this.graphics_, true);
};

goog.inherits(ga.ui.Profile.Overlay, goog.ui.Container);

ga.ui.Profile.Overlay.prototype.update = function (model) {
    'use strict';
    this.graphics_.draw(model);
};

