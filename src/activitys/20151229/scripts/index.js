/* global MKbridge */
/* global IScroll */
/* global $ */
!(function () {
    'use strict';
    var $eles = {},
        iScroll=null,
        CONFIG={
            //ajax params
            ajax: {
                url: 'http://huidu.imike.cn/ots/promo/college',
                param: {cityid: 500000}
            },
            //page hotel id list
            hotelIdList: ['2225','2213','2282','2317','2285','3719','2419','4705','4636']
        };

    document.addEventListener('touchmove', function (e) {
        e.preventDefault();
    }, false);

    //window loaded
    $(window).on('load', function () {
        iScroll=new IScroll('.wrapper', {
            mouseWheel: true,
            click: true
        });
    });

    //dom ready
    $(function () {
        $eles = {
            hotels: $('.inner-container')
        };

        //set hotels id
        (function(options,idList){
           if(!options || !options.length || !idList || !idList.length || options.length != idList.length) return;
            for(var i=0,len=idList.length;i<len;i++)
                $(options[i]).attr('data-id',idList[i]);
        })($eles.hotels, CONFIG.hotelIdList);

        initPageUI();

        //buy button's tap action
        $('#mainBox').on('tap','.btn_buy',function(){
            var hotelId = $(this).parents('.inner-container').attr('data-id');
            MKbridge.goNative("hotelDetail", { hotelid: hotelId }, function () {
            });
            $.logEvent('button', 'specialPriceForChongqingSchool', hotelId);
        });

    });

    //init page UI
    function initPageUI(){
        MKbridge.showLoading();
        $.post(CONFIG.ajax.url,CONFIG.ajax.param,function(data){
            if(!data.success){
                MKbridge.hideLoading();
                return alert(data.errormsg || '数据错误！');
            }
            for(var i = 0, len = data.hotel.length;i<len;i++)
                setHotelVisable(data.hotel[i]);
            //set footer of last visable box style
            $('.container:visible').last().find('footer').addClass('lastFooter');
            iScroll.refresh();
            MKbridge.hideLoading();
        }); 
    };

    //set box and option show
    function setHotelVisable(data){
        var $dom = null;
        for(var i = 0,len = $eles.hotels.length;i<len;i++){
            $dom = $($eles.hotels[i]);
            if(data.hotelid == $dom.attr('data-id')){
                //1.set current option's prices info
                $dom.find('.tbox p>span')
                    .text('￥'+data.promoprice)
                    .end()
                    .find('del')
                    .text('原价:￥'+data.minpmsprice);
                //2.set parent option visable
                $dom.show().parents('div.container').show();
                break;
            }
        }
    };
})();