# -*- coding: utf-8 -*-
from unittest import TestCase
from nose.plugins.attrib import attr

from pyramid import testing


@attr(functional=True)
class TestLayersView(TestCase):
    
    
    def _create_dummy_request(self, params=None):
        request = testing.DummyRequest(params=params)
        return request

    def test_layers_bad_method(self):
        from geoadmin.views import layers

        request = testing.DummyRequest()

        response = layers.layers(request)
        self.assertEquals(response.status_int, 400)

    def test_layers_bad_request(self):
        from geoadmin.views import layers

        request = testing.DummyRequest()
        request.method = 'POST'

        response = layers.layers(request)
        self.assertEquals(response.status_int, 400)

    def test_no_id(self):
        from json import loads
        from geoadmin.views import layers

        request = self._create_dummy_request(params=dict(id='foo'))
        resp = layers.layers(request)

        self.failUnless('Not found' not in resp.body)
