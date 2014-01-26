# Dropdown

Dropdown component, expandable selection list with support for max height/scrollabr.

### Example

### Markup
```html
<div wix-ctrl="Dropdown">
	<div value="show">Show Images</div>
		<div value="hide">Hide Images</div>
	<div value="showhover">Show Images on Hover</div>
</div>
```

### Options

* slideTime; 150; animation slide time in ms
* value; 0; selected entry value attribute in the dropdown
* width; 'auto'; width of the dropdown (folded)
* optionsWidth; 'auto'; overrides the width option for the expanded dropdown list
* height; 'auto'; expanded options list total height ==> enables scrollbar for longer (than the height) list of entries

