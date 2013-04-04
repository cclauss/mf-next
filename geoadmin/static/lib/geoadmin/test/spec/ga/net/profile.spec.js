
describe('ga.net.Profile', function () {
    'use strict';

    describe('the Profile component', function () {
        var myProfile = null;

        beforeEach(function () {
            myProfile = new ga.net.Profile();
        });

        afterEach(function () {
            myProfile = null;
        });

        it('can be created', function () {
            expect(myProfile).not.to.be(undefined);
            expect(myProfile).to.be.a(ga.net.Profile);
        });

    });
});

