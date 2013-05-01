# -*- coding: utf-8 -*-

import httplib2
import urllib2
import logging
from urlparse import urlparse

from pyramid.httpexceptions import HTTPBadRequest
from pyramid.response import Response
from pyramid.view import view_config

@view_config(route_name='ogcproxy')
def ogcproxy(request):
    url = request.params.get('url')
    if url is None:
        HTTPBadRequest('Please provide a parameter url')        
