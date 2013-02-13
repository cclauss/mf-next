mf-next
=======

The next generation geo.admin.ch API

# Getting started

Checkout the source code:

    git clone https://github.com/geoadmin/mf-next.git

or when you're using ssh key (see https://help.github.com/articles/generating-ssh-keys):

    git clone git://github.com/geoadmin/mf-next.git

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

### Frameworks & Libraries
What frameworks are we going to use. Closure library? AngularJS? jQuery? Ext? Do we need an additional structural library? (OL3 uses the very basice closure library structures)
Let's not forget mobile!

### Testing
What testing framework are we going to use?
How do we structure our tests?
Will we have continous integration (there are possibilities with github)?

### Project structure and code organisation
How do we structure our project, server-side and client-side?
Do we seperate API (our widgets) from your services (pyramids)? In other words, do we treat GeoAdmin API as a simple OL3 extension? It could have an impact on how we develope. Our current mode of development is kind of 'heavy'.
How do we _not_ seperate mobile and desktop?
Do we lint?

### Build System
Do we get rid of jsbuild and use closure compiler altogether?
How do we integrate closure compiler
Do we get rid of c2cgeoportal specific code and role our own papyrus/pyramdis 'egg'? (c2cgeoportal contains alot of code we likely will never use. As of now, mf-next is blown because of it)

## Project Structure
Short descirption of current project structure. Try to keep it up to date

## HowTos

### How to update submodules to track latest trunk

Update the local copy:

    git submodule foreach git pull origin master

Commit the new revisions of the submodules to the repository

    git commit -m "updated submodules..." .

Publish

    git push

Note: If you want to update individual submodules (to track branches or specific revisions), please refer to the official git documentation.



