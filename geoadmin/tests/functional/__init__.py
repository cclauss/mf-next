# -*- coding: utf-8 -*-

from unittest import TestCase

class TestsBase(TestCase):

    def setUp(self):
        from paste.deploy import loadapp
        import os
        current = os.path.dirname( __file__ )
        app = loadapp('config:' + current.replace('geoadmin/tests/functional', 'development.ini'))
        from webtest import TestApp
        self.testapp = TestApp(app)
