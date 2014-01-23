var DocsApp = {
	Classes:{},
	init : function () {
		this.utils = this.Classes.Utils();
		this.pluginDocsData = this.Classes.PluginDocsData(this.utils);
		this.templates = this.Classes.Templates(this.pluginDocsData, this.utils);
		
		this.setAppElements();
		this.markup();
		this.bindEvents();
	},
	setAppElements : function () {
		this.$root = $('body');
		this.$sidebar = $('#sidebar');
		this.$docs = $('#docs');
	},
	markup : function () {
		this.$root.hide();
		this.renderDocs();
		this.$root.show();
	},
	bindEvents : function () {
		this.Classes.ScrollInterations().mixin(this);
		this.bindScrollAnimation();
		this.bindScrollInteraction();
	},
	renderDocs : function () {
		var sidebarHTML = '';
		var docsHTML = '';
		var blackList = ['PluginTemplate'];
		var store = jQuery.fn.definePlugin.store;
		for (var pluginName in store) {
			if (blackList.indexOf(pluginName) !== -1) {
				continue;
			}
			var Plugin = store[pluginName];
			sidebarHTML += this.templates.menuTpl(Plugin);
			docsHTML += this.templates.contentTpl(Plugin);
		}
		this.$sidebar.find('.content').append(sidebarHTML);
		this.$docs.find('.content').append(docsHTML);
	}
};
