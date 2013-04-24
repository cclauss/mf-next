# -*- coding: utf-8 -*-

from pyramid.view import view_config

from geoadmin.models import sessions, models_from_name
from geoadmin.models.bod import get_bod_model, computeHeader
from geoadmin.lib.helpers import locale_negotiator
from geoadmin.lib.validation import (
    validateGeometry, validateGeometryType, 
    validateImageDisplay, validateMapExtent,
    validateTolerance, validateLayerId)

import logging

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
        Session = sessions[model.__dbname__]
        query = Session.query(model).filter(model.maps.ilike('%%%s%%' % self.mapName))
        query = self.fullTextSearch(query, model.fullTextSearch)
        layers = [layer.layerMetadata() for layer in query]
        results['layers'].append(layers)
        return results

    @view_config(route_name='identify', renderer='jsonp')
    def identify(self):
        self.geometry = validateGeometry(self.request)
        self.geometryType = validateGeometryType(self.request)
        self.imageDisplay = validateImageDisplay(self.request)
        self.mapExtent = validateMapExtent(self.request)
        self.tolerance = validateTolerance(self.request)
        features = list()
        returnGeometry = self.request.params.get('returnGeometry')
        layers = self.request.params.get('layers','all')
        models = self.getModelsFromLayerName(layers)
        queries = list(self.buildQueries(models))
        for query in queries:
            for feature in query:
                feature = feature.featureMetadata(returnGeometry, self.translate(feature.__bodId__))
                features.append(feature)
        return {'results': features}

    @view_config(route_name='getfeature', renderer='jsonp')
    def getfeature(self):
        idfeature = self.request.matchdict.get('idfeature')
        idlayer = self.request.matchdict.get('idlayer')
        model = validateLayerId(idlayer)[0]
        Session = sessions[model.__dbname__]
        query = Session.query(model).filter(model.id==idfeature)
        for f in query:
            feature = f.featureMetadata(True, self.translate(f.__bodId__))
        return {'feature': feature}

    @view_config(route_name='htmlpopup')
    def htmlpopup(self):
        idfeature = self.request.matchdict.get('idfeature')
        idlayer = self.request.matchdict.get('idlayer')
        model = validateLayerId(idlayer)[0]
        Session = sessions[model.__dbname__]
        query = Session.query(model).filter(model.id==idfeature)
        from pyramid import mako_templating
        from mako.template import Template

    def fullTextSearch(self, query, orm_column):
        query = query.filter(orm_column.ilike('%%%s%%' % self.searchText)) if self.searchText is not None else query
        return query

    def buildQueries(self, models):
        for layer in models:
            for model in layer:
                geom_filter = model.geom_filter(self.geometry, self.geometryType, self.imageDisplay, self.mapExtent, self.tolerance)
                Session = sessions[model.__dbname__]
                query = Session.query(model).filter(geom_filter)
                query = self.fullTextSearch(query, model.display_field())
                yield query

    def getModelsFromLayerName(self, layers):
        if layers == 'all':
            self.layers = self.getLayerListFromMap()
        else:
            self.layers = layers.split(':')[1].split(',')
        models = list()
        for layer in self.layers:
            model = validateLayerId(layer)
            if model is not None:
                models.append(model)
        return models

    def getLayerListFromMap(self):
        model = get_bod_model(self.lang)
        Session = sessions[model.__dbname__]
        query = Session.query(model).filter(model.maps.ilike('%%%s%%' % self.mapName))
        # only return layers which have a model
        layerList = list()
        for q in query:
            if models_from_name(q.idBod) is not None:
                layerList.append(q.idBod)
        return layerList
