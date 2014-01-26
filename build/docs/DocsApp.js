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
		this.updateClasses();
		this.renderDocs();
		this.$root.show();
	},
	updateClasses:function(){
		this.$docs.find('.content').find('.cmp-plugin-decs-entry').each(function(){			
			$(this).find('pre').addClass('plugin-markup prettyprint');		
		});		
	},
	bindEvents : function () {
		this.Classes.ScrollInterations().mixin(this);
		this.bindScrollAnimation();
		this.bindScrollInteraction();
		this.bindHeaderScroll();
	},
	renderDocs : function () {
		var sidebarHTML = '';
		var that = this;
		var titles = $('h1[id]').each(function(){
			sidebarHTML += that.templates.menuTpl({name: this.innerHTML});
		});		
		this.$sidebar.find('.content').append(sidebarHTML);
	}
};
