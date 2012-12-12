/**
 * Created with IntelliJ IDEA.
 * User: mayah
 * Date: 12/12/12
 * Time: 2:52 PM
 * To change this template use File | Settings | File Templates.
 */

function Checkbox (el, deafult) {
    var checkbox = el;
    checkbox.addClass('tpa-checkbox');
    checkbox.addClass(deafult);

    checkbox.on('click', function (e) {
        el.toggleClass('checked');
        el.toggleClass('unchecked');
    });
}

function RadioButton (el, deafult) {
    var radioButton = el;
    radioButton.addClass('tpa-radio-button');
    radioButton.addClass(deafult);

    radioButton.on('click', function (e) {
        el.toggleClass('checked');
        el.toggleClass('unchecked');
    });
}