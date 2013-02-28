/*global ga: true, describe: true, it: true, expect: true, beforeEach: true, spyOn: true, runs: true, waitsFor: true */
/*jslint indent: 2 */


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

    it('returns a DONE event', function () {
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
        mySS.query('testing this');
      });
           
      expect(foo.callback).not.toHaveBeenCalled();

      waitsFor(function () {
        return (ev !== null);
      }, 'for callback to be called', 1000);

      expect(foo.callback).not.toHaveBeenCalled();

      runs(function () {
        expect(foo.callback).toHaveBeenCalled();
        expect(ev.type).toEqual(ga.net.SwissSearch.EventType.DONE);
      });

      expect(foo.callback).not.toHaveBeenCalled();

    });

  });
});

