# Scrollbar

Scrollbar, mimic native html scrollbars with Wix style and behaviour across all supported browsers

### Example

### Markup
```html
    <div  wix-scroll="{height:300}">
    </div>

    <div  wix-ctrl="Scrollbar" wix=options=="{height:300}">
    </div>
```

### Options

* width; 'auto';
* height; '250px'; height in pixels of the visible scroll area
* color; '#a4d9fc'; scroll bar color
* opacity; 1; scroll bar opacity
* hoverColor: '#35aeff'; bar hover color, accepts any hex/color value
* hoverOpacity; 0; bar hover opacity
* position; 'right'; scrollbar position - left/right
* railVisible; true; whether to show the scroll rail
* railColor; '#333'; scroll rail color
* railOpacity; 0; scroll rail opacity