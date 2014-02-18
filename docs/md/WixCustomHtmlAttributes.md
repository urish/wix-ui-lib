## Wix custom HTML attributes
<!-- WixCustomHTMLAttributes -->

The Wix UI Lib defines custom attributes which enable components initialization from within the HTML markup.

**wix-ctrl -** component's controller declaration.

**wix-options -** component initialization options.

**wix-ctrl:{options} - ** Alternative for combining the two attributes in one.

**wix-param -** define style parameter key for a component - will be saved inside the site and not accessable for the app.

**wix-model -** define app model key for a component - this is a two way data item that it's value is accessable by the app through the Wix.UI.get/set methods. Changes to this item can tracked by subscribing to change events Wix.UI.onChange method.

`Warning: wix-pram & wix-model are mutually exclusive and can not co-exist on the same controller. Only one of them should be used.`

All attributes can be prefixed with **data-** to be W3C compliant (Optional).

###Initialization

There are 2 ways to initialize the components:

* initialize with markup (prefered)
* initialize with javascript (advance)


#### Initialize with markup

Each component can be initialized with a simple markup and two important attributes
`wix-ctrl` and `wix-options`:
```html
<div wix-model="myKey" wix-ctrl="ComponentName" wix-options="{Options}"></div>
```

The **Wix.UI** library manages all components that were decalred through markup or created dynamically.  **Wix.UI.initialize()** must be called on DOM ready to start the compoenets creations process and to display the document body. The compoenets will get created with the options that were specified inside the markup using the `wix-option` attribute.

All the **Wix.UI** components should be initialized after the DOM is ready.
```javascript
$( document ).ready(function(){

    Wix.UI.initialize({});

});
```

###Model

In order to set/get component values, you should add a `wix-model` attribute to the component markup this will bind them to the **Wix.UI** model. This will allow using the **Wix.UI.set(key, value)** or **Wix.UI.get(key)** methods to update the component value and retrieve the component value.

```html
<div wix-model="myKey" wix-ctrl="ComponentName" wix-options="{option: 'value'}"></div>
```

Components that has `wix-model` attribute can be initialized with default values or values that retrieved from your server.
```html
...
<div wix-model="showTweets" wix-ctrl="Checkbox"></div>

<script>
    $( document ).ready(function(){

      Wix.UI.initialize({
          showTweets: true
      });

      Wix.UI.get('showTweets'); //returns true

      Wix.UI.set('showTweets', false);

      Wix.UI.get('showTweets'); //returns false

      Wix.UI.set('showTweets', false, true); //sets the value and not fire change event

    });
</script>
...
```
####Subscribe to model change events

You can subscribe to changes in the wix-model with the following code:
```javascript
//subscribe to one key change
Wix.UI.onChange('myKey', function(value, key){
    //do some awesome stuff with the value
});

//subscribe to changes in all keys
Wix.UI.onChange('*', function(value, key){
    //do some awesome stuff with the value
});
```
#### Save Wix.UI Model

When you want to save the state of your components you can simply call the toJSON function on the **Wix.UI** to get it's current state. This saved json representation can be later used to (re)initialize the **Wix.UI**. E.g. you can save it in your database and read on next invocations of the App Settings.
```javascript
var componentsValues = Wix.UI.toJSON();
```
######jQuery Example
```javascript
var widgetId = Wix.Utils.getInstanceId() + '--' + Wix.Utils.getCompId();

function saveSettings(){
    $.post('save.php?id=' + widgetId, Wix.UI.toJSON());
}

function loadSettings(){
    $.get('load.php?id=' + widgetId, function(data){
        Wix.UI.initialize(data);
    });
}

Wix.UI.onChange('*', function(){
    saveSettings();
});

$( document ).ready(function(){
    loadSettings();
});
```

### Wix Style Parameters

Wix Style parameters, which replace the wix-model parameters, allow an app developer to save specific keys inside the Wix Site. Meaning, they do not need to be saved in the App's database like  wix-model parameters. **Wix.UI** takes care of saving it inside the site using the Wix SDK.

You can use the `wix-param` attribute on supported components. Currently Wix supports the following Components for wix-param:

#### Color Parameters Components
- ColorPicker
- ColorPickerWithOpacity

#### Number Parameters Components
- ButtonGroup
- RadioButton
- Dropdown
- Slider

#### Boolean Parameters Components
- Checkbox

#### Font Parameters Components
- FontPicker
- FontStylePicker

**wix-param** attribute sets the key of the style parameter.

Color Picker component:

```html
<div wix-param="myParam" wix-ctrl="ColorPickerWithOpacity"></div>
```

Font Picker component:

```html
<div wix-param="myFont" wix-ctrl="FontStylePicker"></div>
```

wix-param can also be consumed inside the App's Widget/Page. You can use **Wix SDK** to get all the style parameters that were set in the App's Settings.
```javascript
Wix.getStyleParams(function(styleParams){
    // styleParams is a map with all style values {colors:{}, numbers:{}, booleans:{}, fonts:{}}
});
```
###Style paramerters in a CSS stylesheet

You can use the color and font style parameters inside a **inline CSS style** within your widget/page, It's a simple template engine that uses {{value}} to interpolate the style parameters. fallback values are separated with spaces {{value fallback}}. In order to activate it put `wix-style` attribute on an inline style.
```html
<style wix-style>
    body {
        background-color: {{style.myParam color-1}}; /* style parameter */
    }
    h1 {
        {{Title}} /* font from the template */
    }
    footer {
        {{style.myFont Body-S}}
        background-color: {{style.myParam}}; /* style parameter */
        color: {{color-1}}; /* style from the template */
    }
    @media(wix-device-type:mobile){ /* wix media query for device type */
        #myElement {
            border: 1px solid {{color-1}}; /* style from the template */
        }
    }
</style>
<body>
    <h1>Wix Title</h1>
    <footer>
        <h2>Footer</h2>
    </footer>
</body>
```

Color style parameters can use reserved theme colors in the stylesheet using the following references:

* white/black - primary white, black if the site theme is inverted
* black/white - primary black, white if the site theme is inverted
* primary-1 - defined by the template
* primary-2 - defined by the template
* primary-3 - defined by the template
* color-1 to color-25 - palette colors

Font style parameters can use reserved fonts and sizes in the stylesheet using the following references:

* Title
* Menu
* Page-title
* Heading-XL
* Heading-L
* Heading-M
* Heading-S
* Body-L
* Body-M
* Body-S
* Body-XS


###Adavnce Usage
#### Initialize with javascript

In this way you need to subscribe to changes and set values directly on the jQuery plugin.
```javascript
//create plugin on existing element
$('#myElement').PluginName(options);

//init Wix.UI bindings on an Wix ready element
var $el = $('<div wix-ctrl="ColorPicker" wix-model="myColor"
    wix-options="{startWithColor:\'#ffffff\'}">');

Wix.UI.initializePlugin($el);

//init Wix.UI bindings on an Wix ready element and override the options
Wix.UI.initializePlugin($('<div wix-ctrl="ColorPicker" wix-model="myColor">'), {
    startWithColor:'#ffffff'
});
```

### Dynamic creation of javascript components

```javascript
//create plugin and element that are conected to wix param or model
var jQueryElement = Wix.UI.create({
    id:'myElement', //DOM element id
    ctrl: 'ColorPicker', //wix-ctrl
    param: 'myColor', //wix-param
    model: false, //wix-model
    html: '', //initial innerHTML for the element
    appendTo: 'body', //appendTo selector
    options: { //wix-options
        startWithColor: '#ffffff'
    }
});
```

### Get component controller instance dynamically
```javascript
//get the plugin instance from jQuery element
var pluginInstance = jQueryElement.getCtrl();
var pluginInstance = $('#myElement').getCtrl();
```

#### Dynamic component destruction

when you need to remove a component form the page to avoid memeory leaks use **Wix.UI.destroyPlugin**
```javascript
//destroy the component and remove all listeners
Wix.UI.destroy($('#myElement'));

//destroy the component, remove all listeners and delete the model key
Wix.UI.destroy($('#myElement'), true);
```

