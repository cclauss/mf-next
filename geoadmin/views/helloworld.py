from pyramid.response import Response
from pyramid.view import view_config

from geoadmin.models import sessions 
from geoadmin.models.bod import BodLayerFr

def hello_world(request):
    return Response('Hello %(name)s!' % request.matchdict)

#@view_config(renderer='json')
def layer(request):
    id = request.matchdict['id']
    layer = sessions['bod'].query(BodLayerFr).get(id)

    return {'BodDescription': layer.bezeichnung}
