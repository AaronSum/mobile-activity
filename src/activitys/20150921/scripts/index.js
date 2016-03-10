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
    
    $('body').click(function(){
        alert("对不起，该活动已下线！");
    })
})();