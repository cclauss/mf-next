/*global goog: true, ga: true, describe: true, it: true, expect: true */
/*jslint indent: 2 */


goog.provide('ga.test.model.layers');

describe('ga.model.layers', function () {
  'use strict';

  describe('create layers definitions', function () {
    it('should have 2 definitions', function () {
      expect(ga.model.layers.length).toEqual(2);
    });
  });
});

goog.require('ga.model.layers');
