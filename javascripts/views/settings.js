$(document).ready(function() {
    $('.accordion').Accordion();
    $('.color-selector').ColorPicker();
    $('.slider').Slider({ type: "Value" });
    $('.checkbox').Checkbox({ checked: true });
    $('.radiobuttons').Radio({ checked: 0 });
    $('.layouts').Radio({el: "figure figcaption", checked: 1});
    $('.example1-color-picker').ColorPicker();
    $('.example1 .radiobuttons').Radio({ checked: 0 });
	$('.glued-positioning').GluedPosition({initWithBinding: true});
//	$('.glued-positioning').GluedPosition({initWithBinding: true, placements: ['TOP_LEFT', 'TOP', 'BOTTOM']});
//	$('.glued-positioning').GluedPosition({
//        dropDownChange: console.log.bind(console, 'drop'),
//        dropDownCreate: console.log.bind(console, 'dropc'),
//        sliderChange: console.log.bind(console, 'slide'),
//        sliderCreate: console.log.bind(console, 'slidec')
//    });
});