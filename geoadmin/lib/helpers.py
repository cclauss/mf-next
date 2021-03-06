# -*- coding: utf-8 -*-

from pyramid.threadlocal import get_current_registry
from pyramid.i18n import get_locale_name

def versioned(path):
    version = get_current_registry().settings['app_version']
    if version is not None:
        if path.startswith('http'):
            return path.replace('wsgi','wsgi/' + version)
        else:
            return version + '/' + path
    else:
        return path

def locale_negotiator(request):
    lang = request.params.get('lang')
    settings = get_current_registry().settings
    languages = settings['available_languages'].split()
    if lang is None or lang not in languages:
        # the default_locale_name configuration variable
        return get_locale_name(request)
    return lang

def check_even(number):
    if number%2==0:
        return True
    return False

def round(val):
    import math
    return math.floor(val + 0.5)
