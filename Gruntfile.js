
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

module.exports = function(grunt) {


  // File utilities:
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-markdown');

  // Directory utilities:
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Test runners:
  grunt.loadNpmTasks('grunt-phpunit');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // Filesystem helpers:
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Config files:
  var pkg = grunt.file.readJSON('package.json');
  var paths = grunt.file.readJSON('paths.json');


  grunt.initConfig({

    bower: {
      install: {
        options: { copy: false }
      }
    },

    copy: {

      bootstrap: {
        files: [{
          src: paths.copy.bootstrap+'/fonts/*',
          dest: 'views/shared/css/fonts/',
          flatten: true,
          expand: true
        }]
      },

      chosen: {
        files: [{
          src: paths.copy.chosen+'/*.png',
          dest: paths.payloads.admin.css,
          flatten: true,
          expand: true
        }]
      },

      jquery_ui: {
        files: [{
          src: paths.copy.jquery_ui+'/themes/smoothness/images/*',
          dest: paths.payloads.shared.css+'/images',
          flatten: true,
          expand: true
        }]
      },

      select2: {
        files: [{
          src: [
            paths.copy.select2+'/*.png',
            paths.copy.select2+'/*.gif'
          ],
          dest: paths.payloads.shared.css,
          flatten: true,
          expand: true
        }]
      },

      ckeditor: {
        files: [{
          cwd: paths.copy.ckeditor,
          src: '**',
          dest: paths.payloads.shared.js+'/ckeditor/',
          expand: true
        }]
      }

    },

    clean: {

      payloads: [
        paths.payloads.shared.js,
        paths.payloads.shared.css,
        paths.payloads.admin.js,
        paths.payloads.admin.css
      ],

      fixtures: [
        paths.jasmine+'/fixtures/*.json',
        paths.jasmine+'/fixtures/*.html',
        paths.jasmine+'/fixtures/*.xml'
      ],

      bower: 'bower_components',

      fonts: 'views/shared/css/fonts',

      pkg: 'pkg'

    },

    concat: {

      add_form: {
        src: [
          paths.vendor.js.underscore_s,
          paths.vendor.js.chosen,
          paths.src.admin+'/exhibit-form.js',
          paths.src.admin+'/slug-autogen.js'
        ],
        dest: paths.payloads.admin.js+'/add-form.js'
      },

      edit_form: {
        src: [
          paths.vendor.js.chosen,
          paths.src.admin+'/exhibit-form.js'
        ],
        dest: paths.payloads.admin.js+'/edit-form.js'
      },

      neatline_public: {
        src: [

          // Vendor:
          paths.vendor.js.jquery,
          paths.vendor.js.jquery_ui,
          paths.vendor.js.underscore,
          paths.vendor.js.underscore_s,
          paths.vendor.js.backbone,
          paths.vendor.js.mutators,
          paths.vendor.js.schema,
          paths.vendor.js.marionette,
          paths.vendor.js.safesync,
          paths.vendor.js.openlayers,
          paths.vendor.js.openlayers_geo,
          paths.vendor.js.stamen,
          paths.vendor.js.rivets,

          // Neatline:
          paths.src.shared+'/*.js',
          paths.src.shared+'/shared/*.js',
          paths.src.shared+'/shared/exhibit/exhibit.model.js',
          paths.src.shared+'/shared/record/record.model.js',
          paths.src.shared+'/shared/record/record.collection.js',
          paths.src.shared+'/shared/widget/*.js',
          paths.src.shared+'/broker/*.js',
          paths.src.shared+'/map/**/*.js',
          paths.src.shared+'/presenter/*.js',
          paths.src.shared+'/presenter/StaticBubble/*.js',
          paths.src.shared+'/presenter/None/*.js'

        ],
        dest: paths.payloads.shared.js+'/neatline-public.js'
      },

      neatline_editor: {
        src: [

          // Vendor:
          paths.vendor.js.jquery,
          paths.vendor.js.jquery_ui,
          paths.vendor.js.underscore,
          paths.vendor.js.underscore_s,
          paths.vendor.js.backbone,
          paths.vendor.js.routefilter,
          paths.vendor.js.mutators,
          paths.vendor.js.schema,
          paths.vendor.js.marionette,
          paths.vendor.js.openlayers,
          paths.vendor.js.openlayers_geo,
          paths.vendor.js.stamen,
          paths.vendor.js.rivets,
          paths.vendor.js.svgtowkt,
          paths.vendor.js.draggable,
          paths.vendor.js.toastr,
          paths.vendor.js.spectrum,
          paths.vendor.js.bootstrap,
          paths.vendor.js.ace,
          paths.vendor.js.ace_theme,
          paths.vendor.js.ace_mode,
          paths.vendor.js.select2,
          paths.vendor.js.uri,

          // Neatline:
          paths.src.shared+'/*.js',
          paths.src.shared+'/shared/*.js',
          paths.src.shared+'/shared/exhibit/exhibit.model.js',
          paths.src.shared+'/shared/record/record.model.js',
          paths.src.shared+'/shared/record/record.collection.js',
          paths.src.shared+'/shared/widget/*.js',
          paths.src.shared+'/broker/*.js',
          paths.src.shared+'/map/**/*.js',
          paths.src.shared+'/presenter/*.js',
          paths.src.shared+'/presenter/StaticBubble/*.js',
          paths.src.shared+'/presenter/None/*.js',

          // Editor:
          paths.src.shared+'/editor/*.js',
          paths.src.shared+'/editor/exhibit/**/*.js',
          paths.src.shared+'/editor/record/**/*.js',
          paths.src.shared+'/editor/map/*.js',

        ],
        dest: paths.payloads.shared.js+'/neatline-editor.js'
      },

      jasmine_vendor: {
        src: [
          paths.vendor.js.uri,
          paths.vendor.js.jasmine_jquery,
          paths.vendor.js.jasmine_async,
          paths.vendor.js.sinon,
          paths.jasmine+'/assertions/*.js',
          paths.jasmine+'/helpers/*.js'
        ],
        dest: paths.jasmine+'/payloads/vendor.js'
      },

      exhibit_form_css: {
        src: [
          paths.vendor.css.chosen,
          paths.payloads.admin.css+'/exhibit-form.css'
        ],
        dest: paths.payloads.admin.css+'/exhibit-form.css'
      },

      neatline_public_css: {
        src: [
          paths.vendor.css.openlayers,
          paths.payloads.shared.css+'/neatline-public.css'
        ],
        dest: paths.payloads.shared.css+'/neatline-public.css'
      },

      neatline_editor_css: {
        src: [
          paths.vendor.css.jquery_ui,
          paths.vendor.css.bootstrap,
          paths.vendor.css.toastr,
          paths.vendor.css.spectrum,
          paths.vendor.css.select2,
          paths.vendor.css.select2_bs,
          '<%= concat.neatline_public_css.src %>',
          paths.payloads.shared.css+'/neatline-editor.css'
        ],
        dest: paths.payloads.shared.css+'/neatline-editor.css'
      }

    },

    uglify: {

      options: {
        beautify: {
          quote_keys: true // Fixes Select2 breakage in PhantomJS.
        }
      },

      add_form: {
        src: '<%= concat.add_form.dest %>',
        dest: '<%= concat.add_form.dest %>'
      },

      edit_form: {
        src: '<%= concat.edit_form.dest %>',
        dest: '<%= concat.edit_form.dest %>'
      },

      neatline_public: {
        src: '<%= concat.neatline_public.dest %>',
        dest: '<%= concat.neatline_public.dest %>'
      },

      neatline_editor: {
        src: '<%= concat.neatline_editor.dest %>',
        dest: '<%= concat.neatline_editor.dest %>'
      }

    },

    stylus: {

      options: {
        paths: [paths.stylus.shared],
        import: ['var']
      },

      neatline_public: {
        src: paths.stylus.shared+'/public/**/*.styl',
        dest: paths.payloads.shared.css+'/neatline-public.css'
      },

      neatline_editor: {
        src: paths.stylus.shared+'/editor/**/*.styl',
        dest: paths.payloads.shared.css+'/neatline-editor.css'
      },

      exhibit_form: {
        src: paths.stylus.admin+'/exhibit-form.styl',
        dest: paths.payloads.admin.css+'/exhibit-form.css'
      }

    },

    cssmin: {

      admin: {
        src: '*.css',
        cwd: paths.payloads.admin.css,
        dest: paths.payloads.admin.css,
        expand: true
      },

      shared: {
        src: '*.css',
        dest: paths.payloads.shared.css,
        cwd: paths.payloads.shared.css,
        expand: true
      }

    },

    markdown: {

      options: {
        template: 'docs/template.html',
      },

      docs: {
        src: 'docs/markdown/*.md',
        dest: 'docs/html/',
        ext: '.html',
        flatten: true,
        expand: true
      }

    },

    watch: {

      payload: {
        files: [
          '<%= concat.add_form.src %>',
          '<%= concat.edit_form.src %>',
          '<%= concat.neatline_public.src %>',
          '<%= concat.neatline_editor.src %>',
          '<%= concat.jasmine_vendor.src %>',
          '<%= markdown.docs.src %>',
          paths.stylus.admin+'/**/*.styl',
          paths.stylus.shared+'/**/*.styl'
        ],
        tasks: 'compile'
      }

    },

    phpunit: {

      options: {
        bin: 'vendor/bin/phpunit',
        bootstrap: 'tests/phpunit/bootstrap.php',
        followOutput: true,
        colors: true
      },

      application: {
        dir: 'tests/phpunit',
        options: {
          configuration: 'tests/phpunit/phpunit-application.xml'
        }
      },

      features: {
        dir: 'tests/phpunit',
        options: {
          configuration: 'tests/phpunit/phpunit-features.xml'
        }
      }

    },

    jasmine: {

      options: {
        template: paths.jasmine+'/runner.tmpl',
        helpers: paths.jasmine+'/payloads/vendor.js'
      },

      neatline: {
        src: paths.payloads.shared.js+'/neatline-public.js',
        options: {
          specs: paths.jasmine+'/tests/neatline/**/*.spec.js'
        }
      },

      editor: {
        src: [
          paths.payloads.shared.js+'/ckeditor/ckeditor.js',
          paths.payloads.shared.js+'/neatline-editor.js'
        ],
        options: {
          specs: paths.jasmine+'/tests/editor/**/*.spec.js'
        }
      }

    },

    connect: {

      server: {
        options: {
          keepalive: true,
          port: 1337
        }
      }

    },

    compress: {

      dist: {
        options: {
          archive: 'pkg/Neatline-'+pkg.version+'.zip'
        },
        dest: 'Neatline/',
        src: [

          '**',

          // GIT
          '!.git/**',

          // BOWER
          '!bower.json',
          '!bower_components/**',

          // NPM
          '!package.json',
          '!node_modules/**',

          // COMPOSER
          '!composer.json',
          '!composer.lock',
          '!vendor/**',

          // RUBY
          '!Gemfile',
          '!Gemfile.lock',

          // GRUNT
          '!.grunt/**',
          '!Gruntfile.js',
          '!paths.json',

          // DIST
          '!pkg/**',

          // TESTS
          '!tests/**'

        ]
      }

    }

  });


  // Run the tests by default.
  grunt.registerTask('default', 'test');

  // Build the application.
  grunt.registerTask('build', [
    'clean',
    'bower',
    'compile:min',
    'copy'
  ]);

  // Concat static assets.
  grunt.registerTask('compile', [
    'stylus',
    'markdown',
    'concat'
  ]);

  // Minify static assets.
  grunt.registerTask('compile:min', [
    'compile',
    'uglify',
    'cssmin'
  ]);

  // Mount public Jasmine suite.
  grunt.registerTask('jasmine:neatline:server', [
    'jasmine:neatline:build',
    'connect'
  ]);

  // Mount editor Jasmine suite.
  grunt.registerTask('jasmine:editor:server', [
    'jasmine:editor:build',
    'connect'
  ]);

  // Run all tests.
  grunt.registerTask('test', [
    'compile:min',
    'clean:fixtures',
    'phpunit',
    'jasmine'
  ]);

  // Spawn release package.
  grunt.registerTask('package', [
    'clean:pkg',
    'compile:min',
    'compress'
  ]);


};
