(function ($, window, document, undefined) {
	'use strict';

var pluginName = 'Dropdown';

var defaults = {
	slideTime : 150,
	selected: 0,
	value: undefined,
	autoCloseTime : 50000,
	optionSelector : '[value]',
	spriteMap: '',
	hideText: false,
	width:'',
	height:'',
	style: 'dropdown-style-1'
};

var downArrow = '<span class="dropdown-arrow">&#9660;</span>';

var names = {
	valueAttrName : 'data-value',
	indexAttrName : 'data-index',
	dropDownClassName : 'dropdown',
	activeClassName : 'focus-active',
	optionInitValueAttrName : 'value',
	optionClassName : 'option',
	optionsClassName : 'options',
	selectedClassName : 'selected',
	selectedOptionsClassName : 'option-selected',
	highlightClassName : 'dropdown-highlight',
	iconClassName: 'dropdown-icon',
	hideTextClass: 'dropdown-hideText'
};

var optionsCSS = {
	width : '100%',
	position : 'absolute',
	top : '100%',
	zIndex : '999999'
};

var dropdownCSS = {
	position : 'relative'
};

function DropDown(element, options) {
	this.options = $.extend({}, defaults, options);
	this.options.value = this.options.value !== undefined ? this.options.value : this.options.selected;
	this.$selected = null;
	this.$options = null;
	this.$el = $(element);
	this.isParamMode = this.$el.attr('wix-param') || this.$el.attr('data-wix-param');
	this.isOpen = false;
	this.isActive = false;
	this.init();
}

DropDown.prototype.init = function () {
	this.markup();
	this.setValue(this.options.selected);
	this.bindEvents();
	this.hideOptions(0);
};

DropDown.prototype.markup = function () {
	var dd = this;
	var $el = this.$el.addClass(names.dropDownClassName + ' ' + this.options.style);//.css(dropdownCSS);
	var $options = this.$el.find(this.options.optionSelector).map(function (index) {
	
			var $option = $('<div>')
				.attr(names.valueAttrName, this.getAttribute(names.optionInitValueAttrName))
				.attr(names.indexAttrName, index)
				.addClass(names.optionClassName)
				.text(this.textContent);
	
			if(dd.options.hideText){
				$option.addClass(names.hideTextClass);
			}
			var iconUrl = this.getAttribute('data-icon');
			
			if(iconUrl){
				$option.prepend('<img src="'+iconUrl+'" class="'+names.iconClassName+'"/>');
			}		
			if(dd.options.spriteMap){
				$option.addClass(dd.options.spriteMap+index);
			}
			return $option;
		}).toArray();

	this.$selected = $('<div>').addClass(names.selectedClassName);
	this.$options = $('<div>').addClass(names.optionsClassName).append($options).css(optionsCSS);
	if(this.options.width){
		this.$options.css('width', this.options.width);
		$el.css('width', this.options.width);
	}
	if(this.options.height){
		this.$options.css('height', this.options.height);
	}
	this.$el.empty();
	
	this.$el.append(downArrow, this.$selected, this.$options);
		
};

DropDown.prototype.setValue = function (value) {
	var $option;
	if (typeof value === 'number') {
		$option = this.$options.find('[' + names.indexAttrName + '="' + value + '"]').eq(0);
	} else if (typeof value === 'string') {
		$option = this.$options.find('[' + names.valueAttrName + '="' + value + '"]').eq(0);
	} else if (value instanceof jQuery) {
		$option = value;
	}
	if ($option.length && this.getIndex() !== $option.attr(names.indexAttrName)) {
		this.$options.find('.'+names.selectedOptionsClassName).removeClass(names.selectedOptionsClassName);
		this.$selected.empty();
		this.$selected.append($option.clone(true).addClass('current-item').removeClass(names.highlightClassName));
		$option.addClass(names.selectedOptionsClassName);
		return true;
	}
	return false;
};



DropDown.prototype.getFullValue = function () {
	return {
		value: this.getValue(),
		index: this.getIndex()
	};
};

DropDown.prototype.setValueFromEl = function ($el) {
	var index = +$el.attr(names.indexAttrName);
	if(this.setValue(index)){
		var value = this.isParamMode ? this.getFullValue() : $el.attr(names.valueAttrName);
		this.$el.trigger(pluginName + '.change', value);		
	}
};

DropDown.prototype.setActiveMode = function (isActive) {
	this.isActive = isActive;
	if (isActive) {
		this.$el.addClass(names.activeClassName);
	} else {
		this.$el.removeClass(names.activeClassName);
	}
};

DropDown.prototype.getValue = function () {
	return this.$selected.find('.' + names.optionClassName).attr(names.valueAttrName);
};

DropDown.prototype.getIndex = function () {
	return +this.$selected.find('.' + names.optionClassName).attr(names.indexAttrName);
};

DropDown.prototype.hideOptions = function (time) {
	this.isOpen = false;
	this.$options.slideUp(time !== undefined ? time : this.options.slideTime);
};

DropDown.prototype.showOptions = function (time) {
	var $options = this.$options;
	var $el = $options.find('[' + names.indexAttrName + '="' + this.getIndex() + '"]').eq(0);
	this.isOpen = true;
	this.highlightOption($el);
	$options.slideDown(time !== undefined ? time : this.options.slideTime, function(){
		$options.css('overflow', 'auto');
	});
};

DropDown.prototype.toggleOptions = function (time) {
	return this.isOpen ? this.hideOptions(time) : this.showOptions(time);
};

DropDown.prototype.highlightOption = function ($el) {
	if ($el.length) {
		this.$options.find('.' + names.highlightClassName).removeClass(names.highlightClassName);
		$el.addClass(names.highlightClassName);
	}
};

DropDown.prototype.bindAutoClose = function (closeDelay) {
	var fold;
	var dropdown = this;

	this.$el.hover(function () {
		clearTimeout(fold);
	}, function () {
		clearTimeout(fold);
		if (dropdown.isOpen) {
			fold = setTimeout(function () {
					if (dropdown.isOpen) {
						dropdown.setActiveMode(false);
						dropdown.hideOptions();
					}
				}, closeDelay);
		}
	});
};

DropDown.prototype.bindEvents = function () {
	var dropdown = this;

	if (this.options.autoCloseTime) {
		this.bindAutoClose(this.options.autoCloseTime);
	}

	this.$options.on('mouseenter', '.' + names.optionClassName, function () {
		dropdown.highlightOption($(this));
	});

	this.$options.on('click', '.' + names.optionClassName, function () {
		dropdown.setValueFromEl($(this));
	});

	this.$el.on('click', function (evt) {
		evt.stopPropagation();
		dropdown.setActiveMode(true);
		dropdown.toggleOptions();
	});
	
	this.$el.on('mousedown', function (evt) {
		evt.stopPropagation();
	});
	
	$(window).on('mousedown', function (evt) {
		dropdown.hideOptions();
		dropdown.setActiveMode(false);
	});
	
	var ENTER = 13,
		SPACE = 32,
		ESC = 27,
		TAB = 9,
		UP = 38,
		DOWN = 40,
		PAGE_UP = 33,
		PAGE_DOWN = 34,
		PAGE_MOVE_ITEMS = 5,
		ARROW_MOVE_ITEMS = 1
	
	$(window).on('keydown', function (evt) {
		var $el, dir, items;
		if (dropdown.isActive) {
			//add Tab & Space
			if (evt.which === ENTER || evt.which === SPACE) {
				dropdown.toggleOptions();
				evt.preventDefault();
			}

			if (evt.which === ESC || evt.which === TAB) {
				dropdown.hideOptions();
				dropdown.setActiveMode(false);
				evt.preventDefault();
			}
			
			//up/down/pageup/pagedown
			if (evt.which === UP || evt.which === DOWN || evt.which === PAGE_UP || evt.which === PAGE_DOWN) {
				$el = dropdown.$options
                    .find('[' + names.indexAttrName + '="' + dropdown.getIndex() + '"]')
					.eq(0);
                
				dir = (evt.which === UP || evt.which === PAGE_UP) ? 'prev' : 'next';
				items = (evt.which === UP || evt.which === DOWN) ? ARROW_MOVE_ITEMS : ((dropdown.$options.height() / $el.height())<<0 || PAGE_MOVE_ITEMS);
				
				var _$el;
				while (items--) {
					_$el = $el;
					$el = $el[dir]('.' + names.optionClassName);
					if($el.length ===0){
						$el  = _$el;
					}
				}
				
				dropdown.highlightOption($el);
				dropdown.setValueFromEl($el);
				
				if($el.length){
					dropdown.$options.clearQueue().animate({
						scrollTop: dropdown.$options.scrollTop() + $el.position().top
					}, 200);
				}
				evt.preventDefault();
			}

		}
	});
};

	$.fn[pluginName] = function (options) {
		return this.each(function () {
			if (!$.data(this, 'plugin_' + pluginName)) {
				$.data(this, 'plugin_' + pluginName, new DropDown(this, options));
			}
		});
	};


})(jQuery, window, document);
