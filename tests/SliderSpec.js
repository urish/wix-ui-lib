describe('Slider', function () {
    'use strict';

    var element;
    beforeEach(function () {
        this.addMatchers({
            toBeWixed: function() {
                var $element = this.actual.find('.uilib-slider');
                var $preLabel = this.actual.find('.uilib-slider-preLabel');
                var $postLabel = this.actual.find('.uilib-slider-postLabel');
                var $pin = this.actual.find('.uilib-slider-pin');
                var $toolTip = $pin.find('.uilib-slider-tooltip');
                var pinWidth = $pin.css('width') === '19px';
                return $element && $preLabel.length && $postLabel.length && $pin.length && pinWidth;
            }
        });
    });
    beforeEach(function(){
        element = $('<div wix-model="numOfItems" wix-ctrl="Slider" wix-options="{ preLabel:\'0\', postLabel:\'100\'}" class="slider""></div>').appendTo('body')[0];
    });

    afterEach(function(){
        Wix.UI.destroyPlugin(element);
    });

    it('should apply wix markup to given wix-ctrl', function(){
        Wix.UI.initializePlugin(element);
        var $slider = $(".uilib-slider");
        expect($slider).toBeWixed();
    });

    describe('Default Options', function () {
        beforeEach(function(){
            Wix.UI.initializePlugin(element);
        });

        it('should not show the tooltip by default', function(){
            var $toolTip = $(element).find('.uilib-slider-tooltip');
            expect($toolTip.length).toBe(0);
        });
    });


    it('should show a tooltip with the current value when toolTip is set to true', function(){
        $(element).attr('wix-options', '{toolTip:true}');
        Wix.UI.initializePlugin(element);
        var $tooltip = $(".uilib-slider-tooltip");

        expect($tooltip.length).toBe(1);

        Wix.UI.set('numOfItems', 20);
        expect($tooltip.find("div.uilib-text").text()).toEqual('20');
    });
});
