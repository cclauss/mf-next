
goog.provide('ga.control.Profile');

goog.require('ga.model.Profile');
goog.require('ga.ui.Profile.Dialog');
goog.require('ga.net.Profile');

goog.require('ol.control.Control');
goog.require('ol.layer.Vector');

goog.require('goog.math.Coordinate');
goog.require('goog.array');

/**
 * @constructor
 * @extends {ol.control.Control} NOTE: not really an extension, as we don't add it to the map as normal.
 * But this should be changed
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

    //the layer containing the drawings on the map
    this.layer_ = null;

    //note: once we (TODO: make it a 'real' ol3 control)
    // - wrap and export our profileOptions object literals
    // - export the ol3 object literals
    //we will not need this anymore (because ol.control.Control contains a map reference)a
    /*jshint sub: true*/
    this.map_ = profileOptions['mymap'];
    /*jshint sub: false*/

    this.map_.on('click', this.onMouseClick, this);
    this.map_.on('dblclick', this.onMouseDblClick, this);

    this.initMapLayer();
};

goog.inherits(ga.control.Profile, ol.control.Control);


//STATIC FUNCTIONS
ga.control.Profile.createOLControlOptions_ = function (profileOptions) {
    'use strict';

    var olControlOptions = profileOptions || {};

    return olControlOptions;
};

//INSTANCE FUNCTIONS
ga.control.Profile.prototype.initMapLayer = function () {
    'use strict';
    //should be brought to seperate view...(we are in controller here)
    var style = null;
    if (!goog.isDefAndNotNull(this.layer_)) {
        style = new ol.style.Style({rules: [
            new ol.style.Rule({
                filter: new ol.filter.Filter(function(feature) {
                    return feature.get('where') === 'finished';
                }),
                symbolizers: [
                    new ol.style.Line({
                        strokeColor: 'red',
                        strokeWidth: 4,
                        opacity: 1
                    })
                ]
            }),
            new ol.style.Rule({
                filter: new ol.filter.Filter(function(feature) {
                    return feature.get('where') === 'projected';
                }),
                symbolizers: [
                    new ol.style.Line({
                        strokeColor: '#013',
                        strokeWidth: 2,
                        opacity: 1
                    })
                ]
            })
        ]});
        this.layer_ = new ol.layer.Vector({
            style: style,
            source: new ol.source.Vector({
                projection: ol.projection.get('EPSG:21781')
            })
        });

        this.map_.addLayer(this.layer_);
    }
};


ga.control.Profile.prototype.updateMapLayer = function () {
    'use strict';
    var sharedVertices = this.layer_.getLineVertices();
    var prevPoint = null;
    var layer = this.layer_;
    if (goog.DEBUG) {
        this.logger.info('Drawing points to map (' + this.model_.inPoints().length + ')');
    }

    //TODO: we always draw the complete model, without removing the old features first (ol3 does not support this yet)
    goog.array.forEach(this.model_.inPoints(), function (point) {
        if (prevPoint) {
            var feature = new ol.Feature({
                'where': 'finished'
            });
            var lineString = new ol.geom.LineString([[prevPoint.x, prevPoint.y], [point.x, point.y]], sharedVertices);
            feature.setGeometry(lineString);
            layer.addFeatures([feature]);
        }
        prevPoint = point;
    });
};

ga.control.Profile.prototype.getModel = function () {
    'use strict';

    return this.model_;
};

ga.control.Profile.prototype.update = function () {
    'use strict';

    //update profile dialog
    this.dialog_.update(this.model_);

    //update vector layer on map
    this.updateMapLayer();
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

    this.updateMapLayer();
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
