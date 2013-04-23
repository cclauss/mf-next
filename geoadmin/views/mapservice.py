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

    @view_config(route_name='getlegend', renderer='jsonp')
    def getlegend(self):
        from pyramid.renderers import render_to_response
        idlayer = self.request.matchdict.get('idlayer')
        model = get_bod_model(self.lang)
        session = Session()
        query = session.query(model).filter(model.maps.ilike('%%%s%%' % self.mapName))
        query = query.filter(model.idBod==idlayer)
        for layer in query:
            legend = {'layer': layer.layerMetadata()}
        session.close()
        response = render_to_response('geoadmin:templates/legend.mako',
                                        legend,
                                        request = self.request)
        if self.cbName is None:
            return response 
        else:
            return response.body
            

    # order matters, last route is the default!
    @view_config(route_name='identify', renderer='geojson', request_param='f=geojson')
    def view_identify_geosjon(self):
        return self.identify()


    @view_config(route_name='identify', renderer='esrijson')
    def view_identify_esrijson(self):
        return self.identify()


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
        for query in queries:
            for feature in query:
                #feature = feature.featureMetadata(returnGeometry)
                features.append(feature.__geo_interface__)
        return {'results': features} 

    @view_config(route_name='getfeature', renderer='jsonp')
    def getfeature(self):
        feature, template = self.getFeature()
        return feature

    @view_config(route_name='htmlpopup', renderer='jsonp')
    def htmlpopup(self):
        from pyramid.renderers import render_to_response
        feature, template = self.getFeature()
        response = render_to_response('geoadmin:' + template,
                                    feature,
                                    request = self.request)
        if self.cbName is None:
            return response
        else:
            return response.body

    def getFeature(self):
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
        feature = {'feature': feature.pop()} if len(feature) > 0 else {'feature': []}
        template = model.__template__
        return feature, template

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
            query.session.close() 

    def buildQueries(self, models):
        for layer in models:
            for model in layer:
                session = Session()
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
