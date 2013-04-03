from pyramid.response import Response
import pyramid.httpexceptions as exc
from pyramid.view import view_config

from geoadmin.models import Session, models_from_name
from geoadmin.models.bod import get_bod_model, computeHeader

import logging

class MapService(object):

    def __init__(self, request):
        self.request = request
        self.mapName = request.matchdict.get('map') # The topic
        self.cbName = request.params.get('cb')
        self.lang = request.params.get('lang') if request.params.get('lang') is not None else 'de'
        self.searchText = request.params.get('searchText')

    @view_config(route_name='mapservice', renderer='jsonp')    
    def index(self):
        model = get_bod_model(self.lang)
        results = computeHeader(self.mapName)
        query = Session.query(model).filter(model.maps.ilike('%%%s%%' % self.mapName))
        query = query.filter(model.fullTextSearch.ilike('%%%s%%' % self.searchText)) if self.searchText is not None else query
        layers = [layer.layerMetadata() for layer in query]
        results['layers'].append(layers)
        return results

    @view_config(route_name='identify', renderer='jsonp')
    def identify(self):
        features = list()
        self.validateIdentifyParameters()
        layers = self.request.params.get('layers','all')
        models = self.getModelsFromLayerName(layers)
        queries = list(self.buildQueries(models))
        for query in queries:
            for feature in query:
                features.append(feature.id)
        #attributes = self.getAttributes()
        return features

    def buildQueries(self, models):
        for model in models:
            geom_filter = model[0].geom_filter(None, self.geometry, self.geometryType)
            query = Session.query(model[0]).filter(geom_filter)
            yield query

    def getModelsFromLayerName(self, layers):
        if layers == 'all':
            self.layers = self.getLayerListFromMap()
        else:
            self.layers = layers.split(':')[1].split(',')
        models = [models_from_name(layer) for layer in self.layers]
        return models

    def validateIdentifyParameters(self):
        self.geometry = [float(coord) for coord in self.request.params.get('geometry').split(',')]
        self.geometryType = self.request.params.get('geometryType')
        self.imageDisplay = self.request.params.get('imageDisplay').split(',')
        if (self.geometry or self.geometryType or self.imageDisplay) is None:
            raise exc.HTTPBadRequest('Parameters misconfiguration')

    def getLayerListFromMap(self):
        model = self.getBodModel()
        query = Session.query(model.idBod).filter(model.maps.ilike('%%%s%%' % self.mapName))
        return [idBod for idBod in query]

    def getAttributes(self, model):
        attributes = dict()
        for col in self.model.__table__.columns:
            attributes[col.key] = col
        return attributes
