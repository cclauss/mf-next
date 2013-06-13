import os.path
from urlparse import urlparse
from httplib2 import Http
import Cookie

from pyramid.view import view_config

from pyramid.httpexceptions import (HTTPForbidden, HTTPBadRequest,
                                    HTTPBadGateway, HTTPNotAcceptable, HTTPMethodNotAllowed)
from pyramid.response import Response


@view_config(route_name='info')
def info(request):
    import httplib2
    h = httplib2.Http()
    url = 'http://api.geo.admin.ch/main/wsgi/print/info.json?' + request.query_string
    resp, data = h.request(url, "GET", headers={'referer':'http://mf-next0t.bgdi.admin.ch/'} )
    status = resp.status

    response = Response(data, status=status, headers={'Content-Type': resp.get('content-type')})

    return response



@view_config(route_name='print')
def printpdf(request):

    if request.method not in ('POST'):
        return HTTPMethodNotAllowed(detail='You may only POST to this service')

    status = 200

    headers = {}
    #headers["Content-Type"] = 'application/pdf'
    headers["Content-Type"] = 'application/octet-stream'
    headers["Accept-Ranges"]  = "bytes"
    headers['Content-Disposition'] =  'attachment'
    # we did use inline in the past 
    #if 'MSIE' in request.environ.get('HTTP_USER_AGENT'):
    #    headers['Content-Disposition'] =  'inline'

    if request.body:
        import httplib2
        h = httplib2.Http()
        url = 'http://map.geo.admin.ch/main/wsgi/print/pdf/print.pdf?'+ request.body 
        resp, data = h.request(url, "GET", headers={'referer':'http://mf-next0t.bgdi.admin.ch/'} )
        status = resp.status

    response = Response(data, status=status,
                        headers=headers)

    return response


