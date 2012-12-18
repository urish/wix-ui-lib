/**
 * Created with IntelliJ IDEA.
 * User: mayah
 * Date: 12/12/12
 * Time: 2:52 PM
 * To change this template use File | Settings | File Templates.
 */

function Checkbox (el, defaultVal) {
    var checkbox = el;
    checkbox.addClass('tpa-checkbox');
    checkbox.addClass(defaultVal);

    checkbox.on('click', function (e) {
        var $el = $(e.target);
        $el.toggleClass('checked');
        $el.toggleClass('unchecked');

        var data = {
            type: $el.attr('id'),
            status: 'unchecked'
        }

        if ($(e.target).hasClass('checked'))
        {
            data.status = 'checked';
        }

        $(document).trigger('checkboxClicked', data);
    });
};

function RadioButton (el, group, defaultVal) {
    this.radioButton = el;
    this.radioButton.addClass('tpa-radio-button');

    this.val = defaultVal? defaultVal: "unchecked";

    this.radioButton.addClass(this.val);
    this.radioButton.attr('group', group);

    this.radioButton.on('click', function (e) {
        this.checkRadio($(e.target));

        $(document).trigger('radioButtonClicked', e.target.id);

    }.bind(this));

    this.initRadio = function () {
        this.checkRadio(this.radioButton);
    };

    this.checkRadio = function (el) {
        if (el.hasClass('checked')) {
            return;
        }
        $('.tpa-radio-button').removeClass('checked');
        $('.tpa-radio-button').addClass('unchecked');

        el.removeClass('unchecked');
        el.addClass('checked');
    };
};

function Slider(el) {
    this.$opacitySlider = el;
    this.outputValue = 0;

    this.$opacitySlider.addClass('tpa-slider-bar');

    this.$bar = $("<div id=\"tpaBar\"></div>").appendTo(this.$opacitySlider);

    var $left = $("<span class=\"tpa-slider-bar-left\"></div>").appendTo(this.$bar);
    var $middle = $("<span class=\"tpa-slider-bar-body\"></div>").appendTo(this.$bar);
    var $right = $("<span class=\"tpa-slider-bar-right\"></div>").appendTo(this.$bar);

    this.$slider = $("<div class=\"tpa-slider\"></div>").appendTo(this.$opacitySlider);



    this.$slider.bind('mousedown', function(event) {
        var lastX = event.pageX;
        $(document).bind('mouseup.slider.drag', function() {
            this.unbindSliderDrag();

            var sliderPos = parseInt(this.$slider.css('left'));
            this.outputValue = (sliderPos + (this.$slider.width() / 2)) / (this.$bar.width() + 1);

            var data = {
                type: this.$opacitySlider.attr("id"),
                value: this.outputValue
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


    this.setSliderPosition = function (xMov) {
        if ( ((xMov < 0) && ((this.$slider.position().left + xMov) < (0 - (this.$slider.width() / 2)))) ||
            ((xMov >= 0) && ((this.$slider.position().left +  xMov) > (this.$bar.width() - (this.$slider.width() / 2)))) ) {
            return;
        }

        this.$slider.css('left', + (this.$slider.position().left + xMov) + 'px');

    };

    this.setSliderNormalPosition = function(xMov) {
        xMov = xMov * this.$bar.width();
        this.setSliderPosition(xMov);
    };

    this.unbindSliderDrag = function () {
        $(document).unbind('mousemove.slider.drag');
        $(document).unbind('mouseup.slider.drag');
    };

}

