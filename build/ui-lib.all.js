/* ===========================================================
 * bootstrap-tooltip.js v2.2.2
 * http://twitter.github.com/bootstrap/javascript.html#tooltips
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* TOOLTIP PUBLIC CLASS DEFINITION
  * =============================== */

  var Tooltip = function (element, options) {
    this.init('tooltip', element, options)
  }

  Tooltip.prototype = {

    constructor: Tooltip

  , init: function (type, element, options) {
      var eventIn
        , eventOut

      this.type = type
      this.$element = $(element)
      this.options = this.getOptions(options)
      this.enabled = true

      if (this.options.trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (this.options.trigger != 'manual') {
        eventIn = this.options.trigger == 'hover' ? 'mouseenter' : 'focus'
        eventOut = this.options.trigger == 'hover' ? 'mouseleave' : 'blur'
        this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }

      this.options.selector ?
        (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
        this.fixTitle()
    }

  , getOptions: function (options) {
      options = $.extend({}, $.fn[this.type].defaults, options, this.$element.data())

      if (options.delay && typeof options.delay == 'number') {
        options.delay = {
          show: options.delay
        , hide: options.delay
        }
      }

      return options
    }

  , enter: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (!self.options.delay || !self.options.delay.show) return self.show()

      clearTimeout(this.timeout)
      self.hoverState = 'in'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'in') self.show()
      }, self.options.delay.show)
    }

  , leave: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (this.timeout) clearTimeout(this.timeout)
      if (!self.options.delay || !self.options.delay.hide) return self.hide()

      self.hoverState = 'out'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'out') self.hide()
      }, self.options.delay.hide)
    }

  , show: function () {
      var $tip
        , inside
        , pos
        , actualWidth
        , actualHeight
        , placement
        , tp

      if (this.hasContent() && this.enabled) {
        $tip = this.tip()
        this.setContent()

        if (this.options.animation) {
          $tip.addClass('fade')
        }

        placement = typeof this.options.placement == 'function' ?
          this.options.placement.call(this, $tip[0], this.$element[0]) :
          this.options.placement

        inside = /in/.test(placement)

        $tip
          .detach()
          .css({ top: 0, left: 0, display: 'block' })
          .insertAfter(this.$element)

        pos = this.getPosition(inside)

        actualWidth = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight

        switch (inside ? placement.split(' ')[1] : placement) {
          case 'bottom':
            tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'top':
            tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'left':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth}
            break
          case 'right':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width}
            break
        }

        $tip
          .offset(tp)
          .addClass(placement)
          .addClass('in')
      }
    }

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()

      $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
      $tip.removeClass('fade in top bottom left right')
    }

  , hide: function () {
      var that = this
        , $tip = this.tip()

      $tip.removeClass('in')

      function removeWithAnimation() {
        var timeout = setTimeout(function () {
          $tip.off($.support.transition.end).detach()
        }, 500)

        $tip.one($.support.transition.end, function () {
          clearTimeout(timeout)
          $tip.detach()
        })
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        removeWithAnimation() :
        $tip.detach()

      return this
    }

  , fixTitle: function () {
      var $e = this.$element
      if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
        $e.attr('data-original-title', $e.attr('title') || '').removeAttr('title')
      }
    }

  , hasContent: function () {
      return this.getTitle()
    }

  , getPosition: function (inside) {
      return $.extend({}, (inside ? {top: 0, left: 0} : this.$element.offset()), {
        width: this.$element[0].offsetWidth
      , height: this.$element[0].offsetHeight
      })
    }

  , getTitle: function () {
      var title
        , $e = this.$element
        , o = this.options

      title = $e.attr('data-original-title')
        || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

      return title
    }

  , tip: function () {
      return this.$tip = this.$tip || $(this.options.template)
    }

  , validate: function () {
      if (!this.$element[0].parentNode) {
        this.hide()
        this.$element = null
        this.options = null
      }
    }

  , enable: function () {
      this.enabled = true
    }

  , disable: function () {
      this.enabled = false
    }

  , toggleEnabled: function () {
      this.enabled = !this.enabled
    }

  , toggle: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)
      self[self.tip().hasClass('in') ? 'hide' : 'show']()
    }

  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }

  }


 /* TOOLTIP PLUGIN DEFINITION
  * ========================= */

  var old = $.fn.tooltip

  $.fn.tooltip = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tooltip')
        , options = typeof option == 'object' && option
      if (!data) $this.data('tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip

  $.fn.tooltip.defaults = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover'
  , title: ''
  , delay: 0
  , html: false
  }


 /* TOOLTIP NO CONFLICT
  * =================== */

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(window.jQuery);;/* ===========================================================
 * bootstrap-popover.js v2.2.2
 * http://twitter.github.com/bootstrap/javascript.html#popovers
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* POPOVER PUBLIC CLASS DEFINITION
  * =============================== */

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }


  /* NOTE: POPOVER EXTENDS BOOTSTRAP-TOOLTIP.js
     ========================================== */

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype, {

    constructor: Popover

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()
        , content = this.getContent()

      $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
      $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content)

      $tip.removeClass('fade top bottom left right in')
    }

  , hasContent: function () {
      return this.getTitle() || this.getContent()
    }

  , getContent: function () {
      var content
        , $e = this.$element
        , o = this.options

      content = $e.attr('data-content')
        || (typeof o.content == 'function' ? o.content.call($e[0]) :  o.content)

      return content
    }

  , tip: function () {
      if (!this.$tip) {
        this.$tip = $(this.options.template)
      }
      return this.$tip
    }

  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }

  })


 /* POPOVER PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.popover

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('popover')
        , options = typeof option == 'object' && option
      if (!data) $this.data('popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover

  $.fn.popover.defaults = $.extend({} , $.fn.tooltip.defaults, {
    placement: 'right'
  , trigger: 'click'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"></div></div></div>'
  })


 /* POPOVER NO CONFLICT
  * =================== */

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(window.jQuery);;
(function ($, window, document, undefined) {
	'use strict';

	var pluginName = 'ButtonGroup';

	var defaults = {
		selected : 0
	};

	var names = {
		btnGroupClass : 'btn-group',
		valueAttrName : 'data-value',
		indexAttrName : 'data-index',
		selectedClass : 'uilib-selected',
		btnClass : 'uilib-button',
		btnClassToDeprecate : 'btn default',
		btnSelectedClassToDeprecate : 'active'
	};

	function ButtonGroup(element, options) {
		this.options = $.extend({}, defaults, options);
		this.$el = $(element);
		this.$selected = null
			this.init();
	}

	ButtonGroup.prototype.init = function () {
		this.markup();
		this.setValue(this.options.selected);
		this.bindEvents();
	};

	ButtonGroup.prototype.markup = function () {
		this.$el.addClass(names.btnGroupClass);
		this.getOptionsButtons().addClass(names.btnClass + ' ' + names.btnClassToDeprecate);
	};

	ButtonGroup.prototype.getOptionsButtons = function () {
		return this.$el.find('button');
	};

	ButtonGroup.prototype.setValue = function (value) {
		var $option;
		var $options = this.getOptionsButtons();
		if (typeof value === 'number') {
			$option = $options.eq(value);
		} else if (typeof value === 'string') {
			$option = $options.filter('[value="' + value + '"]').eq(0);
		} else if ($(value).hasClass(names.btnClass)) {
			$option = value;
		} else if(value && typeof value === 'object'){
			$option = $options.eq(value.index);
		}
		if ($option.length) {
			$options.removeClass(names.selectedClass + ' ' + names.btnSelectedClassToDeprecate);
			$option.addClass(names.selectedClass + ' ' + names.btnSelectedClassToDeprecate);
			this.$selected = $option;
		}
	};
	ButtonGroup.prototype.getValue = function () {
		return this.$selected.val();
	};

	ButtonGroup.prototype.getIndex = function () {
		return this.getOptionsButtons().index(this.$selected);
	};

	ButtonGroup.prototype.bindEvents = function () {
		var btnGroup = this;
		this.$el.on('click', '.' + names.btnClass, function (evt) {
			evt.stopPropagation();
			var value = $(this).val();
			if (btnGroup.$selected.val() !== value) {
				btnGroup.setValue(value);
				btnGroup.$el.trigger(pluginName + '.change', {
					index: btnGroup.$el.find('.' + names.btnClass).index(btnGroup.$selected),
					value:value
				});
			}
		});
	};

	$.fn[pluginName] = function (options) {
		return this.each(function () {
			if (!$.data(this, 'plugin_' + pluginName)) {
				$.data(this, 'plugin_' + pluginName, new ButtonGroup(this, options));
			}
		});
	};

})(jQuery, window, document);
;

(function ($, window, document, undefined) {
	'use strict';

	var pluginName = 'Accordion',
	defaults = {
		triggerClass : "acc-pane",
		triggerCSS : {},
		contentClass : "acc-content",
		contentCSS : {},
		animationTime : 150,
		activeClass : 'acc-active',
		ease : 'linear',
		openByDeafult:'acc-open',
		openPanel : 0
	};

	// The actual plugin constructor
	function Plugin(element, options) {
		this.$el = $(element);
		this.options = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}

	Plugin.prototype.init = function () {
		if(!this.$el.hasClass('accordion')){
			this.$el.addClass('accordion');
		}
		this.showFirst();
		this.bindEvents();
		this.applyCSS();
	};

	Plugin.prototype.showFirst = function () {
		var opt = this.options;
		this.$el.find('.' + opt.contentClass).hide();
		var $panels = this.$el.find('.' + opt.triggerClass);
		var $toOpen;
		if(typeof this.options.openPanel === 'string'){
			$toOpen = $panels.filter(this.options.openPanel);
		} else {
			$toOpen = $panels.eq(this.options.openPanel || 0);
		}
		
		var $openByDefault = this.$el.find('.'+opt.triggerClass+'.' + opt.openByDeafult)
		$toOpen = $toOpen.add($openByDefault);
		
		$toOpen.addClass(opt.activeClass + ' ' + opt.openByDeafult)
			.find('.'+opt.contentClass)
			.css('display','block');
	};
	
	Plugin.prototype.getValue = function () {
		var triggers = this.$el.find('.' + this.options.triggerClass);
		for(var i = 0; i < triggers.length; i++){
			if(triggers.eq(i).hasClass(this.options.activeClass)){
				return i;
			}
		}
		return -1;
	};

	Plugin.prototype.setValue = function ($el) {
		var opt = this.options;
		if(typeof $el === 'number'){
			$el = this.$el.find('.' + opt.triggerClass).eq($el); 
		}
		if ($el.find('.' + opt.contentClass).is(':hidden')) {
			this.openElementContent($el);
		}
	};
	
	Plugin.prototype.openElementContent = function ($el) {
		var opt = this.options;
		this.$el.find('.' + opt.triggerClass).removeClass(opt.openByDeafult).removeClass(opt.activeClass).find('.' + opt.contentClass).slideUp(opt.animationTime, opt.ease);
		$el.toggleClass(opt.activeClass).find('.'+opt.contentClass).fadeIn('fast').slideDown(opt.animationTime, opt.ease, function(){
			$(document.body).trigger('uilib-update-scroll-bars');
		});
	};

	Plugin.prototype.applyCSS = function () {
		this.$el.find('.' + this.options.contentClass).css(this.options.contentCSS);
		this.$el.find('.' + this.options.triggerClass).css(this.options.triggerCSS);
	};

	Plugin.prototype.bindEvents = function () {
		var that = this;
		this.$el.on('click', '.' + this.options.triggerClass, function (e) {
			if($(e.target).parents('.'+that.options.contentClass).length === 0){
				e.preventDefault();
				that.setValue($(this));
				that.$el.trigger(pluginName + '.change', that.getValue())
			}
		});
	};

	$.fn[pluginName] = function (options) {
		return this.each(function () {
			if (!$.data(this, 'plugin_' + pluginName)) {
				$.data(this, 'plugin_' + pluginName,
					new Plugin(this, options));
			}
		});
	};

})(jQuery, window, document);;// MSDropDown - jquery.dd.js
// author: Marghoob Suleman - http://www.marghoobsuleman.com/
// Date: 10 Nov, 2012
// Version: 3.3
// Revision: 22
// web: www.marghoobsuleman.com
/*
 // msDropDown is free jQuery Plugin: you can redistribute it and/or modify
 // it under the terms of the either the MIT License or the Gnu General Public License (GPL) Version 2
 */
var msBeautify = msBeautify || {};
(function ($) {
    msBeautify = {
        version: {msDropdown:'3.3'},
        author: "Marghoob Suleman",
        counter: 20,
        debug: function (v) {
            if (v !== false) {
                $(".ddOutOfVision").css({height: 'auto', position: 'relative'});
            } else {
                $(".ddOutOfVision").css({height: '0px', position: 'absolute'});
            }
        },
        oldDiv: '',
        create: function (id, settings, type) {
            type = type || "dropdown";
            var data;
            switch (type.toLowerCase()) {
                case "dropdown":
                case "select":
                    data = $(id).msDropdown(settings).data("dd");
                    break;
            }
            return data;
        }
    };

    $.msDropDown = {};
    $.msDropdown = {};
    $.extend(true, $.msDropDown, msBeautify);
    $.extend(true, $.msDropdown, msBeautify);
// make compatibiliy with old and new jquery
    if ($.fn.prop === undefined) {$.fn.prop = $.fn.attr;}
    if ($.fn.on === undefined) {$.fn.on = $.fn.bind;$.fn.off = $.fn.unbind;}
    if (typeof $.expr.createPseudo === 'function') {
        //jQuery 1.8  or greater
        $.expr[':'].Contains = $.expr.createPseudo(function (arg) {return function (elem) { return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0; }; });
    } else {
        //lower version
        $.expr[':'].Contains = function (a, i, m) {return $(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0; };
    }
//dropdown class
    function dd(element, settings) {
        var _settings = $.extend(true,{byJson: {data: null, selectedIndex: 0, name: null, size: 0, multiple: false, width: 250},
            mainCSS: 'dd',
            height: 120, //not using currently
            visibleRows: 7,
            rowHeight: 0,
            showIcon: true,
            zIndex: 9999,
            useSprite: false,
            animStyle: 'slideDown',
            event:'click',
            openDirection: 'auto', //auto || alwaysUp
            jsonTitle: true,
            style: '',
            disabledOpacity: 0.7,
            disabledOptionEvents: true,
            childWidth:0,
            enableCheckbox:false, //this needs to multiple or it will set element to multiple
            checkboxNameSuffix:'_mscheck',
            append:'',
            prepend:'',
            on: {create: null,open: null,close: null,add: null,remove: null,change: null,blur: null,click: null,dblclick: null,mousemove: null,mouseover: null,mouseout: null,focus: null,mousedown: null,mouseup: null}
        }, settings);
        var _this = this; //this class
        var _holderId = {postElementHolder: '_msddHolder', postID: '_msdd', postTitleID: '_title',postTitleTextID: '_titleText', postChildID: '_child'};
        var _styles = {dd:_settings.mainCSS, ddTitle: 'ddTitle', arrow: 'arrow arrowoff', ddChild: 'ddChild', ddTitleText: 'ddTitleText',disabled: 'disabled', enabled: 'enabled', ddOutOfVision: 'ddOutOfVision', borderTop: 'borderTop', noBorderTop: 'noBorderTop', selected: 'selected', divider: 'divider', optgroup: "optgroup", optgroupTitle: "optgroupTitle", description: "description", label: "ddlabel",hover: 'hover',disabledAll: 'disabledAll'};
        var _styles_i = {li: '_msddli_',borderRadiusTp: 'borderRadiusTp',ddChildMore: 'border shadow',fnone: "fnone"};
        var _isList = false, _isMultiple=false,_isDisabled=false, _cacheElement = {}, _element, _orginial = {}, _isOpen=false;
        var DOWN_ARROW = 40, UP_ARROW = 38, LEFT_ARROW=37, RIGHT_ARROW=39, ESCAPE = 27, ENTER = 13, ALPHABETS_START = 47, SHIFT=16 , CONTROL = 17;
        var _shiftHolded=false, _controlHolded=false,_lastTarget=null,_forcedTrigger=false, _oldSelected, _isCreated = false;
        var _doc = document, _ua = window.navigator.userAgent, _isIE = _ua.match(/msie/i);
        var msieversion = function()
        {
            var msie = _ua.indexOf("MSIE");
            if ( msie > 0 ) {      // If Internet Explorer, return version number
                return parseInt (_ua.substring (msie+5, _ua.indexOf (".", msie)));
            } else {                // If another browser, return 0
                return 0;
            };
        };
        var _checkDataSetting = function() {
            _settings.mainCSS = $("#"+_element).data("maincss") || _settings.mainCSS;
            _settings.visibleRows = $("#"+_element).data("visiblerows") || _settings.visibleRows;
            if($("#"+_element).data("showicon")==false) {_settings.showIcon = $("#"+_element).data("showicon");};
            _settings.useSprite = $("#"+_element).data("usesprite") || _settings.useSprite;
            _settings.animStyle = $("#"+_element).data("animstyle") || _settings.animStyle;
            _settings.event = $("#"+_element).data("event") || _settings.event;
            _settings.openDirection = $("#"+_element).data("opendirection") || _settings.openDirection;
            _settings.jsonTitle = $("#"+_element).data("jsontitle") || _settings.jsonTitle;
            _settings.disabledOpacity = $("#"+_element).data("disabledopacity") || _settings.disabledOpacity;
            _settings.childWidth = $("#"+_element).data("childwidth") || _settings.childWidth;
            _settings.enableCheckbox = $("#"+_element).data("enablecheckbox") || _settings.enableCheckbox;
            _settings.checkboxNameSuffix = $("#"+_element).data("checkboxnamesuffix") || _settings.checkboxNameSuffix;
            _settings.append = $("#"+_element).data("append") || _settings.append;
            _settings.prepend = $("#"+_element).data("prepend") || _settings.prepend;
        };
        var getElement = function(ele) {
            if (_cacheElement[ele] === undefined) {
                _cacheElement[ele] = _doc.getElementById(ele);
            }
            return _cacheElement[ele];
        };
        var _getIndex = function(opt) {
            var childid = _getPostID("postChildID");
            return $("#"+childid + " li."+_styles_i.li).index(opt);
        };
        var _createByJson = function() {
            if (_settings.byJson.data) {
                var validData = ["description","image",  "title"];
                try {
                    if (!element.id) {
                        element.id = "dropdown"+msBeautify.counter;
                    };
                    _settings.byJson.data = eval(_settings.byJson.data);
                    //change element
                    var id = "msdropdown"+(msBeautify.counter++);
                    var obj = {};
                    obj.id = id;
                    obj.name = _settings.byJson.name || element.id; //its name
                    if (_settings.byJson.size>0) {
                        obj.size = _settings.byJson.size;
                    };
                    obj.multiple = _settings.byJson.multiple;
                    var oSelect = _createElement("select", obj);
                    for(var i=0;i<_settings.byJson.data.length;i++) {
                        var current = _settings.byJson.data[i];
                        var opt = new Option(current.text, current.value);
                        for(var p in current) {
                            if (p.toLowerCase() != 'text') {
                                var key = ($.inArray(p.toLowerCase(), validData)!=-1) ? "data-" : "";
                                opt.setAttribute(key+p, current[p]);
                            };
                        };
                        oSelect.options[i] = opt;
                    };
                    getElement(element.id).appendChild(oSelect);
                    oSelect.selectedIndex = _settings.byJson.selectedIndex;
                    $(oSelect).css({width: _settings.byJson.width+'px'});
                    //now change element for access other things
                    element = oSelect;
                } catch(e) {
                    throw "There is an error in json data.";
                };
            };
        };
        var _construct = function() {
            //set properties
            _createByJson();
            if (!element.id) {
                element.id = "msdrpdd"+(msBeautify.counter++);
            };
            _element = element.id;
            _this._element = _element;
            _checkDataSetting();
            _isDisabled = getElement(_element).disabled;
            var useCheckbox = _settings.enableCheckbox;
            if(Boolean(useCheckbox)===true) {
                getElement(_element).multiple = true;
                _settings.enableCheckbox = true;
            };
            _isList = (getElement(_element).size>1 || getElement(_element).multiple==true) ? true : false;
            //trace("_isList "+_isList);
            if (_isList) {_isMultiple = getElement(_element).multiple;};
            _mergeAllProp();
            //create layout
            _createLayout();
            //set ui prop
            _updateProp("uiData", _getDataAndUI());
            _updateProp("selectedOptions", $("#"+_element +" option:selected"));
            var childid = _getPostID("postChildID");
            _oldSelected = $("#" + childid + " li." + _styles.selected);

        };
        /********************************************************************************************/
        var _getPostID = function (id) {
            return _element+_holderId[id];
        };
        var _getInternalStyle = function(ele) {
            var s = (ele.style === undefined) ? "" : ele.style.cssText;
            return s;
        };
        var _parseOption = function(opt) {
            var imagePath = '', title ='', description='', value=-1, text='', className='', imagecss = '';
            if (opt !== undefined) {
                var attrTitle = opt.title || "";
                //data-title
                if (attrTitle!="") {
                    var reg = /^\{.*\}$/;
                    var isJson = reg.test(attrTitle);
                    if (isJson && _settings.jsonTitle) {
                        var obj =  eval("["+attrTitle+"]");
                    };
                    title = (isJson && _settings.jsonTitle) ? obj[0].title : title;
                    description = (isJson && _settings.jsonTitle) ? obj[0].description : description;
                    imagePath = (isJson && _settings.jsonTitle) ? obj[0].image : attrTitle;
                    imagecss = (isJson && _settings.jsonTitle) ? obj[0].imagecss : imagecss;
                };

                text = opt.text || '';
                value = opt.value || '';
                className = opt.className || "";
                //ignore title attribute if playing with data tags
                title = $(opt).prop("data-title") || $(opt).data("title") || (title || "");
                description = $(opt).prop("data-description") || $(opt).data("description") || (description || "");
                imagePath = $(opt).prop("data-image") || $(opt).data("image") || (imagePath || "");
                imagecss = $(opt).prop("data-imagecss") || $(opt).data("imagecss") || (imagecss || "");

            };
            var o = {image: imagePath, title: title, description: description, value: value, text: text, className: className, imagecss:imagecss};
            return o;
        };
        var _createElement = function(nm, attr, html) {
            var tag = _doc.createElement(nm);
            if (attr) {
                for(var i in attr) {
                    switch(i) {
                        case "style":
                            tag.style.cssText  = attr[i];
                            break;
                        default:
                            tag[i]  = attr[i];
                            break;
                    };
                };
            };
            if (html) {
                tag.innerHTML = html;
            };
            return tag;
        };
        /********************************************************************************************/
        /*********************** <layout> *************************************/
        var _hideOriginal = function() {
            var hidid = _getPostID("postElementHolder");
            if ($("#"+hidid).length==0) {
                var obj = {style: 'height: 0px;overflow: hidden;position: absolute;',className: _styles.ddOutOfVision};
                obj.id = hidid;
                var oDiv = _createElement("div", obj);
                $("#"+_element).after(oDiv);
                $("#"+_element).appendTo($("#"+hidid));
            } else {
                $("#"+hidid).css({height: 0,overflow: 'hidden',position: 'absolute'});
            };
            getElement(_element).tabIndex = -1;
        };
        var _createWrapper = function () {
            var obj = {
                className: _styles.dd + " ddcommon borderRadius"
            };
            var styles = _getInternalStyle(getElement(_element));
            var w = $("#" + _element).outerWidth();
            obj.style = "width: " + w + "px;";
            if (styles.length > 0) {
                obj.style = obj.style + "" + styles;
            };
            obj.id = _getPostID("postID");
            obj.tabIndex = getElement(_element).tabIndex;
            var oDiv = _createElement("div", obj);
            return oDiv;
        };
        var _createTitle = function () {
            var selectedOption;
            if(getElement(_element).selectedIndex>=0) {
                selectedOption = getElement(_element).options[getElement(_element).selectedIndex];
            } else {
                selectedOption = {value:'', text:''};
            }
            var spriteClass = "", selectedClass = "";
            //check sprite
            var useSprite = $("#"+_element).data("usesprite");
            if(useSprite) { _settings.useSprite = useSprite; };
            if (_settings.useSprite != false) {
                spriteClass = " " + _settings.useSprite;
                selectedClass = " " + selectedOption.className;
            };
            var oTitle = _createElement("div", {className: _styles.ddTitle + spriteClass + " " + _styles_i.borderRadiusTp});
            //divider
            var oDivider = _createElement("span", {className: _styles.divider});
            //arrow
            var oArrow = _createElement("span", {className: _styles.arrow});
            //title Text
            var titleid = _getPostID("postTitleID");
            var oTitleText = _createElement("span", {className: _styles.ddTitleText + selectedClass, id: titleid});

            var parsed = _parseOption(selectedOption);
            var arrowPath = parsed.image;
            var sText = parsed.text || "";
            if (arrowPath != "" && _settings.showIcon) {
                var oIcon = _createElement("img");
                oIcon.src = arrowPath;
                if(parsed.imagecss!="") {
                    oIcon.className = parsed.imagecss+" ";
                };
            };
            var oTitleText_in = _createElement("span", {className: _styles.label}, sText);
            oTitle.appendChild(oDivider);
            oTitle.appendChild(oArrow);
            if (oIcon) {
                oTitleText.appendChild(oIcon);
            };
            oTitleText.appendChild(oTitleText_in);
            oTitle.appendChild(oTitleText);
            var oDescription = _createElement("span", {className: _styles.description}, parsed.description);
            oTitleText.appendChild(oDescription);
            return oTitle;
        };
        var _createFilterBox = function () {
            var tid = _getPostID("postTitleTextID");
            var sText = _createElement("input", {id: tid, type: 'text', value: '', autocomplete: 'off', className: 'text shadow borderRadius', style: 'display: none'});
            return sText;
        };
        var _createChild = function (opt) {
            var obj = {};
            var styles = _getInternalStyle(opt);
            if (styles.length > 0) {obj.style = styles; };
            var css = (opt.disabled) ? _styles.disabled : _styles.enabled;
            css = (opt.selected) ? (css + " " + _styles.selected) : css;
            css = css + " " + _styles_i.li;
            obj.className = css;
            if (_settings.useSprite != false) {
                obj.className = css + " " + opt.className;
            };
            var li = _createElement("li", obj);
            var parsed = _parseOption(opt);
            if (parsed.title != "") {
                li.title = parsed.title;
            };
            var arrowPath = parsed.image;
            if (arrowPath != "" && _settings.showIcon) {
                var oIcon = _createElement("img");
                oIcon.src = arrowPath;
                if(parsed.imagecss!="") {
                    oIcon.className = parsed.imagecss+" ";
                };
            };
            if (parsed.description != "") {
                var oDescription = _createElement("span", {
                    className: _styles.description
                }, parsed.description);
            };
            var sText = opt.text || "";
            var oTitleText = _createElement("span", {
                className: _styles.label
            }, sText);
            //checkbox
            if(_settings.enableCheckbox===true) {
                var chkbox = _createElement("input", {
                    type: 'checkbox', name:_element+_settings.checkboxNameSuffix+'[]', value:opt.value||""}); //this can be used for future
                li.appendChild(chkbox);
                if(_settings.enableCheckbox===true) {
                    chkbox.checked = (opt.selected) ? true : false;
                };
            };
            if (oIcon) {
                li.appendChild(oIcon);
            };
            li.appendChild(oTitleText);
            if (oDescription) {
                li.appendChild(oDescription);
            } else {
                if (oIcon) {
                    oIcon.className = oIcon.className+_styles_i.fnone;
                };
            };
            var oClear = _createElement("div", {className: 'clear'});
            li.appendChild(oClear);
            return li;
        };
        var _createChildren = function () {
            var childid = _getPostID("postChildID");
            var obj = {className: _styles.ddChild + " ddchild_ " + _styles_i.ddChildMore, id: childid};
            if (_isList == false) {
                obj.style = "z-index: " + _settings.zIndex;
            } else {
                obj.style = "z-index:1";
            };
            var childWidth = $("#"+_element).data("childwidth") || _settings.childWidth;
            if(childWidth) {
                obj.style =  (obj.style || "") + ";width:"+childWidth;
            };
            var oDiv = _createElement("div", obj);
            var ul = _createElement("ul");
            if (_settings.useSprite != false) {
                ul.className = _settings.useSprite;
            };
            var allOptions = getElement(_element).children;
            for (var i = 0; i < allOptions.length; i++) {
                var current = allOptions[i];
                var li;
                if (current.nodeName.toLowerCase() == "optgroup") {
                    //create ul
                    li = _createElement("li", {className: _styles.optgroup});
                    var span = _createElement("span", {className: _styles.optgroupTitle}, current.label);
                    li.appendChild(span);
                    var optChildren = current.children;
                    var optul = _createElement("ul");
                    for (var j = 0; j < optChildren.length; j++) {
                        var opt_li = _createChild(optChildren[j]);
                        optul.appendChild(opt_li);
                    };
                    li.appendChild(optul);
                } else {
                    li = _createChild(current);
                };
                ul.appendChild(li);
            };
            oDiv.appendChild(ul);
            return oDiv;
        };
        var _childHeight = function (val) {
            var childid = _getPostID("postChildID");
            if (val) {
                if (val == -1) { //auto
                    $("#"+childid).css({height: "auto", overflow: "auto"});
                } else {
                    $("#"+childid).css("height", val+"px");
                };
                return false;
            };
            //else return height
            var iHeight;
            if (getElement(_element).options.length > _settings.visibleRows) {
                var margin = parseInt($("#" + childid + " li:first").css("padding-bottom")) + parseInt($("#" + childid + " li:first").css("padding-top"));
                if(_settings.rowHeight===0) {
                    $("#" + childid).css({visibility:'hidden',display:'block'}); //hack for first child
                    _settings.rowHeight = Math.round($("#" + childid + " li:first").height());
                    $("#" + childid).css({visibility:'visible'});
                    if(!_isList || _settings.enableCheckbox===true) {
                        $("#" + childid).css({display:'none'});
                    };
                };
                iHeight = ((_settings.rowHeight + margin) * _settings.visibleRows);
            } else if (_isList) {
                iHeight = $("#" + _element).height(); //get height from original element
            };
            return iHeight;
        };
        var _applyChildEvents = function () {
            var childid = _getPostID("postChildID");
            $("#" + childid).on("click", function (e) {
                if (_isDisabled === true) return false;
                //prevent body click
                e.preventDefault();
                e.stopPropagation();
                if (_isList) {
                    _bind_on_events();
                };
            });
            $("#" + childid + " li." + _styles.enabled).on("click", function (e) {
                if(e.target.nodeName.toLowerCase() !== "input") {
                    _close(this);
                };
            });
            $("#" + childid + " li." + _styles.enabled).on("mousedown", function (e) {
                if (_isDisabled === true) return false;
                _oldSelected = $("#" + childid + " li." + _styles.selected);
                _lastTarget = this;
                e.preventDefault();
                e.stopPropagation();
                //select current input
                if(_settings.enableCheckbox===true) {
                    if(e.target.nodeName.toLowerCase() === "input") {
                        _controlHolded = true;
                    };
                };
                if (_isList === true) {
                    if (_isMultiple) {
                        if (_shiftHolded === true) {
                            $(this).addClass(_styles.selected);
                            var selected = $("#" + childid + " li." + _styles.selected);
                            var lastIndex = _getIndex(this);
                            if (selected.length > 1) {
                                var items = $("#" + childid + " li." + _styles_i.li);
                                var ind1 = _getIndex(selected[0]);
                                var ind2 = _getIndex(selected[1]);
                                if (lastIndex > ind2) {
                                    ind1 = (lastIndex);
                                    ind2 = ind2 + 1;
                                };
                                for (var i = Math.min(ind1, ind2); i <= Math.max(ind1, ind2); i++) {
                                    var current = items[i];
                                    if ($(current).hasClass(_styles.enabled)) {
                                        $(current).addClass(_styles.selected);
                                    };
                                };
                            };
                        } else if (_controlHolded === true) {
                            $(this).toggleClass(_styles.selected); //toggle
                            if(_settings.enableCheckbox===true) {
                                var checkbox = this.childNodes[0];
                                checkbox.checked = !checkbox.checked; //toggle
                            };
                        } else {
                            $("#" + childid + " li." + _styles.selected).removeClass(_styles.selected);
                            $("#" + childid + " input:checkbox").prop("checked", false);
                            $(this).addClass(_styles.selected);
                            if(_settings.enableCheckbox===true) {
                                this.childNodes[0].checked = true;
                            };
                        };
                    } else {
                        $("#" + childid + " li." + _styles.selected).removeClass(_styles.selected);
                        $(this).addClass(_styles.selected);
                    };
                    //fire event on mouseup
                } else {
                    $("#" + childid + " li." + _styles.selected).removeClass(_styles.selected);
                    $(this).addClass(_styles.selected);
                };
            });
            $("#" + childid + " li." + _styles.enabled).on("mouseenter", function (e) {
                if (_isDisabled === true) return false;
                e.preventDefault();
                e.stopPropagation();
                if (_lastTarget != null) {
                    if (_isMultiple) {
                        $(this).addClass(_styles.selected);
                        if(_settings.enableCheckbox===true) {
                            this.childNodes[0].checked = true;
                        };
                    };
                };
            });

            $("#" + childid + " li." + _styles.enabled).on("mouseover", function (e) {
                if (_isDisabled === true) return false;
                $(this).addClass(_styles.hover);
            });
            $("#" + childid + " li." + _styles.enabled).on("mouseout", function (e) {
                if (_isDisabled === true) return false;
                $("#" + childid + " li." + _styles.hover).removeClass(_styles.hover);
            });

            $("#" + childid + " li." + _styles.enabled).on("mouseup", function (e) {
                if (_isDisabled === true) return false;
                e.preventDefault();
                e.stopPropagation();
                if(_settings.enableCheckbox===true) {
                    _controlHolded = false;
                };
                var selected = $("#" + childid + " li." + _styles.selected).length;
                _forcedTrigger = (_oldSelected.length != selected || selected == 0) ? true : false;
                _fireAfterItemClicked();
                _unbind_on_events(); //remove old one
                _bind_on_events();
                _lastTarget = null;
            });

            /* options events */
            if (_settings.disabledOptionEvents == false) {
                $("#" + childid + " li." + _styles_i.li).on("click", function (e) {
                    if (_isDisabled === true) return false;
                    fireOptionEventIfExist(this, "click");
                });
                $("#" + childid + " li." + _styles_i.li).on("mouseenter", function (e) {
                    if (_isDisabled === true) return false;
                    fireOptionEventIfExist(this, "mouseenter");
                });
                $("#" + childid + " li." + _styles_i.li).on("mouseover", function (e) {
                    if (_isDisabled === true) return false;
                    fireOptionEventIfExist(this, "mouseover");
                });
                $("#" + childid + " li." + _styles_i.li).on("mouseout", function (e) {
                    if (_isDisabled === true) return false;
                    fireOptionEventIfExist(this, "mouseout");
                });
                $("#" + childid + " li." + _styles_i.li).on("mousedown", function (e) {
                    if (_isDisabled === true) return false;
                    fireOptionEventIfExist(this, "mousedown");
                });
                $("#" + childid + " li." + _styles_i.li).on("mouseup", function (e) {
                    if (_isDisabled === true) return false;
                    fireOptionEventIfExist(this, "mouseup");
                });
            };
        };
        var _removeChildEvents = function () {
            var childid = _getPostID("postChildID");
            $("#" + childid).off("click");
            $("#" + childid + " li." + _styles.enabled).off("mouseenter");
            $("#" + childid + " li." + _styles.enabled).off("click");
            $("#" + childid + " li." + _styles.enabled).off("mouseover");
            $("#" + childid + " li." + _styles.enabled).off("mouseout");
            $("#" + childid + " li." + _styles.enabled).off("mousedown");
            $("#" + childid + " li." + _styles.enabled).off("mouseup");
        };
        var _triggerBypassingHandler = function (id, evt_n, handler) {
            $("#" + id).off(evt_n, handler);
            $("#" + id).trigger(evt_n);
            $("#" + id).on(evt_n, handler);
        };
        var _applyEvents = function () {
            var id = _getPostID("postID");
            var tid = _getPostID("postTitleTextID");
            var childid = _getPostID("postChildID");
            $("#" + id).on(_settings.event, function (e) {
                if (_isDisabled === true) return false;
                fireEventIfExist("click");
                //prevent body click
                e.preventDefault();
                e.stopPropagation();
                _open(e);
            });
            $("#" + id).on("keydown", function (e) {
                var k = e.which;
                if (!_isOpen && (k == ENTER || k == UP_ARROW || k == DOWN_ARROW ||
                    k == LEFT_ARROW || k == RIGHT_ARROW ||
                    (k >= ALPHABETS_START && !_isList))) {
                    _open(e);
                    if (k >= ALPHABETS_START) {
                        _showFilterBox();
                    } else {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                    };
                };
            });
            $("#" + id).on("focus", _wrapperFocusHandler);
            $("#" + id).on("blur", _wrapperBlurHandler);
            $("#" + tid).on("blur", function (e) {
                //return focus to the wrapper without triggering the handler
                _triggerBypassingHandler(id, "focus", _wrapperFocusHandler);
            });
            _applyChildEvents();
            $("#" + id).on("dblclick", on_dblclick);
            $("#" + id).on("mousemove", on_mousemove);
            $("#" + id).on("mouseenter", on_mouseover);
            $("#" + id).on("mouseleave", on_mouseout);
            $("#" + id).on("mousedown", on_mousedown);
            $("#" + id).on("mouseup", on_mouseup);
        };
        var _wrapperFocusHandler = function (e) {
            fireEventIfExist("focus");
        };
        var _wrapperBlurHandler = function (e) {
            fireEventIfExist("blur");
        };
        //after create
        var _fixedForList = function () {
            var id = _getPostID("postID");
            var childid = _getPostID("postChildID");
            if (_isList === true && _settings.enableCheckbox===false) {
                $("#" + id + " ." + _styles.ddTitle).hide();
                $("#" + childid).css({display: 'block', position: 'relative'});
                //_open();
            } else {
                if(_settings.enableCheckbox===false) {
                    _isMultiple = false; //set multiple off if this is not a list
                };
                $("#" + id + " ." + _styles.ddTitle).show();
                $("#" + childid).css({display: 'none', position: 'absolute'});
                //set value
                var first = $("#" + childid + " li." + _styles.selected)[0];
                $("#" + childid + " li." + _styles.selected).removeClass(_styles.selected);
                var index = _getIndex($(first).addClass(_styles.selected));
                _setValue(index);
            };
            _childHeight(_childHeight()); //get and set height
        };
        var _fixedForDisabled = function () {
            var id = _getPostID("postID");
            var opc = (_isDisabled == true) ? _settings.disabledOpacity : 1;
            if (_isDisabled === true) {
                $("#" + id).addClass(_styles.disabledAll);
            } else {
                $("#" + id).removeClass(_styles.disabledAll);
            };
        };
        var _fixedSomeUI = function () {
            //auto filter
            var tid = _getPostID("postTitleTextID");
            $("#" + tid).on("keyup", _applyFilters);
            //if is list
            _fixedForList();
            _fixedForDisabled();
        };
        var _createLayout = function () {
            var oDiv = _createWrapper();
            var oTitle = _createTitle();
            oDiv.appendChild(oTitle);
            //auto filter box
            var oFilterBox = _createFilterBox();
            oDiv.appendChild(oFilterBox);

            var oChildren = _createChildren();
            oDiv.appendChild(oChildren);
            $("#" + _element).after(oDiv);
            _hideOriginal(); //hideOriginal
            _fixedSomeUI();
            _applyEvents();

            var childid = _getPostID("postChildID");
            //append
            if(_settings.append!='') {
                $("#" + childid).append(_settings.append);
            };
            //prepend
            if(_settings.prepend!='') {
                $("#" + childid).prepend(_settings.prepend);
            };
            if (typeof _settings.on.create == "function") {
                _settings.on.create.apply(_this, arguments);
            };
        };
        var _selectMutipleOptions = function (bySelected) {
            var childid = _getPostID("postChildID");
            var selected = bySelected || $("#" + childid + " li." + _styles.selected); //bySelected or by argument
            for (var i = 0; i < selected.length; i++) {
                var ind = _getIndex(selected[i]);
                getElement(_element).options[ind].selected = "selected";
            };
            _setValue(selected);
        };
        var _fireAfterItemClicked = function () {
            //console.log("_fireAfterItemClicked")
            var childid = _getPostID("postChildID");
            var selected = $("#" + childid + " li." + _styles.selected);
            if (_isMultiple && (_shiftHolded || _controlHolded) || _forcedTrigger) {
                getElement(_element).selectedIndex = -1; //reset old
            };
            var index;
            if (selected.length == 0) {
                index = -1;
            } else if (selected.length > 1) {
                //selected multiple
                _selectMutipleOptions(selected);
                //index = $("#" + childid + " li." + _styles.selected);

            } else {
                //if one selected
                index = _getIndex($("#" + childid + " li." + _styles.selected));
            };
            if ((getElement(_element).selectedIndex != index || _forcedTrigger) && selected.length<=1) {
                _forcedTrigger = false;
                var evt = has_handler("change");
                getElement(_element).selectedIndex = index;
                _setValue(index);
                //local
                if (typeof _settings.on.change == "function") {
                    var d = _getDataAndUI();
                    _settings.on.change(d.data, d.ui);
                };
                $("#" + _element).trigger("change");
            };
        };
        var _setValue = function (index, byvalue) {
            if (index !== undefined) {
                var selectedIndex, value, selectedText;
                if (index == -1) {
                    selectedIndex = -1;
                    value = "";
                    selectedText = "";
                    _updateTitleUI(-1);
                } else {
                    //by index or byvalue
                    if (typeof index != "object") {
                        var opt = getElement(_element).options[index];
                        getElement(_element).selectedIndex = index;
                        selectedIndex = index;
                        value = _parseOption(opt);
                        selectedText = (index >= 0) ? getElement(_element).options[index].text : "";
                        _updateTitleUI(undefined, value);
                        value = value.value; //for bottom
                    } else {
                        //this is multiple or by option
                        selectedIndex = (byvalue && byvalue.index) || getElement(_element).selectedIndex;
                        value = (byvalue && byvalue.value) || getElement(_element).value;
                        selectedText = (byvalue && byvalue.text) || getElement(_element).options[getElement(_element).selectedIndex].text || "";
                        _updateTitleUI(selectedIndex);
                    };
                };
                _updateProp("selectedIndex", selectedIndex);
                _updateProp("value", value);
                _updateProp("selectedText", selectedText);
                _updateProp("children", getElement(_element).children);
                _updateProp("uiData", _getDataAndUI());
                _updateProp("selectedOptions", $("#" + _element + " option:selected"));
            };
        };
        var has_handler = function (name) {
            //True if a handler has been added in the html.
            var evt = {byElement: false, byJQuery: false, hasEvent: false};
            var obj = $("#" + _element);
            //console.log(name)
            try {
                //console.log(obj.prop("on" + name) + " "+name);
                if (obj.prop("on" + name) !== null) {
                    evt.hasEvent = true;
                    evt.byElement = true;
                };
            } catch(e) {
                //console.log(e.message);
            }
            // True if a handler has been added using jQuery.
            var evs;
            if (typeof $._data == "function") { //1.8
                evs = $._data(obj[0], "events");
            } else {
                evs = obj.data("events");
            };
            if (evs && evs[name]) {
                evt.hasEvent = true;
                evt.byJQuery = true;
            };
            return evt;
        };
        var _bind_on_events = function () {
            _unbind_on_events();
            $("body").on("click", _close);
            //bind more events
            $(document).on("keydown", on_keydown);
            $(document).on("keyup", on_keyup);
            //focus will work on this
        };
        var _unbind_on_events = function () {
            $("body").off("click", _close);
            //bind more events
            $(document).off("keydown", on_keydown);
            $(document).off("keyup", on_keyup);
        };
        var _applyFilters = function () {
            var childid = _getPostID("postChildID");
            var tid = _getPostID("postTitleTextID");
            var sText = getElement(tid).value;
            if (sText.length == 0) {
                $("#" + childid + " li:hidden").show(); //show if hidden
                _childHeight(_childHeight());
            } else {
                $("#" + childid + " li").hide();
                var items = $("#" + childid + " li:Contains('" + sText + "')").show();
                if ($("#" + childid + " li:visible").length <= _settings.visibleRows) {
                    _childHeight(-1); //set autoheight
                };
                if (items.length > 0 && !_isList || !_isMultiple) {
                    $("#" + childid + " ." + _styles.selected).removeClass(_styles.selected);
                    $(items[0]).addClass(_styles.selected);
                };
            };
        };
        var _showFilterBox = function () {
            var id = _getPostID("postID");
            var tid = _getPostID("postTitleTextID");
            if ($("#" + tid + ":hidden").length > 0 && _controlHolded == false) {
                $("#" + tid + ":hidden").show().val("");
                //blur the wrapper without triggering the handler
                _triggerBypassingHandler(id, "blur", _wrapperBlurHandler);
                getElement(tid).focus();
            };
        };
        var _hideFilterBox = function () {
            var tid = _getPostID("postTitleTextID");
            if ($("#" + tid + ":visible").length > 0) {
                $("#" + tid + ":visible").hide();
                getElement(tid).blur();
            };
        };
        var on_keydown = function (evt) {
            var tid = _getPostID("postTitleTextID");
            var childid = _getPostID("postChildID");
            switch (evt.keyCode) {
                case DOWN_ARROW:
                case RIGHT_ARROW:
                    evt.preventDefault();
                    evt.stopPropagation();
                    //_hideFilterBox();
                    _next();
                    break;
                case UP_ARROW:
                case LEFT_ARROW:
                    evt.preventDefault();
                    evt.stopPropagation();
                    //_hideFilterBox();
                    _previous();
                    break;
                case ESCAPE:
                case ENTER:
                    evt.preventDefault();
                    evt.stopPropagation();
                    _close();
                    var selected = $("#" + childid + " li." + _styles.selected).length;
                    _forcedTrigger = (_oldSelected.length != selected || selected == 0) ? true : false;
                    _fireAfterItemClicked();
                    _unbind_on_events(); //remove old one
                    _lastTarget = null;
                    break;
                case SHIFT:
                    _shiftHolded = true;
                    break;
                case CONTROL:
                    _controlHolded = true;
                    break;
                default:
                    if (evt.keyCode >= ALPHABETS_START && _isList === false) {
                        _showFilterBox();
                    };
                    break;
            };
            if (_isDisabled === true) return false;
            fireEventIfExist("keydown");
        };
        var on_keyup = function (evt) {
            switch (evt.keyCode) {
                case SHIFT:
                    _shiftHolded = false;
                    break;
                case CONTROL:
                    _controlHolded = false;
                    break;
            };
            if (_isDisabled === true) return false;
            fireEventIfExist("keyup");
        };
        var on_dblclick = function (evt) {
            if (_isDisabled === true) return false;
            fireEventIfExist("dblclick");
        };
        var on_mousemove = function (evt) {
            if (_isDisabled === true) return false;
            fireEventIfExist("mousemove");
        };

        var on_mouseover = function (evt) {
            if (_isDisabled === true) return false;
            evt.preventDefault();
            fireEventIfExist("mouseover");
        };
        var on_mouseout = function (evt) {
            if (_isDisabled === true) return false;
            evt.preventDefault();
            fireEventIfExist("mouseout");
        };
        var on_mousedown = function (evt) {
            if (_isDisabled === true) return false;
            fireEventIfExist("mousedown");
        };
        var on_mouseup = function (evt) {
            if (_isDisabled === true) return false;
            fireEventIfExist("mouseup");
        };
        var option_has_handler = function (opt, name) {
            //True if a handler has been added in the html.
            var evt = {byElement: false, byJQuery: false, hasEvent: false};
            if ($(opt).prop("on" + name) != undefined) {
                evt.hasEvent = true;
                evt.byElement = true;
            };
            // True if a handler has been added using jQuery.
            var evs = $(opt).data("events");
            if (evs && evs[name]) {
                evt.hasEvent = true;
                evt.byJQuery = true;
            };
            return evt;
        };
        var fireOptionEventIfExist = function (li, evt_n) {
            if (_settings.disabledOptionEvents == false) {
                var opt = getElement(_element).options[_getIndex(li)];
                //check if original has some
                if (option_has_handler(opt, evt_n).hasEvent === true) {
                    if (option_has_handler(opt, evt_n).byElement === true) {
                        opt["on" + evt_n]();
                    };
                    if (option_has_handler(opt, evt_n).byJQuery === true) {
                        switch (evt_n) {
                            case "keydown":
                            case "keyup":
                                //key down/up will check later
                                break;
                            default:
                                $(opt).trigger(evt_n);
                                break;
                        };
                    };
                    return false;
                };
            };
        };
        var fireEventIfExist = function (evt_n) {
            //local
            if (typeof _settings.on[evt_n] == "function") {
                _settings.on[evt_n].apply(this, arguments);
            };
            //check if original has some
            if (has_handler(evt_n).hasEvent === true) {
                if (has_handler(evt_n).byElement === true) {
                    getElement(_element)["on" + evt_n]();
                } else if (has_handler(evt_n).byJQuery === true) {
                    switch (evt_n) {
                        case "keydown":
                        case "keyup":
                            //key down/up will check later
                            break;
                        default:
                            $("#" + _element).triggerHandler(evt_n);
                            break;
                    };
                };
                return false;
            };
        };
        /******************************* navigation **********************************************/
        var _scrollToIfNeeded = function (opt) {
            var childid = _getPostID("postChildID");
            //if scroll is needed
            opt = (opt !== undefined) ? opt : $("#" + childid + " li." + _styles.selected);
            if (opt.length > 0) {
                var pos = parseInt(($(opt).position().top));
                var ch = parseInt($("#" + childid).height());
                if (pos > ch) {
                    var top = pos + $("#" + childid).scrollTop() - (ch/2);
                    $("#" + childid).animate({scrollTop:top}, 500);
                };
            };
        };
        var _next = function () {
            var childid = _getPostID("postChildID");
            var items = $("#" + childid + " li:visible." + _styles_i.li);
            var selected = $("#" + childid + " li:visible." + _styles.selected);
            selected = (selected.length==0) ? items[0] : selected;
            var index = $("#" + childid + " li:visible." + _styles_i.li).index(selected);
            if ((index < items.length - 1)) {
                index = getNext(index);
                if (index < items.length) { //check again - hack for last disabled
                    if (!_shiftHolded || !_isList || !_isMultiple) {
                        $("#" + childid + " ." + _styles.selected).removeClass(_styles.selected);
                    };
                    $(items[index]).addClass(_styles.selected);
                    _updateTitleUI(index);
                    if (_isList == true) {
                        _fireAfterItemClicked();
                    };
                    _scrollToIfNeeded($(items[index]));
                };
                if (!_isList) {
                    _adjustOpen();
                };
            };
            function getNext(ind) {
                ind = ind + 1;
                if (ind > items.length) {
                    return ind;
                };
                if ($(items[ind]).hasClass(_styles.enabled) === true) {
                    return ind;
                };
                return ind = getNext(ind);
            };
        };
        var _previous = function () {
            var childid = _getPostID("postChildID");
            var selected = $("#" + childid + " li:visible." + _styles.selected);
            var items = $("#" + childid + " li:visible." + _styles_i.li);
            var index = $("#" + childid + " li:visible." + _styles_i.li).index(selected[0]);
            if (index >= 0) {
                index = getPrev(index);
                if (index >= 0) { //check again - hack for disabled
                    if (!_shiftHolded || !_isList || !_isMultiple) {
                        $("#" + childid + " ." + _styles.selected).removeClass(_styles.selected);
                    };
                    $(items[index]).addClass(_styles.selected);
                    _updateTitleUI(index);
                    if (_isList == true) {
                        _fireAfterItemClicked();
                    };
                    if (parseInt(($(items[index]).position().top + $(items[index]).height())) <= 0) {
                        var top = ($("#" + childid).scrollTop() - $("#" + childid).height()) - $(items[index]).height();
                        $("#" + childid).animate({scrollTop: top}, 500);
                    };
                };
                if (!_isList) {
                    _adjustOpen();
                };
            };

            function getPrev(ind) {
                ind = ind - 1;
                if (ind < 0) {
                    return ind;
                };
                if ($(items[ind]).hasClass(_styles.enabled) === true) {
                    return ind;
                };
                return ind = getPrev(ind);
            };
        };
        var _adjustOpen = function () {
            var id = _getPostID("postID");
            var childid = _getPostID("postChildID");
            var pos = $("#" + id).offset();
            var mH = $("#" + id).height();
            var wH = $(window).height();
            var st = $(window).scrollTop();
            var cH = $("#" + childid).height();
            var top = $("#" + id).height(); //this close so its title height
            if ((wH + st) < Math.floor(cH + mH + pos.top) || _settings.openDirection.toLowerCase() == 'alwaysup') {
                top = cH;
                $("#" + childid).css({top: "-" + top + "px", display: 'block', zIndex: _settings.zIndex});
                $("#" + id).removeClass("borderRadius borderRadiusTp").addClass("borderRadiusBtm");
                var top = $("#" + childid).offset().top;
                if (top < -10) {
                    $("#" + childid).css({top: (parseInt($("#" + childid).css("top")) - top + 20 + st) + "px", zIndex: _settings.zIndex});
                    $("#" + id).removeClass("borderRadiusBtm borderRadiusTp").addClass("borderRadius");
                };
            } else {
                $("#" + childid).css({top: top + "px", zIndex: _settings.zIndex});
                $("#" + id).removeClass("borderRadius borderRadiusBtm").addClass("borderRadiusTp");
            };
            //hack for ie zindex
            //i hate ie :D
            if(_isIE) {
                if(msieversion()<=7) {
                    $('div.ddcommon').css("zIndex", _settings.zIndex-10);
                    $("#" + id).css("zIndex", _settings.zIndex+5);
                };
            };
        };
        var _open = function (e) {
            if (_isDisabled === true) return false;
            var id = _getPostID("postID");
            var childid = _getPostID("postChildID");
            if (!_isOpen) {
                _isOpen = true;
                if (msBeautify.oldDiv != '') {
                    $("#" + msBeautify.oldDiv).css({display: "none"}); //hide all
                };
                msBeautify.oldDiv = childid;
                $("#" + childid + " li:hidden").show(); //show if hidden
                _adjustOpen();
                var animStyle = _settings.animStyle;
                if(animStyle=="" || animStyle=="none") {
                    $("#" + childid).css({display:"block"});
                    _scrollToIfNeeded();
                    if (typeof _settings.on.open == "function") {
                        var d = _getDataAndUI();
                        _settings.on.open(d.data, d.ui);
                    };
                } else {
                    $("#" + childid)[animStyle]("fast", function () {
                        _scrollToIfNeeded();
                        if (typeof _settings.on.open == "function") {
                            var d = _getDataAndUI();
                            _settings.on.open(d.data, d.ui);
                        };
                    });
                };
                _bind_on_events();
            } else {
                if(_settings.event!=='mouseover') {
                    _close();
                };
            };
        };
        var _close = function (e) {
            _isOpen = false;
            var id = _getPostID("postID");
            var childid = _getPostID("postChildID");
            if (_isList === false || _settings.enableCheckbox===true) {
                $("#" + childid).css({display: "none"});
                $("#" + id).removeClass("borderRadiusTp borderRadiusBtm").addClass("borderRadius");
            };
            _unbind_on_events();
            if (typeof _settings.on.close == "function") {
                var d = _getDataAndUI();
                _settings.on.close(d.data, d.ui);
            };
            //rest some old stuff
            _hideFilterBox();
            _childHeight(_childHeight()); //its needed after filter applied
            $("#" + childid).css({zIndex:1});
            //update the title in case the user clicked outside
            _updateTitleUI(getElement(_element).selectedIndex);
        };
        /*********************** </layout> *************************************/
        var _mergeAllProp = function () {
            try {
                _orginial = $.extend(true, {}, getElement(_element));
                for (var i in _orginial) {
                    if (typeof _orginial[i] != "function") {
                        _this[i] = _orginial[i]; //properties
                    };
                };
            } catch(e) {
                //silent
            };
            _this.selectedText = (getElement(_element).selectedIndex >= 0) ? getElement(_element).options[getElement(_element).selectedIndex].text : "";
            _this.version = msBeautify.version.msDropdown;
            _this.author = msBeautify.author;
        };
        var _getDataAndUIByOption = function (opt) {
            if (opt != null && typeof opt != "undefined") {
                var childid = _getPostID("postChildID");
                var data = _parseOption(opt);
                var ui = $("#" + childid + " li." + _styles_i.li + ":eq(" + (opt.index) + ")");
                return {data: data, ui: ui, option: opt, index: opt.index};
            };
            return null;
        };
        var _getDataAndUI = function () {
            var childid = _getPostID("postChildID");
            var ele = getElement(_element);
            var data, ui, option, index;
            if (ele.selectedIndex == -1) {
                data = null;
                ui = null;
                option = null;
                index = -1;
            } else {
                ui = $("#" + childid + " li." + _styles.selected);
                if (ui.length > 1) {
                    var d = [], op = [], ind = [];
                    for (var i = 0; i < ui.length; i++) {
                        var pd = _getIndex(ui[i]);
                        d.push(pd);
                        op.push(ele.options[pd]);
                    };
                    data = d;
                    option = op;
                    index = d;
                } else {
                    option = ele.options[ele.selectedIndex];
                    data = _parseOption(option);
                    index = ele.selectedIndex;
                };
            };
            return {data: data, ui: ui, index: index, option: option};
        };
        var _updateTitleUI = function (index, byvalue) {
            var titleid = _getPostID("postTitleID");
            var value = {};
            if (index == -1) {
                value.text = "&nbsp;";
                value.className = "";
                value.description = "";
                value.image = "";
            } else if (typeof index != "undefined") {
                var opt = getElement(_element).options[index];
                value = _parseOption(opt);
            } else {
                value = byvalue;
            };
            //update title and current
            $("#" + titleid).find("." + _styles.label).html(value.text);
            getElement(titleid).className = _styles.ddTitleText + " " + value.className;
            //update desction
            if (value.description != "") {
                $("#" + titleid).find("." + _styles.description).html(value.description).show();
            } else {
                $("#" + titleid).find("." + _styles.description).html("").hide();
            };
            //update icon
            var img = $("#" + titleid).find("img");
            if (img.length > 0) {
                $(img).remove();
            };
            if (value.image != "" && _settings.showIcon) {
                img = _createElement("img", {src: value.image});
                $("#" + titleid).prepend(img);
                if(value.imagecss!="") {
                    img.className = value.imagecss+" ";
                };
                if (value.description == "") {
                    img.className = img.className+_styles_i.fnone;
                };
            };
        };
        var _updateProp = function (p, v) {
            _this[p] = v;
        };
        var _updateUI = function (a, opt, i) { //action, index, opt
            var childid = _getPostID("postChildID");
            var wasSelected = false;
            switch (a) {
                case "add":
                    var li = _createChild(opt || getElement(_element).options[i]);
                    var index;
                    if (arguments.length == 3) {
                        index = i;
                    } else {
                        index = $("#" + childid + " li." + _styles_i.li).length - 1;
                    };
                    if (index < 0 || !index) {
                        $("#" + childid + " ul").append(li);
                    } else {
                        var at = $("#" + childid + " li." + _styles_i.li)[index];
                        $(at).before(li);
                    };
                    _removeChildEvents();
                    _applyChildEvents();
                    if (_settings.on.add != null) {
                        _settings.on.add.apply(this, arguments);
                    };
                    break;
                case "remove":
                    wasSelected = $($("#" + childid + " li." + _styles_i.li)[i]).hasClass(_styles.selected);
                    $("#" + childid + " li." + _styles_i.li + ":eq(" + i + ")").remove();
                    var items = $("#" + childid + " li." + _styles.enabled);
                    if (wasSelected == true) {
                        if (items.length > 0) {
                            $(items[0]).addClass(_styles.selected);
                            var ind = $("#" + childid + " li." + _styles_i.li).index(items[0]);
                            _setValue(ind);
                        };
                    };
                    if (items.length == 0) {
                        _setValue(-1);
                    };
                    if ($("#" + childid + " li." + _styles_i.li).length < _settings.visibleRows && !_isList) {
                        _childHeight(-1); //set autoheight
                    };
                    if (_settings.on.remove != null) {
                        _settings.on.remove.apply(this, arguments);
                    };
                    break;
            };
        };
        /************************** public methods/events **********************/
        this.act = function () {
            var action = arguments[0];
            Array.prototype.shift.call(arguments);
            switch (action) {
                case "add":
                    _this.add.apply(this, arguments);
                    break;
                case "remove":
                    _this.remove.apply(this, arguments);
                    break;
                default:
                    try {
                        getElement(_element)[action].apply(getElement(_element), arguments);
                    } catch (e) {
                        //there is some error.
                    };
                    break;
            };
        };

        this.add = function () {
            var text, value, title, image, description;
            var obj = arguments[0];
            if (typeof obj == "string") {
                text = obj;
                value = text;
                opt = new Option(text, value);
            } else {
                text = obj.text || '';
                value = obj.value || text;
                title = obj.title || '';
                image = obj.image || '';
                description = obj.description || '';
                //image:imagePath, title:title, description:description, value:opt.value, text:opt.text, className:opt.className||""
                opt = new Option(text, value);
                $(opt).data("description", description);
                $(opt).data("image", image);
                $(opt).data("title", title);
            };
            arguments[0] = opt; //this option
            getElement(_element).add.apply(getElement(_element), arguments);
            _updateProp("children", getElement(_element)["children"]);
            _updateProp("length", getElement(_element).length);
            _updateUI("add", opt, arguments[1]);
        };
        this.remove = function (i) {
            getElement(_element).remove(i);
            _updateProp("children", getElement(_element)["children"]);
            _updateProp("length", getElement(_element).length);
            _updateUI("remove", undefined, i);
        };
        this.set = function (prop, val) {
            if (typeof prop == "undefined" || typeof val == "undefined") return false;
            prop = prop.toString();
            try {
                _updateProp(prop, val);
            } catch (e) {/*this is ready only */};

            switch (prop) {
                case "size":
                    getElement(_element)[prop] = val;
                    if (val == 0) {
                        getElement(_element).multiple = false; //if size is zero multiple should be false
                    };
                    _isList = (getElement(_element).size > 1 || getElement(_element).multiple == true) ? true : false;
                    _fixedForList();
                    break;
                case "multiple":
                    getElement(_element)[prop] = val;
                    _isList = (getElement(_element).size > 1 || getElement(_element).multiple == true) ? true : false;
                    _isMultiple = getElement(_element).multiple;
                    _fixedForList();
                    _updateProp(prop, val);
                    break;
                case "disabled":
                    getElement(_element)[prop] = val;
                    _isDisabled = val;
                    _fixedForDisabled();
                    break;
                case "selectedIndex":
                case "value":
                    getElement(_element)[prop] = val;
                    var childid = _getPostID("postChildID");
                    $("#" + childid + " li." + _styles_i.li).removeClass(_styles.selected);
                    $($("#" + childid + " li." + _styles_i.li)[getElement(_element).selectedIndex]).addClass(_styles.selected);
                    _setValue(getElement(_element).selectedIndex);
                    break;
                case "length":
                    var childid = _getPostID("postChildID");
                    if (val < getElement(_element).length) {
                        getElement(_element)[prop] = val;
                        if (val == 0) {
                            $("#" + childid + " li." + _styles_i.li).remove();
                            _setValue(-1);
                        } else {
                            $("#" + childid + " li." + _styles_i.li + ":gt(" + (val - 1) + ")").remove();
                            if ($("#" + childid + " li." + _styles.selected).length == 0) {
                                $("#" + childid + " li." + _styles.enabled + ":eq(0)").addClass(_styles.selected);
                            };
                        };
                        _updateProp(prop, val);
                        _updateProp("children", getElement(_element)["children"]);
                    };
                    break;
                case "id":
                    //please i need this. so preventing to change it. will work on this later
                    break;
                default:
                    //check if this is not a readonly properties
                    try {
                        getElement(_element)[prop] = val;
                        _updateProp(prop, val);
                    } catch (e) {
                        //silent
                    };
                    break;
            }
        };
        this.get = function (prop) {
            return _this[prop] || getElement(_element)[prop]; //return if local else from original
        };
        this.visible = function (val) {
            var id = _getPostID("postID");
            if (val === true) {
                $("#" + id).show();
            } else if (val === false) {
                $("#" + id).hide();
            } else {
                return ($("#" + id).css("display")=="none") ? false : true;
            };
        };
        this.debug = function (v) {
            msBeautify.debug(v);
        };
        this.close = function () {
            _close();
        };
        this.open = function () {
            _open();
        };
        this.showRows = function (r) {
            if (typeof r == "undefined" || r == 0) {
                return false;
            };
            _settings.visibleRows = r;
            _childHeight(_childHeight());
        };
        this.visibleRows = this.showRows;
        this.on = function (type, fn) {
            $("#" + _element).on(type, fn);
        };
        this.off = function (type, fn) {
            $("#" + _element).off(type, fn);
        };
        this.addMyEvent = this.on;
        this.getData = function () {
            return _getDataAndUI()
        };
        this.namedItem = function () {
            var opt = getElement(_element).namedItem.apply(getElement(_element), arguments);
            return _getDataAndUIByOption(opt);
        };
        this.item = function () {
            var opt = getElement(_element).item.apply(getElement(_element), arguments);
            return _getDataAndUIByOption(opt);
        };
        //v 3.2
        this.setIndexByValue = function(val) {
            this.set("value", val);
        };
        this.destroy = function () {
            var hidid = _getPostID("postElementHolder");
            var id = _getPostID("postID");
            $("#" + id + ", #" + id + " *").off();
            getElement(_element).tabIndex = getElement(id).tabIndex;
            $("#" + id).remove();
            $("#" + _element).parent().replaceWith($("#" + _element));
            $("#" + _element).data("dd", null);
        };
        //Create msDropDown
        _construct();
    };
//bind in jquery
    $.fn.extend({
        msDropDown: function(settings)
        {
            return this.each(function()
            {
                if (!$(this).data('dd')){
                    var mydropdown = new dd(this, settings);
                    $(this).data('dd', mydropdown);
                };
            });
        }
    });
    $.fn.msDropdown = $.fn.msDropDown; //make a copy
})(jQuery);;(function ($, window, document) {
    'use strict';

    var pluginName = 'Checkbox',

	defaults = {
		checked : false,
		preLabel: '',
		postLabel: ''			
	};

    // The actual plugin constructor
    function Plugin(element, options) {
        this.$el = $(element);
        this.options = $.extend({}, defaults, options);
        this.init();
    }
			
    Plugin.prototype.init = function() {
		this.markup();
		this.bindEvents();		
    };

	Plugin.prototype.markup = function() {
		
		if(!this.$el.hasClass('uilib-checkbox')){
			this.$el.addClass('uilib-checkbox');
		}
		
		this.$el.append('<span class="uilib-checkbox-check"></span>');

		if(this.options.preLabel){
			this.$el.prepend('<span class="uilib-text uilib-checkbox-preLabel">' + this.options.preLabel + '</span>');
		}
		
		if(this.options.postLabel){
			this.$el.append('<span class="uilib-text uilib-checkbox-postLabel">' + this.options.postLabel + '</span>');
		}
		
        // Check the checkbox according to defaults or the value that was set by the user
        this.options.checked ? this.$el.addClass('checked'): this.$el.removeClass('checked');
		
		//this.setDataAttribute();
	}	
	
	// Plugin.prototype.setDataAttribute = function() {
		// this.$el.attr('data-uilib-value', this.$el.hasClass('checked'));
	// }		
	
	Plugin.prototype.bindEvents = function() {
        this.$el.on('click', this.toggleChecked.bind(this));
	}
	
	Plugin.prototype.getValue = function() {
        return this.$el.hasClass('checked');
	}
	
		
	Plugin.prototype.setValue = function(value) {
        value ? this.$el.addClass('checked') : this.$el.removeClass('checked');
	}
	
	Plugin.prototype.toggleChecked = function() {
		this.$el.toggleClass('checked');		
		//this.setDataAttribute();
		this.$el.trigger(pluginName + '.change', this.getValue());	
	}

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);;var createColorBox = (function (){
	var ColorPicker = (function () {
		"use strict";
		var useHex = true;
		/////////////////////////////////////////////////////////////////////
		//                                                                 //
		// this chank of code is for ie9                                   //
		// you can not include this chank if you are not tageting ie9      //
		// it is also works in all browsers that support svg img url       //
		//                                                                 //
		/////////////////////////////////////////////////////////////////////
		
		'use strict';
		var ieG = (function (dir, stops) {
			//{offset:'0%',color:'black', opacity:'1'}
			var grd = {
				open:'<?xml version="1.0" ?><svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" version="1.0" width="100%" height="100%" xmlns:xlink="http://www.w3.org/1999/xlink"><defs>',
				close:'</linearGradient></defs><rect width="100%" height="100%" style="fill:url(#g);" /></svg>',
				dirs : {
					left: 'x1="0%" y1="0%" x2="100%" y2="0%"',
					right: 'x1="100%" y1="0%" x2="0%" y2="0%"',
					top: 'x1="0%" y1="0%" x2="0%" y2="100%"',
					bottom: 'x1="0%" y1="100%" x2="0%" y2="0%"'
				}
			};
			return function(dir, stops){
				var r = '<linearGradient id="g" '+ grd.dirs[dir] +' spreadMethod="pad">';
				stops.forEach(function(stop) {
					r += '<stop offset="'+stop.offset+'" stop-color="'+stop.color+'" stop-opacity="'+stop.opacity+'"/>';
				});
				r = 'data:image/svg+xml;base64,' + btoa(grd.open + r + grd.close);
				return r;
			};
		})();
		
		//atob btoa polyfill
		;(function () {
			var
			object = typeof window != 'undefined' ? window : exports,
			chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
			INVALID_CHARACTER_ERR = (function () {
				// fabricate a suitable error object
				try {
					document.createElement('$');
				} catch (error) {
					return error;
				}
			}());

			object.btoa || (
				object.btoa = function (input) {
				for (
					// initialize result and counter
					var block, charCode, idx = 0, map = chars, output = '';
					// if the next input index does not exist:
					//   change the mapping table to "="
					//   check if d has no fractional digits
					input.charAt(idx | 0) || (map = '=', idx % 1);
					// "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
					output += map.charAt(63 & block >> 8 - idx % 1 * 8)) {
					charCode = input.charCodeAt(idx += 3 / 4);
					if (charCode > 0xFF)
						throw INVALID_CHARACTER_ERR;
					block = block << 8 | charCode;
				}
				return output;
			});

			object.atob || (
				object.atob = function (input) {
				input = input.replace(/=+$/, '')
					if (input.length % 4 == 1)
						throw INVALID_CHARACTER_ERR;
					for (
						// initialize result and counters
						var bc = 0, bs, buffer, idx = 0, output = '';
						// get next character
						buffer = input.charAt(idx++);
						// character found in table? initialize bit storage and add its ascii value;
						~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
							// and if not first of each 4 characters,
							// convert the first 8 bits to one ascii character
							bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0) {
						// try to find character in table (0-63, not found => -1)
						buffer = chars.indexOf(buffer);
					}
					return output;
			});
		}());
	
		var photoshopG1 = ieG('bottom',[
			{offset:'0%',color:'black', opacity:'1'},
			{offset:'100%',color:'black', opacity:'0'}
		]);
		var normalG2 = ieG('top',[
			{offset:'0%',color:'black', opacity:'1'},
			{offset:'100%',color:'white', opacity:'1'}
		]);
		var hslGrad = ieG('top',[
			{offset:'0%',color:'#FF0000', opacity:'1'},
			{offset:'16.666666666666668%',color:'#FFFF00', opacity:'1'},
			{offset:'33.333333333333336%',color:'#00FF00', opacity:'1'},
			{offset:'50%',color:'#00FFFF', opacity:'1'},
			{offset:'66.66666666666667%',color:'#0000FF', opacity:'1'},
			{offset:'83.33333333333334%',color:'#FF00FF', opacity:'1'},
			{offset:'100%',color:'#FF0000', opacity:'1'}
		]);
			//ieG=0
		//////////////////////////////////////////////////////////////////////
		/////////////////////// color convertion tolls ////////////////////////
		//////////////////////////////////////////////////////////////////////

		function rgbToHex(r, g, b) {
			return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
		}

		function hexToRgba(hex) {
			var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex);
			var opacity = parseInt(result[4], 16);
			opacity = isNaN(opacity) ? 1 : (opacity / 255);
			return result ? [
				parseInt(result[1], 16),
				parseInt(result[2], 16),
				parseInt(result[3], 16),
				opacity
			] : null;
		}

		function rgbToHsl(r, g, b, a){
			r /= 255, g /= 255, b /= 255;
			var max = Math.max(r, g, b), min = Math.min(r, g, b);
			var h, s, l = (max + min) / 2;

			if(max === min){
				h = s = 0; // achromatic
			}else{
				var d = max - min;
				s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
				switch(max){
					case r: h = (g - b) / d + (g < b ? 6 : 0); break;
					case g: h = (b - r) / d + 2; break;
					case b: h = (r - g) / d + 4; break;
				}
				h /= 6;
			}
			a = isNaN(+a) ? 1 : (+a);
			return [h, s, l, a];
		}

		function hue2rgb(p, q, t){
			if(t < 0) t += 1;
			if(t > 1) t -= 1;
			if(t < 1/6) return p + (q - p) * 6 * t;
			if(t < 1/2) return q;
			if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
			return p;
		}

		function hslToRgb(h, s, l, a){
			var r, g, b;

			if(s === 0){
				r = g = b = l; // achromatic
			}else{
				var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
				var p = 2 * l - q;
				r = hue2rgb(p, q, h + 1/3);
				g = hue2rgb(p, q, h);
				b = hue2rgb(p, q, h - 1/3);
			}
			a = a === undefined ? 1 : a
			return [r * 255, g * 255, b * 255,  a];
		}

		function rgbaParts(rgba){
			var parts = rgba.match(/\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,?([^)]+)?\s*/);
			if(parts){
				return parts.slice(1,5);
			}
		}

		function hslaParts(hsla){
			var parts = hsla.match(/hsla?\(([^,]+)\s*,\s*([^%]+)%\s*,\s*([^%]+)%\s*,?\s*([^)]+)?\s*/);
			if(parts){
				parts = parts.slice(1,5);
				parts[0] = parts[0]/360;
				parts[1] = parts[1]/100;
				parts[2] = parts[2]/100;
				parts[3] = isNaN(+parts[3]) ? 1 : +parts[3];
				return parts;
			}else{
				return [0,0,0,0];
			}
		}
		
		function colorToHex(color){
			var hsla = cssColorToHsl(color);
			var rgba = hslToRgb.apply(null, hsla);
			rgba[0] = rgba[0] << 0;
			rgba[1] = rgba[1] << 0;
			rgba[2] = rgba[2] << 0;
			var hex = rgbToHex.apply(null, rgba);
			return hex;			
		}
		
		function cssColorToHsl(color){
			var hsl;
			if(color.charAt(2)==='l'){
				return  hslaParts(color)
			}
			var process = rgbaParts(color);

			if(process){
				hsl = rgbToHsl.apply(null, process);
			}else{
				if(color.length === 3 || color.length === 6 && color.charAt(0) !== '#'){
					color = '#' + color;
				}
				if(color.length === 4){
					var colorPart = color.split('#').pop();
					color += colorPart;
				}
				hsl = rgbToHsl.apply(null, hexToRgba(color));
			}
			return hsl;
		}

		//////////////////////////////////////////////////////////////////////
		///////////////////////////// helpers  ///////////////////////////////
		//////////////////////////////////////////////////////////////////////

		function createColorPickerMarkup(element){
			var html = 
				'<div class="colorpicker-wrapper">' + 
					'<div class="colorpicker-pickers">'+
					  '<div class="colorpicker-lightsat-palete"></div>'+
					  '<div class="colorpicker-color-palete"></div>'+
					  '<div class="colorpicker-opacity-palete colorpicker-opacity-back" style="display:none"></div>'+
					'</div>'+
					'<div class="colorpicker-picker-inputs">'+
						'<label>H</label>'+ '<label class="deg-label">&deg;</label>'+
						'<input type="text" class="colorpicker-hue"/>'+
						'<label>S</label>'+ '<label>%</label>' +
						'<input type="text" class="colorpicker-saturation"/>'+
						'<label>L</label>'+ '<label>%</label>' +
						'<input type="text" class="colorpicker-lightness"/>'+
						'<label style="display:none">Opacity</label>'+
						'<input style="display:none" type="text" class="colorpicker-opacity"/>'+
					'</div>'+
					'<div class="colorpicker-picker-inputs-extra">' + 
						'<label>#</label>'+
						'<input type="text" class="colorpicker-color"/>'+
						'<div class="change-picker-label">Site colors</div>'+
					'</div>' + 
				'</div>'+
				'<div class="colorpicker-picker-selected">'+
				  '<div class="colorpicker-priveuse colorpicker-opacity-back"></div>'+
				  '<div class="colorpicker-current colorpicker-opacity-back"></div>' + 
				'</div>';
			
			if(element.className.indexOf('colorpicker') === -1){
				if(element.className.length===0){
					element.className = 'colorpicker';
				} else{
					element.className += ' colorpicker';
				}
			}
			
			element.innerHTML = html;
		}
		
		function SimpleEvents(ctx, events){
			events = events || {};
			events.call = function(eventName){
				var args = Array.prototype.slice.call(arguments,1);
				events[eventName].forEach(function(handler){
					handler.apply(ctx, args);
				});
			};
			events.on = function(eventName, handler) {
				events[eventName].push(handler);
				return function remove() {
					var i = events[eventName].indexOf(handler);
					if (~i) {
						events[eventName].splice(i, 1);
					}
				}
			};	
			return events;
		}
		
		function getOffset( el ) {
			var _x = 0;
			var _y = 0;
			while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
				_x += el.offsetLeft - el.scrollLeft;
				_y += el.offsetTop - el.scrollTop;
				el = el.offsetParent;
			}
			return { top: _y, left: _x };
		}

		function offsetPosFromEvent(e, target) {
			var offset = getOffset(target);
			var posX = (e.clientX - offset.left) / (target.clientWidth - 1);
			var posY = (e.clientY - offset.top) / (target.clientHeight - 1);
			return {
				x : Math.min(Math.max(posX,0), 1),
				y : Math.min(Math.max(posY,0), 1)
			};
		}

		function createElement(width, height, appendTo) {
			var el = document.createElement('div');
			el.style.cssText = 'width:' + width + ';height:' + height + ';';
			appendTo && appendTo.appendChild(el);
			return el;
		}	
		
		//////////////////////////////////////////////////////////////////////
		/////////////// this chank of code is the real thing /////////////////
		//////////////////////////////////////////////////////////////////////

		var paletes = {
			photoshop : {
				setElement : function (elm, palete, initColor) {
					this.elm = elm;
					this.elm.className += ' ColorPickerPicker ColorPickerPhotoshop';
					this.posIndecator = document.createElement('div');
					this.posIndecator.style.cssText = 'position:absolute;border-radius:50%;width:9px;height:9px;background:transparent;border:2px solid #eee;pointer-events:none;position:relative;'
					this.elm.appendChild(this.posIndecator);
					this.photoshoptIEGradSetup = [{
						offset : '0%',
						color : initColor,
						opacity : '1'
					}, {
						offset : '100%',
						color : 'white',
						opacity : '1'
					}];
					this.render(initColor);
				},
				render : function (color, skipSet) {
					if (!skipSet){
						var pos = this.posFromColor(color);
						this.setPos(pos);
						var hsl = [pos.hue];
						hsl[0] *= 360;
						hsl[1] = 100+'%';
						hsl[2] = 50+'%';
						color = 'hsl(' + hsl.join() + ')';
					}

					if (ieG) {
						this.photoshoptIEGradSetup[0].color = color;
						var photoshopG2 = ieG('left', this.photoshoptIEGradSetup);
						this.elm.style.backgroundImage = 'url("' + photoshopG1 + '"),url("' + photoshopG2 + '")';
					} else {
						this.elm.style.backgroundImage = '-webkit-linear-gradient(bottom, black, rgba(0,0,0,0)),-webkit-linear-gradient(left, ' + color + ', white)';
						this.elm.style.backgroundImage = '-moz-linear-gradient(bottom, black, rgba(0,0,0,0)),-moz-linear-gradient(left, ' + color + ', white)';
					}
				},
				setPos:function(pos){
					this.pos = pos;
					setTimeout(function() {
						var h = parseFloat( getComputedStyle(this.elm).height );
						var w = parseFloat( getComputedStyle(this.elm).width );
						this.posIndecator.style.left = (-6) + pos.x * w  + 'px';
						this.posIndecator.style.top = (-6) + pos.y * h  + 'px';
					}.bind(this),0);
				},
				posFromColor:function(color){
					var hsla = cssColorToHsl(color);
					var x, y, t;
					x = 1 - hsla[1];
					t = ((hsla[2] * 100) + (50 * x) + 50)/50;
					y = t / (x + 1);
					y = 1 - (y-1);				
					if(y < 0){
						x -= y;
						y=0;
					}
					return {x:x,y:y,hue:hsla[0]};
				},
				colorFromPos : function (pos, paletePosY, opacity) {
					this.setPos(pos);
					var h = paletePosY * 360;
					var s = 100 - pos.x * 100;
					var l = (pos.y * -50) + (50 * pos.x) + 50 - (pos.y * pos.x * 50);
					return 'hsla(' + h + ', ' + s + '% , ' + l + '%, '+ opacity +')';
				}
			},
			////////////////////////////////////////////
			single : {
				setElement : function (elm, initColor) {
					this.elm = elm;
					this.elm.className += ' ColorPickerPicker ColorPickerSingle';
					this.render(initColor);
				},
				render : function (color) {
					this.elm.style.backgroundColor = color;
				},
				colorFromPos : function () {
					return this.elm.style.backgroundColor;
				}
			},
			////////////////////////////////////////////
			palete : {
				setElement : function (elm, initColor) {
					this.elm = elm;
					this.elm.className += ' ColorPickerPicker ColorPickerPalete';
					this.elm.style.position = 'relative';
					this.posIndecator = document.createElement('div');
					this.posIndecator.style.cssText = 'position:absolute;width:19px;height:12px;top:0;background:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAMCAYAAAH317YUAAABXUlEQVQokY2SPUiCURSGn2sukqRBSwb9EEU/hF9OESQ1RSH9LK06NgS5WYgYktXW0g+0fC7tBtISmAZBkwoNEg1ORU0mTU23wU/5flR84XDgnPe89773HqijCkgBEClIiQ7SBlQjBYkAEItBeXqZaraFnqrltABcZ0X50+gczAvsQK1q0DaOw8SSLOczmDHtcSGAOBD2Z6TbwtDwFBAmRahGS9aBpGKmwbnmQB8VPU09ybyGtn3DhqmL7FvzyOLOg1R8A9Z7ZT/BDsQnw6ry9Qf3H60NNJS860dqaW4j1JLUo+Xv99xdun9odNczpWATGMLqT2eEwZnQfuwYt9PRgQa5lwL5mwR2U90FpFE2l/eS16yM9XYUaaDsmIWraP0htNqW0x9UVmMpRpz1wnOtKy1+nX2A0aYXyC0cqu7xtVB3Kjrc+q2r0xQNJFS3t81vtEKr9TKLVrCuW7t4/Ac4FWWuJ2UyAAAAAABJRU5ErkJggg==");border:0;left:1px;pointer-events:none;';
					this.elm.appendChild(this.posIndecator);

					var hsla = cssColorToHsl(initColor);
					this.setPos(hsla[0]);
					this.render(initColor);
				},
				setPos:function(pos){
					this.paletePosY = pos;
					setTimeout(function() {
						var h = parseFloat( getComputedStyle(this.elm).height );
						this.posIndecator.style.top = pos * (h - 1) - 6  + 'px';
					}.bind(this),0);
				},
				render : function (color) {
					if (ieG) {
						this.elm.style.backgroundImage = 'url("' + hslGrad + '")';
					} else {
						this.elm.style.backgroundImage = '-webkit-linear-gradient(top, #FF0000, #FFFF00, #00FF00, #00FFFF, #0000FF, #FF00FF, #FF0000)';
						this.elm.style.backgroundImage = '-moz-linear-gradient(top, #FF0000, #FFFF00, #00FF00, #00FFFF, #0000FF, #FF00FF, #FF0000)';
					}
				},
				posFromColor : function (color) {
					var hsl = cssColorToHsl(color);
					return hsl[0];
				},
				colorFromPos : function (pos) {
					this.setPos(pos.y);
					return 'hsla(' + pos.y * 360 + ',100%,50%, 1)';
				},
				hueFormPos : function (pos) {
					this.setPos(pos.y);
					return pos.y * 360;
				}
			},
			////////////////////////////////////////////
			opacity : {
				setElement : function (elm, initColor) {
					this.elm = elm;
					this.elm.className += ' ColorPickerPicker ColorPickerOpacityPalete';
					this.elm.style.position = 'relative';
					this.posIndecator = document.createElement('div');
					this.posIndecator.style.cssText = 'position:absolute;width:100%;height:4px;top:0;left:-1px;background:black;border:1px solid #eee;pointer-events:none;';
					this.elm.appendChild(this.posIndecator);
					this.ieGOpacityGradSetup = [
						{offset:'0%',color: initColor, opacity:'1'},
						{offset:'100%',color:initColor, opacity:'0'}
					];
					this.setColor(initColor);
				},
				setPos:function(pos){
					this.paletePosY = pos;
					setTimeout(function() {
						var h = parseFloat( getComputedStyle(this.elm).height );
						this.posIndecator.style.top = pos * (h - 1) - 3  + 'px';
					}.bind(this),0);

				},
				getOpacity:function(){
					return (1-this.paletePosY);
				},
				setColor:function(color){
					var hsla = cssColorToHsl(color);
					this.setPos(1-hsla[3]);
					this.render(hsla);
				},
				render : function (hsla) {
					var color =  'hsla(' + hsla[0]*360 + ',' + hsla[1]*100 + '%,' + hsla[2]*100 + '%,' + 1 + ')';
					var colorNoOpacity =  'hsla(' + hsla[0]*360 + ',' + hsla[1]*100 + '%,' + hsla[2]*100 + '%,' + 0 + ')';
					if (ieG) {
						this.ieGOpacityGradSetup[0].color = color;
						this.ieGOpacityGradSetup[1].color = color;
						this.elm.style.backgroundImage = 'url("' + ieG('top', this.ieGOpacityGradSetup) + '")';
					} else {
						this.elm.style.backgroundImage = '-webkit-linear-gradient(top, '+color+', '+colorNoOpacity+')';
						this.elm.style.backgroundImage = '-moz-linear-gradient(top, '+color+', '+colorNoOpacity+')';
					}
				},
				posFromColor : function (color) {
					var hsl = cssColorToHsl(color);
					return (1-hsl[3]);
				}
			}
		};
		
		return function (element, initColor, onChangePicker) {
			var drag = false;
			var onselectstart = null;
			var colorPicker = element;
			
			var events = SimpleEvents(colorPicker, {
				oncolorpickerchange: [],
				onpickerclick: [],
				onpaleteclick: [],
				onopacityclick: [],
				onpickermove: [],
				onpaletemove: [],
				onopacitymove: []
			});

			var palete = Object.create(paletes.palete);
			var picker = Object.create(paletes.photoshop);
			var preview = Object.create(paletes.single);
			var result = Object.create(paletes.single);		
			var opacity = Object.create(paletes.opacity);
			
			
			createColorPickerMarkup(colorPicker);		

			palete.setElement(colorPicker.querySelector('.colorpicker-color-palete'),  initColor);
			picker.setElement(colorPicker.querySelector('.colorpicker-lightsat-palete'), palete, initColor);
			opacity.setElement(createElement('100%', '100%', colorPicker.querySelector('.colorpicker-opacity-palete')), initColor);
			preview.setElement(createElement('100%', '100%', colorPicker.querySelector('.colorpicker-current')), initColor);
			result.setElement(createElement('100%', '100%', colorPicker.querySelector('.colorpicker-priveuse')), initColor);
		
			var updateAllInputs = bindToinputs(colorPicker.querySelector('.colorpicker-picker-inputs'), colorPicker.querySelector('.colorpicker-picker-inputs-extra'), initColor);

			colorPicker.addEventListener('mousedown', startDrag, false);
			window.addEventListener('mouseup', stopDrag, false);
			window.addEventListener('mousemove', dragMove, false);

			function updatePicker(target, offset, fireEventName){
				var color;
				if (target === palete.elm) {
					palete.hueFormPos(offset);
					color = picker.colorFromPos(picker.pos, palete.paletePosY, opacity.getOpacity());
					opacity.setColor(color);
					picker.render(palete.colorFromPos(offset), true);
					events.call('onpalete' + fireEventName, color);
				}
				if (target === opacity.elm) {
					//palete.hueFormPos(offset);
					opacity.setPos(offset.y);
					color = picker.colorFromPos(picker.pos, palete.paletePosY, opacity.getOpacity());                
					events.call('onopacity' + fireEventName, color);
				}
				if (target === picker.elm) {
					color = picker.colorFromPos(offset, palete.paletePosY, opacity.getOpacity());
					opacity.setColor(color);
					events.call('onpicker' + fireEventName, color);
				}
				color && events.call('oncolorpickerchange', useHex ? colorToHex(color) : color);
				return color;
			}

			function renderColorPicker(color){
				//picker
				picker.render(color);
				palete.setPos(picker.pos.hue);
				result.render(color);
				preview.render(color);
				opacity.setColor(color);
			}
			
			function bindToinputs(inputs, extra, initColor){
							
				var hueEl = inputs.querySelector('.colorpicker-hue');
				var saturationEl = inputs.querySelector('.colorpicker-saturation');
				var lightnessEl = inputs.querySelector('.colorpicker-lightness');
				var opacityEl = inputs.querySelector('.colorpicker-opacity');
				var colorEl = colorPicker.querySelector('.colorpicker-color');
							
				colorPicker.querySelector('.change-picker-label').onclick = function(){
					onChangePicker && onChangePicker(null);
				};

				updateInputs(initColor);
				
				events.on('oncolorpickerchange', updateInputs);
								
				inputs.addEventListener('change', validateInputs, false);			
				inputs.addEventListener('change', setColorFromInputs, false);
				
				extra.addEventListener('change', validateInputs, false);			
				extra.addEventListener('change', setColorFromInputs, false);
				
				function updateColorElm(rgba){
					if(useHex){
						colorEl.value = rgbToHex(rgba[0], rgba[1], rgba[2]).substr(1);
					} else {
						colorEl.value = 'rgba(' + rgba[0] +',' + rgba[1] +','+ rgba[2] +','+ rgba[3] +')';
					}
				}
				function getColorElValue(){
					return useHex ? '#'+colorEl.value : colorEl.value;
				}
				
				function setColorFromInputs(evt){
					if(evt.target === colorEl){
						try{
							renderColorPicker(colorEl.value);
							result.render(getColorElValue());
							preview.render(getColorElValue());
							return events.call('oncolorpickerchange', getColorElValue());//updateInputs(colorEl.value);
						}catch(err){}
					}
				
					var color =  'hsla(' + hueEl.value + ',' + saturationEl.value + '%,' +  lightnessEl.value + '%,' +  opacityEl.value + ')';
					var rgba = hslToRgb.apply(null, [hueEl.value/360, saturationEl.value/100, lightnessEl.value/100, opacityEl.value]);
					rgba[0] = rgba[0] << 0;
					rgba[1] = rgba[1] << 0;
					rgba[2] = rgba[2] << 0;
					
					updateColorElm(rgba);
					renderColorPicker(colorEl.value);
					result.render(getColorElValue());
					preview.render(getColorElValue());
					events.call('oncolorpickerchange', getColorElValue());
				}
				
				function validateInputs (evt){
					if(evt.target === hueEl){
						evt.target.value = Math.max(Math.min(evt.target.value, 360), 0) || 0;
					}
					if(evt.target === saturationEl || evt.target === lightnessEl){
						evt.target.value = Math.max(Math.min(evt.target.value, 100), 0) || 0
					}
					if(evt.target === opacityEl){
						evt.target.value = Math.max(Math.min(evt.target.value, 1), 0) || 1
					}
				}
				
				function updateInputs(color){
					var hsla = cssColorToHsl(color);
					hueEl.value = (hsla[0] * 360)<<0;
					saturationEl.value = (hsla[1] * 100)<<0 ;
					lightnessEl.value = (hsla[2] * 100)<<0;
					opacityEl.value = Number.prototype.toFixed.call(+hsla[3], 4);
					
					var rgba = hslToRgb.apply(null, hsla);
					rgba[0] = rgba[0] << 0;
					rgba[1] = rgba[1] << 0;
					rgba[2] = rgba[2] << 0;
					//rgbToHex.apply(null, rgba);
					updateColorElm(rgba);
					//colorEl.value = 'rgba(' + rgba[0] +',' + rgba[1] +','+ rgba[2] +','+ rgba[3] +')';
				}	
				
				return updateInputs;
				
			}

			function dragMove(e){
				if(!drag){return;}
				preview.render(updatePicker(drag, offsetPosFromEvent(e, drag), 'move'))
			}
					
			function stopDrag (e) {
				if (drag) {
					document.body.onselectstart = onselectstart;
					var el = drag;
					drag = false;
					var color = updatePicker(el, offsetPosFromEvent(e, el), 'click')
					result.render(color);
					preview.render(color);
				}
			}
			
			function startDrag (e) {
				onselectstart = document.body.onselectstart || null;
				document.body.onselectstart = function(){ return false; }//setAttribute('onselectstart' ,'return false');
				drag = e.target;
				
				var color = updatePicker(drag, offsetPosFromEvent(e, drag), 'click');
				preview.render(color);
			}

			return {
				on: events.on,
				elm : colorPicker,
				setColor : function(color){
					renderColorPicker(color);
					updateAllInputs(color);
					return this;
				},			
				getColor : function () {
					return result.colorFromPos();
				},            
				isVisible: function(){
					return colorPicker.style.display !== 'none';
				},
				hide : function () {
					colorPicker.style.display = 'none';
					return this;
				},
				show : function (parent) {
					colorPicker.style.display = 'block';
					parent && parent.appendChild(colorPicker);
					return this;
				}
			};
		};
	})();

	//////////////////////////////////////////////////////////////////////
	////////////////////// this is how to use it /////////////////////////
	//////////////////////////////////////////////////////////////////////
	//var colorPicker2 = ColorPicker(colorBoxPicker/*document.querySelector('.colorpicker')*/, '#888888');	

	function createColorPalete(options){
		
		var selectedColorNode = {};
		
		var colorPaleteInstance = {
			elm: colorPalete,
			hide: function(){
				colorPalete.style.display = 'none';
			},
			show: function(){
				colorPalete.style.display = 'block';
			},
			getColor: getValue,
			setColor: function(color){
				var colorNode = filterColorNode(function(colorNode){
					var tname = colorNode.$dataColor.reference;
					return tname && (tname === color.reference || tname === color || color === colorNode.$dataColor.value);
				}, true);	
				colorPaleteInstance.removeSelection();
				if(colorNode){
					setColor(colorNode);
				}
			},
			removeSelection: function(){
				selectedColorNode.className = 'simple-color-node';
				selectedColorNode = {};
			}
		};
		
		var colorPaleteInnerWrapper = document.createElement('div');
		colorPaleteInnerWrapper.className = 'colorpicker-wrapper';

			
		var changePickerLabel = document.createElement('div');
		changePickerLabel.className = 'change-picker-label';
		changePickerLabel.innerHTML = 'All colors';
		
		var colorPalete = document.createElement('div');
		colorPalete.className = 'colorpicker simple-color-palete';
		colorPalete.style.width = options.width || 'auto';
		colorPalete.style.height = options.height || 'auto';
		
		var y=-1, x=0;
		for(var i = 0; i < options.paleteColors.length;i++){
			x = i % 5;
			x = x * 5;
			y += x === 0 ? 1 : 0;
			colorPaleteInnerWrapper.appendChild(createColorNode(options.paleteColors[x+y], 'simple-color-node'));		
		}
		
		options.primColors.forEach(function(color){
			colorPaleteInnerWrapper.appendChild(createColorNode(color, 'simple-color-node prim-color'));		
		});
		
		colorPaleteInnerWrapper.appendChild(changePickerLabel);
		colorPalete.appendChild(colorPaleteInnerWrapper);
		options.parent.appendChild(colorPalete);
		
		colorPalete.onclick = function(evt){
			if(evt.target === colorPalete){ return }
			if(evt.target.className.indexOf('simple-color-node') !== -1 && evt.target.className.indexOf('color-node-selected') === -1){
				setColor(evt.target);
				options.onchange && options.onchange.call(null,getValue());
			}
		};
		
		if(options.selected){
			colorPaleteInstance.setColor(options.selected);
		}
		
		function setColor(colorNode){
			selectedColorNode.className = 'simple-color-node';
			selectedColorNode = colorNode;//evt.target;
			selectedColorNode.className += ' color-node-selected';
		}
		
		changePickerLabel.onclick = function(){
			options.onchangepicker && options.onchangepicker.call();
		}
		
		function createColorNode(color, className){
			var colorNode = document.createElement('div');
			colorNode.className = className;
			colorNode.style.background = color.value;
			colorNode.$dataColor = color;
			return colorNode;
		}
		
		
		function getValue(){
			return selectedColorNode.$dataColor;
		}
		
		function filterColorNode(fn, isOneRes){
			var child;
			var f = [];
			for(var i = 0; i < colorPaleteInnerWrapper.children.length; i++){
				child = colorPaleteInnerWrapper.children[i];
				if(child.className.indexOf('simple-color-node') !== -1){
					if(fn(child)){
						if(isOneRes){
							return child;
						}
						f.push(child);
					}
				}
			}
			return isOneRes ? null : f;
		}
		
		
		
		return colorPaleteInstance;
	}

	function createColorBox(options){
		var cb = {};
		
		createColorBox.instances = createColorBox.instances || [];
		
		var picerInstance = {
			showSimplePicker:showSimplePicker,
			showAdvancePicker:showAdvancePicker,
			hidePickers:hidePickers,
			showPickers:showPickers,
			setColor: function(color){
				var colorFromTheme = findReferanceName(color);
				if(colorFromTheme){
					cb.colorPalete.setColor(colorFromTheme.reference);	
					cb.colorPicker.setColor(colorFromTheme.value);
					setBoxInnerColor(colorFromTheme.value, colorFromTheme);
				} else {
					cb.colorPalete.setColor(color);	
					cb.colorPicker.setColor(color);
					setBoxInnerColor(color, false);					
				}
			},
			getColor: function(){
				return cb.colorPicker.getColor();
			},
			getColorObject: function(){
				return cb.colorObject;
			}
		}
		
		
		function initialize(){
			markup();
	
			cb.colorPicker = ColorPicker(cb.colorBoxPicker, options.color, showSimplePicker);
			
			cb.colorPicker.on('oncolorpickerchange', function(color){
				cb.colorPalete.removeSelection();
				setBoxInnerColor(color, false);
				options.onchange && options.onchange(color);
			});
				
			cb.colorPalete = createColorPalete({
				width: '182px',
				parent: cb.wrapper,
				selected: color ? color : null,
				onchangepicker: function(){
					showAdvancePicker();
				},
				onchange: function(color){
					cb.colorPicker.setColor(color.value);
					setBoxInnerColor(color.value, color);
					options.onchange && options.onchange(color);
				},
				paleteColors: options.paleteColors || [],
				primColors: options.primColors || []
			});
			
			
			showSimplePicker();
			
			var color = findReferanceName(options.color);
			color ? setBoxInnerColor(color.value, color) : setBoxInnerColor(options.color, false);
			
			hidePickers();	
			createOkCancelBtns();
			bindEvents();

			createColorBox.instances.push(picerInstance);
			return picerInstance;
		}
		
		function findReferanceName(ref){
			if(!ref){
				return false
			}
			for(var i =0; i < options.primColors.length;i++){
				if(options.primColors[i].reference === ref){
					return options.primColors[i];
				}
			}
			for(var i =0; i < options.paleteColors.length;i++){
				if(options.paleteColors[i].reference === ref){
					return options.paleteColors[i];
				}
			}
			return false;
		}
		
		function markup(){
			createArrow();
			createWrapper();
			
			cb.colorBox = options.element || document.createElement('div');
			
			cb.wrapper.style.position = 'absolute';
			
			cb.colorBoxPicker = document.createElement('div');
			cb.colorBoxInner = document.createElement('div');
			cb.colorBoxInnerArrow = document.createElement('div');

			cb.colorBoxPicker.className = 'colorpicker';
			cb.colorBox.className = 'color-box';
			cb.colorBoxInner.className = 'color-box-inner';
			cb.colorBoxInnerArrow.className = 'color-box-inner-arrow';
			
			cb.wrapper.appendChild(cb.colorBoxPicker);
			cb.colorBox.appendChild(cb.colorBoxInner);
			cb.colorBox.appendChild(cb.colorBoxInnerArrow);
			cb.colorBox.appendChild(cb.wrapper);
			cb.colorBox.appendChild(cb.wrapperArrow);
			
			options.parent && options.parent.appendChild(cb.colorBox);
		}
		
		function createOkCancelBtns(){
			cb.okBtn = document.createElement('button');
			cb.cancelBtn = document.createElement('button');
			
			cb.okBtn.innerHTML = 'OK';
			cb.cancelBtn.innerHTML = 'Cancel';
			
			cb.okBtn.onclick = function(){
				picerInstance.hidePickers();
			}
			
			cb.cancelBtn.onclick = function(){
				if(picerInstance.getColorObject() || picerInstance.getColor() !== cb.openedColor){
					picerInstance.setColor(cb.openedColor);
					options.onchange && options.onchange(cb.openedColor);	
				}
				picerInstance.hidePickers();
			}
			
			cb.okBtn.className = 'btn blue';
			cb.okBtn.style.cssText = 'float: right; margin: 0 10px 0 0;';
			
			cb.cancelBtn.className = 'btn gray';
			cb.cancelBtn.style.cssText = 'float: left; margin: 0 0 10px 10px;';
			
							
			cb.wrapper.appendChild(cb.cancelBtn);
			cb.wrapper.appendChild(cb.okBtn);
		}
		
		function createArrow(){
			cb.wrapperArrow = document.createElement('div');
			var a1 = document.createElement('div');
			var a2 = document.createElement('div');
			cb.wrapperArrow.className = 'picker-arrow-right';
			a1.className = 'picker-arrow-one';
			a2.className = 'picker-arrow-two';
			cb.wrapperArrow.appendChild(a1);
			cb.wrapperArrow.appendChild(a2);	
		}
		
		function createWrapper(headerText){
			cb.wrapper = document.createElement('div');
			cb.wrapperHeader = document.createElement('header');
			cb.wrapperHeaderText = document.createElement('span');
			cb.wrapperCloseBtn = document.createElement('div');
			
			cb.wrapperCloseBtn.className = 'picker-close-btn';
			cb.wrapper.className = 'picker-wrapper';
			cb.wrapperHeader.className = 'picker-wrapper-header';
			
			cb.wrapper.appendChild(cb.wrapperHeader);
			cb.wrapperHeader.appendChild(cb.wrapperHeaderText);
			cb.wrapperHeader.appendChild(cb.wrapperCloseBtn);
			
		}
		
		function bindEvents(){
					
			window.addEventListener('click', function(){
				hidePickers();
			}, false);
			
			cb.colorBox.onclick = function(evt){
				evt.stopPropagation && evt.stopPropagation();
				evt.prevetDefault && evt.prevetDefault();		
				if(evt.target === cb.colorBox || evt.target === cb.colorBoxInner || evt.target === cb.colorBoxInnerArrow || evt.target === cb.wrapperCloseBtn){
					if(isPickersVisible()){
						hidePickers();		
					} else {
						showPickers();
						var side = setBestPosition(cb.wrapper , cb.colorBox);
						cb.wrapperArrow.className = 'picker-arrow-' + side;
					}
				}
				return false;
			}
		
		}
		
		function hideAllOpenPickers(){
			createColorBox.instances.forEach(function(colorPicker){
				colorPicker.hidePickers();
			});
		}
		
		function saveOpendColor(){			
			cb.openedColor = options.isParamConected ? (picerInstance.getColorObject() || picerInstance.getColor()) : picerInstance.getColor();
		}
		
		function showSimplePicker(){
			cb.wrapperHeaderText.innerHTML = 'Site Colors';
			cb.colorPicker.hide();
			cb.colorPalete.show();
		}
		
		function showAdvancePicker(){
			cb.wrapperHeaderText.innerHTML = 'All Colors';
			cb.colorPalete.hide();
			cb.colorPicker.show();
		}
		
		function hidePickers(){
			enableTextSelection();
			cb.wrapper.style.display = 'none';
			cb.wrapperArrow.style.display = 'none';
		}
		
		function showPickers(){
			saveOpendColor();
			hideAllOpenPickers();
			disableTextSelection();
			cb.wrapper.style.display = 'block';
			cb.wrapperArrow.style.display = 'block';
		}
		
		function isPickersVisible(){
			return cb.wrapper.style.display !== 'none';
		}
		
		function setBestPosition(pickerNode, relativeTo){
			var side = 'left';
			var right = 'auto';
			var distanceFromBox = 14;
			var topMoveTranslate = -5;
		
			var pickerWidth = pickerNode.clientWidth;
			var pickerHeight = pickerNode.clientHeight;
			
			var elmWidth = relativeTo.clientWidth;
			var elmHeight = relativeTo.clientHeight;
			
			var top = (elmHeight/2 - pickerHeight/2);
			var left = elmWidth + distanceFromBox;
			
			var offset = getOffset(relativeTo);
			
			if((elmWidth + pickerWidth + offset.left + distanceFromBox + 1) > window.innerWidth){
				left = 0 - pickerWidth - distanceFromBox;
				right = elmWidth + distanceFromBox;
				side = 'right';
			}
				
			var rightOver = (offset.left - (pickerWidth + distanceFromBox + 1));
			if(side === 'right' && rightOver < 0){
				top = 0 - (pickerHeight + distanceFromBox);
				right -= (rightOver + pickerWidth/2);
				side = 'top';
			}
			
			
			if((offset.top - pickerHeight/2 ) < 0){
				top -= offset.top - pickerHeight/2 - topMoveTranslate;
			}
			
			if(side !== 'top' && (elmHeight + offset.top + pickerHeight/2 ) > window.innerHeight){
				top -= (elmHeight + offset.top + pickerHeight/2) - window.innerHeight;
			}
			
			pickerNode.style.top = top + 'px';
			pickerNode.style.left = (side === 'right' || side === 'top') ? 'auto' : left + 'px';
			pickerNode.style.right = (side === 'right' || side === 'top') ? right + 'px' : 'auto';
			
			return side;
		}
			
		function setBoxInnerColor(color, colorObject){
			if(color.indexOf('rgba') !== -1){
				color = color.replace(/,\s*\d+\.?\d*\s*\)/,')').replace('rgba','rgb');
			}
			cb.colorBoxInner.style.background = color;
			if(options.isParamConected){
				colorObject ? showSimplePicker() : showAdvancePicker();
			}
			cb.colorObject = colorObject;
		}
				
		function getOffset(el) {
			var _x = 0;
			var _y = 0;
			while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
				_x += el.offsetLeft - el.scrollLeft;
				_y += el.offsetTop - el.scrollTop;
				el = el.offsetParent;
			}
			return { top: _y, left: _x };
		}
		
		function disableTextSelection(){
			disableTextSelection.onselectstart = document.onselectstart || null;
			disableTextSelection.onmousedown = document.onmousedown || null;
			document.onmousedown = document.onselectstart = function(evt) { 
				if(evt.target.tagName.toLowerCase() === 'input' || evt.ctrlKey){
					return true;
				}
				return false; 
			}
		}
		
		function enableTextSelection(){
			document.onselectstart = disableTextSelection.onselectstart || null;
			document.onmousedown = disableTextSelection.onmousedown || null;
			disableTextSelection.onselectstart = null;
			disableTextSelection.onmousedown = null;
		}
		
		return initialize();
		
	}

		return createColorBox;

}());;(function ($, window, document, undefined) {
	'use strict';

	var pluginName = 'ColorPickerWithOpacity';

	var defaults = {
		startWithColor : '#000'
	};

	var names = {
	};

	function ColorPickerWithOpacity(element, options) {
		this.options = $.extend({}, defaults, options);
		this.$el = $(element);		
		this.options.isParamConected = (this.$el.attr('wix-param') || this.$el.attr('data-wix-param'));
		this.init();
	}

	ColorPickerWithOpacity.prototype.init = function () {
		this.markup();
		this.setValue(this.options.startWithColor);
		this.bindEvents();
	};
	
	ColorPickerWithOpacity.prototype.getPlugins = function () {
		return {
			colorPicker: this.$ColorPicker.data('plugin_ColorPicker'),
			slider: this.$Slider.data('plugin_Slider')
		};
	};
	
	ColorPickerWithOpacity.prototype.colorChangedInInnerPlugins = function (whatChanged, event, value) {
		this.$el.trigger(pluginName + '.change', {
			color: this.getPlugins().colorPicker.getColorObject(),
			opacity: this.getPlugins().slider.getValue() / 100,
			rgba: this.getValue()
		});
	};
	
	ColorPickerWithOpacity.prototype.bindEvents = function () {
		this.$ColorPicker.on('ColorPicker.change', this.colorChangedInInnerPlugins.bind(this, 'color'));
		this.$Slider.on('Slider.change', this.colorChangedInInnerPlugins.bind(this, 'opacity'));
	};
	
	ColorPickerWithOpacity.prototype.markup = function () {
		this.$el.addClass('picker-with-opacity');
		this.$ColorPicker = $('<div>').ColorPicker(this.options);
		this.$Slider = $('<div>').Slider({
			preLabel: '0',
			postLabel: '100',
			value: 100
		});
		this.$el.append(this.$ColorPicker, this.$Slider);
	};

	function extractOpacityFromColor(value){
		var opacity =1;
		value = $.trim(value);
		if(value.charAt(0) === '#'){
			opacity = 1;
		} else if(value.indexOf('rgba') === 0 || value.indexOf('hsla')===0){
			opacity = value.match(/,([^),]+)\)/);
			opacity = (opacity ? (+opacity[1]) : 1);
		} else if(value.indexOf('rgb') === 0){
			opacity = 1;
		}
		return opacity;
	}
	
	function extractColorFromValue(value){
		var color;
		value = $.trim(value);
		if(value.charAt(0) === '#'){
			color = value;
		} else if(value.indexOf('rgba') === 0){
			color = value.replace('rgba','rgb').replace(/,([^),]+)\)/,')');
		} else if(value.indexOf('rgb') === 0){
			color = value;
		}else{
			color = value;
		}
		return color;
	}
	
	ColorPickerWithOpacity.prototype.setValue = function (value) {
		var opacity = 100;
		var color = '#000';
		var plugs = this.getPlugins();
		if(value && typeof value === 'object'){
			//if(plugs.colorPicker.isParamConected){
				color = (value.color && value.color.reference) ? value.color.reference : (value.rgba || value.cssColor);
				opacity = (value.opacity || extractOpacityFromColor(color)) * 100;
			//}else {
			//	color = (value.cssColor || value.rgba);
			//	opacity = (value.opacity || extractOpacityFromColor(color)) * 100;
			//}
		} else if(typeof value === 'string'){
			color = extractColorFromValue(value);
			opacity = extractOpacityFromColor(color) * 100;
		}
		
		plugs.slider.setValue(opacity);
		plugs.colorPicker.setValue(color);
		
	};
	
	ColorPickerWithOpacity.prototype.getValue = function () {
		var plugs = this.getPlugins();
		
		var rgbString = plugs.colorPicker.getValue();
		var sliderValue = plugs.slider.getValue() / 100;
		
		if(rgbString.indexOf('rgba')===0){
			return rgbString.replace(/,\s*([\d\.]+)\s*\)/, ', '+ sliderValue + ')');
		} else {
			return rgbString.replace(/rgb/, 'rgba').replace(')', ', ' + sliderValue + ')');
		}
	};

	$.fn[pluginName] = function (options) {
		return this.each(function () {
			if (!$.data(this, 'plugin_' + pluginName)) {
				$.data(this, 'plugin_' + pluginName, new ColorPickerWithOpacity(this, options));
			}
		});
	};

})(jQuery, window, document);
;(function ($, window, document, undefined) {
	"use strict";

	var pluginName = 'ColorPicker';

	var defaults = {
		startWithColor : "#897185",
	};
	
	var defaultColors = ['#50FAFE', '#FFFFFF', '#0088CB', '#ED1C24', '#FFCB05',
            '#CECECE', '#9C9C9C', '#6C6C6C', '#484848', '#242424', '#C4EEF6', '#A5E1ED',
            '#59CEE5', '#3B8999', '#1D444C', '#FFFDFD', '#999999', '#666666', '#444444', '#000000', '#E4A3B8',
            '#CA748F', '#AF1A49', '#751131', '#3A0818', '#D5E7A6', '#B8CF78', '#8EB71D', '#5E7A13', '#2F3D09'];
	
	defaultColors = defaultColors.map(function(o,i){
		return {value:o, reference:'color-'+i};
	});

	// The actual plugin constructor
	function Plugin(element, options) {
		this.$el = $(element);
		this.options = $.extend({}, defaults, options);
		this.isParamConected = options.isParamConected || (this.$el.attr('wix-param') || this.$el.attr('data-wix-param'));
		var siteColors = this.isParamConected ? (Wix.Settings.getSiteColors() || defaultColors) : defaultColors;
		var that = this;

		this.picker = createColorBox({
			element: element,
			color: this.options.startWithColor,
			isParamConected: this.isParamConected,
			primColors:siteColors.slice(0,5),
			paleteColors: siteColors.slice(5),
			onchange: this.changeEventHandler.bind(this)
		});
	}
	
	Plugin.prototype.changeEventHandler = function(color){
		var that = this;
		clearTimeout(this.$timeoutTicket);
		this.$timeoutTicket = setTimeout(function(){					
			var data = {
				cssColor: color
			};
			if(typeof color === 'string'){
				
			} else if (color && typeof color === 'object'){
				data.color = color;
				data.cssColor = color.value;
				if(!that.isParamConected){
					delete data.color;
				}
			}
			that.$el.trigger(pluginName + '.change', data);
		},10);
	};
	
	Plugin.prototype.getValue = function(){
		return this.picker.getColor();
	};
	
	Plugin.prototype.getColorObject = function(){
		return this.picker.getColorObject();
	};
	
	Plugin.prototype.setValue = function(color){
		var colorFromTheme;
		try{
			if(this.isParamConected && typeof color==='string'){
				colorFromTheme = Wix.Settings.getColorByRefrence(color);
			} else if(this.isParamConected && color.color.reference){
				colorFromTheme = color.color;
			}
			colorFromTheme = colorFromTheme.reference;
		}catch(err){}
		this.picker.setColor(colorFromTheme || color.cssColor || color.rgba || color);
	};
	
	$.fn[pluginName] = function (options) {
		return this.each(function () {
			if (!$.data(this, 'plugin_' + pluginName)) {
				$.data(this, 'plugin_' + pluginName,
					new Plugin(this, options));
			}
		});
	};

	$.fn[pluginName].Constructor = Plugin;

})(jQuery, window, document);
;(function ($, window, document, undefined) {
	'use strict';

var pluginName = 'Dropdown';

var defaults = {
	slideTime : 150,
	selected: 0,
	autoCloseTime : 5000
};
var names = {
	valueAttrName : 'data-value',
	indexAttrName : 'data-index',
	dropDownClassName : 'dropdown',
	activeClassName : 'focus-active',
	optionInitSelector : 'option',
	optionInitValueAttrName : 'value',
	optionClassName : 'option',
	optionsClassName : 'options',
	selectedClassName : 'selected',
	highlightClassName : 'dropdown-highlight',
	iconClassName: 'dropdown-icon'
};

var optionsCSS = {
	width : '100%',
	position : 'absolute',
	top : '100%',
	zIndex : '999999'
};

var dropdownCSS = {
	position : 'relative'
};

function DropDown(element, options) {
	this.options = $.extend({}, defaults, options);
	this.$selected = null;
	this.$options = null;
	this.$el = $(element);
	this.isOpen = false;
	this.isActive = false;
	this.init();
}
DropDown.prototype.init = function () {
	this.markup();
	this.setValue(this.options.selected);
	this.bindEvents();
	this.hideOptions(0);
};

DropDown.prototype.markup = function () {
	var $el = this.$el.addClass(names.dropDownClassName);//.css(dropdownCSS);
	var $options = this.$el.find(names.optionInitSelector).map(function (index) {
			var $option = $('<div>')
				.attr(names.valueAttrName, this.getAttribute(names.optionInitValueAttrName))
				.attr(names.indexAttrName, index)
				.addClass(names.optionClassName)
				.text(this.textContent);
				
			var iconUrl = this.getAttribute('data-icon');
			
			if(iconUrl){
				$option.prepend('<img src="'+iconUrl+'" class="'+names.iconClassName+'"/>');
			}		
			return $option;
		}).toArray();

	this.$selected = $('<div>').addClass(names.selectedClassName);
	this.$options = $('<div>').addClass(names.optionsClassName).append($options).css(optionsCSS);
	this.$el.empty();
	this.$el.append(this.$selected, this.$options);
		
};

DropDown.prototype.setValue = function (value) {
	var $option;
	if (typeof value === 'number') {
		$option = this.$options.find('[' + names.indexAttrName + '="' + value + '"]').eq(0);
	} else if (typeof value === 'string') {
		$option = this.$options.find('[' + names.valueAttrName + '="' + value + '"]').eq(0);
	} else if (value instanceof jQuery) {
		$option = value;
	}
	if ($option.length && this.getIndex() !== $option.attr(names.indexAttrName)) {
		this.$selected.empty();
		this.$selected.append($option.clone(true).addClass('current-item').removeClass(names.highlightClassName));
		return true;
	}
	return false;
};

DropDown.prototype.setValueFromEl = function ($el) {
	var index = +$el.attr(names.indexAttrName);
	if(this.setValue(index)){
		var value = $el.attr(names.valueAttrName);
		this.$el.trigger(pluginName + '.change', value);		
	}
};

DropDown.prototype.setActiveMode = function (isActive) {
	this.isActive = isActive;
	if (isActive) {
		this.$el.addClass(names.activeClassName);
	} else {
		this.$el.removeClass(names.activeClassName);
	}
};

DropDown.prototype.getValue = function () {
	return this.$selected.find('.' + names.optionClassName).attr(names.valueAttrName);
};

DropDown.prototype.getIndex = function () {
	return this.$selected.find('.' + names.optionClassName).attr(names.indexAttrName);
};

DropDown.prototype.hideOptions = function (time) {
	this.isOpen = false;
	this.$options.slideUp(time !== undefined ? time : this.options.slideTime);
};

DropDown.prototype.showOptions = function (time) {
	var $el = this.$options.find('[' + names.indexAttrName + '="' + this.getIndex() + '"]').eq(0);
	this.isOpen = true;
	this.highlightOption($el);
	this.$options.slideDown(time !== undefined ? time : this.options.slideTime);
};

DropDown.prototype.toggleOptions = function (time) {
	return this.isOpen ? this.hideOptions(time) : this.showOptions(time);
};

DropDown.prototype.highlightOption = function ($el) {
	if ($el.length) {
		this.$options.find('.' + names.highlightClassName).removeClass(names.highlightClassName);
		$el.addClass(names.highlightClassName);
	}
};

DropDown.prototype.bindAutoClose = function (closeDelay) {
	var fold;
	var dropdown = this;

	this.$el.hover(function () {
		clearTimeout(fold);
	}, function () {
		clearTimeout(fold);
		if (dropdown.isOpen) {
			fold = setTimeout(function () {
					if (dropdown.isOpen) {
						dropdown.setActiveMode(false);
						dropdown.hideOptions();
					}
				}, closeDelay);
		}
	});
};

DropDown.prototype.bindEvents = function () {
	var dropdown = this;

	if (this.options.autoCloseTime) {
		this.bindAutoClose(this.options.autoCloseTime);
	}

	this.$options.on('mouseenter', '.' + names.optionClassName, function () {
		dropdown.highlightOption($(this));
	});

	this.$options.on('click', '.' + names.optionClassName, function () {
		dropdown.setValueFromEl($(this));
	});

	this.$el.on('click', function (evt) {
		evt.stopPropagation();
		dropdown.setActiveMode(true);
		dropdown.toggleOptions();
	});
	
	this.$el.on('mousedown', function (evt) {
		evt.stopPropagation();
	});
	
	$(window).on('mousedown', function (evt) {
		dropdown.hideOptions();
		dropdown.setActiveMode(false);
	});
	
	$(window).on('keydown', function (evt) {
		var $el, dir;
		if (dropdown.isActive) {

			if (evt.which === 13) {
				dropdown.toggleOptions();
				evt.preventDefault();
			}

			if (evt.which === 27) {
				dropdown.hideOptions();
				dropdown.setActiveMode(false);
				evt.preventDefault();
			}

			if (evt.which === 38 || evt.which === 40) {
				$el = dropdown.$options
                    .find('[' + names.indexAttrName + '="' + dropdown.getIndex() + '"]')
					.eq(0);
                dir = evt.which === 38 ? 'prev' : 'next';
                $el = $el[dir]('.' + names.optionClassName);
				dropdown.highlightOption($el);
				dropdown.setValueFromEl($el);
				evt.preventDefault();
			}

		}
	});
};

	$.fn[pluginName] = function (options) {
		return this.each(function () {
			if (!$.data(this, 'plugin_' + pluginName)) {
				$.data(this, 'plugin_' + pluginName, new DropDown(this, options));
			}
		});
	};


})(jQuery, window, document);
;(function ($, window, document) {
	'use strict';

	var pluginName = 'GluedControl';

	function Plugin(element, options) {
		this.state = {
			horizontalMargin : 0,
			verticalMargin : 0,
			placement : 'TOP_LEFT'
		};

		var defaults = _getDefaults();

		this.$el = $(element);
        this.createControlHTML();
        if (options.bindToWidget) {
            this.initWithBinding(defaults, options);
        } else {
            this.init(defaults, options);
        }
	}

    Plugin.prototype.init = function (defaults, options) {
        _setUserEvents(defaults, options);

        this.options = $.extend({}, defaults, options);
	
		this.slider = this.createSlider(this.options.slider);		
		this.dropdown = this.createDropDown(this.options.dropdown);
    }

	Plugin.prototype.initWithBinding = function (defaults, options) {
		var plugin = this;
		getPlacement(function (state) {		
            $.extend(plugin.state, state);
            $.extend(defaults.slider, _getSliderEvents(plugin.state));
			plugin.options = $.extend({}, defaults, options);			
			plugin.slider = plugin.createSlider(plugin.options.slider);

			$.extend(plugin.options.dropdown, _getDropdownEvents(plugin.state, plugin.slider));
			plugin.dropdown = plugin.createDropDown(plugin.options.dropdown);			
		});
	};

	Plugin.prototype.createSlider = function(options){
		options.value = this.state[getPlacementOrientation(this.state)] || 0;
		this.$slider = this.$el.find('.glued-slider');
		return this.$slider.Slider(options).data('plugin_Slider');
	};
	
	Plugin.prototype.createDropDown = function(options){
		options.visibleRows = this.options.placements.length;

		this.$dropdown = this.$el.find(".glued-dropdown")
			.html(this.dropdownHTML())
			.find('select')
			.msDropDown(options);

		return this.$dropdown.data('dd');
	};

	Plugin.prototype.createControlHTML = function () {
        this.$el.append('<div class="glued-dropdown"></div>' +
            '<div class="divider gluedDivider"></div>' +
            '<div class="glued-slider"></div>');
    }

	Plugin.prototype.dropdownHTML = function () {

		var placements = this.options.placements;
		if (placements.length === 0) {
			placements = ['TOP_LEFT', 'TOP_CENTER', 'TOP_RIGHT', 'CENTER_LEFT', 'CENTER_RIGHT', 'BOTTOM_LEFT', 'BOTTOM_CENTER', 'BOTTOM_RIGHT'];
		}

		function getOption(value, imageSpriteData, title) {
			return '<option value="' + value + '" data-image="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" data-imagecss="positionIcons ' + imageSpriteData + '" selected="selected">' + title + '</option>';
		}

		var options = placements.map(function (value) {
				var imageSpriteData,
				text;

				switch (value) {
				case 'TOP_LEFT':
					imageSpriteData = 'topLeft';
					text = 'Top Left';
					break;
				case 'TOP_RIGHT':
					imageSpriteData = 'topRight';
					text = 'Top Right';
					break;
				case 'BOTTOM_RIGHT':
					imageSpriteData = 'bottomRight';
					text = 'Bottom Right';
					break;
				case 'BOTTOM_LEFT':
					imageSpriteData = 'bottomLeft';
					text = 'Bottom Left';
					break;
				case 'TOP_CENTER':
					imageSpriteData = 'top';
					text = 'Top';
					break;
				case 'CENTER_RIGHT':
					imageSpriteData = 'right';
					text = 'Right';
					break;
				case 'BOTTOM_CENTER':
					imageSpriteData = 'bottom';
					text = 'Bottom';
					break;
				case 'CENTER_LEFT':
					imageSpriteData = 'left';
					text = 'Left';
					break;
				}

				return getOption(value, imageSpriteData, text);
			}).join('\n');

		return '<p>Select the position for your widget</p><select name="positionSelection" class="positionSelection">' + options + '</select>';
	}

	$.fn[pluginName] = function (options) {
		return this.each(function () {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName,
					new Plugin(this, options));
			}
		});
	};

	$.fn[pluginName].Constructor = Plugin;

	function setPlacement(state) {
		Wix.Settings.setWindowPlacement(
			Wix.Utils.getOrigCompId(),
			state.placement,
			state.verticalMargin,
			state.horizontalMargin);
	}

	function updateSliderPlacement(state, sliderPlugin, placement) {
		sliderPlugin.enable();
		sliderPlugin.$el.removeClass(getPlacementOrientation(state));
		state.placement = placement
		sliderPlugin.setValue(0, true);
		if (getPlacementOrientation(state) === 'other') {
			sliderPlugin.disable();
		} else {
			sliderPlugin.$el.addClass(getPlacementOrientation(state));
		}

	}

	function getPlacementOrientation(state) {
		if (state.placement === 'TOP_CENTER' || state.placement === 'BOTTOM_CENTER') {
			return 'horizontalMargin';
		} else if (state.placement === 'CENTER_RIGHT' || state.placement === 'CENTER_LEFT') {
			return 'verticalMargin';
		} else {
			return 'other';
		}
	}

	function getPlacement(cb) {
		Wix.Settings.getWindowPlacement(Wix.Utils.getOrigCompId(), cb);
	}

    function _getDefaults() {
        return {
            placements : [],
            slider : {
				width:158,
				className:'',
                minValue : -2,
                maxValue : 2,
				value : 0
            },
            dropdown : {
				visibleRows:8,
				on:{}
			}
        };
    }

    function _getDropdownEvents(state, slider) {
        return {
			on:{
				create : function() {
					this.setIndexByValue(state.placement);
				},
				change : function(evt) {
					updateSliderPlacement(state, slider, evt.value);
                    setPlacement(state);
				}
			}
        };
    }
	
	//Ribbon for Glued 
	function createRibbon(slider){
		
		var elWidth = slider.$el.width();

		slider.$center = $('<div class="uilib-slider-back">');
		slider.$leftLine = $('<div class="uilib-slider-back">');
		slider.$rightLine = $('<div class="uilib-slider-back">');

		slider.$leftLine.css({
			left:elWidth/4,
			background:'rgba(0,0,0,0.13)',
			width:1
		}).prependTo(slider.$el);

		slider.$center.css({
			left:elWidth/2 - 1,
			background:'rgba(0,0,0,0.2)'
		}).prependTo(slider.$el);

		slider.$rightLine.css({
			left:(elWidth/4)*3,
			background:'rgba(0,0,0,0.13)',
			width:1
		}).prependTo(slider.$el);

		slider.$ribbon = $('<div class="uilib-slider-back">').prependTo(slider.$el);
	}
	function updateRibbon(slider, val){
		var pinWidth = slider.$pin.width() / 2;
		var elWidth = slider.$el.width() / 4;
		var w, range;
		
		if(val > 1){
			range = (val - 1);
			w = elWidth * range;
			slider.$ribbon.css({
				width:elWidth - w + range * pinWidth,
				right:0,
				left:'auto',
				borderRadius: '0 8px 8px 0'
			});
		}

		if(val >= 0 && val <= 1){
			w = elWidth * (val);
			slider.$ribbon.css({
				width:w,
				right:'auto',
				left:elWidth * 2,
				borderRadius:0
			});
		}

		if(val < -1){
			range = ((val * -1) - 1);
			w = elWidth * range;
			slider.$ribbon.css({
				width: (elWidth - w) + range * pinWidth,
				left:0,
				right:'auto',
				borderRadius: '8px 0 0 8px'
			});
		}

		if(val < 0 && val >= -1){
			w = elWidth * ((val * -1));
			slider.$ribbon.css({
				width: w,
				right:elWidth * 2,
				left:'auto',
				borderRadius:0
			});
		}


	}
	
    function _getSliderEvents(state) {
        return {
            create : function () {
                createRibbon(this);
				
                if (getPlacementOrientation(state) === 'other') {
                    this.$el.addClass('disabled');
                } else {
                    this.$el.addClass(getPlacementOrientation(state));
                }
            },
            slide : function(val) {
				state[getPlacementOrientation(state)] = val;
				setPlacement(state);
				updateRibbon(this, val);
            }
        };
    }

    function _setUserEvents(defaults, options) {
       
		defaults.slider.create = function(){
			createRibbon(this);
			if (typeof options.sliderCreate === 'function') {
				options.sliderCreate.apply(this, arguments);
			}
		}

		defaults.slider.slide = function(val){
			updateRibbon(this, val);	
			if (typeof options.sliderChange === 'function') {
				options.sliderChange.apply(this, arguments);
			}
		}

        if (typeof options.dropDownChange === 'function') {
            defaults.dropdown.on.change = options.dropDownChange;
        }
        if (typeof options.dropDownCreate === 'function') {
            defaults.dropdown.on.create = options.dropDownCreate;
        }
    }

})(jQuery, window, document);
;(function ($, window, document) {
    'use strict';

    var pluginName = 'Radio';
    var defaults = {
		radioBtnGroupClassName:'rb-radio-group',
		radioBtnClassName:'rb-radio',
		checkClassName:'rb-radio-check',
		checkedClassName: 'rb-radio-checked',
		radioValueAttrName:'data-radio-value',
		inline:false,
		checked: 0
	};

    // The actual plugin constructor
    function Plugin(element, options) {
        this.$el = $(element);
        this.options = $.extend({}, defaults, options);
		this.radioGroup = null;
        this.init();
    }

    Plugin.prototype.init = function() {		
		if(!this.$el.hasClass(this.options.radioBtnGroupClassName)){
			this.$el.addClass(this.options.radioBtnGroupClassName);
		}
		this.radioGroup = this.$el
			.find('['+this.options.radioValueAttrName+']')
			.addClass('uilib-text')
			.addClass(this.options.radioBtnClassName)
			.addClass(this.options.inline ? 'uilib-inline' : '')
			.prepend('<span class="'+ this.options.checkClassName +'"></span>');
			
		this.setValue(this.options.checked);
		
		this.bindEvents();

	};
	
	Plugin.prototype.bindEvents = function () {
		var that = this;
		this.$el.on('click', '.'+this.options.radioBtnClassName, function (e) {
            that.checkRadio($(this));
		});		
	}
	
	Plugin.prototype.getValue = function () {
		var $el = this.$el.find('.' + this.options.checkedClassName);
		return {
			value : $el.attr(this.options.radioValueAttrName),
			index : this.radioGroup.index($el)
		};
	}
	
	Plugin.prototype.setValue = function (value) {
		var $el;
		if(typeof value === 'object'){
			value = value.index;
		}
		if(typeof value === 'string'){
			$el = this.$el.find('['+ this.options.radioValueAttrName +'="'+ value +'"]').eq(0);
		} else if (+value >= 0) {
			$el = this.radioGroup.eq(+value);
		}
		$el.length && this.checkRadio($el, true);
	}

	
    Plugin.prototype.checkRadio = function ($el, silent) {
		if ($el.hasClass(this.options.checkedClassName)) { return; }
		this.radioGroup.removeClass(this.options.checkedClassName);
		$el.addClass(this.options.checkedClassName);
		if(!silent){
			$el.trigger(pluginName + '.change', this.getValue());
		}
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);;/*! Copyright (c) 2013 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.1.3
 *
 * Requires: 1.2.2+
 */

(function (factory) {
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var toFix = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'];
    var toBind = 'onwheel' in document || document.documentMode >= 9 ? ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'];
    var lowestDelta, lowestDeltaXY;

    if ( $.event.fixHooks ) {
        for ( var i = toFix.length; i; ) {
            $.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
        }
    }

    $.event.special.mousewheel = {
        setup: function() {
            if ( this.addEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.addEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = handler;
            }
        },

        teardown: function() {
            if ( this.removeEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.removeEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = null;
            }
        }
    };

    $.fn.extend({
        mousewheel: function(fn) {
            return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
        },

        unmousewheel: function(fn) {
            return this.unbind("mousewheel", fn);
        }
    });


    function handler(event) {
        var orgEvent = event || window.event,
            args = [].slice.call(arguments, 1),
            delta = 0,
            deltaX = 0,
            deltaY = 0,
            absDelta = 0,
            absDeltaXY = 0,
            fn;
        event = $.event.fix(orgEvent);
        event.type = "mousewheel";

        // Old school scrollwheel delta
        if ( orgEvent.wheelDelta ) { delta = orgEvent.wheelDelta; }
        if ( orgEvent.detail )     { delta = orgEvent.detail * -1; }

        // New school wheel delta (wheel event)
        if ( orgEvent.deltaY ) {
            deltaY = orgEvent.deltaY * -1;
            delta  = deltaY;
        }
        if ( orgEvent.deltaX ) {
            deltaX = orgEvent.deltaX;
            delta  = deltaX * -1;
        }

        // Webkit
        if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY; }
        if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = orgEvent.wheelDeltaX * -1; }

        // Look for lowest delta to normalize the delta values
        absDelta = Math.abs(delta);
        if ( !lowestDelta || absDelta < lowestDelta ) { lowestDelta = absDelta; }
        absDeltaXY = Math.max(Math.abs(deltaY), Math.abs(deltaX));
        if ( !lowestDeltaXY || absDeltaXY < lowestDeltaXY ) { lowestDeltaXY = absDeltaXY; }

        // Get a whole value for the deltas
        fn = delta > 0 ? 'floor' : 'ceil';
        delta  = Math[fn](delta / lowestDelta);
        deltaX = Math[fn](deltaX / lowestDeltaXY);
        deltaY = Math[fn](deltaY / lowestDeltaXY);

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }

}));;(function ($, window, document, undefined) {
    'use strict';
		
    var pluginName = 'SlimScrollBar',
    defaults = {
            // width in pixels of the visible scroll area
            width : 'auto',
            // height in pixels of the visible scroll area
            height : '250px',
            // width in pixels of the scrollbar and rail
            size : '7px',
            // scrollbar color, accepts any hex/color value
            color: '#000',
            // scrollbar position - left/right
            position : 'right',
            // distance in pixels between the side edge and the scrollbar
            distance : '1px',
            // sets scrollbar opacity
            opacity : .4,
            // sets visibility of the rail
            railVisible : true,
            // sets rail color
            railColor : '#333',
            // sets rail opacity
            railOpacity : .2,
            // defautlt CSS class of the slimscroll rail
            railClass : 'slimScrollRail',
            // defautlt CSS class of the slimscroll bar
            barClass : 'slimScrollBar',
            // defautlt CSS class of the slimscroll wrapper
            wrapperClass : 'slimScrollDiv',
            // check if mousewheel should scroll the window if we reach top/bottom
            allowPageScroll : false,
            // scroll amount applied to each mouse wheel step
            wheelStep : 20,
            // scroll amount applied when user is using gestures
            touchScrollStep : 200,
            minBarHeight: 30
    };

    // The actual plugin constructor
    function Plugin(element, options) {
        this.$el = $(element);
        this.options = $.extend({}, defaults, options);
		this.percentScroll = 0;
		this.lastScroll = undefined;
        this.markup();
        this.registerEvents();
        this.updateDisplay();
    };
	Plugin.prototype.scrollContent = function (y, isWheel, isJump) {
		
	}
	Plugin.prototype.scrollContent = function (y, isWheel, isJump) {
		var delta = y;
		var maxTop = this.$el.outerHeight() - this.$bar.outerHeight();

		if (isWheel) {
			// move bar with mouse wheel
			delta = parseInt(this.$bar.css('top')) + y * parseInt(this.options.wheelStep) / 100 * this.$bar.outerHeight();

			// move bar, make sure it doesn't go out
			delta = Math.min(Math.max(delta, 0), maxTop);

			// if scrolling down, make sure a fractional change to the
			// scroll position isn't rounded away when the scrollbar's CSS is set
			// this flooring of delta would happened automatically when
			// bar.css is set below, but we floor here for clarity
			delta = (y > 0) ? Math.ceil(delta) : Math.floor(delta);

			// scroll the scrollbar
			this.$bar.css({
				top : delta + 'px'
			});
		}

		// calculate actual scroll amount
		this.percentScroll = parseInt(this.$bar.css('top')) / (this.$el.outerHeight() - this.$bar.outerHeight());
		delta = this.percentScroll * (this.$el[0].scrollHeight - this.$el.outerHeight());

		if (isJump) {
			delta = y;
			var offsetTop = delta / this.$el[0].scrollHeight * this.$el.outerHeight();
			offsetTop = Math.min(Math.max(offsetTop, 0), maxTop);
			this.$bar.css({
				top : offsetTop + 'px'
			});
		}

		// scroll content
		this.$el.scrollTop(delta);

		// fire scrolling event
		this.$el.trigger('slimscrolling', ~~delta);

	}
	
    Plugin.prototype.markup = function() {

        var divS = '<div></div>';

        // wrap content
        var wrapper = $(divS)
            .addClass(this.options.wrapperClass)
            .css({
                position: 'relative',
                overflow: 'hidden',
                width: this.options.width,
                height: this.options.height
            });

        // update style for the div
        this.$el.css({
            overflow: 'hidden',
            width: this.options.width,
            height: this.options.height
        });

        // create scrollbar rail
        this.$rail = $(divS)
            .addClass(this.options.railClass)
            .css({
                width: this.options.size,
                height: '100%',
                position: 'absolute',
                top: 0,
                display: 'block',
                'border-radius': this.options.size,
                background: this.options.railColor,
                opacity: this.options.railOpacity,
                zIndex: 999998
            });

        // create scrollbar
        this.$bar = $(divS)
            .addClass(this.options.barClass)
            .css({
                background: this.options.color,
                width: this.options.size,
                position: 'absolute',
                top: 0,
                opacity: this.options.opacity,
                display: 'block',
                'border-radius' : this.options.size,
                BorderRadius: this.options.size,
                MozBorderRadius: this.options.size,
                WebkitBorderRadius: this.options.size,
                zIndex: 999999
            });

        // set position
        var posCss = (this.options.position == 'right') ? { right: this.options.distance } : { left: this.options.distance };
        this.$rail.css(posCss);
        this.$bar.css(posCss);

        // wrap it
        this.$el.wrap(wrapper);

        // append to parent div
        this.$el.parent().append(this.$bar);
        this.$el.parent().append(this.$rail);
    };

    Plugin.prototype.updateDisplay = function() {
        var display;
        // hide scrollbar if content is not long enough
		var barHeight = Math.max((this.$el.outerHeight() / this.$el[0].scrollHeight) * this.$el.outerHeight(), this.options.minBarHeight);
		barHeight = isFinite(barHeight) ? barHeight : parseInt(this.options.height, 10);
        if (barHeight >= this.$el.outerHeight()) {
            display =  'none';
        } else {
            display =  'block';
        }

        this.$bar.css({height:barHeight, display: display});
        this.$rail.css({display: display})
    };

    Plugin.prototype.registerEvents = function(){

        var plugin = this;
        var timeout;
        var $bar = this.$bar;
        var $rail = this.$rail;

        function callLaterToUpdateImages(time){
            clearTimeout(timeout);
            timeout = setTimeout(function(){
                plugin.$el.trigger('stopscrolling');
            }, time);
        }

        function doNothing(){return false}
				
		$(document.body).on('uilib-update-scroll-bars', function(){
			//plugin.getBarHeight();
			plugin.updateDisplay();
		});	
		
        this.$el.mousewheel(function(evt, delta){

            if ($bar.css('display') === 'none') return;

            var speed = 10;
            var initPos = $bar.position().top;
            var pos = initPos - (delta * speed);
            var rh = $rail.height();
            var bh = $bar.height();

            pos = Math.min(pos, rh - bh);
            pos = Math.max(0, pos);
            $bar.css({
                top: pos
            });
            plugin.scrollContent(0, $bar.position().top, false);
            callLaterToUpdateImages(200);

            evt.preventDefault();
        });

        this.$rail.on('click',function(evt){
            var rh = $rail.height();
            var bh = $bar.height();
            var initPos = $bar.position().top;
            var pos;
            if (initPos > evt.offsetY) {
                pos = Math.max(0, evt.offsetY);
            } else {
                pos = Math.min(evt.offsetY - bh, rh - bh);
            }

            $bar.css({
                top: pos
            });
            plugin.scrollContent(0, $bar.position().top, false);
            callLaterToUpdateImages(200);
        });



        this.$bar.on('mousedown', function(evt){

            document.body.focus();

            $(document).on('selectstart', doNothing);

            var initY = evt.clientY;
            var initPos = $bar.position().top;
            var rh = $rail.height();
            var bh = $bar.height();

            function mousemove_handler(evt){
                var currentY = evt.clientY - initY + initPos;

                var pos = Math.min(currentY, rh - bh);
                pos = Math.max(0, pos);
                $bar.css({
                    top: pos
                });
                plugin.scrollContent(0, $bar.position().top, false);
            }

            function mouseup_handler(evt){
                $(window).off('mousemove',mousemove_handler);
                $(window).off('mouseup',mouseup_handler);
                //TODO make an addEventListener
                $(document).off('selectstart', doNothing);

                callLaterToUpdateImages(200);
            }
            $(window).on('mousemove', mousemove_handler);
            $(window).on('mouseup', mouseup_handler);

        });

        // support for mobile
        this.$el.bind('touchstart', function(e,b){
            if (e.originalEvent.touches.length)
            {
                // record where touch started
                this._touchDif = e.originalEvent.touches[0].pageY;
            }
        });

        this.$el.bind('touchmove', function(e){
            // prevent scrolling the page
            e.originalEvent.preventDefault();
            if (e.originalEvent.touches.length)
            {
                // see how far user swiped
                var diff = (this._touchDif - e.originalEvent.touches[0].pageY) / this.options.touchScrollStep;
                // scroll content
                this.scrollContent(diff, true);
            }
        });
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                    new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);;;(function ($, window, document, undefined) {

	var pluginName = 'Slider';

	var defaults = {
		minValue : 0,
		maxValue : 100,
		value : 0,
		width : 80,
		preLabel:'',
		postLabel:'',
		className: 'default-uilib-slider-ui',
		slide : function () {},
		create : function () {}
	};

	function Plugin(element, options) {
		this.$el = $(element);
		this.options = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}

	Plugin.prototype.init = function () {
		this.markup();
		this.registerEvents();
		this.options.create.call(this);
		this.setValue(this.options.value);
	};

	Plugin.prototype.markup = function () {
		var leftOffset = this.$el.css('left');
		var style = {
			width : this.options.width
		};
		
		if(!this.$el.hasClass('uilib-slider')){
			this.$el.addClass('uilib-slider');
		}
		
		if(this.options.preLabel){
			this.$el.prepend('<span class="uilib-text uilib-slider-preLabel">' + this.options.preLabel + '</span>');
			style.left = 14;
		}
		
		this.$pin = $('<div>');
		this.$el.append(this.$pin);
		
		if(this.options.postLabel){
			this.$el.append('<span class="uilib-text uilib-slider-postLabel">' + this.options.postLabel + '</span>');
		}
		
		
		this.$el.addClass('uilib-slider').css(style).addClass(this.options.className);
		
		this.$pin.addClass('uilib-slider-pin');
		this.$pin.width(19);
	};

	Plugin.prototype.disableTextSelection = function (evt) {
		document.body.focus();
		//prevent text selection in IE
		document.onselectstart = function () { return false; };
        //evt.target.ondragstart = function() { return false; };
	};
	
	Plugin.prototype.enableTextSelection = function () {
		document.onselectstart = null;
	};
		
	Plugin.prototype.registerEvents = function () {
		var $body = $(window);
		var slider = this;
		//this.$el.on('click', function(evt){
		    //slider.setValueFromEvent(slider.getXFromEvent(evt));
		//});
		this.$pin.on('mousedown', function (evt) {
			slider.currentPos = slider.$pin.position().left;
			slider.startDragPos = evt.pageX;
			slider.disableTextSelection(evt);
			function mousemove_handler(evt) {
				slider.setPosition(evt);
			}
			function mouseup_handler(evt) {
				slider.enableTextSelection();
				$body.off('mousemove', mousemove_handler);
				$body.off('mouseup', mouseup_handler);
				slider.$el.trigger(pluginName + '.change', slider.getValue());
			}
			$body.on('mousemove', mousemove_handler);
			$body.on('mouseup', mouseup_handler);
		});
	};

	Plugin.prototype.setPosition = function (evt) {
		if (this.isDisabled()) { return; }
		var x = evt.pageX - this.startDragPos;
		var pos = this.currentPos + x;
		var width = this.$el.width() - this.$pin.width();
		if (pos < 0) { pos = 0; }
		if (pos > width) { pos = width; }
		this.options.value = this.transform(pos / width);
		this.setValue(this.options.value);
		this.startDragPos = evt.pageX;
		this.currentPos = pos;
	};

	Plugin.prototype.update = function () {
		this.$pin.css({
			left : this.options.value * (this.$el.width() - this.$pin.width())
		});
		return this;
	};

	Plugin.prototype.getValue = function () {
		return this.transform(this.options.value);
	};

	Plugin.prototype.transform = function (valueInRange) {
		return this.options.minValue + valueInRange * (this.options.maxValue - this.options.minValue);
	};

	Plugin.prototype.valueInRangeToInnerRange = function (value) {
		value = value < this.options.minValue ? this.options.minValue : value;
		value = value > this.options.maxValue ? this.options.maxValue : value;
		return (value - this.options.minValue) / (this.options.maxValue - this.options.minValue);
	};

	Plugin.prototype.setValue = function (valueInRange) {
		var val;
		this.options.value = this.valueInRangeToInnerRange(valueInRange);
		if (this.options.value !== this.last_value) {
			this.last_value = this.options.value;
			val = this.getValue();
			this.$el.trigger('slide', val);
			this.options.slide.call(this, val);
		}
		return this.update();
	};

	Plugin.prototype.disable = function () {
		this.$el.addClass('disabled');
	};

	Plugin.prototype.enable = function () {
		this.$el.removeClass('disabled');
	};

	Plugin.prototype.isDisabled = function () {
		return this.$el.hasClass('disabled');
	};
	
    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
            }
        });
    };


})(jQuery, window, document);
;(function (exports){

	var model = createModel();
	var styleModel = createModel();
	
	exports.UI = {
		initialize: initialize,
		initializePlugin:initializePlugin,
		initStyleMigration: initStyleMigration,
		set: model.setAndReport,
		get: model.get,
		toJSON: model.toJSON,
		onChange: model.onChange
	};
		
	function log(){
		var args = ['<ui-lib>'];
		args.push.apply(args,arguments);
		false && console.log.apply(console, args);
	}
	

    function initialize(initialValues, onModelChange) {
    	var $rootEl = $('body'); //$('[wix-uilib],[data-wix-uilib]');
    	if ($rootEl.length > 1) {
    		throw new Error('You have more then one wix-uilib element in the DOM.');
    	}
    	applyPremiumItems($rootEl);
    	
		model.setInitialValues(initialValues);
    	onModelChange && model.onChange('*', onModelChange);
		
		initStyleModelHandling();		
		
    	var elements = $rootEl.find('[data-wix-controller], [wix-controller], [wix-ctrl], [data-wix-ctrl]');
    	for (var i = 0; i < elements.length; i++) {
    		try {
    			initializePlugin(elements[i]);
    		} catch (err) {
    			console.log && console.log(err.message);
    		}
    	}
							
		if(styleModel.applyStyleMigration){
			styleModel.applyStyleMigration();
		}

    	$rootEl.fadeIn(140);
    }
	
	function getVendorProductId() {
		try {
			var inst = window.location.search.match(/instance=([^&]+)/);
			return JSON.parse(atob(inst[1].split('.')[1])).vendorProductId || null;
		} catch (err) {
			return null;
		}
	}
	
	function applyPremiumItems($rootEl){
		var $premium = $rootEl.find('[wix-premium],[data-wix-premium]');
		var $notPremium = $rootEl.find('[wix-not-premium], [data-wix-not-premium]');
		var isPremium = getVendorProductId();
		if(isPremium){
			$premium.show();
			$notPremium.remove();
		} else {
			$premium.remove();
			$notPremium.show();
		}		
	}
	
	function getAttribute(element, attr) {
		var val = element.getAttribute(attr);
		if (!val) {
			val = element.getAttribute('data-' + attr);
		}
		return val;
	}
	
    function initializePlugin(element) {
        var ctrl = getAttribute(element, 'wix-controller') || getAttribute(element, 'wix-ctrl') ;
		var ctrlName = getCtrlName(ctrl);
		var options = getOptions(element, ctrl);
		applyPlugin(element, ctrlName, options);        
    }
	
	function applyPlugin(element, pluginName, options) {
		pluginName = fixPluginName(pluginName);
		if ($.fn[pluginName]) {
			log('initilizing ' + pluginName, options);
			$(element)[pluginName](options);
		} else {
			console.error('Plugin ' + pluginName + ' is not exsist');
		}
		setUpStyleParams(element, pluginName);
		setUpModel(element, pluginName);
	}

	function setUpStyleParams(element, pluginName){
		var wixStlyeParam = getAttribute(element, 'wix-param');
		if(wixStlyeParam){
			styleModel.bindKeyToPlugin(element, pluginName, wixStlyeParam);
		}
	}
	
	function setUpModel(element, pluginName){
		var wixModel = getAttribute(element, 'wix-model');
		if(wixModel){
			model.bindKeyToPlugin(element, pluginName, wixModel);	
		}
	}
	
	function evalOptions(options){
		 try{
			return (new Function('return '+ options + ';'))()
		 }catch(e){
			throw new Error('Options for plugin is not valid: ' + options);
		 }
	}
	
	function fixPluginName(pluginName){
		return pluginName;
	}
	
	function getOptions(element, ctrl){
		var options = getOptionsFormCtrl(ctrl);
		if (!options) {
			options = getAttribute(element, 'wix-options');
		}			
		return evalOptions(options) || {};
	}
	
    function getOptionsFormCtrl(ctrl) {
		var index = ctrl.indexOf(':');
        if (index !== -1) {
            return ctrl.substr(index + 1);
        }
		return false;
    }

    function getCtrlName(ctrl) {
		var index = ctrl.indexOf(':');
        if (index !== -1) {
            return ctrl.substr(0, index);
        }
		return ctrl;
    }
	
	function createModel() {
		var model = {
			props : {},
			handlers : [],
			reporters : {},
			isReporting : true,
			get : function (modelKey) {
				if (!model.props.hasOwnProperty(modelKey)) {
					throw new Error('There is no "' + modelKey + '" in this model. try to define "wix-model" in your markup.');
				}
				return model.props[modelKey];
			},
			set : function (modelKey, value, silent, report, plugin) {
				var ignoreSet = false;
				if (!model.props.hasOwnProperty(modelKey)) {
					throw new Error('There is no "' + modelKey + '" in this model. try to define "wix-model" in your markup.');
				}
				if(value && value._model_ignore_set_){
					delete value._model_ignore_set_;
					ignoreSet = true;
				}
				var oldValue = model.props[modelKey];
				if (oldValue !== value) {
					model.props[modelKey] = value;
					if (!silent) {
						model.trigger(modelKey, value);
					}
					if(ignoreSet){return}
									//if(report){
					model.triggerReporters(modelKey, value, plugin);
									//}
				}
			},
			setAndReport : function (modelKey, value) {
				model.set(modelKey, value, false, true);
			},
			setInitialValues : function (initialValues) {
				$.extend(model.props, initialValues);
			},
			bindKeyToPlugin : function (element, pluginName, modelKey) {
				var $el = $(element);
				var plugin = $el.data('plugin_' + pluginName);
				if (!plugin) {
					throw new Error('wix-model is not supported in this plugin "' + pluginName + '"')
				}
				var initValue = model.props[modelKey];
				if (initValue !== undefined) {
					plugin.setValue && plugin.setValue(initValue);
				} else {
					initValue = plugin.getValue ? plugin.getValue() : undefined;
					model.props[modelKey] = initValue;
				}
				$el.on(pluginName + '.change', function (e, data) {
					model.set(modelKey, data, false, false, plugin);
				});
				model.reporters[modelKey] = model.reporters[modelKey] || [];
				function setValueFromReport(value) {
					plugin.setValue && plugin.setValue(value);
				}
				setValueFromReport.plugin = plugin;
				model.reporters[modelKey].push(setValueFromReport);
			},
			onChange : function (key, fn) {
				if (typeof fn !== 'function') {
					throw new Error(key + ': You must provide fn as handler to the Model change event.');
				}
				model.handlers.push({
					fn : fn,
					key : key
				});
			},
			trigger : function (modelKey, value) {
				for (var i = 0; i < model.handlers.length; i++) {
					try {
						var handler = model.handlers[i];
						if (handler.key === '*' || handler.key === modelKey) {
							handler.fn.call(model, value, modelKey);
						}
					} catch (err) {
						setTimeout(function () {
							throw err;
						}, 0);
					}
				}
			},
			triggerReporters : function (modelKey, value, plugin) {
				if (!model.isReporting) {
					return;
				}
				var reportes = this.reporters[modelKey];
				for (var i = 0; i < reportes.length; i++) {
					var reporter = reportes[i];
					if(reporter.plugin === plugin){
						continue;
					}
					try {
						reporter.call(model, value, modelKey);
					} catch (err) {
						setTimeout(function () {
							throw err;
						}, 0);
					}
				}
			},
			toJSON : function () {
				return $.extend({}, model.props);
			}
		};
		
		return model;

	}
	
	
	/////////////////////////////////////////////////
	/////////////////////STYLE///////////////////////
	/////////////////////////////////////////////////

	function initStyleModelHandling(){
		if(window.Wix){
		
			var style = Wix.Settings.getStyleParams();
			
			if(!styleModel.applyStyleMigration){
				var styles;
				try{
					styles = flatenStyles(style);
				}catch(err){
					setTimeout(function(){
						throw err
					},0)
					styles = {};
				}
				styleModel.setInitialValues(styles);
				
			}
			
			styleModel.onChange('*', function(value, name){
				if(value instanceof Number || typeof value === 'number'){
					Wix.Settings.setNumberParam(name, {value:value});
				} else if(Object.prototype.toString.call(value).match('Boolean')){
					Wix.Settings.setBooleanParam(name, {value:value});
				} else if(value && (value.hasOwnProperty('color') || value.cssColor || value.rgba)) {
					Wix.Settings.setColorParam(name, {value:value});
				}
			});
		}
	}
	
	function initStyleMigration(initValues){
		styleModel.applyStyleMigration = function(){
			for(var key in initValues){
				if(initValues.hasOwnProperty(key)){
					styleModel.set(key, initValues[key]);
				}
			}		
		}
	}
	
	function flatenStyles(style){
		style = style || {};
		var mergedStlye = {};
		//when there will be more types we should merge them
		for(var prop in style.colors){
			if(style.colors.hasOwnProperty(prop)){
				if(style.colors[prop].themeName && style.colors[prop].value.indexOf('rgba')===0){
				
					var opacity = style.colors[prop].value.match(/,([^),]+)\)/);
					opacity = (opacity ? (+opacity[1]) : 1);
				
					mergedStlye[prop] = {
						color : {
							reference : style.colors[prop].themeName,
							value : style.colors[prop].value
						},
						rgba : style.colors[prop].value,
						opacity : opacity
					};
				}else{
					mergedStlye[prop] = style.colors[prop].themeName || style.colors[prop].value;
				}
			}
		}
		for(var prop in style.numbers){
			if(style.numbers.hasOwnProperty(prop)){
				mergedStlye[prop] = style.numbers[prop];
			}
		}
		for(var prop in style.booleans){
			if(style.booleans.hasOwnProperty(prop)){
				mergedStlye[prop] = style.booleans[prop];
			}
		}
		return mergedStlye;
	}
	/////////////////////////////////////////////////
	/////////////////////////////////////////////////
	/////////////////////////////////////////////////
	
	
})(window.Wix || window);

