# -*- coding: utf-8 -*-

import pyramid.httpexceptions as exc
from geoadmin.models import models_from_name
from geoadmin.lib.helpers import check_even


class Validation(object):
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


def validateLayerId(idlayer):
    models = models_from_name(idlayer)
    if models is None:
        raise exc.HTTPBadRequest('Please provide a valid layer Id (what you provided: %s)' %idlayer)
    return models
