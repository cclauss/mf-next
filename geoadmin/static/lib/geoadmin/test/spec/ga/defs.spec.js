/*global ga: true, describe: true, it: true, expect: true */
/*jslint indent: 2 */


describe('ga.Defs', function () {
  'use strict';

  describe('the ga.Defs object', function () {
    it('should be a singleton', function () {
      expect(ga.Defs.getInstance()).toEqual(ga.Defs.getInstance());
    });
  });
});

