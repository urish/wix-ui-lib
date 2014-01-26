module.exports = function (grunt) {

	// Project configuration.
	var projectName = 'uiLib';
	var sourceDirectory = 'src/main/';
	var buildDirectory = 'build/' + projectName + '/src/main/';
	var jsSrc = [
		'core/definePlugin.js',
		'core/ColorPickerCore.js',
		'core/ui-lib.js',
		'components/**/*.js',
	];
	var cssSrc = [
		'stylesheets/bootstrap.css',
		'stylesheets/buttons.css',
		'stylesheets/icons.css',
		'stylesheets/common.css',
		'stylesheets/settings.css',
		'stylesheets/header.css',

		'components/Radio/Radio.css',
		'components/Checkbox/Checkbox.css',
		'components/Accordion/Accordion.css',
		'components/Dropdown/Dropdown.css',
		'components/Popup/Popup.css',
		'components/Input/Input.css',
		'components/Spinner/Spinner.css',
		'components/LanguagePicker/LanguagePicker.css',
		'components/FontPicker/FontPicker.css',
		'components/ButtonGroup/ButtonGroup.css',
		'components/ColorPicker/ColorPicker.css',
		'components/AdvancedDropdown/css/dd.css',
		'components/Slider/Slider.css',
		'components/Tooltip/Tooltip.css',
		'components/GluedControl/GluedControl.css'];


	grunt.initConfig({
		pkg : grunt.file.readJSON('./package.json'),

		concat : {
			options : {
				separator : ';'
			},
			dist : {
				src: jsSrc,
				dest : 'build/<%= pkg.name %>.all.js',
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
						'components/**/*.js',
						'core/**/*.js',
						'!**/~*.js', '!**/jquery.dd.js'
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
	grunt.registerTask('default', ['clean', 'copy', 'uglify', 'cssmin']);
	grunt.registerTask('karma', ['clean', 'copy', 'uglify', 'cssmin', 'karma']);
	grunt.registerTask('concatall', ['clean', 'copy', 'concat','uglify', 'cssmin']);
	grunt.registerTask('lint', ['jshint']);
	grunt.registerTask('dev', ['clean', 'copy', 'uglify', 'cssmin', 'watch']);
};
