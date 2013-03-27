from sqlalchemy import Column
from sqlalchemy import Unicode
from sqlalchemy import Integer
from sqlalchemy import Text 

from geoadmin.models import  bases

Base = bases['bod']



class BodLayerDe(Base):
    __tablename__ = 'view_bod_layer_info_de'
    #__table_args__ = ({'autoload': True})
    id = Column('bod_layer_id', Text, primary_key=True)
    bezeichnung = Column('bezeichnung', Text)
    abstract = Column('abstract', Text)

class BodLayerFr(Base):
    __tablename__ = 'view_bod_layer_info_fr'
    #__table_args__ = ({'autoload': True})
    id = Column('bod_layer_id', Text, primary_key=True)
    bezeichnung = Column('bezeichnung', Text)
    abstract = Column('abstract', Text)

class BodLayerIt(Base):
    __tablename__ = 'view_bod_layer_info_it'
    #__table_args__ = ({'autoload': True})
    id = Column('bod_layer_id', Text, primary_key=True)
    bezeichnung = Column('bezeichnung', Text)
    abstract = Column('abstract', Text)

class BodLayerRm(Base):
    __tablename__ = 'view_bod_layer_info_rm'
    #__table_args__ = ({'autoload': True})
    id = Column('bod_layer_id', Text, primary_key=True)
    bezeichnung = Column('bezeichnung', Text)
    abstract = Column('abstract', Text)

class BodLayerEn(Base):
    __tablename__ = 'view_bod_layer_info_en'
    #__table_args__ = ({'autoload': True})
    id = Column('bod_layer_id', Text, primary_key=True)
    bezeichnung = Column('bezeichnung', Text)
    abstract = Column('abstract', Text)
