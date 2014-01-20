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
		setValidationFunction:function(validationFunction){
			if(typeof validationFunction === 'function'){
				this.options.validation = validationFunction;
			} else {
				throw new Error('You must provide a valid validation function.');
			}
		},
		getDefaults: function(){
			return {
				value:'',
				validate: false,
				required: false,
				type: 'text',
				placeholder: 'Text input',
				disabled : false,
				validation: function(){
					return true;
				}
			};
		},
		markup: function () {
			this.$input = $('<input>').attr('type', this.options.type).attr('placeholder', this.options.placeholder).addClass(names.inputClass);
			if (this.options.disabled){
				this.disable();
			}
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
			if(isPassRequiredValidation && this.options.validation(value) && isDifferentValue){
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
			} else {
				if (this.$input.val() === ''){
					this.$input.removeClass(names.invalidInputClass);
				}
			}
		},
		disable: function () {
			this.$input.addClass(names.disabledClass);
			this.$input.attr('disabled', 'disabled');
		},
		enable: function () {
			this.$input.removeClass(names.disabledClass);
			this.$input.removeAttr('disabled', 'disabled');
		},
		isDisabled: function () {
			return this.$input.hasClass(names.disabledClass);
		}	
	};
	
});
