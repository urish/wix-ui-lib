(function($){
	if(!$){
		throw 'jQuery is not defined';
	}
	function definePlugin(name, pluginPrototypeDefinition) {
		'use strict';
		var Plugin = (new Function('return ' + definePlugin.tpl.replace(/\$\$\$/gm, name)))();
		if (!Plugin.name) {
			Plugin.name = name;
		}
		Plugin.prototype = pluginPrototypeDefinition();
		Plugin.prototype.constructor = Plugin;
		Plugin.prototype.triggerChangeEvent = function(data){
			this.$el.trigger(name + '.change', data);
		}
		
		var missingFunction = ['getValue', 'setValue', 'init', 'getDefaults', 'bindEvents'].filter(function (key) {
			return typeof Plugin.prototype[key] !== 'function';
		});

		if (missingFunction.length) {
			throw new Error('Plugin: ' + name + ' must implement: "' + missingFunction.join(', ') + '"');
		}

		definePlugin.registerAsJqueryPlugin(name, Plugin);

		return Plugin;
	}

	definePlugin.registerAsJqueryPlugin = function (name, Plugin) {
		if (window.jQuery && window.jQuery.fn) {
			window.jQuery.fn[name] = function (options) {
				return this.each(function () {
					if (!$.data(this, 'plugin_' + name)) {
						$.data(this, 'plugin_' + name, new Plugin(this, options));
					}
				});
			};
		}
	}

	definePlugin.tpl = function $$$(el, options) {
		'use strict';
		if (!(this instanceof $$$)) {
			throw new Error('Plugin: $$$ must called with the "new" keyword');
		}
		this.$el = window.jQuery(el);
		this.options = window.jQuery.extend({}, this.getDefaults(), options);
		this.init();
		return this;
	}.toString();

	$.fn.definePlugin = definePlugin;
	
}(jQuery))

