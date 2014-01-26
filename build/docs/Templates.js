DocsApp.Classes.Templates = function (pluginDocsData, utils) {

	function jsonToTable(json) {
		var table_obj = $('<table>');
		$.each(json, function (index, item) {
			var table_row = $('<tr>');
			var table_cell = $('<td>').text(index);
			table_row.append(table_cell);
			var t = typeof item === 'function' ? item.toString() : JSON.stringify(item) || 'null';
			var table_cell = $('<td>').text(t);
			table_row.append(table_cell);
			table_obj.append(table_row);
		});
		return '<table style="width:100%">' + table_obj.html() + '</table>';
	}

	function menuTpl(Plugin) {
		return '<li class="cmp-plugin-entry">' +
		'<a data-scroll-inter href="#' + Plugin.name + '-entry">' + Plugin.name + '</a>' +
		'<ul class="nav">' +
		'<li><a href="#' + Plugin.name + '-examples">Examples</a></li>' +
		'<li><a href="#' + Plugin.name + '-usage">Usage</a></li>' +
		'</ul>' +
		'</li>';
	}

	function contentTpl(Plugin) {
		var name = Plugin.name;
		var initOptions = pluginDocsData.getPluginInitOptions(Plugin);
		var markup = pluginDocsData.getPluginInitMarkup(Plugin);
		var displayMarkup = pluginDocsData.getPluginDefinitionMarkup(Plugin);
		var optionsTable = jsonToTable(pluginDocsData.getDisplayDefaults(Plugin.prototype.getDefaults())); //utils.escapeHtml(JSON.stringify(Plugin.prototype.getDefaults(),null,4))
		var description = pluginDocsData.getPluginDesc(Plugin);
	
		return '<div data-scroll-target id="' + name + '-entry" class="cmp-plugin-decs-entry">' +
		'<h1>' + name + '</h1>' +
		'<div class="plugin-demo"><div wix-ctrl="' + name + '" wix-options=\'' + initOptions + '\' class="plugin-demo">' + markup + '</div></div>' +
		'<h3>Markup</h3>' +
		'<pre class="plugin-markup prettyprint">' + displayMarkup + '</pre>' +
		'<h3>Options</h3>' +
		'<pre class="plugin-options">' + optionsTable + '</pre>' +
		'<h3>Description</h3>' +
		'<p>' + description + '</p>' +
		'</div>';
	}

	return {
		contentTpl : contentTpl,
		menuTpl : menuTpl,
		jsonToTable : jsonToTable
	};
}
