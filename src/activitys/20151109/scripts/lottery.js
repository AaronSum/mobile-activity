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

	//dom ready
	$(function() {
		var //host = '//smlt-ots.imike.cn',
			//host = '//183.131.145.251:8080',
			host = '//huidu.imike.cn',
			timer = 0,
			prize = null,
			urlDownload = 'http://h5.imike.com/activitys/20151104/one.html?from=' + $.queryParams.from,
			ostype = $.queryParams.from == 'imike' ? 2 : 3;
		//炸弹
		$(".eggs .egg").click(function() {
			if (!checklogin()) {
				return;
			}			
			breakegg(this);
		});

		function breakegg(egg) {
			var token = $.ls("mk-token");
			var usermark = $.ls("mk-usermark");
			var url = host;
			var param = {
				activeid: 23,
			};
			if (token) {
				url += '/ots/ticket/tryluck';
				param.token = token;
				param.ostype = ostype;
			} else {
				url += '/ots/ticket/nologintryluck';
				param.usermark = usermark;
				param.ostype = 5;
			}

			$.post(url, param, function(data) {
				if (data && data.success) {
					showPrize(data);
					$(egg).addClass('broken');
					$.logEvent('area', 'lottery', '0');
				} else if (data && !data.success) {
					showError(data.errmsg);
				}
			});
		};

		function showPrize(res) {
			//a10009
			var $ctn = $(".result_modal");
			var token = $.ls("mk-token");
			var phone = $.ls('mk-phone');
			var prize = null;
			if (res.others && res.others.length > 0) {
				prize = res.others[0];
				if (prize.code === 'a10009') {
					showError("<a href='" + urlDownload + "'>哎呀，差一点就中了,更多活动请下载【眯客】APP</a>");
					return;
				}
				$ctn.find('h3.prize').text(prize.name);
			} else if (res.tickets && res.tickets.length > 0) {
				prize = res.tickets[0];
				$ctn.find('h3.prize').text(prize.name);
			}

			$.ls("prize", JSON.stringify(prize));

			$ctn.show();

			if (!token) {
				$ctn.find("#btn-link").click(function() {
					$(".verify_modal").show().find(".modal_close").hide();
				});
			} else if (phone && res.tickets && res.tickets.length > 0) {
				$.removeLs("prize");
				$ctn.find("#btn-link").text('下载 APP').attr('href', urlDownload);
			} else if (phone && res.others && res.others.length > 0) {
				$.removeLs("prize");
				if ($.queryParams && $.queryParams.from && ($.queryParams.from == 'imike' || $.queryParams.from == 'imikewechat')) {

				} else {
					phoneBindingPrize(phone, prize);
				}
				$ctn.find("#btn-link").attr('href', prize.url);
			}
		}

		function showError(msg) {
			var $ctn = $(".error_modal");
			if(msg == '您已经参与过该活动， 不能重复参与！'){
				msg = '对不起，您已经参与过该活动，请去【眯客】APP再玩一次。<br/> <a href='+urlDownload+'>下载【眯客】APP</a>'
			}
			$ctn.find('.error-msg').html(msg);
			$ctn.show();
		}


		function checklogin() {
			var token = $.ls("mk-token");
			if ($.queryParams && $.queryParams.from && ($.queryParams.from == 'imike' || $.queryParams.from == 'imikewechat')) {
				if (!token) {
					$(".verify_modal").show();
					return false;
				} else {
					return true;
				}
			} else {
				return true;
			}
		}

		function guid() {
			function S4() {
				return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
			}
			return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
		}

		$("#btn-viewresult").click(function() {
			var token = $.ls("mk-token");
			var usermark = $.ls("mk-usermark");
			var srcDark = 'images/viewresult_active.png'
			$(this).find("img").attr("src", srcDark);
			var url = host + '/ots/ticket/queryallluck';
			var przString = $.ls("prize");

			$.post(url, {
				activeid: 23,
				usermark: usermark,
				token: token
			}, function(result) {
				var $container = $(".log_modal ul").empty();
				var prize = "";
				if (przString) {
					prize = JSON.parse(przString);
					var $li = $("<li><span class='prize'>您有一个奖品尚未领取，点击领取！</span></li>");
					$container.append($li);
					$li.click(function() {
						$(".verify_modal").show();
					});
				}

				if (result && result.success) {
					$.each(result.lucklist, function(idx, item) {
						$container.append('<li><span class="time">' + item.createtime + '</span><span class="ticket">' + item.name + '（' + item.begintime + '至' + item.endtime + '）</span></li>')
					});
					$('.log_modal').show();
				}
			});
		});

		$(".modal_close").click(function() {
			$(this).closest(".modal").hide();
		});


		if ($.queryParams && $.queryParams.from && ($.queryParams.from == 'imike' || $.queryParams.from == 'imikewechat')) {
			if (!$.ls("mk-token")) {
				$(".verify_modal").show();
			}
		} else {
			var usermark = $.ls('mk-usermark');
			if (!usermark) {
				$.post(host + "/ots/ticket/uuid", {}, function(res) {
					$.ls('mk-usermark', res.usermark || guid());
				});
			}
		}

		//获取验证码
		$("#btn-verify").on('click tap', function() {
			$.logEvent('button', 'security_get', '0');
			if ($(this).text() != '获取验证码') {
				return;
			}
			var url = host + '/ots/verifycode/sendcode';
			timer = 60;
			var phone = $("#tbPhone").val();
			if (!phone) {
				alert('请输出手机号！');
				return;
			}

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
			$.logEvent('button', 'security_confirm', '0');
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

			$.post(url, {
				phone: phone,
				code: code,
				callmethod: 2
			}, function(data) {
				if (data && data.success) {
					checkuser(phone);
				} else {
					alert('验证码校验失败，请稍后重试!');
				}
			});
		});

		function checkuser(phone) {
			var url = host + '/ots/unionidandphone/check';
			$.ls('mk-phone', phone);
			$.post(url, {
				phone: phone,
				callmethod: 2,
				ostype: ostype
			}, function(data) {
				if (data && data.success) {
					if (data.token) {
						$.ls("mk-token", data.token);
						$(".verify_modal").hide();
						gotoPrize(phone);
					} else {
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
				ostype: ostype
			}, function(data) {
				if (data && data.success) {
					$.ls("mk-token", data.token);
					$(".modal").hide();
					gotoPrize(phone);
				} else {
					alert(data.errmsg)
				}
			});
		}

		function gotoPrize(phone) {
			var przString = $.ls("prize");
			if (!przString) {
				return;
			}
			var prize = JSON.parse(przString);

			$.removeLs("prize");
			//other prize
			if (prize.url) {
				//location.href = prize.url;
				phoneBindingPrize(phone, prize);
			} else {
				phoneBindingPrize(phone, prize);
			}
		}

		//绑定到手机
		function phoneBindingPrize(phone, prize) {
			var url = host + '/ots/ticket/prizebindingphone';
			var param = {
				activeid: 23,
				phone: phone,
				prizerecordid: prize.id,
				ostype: ostype
			};

			$.post(url, param, function(res) {
				$(".modal").hide();
				if (res.success) {
					//location.href = urlDownload;
					location.href = prize.url;
				} else {
					showError(res.errmsg);
				}
			});
		}

		function countDown() {
			$("#btn-verify").text(timer);
			if (timer == 0) {
				$("#btn-verify").text("获取验证码");
				return;
			}
			timer--;
			setTimeout(countDown, 1000);
		};
	});

})();