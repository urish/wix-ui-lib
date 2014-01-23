jQuery.fn.definePlugin('ToggleButtonGroup', function($){
	'use strict';
	
	return {
		init: function(){
			this.buttonGroup = this.$el.ButtonGroup(this.options).getPlugin();
		},
		getDefaults: function(){
			return {
				value:0,
				mode:'toggle'				
			}
		},		
		setValue: function (value) {
			return this.buttonGroup.setValue(value);
		},
		getValue: function () {
			return this.buttonGroup.getValue();
		},
		bindEvents: function () {},
		markup: function () {}
	};
	
});
