# Tooltip

Tooltip component, enables content annotation on hover

### Example

### Markup
```html
<span wix-tooltip=" {placement:'top', text:'I am Hovered'}">Hover me</span>

<div wix-ctrl="Tooltip" wix-options="{placement:'right', text:'click me'}">
	<button class="uilib-btn connect">I have a tooltip!!!</button>
</div>
```

### Options

* placement; 'top'; tooltip placement - 'top', 'right', 'left', 'bottom'
* text; ""; tooltip content
* animation; true; show tooltip with/out animation