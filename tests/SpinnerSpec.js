describe('Spinner', function () {
    'use strict';

    var element;
    beforeEach(function () {
        this.addMatchers({
            toBeWixed: function() {
                var $input = this.actual.find('input');
                var $upArrow = this.actual.find('.up-arrow');
                var $downArrow = this.actual.find('.down-arrow');
                return $input.length && $upArrow.length && $downArrow.length;
            }
        });
    });

    beforeEach(function(){
        element = $('<div wix-model="numOfItems" wix-ctrl="Spinner" class="spinner"></div>').appendTo('body')[0];
    });

    afterEach(function(){
        $(element).remove();
    });

    it('should apply wix markup to given wix-ctrl', function(){
        Wix.UI.initializePlugin(element);
        var $spinner = $(".uilib-spinner");
        expect($spinner).toBeWixed();
    });

    it('should trigger change event and change plugin value on mousedown', function(){
        Wix.UI.initializePlugin(element);
        var $up = $(element).find('.up-arrow');
        $up.mousedown();
        expect(Wix.UI.get('numOfItems')).toBe(1);

        var $down = $(element).find('.down-arrow');
        $down.mousedown();
        expect(Wix.UI.get('numOfItems')).toBe(0);
    });
});
