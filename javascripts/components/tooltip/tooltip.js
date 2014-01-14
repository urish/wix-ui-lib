jQuery.fn.definePlugin('Tooltip', function ($) {
	'use strict';
	
	var styles = {
        className : 'uilib-tooltip',
		textClassName : 'uilib-text',
		arrowTopClassName : 'arrowTop',
		arrowLetfClassName : 'arrowLeft',
		arrowHeight : 12
    };
    var events = {
        mouseEnter : 'mouseenter',
        mouseLeave : 'mouseleave'
    };
	
	return {
		init: function(){
			this.markup();
			this.bindEvents();
		},
		getDefaults: function(){
			return {
				placement : 'top',
				html      : false,
				template  : '<div class=' + styles.className + '>' +
					'<div class="arrow_box">' +
					'<div class="uilib-text"></div>' +
					'</div>' +
					'</div>'
			}
		},
		markup: function (){
		},
		bindEvents: function () {
			var tooltip = this;
			var $elm = tooltip.$el;
			$elm.on(events.mouseEnter, function (evt) {
				tooltip.remove();
				var $tooltip = $(tooltip.options.template);
				var $toolTipValue = $tooltip.find("." + styles.textClassName).html($elm.attr("wix-title"));
				if(tooltip.options.html){
					$toolTipValue.html($elm.attr("wix-title"));
				} else {
					$toolTipValue.text($elm.attr("wix-title"));
				}
				$elm.after($tooltip);
				if(tooltip.options.placement === 'top'){
					setTopPlacement($tooltip);
				} else if(tooltip.options.placement === 'right'){
					setRightPlacement($tooltip);
				} else if(tooltip.options.placement === 'left'){
					setLeftPlacement($tooltip);
				} else if(tooltip.options.placement === 'bottom'){
					setBottomPlacement($tooltip);
				}
			});

			function setTopPlacement($tooltip){
				$tooltip.find('.arrow_box').addClass('down');
				$tooltip.css('left', $elm.offset().left + calcOffsetLeft($tooltip));
				$tooltip.css('top', $elm.offset().top - ($tooltip.outerHeight() + styles.arrowHeight));
			}

			function setBottomPlacement($tooltip){
				$tooltip.find('.arrow_box').addClass('up');
				$tooltip.css('left', $elm.offset().left + calcOffsetLeft($tooltip));
				$tooltip.css('top', $elm.offset().top + $elm.outerHeight() + styles.arrowHeight);
			}

			function setRightPlacement($tooltip){
				$tooltip.find('.arrow_box').addClass('left');
				$tooltip.css('left', $elm.offset().left + $elm.outerWidth() + styles.arrowHeight);
				$tooltip.css('top', $elm.offset().top + calcOffsetTop($tooltip));
			}

			function setLeftPlacement($tooltip){
				$tooltip.find('.arrow_box').addClass('right');
				$tooltip.css('left', $elm.offset().left - ($tooltip.outerWidth() + styles.arrowHeight));
				$tooltip.css('top', $elm.offset().top + calcOffsetTop($tooltip));
			}

			function calcOffsetLeft($tooltip){
				if($elm.outerWidth() > $tooltip.outerWidth()){
					var diff = $elm.outerWidth() - $tooltip.outerWidth();
					return diff/2;
				}else{
					var diff = $tooltip.outerWidth() - $elm.outerWidth();
					return -diff/2;
				}
			}

			function calcOffsetTop($tooltip){
				if($elm.outerHeight() > $tooltip.outerHeight()){
					var diff = $elm.outerHeight() - $tooltip.outerHeight();
					return diff/2;
				}else{
					var diff = $tooltip.outerHeight() - $elm.outerHeight();
					return -diff/2;
				}
			}

			$elm.on(events.mouseLeave, function (evt) {
				$("." + styles.className).fadeOut(function(){
					$(this).remove();
				});
			});
		},
		getValue: function () {
			return "";
		},
		setValue: function (value) {
            "";
		},
		update: function () {
            return this;
		},
		remove: function(){
			$("." + styles.className).remove();
		}
	};
});

