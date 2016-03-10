/* global $ */
(function() {
	'use strict';

	document.addEventListener('touchmove', function(e) {
		e.preventDefault();
	}, false);


	var config = {
		iosDownload: 'https://itunes.apple.com/cn/app/mi-ke/id980154995?mt=8',
		androidDownload: 'http://h5.imike.com/android/'
	}

	//window loaded
	$(window).on('load', function() {
		var myScroll = new IScroll('.wrapper', {
			mouseWheel: true,
			click: true
		});
	});

	//dom ready
	$(function() {

		var $linkDown = $(".btn-download");
		var adrdUrl = '#';
		if ($.queryParams.from) {
			adrdUrl = config.androidDownload + 'Mike-release_' + $.queryParams.from + '.apk'
		}
		
		if ($.os.wechat) {
			$linkDown.click(function() {
				alert("请点击右上角，在浏览器中打开！");
			});
		} else if ($.os.ios) {
			$linkDown.attr("href", config.iosDownload).removeAttr("download");
		} else if ($.os.android) {
			$linkDown.attr("href", adrdUrl);
		} else {
			$linkDown.attr("href", adrdUrl);
		}
		
		$linkDown.click(function(){
			$.logEvent('button', 'download', '0');
		})

	});

})();