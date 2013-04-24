
from papyrus.renderers import GeoJSON

from geoadmin.esrigeojsonencoder import dumps as esri_dumps


class EsriJSON(GeoJSON):
    def __init__(self):
        GeoJSON.__init__(self)
        
        
    def __call__(self, info):
        def _render(value, system):
            if isinstance(value, (list, tuple)):
                value = self.collection_type(value)
            ret = esri_dumps(value)
            request = system.get('request')
            if request is not None:
                response = request.response
                ct = response.content_type
                if ct == response.default_content_type:
                    callback = request.params.get(self.jsonp_param_name)
                    if callback is None:
                        response.content_type = 'application/json'
                    else:
                        response.content_type = 'text/javascript'
                        ret = '%(callback)s(%(json)s);' % {'callback': callback,
                                                           'json': ret}
            return ret
        return _render
