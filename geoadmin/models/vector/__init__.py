from shapely.geometry.point import Point
from shapely.geometry.linestring import LineString
from shapely.geometry.polygon import Polygon
from geoalchemy import WKBSpatialElement, functions

__all__ = ['bafu']

class Vector(object):
    
    def computeTemplate(self):
        print 'ok'
    
    @classmethod
    def geom_filter(cls, scale, geometry, geometryType, tolerance=0):
        myFilter = None
        if scale is None or (scale >= cls.__minscale__ and scale <= cls.__maxscale__): 
            geom = esriRest2Shapely(geometry, geometryType)
            wkb_geometry = WKBSpatialElement(buffer(geom.wkb), 21781)
            geom_column = cls.__table__.columns['the_geom']
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
