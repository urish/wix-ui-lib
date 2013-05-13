;(function ( $, window, document, undefined ) {

	var pluginName = 'AdvancedSlider';

    var defaults = {
        minValue: 0,
        maxValue: 1,
        value:0.5,
        sliderSize:158,
		slide: function(){},
		create:function(){}
    };

    function AdvancedSlider( element, options ) {
        this.$el = $(element);
        this.options = $.extend( {}, defaults, options) ;
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    AdvancedSlider.prototype.init = function () {
        this.markup();
        this.registerEvents();
		this.options.create.call(this);
		this.setValue(this.options.value);
    };
		
    AdvancedSlider.prototype.markup = function () {
        this.$pin = $('<div>');
        this.$el.append(this.$pin);
        this.$el.addClass('wix-advanced-slider').css({
            width: this.options.sliderSize
        });
        this.$pin.addClass('wix-advanced-slider-pin');
    };

    AdvancedSlider.prototype.registerEvents = function () {
        var $body = $(document.body);
        var slider = this;
        this.$el.on('click', function(evt){
            slider.setValueFromEvent(slider.getXFromEvent(evt));
        });
        this.$pin.on('mousedown', function(){
            function mousemove_handler(evt){
                slider.setValueFromEvent(slider.getXFromEvent(evt));
            }
            function mouseup_handler(evt){
                $body.off('mousemove',mousemove_handler);
                $body.off('mouseup',mouseup_handler);
                $body.off('mouseleave', mouseup_handler);
            }
            $body.on('mousemove', mousemove_handler);
            $body.on('mouseup', mouseup_handler);
            $body.on('mouseleave', mouseup_handler);
        });
    };

    AdvancedSlider.prototype.getXFromEvent = function (evt) {
		if(this.$el.hasClass('disabled')){return;}
		var offset = this.$el.position();
		var pos = evt.clientX - offset.left;
        return this.validatePxValue(pos);
    };

    AdvancedSlider.prototype.update = function () {
        this.$pin.css({left:this.options.value * (this.$el.width() - this.$pin.width())});
        return this;
    };

    AdvancedSlider.prototype.getValue = function () {
        return this.transform(this.options.value);
    };

    AdvancedSlider.prototype.transform = function (valueInRange) {
        return this.options.minValue + valueInRange * (this.options.maxValue - this.options.minValue);
    };
	
	AdvancedSlider.prototype.reverseTransform = function (valueOutOfRange) {
		return (valueOutOfRange - this.options.minValue) / (this.options.maxValue - this.options.minValue);
        
    };

    AdvancedSlider.prototype.validatePxValue = function (valueInPx) {
		var maxVal = this.options.sliderSize;
        valueInPx = valueInPx < 0 ? 0 : valueInPx;
        valueInPx = valueInPx > maxVal ? maxVal : valueInPx;		
        return valueInPx / maxVal;
    };
		
    AdvancedSlider.prototype.validateNormValue = function (valueNorm) {
        valueNorm = valueNorm < this.options.minValue ? this.options.minValue : valueNorm;
        valueNorm = valueNorm > this.options.maxValue ? this.options.maxValue : valueNorm;		
        return valueNorm;
    };

    AdvancedSlider.prototype.setValueFromEvent = function (valueInRange) {
        this.options.value = valueInRange;
		if(this.options.value !== this.last_value){
			this.last_value	= this.options.value;
			this.$el.trigger('slide', this.getValue());
			this.options.slide.call(this, this.getValue());
		}	
        return this.update();
    };
	
	AdvancedSlider.prototype.setValue = function (valueInRange) {	
        this.options.value = this.reverseTransform(this.validateNormValue(valueInRange));
		if(this.options.value !== this.last_value){
			this.last_value	= this.options.value;
			this.$el.trigger('slide', this.getValue());
			this.options.slide.call(this, this.getValue());
		}	
        return this.update();
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new AdvancedSlider(this, options));
            }
        });
    };

})(jQuery, window, document);
