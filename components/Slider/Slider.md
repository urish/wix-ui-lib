# Slider

Slider component, enables selection from linear range of numeric values through a draggable knob

### Example

### Markup
```html
    <div  wix-ctrl="Slider" wix=options=="{{ maxValue:500, preLabel:'zero', postLabel:'five hundreds'}">
    </div>
```

### Options

* minValue; 0; minimum value on the slider
* maxValue; 100; maximum value on the slider
* value; 0; current value
* width; 80; component's width
* preLabel; ''; a label to the right of the slider
* postLabel; ''; a label to the left of the slider
* tooltip; false; whether to show a tooltip for the current value