# -*- coding: utf-8 -*-

from geoadmin.tests.functional import TestsBase
from pyramid import testing

class TestMapServiceView(TestsBase):

    def test_index_no_parameters(self):
        resp = self.testapp.get('/rest/services/geoadmin/MapServer', status=200)
        self.failUnless(resp.content_type == 'application/json')

    def test_index_with_searchtext(self):
        resp = self.testapp.get('/rest/services/geoadmin/MapServer', params={'searchText':'wasser'}, status=200)
        self.failUnless(resp.content_type == 'application/json')

    def test_index_with_cb(self):
        resp = self.testapp.get('/rest/services/geoadmin/MapServer', params={'cb':'cb'}, status=200)
        self.failUnless(resp.content_type == 'application/javascript')

    def test_index_with_cb(self):
        resp = self.testapp.get('/rest/services/geoadmin/MapServer', params={'cb':'cb'}, status=200)
        self.failUnless(resp.content_type == 'application/javascript')

    def test_identify_no_parameters(self):
        resp = self.testapp.get('/rest/services/geoadmin/MapServer/identify', status=400)

    def test_identify_without_geometry(self):
        params = {'geometryType': 'esriGeometryEnvelope', 'imageDisplay': '500,600,96', 'mapExtent': '548945.5,147956,549402,148103.5', 'tolerance': '1', 'layers': 'all'}
        resp = self.testapp.get('/rest/services/bafu/MapServer/identify', params=params, status=400)
        resp.mustcontain('Please provide the parameter geometry')

    def test_identify_without_geometrytype(self):
        params = {'geometry': '548945.5,147956,549402,148103.5', 'imageDisplay': '500,600,96', 'mapExtent': '548945.5,147956,549402,148103.5', 'tolerance': '1', 'layers': 'all'}
        resp = self.testapp.get('/rest/services/bafu/MapServer/identify', params=params, status=400)
        resp.mustcontain('Please provide the parameter geometryType')

    def test_identify_without_imagedisplay(self):
        params = {'geometry': '548945.5,147956,549402,148103.5', 'geometryType': 'esriGeometryEnvelope', 'mapExtent': '548945.5,147956,549402,148103.5', 'tolerance': '1', 'layers': 'all'}
        resp = self.testapp.get('/rest/services/bafu/MapServer/identify', params=params, status=400)
        resp.mustcontain('Please provide the parameter imageDisplay')

    def test_identify_without_mapextent(self):
        params = {'geometry': '548945.5,147956,549402,148103.5', 'geometryType': 'esriGeometryEnvelope', 'imageDisplay': '500,600,96', 'tolerance': '1', 'layers': 'all'}
        resp = self.testapp.get('/rest/services/bafu/MapServer/identify', params=params, status=400)
        resp.mustcontain('Please provide the parameter mapExtent')

    def test_identify_without_tolerance(self):
        params = {'geometry': '548945.5,147956,549402,148103.5', 'geometryType': 'esriGeometryEnvelope', 'imageDisplay': '500,600,96', 'mapExtent': '548945.5,147956,549402,148103.5', 'layers': 'all'}
        resp = self.testapp.get('/rest/services/bafu/MapServer/identify', params=params, status=400)
        resp.mustcontain('Please provide the parameter tolerance')

    def test_identify_valid(self):
        params = {'geometry': '548945.5,147956,549402,148103.5', 'geometryType': 'esriGeometryEnvelope', 'imageDisplay': '500,600,96', 'mapExtent': '548945.5,147956,549402,148103.5', 'tolerance': '1', 'layers': 'all'}
        resp = self.testapp.get('/rest/services/bafu/MapServer/identify', params=params, status=200)
        self.failUnless(resp.content_type == 'application/json')

    def test_identify_valid_with_cb(self):
        params = {'geometry': '548945.5,147956,549402,148103.5', 'geometryType': 'esriGeometryEnvelope', 'imageDisplay': '500,600,96', 'mapExtent': '548945.5,147956,549402,148103.5', 'tolerance': '1', 'layers': 'all', 'cb': 'cb'}
        resp = self.testapp.get('/rest/services/bafu/MapServer/identify', params=params, status=200)
        self.failUnless(resp.content_type == 'application/javascript')

    def test_identify_with_searchtext(self):
        params = {'geometry': '548945.5,147956,549402,148103.5', 'geometryType': 'esriGeometryEnvelope', 'imageDisplay': '500,600,96', 'mapExtent': '548945.5,147956,549402,148103.5', 'tolerance': '1', 'layers': 'all:ch.bafu.bundesinventare-bln', 'searchText': 'pied'}
        resp = self.testapp.get('/rest/services/bafu/MapServer/identify', params=params, status=200)
        self.failUnless(resp.content_type == 'application/json')
        self.failUnless(len(resp.json) == 1)

    def test_getfeature_wrong_idlayer(self):
        resp = self.testapp.get('/rest/services/bafu/MapServer/toto/362', status=400)
        resp.mustcontain('Please provide a valid layer Id')
