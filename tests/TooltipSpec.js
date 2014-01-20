describe('Tooltip', function () {
	'use strict';

	var element;
	beforeEach(function(){
		element = $('<div style="margin:100px auto; width:200px; border:1px solid red" wix-tooltip="Some text to show on <strong>mouse</strong> hover">Help</div>').appendTo('body')[0];
	});

	afterEach(function(){
		Wix.UI.destroyPlugin(element);
	});

	describe('Default Options', function () {
		it('should place the tool tip on top of the element', function(){
			var $tooltip = givenToolTip();
			expect($tooltip.offset().top).toEqual($(element).offset().top - ($tooltip.outerHeight() + 12));
			expect($tooltip.offset().left).toEqual($(element).offset().left + ($(element).outerWidth() - $tooltip.outerWidth()) / 2);
		});

		it('should support text only', function(){
			var $tooltip = givenToolTip();
			expect($(element).next().find(".uilib-text").html()).toEqual('Some text to show on &lt;strong&gt;mouse&lt;/strong&gt; hover');
		});

	});

	it('should place the tooltip in the middle of the element for very long title', function(){
		element = $('<div style="margin:100px auto; width:50px; border:1px solid red" wix-tooltip="Tooltip" wix-title="Some text to show on mouse hover some very long text about this feature could also look nice as a tool tip">Help</div>').appendTo('body')[0];
		var $tooltip = givenToolTip();
		expect($tooltip.offset().left + $tooltip.outerWidth() / 2).toEqual($tooltip.offset().left + $tooltip.outerWidth() / 2);
	});

	it('should place the tooltip in the middle of the element for very shot title', function(){
		element = $('<div style="margin:100px auto; width:200px; border:1px solid red" wix-tooltip="Tooltip" wix-title="tip">Help</div>').appendTo('body')[0];
		var $tooltip = givenToolTip();
		expect($tooltip.offset().left + $tooltip.outerWidth() / 2).toEqual($tooltip.offset().left + $tooltip.outerWidth() / 2);
	});

	it('should show a tooltip on mouse enter', function(){
		givenToolTip();
		expect($(element).next().hasClass("uilib-tooltip")).toBeTruthy();
	});

	it('should hide a tooltip on mouse leave', function(){
		givenToolTip();
		var event = givenMouseLeaveEvent();
		$(element).trigger(event);

		waitsFor(function(){
			return $('.uilib-tooltip').size() == 0;
		}, "The element won't ever be hidden", 500);

		runs(function(){
			expect($(".uilib-tooltip").size()).toEqual(0);
		});
	});

	it('should hide a tooltip immediately on mouse leave when animation is set to off', function(){
		givenToolTip({animation: false});
		var event = givenMouseLeaveEvent();
		$(element).trigger(event);

		expect($(".uilib-tooltip").size()).toEqual(0);
	});

	it('should set the tool tip text as html when option is set to true', function(){
		givenToolTip({html:true});
		expect($(element).next().find(".uilib-text").html()).toEqual('Some text to show on <strong>mouse</strong> hover');
	});


	it('should fall back to position top if invalid position is giving',function(){
		var $tooltip = givenToolTip({placement:'blabla'});
		expect($tooltip.offset().top).toEqual($(element).offset().top - ($tooltip.outerHeight() + 12));
	});

	function givenMouseEnterEvent() {
		var event = jQuery.Event("mouseenter");
		return event;
	}

	function givenMouseLeaveEvent() {
		var event = jQuery.Event("mouseleave");
		return event;
	}

	function givenToolTip(options){
		options = options || {};
		_.extend(options, {title:'Some text to show'});
		$(".uilib-tooltip").remove();
		$(element).attr('wix-options', JSON.stringify(options));
		Wix.UI.initializePlugin(element);
		var event = givenMouseEnterEvent();
		$(element).trigger(event);
		return $(".uilib-tooltip");
	}
});
