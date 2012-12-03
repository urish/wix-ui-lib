(function ($, window, document, undefined) {
    "use strict";

    var pluginName = 'makeColorPicker',

        defaults = {
            colorPickerTypes: {
                "Simple": "SimpleColorPicker",
                "Advanced": "AdvancedColorPicker"
            },

            colorPickerTabs: {
                "Simple": "Site colors",
                "Advanced": "All colors"
            },

            preview: "<span id=\"originalColor\"></span><span id=\"selectedColor\"></span>",
            actions: "<button id=\"cancelSelection\" class=\"btn btn-mini\">Cancel</button><button id=\"selectColor\" class=\"btn btn-mini btn-primary\">OK</button>"
        };

    // The actual plugin constructor
    function Plugin(element, options) {
        this.$el = $(element);

        this.options = $.extend({}, defaults, options);

        this.options = $.extend({}, this.options, {
            title: "Color Picker",
            html: true,
            content: '<div id="colorPicker"></div>',
            template: '<div class="popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"></div></div></div>'
        });

        this._defaults = defaults;
        this._name = pluginName;

        this.init("popover", this.$el, this.options);

        this.createColoredElm();

        this.$el.hover(
            function() {
                this.$el.addClass('over');
            }.bind(this),

            function() {
                this.$el.removeClass('over');
            }.bind(this)
        );

        this.$el.click( function() {
            this.$el.removeClass('over');
        }.bind(this));

    }

    Plugin.prototype = $.extend({}, $.fn.popover.Constructor.prototype, {

        constructor: Plugin,

        _data: {},

        createColoredElm : function () {
            this.$el.append($ ('<div class="inner"></div>'));
        },

        toggle: function(ev) {
            var $tip = this.tip();
            !($tip.hasClass('in')) ? this.show() :  this.hide();
            this.$el.toggleClass('active');
            this.$el.toggleClass('up');
        },

        setContent: function() {
            var $tip = this.tip();
            var title = this.getTitle(),
                content = this.getContent();

            $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
            $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content)

            this.startColorPicker($tip.find('#colorPicker'));

            $tip.removeClass('fade top bottom left right in')
        },

        startColorPicker: function(node) {
            this.options.node = node;

            this.createContainers();
            this.renderColorPickers();
            this.renderButtons();
            this.bindEvents();
            this.showFirstPicker();
            this.renderPreview();
        },

        createContainers: function() {
            var opt = this.options;

            this.createTabs();

            this.paletteContainer = $('<div>', { id: "palettes" })
                .appendTo(opt.node);

            this.preview = $('<div>', { id: "preview" })
                .appendTo(opt.node)
                .html(opt.preview);

            this.actions = $('<div>', { id: "actions" })
                .appendTo(opt.node);
        },

        createTabs: function() {
            if (Object.keys(this.options.ColorPickers).length > 1) {
                var tabs = $('<div>', { id:"tabs" });
                this._hasTabs = true;
                this.options.node.append(tabs);
            }
        },

        renderPreview: function () {
            var color = this.$el.find('.inner').css('background-color');
            this.options.node.find("#originalColor").css('background-color', color);
            this.options.node.find("#selectedColor").css('background-color', color);
        },

        renderColorPickers: function() {
            $.each(this.options.ColorPickers, function(picker) {
                var pickerName = this.options.colorPickerTypes[picker];
                var pickerOptions = this.options.ColorPickers[picker];

                pickerOptions.wrapperId = "colorpicker_" + new Date().getTime();
                pickerOptions.initColor =  this.$el.find('.inner').css('background-color');

                if (this._hasTabs) {
                    $('<button>', {})
                        .html(this.options.colorPickerTabs[picker])
                        .addClass('btn btn-mini')
                        .appendTo(this.options.node.find('#tabs'))
                        .bind('click', { pickerId: pickerOptions.wrapperId, self: this }, this.onTabSelect);
                }

                var pickerWrapper = $('<div>', { id: pickerOptions.wrapperId })
                    .appendTo(this.options.node.find('#palettes'));

                pickerWrapper[pickerName](pickerOptions);
                pickerWrapper.hide();

                this._data[picker] = {
                    options: pickerOptions,
                    view: this.$el
                };

            }.bind(this));
        },

        onTabSelect: function(ev) {
            if ($(ev.target).hasClass('active')) {
                return;
            }

            var pickers = $('#palettes').children();

            $.each(pickers, function(picker) {
                $(pickers[picker]).hide()
            }.bind(this));

            $('#tabs').find('.active').removeClass('active');
            $(ev.target).addClass('active');
            $('#' + ev.data.pickerId).fadeIn();
        },

        renderButtons: function() {
            $('<button>', { id: "selectColor" })
                .html(this.options.actions)
                .find('button').addClass('btn btn-large')
                .appendTo(this.actions);
        },

        bindEvents: function() {
            $(document).bind("colorChanged", this.onColorChange.bind(this));

            this.actions.find('#cancelSelection').click(function() {
                this.$el.removeClass('active');
                this.$el.removeClass('up');
                this.hide();
            }.bind(this));

            this.actions.find('#selectColor').click(function() {
                var $tip = this.tip();
                var selectedColor = this.preview.find('#selectedColor').data('selected');
                this.$el.find(".inner").css("background-color", selectedColor);
                this.hide();
                this.$el.removeClass('active');
                this.$el.removeClass('up');
            }.bind(this));
        },

        onColorChange: function(ev, data) {
            var selected = this.preview.find('#selectedColor');
            selected.css('background-color', data);
            selected.data('selected', data);
        },

        showFirstPicker: function() {
            $(this.paletteContainer.children()[0]).show();
            $(this.options.node.find('#tabs').children()[0]).addClass('active');
        }
    });

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