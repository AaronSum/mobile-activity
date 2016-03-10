/* global ga */
//google
(function (i, s, o, g, r, a, m) {
i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
	(i[r].q = i[r].q || []).push(arguments)
}, i[r].l = 1 * new Date(); a = s.createElement(o),
m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

//baidu
var _hmt = _hmt || [];
(function () {
	var hm = document.createElement("script");
	hm.src = "//hm.baidu.com/hm.js?413d158942fab5ff35b2f15508482c22";
	var s = document.getElementsByTagName("script")[0];
	s.parentNode.insertBefore(hm, s);
})();


(function ($, window) {
	'use strict';

	ga('create', 'UA-70939414-1', 'auto');
	ga('send', 'pageview');

	function log() {
		this.logEvent = function (type, category, label) {
			ga && ga('send', 'event', type, category, label);
			_hmt && _hmt.push(['_trackEvent', type, category, label]);
		};
		return this;
	};

	log.call($);
})($, window);