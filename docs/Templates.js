DocsApp.Classes.Templates = function () {

	function menuTpl(Plugin) {
		return '<li class="cmp-plugin-entry">' +
		'<a data-scroll-inter href="#' + Plugin.name + '-entry">' + Plugin.name + '</a>' +
		'<ul class="nav">' +
		'<li><a href="#' + Plugin.name + '-examples">Examples</a></li>' +
		'<li><a href="#' + Plugin.name + '-usage">Usage</a></li>' +
		'</ul>' +
		'</li>';
	}

	return {
		menuTpl : menuTpl
	};
}
