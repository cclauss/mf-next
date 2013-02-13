from pyramid.config import Configurator
from pyramid.events import BeforeRender
from geoadmin import helpers

def add_render_globals(event):
    event['h'] = helpers

def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    app_version = settings.get('app_version')
    settings['app_version'] = app_version
    config = Configurator(settings=settings)
    config.add_static_view('static', 'static', cache_max_age=3600)
    config.add_route('home', '/')
    config.add_subscriber(add_render_globals,BeforeRender)
    config.scan()
    return config.make_wsgi_app()

