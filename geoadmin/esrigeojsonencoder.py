
import datetime
import decimal

import functools
from operator import add

from simplejson import dumps as _dumps
import geojson
from geojson.codec import GeoJSONEncoder

from papyrus.geo_interface import GeoInterface


from sqlalchemy.ext.associationproxy import _AssociationList
import sys




class EsriGeoJSONEncoder(GeoJSONEncoder):
    
 
    srs = 21781
    
    def _cleanup(self, ret):
            if 'coordinates' in ret.keys():
                del ret['coordinates']
            
             
            if 'properties' in ret.keys():
                #print "has properties:", ret['properties']
                if  len(ret['properties']) > 0:
                    if 'attributes' not in ret.keys(): ret['attributes'] = {}
                    ret['attributes'].update(ret['properties'])
                del ret['properties']
            if 'crs' in ret.keys():
                crs = ret['crs']
                if crs['type'] == 'name':
                    pass
            else:
                ret['spatialReference'] = {'wkid': self.srs}
            return ret
        
    def default(self, obj):
         geom_type  = None
         if hasattr(obj, '__geo_interface__'):
             geom_type = dict(obj.__geo_interface__)['type']

         if isinstance(obj, (decimal.Decimal, datetime.date, datetime.datetime)):
            return str(obj)
        
         if isinstance(obj, GeoInterface):
             self.srs = obj.geometry_column().type.srid
             obj = obj.__geo_interface__
         
         if isinstance(obj, (geojson.GeoJSON)):
            ret = dict(obj)
            if 'coordinates' in ret.keys():
                coordinates = ret['coordinates']
            
            if isinstance(obj, (geojson.Feature,geojson.feature.Feature)) or geom_type == 'Feature':
                ret = dict(obj)
                geometry = self.default(obj.geometry)
                ret = dict(obj)
                ret['geometry'] = geometry
                return self._cleanup(ret)
                
            if isinstance(obj, (geojson.FeatureCollection)):
                features = []
                for feature in obj.features:
                    features.append(self.default(feature))
    
                ret = dict(obj)
                ret['features'] = features
                return self._cleanup(ret)
            
            if isinstance(obj, (geojson.Point)):
               ret = dict(obj)
               
               point = coordinates 
               mapPointDict =  (lambda s, x, y: {'x': x, 'y': y})
               ret['x'], ret['y'] = coordinates
               ret['type'] = 'point'
               
               return self._cleanup(ret)
            
            if isinstance(obj, geojson.geometry.LineString):
               ret = dict(obj)
               
               path = coordinates #ret['coordinates']
               mapPointList = (lambda s, x, y: (x, y))
               ret['paths'] = [[mapPointList(21781, *xy) for xy in path]]
               ret['type'] = 'polyline'

               return self._cleanup(ret)             
         
            if isinstance(obj, (geojson.MultiPoint)):
               ret = dict(obj)
               
               #coordinates = ret['coordinates']
               mapPointList = (lambda s, x, y: (x, y))
               points = [mapPointList(21781, *xy) for xy in coordinates]
               #print points
               ret['points'] =  points
               ret['type'] = 'point'
               
               return self._cleanup(ret)
            
              
            if isinstance(obj, geojson.MultiLineString):
               ret = dict(obj)
               
               paths = coordinates #ret['coordinates']
               mapPointList = (lambda s, x, y: (x, y))
               ret['paths'] = [[mapPointList(21781, *xy) for xy in path] for path in paths]
               ret['type'] = 'polyline'
               
               return self._cleanup(ret)
               
            if isinstance(obj, (geojson.Polygon, geojson.geometry.Polygon))  or geom_type  == 'Polygon':
               ret = dict(obj)
               
               rings = coordinates #ret['coordinates']
               mapPointList = (lambda s, x, y: (x, y))
               ret['rings'] =  [[mapPointList(21781, *xy) for xy in ring] for ring in rings]
               ret['type'] = 'polygon'
               
               return self._cleanup(ret)
               
            if isinstance(obj, geojson.MultiPolygon):
               ret = dict(obj)
               
               mapPointList = (lambda s, x, y: (x, y))
               rings = reduce(add, coordinates)
               ret['rings'] = [[mapPointList(21781, *xy) for xy in ring] for ring in rings]
               ret['type'] = 'polygon'

                         
               return self._cleanup(ret)
         
         return GeoJSONEncoder.default(self, obj)
         
         
dumps = functools.partial(_dumps, cls=EsriGeoJSONEncoder, use_decimal=True)

