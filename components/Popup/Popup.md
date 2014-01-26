# Popup

Popup component,

### Example

### Markup
```html
<button class="uilib-btn btn-secondary" id="popupAnchorBtn">Open Popup</button>
<button class="uilib-btn btn-secondary" id="modalAnchorBtn">Open Modal</button>
<script>

	var popup = Wix.UI.createPlugin({ctrl: 'Popup', options: {buttonSet: 'okCancel', fixed:true}});
	
	var modal = Wix.UI.createPlugin({ctrl: 'Popup', options: {modal:true, buttonSet: 'okCancel', fixed:true}});
	
	$('#popupAnchorBtn').on('click', function(evt){
		evt.stopPropagation();
		popup.getPlugin().open();
	});
	
	$('#modalAnchorBtn').on('click', function(evt){
		evt.stopPropagation();
		modal.getPlugin().open();
	});
	
</script>
```

### Options

* appendTo; 'body'; HTML element to append the popup to
* title; 'Popup'; popup text title
* content; ''; inner content
* footer; ''; footer content
* modal; false; modal indication
* modalBackground; 'rgba(0,0,0,0.5)';
* height; 'auto'; popup height in pixels
* width; 300; popup width in pixels
* onclose; function () {}; on close callback function
* oncancel; function() {}; on cancel callback function
* onopen; function() {}; on open callback function
* onposition; function(){}; on position callback function