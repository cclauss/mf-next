from pyramid.view import view_config
import pyramid.httpexceptions as exc

from geoadmin.models import Session, models_from_name
from geoadmin.models.bod import get_bod_model, computeHeader
from geoadmin.lib.helpers import check_even

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
        self.validateGeometry()
        self.validateGeometryType()
        self.validateImageDisplay()
        features = list()
        returnGeometry = self.request.params.get('returnGeometry')
        layers = self.request.params.get('layers','all')
        models = self.getModelsFromLayerName(layers)
        queries = list(self.buildQueries(models))
        for query in queries:
            for feature in query:
                feature = feature.featureMetadata(returnGeometry)
                features.append(feature)
        return {'results': features}

    def buildQueries(self, models):
        for layer in models:
            for model in layer:
                geom_filter = model.geom_filter(None, self.geometry, self.geometryType)
                query = Session.query(model).filter(geom_filter)
                yield query

    def getModelsFromLayerName(self, layers):
        if layers == 'all':
            self.layers = self.getLayerListFromMap()
        else:
            self.layers = layers.split(':')[1].split(',')
        models = [models_from_name(layer) for layer in self.layers]
        return models

    def getLayerListFromMap(self):
        model = get_bod_model(self.lang)
        query = Session.query(model.idBod).filter(model.maps.ilike('%%%s%%' % self.mapName))
        return [idBod for idBod in query]

    # Validation methods section
    def validateGeometry(self):
        geom = self.request.params.get('geometry')
        if geom is None:
            raise exc.HTTPBadRequest('Please provide the parameter geometry')
        geom = geom.split(',')
        if check_even(len(geom)) is False:
            raise exc.HTTPBadRequest('Please provide an even number of float numbers for the parameter geometry')
        try:
            self.geometry = map(float, geom)
        except ValueError:
            raise exc.HTTPBadRequest('Please provide numerical values in a comma separated list for the parameter geometry')

    def validateGeometryType(self):
        esriTypes = ['esriGeometryPoint', 'esriGeometryPolyline', 'esriGeometryPolygon', 'esriGeometryEnvelope']
        self.geometryType = self.request.params.get('geometryType')
        if self.geometryType is None:
            raise exc.HTTPBadRequest('Please provide the parameter geometryType')
        if self.geometryType not in esriTypes:
            raise exc.HTTPBadRequest('Please provide a valid geometry type')

    def validateImageDisplay(self):
        imgDisplay = self.request.params.get('imageDisplay')
        if imgDisplay is None:
            raise exc.HTTPBadRequest('Please provide the parameter imageDisplay')
        imgDisplay = imgDisplay.split(',')
        if len(imgDisplay) != 3:
            raise exc.HTTPBadRequest('Please provide the parameter imageDisplay in a comma separated list of 3 arguments')
        try:
            self.imageDisplay = map(float, imgDisplay)
        except ValueError:
            raise exc.HTTPBadRequest('Please provide numerical values for the parameter imageDisplay')
