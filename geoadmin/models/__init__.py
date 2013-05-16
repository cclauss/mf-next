# -*- coding: utf-8 -*-

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import engine_from_config
from sqlalchemy import Column, Text, Integer, Unicode

from geoalchemy import Geometry
from papyrus.geo_interface import GeoInterface

dbs = ['bod','bafu','search','stopo']

engines = {}
bases = {}
bodmap = {}

for db in dbs:
    bases[db] = declarative_base(cls=GeoInterface)

def initialize_sql(settings):
    for db in dbs:
        engine = engine_from_config(settings, 'sqlalchemy.%s.' % db, pool_recycle = 55)
        engines[db] = engine
        bases[db].metadata.bind = engine

def register(name, klass):
    name = unicode(name)
    if name not in bodmap:
        bodmap[name] = []
        bodmap[name].append(klass)

def models_from_name(name):
    if name in bodmap:
        return bodmap[name]
    else:
        return None
