from geoadmin.models import  *

Base = bases['bafu']



class BLN(Base):
    # view in a schema
    __tablename__ = 'bln'
    __table_args__ = ({'schema': 'bundinv', 'autoload': True})
    __template__ = 'tooltips/bln.mako'
    __esriId__ = 1000
    id = Column('gid', Integer, primary_key=True)
    the_geom = Column(Geometry)

register('ch.bafu.bundesinventare-bln', BLN)

class JB(Base):
    # view in a schema
    __tablename__ = 'jb'
    __table_args__ = ({'schema': 'bundinv', 'autoload': True})
    __template__ = 'tooltips/jb.mako'
    __esriId__ = 2000

    id = Column('gid', Integer, primary_key=True)
    the_geom = Column(Geometry)

register('ch.bafu.bundesinventare-jagdbanngebiete', JB)
