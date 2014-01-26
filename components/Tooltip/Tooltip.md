# Tooltip

Tooltip component, enables content annotation on hover

### Example

### Markup
```html
   <div wix-tooltip=" {placement:'top', text:'Pick Language'}">Hover me</div>

   <div  wix-ctrl="Tooltip" wix=options=="{placement:'right', text:'click me'}">
        <button class="submit uilib-btn connect">I have a tooltip!!!</button>
   </div>
```

### Options

* placement; 'top'; tooltip placement - 'top', 'right', 'left', 'bottom'
* text; ""; tooltip content
* animation; true; show tooltip with/out animation