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
        $(e.target).toggleClass('checked');
        $(e.target).toggleClass('unchecked');
    });
}

function RadioButton (el, group, defaultVal) {
    this.radioButton = el;
    this.radioButton.addClass('tpa-radio-button');

    this.val = defaultVal? defaultVal: "unchecked";

    this.radioButton.addClass(this.val);
    this.radioButton.attr('group', group);

    this.radioButton.on('click', function (e) {
        this.checkRadio($(e.target));
    }.bind(this));

   this.checkRadio = function (el) {
        el? el: this.radioButton;

        if (el.hasClass('checked')) {
            return;
        }
        $('.tpa-radio-button').removeClass('checked');
        $('.tpa-radio-button').addClass('unchecked');

        el.removeClass('unchecked');
        el.addClass('checked');
    }
}

function Slider(el) {
    var _SLIDER_OFFSET = 10;
    var $opacitySlider = el;
    var outputValue;

    $opacitySlider.addClass('tpa-slider-bar');

    var $bar = $("<div id=\"tpaBar\"></div>").appendTo($opacitySlider);

    var $left = $("<span class=\"tpa-slider-bar-left\"></div>").appendTo($bar);
    var $middle = $("<span class=\"tpa-slider-bar-body\"></div>").appendTo($bar);
    var $right = $("<span class=\"tpa-slider-bar-right\"></div>").appendTo($bar);

    var $slider = $("<div class=\"tpa-slider\"></div>").appendTo($bar);

    $(document).ready(function() {

        $slider.bind('mousedown', function(event) {
            var lastX = event.pageX;
            $(document).bind('mouseup.slider.drag', function() {
                unbindSliderDrag();

                var sliderPos = parseInt($slider.css('left'));
                var outputValue = (sliderPos + ($slider.width() / 2)) / ($bar.width() + 1);
                console.log(outputValue);
            });

            $(document).bind('mousemove.slider.drag', function(event) {
                setSliderPosition(event.pageX - lastX);
                lastX = event.pageX;
            });

            // cancel out any text selections
            document.body.focus();

            // prevent text selection in IE
            document.onselectstart = function () { return false; };
            // prevent IE from trying to drag an image
            event.target.ondragstart = function() { return false; };

            // prevent text selection (except IE)
            return false;
        });
    });

    function setSliderPosition(xMov) {
        if ( ((xMov < 0) && (($slider.position().left + xMov) < (0 - ($slider.width() / 2)))) ||
            ((xMov >= 0) && (($slider.position().left +  xMov) > ($bar.width() - ($slider.width() / 2)))) ) {
            return;
        }

        $slider.css('left', + ($slider.position().left + xMov) + 'px');

    }

    function unbindSliderDrag() {
        $(document).unbind('mousemove.slider.drag');
        $(document).unbind('mouseup.slider.drag');
    }

}

