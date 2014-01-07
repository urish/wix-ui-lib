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
            var $options = _optionsHtml();
            this.$el.append($options);

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

    function _optionsHtml() {
        var $options = $('<div value="En">English</div>' +
            '<div value="De">Deutsch</div>' +
            '<div value="Es">Español</div>' +
            '<div value="Fr">Français</div>' +
            '<div value="It">Italiano</div>' +
            '<div value="Po">Polski</div>' +
            '<div value="Pt">Português</div>' +
            '<div value="Ru">Русский</div>' +
            '<div value="Ja">日本語</div>' +
            '<div value="Ko">한국어</div>' +
            '<div value="Tr">Türkçe</div>');
        return $options;
    }
});
