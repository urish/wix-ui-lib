jQuery.fn.definePlugin('FontStylePicker', function () {
	'use strict';

	var names = {
		fontStylePickerClass: 'font-style-picker',
		presetSelectClass:'font-style-picker-preset-select',
		fontPickerClass: 'font-style-picker-font-picker',
		fontSizeClass: 'font-style-picker-font-size',
		textStyleClass: 'font-style-picker-text-style' 
	};
	
	return {
		init : function () {
			this.isParamMode = this.getParamKey();
			this.currentValue = null;
			this.popup = null;
			this.fontSizePicker = null;
			this.textStylePicker = null;
			this.fontPicker = null;
			this.presetSelectPicker = null;
			this.markup();
			this.bindEvents();
		},
		getDefaults : function () {
			return {
				value: undefined				
			};
		},
		markup : function () {
			this.$el.html('<div class="box-like-drop"><span class="box-like-drop-content">Test</span><span class="box-like-arrow box-like-arrow-down"></span></div>');
			this.$el.addClass(names.fontStylePickerClass);
			
			this.createPopup();
			this.createPresetPicker();
			this.createFontPicker();
			this.createTextStylePicker();
			this.createFontSizePicker();
			
			var html = '';
			html += '<div class="uilib-divider-row"><span class="font-picker-label">Style:</span><span class="style-place-holder"></span></div>';
			html += '<div class="uilib-divider-row"><span class="font-picker-label">Font:</span><span class="font-place-holder"></span></div>';
			html += '<div class="uilib-divider-row"><span class="font-picker-label"> </span><span class="props-place-holder"></span></div>';
			
			this.popup.content.innerHTML = html;
			
			$(this.popup.content).find('.style-place-holder').append(
				this.presetSelectPicker.$el.addClass(names.presetSelectClass)
			);
			
			$(this.popup.content).find('.font-place-holder').append(
				this.fontPicker.$el.addClass(names.fontPickerClass)
			);
			
			$(this.popup.content).find('.props-place-holder').append(
				this.fontSizePicker.$el.addClass(names.fontSizeClass),
				this.textStylePicker.$el.addClass(names.textStyleClass)
			);
			
			this.popup.open();			
		},
		createFontSizePicker: function(){
			this.fontSizePicker = this.UI().createPlugin({
				ctrl: 'Spinner',
				appendTo: this.$el,
			}).getPlugin();
		},
		createTextStylePicker: function(){
			var html = '';
			html += '<button value="bold" class="grad-1" style="font-family: serif;font-weight: bold;">B</button>';
			html += '<button value="italic" class="grad-1" style="font-family: serif;font-style: italic;">I</button>';
			html += '<button value="underline" class="grad-1" style="font-family: serif;text-decoration: underline;">U</button>';
			
			this.textStylePicker = this.UI().createPlugin({
				ctrl: 'ToggleButtonGroup',
				html: html,
				appendTo: this.$el,
			}).getPlugin();
		},
		createFontPicker: function(){
			this.fontPicker = this.UI().createPlugin({
				ctrl: 'FontPicker',
				appendTo: this.$el,
			}).getPlugin();
		},
		createPresetPicker: function(){
			var html = '';
			
			var presets = Wix.Styles.getSiteTextPresets();
			Object.keys(Wix.Styles.getSiteTextPresets()).sort().forEach(function(presetName){
				html += '<div value="'+presetName+'">'+presetName.replace(/-/g,' ')+'</div>';
			});
			html += '<div value="Custom">Custom</div>';
			
			/*html += '<div value="Title">Title</div>';
			html += '<div value="Menu">Menu</div>';
			html += '<div value="Page-title">Page Title</div>';
			html += '<div value="Heading-XL">Heading XL</div>';
			html += '<div value="Heading-L">Heading L</div>';
			html += '<div value="Heading-M">Heading M</div>';
			html += '<div value="Heading-S">Heading S</div>';
			html += '<div value="Body-L">Body L</div>';
			html += '<div value="Body-M">Body M</div>';
			html += '<div value="Body-S">Body S</div>';
			html += '<div value="Body-XS">Body XS</div>';
			html += '<div value="Custom">Custom</div>';*/
			
			this.presetSelectPicker = this.UI().createPlugin({
				ctrl: 'Dropdown',
				appendTo: this.$el,
				html: html,
				options:{
					width : 280,
					height : 180,
					value: 1,
					modifier: function($el){
						return $el;
					}
				}
			}).getPlugin();		
			
		},
		createPopup: function(){
			var that = this;
			this.popup = this.UI().createPlugin({
				ctrl: 'Popup',
				options: {
					appendTo: this.$el,
					title : 'Font Settings',
					content : '',
					footer : '<button class="btn gray x-close-popup">Cancel</button><button style="float:right" class="btn blue close-popup">OK</button>',
					modal : false,
					modalBackground : 'rgba(0,0,0,0.5)',
					height : 'auto',
					width : 302,
					onopen: function(){
						that.$el.append(this.arrow);
						that.currentValue = that.getValue();
					},
					onclose : function (evt) {
						that.updateText();
					},
					oncancel: function(evt) {
						that.setValue(that.currentValue);
						that.triggerChangeEvent(that.getValue());
					},
					onposition: function(){
						this.setBestPosition(that.$el.find('.box-like-drop')[0]);
					}
				}
			}).getPlugin();
		
		},
		hideArrow:function(){
			$(this.popup.arrow).hide();
		},
		showArrow: function(){
			$(this.popup.arrow).show();
		},
		bindEvents : function () {
			var that = this;
			this.$el.on('click', '.box-like-drop',function(evt){
				evt.stopPropagation();
				that.popup.open();
			});
			this.registerToChangeEventAndDelegate(this.fontSizePicker, this);
			this.registerToChangeEventAndDelegate(this.textStylePicker, this);
			this.registerToChangeEventAndDelegate(this.fontPicker, this);
			this.registerToChangeEventAndDelegate(this.presetSelectPicker, this);
			
			this.$el.on('uilib-dropdown-close', function(evt, plugin){
				if(plugin.isOpen && $(that.popup.arrow).hasClass('popup-arrow-top')){
					that.showArrow();
				}
			});
			this.$el.on('uilib-dropdown-open', function(evt, plugin){
				//if(!plugin.isOpen){	
					that.hideArrow();
				//}
			});
			
			this.whenDestroy(function(){
				this.fontSizePicker.destroy();
				this.textStylePicker.destroy();
				this.fontPicker.destroy();
				this.presetSelectPicker.destroy();
			});
		},
		handlePluginPresetSelectChange: function(plugin, evt){
			var presets = Wix.Styles.getSiteTextPresets();
			var presetName = this.presetSelectPicker.getValue().value;
			var preset = presets[presetName];
			if(!preset){return;}
			this.setValue({
				size: parseInt(preset.size, 10),
				family: preset.fontFamily,
				preset: presetName,
				style:  {
					bold : preset.weight === 'bold',
					italic : preset.style === 'italic',
					underline: false
				}
			});
		},
		checkPresetAgainstState: function(preset, currentState){
			if(currentState.style.underline){
				return false;
			}
			var weight = currentState.style.bold ? 'bold' : 'normal';
			if(weight !== preset.weight){
				return false;
			}
			var style = currentState.style.italic ? 'italic' : 'normal';
			if(style !== preset.style){
				return false;
			}
			if(currentState.family !== preset.fontFamily){
				return false;
			}
			if(currentState.size !== parseInt(preset.size, 10)){
				return false;
			}
			return true;
		},
		getSimilarPresetName: function(){
			var presets = Wix.Styles.getSiteTextPresets();
			var currentState = this.getValue();
			for(var presetName in presets){
				if(presets.hasOwnProperty(presetName)){
					if(this.checkPresetAgainstState(presets[presetName], currentState)){
						return presetName;
					}
				}
			}
			return null;
		},
		handleNonPluginPresetSelectChange: function(plugin, evt){
			var presetName = this.getSimilarPresetName();
			if(presetName){
				this.presetSelectPicker.setValue(presetName);
			} else {
				this.presetSelectPicker.setValue('Custom');
			}
			this.updateText();
		},
		innerChangeHandler: function(plugin, evt){
			if(plugin.$el.hasClass(names.presetSelectClass)){
				this.handlePluginPresetSelectChange(plugin, evt);
			} else {
				this.handleNonPluginPresetSelectChange(plugin, evt);
			}			
			this.triggerChangeEvent(this.getValue());
		},
		registerToChangeEventAndDelegate: function(plugin, ctx){
			plugin.$el.on(plugin.pluginName + '.change', function(evt){
				evt.stopPropagation();
				ctx.innerChangeHandler(plugin, evt);
			});
		},
		updateText: function(){
			var text = this.presetSelectPicker.getValue().value;
			this.$el.find('.box-like-drop-content').text(text);
		},
		getValue : function () {
			var val = {
				size:   this.fontSizePicker.getValue(),
				style:  this.textStylePicker.getValue(),
				family: this.fontPicker.getValue().value,
				preset: this.presetSelectPicker.getValue().value
			};
			if(this.getParamKey()){
				val.fontStyleParam = true;
			}
			return val;
		},
		setValue : function (value) {
			this.fontSizePicker.setValue(value.size);
			this.textStylePicker.setValue(value.style);
			this.fontPicker.setValue(value.family);
			this.presetSelectPicker.setValue(value.preset);
			this.updateText();
		}
	};

});
