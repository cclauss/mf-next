mf-next
=======

The next generation geo.admin.ch API

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

Initialize submodules:

    git submodule init
    git submodule update

Create a build:

    buildout/bin/buildout

Create a developer specific build configuration:

    cp buildout_ltmoc.cfg buildout_xxx.cfg

Where xxx designates your specific buildout configuration. Don't forget to add this to git. To create the specific build:

  buildout/bin/buildout -c buildout_xxx.cfg

If you do this on mf1t, you need to make sure that a correct configuration exists under
    
    /var/www/vhosts/mf-next/conf

that points to your working directory. If all is well, you can reach your pages at:

    http://mf-next0t.bgdi.admin.ch/xxx/

## Todos - Questions - Decisions
This sections contains points that needs to be done, discussed and decided upon. Either describe them directly here or use the github wiki pages:
https://github.com/geoadmin/mf-next/wiki

* source code documentation automation* source code documentation automatio

## Project Structure
Short descirption of current project structure. Try to keep it up to date

Client part can be found here: https://github.com/geoadmin/mf-next/wiki/Developing-GeoAdmin-Client-API

## HowTos

### You're daily git workflow routine
https://github.com/geoadmin/mf-next/wiki/Git-Workflows


### How to have jshint checking javascript pre-commit

Add the following line to your **.git/hooks/pre-commit** file
    
    exec buildout/bin/buildout install jshint

You will be unable to commit when there are jshint errors in your javascript files.

Note: pre-commit hooks can't be shared across clones. One idea would be to establish a pre-recieve hook on the server to jshint our code.

### How to update submodules to track latest trunk

Update the local copy:

    git submodule foreach git pull origin master

Commit the new revisions of the submodules to the repository

    git commit -m "updated submodules..." .

Publish

    git push

Note: If you want to update individual submodules (to track branches or specific revisions), please refer to the official git documentation.



