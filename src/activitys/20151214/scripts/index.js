/* global IScroll */
/* global $ */

!(function () {
    'use strict';
    var myScroll;
    document.addEventListener('touchmove', function (e) {
        e.preventDefault();
    }, false);

    var host = '//huidu.imike.cn/ots/';

    function initHotelList() {
        //公司坐标
        var position = {
            userlongitude: 121.4004930400,
            userlatitude: 31.1628467200
        };
        
        MKbridge.getLocation(function (lbs) {
            var p = { userlongitude: lbs.lng || position.userlongitude, userlatitude: lbs.lat || position.userlatitude, cityid: 500000, callmethod: 5, callversion: '3.3' };
            MKbridge.showLoading();
            $.post(host + 'promo/onedollarlist?', p, function (res) {
                renderHotels(res.hotel || [], res.promosec);
                if (res.promosec > 0) {
                    setTimeout(function () {
                        $('.hotel-list .btn-buy').removeClass('disabled').text('秒杀');
                    }, res.promosec*1000);
                };

                $('#pageCount').text(res.promonote || 0);
                MKbridge.hideLoading();
            });
        });
    };

    function renderHotels(hotelList, startSec) {
        var data = { list: hotelList };
        var sellLeft = 0;
        for (var index = 0; index < data.list.length; index++) {
            var item = data.list[index];

            if (startSec > 0) {
                item.btnText = '未开始';
                item.btnDisabled = true;
                sellLeft++;
            } else if (item.roomvacancy > 0) {
                item.btnText = '秒杀';
                item.btnDisabled = false;
                sellLeft++;
            } else if (item.roomvacancy == 0) {
                item.btnText = '已结束';
                item.btnDisabled = true;
            }
        }

        $(".hotel-list").html(template("hotel-list", data));
        if (sellLeft == 0) {
            $('#diag-tip').show();
        }
        //refresh dom because page size has changed.
        myScroll.refresh();
    }

    //dom ready
    $(function () {

        myScroll = new IScroll('.wrapper', {
            mouseWheel: true,
            click: true
        });

        $(".hotel-list").on('tap', '.btn-buy', function () {
            var $container = $(this).parents(".hotel-item");
            var hotelid = $container.attr("hotelid");
            var param = { hotelid: hotelid, isOnePromo: '1' };

            if ($(this).is('.disabled')) {
                return;
            }
            //跳转Native
            MKbridge.goNative("hotelDetail", param, function () {
            });
            $.logEvent('button', '1rmb', hotelid);
        });

        $(".hotel-list").on('tap', '.img-pic', function () {
            var $container = $(this).parents(".hotel-item");
            var hotelid = $container.attr("hotelid");
            var param = { hotelid: hotelid, isOnePromo: '0' };
            //跳转Native
            MKbridge.goNative("hotelDetail", param, function () {
            });
            $.logEvent('button', '1rmb-image', hotelid);
        });
                

        //跳转 今夜特价
        $("#btn-go-special").tap(function () {
            MKbridge.goNative("hotelNightList", {}, function () {
                $("#diag-tip").hide();
            });
            $.logEvent('button', 'list_specail', 0);
        });
        //initHotelList();
         MKbridge.ready(function () {
             initHotelList();
         });
    });

})(); 
