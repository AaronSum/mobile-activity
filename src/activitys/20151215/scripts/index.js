/* global MKbridge */
/* global IScroll */
/* global $ */
!(function () {
    'use strict';

    document.addEventListener('touchmove', function (e) {
        e.preventDefault();
    }, false);

    //window loaded
    $(window).on('load', function () {
        new IScroll('.wrapper', {
            mouseWheel: true,
            click: true
        });
    });

    //dom ready
    $(function () {
        $("#goto-orderlist").tap(function () {
            MKbridge.getUserInfo(function(res){
               MKbridge.goNative('orderList');  
               $.logEvent('button', 'h52orderlist', '0');
            });
        });

        $("#goto-order").tap(function (e) {
            MKbridge.goNative('hotelList', { orderbyIndex: 5 });
            $.logEvent('button', 'h52hotelList', '0');
        });
    });
})();