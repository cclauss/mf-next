/*global ga: true, describe: true, it: true, expect: true, beforeEach: true */


describe('ga.net.SwissSearch', function () {
    'use strict';

    describe('the swiss search component', function () {
        var mySS = null;

        beforeEach(function () {
            mySS = new ga.net.SwissSearch();
        });

        it('can be created', function () {
            expect(mySS).toBeDefined();
            expect(mySS instanceof ga.net.SwissSearch).toEqual(true);
        });

/*
        it('returns correct event', function () {
            var ev = null;
            var foo = {
                callback: function (e) {
                    ev = e;
                }
            };

            spyOn(foo, 'callback').andCallThrough();


            expect(foo.callback).not.toHaveBeenCalled();

            mySS.addEventListener(ga.net.SwissSearch.EventType.DONE, foo.callback);

            expect(foo.callback).not.toHaveBeenCalled();

            runs(function () {
                mySS.query('maisonnex');
            });

            expect(foo.callback).not.toHaveBeenCalled();

            waitsFor(function () {
                    return (ev !== null);
                }, 'callback to be called', 5000);

            expect(foo.callback).not.toHaveBeenCalled();

            runs(function () {
                expect(foo.callback).toHaveBeenCalled();
                expect(ev instanceof ga.net.SwissSearch.Event).toEqual(true);
                expect(ev.type).toEqual(ga.net.SwissSearch.EventType.DONE);
                expect(ev.data()).not.toEqual(null);
            });

            expect(foo.callback).not.toHaveBeenCalled();

        });
*/
    });
});

