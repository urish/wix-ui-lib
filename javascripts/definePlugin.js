function definePlugin(name, plug, defaults) {
	'use strict';
	var Plugin = (new Function('return ' + definePlugin.tpl.replace(/\$\$\$/gm, name)))();
	if (!Plugin.name) {
		Plugin.name = name;
	}
	Plugin.prototype = plug;
	Plugin.prototype.constructor = Plugin;
	Plugin.defaults = defaults;
	var missingFunction = ['getValue', 'setValue', 'init', 'triggerChangeEvent'].filter(function (key) {
		return typeof plug[key] !== 'function';
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
	this.options = window.jQuery.extend({}, $$$.defaults, options);
	this.init();
	return this;
}
.toString();

var p = definePlugin('Tst', {
		init : function () {
			console.log(this)

		},
		getValue : function () {},
		setValue : function () {},
		triggerChangeEvent : function () {}
	}, {
		name : 11
	});

console.log(new p(1, 2, 3))
