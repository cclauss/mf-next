from pyramid.view import view_config

@view_config(route_name='home', renderer='../templates/index.pt', http_cache=0)
def my_view(request):
    return {'project': 'geoadmin'}
