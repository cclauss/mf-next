
/**
 * @fileoverview ga.model.Profile contains profile model data
 * @author gilbert.jeiziner@swisstopo.ch
 */

goog.provide('ga.model.Profile');
goog.provide('ga.model.ProfilePoint');

goog.require('goog.array');
goog.require('goog.debug.Logger');
goog.require('goog.math.Rect');
goog.require('goog.math.Coordinate');

/*
 * Simple data model to represent a profile point
 * @constructor
 * @param {goog.math.Coordinate} eastnorth East and North Coordinates
 * @param {goog.math.Coordinate} distheight Distance and Height Coordinates
 */
ga.model.ProfilePoint = function (eastnorth, distheight) {
    'use strict';

    /*
     * 2D Coordinate representing east and north
     * @private
     * @type {goog.math.Coordinate}
     */
    this.en_ = eastnorth;
    /*
     * 2D Coordinate representing 2d distance and height
     * @private
     * @type {goog.math.Coordinate}
     */
    this.dh_ = distheight;
};


/*
 * Simple data model for Profile(s) data
 * @constructor
 */
ga.model.Profile = function () {
    'use strict';

    /*
     * uid of Profile
     * @private
     */
    this.uid_ = goog.getUid(this);

    /*
     * Create instance logger
     * @private
     */
    if (goog.DEBUG) {
        this.logger_ = goog.debug.Logger.getLogger('ga.model.Profile.' + this.uid_);
        this.logger_.info('creating Profile with uid ' + this.uid_);
    }

    /*
     * Array of 2D Coordinates representing the input data for our profile
     * It corresponds to the coordinates as 'clicked' by the user
     * @private
     * @type {Array.<goog.math.Coordinate>}
     */
    this.inPoints_ = [];

    /*
     * Array of Profile points, usually derived from inPoints_
     * @private
     * @type {Array.<ga.model.ProfilePoint>}
     */
    this.outPoints_ = [];

    /*
     * Bounding rectangle of dist/height dimension of outPoints. Is updated
     * everytime outPoints_ chages
     * @private
     * @type {goog.math.Rect}
     */
    this.boundingRect_ = new goog.math.Rect(0.0, 0.0, 0.0, 0.0);
};

/*
 * Access the inPoints array directly
 */
ga.model.Profile.prototype.inPoints = function () {
    'use strict';
    return this.inPoints_;
};

/*
 * Access the outPoints_ array directly
 */
ga.model.Profile.prototype.outPoints = function () {
    'use strict';
    return this.outPoints_;
};

/*
 * Access bounding rect of dist height
 */
ga.model.Profile.prototype.boundingRect = function () {
    'use strict';
    return this.boundingRect_;
};

/*
 * Update outpoints from data in JSON format
 * @param {json} data in Json format
 * @return {boolean} true if points could be updated. false if not (state does not change)
 */
/*jshint sub:true*/
ga.model.Profile.prototype.updateOutPoints = function (json) {
    'use strict';

    var tempArray = [],
        tempBoundingRect = null,
        rect= new goog.math.Rect(0.0, 0.0, 0.0, 0.0),
        error = false;

    if (!goog.isDefAndNotNull(json) ||
        !goog.isArray(json['profile'])) {
        return false;
    }

    goog.array.map(json['profile'], function (element) {
        var point;
        if (!goog.isNumber(element['dist']) ||
            !goog.isNumber(element['easting']) ||
            !goog.isNumber(element['northing']) ||
            !goog.isDefAndNotNull(element['alts']) ||
            !goog.isDefAndNotNull(element['alts']['COMB'])) {
            error = error || true;
        } else if (!error) {
            //note: we record altitudes with negative values
            point = new ga.model.ProfilePoint(
                            new goog.math.Coordinate(element['easting'], element['northing']),
                            new goog.math.Coordinate(element['dist'], -element['alts']['COMB']));
            tempArray.push(point);

            rect.left = point.dh_.x;
            rect.top = point.dh_.y;
            if (!tempBoundingRect) {
                tempBoundingRect = new goog.math.Rect(point.dh_.x, point.dh_.y, 0.0, 0.0);
            } else {
                tempBoundingRect.boundingRect(rect);
            }
        }
    });
    if (error) {
        return false;
    }

    this.outPoints_ = tempArray;
    this.boundingRect_ = tempBoundingRect;

    return true;
};

