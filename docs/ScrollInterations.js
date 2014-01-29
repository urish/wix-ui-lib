DocsApp.Classes.ScrollInterations = function () {
	
	var dataInter = '[data-scroll-inter]';
	var dataTarget = '[data-scroll-target]';
	var currentViewed = 'current-viewed';
	var $win = $(window);
	var $doc = $(document);	
	var $body = $('body');
	var noScroll = false;

	return {
		mixin: function(obj){
			if(obj.bindScrollAnimation || obj.bindScrollInteraction || obj.bindHeaderScroll){
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
				if (evt.target.hasAttribute('data-no-scroll')){
					noScroll = true;
					$('[href]').removeClass(currentViewed);
				} else {
					noScroll = false;
				}
				$body.animate({
					scrollTop : $(id).offset().top
				}, 160, function () {
					window.location.hash = id;
				});
			});

			setTimeout(function(){
				$(".js-sidebar").stick_in_parent({offset_top: 80});
			}, 100);


		},

		bindHeaderScroll : function(){
			var navPos = $('.page-welcome').height() - 50;
			$win.resize(function() {
				$('.navigation').toggleClass('shown', $doc.scrollTop() >= navPos);
			});
			$doc.bind('scroll touchmove', function() {
				$('.navigation').toggleClass('shown', $doc.scrollTop() >= navPos);

				$(".js-back-to-top").toggleClass('shown', $doc.scrollTop() >= navPos);


			});
		},

		bindScrollInteraction : function() {
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
				var elements = allHashes.filter(function (el, i) {
					if (winScrollTop + winHeight > docHeight - $(allHashes[allHashes.length - 1]).height() / 8) {
						return true;
					}
					if (dir === UP) {
						return winScrollTop > ($(el).position().top - ($(allHashes[i - 1]).height() / 2 || 0));
					} else {
						return winScrollTop + tollerace > $(el).position().top;
					}
				});
				return elements.pop();
			};
			var updateCss = function (el) {
				$inter.removeClass(currentViewed);
				if (el) {
					//window.location.hash = el.id;
					$('[href="#' + el.id + '"]').addClass(currentViewed);
				}
			}
			$win.scroll(function (evt) {
				clearTimeout(timeout);
				timeout = setTimeout(function () {
						if(noScroll) return;
						update();
						var element = findElementOverTheScroll();
						updateCss(element);
					}, 20);
			});
		}
	};
}
