(function ($, window, document, undefined) {
    'use strict';
	var pluginName = 'Spinner';
	var defaults = {
		minValue : 0,
		maxValue : 1000,
		value : 0,
        step: 1,
        precision: 0
	};
    var styles = {
        className : 'uilib-spinner',
        upArrow   : 'up-arrow',
        downArrow : 'down-arrow'
    };
    var events = {
        mouseDown  : 'mousedown',
        mouseUp    : 'mouseup',
        mouseLeave : 'mouseleave',
        focusOut   : 'focusout',
        keypress   : 'keypress'
    };

	function Plugin(element, options) {
		this.$el = $(element);
		this.options = $.extend({}, defaults, options);
        this.init();
    }

	Plugin.prototype.init = function () {
		this.markup();
		this.bindEvents();
		this.setValue(this.options.value);
	};

	Plugin.prototype.markup = function () {
        this.$el
            .append("<input autocomplete='off'>")
            .append(_buttonHtml());
        if(!this.$el.hasClass(styles.className)){
            this.$el.addClass(styles.className);
        }
	};

	Plugin.prototype.bindEvents = function () {
        var spinner = this;
        var dir = 0;
        var autoRollTicket;

        var startAutoRoll = function(){
            clearTimeout(autoRollTicket);
            autoRollTicket = setTimeout(function(){
                spinner.setValue(_parse(spinner.getValue()) + spinner.options.step * dir);
                startAutoRoll();
            },100);
        }

        this.$el.on(events.mouseUp + ' ' + events.mouseLeave, function(){
           clearTimeout(autoRollTicket);
           dir = 0;
        });

        this.$el.on(events.mouseDown, '.' + styles.upArrow, function(){
            spinner.setValue(_parse(spinner.getValue()) + spinner.options.step);
            spinner.$el.trigger(pluginName + '.change', spinner.getValue());

            dir = 1;
            clearTimeout(autoRollTicket);
            autoRollTicket = setTimeout(startAutoRoll, 500);
        });

        this.$el.on(events.mouseDown, '.' + styles.downArrow, function(){
            spinner.setValue(_parse(spinner.getValue()) - spinner.options.step);
            spinner.$el.trigger(pluginName + '.change', spinner.getValue());

            dir = -1;
            clearTimeout(autoRollTicket);
            autoRollTicket = setTimeout(startAutoRoll, 500);
        });

        this.$el.on(events.focusOut, 'input', function(){
            if(spinner.setValue(_parse(spinner.getValue()))){
                spinner.$el.trigger(pluginName + '.change', spinner.getValue());
            }
        });

        this.$el.on(events.keypress, 'input', function(e){
            if (e.which == 13){
                if(spinner.setValue(_parse(spinner.getValue()))){
                    spinner.$el.trigger(pluginName + '.change', spinner.getValue());
                }
            }
        });
	};

	Plugin.prototype.update = function () {
        this.$el.find('input').val(this.options.value);
		return this;
	};

	Plugin.prototype.getValue = function () {
        return +this.$el.find('input').val();
	};

	Plugin.prototype.valueInRangeToInnerRange = function (value) {
        value = (+value).toFixed(this.options.precision);
		value = value < this.options.minValue ? this.options.minValue : value;
		value = value > this.options.maxValue ? this.options.maxValue : value;
		return value;
	};

	Plugin.prototype.setValue = function (valueInRange) {
		this.options.value = this.valueInRangeToInnerRange(valueInRange);
		if (this.options.value !== this.last_value) {
			this.last_value = this.options.value;
            this.update();
            return true;
		}
	};

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
            }
        });
    };

    function _buttonHtml() {
        return "" +
            "<div class=" + styles.upArrow + "></div>" +
            "<div class=" + styles.downArrow +"></span>";
    }

    function _parse(val) {
        if (typeof val === "string" && val !== "" ) {
            val = parseFloat(val);
        }
        return val === "" || isNaN(val) ? null : val;
    }

})(jQuery, window, document);
