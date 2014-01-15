module.exports = function (grunt) {

	// Project configuration.
	var projectName = 'uiLib';
	var sourceDirectory = 'src/main/';
	var buildDirectory = 'build/' + projectName + '/src/main/';
	var jsSrc = ['javascripts/definePlugin.js',
			  'javascripts/components/**/*.js',
					   'javascripts/ui-lib.js'];
	var cssSrc = ['stylesheets/bootstrap.css',
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
		'javascripts/components/language-picker/languagePicker.css',
		'javascripts/components/color-picker2/css/color-picker.css',
		'javascripts/components/advanced-dropdown/css/dd.css',
		'javascripts/components/slider2/slider2.css',
		'javascripts/components/tooltip/tooltip.css',
		'javascripts/components/glued-position/css/glued-position.css'];


	grunt.initConfig({
		pkg : grunt.file.readJSON('./package.json'),

		concat : {
			options : {
				separator : ';'
			},
			dist : {
				js: {
					src: jsSrc,
					dest : 'build/<%= pkg.name %>.all.js'
				},

				css: {
					src: cssSrc,
					dest: 'build/<%= pkg.name %>.all.css'
				},

				html: {
					src: 'html/settings.html',
					dest: 'build/settings.html'
				}
			}
		},

		uglify : {
			options : {
				banner : '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build : {
				src: jsSrc,
				dest : 'build/<%= pkg.name %>.min.js'
			}
		},
		cssmin : {
			add_banner : {
				options : {
					banner : '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
				},
				files : {
					'build/<%= pkg.name %>.min.css' : cssSrc
				}
			}
		},
		copy : {
			main : {
				files : [{
						expand : true,
						cwd : 'images',
						src : ['**'],
						dest : 'build/images'
					}, // makes all src relative to cwd
					{
						expand: true, flatten: true,src: ['html/*.html'], dest: 'build/', filter: 'isFile'
					}
				]
			},

			dev : {
				files : [
					{
						expand: true, flatten: true,src: ['html/settings.html'], dest: 'build/', filter: 'isFile'
					}
				]
			}
		},

		jshint : {
			all : {
				options : {
					// Unnecessary semicolon.
					"-W032": true,

					"asi" : true,
					"expr" : true,
					"laxcomma" : true,
					"smarttabs" : true,
					"curly" : true,
					"eqeqeq" : false,
					"immed" : true,
					"latedef" : true,
					"newcap" : true,
					"noarg" : true,
					"sub" : true,
					"es5" : true,
					"undef" : true,
					"eqnull" : true,
					"browser" : true,
					"regexdash" : true,
					"loopfunc" : true,
					"node":true,
					"globals" : {
						"Wix":true,
						"jQuery" : true,
						"$":true
					}
				},
				files : {
					src : [
						'javascripts/**/*.js',
						'!**/~*.js', '!**/jquery.dd.js',
						'!**/bootstrap-popover.js',
						'!**/bootstrap-tooltip.js'
					]
				}
			}
		},

		karma: {
			unit: {
				configFile: 'karma.conf.js',
				singleRun: true,
				browsers: ['PhantomJS']
			}
		},

		watch: {
			js: {
				files: jsSrc,
				tasks: ["uglify:build"]
			},
			css: {
				files: cssSrc,
				tasks: ["cssmin:add_banner"]
			},
			html: {
				files: ["<%= concat.dist.html.src %>"],
				tasks: ["copy:dev"]
			}
		},

		clean : ['build']

	});

	grunt.loadNpmTasks('grunt-contrib');
	grunt.loadNpmTasks('grunt-karma');

	// Default task.
	grunt.registerTask('default', ['clean', 'copy', 'uglify', 'cssmin', 'karma']);
	grunt.registerTask('concatall', ['clean', 'copy', 'concat','uglify', 'cssmin']);
	grunt.registerTask('lint', ['jshint']);
	grunt.registerTask('dev', ['clean', 'copy', 'uglify', 'cssmin', 'watch']);
};
