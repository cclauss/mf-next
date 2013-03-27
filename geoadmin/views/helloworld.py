from pyramid.response import Response
from pyramid.view import view_config

from geoadmin.models import sessions 
from geoadmin.models.bod import BodLayerFr

@view_config(route_name='hello')
def hello_world(request):
    return Response('Hello %(name)s!' % request.matchdict)
