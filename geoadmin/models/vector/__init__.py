# -*- coding: utf-8 -*-

from sys import maxint
from shapely.geometry.point import Point
from shapely.geometry.linestring import LineString
from shapely.geometry.polygon import Polygon
from geoalchemy import WKBSpatialElement, functions

__all__ = ['bafu']

def getScale(imageDisplay, mapExtent):
    screen_width_px = imageDisplay[0] # in pixel
    map_width_m = abs(mapExtent[0] - mapExtent[2]) # in meters
    screen_px_per_m = imageDisplay[2]*(1.0/0.0254) # on the screen
    screen_width_m = screen_width_px/screen_px_per_m
    scale = map_width_m/screen_width_m
    return scale
    
class Vector(object):
    __minscale__ = 0
    __maxscale__ = maxint
    
    def featureMetadata(self, returnGeometry, layerName):
        display_column = self.display_field().name
        featureMeta = {
            "layerId" : self.__esriId__,
            "layerBodId": self.__bodId__,
            "layerName" : layerName,
            "featureId": self.id,
            "value": getattr(self, display_column) if display_column != '' else '',
            "displayFieldName" : display_column,
            "attributes": "",
            "geometryType": "",
            "geometry": ""
            }
        featureMeta["attributes"] = self.getAttributes(display_column)
        return featureMeta

    def getAttributes(self, display_column):
        attributes = dict()
        fid_column = self.primary_key_column().name
        geom_column = self.geometry_column().name
        for column in self.__table__.columns:
            columnName = str(column.key)
            if columnName not in (fid_column, geom_column, display_column) and hasattr(self, columnName):
                attribute = getattr(self, columnName)
                if attribute.__class__.__name__ == 'Decimal':
                    attributes[columnName] = attribute.__float__()
                elif attribute.__class__.__name__ == 'datetime':
                    attributes[columnName] = attribute.strftime("%d.%m.%Y")
                else:
                    attributes[columnName] = attribute
        return attributes

    @classmethod
    def display_field(cls):
        return cls.__table__.columns[cls.__displayFieldName__] if cls.__displayFieldName__ is not None else ''

    @classmethod
    def geometry_column(cls):
        return cls.__table__.columns['the_geom']

    @classmethod
    def primary_key_column(cls):
        return cls.__table__.primary_key 
    
    @classmethod
    def geom_filter(cls, geometry, geometryType, imageDisplay, mapExtent, tolerance):
        myFilter = None
        tolerance = tolerance*0.0254
        scale = getScale(imageDisplay, mapExtent)
        if scale is None or (scale >= cls.__minscale__ and scale <= cls.__maxscale__): 
            geom = esriRest2Shapely(geometry, geometryType)
            wkb_geometry = WKBSpatialElement(buffer(geom.wkb), 21781)
            geom_column = cls.geometry_column()
            myFilter = functions.within_distance(geom_column, wkb_geometry, tolerance)
        return myFilter

def esriRest2Shapely(geometry, geometryType):
    if geometryType == 'esriGeometryPoint':
        geom = Point(geometry[0], geometry[1])
    else:
        coordinates = list()
        for i in range(len(geometry)-1):
            coordinates.append((geometry[i], geometry[i+1]))
        if  geometryType == 'esriGeometryPolyline':
            geom = LineString(coordinates)
        elif geometryType == 'esriGeometryPolygon' or 'esriGeometryEnvelope':
            geom = Polygon(coordinates)
        else:
            geom = None
    return geom
