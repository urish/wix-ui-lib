module.exports = function (grunt) {

	// Project configuration.
	var projectName = 'uiLib';
	var sourceDirectory = 'src/main/';
	var buildDirectory = 'build/' + projectName + '/src/main/';
	var jsSrc = [
		'core/definePlugin.js',
		'core/ColorPickerCore.js',
		'core/ui-lib.js',
		'components/**/*.js'
	];
	var cssSrc = [
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
		'components/FixedPositionControl/FixedPositionControl.css'];

	var htmlSrc = ['html/settings.html', 'html/index.html', 'docs/index.html'];


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
			},
			docs:{
				files:[{
					expand : true,
					cwd:'docs',
					src:['**'],
					dest: 'build/docs'
				}]				
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
				files: cssSrc.join('docs/index.css'),
				tasks: ["cssmin:add_banner"]
			},
			html: {
				files: htmlSrc,
				tasks: ['copy:dev', 'copy:docs', 'mdDocs']
			}
		},
		mdDocs:{
			options: {
				files:['components/**/*.md'],
				inject: 'build/docs/index.html' 
			}
		},
		buildHTML:{
			options:{
				settingsHTML:'build/settings.html'
			}
		},
		clean : ['build']

	});



	grunt.loadNpmTasks('grunt-contrib');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-markdown');
	grunt.loadTasks('tasks');

	grunt.registerTask('default', ['clean', 'copy', 'uglify', 'cssmin']);


	grunt.registerTask('buildHTML', '', function(){
		var options = this.options();
		var newContent = '';
		var content = grunt.file.read(options.settingsHTML);
		
		var cssStart = '<!-- css source -->';
		var cssEnd = '<!-- css source end -->';
		
		var jsStart = '<!-- scripts source -->';
		var jsEnd = '<!-- scripts source end -->';
		
		var cssIndexStart = content.indexOf(cssStart);
		var cssIndexEnd = content.indexOf(cssEnd);
		
		var jsIndexStart = content.indexOf(jsStart);
		var jsIndexEnd = content.indexOf(jsEnd);
		
		var deadCssContent = content.slice(cssIndexStart, cssIndexEnd + cssEnd.length);
		var deadJsContent = content.slice(jsIndexStart, jsIndexEnd + jsEnd.length);
		
		newContent = content;
		newContent = newContent.replace(deadCssContent, '<link rel="stylesheet" href="ui-lib.min.css" />');
		newContent = newContent.replace(deadJsContent, '<script type="text/javascript" src="ui-lib.min.js"></script>');
		newContent = newContent.replace('../images/wix_icon.png', 'images/wix_icon.png');

		grunt.file.write(options.settingsHTML, newContent);
		
	});
	
	grunt.registerTask('mdDocs', 'build docs', function () {

		function getDocMdContent(src, fileContent, fileName) {

			function getTitle(str) {
				var title = str.match(/#\s*([\w]+)/);
				return title ? title[1].trim() : null;
			}

			function getMarkup(str) {
				var markup = str.match(/###\s*Markup((.|\s)*?)###/m);

				if (markup) {
					markup = markup[1].trim().replace(/(^```\s*.*\s*)|(```\s*$)/gm, '')
				}
				return markup ? markup : null;
			}

			function getOptions(str) {
				var header = '<tr><th class="tb-name">Name</th><th class="tb-default">Deafult</th><th class="tb-desc">Descrition</th></tr>';
				var tpl = '<tr><td>${{name}}</td><td>${{value}}</td><td>${{desc}}</td></tr>';

				var options = str.match(/###\s*Options\s*((.|\s)*)/m);
				if (options) {
					options = options[1].trim().split(/\*/gm);
					options = options.filter(function (option) {
							return !!option;
						}).map(function (option) {
							return option.trim().split(/\s*;\s*/gm);
						}).map(function (option) {

							if (option.length < 2) {
								throw new Error('Could not parse all options');
							}
							return tpl.replace('${{name}}', option[0] || '')
							.replace('${{value}}', option[1] || '')
							.replace('${{desc}}', option[2] || '')
						}).join('\n');
					return '<table class="options-table">' + header + options + '</table>';
				}
				return options ? options : null;
			}

			var title = getTitle(fileContent);
			var markup = getMarkup(fileContent);
			var options = getOptions(fileContent);

			if (!options) {
				grunt.log.error('Could not parse options form: ' + src);
			}

			if (!title) {
				grunt.log.error('Could not parse title form: ' + src);
			}

			if (!markup) {
				grunt.log.error('Could not parse markup form: ' + markup);
			}

			//console.log('Title\n', title);
			//console.log('Markup\n', markup);
			//console.log('Options\n', options);
			return {
				title : title,
				markup : markup,
				options : options
			};

		}

		function replaceMdParts(mdStr, parts) {
			return mdStr.replace(/###\s*Example/, '### Example\n' + parts.markup.trim())
			.replace(/###\s*Options\s*((.|\s)*)/m, '### Options\n' + parts.options);

		}

		var marked = require('marked');
		marked.setOptions({
			renderer : new marked.Renderer(),
			gfm : true
		});
		var done = this.async();
		var options = this.options();

		var all = grunt.file.expand(options.files).map(function (filepath) {

				var fileNameWithExtention = filepath.split('/').pop();
				var s = fileNameWithExtention.split('.');
				var extention = s.pop();
				var fileName = s.join('.');
				var fileContent = grunt.file.read(filepath);

				var parts = getDocMdContent(filepath, fileContent, fileName);
				var newContent = replaceMdParts(fileContent, parts);

				grunt.log.ok('file: ' + fileNameWithExtention);

				return '<div data-scroll-target id="' + parts.title + '-entry" class="cmp-plugin-decs-entry">\n' + marked(newContent) + '\n</div>';

			});

		var c = grunt.file.read(options.inject);
		c = c.replace('${{content}}', all.join('\n\n\n\n'));
		grunt.file.write(options.inject, c);
		
		done(true);

		});

	grunt.registerTask('default', ['clean', 'copy', 'uglify', 'cssmin', 'buildHTML', 'mdDocs']);

	grunt.registerTask('karma', ['default', 'karma']);
	grunt.registerTask('concatall', ['default', 'concat']);
	grunt.registerTask('lint', ['jshint']);
	grunt.registerTask('dev', ['default', 'watch']);
};
