// Testacular configuration
// Generated on Tue Feb 12 2013 15:53:57 GMT+0100 (CET)


// base path, that will be used to resolve files and exclude
basePath = '../../..';


// list of files / patterns to load in the browser
files = [
  JASMINE,
  JASMINE_ADAPTER,
// 'lib/closure/closure/goog/base.js',
//  'build/ol3_dep.js',
//  'build/geoadmin_deps.js',
//  'lib/geoadmin/src/ga/**/*.js',
//  'lib/geoadmin/test/spec/ga/**/*.js'
//  'closure/closure/goog/base.js',
//  'closure/closure/goog/**/*.js',
//  'ol3/src/ol/**/*.js',
//  'geoadmin/src/ga/**/*.js',
  'build/geoadmin.js',
  'lib/geoadmin/test/spec/ga/**/*.js'
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

