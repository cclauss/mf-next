# -*- coding: utf-8 -*-

from pyramid.mako_templating import renderer_factory as mako_renderer_factory
from pyramid.config import Configurator
from pyramid.events import BeforeRender, NewRequest
from geoadmin.subscribers import add_localizer, add_renderer_globals
from pyramid.renderers import JSONP

from geoadmin.models import initialize_sql

def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    app_version = settings.get('app_version')
    settings['app_version'] = app_version
    config = Configurator(settings=settings)

    # configure 'locale' dir as the translation dir for geoadmin app
    config.add_translation_dirs('geoadmin:locale/')
    config.add_subscriber(add_localizer, NewRequest)
    config.add_subscriber(add_renderer_globals, BeforeRender)

    config.add_renderer('.html', mako_renderer_factory)
    config.add_renderer('.js', mako_renderer_factory)
    config.add_renderer('jsonp', JSONP(param_name='cb', indent=4))
    initialize_sql(settings)

    # Static config
    config.add_static_view('static', 'geoadmin:static', cache_max_age=3600)
    config.add_route('home', '/')
    config.add_route('testi18n', '/testi18n')
    config.add_route('api', '/loader.js')
    config.add_view(route_name='home', renderer='templates/index.pt', http_cache=0)
    config.add_view(route_name='testi18n', renderer='geoadmin:templates/testi18n.mako', http_cache=0)
    config.add_view(route_name='api', renderer='geoadmin:templates/loader.js', http_cache=0)

    # Application specific
    config.add_route('mapservice', '/rest/services/{map}/MapServer')
    config.add_route('identify', '/rest/services/{map}/MapServer/identify')
    config.add_route('getfeature', '/rest/services/{map}/MapServer/{idlayer}/{idfeature}')
    config.add_route('htmlpopup', '/rest/services/{map}/MapServer/{idlayer}/{idfeature}/htmlpopup')

    # Checker section
    config.add_route('checker_api', '/checker_api')

    config.scan(ignore='geoadmin.tests') # required to find code decorated by view_config
    return config.make_wsgi_app()
