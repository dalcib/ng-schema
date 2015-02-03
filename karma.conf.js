'use strict';

module.exports = function(config){
  config.set({

    basePath : '.',
    files : [
      'bower_components/angular/angular.js',
      //'bower_components/angular-scenario/browserTrigger.js',
      //'bower_components/angular-scenario/matchers.js',
      'bower_components/angular-mocks/angular-mocks.js',
      /*'bower_components/angular-scenario/angular-scenario.js',*/
      'src/**/*.js',
      'test/**/*.js'
    ],

    reporters: ['progress'/*, 'brackets'*/],
    frameworks: ['jasmine'],
    autoWatch: true,
    browsers: [
      //'Chrome',
      'PhantomJS'
    ],
    singleRun: false
  });
};
