jQuery.fn.definePlugin('ButtonGroup', function($){
	'use strict';
	
	var names = {
		btnGroupClass : 'btn-group',
		valueAttrName : 'data-value',
		indexAttrName : 'data-index',
		selectedClass : 'uilib-selected',
		btnClass : 'uilib-button',
		btnClassToDeprecate : 'btn default',
		btnSelectedClassToDeprecate : 'active'
	};
	
	return {
		init: function(){
			this.$selected = null;
			this.markup();
			this.setValue(this.options.value);
			this.bindEvents();
		},
		getDefaults: function(){
			return {value : 0};
		},
		markup: function () {
			this.$el.addClass(names.btnGroupClass);
			this.getOptionsButtons().addClass(names.btnClass + ' ' + names.btnClassToDeprecate);
		},
		getOptionsButtons: function () {
			return this.$el.find('button');
		},
		setValue: function (value) {
			var $option;
			var $options = this.getOptionsButtons();
			if (typeof value === 'number') {
				$option = $options.eq(value);
			} else if (typeof value === 'string') {
				$option = $options.filter('[value="' + value + '"]').eq(0);
			} else if ($(value).hasClass(names.btnClass)) {
				$option = value;
			} else if(value && typeof value === 'object'){
				$option = $options.eq(value.index);
			}
			if ($option.length) {
				$options.removeClass(names.selectedClass + ' ' + names.btnSelectedClassToDeprecate);
				$option.addClass(names.selectedClass + ' ' + names.btnSelectedClassToDeprecate);
				this.$selected = $option;
			}
		},
		getValue: function () {
			return {
				index: this.getIndex(),
				value: this.$selected.val()
			};
		},
		getIndex: function () {
			return +this.getOptionsButtons().index(this.$selected);
		},
		bindEvents: function () {
			var btnGroup = this;
			this.$el.on('click', '.' + names.btnClass, function (evt) {
				evt.stopPropagation();
				var value = $(this).val();
				if (btnGroup.$selected.val() !== value) {
					btnGroup.setValue(value);
					btnGroup.triggerChangeEvent({
						index: btnGroup.getIndex(),
						value: value
					});
				}
			});
		}
	};
	
});
