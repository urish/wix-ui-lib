module.exports = function(grunt) {
	var _ = grunt.util._;
	grunt.registerTask('mdDocs', 'Generate markup docs from components markdown', function (target) {

		function getDocMdContent(src, fileContent) {

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
		var options = grunt.config.get("mdDocs." + target).options;
		var all = grunt.file.expand(options.files).map(function (filepath) {
			var fileNameWithExtention = filepath.split('/').pop();
			var fileContent = grunt.file.read(filepath);
			var parts = getDocMdContent(filepath, fileContent, fileNameWithExtention);
			var newContent = replaceMdParts(fileContent, parts);

			grunt.log.ok('file: ' + fileNameWithExtention);

			return '<div data-scroll-target id="' + parts.title + '-entry" class="cmp-plugin-decs-entry">\n' + marked(newContent) + '\n</div>';

		});

		var c = grunt.file.read(options.inject);
		c = c.replace('${{content}}', all.join('\n\n\n\n'));
		grunt.file.write(options.inject, c);

		done(true);

	});
};