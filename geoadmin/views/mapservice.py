from pyramid.response import Response
import pyramid.httpexceptions as exc
from pyramid.view import view_config

from geoadmin.models.bod import *
from geoadmin.models import sessions, models_from_name

import logging


BodSession = sessions['bod']

class MapService(object):

    def __init__(self, request):
        self.request = request
        self.mapName = request.matchdict.get('map') # The topic
        self.cbName = request.params.get('cb')
        self.lang = request.params.get('lang') if request.params.get('lang') is not None else 'de'
        self.searchText = request.params.get('searchText')

    @view_config(route_name='mapservice', renderer='jsonp')    
    def index(self):
        model = self.getBodModel()
        results = computeHeader(self.mapName)
        query = BodSession.query(model).filter(model.maps.ilike('%%%s%%' % self.mapName))
        query = query.filter(model.fullTextSearch.ilike('%%%s%%' % self.searchText)) if self.searchText is not None else query
        layers = [layer.layerMetadata() for layer in query]
        results['layers'].append(layers)
        return results

    @view_config(route_name='identify', renderer='jsonp')
    def identify(self):
        self.validateIdentifyParameters()
        layers = self.request.params.get('layers','all')
        self.validateVectorResources(layers)
        #attributes = self.getAttributes()
        return self.layers

    def validateVectorResources(self, layers):
        if layers == 'all':
            self.layers = self.getLayerListFromMap()

    def validateIdentifyParameters(self):
        self.geometry = self.request.params.get('geometry')
        self.geometryType = self.request.params.get('geometryType')
        self.imageDisplay = self.request.params.get('imageDisplay')
        if (self.geometry or self.geometryType or self.imageDisplay) is None:
            raise exc.HTTPBadRequest('Parameters misconfiguration')

    def getLayerListFromMap(self):
        model = self.getBodModel()
        query = BodSession.query(model.idBod).filter(model.maps.ilike('%%%s%%' % self.mapName))
        return [idBod for idBod in query]

    def getAttributes(self, model):
        attributes = dict()
        for col in self.model.__table__.columns:
            attributes[col.key] = col
        return attributes

    def getBodModel(self):
        if self.lang == 'fr':
            return BodLayerFr
        elif self.lang == 'it':
            return BodLayerIt
        elif self.lang == 'en':
            return BodLayerEn
        else:
            return BodLayerDe
