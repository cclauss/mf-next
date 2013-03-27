from pyramid.response import Response
from pyramid.view import view_config

from geoadmin.models.bod import *
from geoadmin.models import sessions

import logging

DBSession = sessions['bod']

class MapService(object):

    def __init__(self, request):
        self.request = request
        self.map = request.matchdict.get('map')
        self.lang = request.matchdict.get('lang', None) if request.matchdict.get('lang', None) is not None else 'de'
        self.model = self.getModel()

    @view_config(route_name='mapservice', renderer='json')    
    def index(self):
        layers = DBSession.query(self.model)
        results = [i.id for i in layers]
        return results

    def getModel(self):
        if self.lang == 'fr':
            return BodLayerFr
        elif self.lang == 'it':
            return BodLayerIt
        elif self.lang == 'en':
            return BodLayerEn
        else:
            return BodLayerDe
