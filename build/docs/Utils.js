DocsApp.Classes.Utils = function () {

	function createHTMLEscaper() {
		var entityMap = {
			"&" : "&amp;",
			"<" : "&lt;",
			">" : "&gt;",
			'"' : '&quot;',
			"'" : '&#39;',
			"/" : '&#x2F;'
		};

		return function escapeHtml(string) {
			return String(string).replace(/[&<>"'\/]/g, function (s) {
				return entityMap[s];
			});
		}
	}

	return {
		escapeHtml : createHTMLEscaper()
	};

}
