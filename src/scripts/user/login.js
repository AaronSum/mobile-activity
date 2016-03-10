(function() {
	'use strict';

	document.addEventListener('touchmove', function(e) {
		e.preventDefault();
	}, false);

	//window loaded
	$(window).on('load', function() {
		var myScroll = new IScroll('.wrapper', {
			mouseWheel: true,
			click: true
		});
	});

	$(function() {
		var host = '//huidu.imike.cn',
			timer = 0;
		//获取验证码
		$("#btn-verify").on('click tap', function() {
			var url = host + '/ots/verifycode/sendcode';
			timer = 60;
			var phone = $("#tbPhone").val();
			if (!phone) {
				alert('请输出手机号！');
				return;
			}

			$(this).attr("disabled", "disabled");
			countDown();
			$.post(url, {
				phone: phone,
				type: 1,
				callmethod: 2
			}, function(data) {
				if (data && data.success) {

				} else {
					alert('发送验证码失败，请稍后重试！');
				}
			});
		});
		//验证
		$("#btn-ok").on('click tap', function() {
			var url = host + '/ots/verifycode/verify';
			var code = $("#tbCode").val();
			var phone = $("#tbPhone").val();
			if (!phone) {
				alert('请输出手机号！');
				return;
			}
			if (!code) {
				alert('请输出验证码！');
				return;
			}

			var $btn = $(this).attr("disabled", "disabled");

			$.post(url, {
				phone: phone,
				code: code,
				callmethod: 2
			}, function(data) {
				if (data && data.success) {
					checkuser(phone);
				} else {
					alert('验证码校验失败，请稍后重试！');
					$btn.removeAttr("disabled");
				}
			});
		});

		function checkuser(phone) {
			var url = host + '/ots/unionidandphone/check';
			$.post(url, {
				phone: phone,
				callmethod: 2,
				ostype: 5
			}, function(data) {
				if (data && data.success) {
					if (data.check == 'T') {
						$.ls("mk-token", data.token)
						if (returnUrl) {
							location.href = returnUrl;
						}
					}else{
						binding(phone);					
					}
				} else {
					alert(data.errmsg)
				}
			});
		}

		function binding(phone) {
			var url = host + '/ots/unionidandphone/binding';
			var returnUrl = $.queryParams.returnUrl || '';
			$.post(url, {
				phone: phone,
				callmethod: 2,
				ostype: 5
			}, function(data) {
				if (data && data.success) {
					$.ls("mk-token", data.token)
					if (returnUrl) {
						location.href = returnUrl;
					}
				} else {
					alert(data.errmsg)
				}
			});
		}

		function countDown() {
			$("#btn-verify").text(timer);
			if (timer == 0) {
				$("#btn-verify").text("验 证").removeAttr("disabled");
				return;
			}
			timer--;
			setTimeout(countDown, 1000);
		};

	});

})();