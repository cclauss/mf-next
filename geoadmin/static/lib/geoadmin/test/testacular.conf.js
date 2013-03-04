/*global basePath:true, singleRun:true, captureTimeout:true, browsers:true, autoWatch:true, LOG_DEBUG:true, logLevel:true, colors:true, runnerPort:true, port:true, reporters:true, exclude:true, JASMINE_ADAPTER:true, JASMINE:true basePath:true, files:true*/

// Testacular configuration
// Generated on Tue Feb 12 2013 15:53:57 GMT+0100 (CET)


// base path, that will be used to resolve files and exclude
basePath = '../../../../../geoadmin/static';


// list of files / patterns to load in the browser
files = [
    JASMINE,
    JASMINE_ADAPTER,
    {pattern: 'lib/closure/closure/goog/base.js', watched: false},
    {pattern: 'build/ol3_deps.js', watched: false},
    {pattern: 'build/ga_deps.js'},
    {pattern: 'lib/geoadmin/src/geoadmin.js'},
    {pattern: 'lib/geoadmin/test/spec/ga/**/*.js'},
    {pattern: 'lib/closure/closure/goog/**/*.js', watched: false, included: false},
    {pattern: 'lib/ol3/**/*.js', watched: false, included: false},
    {pattern: 'lib/geoadmin/**/*.js', watched: false, included: false}
];


// list of files to exclude
exclude = [

];


// test results reporter to use
// possible values: 'dots', 'progress', 'junit'
reporters = ['progress'];


// web server port
port = 8080;


// cli runner port
runnerPort = 9100;


// enable / disable colors in the output (reporters and logs)
colors = true;


// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_DEBUG;


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

