 var swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        paginationClickable: true,
        autoplay: 3000,
        autoplayDisableOnInteraction: false,
    });

$(function () {

    sessionStorage.setItem("token", "eb39e6bf-a2b8-44b2-90ed-2471bd7fd4a1");
    var token = sessionStorage.getItem("token");

    var bannerPosition = "921C" //1：首页，2发现首页，3发现列表页
    var listPosition = "921D" //1：首页，2发现首页，3发现列表页
    var callmethod = 3 //1-crs；2-web；3-wechat；4-app(ios)；5-app(Android)
    var url = 'http://smlt-ots.imike.cn/ots/recommend/query'
    // var url = 'http://192.168.81.146:8080/ots/recommend/query'
    // var url = 'http://ota2test.imike.cn/ots/recommend/query'
   
    /* top*/
    $.post(url,{ token: token, position: bannerPosition, callmethod: callmethod },function (data) {
        if (data.banners) {
            $.each(data.banners, function (index, item) {
              var viewType = item.querytype;
                var link = "1"==viewType?'discover_detail.html?detailid=' + item.detailid:item.url;
                swiper.appendSlide([
                  '<div class="swiper-slide">'
                  + '<a href="' + link + '"><img src="' + item.imgurl + '" alt=""/></a>'
                  + '</div>'
                ]);
            });
            swiper.startAutoplay();
        }
    });

    /* list*/
    $.post(url,{ token: token, position: listPosition, callmethod: callmethod },function (data) {
        var sec_body=""
        if (data.banners){ 
            $.each(data.banners, function(index,item){
                var viewType = item.querytype;
                var link = "1"==viewType?'discover_detail.html?detailid=' + item.detailid:item.url;
                var now = new Date(item.createtime); 
                var strDate =  now.getFullYear()+'-';
                var month = now.getMonth() + 1;
                    strDate += month > 9 ? month.toString() : '0' + month;
                    strDate += '-';
                    strDate += now.getDate() > 9 ? now.getDate().toString() : '0' + now.getDate();
                sec_body += '<li>'
                    + ' <a href="' + link +'" class="item">'
                    + '    <img src="' + item.imgurl +'" alt=" ">'
                    + '    <div class="right">'
                    + '      <span>' + item.name +'</span>'
                    + '       <small>'+strDate+'</small>'
                    + '     </div>'
                    + '  </a>'
                    + '</li>';
            });
        }else{
            sec_body="<center>当前无推荐！</center>";
        }
        $('#sec-list').html(sec_body)
    })

});

