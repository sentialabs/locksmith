module.exports = function (grunt) {
    grunt.initConfig({

    jsbeautifier: {
      files : [
        "app/js/**/*.js",
        "app/partials/**/*.html"
      ],
      options : {
        html: {
          braceStyle: "collapse",
          indentChar: " ",
          indentScripts: "keep",
          indentSize: 4,
          maxPreserveNewlines: 10,
          preserveNewlines: true,
          unformatted: ["a", "sub", "sup", "b", "i", "u"],
          wrapAttributes: 'force-aligned'
        }
      }
    },

    // define source files and their destinations
    uglify: {
        options: {
            mangle: false,
            compress: false,
            beautify: false
        },
        files: {
            files: {
                'app/dist/js/min.js': [
                    'app/assets/jquery/dist/jquery.js',
                    'app/assets/aws-sdk/dist/aws-sdk.js',

                    'app/assets/ionic/release/js/ionic.js',
                    'app/assets/angular/angular.js',
                    'app/assets/angular-animate/angular-animate.js',
                    'app/assets/angular-sanitize/angular-sanitize.js',
                    'app/assets/angular-ui-router/release/angular-ui-router.js',
                    'app/assets/ionic/release/js/ionic-angular.js',

                    'app/assets/angular-resource/angular-resource.js',
                    'app/assets/ngstorage/ngStorage.js',
                    'app/assets/angular-gravatar/build/angular-gravatar.js',

                    'app/js/app.js',
                    'app/js/controllers.js',
                    'app/js/filters.js',
                    'app/js/services.js'
                ]
            }
        }
    },
    cssmin: {
        combine: {
            options: {
                keepSpecialComments: 0
            },
            files: {
                'app/dist/css/min.css': [
                    'app/assets/angular/angular-csp.css',
                    'app/assets/ionic/release/css/ionic.css',
                    'app/css/app.css'
                ]
            }
        }
    },
    copy: {
        main: {
            files: [
                {expand: true, cwd: 'app/assets/ionic/release/fonts/', src: ['**'],             dest: 'app/dist/fonts/'},
                {expand: true, cwd: 'app/img/',                        src: ['**'],             dest: 'app/dist/img/'},
                {expand: true,                                         src: ['icon.png'],       dest: 'Locksmith.safariextension/'},
                {expand: true, cwd: 'app/',                            src: ['index.html'], dest: 'Locksmith.safariextension/app/'},
                {expand: true, cwd: 'app/dist/',                       src: ['**'],             dest: 'Locksmith.safariextension/app/dist/'},
                {expand: true, cwd: 'app/partials/',                   src: ['**'],             dest: 'Locksmith.safariextension/app/partials/'}
            ]
        }
    },
    zip: {
        'locksmith.zip': [
            'manifest.json',
            'icon.png',
            'app/dist/**',
            'app/partials/**',
            'app/index.html'
        ]
    },
    watch: {
        uglify: {
            files: [
                'app/js/*.js',
                'app/assets/**/*.js',
            ],
            tasks: ['uglify'],
            options: {interrupt: true}
        },
        cssmin: {
            files: [
                'app/css/*.css',
                'app/assets/**/*.css',
            ],
            tasks: ['cssmin'],
            options: {interrupt: true}
        }
    }
});

// load plugins
grunt.loadNpmTasks('grunt-jsbeautifier');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-cssmin');
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-zip');


// register at least this one task
grunt.registerTask('default', [ 'jsbeautifier', 'uglify', 'cssmin', 'copy', 'zip']);


};
