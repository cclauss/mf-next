# -*- coding: utf-8 -*-

"""Pyramid application test package
"""

import os
from ConfigParser import ConfigParser

mapserv_url = None
db_url = None

curdir = os.path.dirname(os.path.abspath(__file__))
configfile = os.path.realpath(os.path.join(curdir, 'test.ini'))

if os.path.exists(configfile):
    cfg = ConfigParser()
    cfg.read(configfile)
    db_url = cfg.get('test', 'sqlalchemy.url')


def setUpCommon():
    # if test.in does not exist (because the z3c.recipe.filetemplate
    # part hasn't been executed) then db_url is None
    if db_url is None:  # pragma: nocover
        return

    # verify that we have a working database connection before going
    # forward
    from sqlalchemy import create_engine
    from sqlalchemy.exc import OperationalError
    engine = create_engine(db_url)
    try:
        engine.connect()
    except OperationalError:  # pragma: nocover
        return

    #import sqlahelper
    #sqlahelper.add_engine(engine)

    from geoadmin.models import Base
    #Base.metadata.create_all()


def tearDownCommon():

    # if test.in does not exist (because the z3c.recipe.filetemplate
    # part hasn't been executed) then db_url is None
    if db_url is None:  # pragma: nocover
        return

    # verify that we have a working database connection before going
    # forward
    from sqlalchemy import create_engine
    from sqlalchemy.exc import OperationalError
    engine = create_engine(db_url)
    try:
        engine.connect()
    except OperationalError:  # pragma: nocover
        return

    from geoadmin.models import Base
    #Base.metadata.drop_all(checkfirst=True)

    #import sqlahelper
    #sqlahelper.reset()

