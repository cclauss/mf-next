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
