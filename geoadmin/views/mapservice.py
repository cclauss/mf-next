# -*- coding: utf-8 -*-

from pyramid.view import view_config

from geoadmin.models import Session, models_from_name
from geoadmin.models.bod import get_bod_model, computeHeader
from geoadmin.lib.helpers import locale_negotiator
from geoadmin.lib.validation import (
    validateGeometry, validateGeometryType, 
    validateImageDisplay, validateMapExtent,
    validateTolerance, validateLayerId)

import logging
logging.basicConfig()
logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)

class MapService(object):

    def __init__(self, request):
        self.request = request
        self.mapName = request.matchdict.get('map') # The topic
        self.cbName = request.params.get('cb')
        self.lang = locale_negotiator(request)
        self.searchText = request.params.get('searchText')
        self.translate = request.translate

    @view_config(route_name='mapservice', renderer='jsonp')    
    def index(self):
        model = get_bod_model(self.lang)
        results = computeHeader(self.mapName)
        session = Session()
        query = session.query(model).filter(model.maps.ilike('%%%s%%' % self.mapName))
        query = self.fullTextSearch(query, model.fullTextSearch)
        layers = [layer.layerMetadata() for layer in query]
        session.close()
        results['layers'].append(layers)
        return results

    @view_config(route_name='identify', renderer='jsonp')
    def identify(self):
        self.geometry = validateGeometry(self.request)
        self.geometryType = validateGeometryType(self.request)
        self.imageDisplay = validateImageDisplay(self.request)
        self.mapExtent = validateMapExtent(self.request)
        self.tolerance = validateTolerance(self.request)
        returnGeometry = self.request.params.get('returnGeometry')
        layers = self.request.params.get('layers','all')
        models = self.getModelsFromLayerName(layers)
        queries = list(self.buildQueries(models))
        features = list(self.getFeaturesFromQueries(returnGeometry, queries))
        return {'results': features}

    @view_config(route_name='getfeature', renderer='jsonp')
    def getfeature(self):
        idfeature = self.request.matchdict.get('idfeature')
        idlayer = self.request.matchdict.get('idlayer')
        model = validateLayerId(idlayer)[0]
        session = Session()
        query = session.query(model).filter(model.id==idfeature)
        feature = [
                _feature.featureMetadata(True, self.translate(_feature.__bodId__)) for
                _feature in query
        ]
        session.close()
        return {'feature': feature.pop()}

    @view_config(route_name='htmlpopup')
    def htmlpopup(self):
        idfeature = self.request.matchdict.get('idfeature')
        idlayer = self.request.matchdict.get('idlayer')
        model = validateLayerId(idlayer)[0]
        session = Session()
        query = session.query(model).filter(model.id==idfeature)
        from pyramid import mako_templating
        from mako.template import Template

    def fullTextSearch(self, query, orm_column):
        query = query.filter(
            orm_column.ilike('%%%s%%' % self.searchText)
        ) if self.searchText is not None else query
        return query

    def getFeaturesFromQueries(self, returnGeometry, queries):
       for query in queries:
            for feature in query:
                yield feature.featureMetadata(
                        returnGeometry,
                        self.translate(feature.__bodId__)
                      ) 

    def buildQueries(self, models):
        session = Session()
        for layer in models:
            for model in layer:
                geom_filter = model.geom_filter(
                    self.geometry,
                    self.geometryType,
                    self.imageDisplay,
                    self.mapExtent,
                    self.tolerance
                )
                query = session.query(model).filter(geom_filter)
                query = self.fullTextSearch(query, model.display_field())
                yield query
        session.close()

    def getModelsFromLayerName(self, layers_param):
        ''' As a layer can possess multiple models,
        this function returns lists of models within 
        a main list'''
        layers = self.getLayerListFromMap() if layers_param == 'all' else layers_param.split(':')[1].split(',')
        models = [
            validateLayerId(layer) for
            layer in layers
            if validateLayerId(layer) is not None
        ]
        return models

    def getLayerListFromMap(self):
        model = get_bod_model(self.lang)
        session = Session()
        query = Session.query(model).filter(
            model.maps.ilike('%%%s%%' % self.mapName)
        )
        # only return layers which have a model
        layerList = [
            q.idBod for
            q in query
            if models_from_name(q.idBod) is not None
        ]
        return layerList
