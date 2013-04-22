# -*- coding: utf-8 -*-

from geoadmin.models import  *
from geoadmin.models.vector import Vector

Base = bases['bafu']

class BLN(Base, Vector):
    # view in a schema
    __tablename__ = 'bln'
    __table_args__ = ({'schema': 'bundinv', 'autoload': True})
    __template__ = 'tooltips/bln.mako'
    __esriId__ = 1000
    __bodId__ = 'ch.bafu.bundesinventare-bln'
    __displayFieldName__ = 'bln_name'
    id = Column('gid', Integer, primary_key=True)
    the_geom = Column(Geometry)

register('ch.bafu.bundesinventare-bln', BLN)

class JB(Base, Vector):
    # view in a schema
    __tablename__ = 'jb'
    __table_args__ = ({'schema': 'bundinv', 'autoload': True})
    __template__ = 'tooltips/jb.mako'
    __esriId__ = 2000
    __bodId__ = 'ch.bafu.bundesinventare-jagdbanngebiete'
    __displayFieldName__ = 'jb_name'
    id = Column('gid', Integer, primary_key=True)
    the_geom = Column(Geometry)

register('ch.bafu.bundesinventare-jagdbanngebiete', JB)
