# Popup

Popup component,

### Example

### Markup
```javascript
  Wix.UI.createPlugin({ctrl: 'Popup', options: {});
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