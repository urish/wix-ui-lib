DocsApp.Classes.ScrollInterations = function () {
	
	var dataInter = '[data-scroll-inter]';
	var dataTarget = '[data-scroll-target]';
	var currentViewed = 'current-viewed';
	var $win = $(window);
	var $doc = $(document);	
	var $body = $('body');
	var $components = $("#components");
	var $css = $("#css");
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
				$('.navigation').toggleClass('shown', $doc.scrollTop() >= navPos);
			});
			$doc.bind('scroll touchmove', function() {
				$('.navigation').toggleClass('shown', $doc.scrollTop() >= navPos);
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
			var direction = winScrollTop >= _winScrollTop ? UP : DOWN;;
			var update = function () {
				winHeight = $win.height();
				docHeight = $doc.height();
				_winScrollTop = $win.scrollTop();
				winScrollTop = _winScrollTop;
			};
			var findElementOverTheScroll = function () {
				var elements = allHashes.filter(function (el, i) {
					if (winScrollTop + winHeight > docHeight - $(allHashes[allHashes.length - 1]).height() / 8) {
						return true;
					}
					if (direction === UP) {
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
						if(window.location.hash==="#css"){return ;}
						update();
						var element = findElementOverTheScroll();
						updateCss(element);
					}, 20);
			});

			$doc.bind('scroll touchmove', function() {
				var componentsOffset  = $components.offset().top - $(window).scrollTop();
				var cssOffset  = $css.offset().top - $(window).scrollTop();

				var $componentsSidebar = $components.find(".js-cmp-sidebar-wrapper");
				var $cssSidebar = $css.find(".js-cmp-sidebar-wrapper");

				var offset = 40;

				if (componentsOffset < offset ) {
					var element = findElementOverTheScroll();
					if ($(element).attr('id') === 'Tooltip-entry') {
						if($componentsSidebar.hasClass("scroll")){
							var t = $componentsSidebar.offset().top;
							$componentsSidebar.animate({
								top: t
							}, 20, function() {
								$componentsSidebar.css('position', 'absolute');
								$componentsSidebar.removeClass("scroll");
								$cssSidebar.removeClass("scroll").fadeIn(200);
							});
						} else if(direction == UP) {
							$componentsSidebar.addClass("scroll");
							$componentsSidebar.removeAttr('style');
						}
					} else {
						$componentsSidebar.addClass("scroll");
						$componentsSidebar.removeAttr('style');
						$cssSidebar.removeClass("scroll")

						if (($(element).attr('id') === 'Buttons-entry' || $(element).attr('id') === 'Icons-entry')) {
							$cssSidebar.show();
						} else if(element) {
							$cssSidebar.hide();
						}
					}
				}
				if (componentsOffset > offset) {
					$componentsSidebar.removeClass("scroll");
				}


				if (cssOffset < offset) {
					//$cssSidebar.hide();
					$componentsSidebar.removeClass("scroll");
					$cssSidebar.addClass("scroll").fadeIn(200);
				} else {
					$cssSidebar.removeClass("scroll");
				}
			});
		}
	};
}
