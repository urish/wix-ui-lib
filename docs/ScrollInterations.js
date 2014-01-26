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
			obj.bindHeaderScroll = this.bindHeaderScroll;
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
		bindHeaderScroll : function(){
			var navPos = $('.page-welcome').height() - 50;
			$win.resize(function() {
				$('.navigation').toggleClass('shown', $(document).scrollTop() >= navPos);
			});
			$doc.bind('scroll touchmove', function() {
				$('.navigation').toggleClass('shown', $(document).scrollTop() >= navPos);
				var offset  = $('#components').offset().top - $(window).scrollTop();
				if ( offset < 40 ) {
					$(".cmp-sidebar").parent().addClass("scroll");
				}
				if (offset > 40) {
					$(".cmp-sidebar").parent().removeClass("scroll");
				}
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
					//$(".cmp-sidebar").removeClass("scroll");
					//window.location.hash = 'demo';
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
