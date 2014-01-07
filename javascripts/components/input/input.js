jQuery.fn.definePlugin('Input', function ($) {
	'use strict';
	
	var names = {
		inputClass: 'uilib-input',
		validInputClass: 'valid-input',
		invalidInputClass: 'invalid-input',
		disabledClass:'disabled'
	};
	
	return {
		init: function(){
			this.markup();
			this.setValue(this.options.value);
			this.bindEvents();
		},
		getDefaults: function(){
			return {
				value:'',
				validate: false,
				required: false,
				type: 'text',
				validation: {
					test: function(){
						return true;
					}
				}
			};
		},
		markup: function () {
			this.$input = $('<input>').attr('type', this.options.type).addClass(names.inputClass);
			this.$el.append(this.$input);
		},
		bindEvents: function () {
			var input = this;
			input.$input.change(function(){
				input.setValue(input.$input.val());
				input.triggerChangeEvent(input.getValue());
			});
			input.$input.on('keyup',function(){
				input.setValue(input.$input.val());
			});
		},
		getValue: function () {
			return this.value;
		},
		setValue: function (value) {
			var isPassRequiredValidation = this.options.required ? !!value.length : true; 		
			var isDifferentValue = (this.$input.val() !== this.value || value !== this.value);
			
			if(isPassRequiredValidation && this.options.validation.test(value) && isDifferentValue){
				this.lastValue = this.getValue();
				this.$input.val(value);
				this.value = value;
				if(this.options.validate){
					this.$input.removeClass(names.invalidInputClass).addClass(names.validInputClass);
				}
			} else if(this.$input.val() !== this.value){
				this.value = '';
				if(this.options.validate){
					this.$input.removeClass(names.validInputClass).addClass(names.invalidInputClass);
				}
			}
		},
		disable: function () {
			this.$el.addClass(names.disabledClass);
		},
		enable: function () {
			this.$el.removeClass(names.disabledClass);
		},
		isDisabled: function () {
			return this.$el.hasClass(names.disabledClass);
		}	
	};
	
});
