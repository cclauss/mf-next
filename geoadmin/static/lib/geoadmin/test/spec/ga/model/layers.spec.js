/*global ga: true, describe: true, it: true, expect: true */


describe('ga.model.layers', function () {
    'use strict';

    describe('create layers definitions', function () {
        it('should have 2 definitions', function () {
            expect(ga.model.layers.length).to.be(3);
        });
    });
});

