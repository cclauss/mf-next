/*global goog:true, ga:true */
/*jslint nomen: true, vars: true */

goog.provide('ga.net.SwissSearch');
goog.provide('ga.net.SwissSearch.EventType');
goog.provide('ga.net.SwissSearch.Event');

goog.require('goog.events');
goog.require('goog.events.EventTarget');
goog.require('goog.events.Event');

goog.require('goog.net.Jsonp');

goog.require('ga.Defs');

/**
 * @fileoverview ga.net.SwissSearch contains components to enable to user to use
 * the SwissSearch service easily with a minimum of configuration. It enables
 * the user to launch a query and recieve an event once the query is completed.
 */

/**
 * @constructor
 * @extend {goog.events.EventTarget}
 * @export
 */
ga.net.SwissSearch = function () {
    'use strict';
    goog.events.EventTarget.call(this);

    /**
     * @private
     */
    this.jsonp_ = new goog.net.Jsonp(ga.Defs.getInstance().webServiceUrl() + '/swisssearch/geocoding', 'cb');
    this.jsonp_.setRequestTimeout(30 * 1000);

    /**
     * @private
     */
    this.currentRequest_ = null;
};

goog.inherits(ga.net.SwissSearch, goog.events.EventTarget);

/**
 * launch a request to swisssearch. Multiple calls to this function will abort
 * existing requests that are waiting for response. The event fired always
 * reponses with the latest query.
 * Fires {ga.net.SwissSearch.Event} on completion
 * @param {string} the query to launch
 * @export
 */
ga.net.SwissSearch.prototype.query = function (queryText) {
    'use strict';
    var that = this;
    var payload = {
        lang: 'fr',
        query: queryText
    };

    var onSuccess = function (data) {
        that.dispatchEvent(new ga.net.SwissSearch.Event(ga.net.SwissSearch.EventType.DONE,
                                                       that,
                                                       data));
    };

    var onError = function () {
        that.dispatchEvent(new ga.net.SwissSearch.Event(ga.net.SwissSearch.EventType.DONE,
                                                       that,
                                                       null));
    };

    //somehow, this cancelling does not work. Callbacks are still fired...
    //TODO
    if (this.currentRequest_) {
        this.jsonp_.cancel(this.currentRequest_);
    }

    this.currentRequest_ = this.jsonp_.send(payload, onSuccess, onError);
};

/**
 * @enum {string}
 * @export
 */
ga.net.SwissSearch.EventType = {
    DONE: goog.events.getUniqueId('done')
};

/**
 * @constructor
 * @extend {goog.events.Event)
 * @export
 */
ga.net.SwissSearch.Event = function (type, target, data) {
    'use strict';
    goog.events.Event.call(this, type, target);

    /**
     * is null to indicate error
     * @private
     */
    this.data_ = data;
};

goog.inherits(ga.net.SwissSearch.Event, goog.events.Event);

/**
 * @export
 */
ga.net.SwissSearch.Event.prototype.data = function () {
    'use strict';
    return this.data_;
};


