jQuery.fn.definePlugin('LanguagePicker', function () {
	'use strict';

    var styles = {
        className : 'uilib-languagePicker'
    };

	return {
		init : function () {
			this.markup();
            this.bindEvents();
		},
		markup : function () {
			this.dropdown = this.$el.Dropdown({
					   width: 56,
				      height: 150,
                optionsWidth: 105,
                    modifier: function($el){
                        var $globe = $("<span class='globe'></span>");
                        $el.text($el.attr('data-value'));
                        $el.prepend($globe);
                        return $el;
                    }
				}).data('plugin_Dropdown');
            if(!this.$el.hasClass(styles.className)){
                this.$el.addClass(styles.className);
            }
		},
		bindEvents : function () {
			var languagePicker = this;
			this.$el.on('Dropdown.change', function (evt, data) {
				evt.stopPropagation();
                languagePicker.triggerChangeEvent(data);
			});
		},
        getDefaults: function(){
            return {};
        },
		getValue : function () {
			return this.dropdown.getFullValue();
		},
		setValue : function (value) {
            return this.dropdown.setValue(value);
		}
	};
});
