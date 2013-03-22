/*global ga: true, describe: true, it: true, expect: true, beforeEach: true, sinon:true */


describe('ga.net.SwissSearch', function () {
    'use strict';

    describe('the swiss search component', function () {
        var mySS = null;

        beforeEach(function () {
            mySS = new ga.net.SwissSearch();
        });

        it('can be created', function () {
            expect(mySS).not.to.be(undefined);
            expect(mySS).to.be.a(ga.net.SwissSearch);
        });

        /*
         * The test below tabs our service directly and thus needs internet connection.
         * Therefore, it shouldn't be a unit test!
         * Added temporarely to demonstrating handling of spies and 
         * async code in mocha framework.
         * Note: sinon would also provied mocks/stubs to test without
         * internet connection, which is probably the right thing to do
         */

        it('returns correct event', function (done) {
            //tabs our service directly...should probably not be
            //a unit test. But added to illustrate callback handling in mocha
            //the magic is the done function (default timeout of 2000ms)
            var callback = function (e) {
                expect(e).to.be.a(ga.net.SwissSearch.Event);
                expect(e.type).to.be(ga.net.SwissSearch.EventType.DONE);
                expect(e.data()).not.to.be(null);
                expect(e.data()).to.have.property('results');
                expect(e.data().results).to.be.an('array');

                done();
            };

            var spy = sinon.spy(callback);
            mySS.addEventListener(ga.net.SwissSearch.EventType.DONE, callback);
            mySS.query('maisonnex');

            expect(spy.called).to.be(false);
        });
    });
});

