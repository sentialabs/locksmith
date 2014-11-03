module.exports = function(config){
  config.set({

    basePath : '../',

    files : [
      'app/assets/jquery/jquery.js',
      'app/assets/aws-sdk/dist/aws-sdk.js',

      'app/assets/ionic/release/js/ionic.js',
      'app/assets/angular/angular.js',
      'app/assets/angular-animate/angular-animate.js',
      'app/assets/angular-sanitize/angular-sanitize.js',
      'app/assets/angular-ui-router/release/angular-ui-router.js',
      'app/assets/ionic/release/js/ionic-angular.js',

      'app/assets/angular-resource/angular-resource.js',
      'app/assets/ngstorage/ngStorage.js',
      'app/assets/angular-gravatar/build/md5.js',
      'app/assets/angular-gravatar/build/angular-gravatar.js',

      'app/assets/angular-mocks/angular-mocks.js',

  		'app/js/**/*.js',
  		'test/unit/**/*.js'
    ],

    autoWatch: true,
    //singleRun: true,

    frameworks: ['jasmine'],

    browsers : ['PhantomJS'],

    reporters: ['progress', 'osx', 'coverage'],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    },

    preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      './app/js/**/*.js': ['coverage'],
    },

    // optionally, configure the reporter
    coverageReporter: {
      reporters: [
        {type : 'html', dir : 'coverage/'},
        // {type: 'text-summary'}
      ]
    }

  });
};