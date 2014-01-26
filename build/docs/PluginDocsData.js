DocsApp.Classes.PluginDocsData = function (utils) {
	
	var pluginPresets = {
		ButtonGroup : {
			html : '\n\t<button value="mini">Mini</button>\n\t<button value="medium">Medium</button>\n\t<button value="large">Large</button>\n',
			optionsForPlugin : {},
			description : ''
		},
		ToggleButtonGroup : {
			html : '\n\t<button value="mini">Mini</button>\n\t<button value="medium">Medium</button>\n\t<button value="large">Large</button>\n',
			optionsForPlugin : {},
			description : ''
		},
		PluginTemplate : {
			html : '',
			optionsForPlugin : {},
			description : ''
		},
		Accordion : {
			html : '\n\t<div class="acc-pane">\n\t\t<h3>Accordion Pane</h3>\n\t\t<div class="acc-content">Accordion Content</div>\n\t</div>\n\t<div class="acc-pane">\n\t\t<h3>Accordion Pane</h3>\n\t\t<div class="acc-content">Accordion Content</div>\n\t</div>\n\t<div class="acc-pane">\n\t\t<h3>Accordion Pane</h3>\n\t\t<div class="acc-content">Accordion Content</div>\n\t</div>\n',
			optionsForPlugin : {},
			description : ''
		},
		Checkbox : {
			html : '',
			optionsForPlugin : {},
			description : ''
		},
		ColorPickerWithOpacity : {
			html : '',
			optionsForPlugin : {},
			description : ''
		},
		ColorPicker : {
			html : '',
			optionsForPlugin : {},
			description : ''
		},
		Dropdown : {
			html : '\n\t<div value="show">Show Images</div>\n\t<div value="hide">Hide Images</div>\n\t<div value="showhover">Show Images on Hover</div>\n',
			optionsForPlugin : {
				width : 160
			},
			description : ''
		},
		FontPicker : {
			html : '',
			optionsForPlugin : {},
			description : ''
		},
		FontStylePicker : {
			html : '',
			optionsForPlugin : {},
			description : ''
		},
		Input : {
			html : '',
			optionsForPlugin : {},
			description : ''
		},
		LanguagePicker : {
			html : '',
			optionsForPlugin : {},
			description : ''
		},
		Popup : {
			html : '\n\t<div data-radio-value="sync10">Sync 10 images</div>\n\t<div data-radio-value="sync25">Sync 25 images</div>\n\t<div data-radio-value="sync50">Sync 50 images</div>\n',
			optionsForPlugin : {},
			description : ''
		},
		Radio : {
			html : '\n\t<div data-radio-value="sync10">Sync 10 images</div>\n\t<div data-radio-value="sync25">Sync 25 images</div>\n\t<div data-radio-value="sync50">Sync 50 images</div>\n',
			optionsForPlugin : {},
			description : ''
		},
		Slider : {
			html : '',
			optionsForPlugin : {
				toolTip: true
			},
			description : ''
		},
		Spinner : {
			html : '',
			optionsForPlugin : {},
			description : ''
		},
		Tooltip : {
			html : '\n\t<div wix-tooltip="{text: \'this is a simple tooltip\'}">\n\t\t<div style="width:100px">Tool</div>\n\t</div>\n',
			optionsForPlugin : {},
			description : ''
		}
	};
	
	function formatHTML(html){
		html = html.replace(/\t/g,'    ');
		return html;
	}
	
	function getPluginDesc(Plugin) {
		var preset = pluginPresets[Plugin.name];
		return (preset && preset.description) ? preset.description : '';
	}
	function getPluginInitMarkup(Plugin) {
		var preset = pluginPresets[Plugin.name];
		var markup = (preset && preset.html) ? preset.html : '';
		return markup;
	}
	function getPluginInitOptions(Plugin) {
		var preset = pluginPresets[Plugin.name];
		return preset ? JSON.stringify(preset.optionsForPlugin || {}) : '{}';
	}
	function getPluginDefinitionMarkup(Plugin) {
		return utils.escapeHtml(formatHTML('<div wix-ctrl="' + Plugin.name + '">' + getPluginInitMarkup(Plugin) + '</div>'));
	}
	function getDisplayDefaults(obj){
		return obj;
	}
	
	return {
		getDisplayDefaults: getDisplayDefaults,
		getPluginDesc : getPluginDesc,
		getPluginInitMarkup : getPluginInitMarkup,
		getPluginInitOptions : getPluginInitOptions,
		getPluginDefinitionMarkup : getPluginDefinitionMarkup
	};
}
