/*global ga: true, describe: true, it: true, expect: true */

describe('ga.defs', function () {
    'use strict';

    describe('the ga.defs object', function () {
        it('should point to the correct web protocol', function () {
            expect(ga.defs.protocol()).to.be(document.location.protocol);
        });
    });
});

