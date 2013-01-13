(function ($, window, document) {
    'use strict';

    var pluginName = 'Slider',
        defaults = {};

    function Plugin(element, options) {
        this.$el = $(element);
        this.options = $.extend({}, defaults, options);
        this.init();
    }

    Plugin.prototype.init = function() {
        this.outputValue = 0;

        this.$bar = $("<div>").addClass('slider-bar');
        this.$knob = $("<div>").addClass('knob');
        this.$val = $("<span>").addClass('val');

        $([this.$bar, this.$knob, this.$val]).appendTo(this.$el);

        var left = $("<span>").addClass('slider-left');
        var right = $("<span>").addClass('slider-right');
        var middle = $("<span>").addClass('slider-middle');

        $([left, middle, right]).appendTo(this.$bar);

        this.$el.find('.val').html(this.options.type + ": 0.00");

        this.$knob.bind('mousedown', function(event) {
            var lastX = event.pageX;

            this.sliderWidth = this.$el.find('.slider-middle').width();

            $(document).bind('mouseup.slider.drag', function() {
                this.unbindSliderDrag();

                var sliderPos = parseInt(this.$knob.css('left'), 10);

                if (sliderPos > this.sliderWidth) {
                    return;
                }

                var data = {
                    type: this.$el.attr('id'),
                    value: this.getSliderValue(sliderPos)
                };

                $(document).trigger("sliderValueChanged", data);

            }.bind(this));

            $(document).bind('mousemove.slider.drag', function(event) {
                this.setSliderPosition(event.pageX - lastX);
                lastX = event.pageX;
            }.bind(this));

            // cancel out any text selections
            document.body.focus();

            // prevent text selection in IE
            document.onselectstart = function () { return false; };
            // prevent IE from trying to drag an image
            event.target.ondragstart = function() { return false; };

            // prevent text selection (except IE)
            return false;
        }.bind(this));
    };

    Plugin.prototype.getSliderValue = function (pos) {
        var knobOffset = pos + (this.$knob.width() / 2);
        var sliderWidth = this.$bar.find('.slider-middle').width();
        return (knobOffset / sliderWidth).toFixed(2);
    };

    Plugin.prototype.setSliderPosition = function (xMov) {
        var knob = this.$knob.width();
        var leftMovment = xMov < 0;
        var rightMovment = xMov > 0;
        var leftest = (0 - (knob / 2));
        var rightest = this.$bar.find('.slider-middle').width() - (knob / 2);
        var step = this.$knob.position().left + xMov;
        var leftLimit = leftMovment && (step < leftest);
        var rightLimit = rightMovment && (step > rightest);
        var pos = this.$knob.position().left + xMov;

        if (leftLimit || rightLimit) {
            return;
        }

        this.$knob.css('left', + pos + 'px');
        this.$el.find('.val').html(this.options.type + ': ' + this.getSliderValue(pos));
    };

    Plugin.prototype.unbindSliderDrag = function () {
        $(document).unbind('mousemove.slider.drag');
        $(document).unbind('mouseup.slider.drag');
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                    new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);