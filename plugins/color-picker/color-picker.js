(function ($, window, document, undefined) {
	'use strict';
	
	var pluginName = 'SimpleColorPicker',
	
	defaults = {
		initColor : '#267B84',
		colorUnit : "color-unit",
		colorUnitInner : "color-unit-inner",
		active : 'active',
		layout: {
			type: 'vertical',
			width: 5
		},
		colors : ['#50FAFE', '#FFFFFF', '#0088CB', '#ED1C24', '#FFCB05', '#727272',
			'#727272', '#B0B0B0', '#CECECE', '#9C9C9C', '#6C6C6C', '#484848', '#242424', '#C4EEF6', '#A5E1ED',
			'#59CEE5', '#3B8999', '#1D444C', '#FFFDFD', '#999999', '#666666', '#444444', '#000000', '#E4A3B8',
			'#CA748F', '#AF1A49', '#751131', '#3A0818', '#D5E7A6', '#B8CF78', '#8EB71D', '#5E7A13', '#2F3D09']
	};
	
	// The actual plugin constructor
	function Plugin(element, options) {
		this.$el = $(element);
		this.options = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	};
	
	Plugin.prototype.init = function () {
		this.bindEvents();
		
		if (this.options.layout.type === "horizontal") {
			this.arrangeHorizontal();
			return;
		}
		
		this.arrangeVertical();
	};
	
	Plugin.prototype.arrangeVertical = function() {
		var opt = this.options.layout;
		var linesInCol = this.options.colors.length / opt.width;

		this.options.colors.reverse();
		
		for (var i = 0; i < linesInCol; ++i) {
			var currentRow = this.newRow();
			
			for (var j = 0; j < opt.width; ++j) {
				currentRow.append(this.createColor(this.options.colors[(j*opt.width)+i]));
			}
		}
	},

	Plugin.prototype.arrangeHorizontal = function() {
		var opt = this.options;
		
		var currentRow = this.newRow();
		
		for (var i = 0; i < opt.colors.length; ++i) {
			currentRow.append(this.createColor(opt.colors[i]));
			
			if (((i+1) % opt.layout.width) === 0) {
				currentRow = this.newRow();
			}
		}		
	},
	
	Plugin.prototype.newRow = function() {
		return $('<div>', {class: "palette-row"}).appendTo(this.$el)
	},
	
	Plugin.prototype.createColor = function (colorHex) {
		var opt = this.options;
			
		var colorInner = $('<span>', {
			class: opt.colorUnitInner
		}).css('background-color', colorHex);

		var colorWrapper = $('<div>', {
			class: opt.colorUnit,
			value: colorHex,
		}).append(colorInner);
		
		if (colorHex === opt.initColor) {
			colorWrapper.addClass(opt.active);
		}
		
		return colorWrapper;
	}
		
	Plugin.prototype.bindEvents = function () {
		var opt = this.options;
		
		this.$el.on('click', '.' + opt.colorUnit, function (e) {
			var $this = $(this);
			$('.' + opt.active).removeClass(opt.active);
			$this.addClass(opt.active);
            $(document).trigger('colorChanged', $this.val());
		});
	};

	$.fn[pluginName] = function (options) {
		return this.each(function () {
			if (!$.data(this, 'plugin_' + pluginName)) {
				$.data(this, 'plugin_' + pluginName,
					new Plugin(this, options));
			}
		});
	};

	$.fn[pluginName].Constructor = Plugin;

	
})(jQuery, window, document);