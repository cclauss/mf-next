/*global ga: true, describe: true, it: true, expect: true, beforeEach: true, afterEach: true, sinon:true */


describe('ga.net.SwissSearch', function () {
    'use strict';

    describe('the swiss search component', function () {
        var mySS = null;

        beforeEach(function () {
            mySS = new ga.net.SwissSearch();
        });

        afterEach(function () {
            mySS = null;
        });

        it('can be created', function () {
            expect(mySS).not.to.be(undefined);
            expect(mySS).to.be.a(ga.net.SwissSearch);
        });

        /* //TODO
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
            mySS.addEventListener(ga.net.SwissSearch.EventType.DONE, spy);
            mySS.query('maisonnex');

            expect(spy.called).to.be(false);
        });

        //TODO stubs to not tap the internet...then reduce timeout.
        it('aborts a request if a second is directly followed', function (done) {
            var spy = null, ev = null;
            var callback = function (e) {
                ev = e;
            };

            setTimeout( function () {
                expect(ev).not.to.be(null);
                expect(spy).not.to.be(null);
                expect(spy.callCount).to.be(1);
                done();
            }, 1000);

            spy = sinon.spy(callback);
            mySS.addEventListener(ga.net.SwissSearch.EventType.DONE, spy);
            //even though we don't get a callback, the query is send out, which shouldn't happen...
            mySS.query('maisonnex');
            mySS.query('raron');

        });
    });
});

