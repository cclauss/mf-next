
goog.provide('ga.ui.Accordeon');

goog.require('goog.ui.Control');
goog.require('goog.dom');
goog.require('goog.array');
goog.require('goog.ui.AnimatedZippy');


var ZippyHelper = function (id, parent) {
    'use strict';

    this.div = goog.dom.createDom(goog.dom.TagName.DIV, {
        'class': 'ga-zippy',
        'id': id
    });
    this.h = goog.dom.createDom(goog.dom.TagName.H1, {
        'class': 'ga-zippy-header',
        'id': id + '-header'
    });
    goog.dom.appendChild(this.div, this.h);
    this.c = goog.dom.createDom(goog.dom.TagName.P, {
        'class': 'ga-zippy-content',
        'id': id + '-content'
    });
    goog.dom.appendChild(this.div, this.c);

    if (parent) {
        goog.dom.appendChild(parent, this.div);
    }
};

/**
 * @constructor
 * @extends {goog.ui.Component}
 */
ga.ui.Accordeon = function () {
    'use strict';

    goog.ui.Control.call(this, null);

    this.addClassName(goog.getCssName('ga-accordeon'));
    this.zippies_ = [];
};

goog.inherits(ga.ui.Accordeon, goog.ui.Control);

ga.ui.Accordeon.prototype.createDom = function () {
    'use strict';

    ga.ui.Accordeon.superClass_.createDom.call(this);

    //adding headers and contents of our zippiesa
    var parent = this.getElement();
    this.zippies_.push(new ZippyHelper('ga-zippy-1', parent));
    this.zippies_.push(new ZippyHelper('ga-zippy-2', parent));
    this.zippies_.push(new ZippyHelper('ga-zippy-2', parent));
    var temp = [];
    var count = 1;
    var randomText= 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Cras et nisi id' +
                    'lorem tempor semper. Suspendisse ante. Integer ligula urna, venenatis quis,' +
                    'placerat vitae, commodo quis, sapien. Quisque nec lectus. Sed non dolor. Sed' +
                    'congue, nisi in pharetra consequat, odio diam pulvinar arcu, in laoreet elit' +
                    'risus id ipsum. Class aptent taciti sociosqu ad litora torquent per conubia' +
                    'nostra, per inceptos hymenaeos. Praesent tellus enim, imperdiet a, sagittis' +
                    'id, pulvinar vel, tortor. Integer nulla. Sed nulla augue, lacinia id,' +
                    'vulputate eu, rhoncus non, ante. Integer lobortis eros vitae quam. Phasellus' +
                    'sagittis, ipsum sollicitudin bibendum laoreet, arcu erat luctus lacus, vel' +
                    'pharetra felis metus tincidunt diam. Cras ac augue in enim ultricies aliquam.';

    goog.array.forEach(this.zippies_, function (zippy) {
        zippy.h.innerHTML = 'This is zippy number ' + count;
        zippy.c.innerHTML = randomText;
        temp.push(new goog.ui.AnimatedZippy(zippy.h, zippy.c, false));
        count += 1;
    });

};

