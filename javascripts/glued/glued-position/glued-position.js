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
		sliderPlugin.$el.removeClass(getPlacementOrientation(state));
		state.placement = placement;
		sliderPlugin.setValue(0, true);
		if (getPlacementOrientation(state) === 'other') {
			sliderPlugin.$el.addClass('disabled');
		} else {
			sliderPlugin.$el.addClass(getPlacementOrientation(state));
		}
		setPlacement(state);
	}

	function getPlacementOrientation(state) {
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

        if (options.initWithBinding) {
            this.initWithBinding(element, options);
        } else {
            this.init(element, options);
        }
	}

    Plugin.prototype.init = function (element, options) {
        var plugin = this;
        getPlacement(function (data) {
            plugin.state = data;

            var defaults = _getDefaults();

            plugin.$el = $(element);
            plugin.options = $.extend({}, defaults, options);
            plugin.$slider = plugin.$el.find('.glued-slider');
            plugin.slider = plugin.$slider.AdvancedSlider(plugin.options.slider).data('AdvancedSlider');
            if (plugin.options.change) {
                plugin.$slider.change = plugin.options.change;
            }
            plugin.$dropdown = plugin.$el.find(".glued-dropdown")
                .html(plugin.dropdownHTML())
                .find('select')
                .msDropDown(plugin.options.dropdown);

            plugin.dropdown = plugin.$dropdown.data('dd');
        });
    }

	Plugin.prototype.initWithBinding = function (element, options) {
		var plugin = this;
		getPlacement(function (data) {
			plugin.state = data;

			var defaults = _getDefaults();

			plugin.$el = $(element);
			plugin.options = $.extend({}, defaults, options);
			plugin.$slider = plugin.$el.find('.glued-slider');
			plugin.slider = plugin.$slider.AdvancedSlider(plugin.options.slider).data('AdvancedSlider');
            if (plugin.options.change) {
                plugin.$slider.change = plugin.options.change;
            }
			plugin.$dropdown = plugin.$el.find(".glued-dropdown")
				.html(plugin.dropdownHTML())
				.find('select')
				.msDropDown(plugin.options.dropdown);

			plugin.dropdown = plugin.$dropdown.data('dd');
		});
	}

    function _getDefaults() {
        return {
            placements : [],
                slider : {
            minValue : -2,
                maxValue : 2,
                value : plugin.state[getPlacementOrientation(plugin.state)] || 0,
                create : function () {
                var elWidth = this.$el.width();

                this.$center = $('<div class="wix-slider-back">');
                this.$leftLine = $('<div class="wix-slider-back">');
                this.$rightLine = $('<div class="wix-slider-back">');

                this.$leftLine.css({
                    left:elWidth/4,
                    background:'rgba(0,0,0,0.13)',
                    width:1
                }).prependTo(this.$el);

                this.$center.css({
                    left:elWidth/2 - 1,
                    background:'rgba(0,0,0,0.2)'
                }).prependTo(this.$el);

                this.$rightLine.css({
                    left:(elWidth/4)*3,
                    background:'rgba(0,0,0,0.13)',
                    width:1
                }).prependTo(this.$el);

                this.$ribbon = $('<div class="wix-slider-back">').prependTo(this.$el);

                if (getPlacementOrientation(plugin.state) === 'other') {
                    this.$el.addClass('disabled');
                } else {
                    this.$el.addClass(getPlacementOrientation(plugin.state));
                }
            },
            slide : function (val) {
                var pinWidth = this.$pin.width()/2;
                var elWidth = this.$el.width()/4;

                if(val > 1){
                    var range = (val - 1);
                    var w = elWidth * range;
                    this.$ribbon.css({
                        width:elWidth - w + range * pinWidth,
                        right:0,
                        left:'auto',
                        borderRadius: '0 8px 8px 0'
                    });
                }

                if(val >= 0 && val <= 1){
                    var w = elWidth * (val);
                    this.$ribbon.css({
                        width:w,
                        right:'auto',
                        left:elWidth * 2,
                        borderRadius:0
                    });
                }

                if(val < -1){
                    var range = ((val*-1) - 1);
                    var w = elWidth * range;
                    this.$ribbon.css({
                        width: (elWidth - w) + range * pinWidth,
                        left:0,
                        right:'auto',
                        borderRadius: '8px 0 0 8px'
                    });
                }


                if(val < 0 && val >= -1){
                    var w = elWidth * ((val*-1));
                    this.$ribbon.css({
                        width: w,
                        right:elWidth *2,
                        left:'auto',
                        borderRadius:0
                    });
                }

                plugin.state[getPlacementOrientation(plugin.state)] = val;
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
