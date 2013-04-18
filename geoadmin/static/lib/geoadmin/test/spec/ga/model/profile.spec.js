
describe('ga.model.Profile', function () {
    'use strict';

    var testdata = { 'profile' : [ { 'alts' : { 'COMB' : 1415.9 },
        'dist' : 0.0,
        'easting' : 594810.0,
        'northing' : 125740.705
      },
      { 'alts' : { 'COMB' : 1491.9000000000001 },
        'dist' : 499.30000000000001,
        'easting' : 595077.85699999996,
        'northing' : 126162.133
      },
      { 'alts' : { 'COMB' : 1599.7 },
        'dist' : 998.70000000000005,
        'easting' : 595345.71400000004,
        'northing' : 126583.56200000001
      },
      { 'alts' : { 'COMB' : 1698.7 },
        'dist' : 1498.0,
        'easting' : 595613.571,
        'northing' : 127004.99000000001
      }
   ] };

    var myProfile = null;
    beforeEach( function  () {
        myProfile = new ga.model.Profile();
    });

    afterEach( function () {
        myProfile = null;
    });

    describe('Constructor ', function () {
        it('should create correct object', function () {
            expect(myProfile instanceof ga.model.Profile).to.be(true);
        });
        it ('should create empty in array', function () {
            expect(myProfile.inPoints() instanceof Array).to.be(true);
        });
        it ('should create empyt output array', function () {
            expect(myProfile.outPoints() instanceof Array).to.be(true);
        });
    });

    describe('Add profile points', function () {
        it ('should fail when fed wrong data', function () {
            expect(myProfile.updateOutPoints(undefined)).to.be(false);
            expect(myProfile.updateOutPoints(null)).to.be(false);
            expect(myProfile.updateOutPoints({dummy: 'haha'})).to.be(false);
        });

        it('should load data from JSON', function () {
            expect(myProfile.outPoints().length).to.be(0);
            expect(myProfile.updateOutPoints({'profile': []})).to.be(true);
            expect(myProfile.outPoints().length).to.be(0);
            expect(myProfile.updateOutPoints(testdata)).to.be(true);
            expect(myProfile.outPoints().length).to.be(4);
            expect(myProfile.updateOutPoints({dummy: 'haha'})).to.be(false);
            expect(myProfile.outPoints().length).to.be(4);
            //bounding box (checks also correct parsing)
            expect(myProfile.boundingRect().left).to.be(0.0);
            expect(myProfile.boundingRect().top).to.be(-1698.7);
            expect(myProfile.boundingRect().height).to.be(1698.7 - 1415.9);
            expect(myProfile.boundingRect().width).to.be(1498);
            //can update to 0 points
            expect(myProfile.updateOutPoints({'profile': []})).to.be(true);
            expect(myProfile.outPoints().length).to.be(0);
        });
    });

    describe('Get nearest outpoint based on distance', function () {

        it ('should find correct point', function () {
            myProfile.updateOutPoints(testdata);

            expect(myProfile.lookupNearestOutPoint(998.70000000000005).dh().y).to.be(-1599.7);
            expect(myProfile.lookupNearestOutPoint(998.0).dh().y).to.be(-1599.7);
            expect(myProfile.lookupNearestOutPoint(999.0).dh().y).to.be(-1599.7);

            expect(myProfile.lookupNearestOutPoint(0.0).dh().y).to.be(-1415.9);
            expect(myProfile.lookupNearestOutPoint(-1.0).dh().y).to.be(-1415.9);
            expect(myProfile.lookupNearestOutPoint(1.0).dh().y).to.be(-1415.9);

            expect(myProfile.lookupNearestOutPoint(1498.0).dh().y).to.be(-1698.7);
            expect(myProfile.lookupNearestOutPoint(1497.0).dh().y).to.be(-1698.7);
            expect(myProfile.lookupNearestOutPoint(1499.0).dh().y).to.be(-1698.7);
        });
    });
});

