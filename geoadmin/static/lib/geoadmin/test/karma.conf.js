/*global basePath:true, singleRun:true, captureTimeout:true, browsers:true, autoWatch:true, LOG_INFO:true, logLevel:true, colors:true, runnerPort:true, port:true, reporters:true, exclude:true, MOCHA_ADAPTER:true, MOCHA:true basePath:true, files:true*/

// Testacular configuration
// Generated on Tue Feb 12 2013 15:53:57 GMT+0100 (CET)


// base path, that will be used to resolve files and exclude
basePath = '/home/ltjeg/mf-next/geoadmin/static/';


// list of files / patterns to load in the browser
files = [
    MOCHA,
    MOCHA_ADAPTER,
    {pattern: 'lib/ol3/test/expect-0.2.0-ol3/expect.js'},
    {pattern: 'lib/ol3/test/sinon-1.6.0/sinon.js'},
    {pattern: 'lib/proj4js/proj4js-compressed.js'},
    {pattern: 'lib/proj4js/EPSG21781.js'},
    {pattern: 'lib/closure/closure/goog/base.js'},
    {pattern: 'build/ol3_deps.js'},
    {pattern: 'build/ga_deps.js'},
    {pattern: 'lib/geoadmin/src/geoadmin.js'},
    {pattern: 'lib/geoadmin/test/spec/ga/**/*.js'},
    {pattern: 'lib/closure/closure/goog/**/*.js', watched: false, included: false},
    {pattern: 'lib/ol3/src/ol/**/*.js', watched: false, included: false},
    {pattern: 'lib/geoadmin/src/**/*.js', included: false}
];


// list of files to exclude
exclude = [
];


// test results reporter to use
// possible values: 'dots', 'progress', 'junit'
reporters = ['progress'];


// web server port
port = 8081;


// cli runner port
runnerPort = 9100;


// enable / disable colors in the output (reporters and logs)
colors = true;


// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;


// enable / disable watching file and executing tests whenever any file changes
autoWatch = true;


// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ['PhantomJS'];


// If browser does not capture in given timeout [ms], kill it
captureTimeout = 5000;


// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;

