from pyramid.response import Response
from pyramid.view import view_config

from geoadmin.models.bod import *
from geoadmin.models import sessions

import logging

DBSession = sessions['bod']

class MapService(object):

    def __init__(self, request):
        self.request = request
        self.mapName = request.matchdict.get('map') # The topic
        self.lang = request.matchdict.get('lang', None) if request.matchdict.get('lang', None) is not None else 'de'
        self.model = self.getModel()
        #self.attributes = self.getAttributes()

    @view_config(route_name='mapservice', renderer='json')    
    def index(self):
        results = computeHeader(self.mapName)
        session = DBSession.query(self.model).filter(self.model.maps.ilike('%%%s%%' % self.mapName))
        layers = [layer.layerMetadata() for layer in session]
        results['layers'].append(layers)
        return results

    def getAttributes(self):
        attributes = dict()
        for col in self.model.__table__.columns:
            attributes[col.key] = col
        return attributes

    def getModel(self):
        if self.lang == 'fr':
            return BodLayerFr
        elif self.lang == 'it':
            return BodLayerIt
        elif self.lang == 'en':
            return BodLayerEn
        else:
            return BodLayerDe
