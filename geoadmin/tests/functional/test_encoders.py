import unittest

from pyramid import testing

class Test_EsriGeoJSON(unittest.TestCase):
    def _callFUT(self, **kwargs):
        from geoadmin.esrigeojsonencoder import EsriGeoJSONEncoder
        return EsriGeoJSONEncoder(**kwargs)

    def test_json(self):
        encoder = self._callFUT()
        result = encoder.default({"a": 1})
        self.assertEqual(result, {'a': 1})

    def test_geojson(self):
        encoder = self._callFUT()
        from geojson import Point
        point = Point([600000,200000], properties= {'name':'toto'})
        result = encoder.default(point)
        self.assertEqual(result, {'spatialReference': {'wkid': 21781}, 'attributes': {'name': 'toto'}, 'y': 200000, 'x': 600000, 'type': 'point'} )
    
    
    def test_dumps(self):
        from geoadmin.esrigeojsonencoder import dumps as esri_dumps
        from geojson import Point
        point = Point([600000,200000], properties= {'name':'toto'})
        
        result = esri_dumps(point)
        self.assertEqual(result, '{"spatialReference": {"wkid": 21781}, "attributes": {"name": "toto"}, "y": 200000, "x": 600000, "type": "point"}' )
        


