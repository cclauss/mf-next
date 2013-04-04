
goog.provide('ga.control.Profile');

goog.require('ga.model.Profile');
goog.require('ga.ui.Profile.Dialog');
goog.require('ga.ui.Profile.Overlay');
goog.require('ga.net.Profile');

goog.require('ol.control.Control');
goog.require('ol.layer.Vector');

goog.require('goog.math.Coordinate');
goog.require('goog.array');

/**
 * @constructor
 * @extends {ol.control.Control}
 * @param {ga.control.ProfileOptions} profileOptions
 */
ga.control.Profile = function(profileOptions) {
    'use strict';

    var options = goog.isDef(profileOptions) ? profileOptions : {};
    var element = goog.dom.createDom(goog.dom.TagName.DIV, {
        'class': 'ga-control-profile'
    });

    this.layer_ = null;
    ol.control.Control.call(this, {
        element: element,
        map: options.map,
        target: options.target
    });

    if (goog.DEBUG) {
        this.logger = goog.debug.Logger.getLogger('ga.control.Profile.' + goog.getUid(this));
        this.logger.info('creating profile control with uid ' + goog.getUid(this));
    }

    this.model_ = new ga.model.Profile();
    this.dialog_ = null;
    /* 
    //Show profile in dialog
    this.dialog_ = new ga.ui.Profile.Dialog(goog.dom.getDomHelper(element));
    this.dialog_.render(element);
    */
    this.overlay_ = null;
    //Show profile in overlay
    this.overlay_ = new ga.ui.Profile.Overlay();
    this.overlay_.render(element);

    //Adding popover
    this.popover_ = goog.dom.createDom(goog.dom.TagName.DIV, {
        'class': 'ga-control-profile-popover'
    });
    goog.dom.appendChild(element, this.popover_);


    this.netProfile_ = new ga.net.Profile();
    //the layer containing the drawings on the map
    this.lastPointDrawn_ = -1;
    this.active_ = false;

    if (this.dialog_) {
        goog.events.listen(this.dialog_, goog.ui.Dialog.EventType.SELECT, this.onDialogSelected, false, this);
    }

    if (this.overlay_) {
        goog.events.listen(this.overlay_.getGraphics(), 'update_point', this.onUpdatePoint, false, this);
    }

};

goog.inherits(ga.control.Profile, ol.control.Control);

ga.control.Profile.prototype.setMap = function (map) {
    'use strict';
    ga.control.Profile.superClass_.setMap.call(this, map);

    if (!goog.isNull(map)) {
        this.listenerKeys.push(
            goog.events.listen(map, goog.events.EventType.CLICK, this.onMouseClick, false, this),
            goog.events.listen(map, goog.events.EventType.DBLCLICK, this.onMouseDblClick, false, this)
        );
        this.initMapLayer();
    }
};

ga.control.Profile.prototype.onUpdatePoint = function (evt) {
    'use strict';
    var map = this.getMap();
    var pop = this.popover_;
    var pixels = map.getPixelFromCoordinate([evt.data_.en_.x, evt.data_.en_.y]);

    pop.innerHTML = Math.floor(-evt.data_.dh_.y) + ' [m]';
    pop.style.top = pixels.y - 20 + 'px';
    pop.style.left = pixels.x + 'px';
    pop.style.display = 'inline-block';
};

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

        this.getMap().addLayer(this.layer_);
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
    if (this.lastPointDrawn_ >= 0) {
        prevPoint = this.model_.inPoints()[this.lastPointDrawn_];
    }
    var pointsToDraw = [];
    if (prevPoint) {
        pointsToDraw.push([prevPoint.x, prevPoint.y]);
    }
    var i =  this.lastPointDrawn_ + 1;
    for (var len = this.model_.inPoints().length; i < len; i += 1) {
        var point = this.model_.inPoints()[i];
        pointsToDraw.push([point.x, point.y]);
    }
    if (pointsToDraw.length > 1) {
        this.lastPointDrawn_ = i - 1;
        var feature = new ol.Feature({
            'where': 'finished'
        });
        if (goog.DEBUG) {
            this.logger.info('draw point linestring with points ' + pointsToDraw);
        }
        var lineString = new ol.geom.LineString(pointsToDraw, sharedVertices);
        feature.setGeometry(lineString);
        layer.addFeatures([feature]);

    }
};

ga.control.Profile.prototype.getModel = function () {
    'use strict';

    return this.model_;
};

ga.control.Profile.prototype.update = function () {
    'use strict';

    //update profile dialog
    if (this.dialog_) {
        this.dialog_.update(this.model_);
    }
    if (this.overlay_) {
        this.overlay_.update(this.model_);
    }

    //update vector layer on map
    this.updateMapLayer();
};

ga.control.Profile.prototype.onDialogSelected = function () {
    'use strict';
    if (this.isActive()) {
        this.active_ = false;
    }
};

ga.control.Profile.prototype.isActive = function () {
    'use strict';
    return this.active_;
};

ga.control.Profile.prototype.toggleActive = function () {
    'use strict';
    this.activate(!this.isActive());
};

ga.control.Profile.prototype.activate = function (doActivate) {
    'use strict';

    if (doActivate === this.isActive()) {
        return;
    }

    this.active_ = doActivate;
    if (this.dialog_) {
        this.dialog_.setVisible(doActivate);
    }
    if (this.overlay_) {
        this.overlay_.setVisible(doActivate);
    }
};

ga.control.Profile.prototype.onMouseClick = function (evt) {
    'use strict';
    if (!this.isActive()) {
        return;
    }

    var myCoord = new goog.math.Coordinate(evt.getCoordinate()[0], evt.getCoordinate()[1]);
    var len = this.model_.inPoints().length;

    if (len === 0 ||
        goog.math.Coordinate.distance(this.model_.inPoints()[len-1], myCoord) >= 0.001) {

        this.model_.inPoints().push(myCoord);
        if (goog.DEBUG) {
            this.logger.info('Adding point to model (' + this.model_.inPoints().length + ')');
        }
        this.updateMapLayer();
    }
};

ga.control.Profile.prototype.onMouseDblClick = function (evt) {
    'use strict';
    if (!this.isActive()) {
        return;
    }
    if (goog.DEBUG) {
        this.logger.info('Double clicked...sending profile request now.');
    }
    //unfort., the blow does not work.
    evt.stopPropagation();

    this.netProfile_.addEventListener(ga.net.Profile.EventType.DONE, this.profileDataArrived, false, this);

    this.netProfile_.query(this.model_.inPoints());

    //TODO: this should be done via eventing...
    if (this.overlay_) {
        this.overlay_.waitingForProfile();
    }
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
