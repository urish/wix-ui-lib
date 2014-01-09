// Karma configuration
// Generated on Sat Nov 16 2013 20:51:19 GMT+0300 (IDT)

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',
    // frameworks to use
    frameworks: ['jasmine'],
    // list of files / patterns to load in the browser
    files: [
	
		'stylesheets/bootstrap.css',
		'stylesheets/buttons.css',
		'stylesheets/common.css',
		'stylesheets/settings.css',
		
		'javascripts/components/radio-button/radio-button.css',
		'javascripts/components/checkbox/checkbox.css',
		'javascripts/components/accordion/accordion.css',
		'javascripts/components/header/header.css',
		'javascripts/components/dropdown/dropdown.css',
		'javascripts/components/popup/popup.css',
		'javascripts/components/input/input.css',
		'javascripts/components/spinner/spinner.css',
		
		
		'javascripts/components/color-picker2/css/color-picker.css',
		'javascripts/components/advanced-dropdown/css/dd.css',
		'javascripts/components/slider2/slider2.css',
		'javascripts/components/glued-position/css/glued-position.css',

	
        'http://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js',
        'http://sslstatic.wix.com/services/js-sdk/1.25.0/js/Wix.js',
		'tests/mocks/sdk/**.js',
		'tests/addons/**.js',
		
        'javascripts/definePlugin.js',
		'javascripts/ui-lib.js',
        'javascripts/components/**/*.js',
		
		
		'tests/mocks/*.js',
        'tests/**Spec.js'
    ],


    // list of files to exclude
    exclude: [

    ],


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-phantomjs-launcher'
            ],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
