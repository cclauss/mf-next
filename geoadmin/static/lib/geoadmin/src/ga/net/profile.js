
goog.provide('ga.net.Profile');
goog.provide('ga.net.Profile.EventType');
goog.provide('ga.net.Profile.Event');

goog.require('goog.events');
goog.require('goog.events.EventTarget');
goog.require('goog.events.Event');

goog.require('goog.net.Jsonp');

goog.require('goog.array');
goog.require('goog.math.Coordinate');

goog.require('ga.defs');

/**
 * @fileoverview ga.net.Profile contains components to enable to user to use
 * the Profile service easily with a minimum of configuration. It enables
 * the user to launch a query and recieve an event once the query is completed.
 */

/**
 * @constructor
 * @extend {goog.events.EventTarget}
 */
ga.net.Profile = function () {
    'use strict';
    goog.events.EventTarget.call(this);

    /**
     * @private
     */
    this.jsonp_ = new goog.net.Jsonp(ga.defs.webServiceUrl() + '/profile.json', 'cb');
    this.jsonp_.setRequestTimeout(30 * 1000);

    /**
     * @private
     */
    this.currentRequest_ = null;
};

goog.inherits(ga.net.Profile, goog.events.EventTarget);

/**
 * launch a request to profile.json. Multiple calls to this function will abort
 * existing requests that are waiting for response. The event fired always
 * reponses with the latest query.
 * Fires {ga.net.Profile.Event} on completion
 * @param {Array.<goog.math.Coordinate>} list of coordinates
 */
ga.net.Profile.prototype.query = function (coordinates) {
    'use strict';
    var self = this;
    var payload = {
        'geom': this.getGeometryString_(coordinates),
        'elevation_models': 'COMB'
    };

    var onSuccess = function (data) {
        self.currentRequest_ = null;
        self.dispatchEvent(new ga.net.Profile.Event(ga.net.Profile.EventType.DONE,
                                                       self,
                                                       data));
    };

    var onError = function () {
        //when cancelled, then onError is called. Handle it here:
        if (self.currentRequest_.deferred_.result_.name !== 'CancelledError') {
            self.currentRequest_ = null;
            self.dispatchEvent(new ga.net.Profile.Event(ga.net.Profile.EventType.DONE,
                                                       self,
                                                       null));
        }
    };
    if (this.currentRequest_) {
        this.jsonp_.cancel(this.currentRequest_);
    }

    this.currentRequest_ = this.jsonp_.send(payload, onSuccess, onError);
};

/*
 * @private
 */
ga.net.Profile.prototype.getGeometryString_ = function (coordinates) {
    'use strict';
    var ret = goog.array.reduce(coordinates, function addToString(memo, value, index) {
        return memo + (index !==0?',':'') + '[' + value.x + ',' + value.y + ']';
    }, '{ "type": "LineString", "coordinates": [');
    return ret + ']}';
};

/**
 * @enum {string}
 */
ga.net.Profile.EventType = {
    DONE: goog.events.getUniqueId('done')
};

/**
 * @constructor
 * @extend {goog.events.Event)
 */
ga.net.Profile.Event = function (type, target, data) {
    'use strict';
    goog.events.Event.call(this, type, target);

    /**
     * is null to indicate error
     * @private
     */
    this.data_ = data;
};

goog.inherits(ga.net.Profile.Event, goog.events.Event);

/**
 */
ga.net.Profile.Event.prototype.data = function () {
    'use strict';
    return this.data_;
};


