# Spinner

Spinner component, enables selection from linear range of numeric values one step at a time. The Spinner allows to set the selected range and the increment/decrement step.

### Example

### Markup
```html
<div wix-model="myInt" wix-ctrl="Spinner" wix-options="{ maxValue:500 }"></div>
```

### Options

* minValue; 0; minimum value on the spinner
* maxValue; 1000; maximum value on the spinner
* value; 0; current value
* step; 1; step size both for increment & decrement
* precision; 0;