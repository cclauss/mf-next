from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy import engine_from_config
from sqlalchemy import Column, Text, Integer, Unicode

from geoalchemy import Geometry

dbs = ('bod','bafu','search','stopo',)

engines = {}
sessions = {}
bases = {}

bodmap = {}

for db in dbs:
    sessions[db] = scoped_session(sessionmaker())
    bases[db] = declarative_base()

def initialize_sql(settings):
    for db in dbs:
        engine = engine_from_config(settings, 'sqlalchemy.%s.' % db)
        engines[db] = engine
        sessions[db] = sessions[db].configure(bind=engine)
        bases[db].metadata.bind = engine

def register(name, klass):
    name = unicode(name)
    if name not in bodmap:
        bodmap[name] = []
        bodmap[name].append(klass)

def models_from_name(name):
    if name in meta.bodmap:
        return meta.bodmap[name]
    else:
        return []
