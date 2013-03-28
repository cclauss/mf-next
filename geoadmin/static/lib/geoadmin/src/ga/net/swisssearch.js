/*global goog:true, ga:true */
/*jslint nomen: true, vars: true */

goog.provide('ga.net');
goog.provide('ga.net.SwissSearch');
goog.provide('ga.net.SwissSearch.EventType');
goog.provide('ga.net.SwissSearch.Event');

goog.require('goog.events');
goog.require('goog.events.EventTarget');
goog.require('goog.events.Event');

goog.require('goog.net.Jsonp');

goog.require('ga.defs');

/**
 * @fileoverview ga.net.SwissSearch contains components to enable to user to use
 * the SwissSearch service easily with a minimum of configuration. It enables
 * the user to launch a query and recieve an event once the query is completed.
 */

/**
 * @constructor
 * @extend {goog.events.EventTarget}
 */
ga.net.SwissSearch = function () {
    'use strict';
    goog.events.EventTarget.call(this);

    /**
     * @private
     */
    this.jsonp_ = new goog.net.Jsonp(ga.defs.webServiceUrl() + '/swisssearch/geocoding', 'cb');
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
 */
ga.net.SwissSearch.prototype.query = function (queryText) {
    'use strict';
    var self = this;
    var payload = {
        'lang': 'fr',
        'query': queryText
    };

    var onSuccess = function (data) {
        self.currentRequest_ = null;
        self.dispatchEvent(new ga.net.SwissSearch.Event(ga.net.SwissSearch.EventType.DONE,
                                                       self,
                                                       data));
    };

    var onError = function () {
        //when cancelled, then onError is called. Handle it here:
        if (self.currentRequest_.deferred_.result_.name !== 'CancelledError') {
            self.currentRequest_ = null;
            self.dispatchEvent(new ga.net.SwissSearch.Event(ga.net.SwissSearch.EventType.DONE,
                                                       self,
                                                       null));
        }
    };
    if (this.currentRequest_) {
        this.jsonp_.cancel(this.currentRequest_);
    }

    this.currentRequest_ = this.jsonp_.send(payload, onSuccess, onError);
};

/**
 * @enum {string}
 */
ga.net.SwissSearch.EventType = {
    DONE: goog.events.getUniqueId('done')
};

/**
 * @constructor
 * @extend {goog.events.Event)
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
 */
ga.net.SwissSearch.Event.prototype.data = function () {
    'use strict';
    return this.data_;
};

//needed for unit test stubs
goog.exportSymbol('goog.net.Jsonp.prototype.send', goog.net.Jsonp.prototype.send);
goog.exportSymbol('goog.net.Jsonp.prototype.cancel', goog.net.Jsonp.prototype.cancel);
