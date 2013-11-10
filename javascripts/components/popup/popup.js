(function ($, window, document, undefined) {
	"use strict";

	var pluginName = 'Popup';

	function Popup(el, options) {
		this.options = $.extend(Popup.deafults, options);
		this.el = el;
		this.transclude();
		this.markup();
		this.close();
		this.setContent(this.options.content);
		this.setFooter(this.options.footer);
		this.setTitle(this.options.title);
		this.setPosition();
		this.bindEvents();
	}

	Popup.deafults = {
		parent:'body',
		title : 'Popup',
		content : '<p>No Content</p>',
		footer : '<button class="btn close-popup">Close</button>',
		modal : false,
		modalBackground : 'rgba(0,0,0,0.5)',
		height : 'auto',
		width : 300,
		onclose : function () {}
	};

	Popup.prototype.transclude = function () {
		var $el = $(this.el);
		$el.remove();
		var headerContent = $el.find('.popup-header').text();
		var contentContent = $el.find('.popup-content').html();
		var footerContent = $el.find('.popup-footer').html();
		if($.trim(headerContent)){
			this.options.title = headerContent;
		}
		if($.trim(contentContent)){
			this.options.content = contentContent;
		}
		if($.trim(footerContent)){
			this.options.footer = footerContent;
		}
	};
	
	Popup.prototype.markup = function () {
		this.popup = this.el;

		this.modal = document.createElement('div');

		this.header = document.createElement('header');
		this.headerTitle = document.createElement('span');
		this.closeBtn = document.createElement('div');

		this.content = document.createElement('div');

		this.footer = document.createElement('div');

		this.modal.className = 'popup-modal';

		this.closeBtn.className = 'popup-close-btn close-popup';
		this.popup.className = 'popup';
		this.header.className = 'popup-header';
		this.content.className = 'popup-content';
		this.footer.className = 'popup-footer';

		this.popup.appendChild(this.header);
		this.popup.appendChild(this.content);
		this.popup.appendChild(this.footer);

		this.header.appendChild(this.headerTitle);
		this.header.appendChild(this.closeBtn);

	};

	Popup.prototype.setPosition = function () {
		var $popup = $(this.popup);
		$popup.css({
			position : 'absolute',
			width : this.options.width,
			height : this.options.height,
			left : '50%',
			top : '50%',
			marginLeft : 0 - this.options.width / 2,
			marginTop : 0 - $popup.height() / 2
		});

	};

	Popup.prototype.setContent = function (content) {
		$(this.content).empty().append(content);
	};

	Popup.prototype.setFooter = function (footerContent) {
		$(this.footer).empty().append(footerContent);
	};
	Popup.prototype.setTitle = function (title) {
		$(this.headerTitle).text(title);
	};

	Popup.prototype.isOpen = function (title) {
		return this.popup.style.display !== 'none';
	};

	Popup.prototype.open = function () {
		document.body.appendChild(this.modal);
		$(this.options.parent).append(this.popup);

		this.popup.style.display = 'block';
		this.modal.style.display = 'block';
		this.modal.style.backgroundColor = this.options.modalBackground;
		this.setPosition();
	};

	Popup.prototype.close = function () {
		this.modal.style.display = 'none';
		this.popup.style.display = 'none';

		$(this.modal).remove();
		$(this.popup).remove();
	};

	Popup.prototype.bindEvents = function () {
		var popup = this;
		$(this.popup).on('click', '.close-popup', function () {
			popup.close();
			popup.options.onclose.call(popup);
		});
	};

	
		
	$.fn[pluginName] = function (options) {
		return this.each(function () {
			if (!$.data(this, 'plugin_' + pluginName)) {
				$.data(this, 'plugin_' + pluginName,
					new Popup(this, options));
			}
		});
	};

	$.fn[pluginName].Constructor = Popup;
	
}());
