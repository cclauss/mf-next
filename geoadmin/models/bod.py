from sqlalchemy import Column
from sqlalchemy import Unicode
from sqlalchemy import Integer
from sqlalchemy import Text 

from geoadmin.models import  bases

Base = bases['bod']



class BodLayerFr(Base):
    __tablename__ = 'view_bod_layer_info_fr'
    #__table_args__ = ({'autoload': True})
    id = Column('bod_layer_id', Text, primary_key=True)
    bezeichnung = Column('bezeichnung', Text)
    abstract = Column('abstract', Text)
