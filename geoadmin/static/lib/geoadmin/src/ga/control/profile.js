
goog.provide('ga.control.Profile');

goog.require('ga.model.Profile');
goog.require('ga.ui.Profile.Dialog');
goog.require('ga.net.Profile');

goog.require('ol.control.Control');

goog.require('goog.math.Coordinate');

/**
 * @constructor
 * @extends {ol.control.Control}
 * @param {ga.control.ProfileOptions} profileOptions
 */
ga.control.Profile = function(profileOptions) {
    'use strict';
    ol.control.Control.call(this, ga.control.Profile.createOLControlOptions_(profileOptions));

    if (goog.DEBUG) {
        this.logger = goog.debug.Logger.getLogger('ga.control.Profile.' + goog.getUid(this));
        this.logger.info('creating profile control with uid ' + goog.getUid(this));
    }

    this.model_ = new ga.model.Profile();

    this.dialog_ = new ga.ui.Profile.Dialog();

    this.netProfile_ = new ga.net.Profile();

    //note: once we
    // - wrap and export our profileOptions object literals
    // - export the ol3 object literals
    //we will not need this anymore (because ol.control.Control contains a map reference)
    /*jshint sub: true*/
    this.map_ = profileOptions['mymap'];
    /*jshint sub: false*/

    this.map_.on('click', this.onMouseClick, this);
    this.map_.on('dblclick', this.onMouseDblClick, this);
};

goog.inherits(ga.control.Profile, ol.control.Control);


//STATIC FUNCTIONS
ga.control.Profile.createOLControlOptions_ = function (profileOptions) {
    'use strict';

    var olControlOptions = profileOptions || {};

    return olControlOptions;
};

//INSTANCE FUNCTIONS
ga.control.Profile.prototype.getModel = function () {
    'use strict';

    return this.model_;
};

ga.control.Profile.prototype.update = function () {
    'use strict';

    return this.dialog_.update(this.model_);
};

ga.control.Profile.prototype.show = function (show) {
    'use strict';

    this.dialog_.setVisible(show);
};

ga.control.Profile.prototype.onMouseClick = function (evt) {
    'use strict';
    var myCoord = new goog.math.Coordinate(evt.getCoordinate()[0], evt.getCoordinate()[1]);

    this.model_.inPoints().push(myCoord);

    if (goog.DEBUG) {
        this.logger.info('Adding point to model (' + this.model_.inPoints().length + ')');
    }
};

ga.control.Profile.prototype.onMouseDblClick = function (evt) {
    'use strict';
    if (goog.DEBUG) {
        this.logger.info('Double clicked...sending profile request now.');
    }
    evt.stopPropagation(); //this does not seem to work

    this.netProfile_.addEventListener(ga.net.Profile.EventType.DONE, this.profileDataArrived, false, this);

    this.netProfile_.query(this.model_.inPoints());
};


ga.control.Profile.prototype.profileDataArrived = function (profiledata) {
    'use strict';

    this.netProfile_.removeEventListener(ga.net.Profile.EventType.DONE, this.profileDataArrived, this);

    if (goog.DEBUG) {
        this.logger.info('New data arrived.' + profiledata.data_);
    }

    this.model_.updateOutPoints(profiledata.data_);
    this.update();
};
