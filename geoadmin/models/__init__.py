from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy import engine_from_config

__all__ = ['engines', 'sessions', 'bases']

dbs = ('bod','bafu','search','stopo',)

engines = {}
sessions = {}
bases = {}

for db in dbs:
    sessions[db] = scoped_session(sessionmaker())
    bases[db] = declarative_base()

def initialize_sql(settings):
    for db in dbs:
        engine = engine_from_config(settings, 'sqlalchemy.%s.' % db)
        engines[db] = engine
        sessions[db] = sessions[db].configure(bind=engine)
        bases[db].metadata.bind = engine

