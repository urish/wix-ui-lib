DocsApp.Classes.ScrollInterations = function () {
	
	var dataInter = '[data-scroll-inter]';
	var dataTarget = '[data-scroll-target]';
	var currentViewed = 'current-viewed';
	var $win = $(window);
	var $doc = $(document);	
	var $body = $('body');
	
	return {
		mixin: function(obj){
			if(obj.bindScrollAnimation || obj.bindScrollInteraction){
				throw new Error('Object is already implements ScrollInterations');
			}
			obj.bindScrollAnimation = this.bindScrollAnimation;
			obj.bindScrollInteraction = this.bindScrollInteraction;
		},
		bindScrollAnimation : function () {
			$body.on('click', dataInter, function (evt) {
				evt.preventDefault();
				var id = evt.target.getAttribute('href');
				$body.animate({
					scrollTop : $(id).offset().top
				}, 160, function () {
					window.location.hash = id;
				});
			});
		},
		bindScrollInteraction : function startScrollInteraction() {
			var $inter = $(dataInter);
			var allHashes = $(dataTarget).toArray();
			var tollerace = 30;
			var winScrollTop = $win.scrollTop();
			var winHeight = $win.height();
			var docHeight = $doc.height();
			var timeout;
			var _winScrollTop;
			var dir = 0;
			var UP = 1
			var DOWN = -1
			var update = function () {
				winHeight = $win.height();
				docHeight = $doc.height();
				_winScrollTop = $win.scrollTop();
				dir = winScrollTop >= _winScrollTop ? UP : DOWN;
				winScrollTop = _winScrollTop;
			};
			var findElementOverTheScroll = function () {
				return allHashes.filter(function (el, i) {
					if (winScrollTop + winHeight > docHeight - $(allHashes[allHashes.length - 1]).height() / 8) {
						return true;
					}
					if (dir === UP) {
						return winScrollTop > ($(el).position().top - ($(allHashes[i - 1]).height() / 2 || 0));
					} else {
						return winScrollTop + tollerace > $(el).position().top;
					}
				});
			};
			var updateCss = function (el) {
				$inter.removeClass(currentViewed);
				if (el) {
					window.location.hash = el.id;
					$('[href="#' + el.id + '"]').addClass(currentViewed);
				} else {
					window.location.hash = '';
				}
			}
			$win.scroll(function (evt) {
				clearTimeout(timeout);
				timeout = setTimeout(function () {
						update();
						var over = findElementOverTheScroll();
						updateCss(over.pop());
					}, 20);
			});
		}
	};
}
