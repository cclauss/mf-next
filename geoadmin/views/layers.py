import simplejson
from pyramid.httpexceptions import HTTPFound, HTTPNotFound, \
            HTTPBadRequest, HTTPUnauthorized, HTTPForbidden
from pyramid.response import Response
from geoadmin.models.bod import BodLayerFr

from geoadmin.models import   sessions

DBSession = sessions['bod']


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
