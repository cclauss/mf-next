# -*- coding: utf-8 -*-

import pyramid.httpexceptions as exc
from geoadmin.lib.helpers import check_even

def validateGeometry(request):
    geom = request.params.get('geometry')
    if geom is None:
        raise exc.HTTPBadRequest('Please provide the parameter geometry  (Required)')
    geom = geom.split(',')
    if check_even(len(geom)) is False:
        raise exc.HTTPBadRequest('Please provide an even number of float numbers for the parameter geometry')
    try:
        geometry = map(float, geom)
    except ValueError:
        raise exc.HTTPBadRequest('Please provide numerical values in a comma separated list for the parameter geometry')
    return geometry

def validateGeometryType(request):
    esriTypes = ['esriGeometryPoint', 'esriGeometryPolyline', 'esriGeometryPolygon', 'esriGeometryEnvelope']
    geometryType = request.params.get('geometryType')
    if geometryType is None:
        raise exc.HTTPBadRequest('Please provide the parameter geometryType  (Required)')
    if geometryType not in esriTypes:
        raise exc.HTTPBadRequest('Please provide a valid geometry type')
    return geometryType

def validateImageDisplay(request):
    imgDisplay = request.params.get('imageDisplay')
    if imgDisplay is None:
        raise exc.HTTPBadRequest('Please provide the parameter imageDisplay  (Required)')
    imgDisplay = imgDisplay.split(',')
    if len(imgDisplay) != 3:
        raise exc.HTTPBadRequest('Please provide the parameter imageDisplay in a comma separated list of 3 arguments')
    try:
        imageDisplay = map(float, imgDisplay)
    except ValueError:
        raise exc.HTTPBadRequest('Please provide numerical values for the parameter imageDisplay')
    return imageDisplay

def validateMapExtent(request):
    mapExtent = request.params.get('mapExtent')
    if mapExtent is None:
        raise exc.HTTPBadRequest('Please provide the parameter mapExtent  (Required)')
    mapExtent = mapExtent.split(',')
    if len(mapExtent) != 4:
        raise exc.HTTPBadRequest('The parameter mapExtent must contain 4 coordinates in a comma-separated list')
    try:
        mapExtent = map(float, mapExtent)
    except ValueError:
        raise exc.HTTPBadRequest('Please provide numerical values for the parameter mapExtent')
    return mapExtent

def validateTolerance(request):
    tolerance = request.params.get('tolerance')
    if tolerance is None:
        raise exc.HTTPBadRequest('Please provide the parameter tolerance (Required)')
    try:
        tolerance = float(tolerance)
    except ValueError:
        raise exc.HTTPBadRequest('Please provide an integer value for the pixel tolerance')
    return tolerance
