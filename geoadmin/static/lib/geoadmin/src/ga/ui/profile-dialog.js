
goog.provide('ga.ui.Profile.Dialog');

goog.require('ga.ui.Profile.Graphics');

goog.require('goog.ui.Dialog');

/**
 * @constructor
 * @extends {goog.ui.Dialog}
 * @param opt_domHelper 
 */
ga.ui.Profile.Dialog = function (opt_domHelper) {
    'use strict';
    goog.ui.Dialog.call(this, 'profile-dialog', undefined, opt_domHelper);

    this.setTitle('This is your profile!');
    this.setModal(false);

    this.graphics_ = new ga.ui.Profile.Graphics();
    this.addChild(this.graphics_, true);
};

goog.inherits(ga.ui.Profile.Dialog, goog.ui.Dialog);

ga.ui.Profile.Dialog.prototype.update = function (model) {
    'use strict';
    this.graphics_.draw(model);
};

