# -*- coding: utf-8 -*-

import types
import pyramid.httpexceptions as exc
from geoadmin.models import models_from_name
from geoadmin.lib.helpers import check_even


class MapServiceValidation(object):
    def __init__(self):
        self._geometry = None
        self._geometryType = None
        self._imageDisplay = None
        self._mapExtent = None
        self._tolerance = None
        self._models = None
        self.esriGeometryTypes = ['esriGeometryPoint', 'esriGeometryPolyline', 'esriGeometryPolygon', 'esriGeometryEnvelope']

    @property
    def geometry(self):
        return self._geometry

    @property
    def geometryType(self):
        return self._geometryType

    @property
    def imageDisplay(self):
        return self._imageDisplay

    @property
    def mapExtent(self):
        return self._mapExtent

    @property
    def tolerance(self):
        return self._tolerance

    @property
    def models(self):
        return self._models

    @geometry.setter
    def geometry(self, value):
        if value is None:
            raise exc.HTTPBadRequest('Please provide the parameter geometry  (Required)')
        value = value.split(',')
        if check_even(len(value)) is False:
            raise exc.HTTPBadRequest('Please provide an even number of float numbers for the parameter geometry')
        try:
            self._geometry = map(float, value)
        except ValueError:
            raise exc.HTTPBadRequest('Please provide numerical values in a comma separated list for the parameter geometry')

    @geometryType.setter
    def geometryType(self, value):
        if value is None:
            raise exc.HTTPBadRequest('Please provide the parameter geometryType  (Required)')
        if value not in self.esriGeometryTypes:
            raise exc.HTTPBadRequest('Please provide a valid geometry type')
        self._geometryType = value

    @imageDisplay.setter
    def imageDisplay(self, value):
        if value is None:
            raise exc.HTTPBadRequest('Please provide the parameter imageDisplay  (Required)')
        value = value.split(',')
        if len(value) != 3:
            raise exc.HTTPBadRequest('Please provide the parameter imageDisplay in a comma separated list of 3 arguments')
        try:
            self._imageDisplay = map(float, value)
        except ValueError:
            raise exc.HTTPBadRequest('Please provide numerical values for the parameter imageDisplay')

    @mapExtent.setter
    def mapExtent(self, value):
        if value is None:
            raise exc.HTTPBadRequest('Please provide the parameter mapExtent  (Required)')
        value = value.split(',')
        if len(value) != 4:
            raise exc.HTTPBadRequest('The parameter mapExtent must contain 4 coordinates in a comma-separated list')
        try:
            self._mapExtent = map(float, value)
        except ValueError:
            raise exc.HTTPBadRequest('Please provide numerical values for the parameter mapExtent')

    @tolerance.setter
    def tolerance(self, value):
        if value is None:
            raise exc.HTTPBadRequest('Please provide the parameter tolerance (Required)')
        try:
            self._tolerance = float(value)
        except ValueError:
            raise exc.HTTPBadRequest('Please provide an integer value for the pixel tolerance')

    @models.setter
    def models(self, value):
        if value is None:
            raise exc.HTTPBadRequest('Please provide a valid layer Id')
        self._models = value


class HeightValidation(object):
    def __init__(self):
        self._lon = None
        self._lat = None
        self._layers = None

    @property
    def lon(self):
        return self._lon

    @property
    def lat(self):
        return self._lat

    @property
    def layers(self):
        return self._layers

    @lon.setter
    def lon(self, value):
        if value is None:
            raise exc.HTTPBadRequest("Missing parameter 'easting'/'lon'")
        try:
            self._lon = float(value)
        except ValueError:
            raise exc.HTTPBadRequest("Please provide numerical values for the parameter 'easting'/'lon'")

    @lat.setter
    def lat(self, value):
        if value is None:
            raise exc.HTTPBadRequest("Missing parameter 'norhting'/'lat'")
        try:
            self._lat = float(value)
        except ValueError:
            raise exc.HTTPBadRequest("Please provide numerical values for the parameter 'northing'/'lat'")

    @layers.setter
    def layers(self, value):
        if not isinstance(value, types.ListType):
            value = value.split(',')
            for i in value:
                if i not in ('DTM25', 'DTM2', 'COMB'):
                    raise exc.HTTPBadRequest("Please provide a valid name for the elevation model DTM25, DTM2 or COMB")
        self._layers = value 


def validateLayerId(idlayer):
    models = models_from_name(idlayer)
    if models is None:
        raise exc.HTTPBadRequest('Please provide a valid layer Id (what you provided: %s)' %idlayer)
    return models
