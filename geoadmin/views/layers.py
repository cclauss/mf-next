from pyramid.httpexceptions import HTTPFound, HTTPNotFound, \
            HTTPBadRequest, HTTPUnauthorized, HTTPForbidden
from pyramid.response import Response
from geoadmin.models import DBSession
from geoadmin.models.bod import BodLayerFr

import simplejson


def layers(request):
    id = feature_id = request.matchdict.get('id', None)
    if not id:
        return HTTPBadRequest('"id" should be available in request params')  
    layer = DBSession.query(BodLayerFr).get( '%(id)s' % request.matchdict)
    if layer:
        return {'results': {
             'id': layer.id, 
             'bezeichnung': layer.bezeichnung,
             'abstract': layer.abstract
        }}
    else:
        return {"results" : "Not found"}
