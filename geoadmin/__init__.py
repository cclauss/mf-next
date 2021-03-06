# -*- coding: utf-8 -*-

from pyramid.mako_templating import renderer_factory as mako_renderer_factory
from pyramid.config import Configurator
from pyramid.events import BeforeRender, NewRequest
from geoadmin.subscribers import add_localizer, add_renderer_globals
from pyramid.renderers import JSONP
from sqlalchemy.orm import scoped_session, sessionmaker

from geoadmin.renderers import EsriJSON, CSVRenderer
from geoadmin.models import initialize_sql
from papyrus.renderers import GeoJSON

def db(request):
    maker = request.registry.dbmaker
    session = maker()
    
    def cleanup(request):
        session.close()
    request.add_finished_callback(cleanup)
    
    return session


def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    app_version = settings.get('app_version')
    settings['app_version'] = app_version
    config = Configurator(settings=settings)

    # ogcproxy
    import papyrus_ogcproxy
    config.include(papyrus_ogcproxy)

    # configure 'locale' dir as the translation dir for geoadmin app
    config.add_translation_dirs('geoadmin:locale/')
    config.add_subscriber(add_localizer, NewRequest)
    config.add_subscriber(add_renderer_globals, BeforeRender)

    # renderers
    config.add_renderer('.html', mako_renderer_factory)
    config.add_renderer('.js', mako_renderer_factory)
    config.add_renderer('jsonp', JSONP(param_name='cb', indent=4))
    config.add_renderer('geojson', GeoJSON(jsonp_param_name='cb'))
    config.add_renderer('esrijson', EsriJSON(jsonp_param_name='callback'))
    config.add_renderer('csv', CSVRenderer)

    # sql section
    config.registry.dbmaker = scoped_session(sessionmaker())
    config.add_request_method(db, reify=True)
    initialize_sql(settings)

    # Static config
    config.add_route('home', '/')
    config.add_route('testi18n', '/testi18n')
    config.add_route('api', '/loader.js')
    config.add_view(route_name='home', renderer='geoadmin:templates/index.pt', http_cache=0)
    config.add_view(route_name='testi18n', renderer='geoadmin:templates/testi18n.mako', http_cache=0)
    config.add_view(route_name='api', renderer='geoadmin:templates/loader.js', http_cache=0)

    # Application specific
    config.add_route('mapservice', '/rest/services/{map}/MapServer')
    config.add_route('identify', '/rest/services/{map}/MapServer/identify')
    config.add_route('getlegend', '/rest/services/{map}/MapServer/{idlayer}/getlegend')
    config.add_route('getfeature', '/rest/services/{map}/MapServer/{idlayer}/{idfeature}')
    config.add_route('htmlpopup', '/rest/services/{map}/MapServer/{idlayer}/{idfeature}/htmlpopup')
    config.add_route('wmtscapabilities', '/rest/services/{map}/1.0.0/WMTSCapabilities.xml')
    config.add_route('profile_json', '/rest/services/profile.json')
    config.add_route('profile_csv', '/rest/services/profile.csv')
    config.add_route('height', '/rest/services/height')

    config.add_route('geocodeservice','/rest/services/GeocodeServer')
    config.add_route('findaddresscandidates','/rest/services/GeocodeServer/findaddresscandidates')

    # Checker section
    config.add_route('checker_home', '/checker_home')
    config.add_route('checker_api', '/checker_api')

    config.scan(ignore='geoadmin.tests') # required to find code decorated by view_config
    config.add_static_view('static', 'geoadmin:static', cache_max_age=3600)
    return config.make_wsgi_app()
