describe('Input', function () {
	'use strict';

	var element;
	beforeEach(function(){
		element = $('<div id="input" wix-ctrl="Input" wix-model="numOfItems"></div>').appendTo('body')[0];
	});

	afterEach(function(){
		Wix.UI.destroyPlugin(element);
	});

	describe('Default Options', function () {
		it('should pass validation', function(){
			givenInput();
			Wix.UI.set('numOfItems', 20);
			expect($('.uilib-input').val()).toEqual('20');
		});
	});

	it('should not pass validation when needed', function(){
		var $ctrl = givenInput({validate: true});
		Wix.UI.set('numOfItems', 20);
		expect($('.uilib-input').val()).toEqual('20');
		$ctrl.setValidationFunction(function(){
			return false;
		});
		$('.uilib-input').val('100').keyup();
		expect($('.uilib-input').hasClass('invalid-input')).toBeTruthy();
	});

	function givenInput(options){
		options = options || {};
		_.extend(options, {title:'Some text to show'});
		$(element).attr('wix-options', JSON.stringify(options));
		Wix.UI.initializePlugin(element);
		return $(element).getPlugin();
	}
});
