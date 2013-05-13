(function ($, window, document) {
	'use strict';

	function setPlacement(state) {
		Wix.Settings.setWindowPlacement(
			Wix.Utils.getOrigCompId(),
			state.placement,
			state.verticalMargin,
			state.horizontalMargin);
	}

	function updatePlacement(state, sliderPlugin, placement) {
		sliderPlugin.$el.removeClass('disabled');
		sliderPlugin.$el.removeClass(getPlacementOriantion(state));
		state.placement = placement;
		sliderPlugin.setValue(0, true);
		if (getPlacementOriantion(state) === 'other') {
			sliderPlugin.$el.addClass('disabled');
		} else {
			sliderPlugin.$el.addClass(getPlacementOriantion(state));
		}
		setPlacement(state);
	}

	function getPlacementOriantion(state) {
		if (state.placement === 'TOP_CENTER' || state.placement === 'BOTTOM_CENTER') {
			return 'horizontalMargin';
		} else if (state.placement === 'CENTER_RIGHT' || state.placement === 'CENTER_LEFT') {
			return 'verticalMargin';
		} else {
			return 'other';
		}
	}

	function getPlacement(cb) {
		Wix.Settings.getWindowPlacement(Wix.Utils.getOrigCompId(), cb);
	}

	var pluginName = 'GluedPosition';

	function Plugin(element, options) {
		this.state = {
			horizontalMargin : 0,
			verticalMargin : 0,
			placement : 'TOP_LEFT'
		};

		this.init(element, options);
	}

	Plugin.prototype.init = function (element, options) {
		var plugin = this;
		getPlacement(function (data) {
			plugin.state = data;

			var defaults = {
				placements : [],
				slider : {
					minValue : -2,
					maxValue : 2,
					value : plugin.state[getPlacementOriantion(plugin.state)] || 0,
					create : function () {
						if (getPlacementOriantion(plugin.state) === 'other') {
							this.$el.addClass('disabled');
						} else {
							this.$el.addClass(getPlacementOriantion(plugin.state));
						}
					},
					slide : function (val) {
						plugin.state[getPlacementOriantion(plugin.state)] = val;
						setPlacement(plugin.state);
					}
				},
				dropdown : {
					visibleRows : 8,
					on : {
						create : function () {
							this.setIndexByValue(plugin.state.placement);
						},
						change : function (evt) {
							updatePlacement(plugin.state, plugin.slider, evt.value);
						}
					}
				}
			};
			plugin.$el = $(element);
			plugin.options = $.extend({}, defaults, options);
			plugin.$slider = plugin.$el.find('.glued-slider');
			plugin.slider = plugin.$slider.AdvancedSlider(plugin.options.slider).data('AdvancedSlider');

			plugin.$dropdown = plugin.$el.find(".glued-dropdown")
				.html(plugin.dropdownHTML())
				.find('select')
				.msDropDown(plugin.options.dropdown);

			plugin.dropdown = plugin.$dropdown.data('dd');
		});
	}

	Plugin.prototype.dropdownHTML = function () {

		var placements = this.options.placements;
		if (placements.length === 0) {
			placements = ['TOP_LEFT', 'TOP_CENTER', 'TOP_RIGHT', 'CENTER_LEFT', 'CENTER_RIGHT', 'BOTTOM_LEFT', 'BOTTOM_CENTER', 'BOTTOM_RIGHT'];
		}

		function getOption(value, imageSpriteData, title) {
			return '<option value="' + value + '" data-image="#" data-imagecss="positionIcons ' + imageSpriteData + '" selected="selected">' + title + '</option>';
		}

		var options = placements.map(function (value) {
				var imageSpriteData,
				text;

				switch (value) {
				case 'TOP_LEFT':
					imageSpriteData = 'topLeft';
					text = 'Top Left';
					break;
				case 'TOP_RIGHT':
					imageSpriteData = 'topRight';
					text = 'Top Right';
					break;
				case 'BOTTOM_RIGHT':
					imageSpriteData = 'bottomRight';
					text = 'Bottom Right';
					break;
				case 'BOTTOM_LEFT':
					imageSpriteData = 'bottomLeft';
					text = 'Bottom Left';
					break;
				case 'TOP_CENTER':
					imageSpriteData = 'top';
					text = 'Top';
					break;
				case 'CENTER_RIGHT':
					imageSpriteData = 'right';
					text = 'Right';
					break;
				case 'BOTTOM_CENTER':
					imageSpriteData = 'bottom';
					text = 'Bottom';
					break;
				case 'CENTER_LEFT':
					imageSpriteData = 'left';
					text = 'Left';
					break;
				}

				return getOption(value, imageSpriteData, text);
			}).join('\n');

		return '<p>Select the position for your widget</p><select name="positionSelection" class="positionSelection">' + options + '</select>';
	}

	$.fn[pluginName] = function (options) {
		return this.each(function () {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName,
					new Plugin(this, options));
			}
		});
	};

	$.fn[pluginName].Constructor = Plugin;

})(jQuery, window, document);
