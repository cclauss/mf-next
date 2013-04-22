# -*- coding: utf-8 -*-

import pyramid

def versioned(path):
    version = pyramid.threadlocal.get_current_registry().settings['app_version']
    if version is not None:
        if path.startswith('http'):
            return path.replace('wsgi','wsgi/' + version)
        else:
            return version + '/' + path
    else:
        return path

def check_even(number):
    if number%2==0:
        return True
    return False
