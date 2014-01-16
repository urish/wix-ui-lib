jQuery.fn.definePlugin('FontPicker', function () {
	'use strict';

	return {
		init : function () {
			this.isParamMode = this.getParamKey();//this.$el.attr('wix-param') || this.$el.attr('data-wix-param');
			this.markup();
			this.bindEvents();
		},
		markup : function () {
			appendSpriteMap(this.options.spriteUrl, this.$el);
			this.dropdown = this.$el.Dropdown({
					hideText : true,
					width : 280,
					height : 200,
					value: this.options.value
				}).data('plugin_Dropdown');
		},
		bindEvents : function () {
			var fontPicker = this;
			this.$el.on('Dropdown.change', function (evt, data) {
				evt.stopPropagation();
				if(fontPicker.isParamMode){
					data.fontParam = true;
				}
				fontPicker.triggerChangeEvent(data);
			});
		},
		getDefaults : function () {
			return {
				value: undefined,
				spriteUrl : Wix.Styles.getFontsSpriteUrl()
			};
		},
		getValue : function () {
			return this.dropdown.getFullValue();
		},
		setValue : function (value) {
			if(value.fontParam){
				value = value.value
			}
			return this.dropdown.setValue(value);
		}
	};


	function appendSpriteMap(spriteUrl, $el) {
		var fontsMeta = Wix.Settings.getEditorFonts();
		var spriteClass = 'fonts-sprite';
		var spriteHighlightClass = 'dropdown-highlight';
		var html = '';
		var index = 0;
		var maxSpriteIndex = 0;
		for (var f in fontsMeta) {
			index++;
			var font = fontsMeta[f];
			html += '<div class="' + (spriteClass + font.spriteIndex) + '" value="' + font.fontFamily + '">' + font.displayName + '</div>';
			maxSpriteIndex = (maxSpriteIndex > +font.spriteIndex) ? maxSpriteIndex : +font.spriteIndex;
		}
		var id = spriteClass + '_' + spriteHighlightClass;

		$el.html(html);

		var $style = $('#' + id);
		if (+$style.attr('data-length') >= maxSpriteIndex) {
			return;
		} else if ($style.length) {
			$style.remove();
		}
		var spriteMap = createSpriteMap(spriteUrl, '.' + spriteClass, maxSpriteIndex, 3, '.' + spriteHighlightClass);
		appendStyle(spriteMap, id, maxSpriteIndex);
	}

	function createSpriteMap(spriteUrl, selector, length, offsetY, hoverSelector) {

		var tpl = "background-image:url('$image');" +
			"background-repeat:no-repeat;" +
			"background-position: 0 $toppx;";

		tpl = tpl.replace('$image', spriteUrl);

		offsetY = offsetY || 0;
		hoverSelector = hoverSelector || ''
			var index = length + 1;
		var style = new Array(length * 2);
		var pos;
		var out;
		while (index--) {
			pos = (index * -24 + offsetY);
			out = tpl.replace('$top', pos);
			style[index] = (selector + index) + '{' + out + '}';
			style[index + length + 1] = (selector + index + hoverSelector) + '{' + out + ' }';
		}
		return style.join('\n');
	}

	function appendStyle(cssText, id, index) {
		var style = document.createElement('style');
		style.id = id;
		style.setAttribute('data-length', index);
		style.appendChild(document.createTextNode(cssText));
		var head = document.getElementsByTagName('head')[0];
		head.appendChild(style);
	}

});
