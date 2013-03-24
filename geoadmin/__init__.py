from pyramid.config import Configurator
from pyramid.events import BeforeRender
from pyramid.renderers import JSON
from sqlalchemy import engine_from_config

from geoadmin.models import initialize_sql 
from geoadmin.views.helloworld import *
from geoadmin.views.home import *
from geoadmin.views.layers import *

from geoadmin.lib import helpers

def add_render_globals(event):
    event['h'] = helpers

def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    app_version = settings.get('app_version')
    settings['app_version'] = app_version
    config = Configurator(settings=settings)
    config.add_renderer('json', JSON(indent=4))
    config.scan('geoadmin.models')
    engine = engine_from_config(settings, 'sqlalchemy.bod.')
    initialize_sql(engine)

    # Static config
    config.add_static_view('static', 'static', cache_max_age=3600)
    config.add_route('home', '/')

    # Application specific
    config.add_route('hello', '/hello/{name}')
    config.add_view(hello_world, route_name='hello')

    config.add_route('layers', '/layers/{id}')
    config.add_view(layers, route_name='layers', renderer='json')

    config.add_subscriber(add_render_globals,BeforeRender)
    config.scan()
    return config.make_wsgi_app()
