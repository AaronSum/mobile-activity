
(function ($, window) {
	'use strict';

	//query string 
	function queryParamExtend(urlstr) {
		var search = urlstr.substring(1);
		this.queryParams = search ? JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}', function (key, value) {
			return key === "" ? value : decodeURIComponent(value);
		}) : {};

		return this;
	};

	queryParamExtend.call($, location.search);

	function setCookie(name, value) {
		var Days = 60;
		var exp = new Date();
		exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
		document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
	}

	function getCookie(name) {
		var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

		if (arr = document.cookie.match(reg))

			return unescape(arr[2]);
		else
			return null;
	}

	function delCookie(name) {
		var exp = new Date();
		exp.setTime(exp.getTime() - 1);
		var cval = getCookie(name);
		if (cval != null)
			document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
	}

	function localStorageExtend(lshandle) {
		this.ls = function (skey) {
			var sval;
			if (arguments.length > 1) {
				sval = arguments[1];
				sval = typeof sval === 'string' ? sval : JSON.stringify(sval);
				if (lshandle) {
					lshandle.setItem(skey, sval);
				} else {
					setCookie(skey, sval);
				}
				return this;
			} else {
				if (lshandle) {
					return lshandle.getItem(skey);
				} else {
					getCookie(skey);
				}
			}
		};
		this.removeLs = function (skey) {
			if (lshandle) {
				lshandle.removeItem(skey);
			} else {
				delCookie(skey);
			}
			return this;
		}
	};
	localStorageExtend.call($, window.localStorage || window.sessionStorage);


	//browser detect
	function detect(ua) {
		this.os = {};
		var funcs = [

			function () { //wechat
				var wechat = ua.match(/(MicroMessenger)\/([\d\.]+)/i);
				if (wechat) { //wechat
					this.os.wechat = {
						version: wechat[2].replace(/_/g, '.')
					};
				}
				return false;
			},
			function () { //android
				var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
				if (android) {
					this.os.android = true;
					this.os.version = android[2];

					this.os.isBadAndroid = !(/Chrome\/\d/.test(window.navigator.appVersion));
				}
				return this.os.android === true;
			},
			function () { //ios
				var iphone = ua.match(/(iPhone\sOS)\s([\d_]+)/);
				if (iphone) { //iphone
					this.os.ios = this.os.iphone = true;
					this.os.version = iphone[2].replace(/_/g, '.');
				} else {
					var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
					if (ipad) { //ipad
						this.os.ios = this.os.ipad = true;
						this.os.version = ipad[2].replace(/_/g, '.');
					}
				}
				return this.os.ios === true;
			}
		];
		[].every.call(funcs, function (func) {
			return !func.call($);
		});
	};

	detect.call($, navigator.userAgent);

})($, window);