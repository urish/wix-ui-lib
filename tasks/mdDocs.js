module.exports = function(grunt) {
	var _ = grunt.util._;
	grunt.registerTask('mdDocs', 'Generate markup docs from components markdown', function (target) {

		function getDocMdContent(src, fileContent) {
			function getTitle(str) {
				var title = str.match(/#\s*([\w]+)/);
				return title ? title[1].trim() : null;
			}
			var title = getTitle(fileContent);
			if (!title) {
				grunt.log.error('Could not parse title form: ' + src);
			}
			return {
				title : title
			};
		}

		function replaceMdParts(mdStr, parts) {
			return mdStr.replace(/###\s*Example/, '### Example\n' + parts.markup.trim());
		}

		var marked = require('marked');
		marked.setOptions({
			renderer : new marked.Renderer(),
			gfm : true
		});
		var done = this.async();
		var options = grunt.config.get("mdDocs." + target).options;
		var all = grunt.file.expand(options.files).map(function (filepath) {
			var fileContent = grunt.file.read(filepath);
			var parts = getDocMdContent(filepath, fileContent);
			grunt.log.ok('file: ' + filepath);
			return '<div data-scroll-target id="' + parts.title + '-entry" class="cmp-plugin-decs-entry">\n' + marked(fileContent) + '\n</div>';

		});

		var c = grunt.file.read(options.inject);
		c = c.replace('${{content}}', all.join('\n\n\n\n'));
		grunt.file.write(options.inject, c);

		done(true);

	});
};