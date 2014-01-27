# UI Library 2.0 - Starter Kit for Wix 3rd Party Apps

## About
This project is aimed at helping developers in the process of getting new apps to <a href="http://dev.wix.com" target="_blank">Wix Dev Center</a> as quickly as possible. The UI in this project focuses on the App's Settings Panel. The boilerplate offers UI standards and common Javascript components to assist the developer in passing Product tests, and in developing a consistent and uniformed UI for the app.

##### Click here for <a href="http://wix.github.com/wix-ui-lib" target="_blank">demo</a> and documentation.

## Overview
Wix UI Library is a extension of the Wix SDK. It provides common CSS, HTML and JS Components which follow Wix product guide for Apps. Wix UI library will deploy itself as a sub namespace of the Wix SDK as Wix.UI.

### Dependencies

Wix UI lib dependencies are jQuery from version 1.9.0 and Wix SDK from version 1.23.0

### Usage

To get started, include the minified JS and CSS files in your App Settings HTML. Also add the `wix-ui` attribute on the body element, this will hide the document until **Wix.UI.initialize** will be called.
```html
<!doctype html>
<html>
    <head>
        <link rel="stylesheet" href="./ui-lib.min.css"></link>
    </head>
    <body wix-ui>
        <!-- your settings -->
        <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>
        <script src="http://sslstatic.wix.com/services/js-sdk/1.24.0/js/Wix.js"></script>
        <script src="ui-lib.min.js"></script>
    </body>
</html>
```

### App Intro

First, make an introduction. *This is compulsory according to Wix Apps product style guide.*

This following markup is for the app intro, description and login panel. 
It will be automatically styled by the UI library.
The login panel is used for connecting your user to his account in your app.

###### HTML
```html
<header class="box">
    <div class="logo">
    	<img width="86" src="images/wix_icon.png" alt="logo"/>
	</div>
	<div class="loggedOut">
		<p><!-- App Description --></p>
		<div class="login-panel"><!-- App login panel --></div>
	</div>
	<div class="loggedIn hidden">
        <!-- App Logged in information -->
		<div class="premium-panel"><!-- Premium features --></div>
	</div>
</header>
```
You can simply change the img source to your logo

###### HTML
```html
<div class="logo">
	<img width="86" src="images/wix_icon.png" alt="logo"/>
</div>
```	

### Authentication

Once your app is running, an **authenticated user mode** should come in handy. 
use the `.loggedOut`, `.loggedIn` areas to put the authentication logic there. Switch the `.hidden` class between the two to accompany each of these state in the app, respectively.

Guests will see **Description**, a **Connect Button**, and a **Text Link** for creating a new account. 

###### Logged out User
```html
<div class="loggedOut">
	<p><!-- App Description --></p>
	<div class="login-panel">
    	<p class="create-account">Don't have an<br/>account? <a href="#"><strong>Create one</strong></a></p>
    	<button class="submit btn connect">Connect account</button>
	</div>
</div>
```
Authenticated users will see the details of their **Session Details** (User name, e-mail etc) and a **Link** for disconnecting the session.

Premium panel is used when a user is logged in to your app and you want to offer premium features.

###### Logged in User	
```html
<div class="loggedIn hidden">
	<p>
        You are now connected to 
        <strong>John Doe (john@doe.com)</strong>account
        <br/>
        <a class="disconnect-account">Disconnect account</a>
    </p>
	<div class="premium-panel">
    	<p class="premium-features">Premium features</p>
    	<button class="submit btn upgrade">Upgrade</button>
	</div>
  </div>
```
If this is irrelevant to your project, simply remove this markup.

## CSS Styling

#### Box (Container)
Box is the basic container for Wix 3rd Party Settings panel. Boxes are for grouped controls or information blocks. Use them as you like.
```html
<div class="box">
	<!-- Box content goes here -->
</div>
```
#### List

To group different controls in vertical view, you can use the `.list` class and structure.
This is a simple list with the proper CSS styling to contain all the HTML and JS components offered in the **Wix.UI** and present them in a neat horizontal row.

**wix-label** attribute sets the label before the list item content.
```html
<ul class="list">
    <li wix-label="Text Color:"></li>
    <li wix-label="Background Color:"></li>
</ul>
```
## Javascript Components

The **Wix.UI** Javascript components are basically a set of [jQuery][jquery] Plugins.

[jquery]: http://jquery.com/

### Special HTML attributes
Wix UI library includes custom attributes which enable components initialization from within the HTML markup.

**wix-ctrl -** component's controller declaration

**wix-options -** component initialization

**wix-param -** sets the key of the style parameter.

**wix-model -** sets a key to access the component value from Wix.UI and subscribe to change events.


`Warning: wix-pram & wix-model can not co-exist on the same controller. Only one of them should be used`


All attributes can be prefixed with **data-** to be W3C compliant (Optional). 

###Initialization

There are 2 ways to initialize the components 

* initialize with markup (prefered)
* initialize with javascript (advance)


#### Initialize with markup


Each component can be initialized with a simple markup and two important attributes
`wix-ctrl` and `wix-options`

**wix-ctrl - ** Sets the component`s controller that will be connected to the element.

**wix-options - ** Sets the component`s controller options.

**wix-ctrl:{options} - ** Sets the component`s controller and options.

In this way all the Javascript component are managed by the **Wix.UI** library. To initialize the components you need to call **Wix.UI.initialize()** then all the components that has `wix-ctrl` attribute will be initialized with the options that you entered to the `wix-option` attribute and the settings window will be visible.
```html
<div wix-ctrl="ComponentName" wix-options="{Options}"></div>
```
All the **Wix.UI** components should be initialized after the DOM is ready.
```javascript 
$( document ).ready(function(){
    
    Wix.UI.initialize({});
    
});
```
#### Initialize with javascript (advance)

In this way you need to subscribe to changes and set values directly on the jQuery plugin.
```javascript    
//create plugin on existing element
$('#myElement').PluginName(options);

//init Wix.UI bindings on an Wix ready element
var $el = $('<div wix-ctrl="ColorPicker" wix-model="myColor" wix-options="{startWithColor:\'#ffffff\'}">');
Wix.UI.initializePlugin($el);

//init Wix.UI bindings on an Wix ready element and override the options
Wix.UI.initializePlugin($('<div wix-ctrl="ColorPicker" wix-model="myColor">'), {
    startWithColor:'#ffffff'
});

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

//get the plugin instance from jQuery element
var pluginInstance = jQueryElement.getCtrl();
var pluginInstance = $('#myElement').getCtrl();
```

#### Destroy component (advance)
when you need to remove a component form the page to avoid memeory leaks use **Wix.UI.destroyPlugin**
```javascript        
//destroy the component and remove all listeners
Wix.UI.destroy($('#myElement'));

//destroy the component, remove all listeners and delete the model key
Wix.UI.destroy($('#myElement'), true);
```
###Model

In order to set/get component values, you can add a `wix-model` attribute to the component markup this will bind them to the **Wix.UI** model.

**wix-model** attribute sets a key to access the component value from Wix.UI and subscribe to change events.

Then you will be able to use the **Wix.UI.set(key, value)** or **Wix.UI.get(key)** to update the component state and retrieve the component value.
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

###Style Parameters

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

**wix-param** attribute sets the key of the style parameter.
```html
<div wix-param="myParam" wix-ctrl="ColorPickerWithOpacity"></div>
```
wix-param can also be consumed inside the App's Widget/Page. You can use **Wix SDK** to get all the style parameters that were set in the App's Settings.
```javascript
Wix.getStyleParams(function(styleParams){
    // styleParams is a map with all style values {colors:{}, numbers:{}, booleans:{}}
}); 
```
###Style paramerters in a CSS stylesheet

You can use the color style parameters inside a **inline CSS style** within your widget, It's a simple template engine that uses {{value}} to interpolate the style parameters. fallback values are separated with spaces {{value fallback}}. In order to activate it put `wix-style` attribute on an inline style.
```html
<style wix-style>

    #myElement {
        background-color: {{style.myParam}}; /* style parameter */
        color: {{color-1}}; /* style from the template */
    }
    
    #myElement2 {
        background-color: {{style.myParam color-1}}; /* style parameter with fallback value*/
    }
    
    @media(wix-device-type:mobile){ /* wix media query for device type */
        #myElement {
            border: 1px solid {{color-1}};
        }
    }        
    
</style>
```    
Color style parameters can use reserved theme colors in the stylesheet using the following references:

* white/black - primary white, black if the site theme is inverted
* black/white - primary black, white if the site theme is inverted
* primary-1 - defined by the template
* primary-2 - defined by the template
* primary-3 - defined by the template
* color-1 to color-25 - palette colors


### Wix.UI Components

- Accordion
- ButtonGroup
- Checkbox
- ColorPicker
- ColorPickerWithOpacity
- Dropdown
- RadioButton
- Slider
- Fixed Positioning Control

---
### Accordion

#### Accordion Options
```javascript
{
    animationTime : 150,
    ease : 'linear',
	openByDeafult:'acc-open',
	value : 0,
	toggleOpen: false
}
```    
#### Markup
```html
<div wix-ctrl="Accordion" wix-options="{toggleOpen:false}">
    <div class="acc-pane">
        <h3><!-- Title --></h3>
        <div class="acc-content">
        	<!-- content goes here -->
        </div>
    </div>
</div>
```    
---

### ColorPicker

#### ColorPicker Options
```javascript
{
    startWithColor : "#897185"
}
```
#### Markup
```html
<div wix-ctrl="ColorPicker" wix-options="{startWithColor:'black/white'}"></div>
```    
##### Color picker with stlye parameter
```html
<div wix-param="myColor" wix-ctrl="ColorPicker" wix-options="{startWithColor:'black/white'}"></div>
```

#### ColorPickerWithOpacity Options
```javascript
{
    startWithColor : "#000",
	startWithOpacity : 1
}
```
    
##### ColorPickerWithOpacity
```html
<div wix-ctrl="ColorPickerWithOpacity"></div>
```    
##### Color picker with opacity with stlye parameter
```html
<div wix-param="myColor" wix-ctrl="ColorPickerWithOpacity"  wix-options="{startWithColor:'black/white'}"></div>
```
---

### Radio Button

#### Options
```javascript
{
	radioValueAttrName:'data-radio-value',
	inline:false,
	value:0
}
```
#### Markup
```html
<div wix-ctrl="Radio" wix-options="{value:0}">
	<div data-radio-value="value-1">Option 1</div>
	<div data-radio-value="value-2">Option 2</div>
	<div data-radio-value="value-3">Option 3</div>
</div>
```    
##### Advance Radio Button
```html
<div wix-ctrl="Radio">
	<div data-radio-value="value-1">
        <img src="layout1.png"/>
    </div>
	<div data-radio-value="value-2">
        <img src="layout2.png"/>
    </div>
	<div data-radio-value="value-3">
        <img src="layout3.png"/>
    </div>
</div>
```
---

### Checkbox

#### Options
```javascript
{
	preLabel: '',
	postLabel: '',
	value: false
}
```    
#### Markup
```html
<div wix-ctrl="Checkbox" wix-options="{value:false}"></div>
```
---

### Slider

#### Options
```javascript 
{
	minValue : 0,
	maxValue : 100,
	value : 0,
	width : 80,
	preLabel:'',
	postLabel:''
}
```    
#### Markup
```html
<div wix-ctrl="Slider" wix-options="{value:0}"></div>
```
---

### Dropdown

#### Options
```javascript
{
	slideTime : 150,
	value: 0,
	autoCloseTime : 5000,
	optionSelector:'[value]'
}
```
#### Markup
```html
<div wix-ctrl="Dropdown" wix-options="{value:0}">
	<div value="value-1">Option A</div>
	<div value="value-2">Option B</div>
	<div value="value-3">Option C</div>
</div>
```   
---   
   
### Button Group

#### Options
```javascript
{
	value: 0
}
```
#### Markup
```html
<div wix-ctrl="ButtonGroup" wix-options="{value:0}">
	<button value="value-1">Button 1</button>
	<button value="value-2">Button 2</button>
	<button value="value-3">Button 3</button>
</div>
```    
---

### Fixed Positioning Control

#### Options
```javascript
{
    bindToWidget: false,
    placements : []
}
```
#### Markup
```html
<div wix-ctrl="GluedControl" wix-options="{bindToWidget: true}"></div>
```
## License

Copyright (c) 2012 Wix.com, Inc

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
