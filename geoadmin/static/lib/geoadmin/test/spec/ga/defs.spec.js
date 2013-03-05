/*global ga: true, describe: true, it: true, expect: true */

describe('ga.Defs', function () {
    'use strict';

    describe('the ga.Defs object', function () {
        it('should be a singleton', function () {
            expect(ga.Defs.getInstance()).toEqual(ga.Defs.getInstance());
        });

        it('should point to the correct web protocol', function () {
            expect(ga.Defs.getInstance().protocol()).toEqual(document.location.protocol);
        });
    });
});

