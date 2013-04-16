import os

from setuptools import setup, find_packages

here = os.path.abspath(os.path.dirname(__file__))
README = open(os.path.join(here, 'README.md')).read()
CHANGES = open(os.path.join(here, 'CHANGES.txt')).read()

requires = [
    'webtest',
    'pyramid',
    'pyramid_debugtoolbar',
    'waitress',
    'psycopg2',
    'SQLAlchemy',
    'geoalchemy',
    'transaction',
    'pyramid_tm',
    'geojson',
    'shapely',
    'Babel',
    'httplib2',
    'nose',
    'coverage',
    'PyYAML',
    ]

setup(name='geoadmin',
      version='0.0.1',
      description='geoadmin',
      long_description=README + '\n\n' + CHANGES,
      classifiers=[
        "Programming Language :: Python",
        "Framework :: Pyramid",
        "Topic :: Internet :: WWW/HTTP",
        "Topic :: Internet :: WWW/HTTP :: WSGI :: Application",
        ],
      author='',
      author_email='',
      url='',
      keywords='web pyramid pylons',
      packages=find_packages(),
      package_data = {'geoadmin': ['locale/*/LC_MESSAGES/*.mo']},
      include_package_data=True,
      zip_safe=False,
      install_requires=requires,
      tests_require=requires,
      test_suite="geoadmin",
      entry_points="""\
      [paste.app_factory]
      main = geoadmin:main
      """,
      )
