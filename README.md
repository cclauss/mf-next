mf-next
=======

The next generation geo.admin.ch API

[![Build Status](https://travis-ci.org/geoadmin/mf-next.png?branch=master)](https://travis-ci.org/geoadmin/mf-next)

# Getting started

Checkout the source code:

    git clone https://github.com/geoadmin/mf-next.git

or when you're using ssh key (see https://help.github.com/articles/generating-ssh-keys):

    git clone git@github.com:geoadmin/mf-next.git

Make sure that all submodules are up to date:

    cd mf-next
    git submodule update --init

Bootstrap your build environment:

    python bootstrap.py --version 1.5.2 --distribute --download-base http://pypi.camptocamp.net/distribute-0.6.22_fix-issue-227/ --setup-source http://pypi.camptocamp.net/distribute-0.6.22_fix-issue-227/distribute_setup.py

Create a developer specific build configuration:

    cp buildout_ltmoc.cfg buildout_xxx.cfg

Where xxx designates your specific buildout configuration. Don't forget to add this to git. To create the specific build:

  buildout/bin/buildout -c buildout_xxx.cfg

If you do this on mf1t, you need to make sure that a correct configuration exists under
    
    /var/www/vhosts/mf-next/conf

that points to your working directory. If all is well, you can reach your pages at:

    http://mf-next0t.bgdi.admin.ch/xxx/

## Todos - Questions - Decisions
This section contains points that needs to be done, discussed and decided upon. Either describe them directly here or use the github wiki pages:
https://github.com/geoadmin/mf-next/wiki

* automate adding of unit tests to testing document (run_test.html and run_test_debug.html)
* source code documentation automation
* create eventing support in ga. see ga.net.SwissSearch component. The EventType enum and the Event calls could be generalised and re-used inside our ga namespace.

## Project Structure
Short description of current project structure. Try to keep it up to date.

Client part can be found here: https://github.com/geoadmin/mf-next/wiki/Developing-GeoAdmin-Client-API

## HowTos

### Your daily git workflow routine
https://github.com/geoadmin/mf-next/wiki/Git-Workflows


### How to have jshint checking javascript pre-commit

Add the following line to your **.git/hooks/pre-commit** file
    
    exec buildout/bin/buildout install jshint

You will be unable to commit when there are jshint errors in your javascript files.

Note: pre-commit hooks can't be shared across clones. One idea would be to establish a pre-recieve hook on the server to jshint our code.

### Run javascript unit tests during development

JavaScript unit tests are included in the standard buildout (`[js-tests]` and
`[js-tests-debug]` targets). In addition to this, it's possible to run javascript
tests during development in watch mode with:

    ./buildout/node_modules/karma/bin/karma start geoadmin/static/lib/geoadmin/test/karma_conf_debug.js

This will launch karma in watch mode. Any changes to files will relaunch the tests automatically.

### How to update submodules to track latest trunk

Update the local copy:

    git submodule foreach git pull origin master

Commit the new revisions of the submodules to the repository

    git commit -m "updated submodules..." .

Publish

    git push

Note: If you want to update individual submodules (to track branches or specific revisions), please refer to the official git documentation.

### How to discard new commits in submodules (before rebasing for instance)

    git submodule update

## How to develop with pyramid

    buildout/bin/pserve development.ini --reload

