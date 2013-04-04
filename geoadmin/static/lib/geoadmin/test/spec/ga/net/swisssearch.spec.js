
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

        after(function () {
            goog.net.Jsonp.prototype.send.restore();
            goog.net.Jsonp.prototype.cancel.restore();
        });

        it('returns correct events', function () {
            var stub = sinon.stub(goog.net.Jsonp.prototype, 'send');
            var stubcancel = sinon.stub(goog.net.Jsonp.prototype, 'cancel');
            var fakeData = {
                myrequest: 'something',
                myarray: [1, 2, 3]
            };
            var retVal = {
                deferred_: { result_: {name: 'blub'},
                             cancel:  function () {}
                        }
            };
            var getCallback = function (result) {
                if (result === 'notcalled') {
                    return function () {
                        //should never come here
                        expect(true).to.be(false);
                    };
                } else {
                    return function (e) {
                        expect(e).to.be.a(ga.net.SwissSearch.Event);
                        expect(e.type).to.be(ga.net.SwissSearch.EventType.DONE);
                        expect(e.data()).to.be(result);
                    };
                }
            };

            stubcancel.returns('haha');
            stub.returns(retVal);

            //fake success
            stub.callsArgWith(1, fakeData);
            var cb = getCallback(fakeData);
            mySS.addEventListener(ga.net.SwissSearch.EventType.DONE, cb);
            mySS.query('maisonnex');
            mySS.removeEventListener(ga.net.SwissSearch.EventType.DONE, cb);

            //fake error
            cb = getCallback(null);
            stub.callsArgWith(2, fakeData);
            mySS.addEventListener(ga.net.SwissSearch.EventType.DONE, cb);
            mySS.query('maisonnex');
            mySS.removeEventListener(ga.net.SwissSearch.EventType.DONE, cb);

            //fake cancelling
            retVal.deferred_.result_.name = 'CancelledError';
            stub.callsArgWith(2, fakeData);
            cb = getCallback('notcalled');
            mySS.addEventListener(ga.net.SwissSearch.EventType.DONE, cb);
            mySS.query('maisonnex');
            mySS.removeEventListener(ga.net.SwissSearch.EventType.DONE, cb);
        });
    });
});

