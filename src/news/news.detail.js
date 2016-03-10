$(function  () {
    sessionStorage.setItem("token","eb39e6bf-a2b8-44b2-90ed-2471bd7fd4a1")
    var token = sessionStorage.getItem("token")
    
    var callmethod = 3 //1-crs；2-web；3-wechat；4-app(ios)；5-app(Android)
    var url = 'http://smlt-ots.imike.cn/ots/recommend/querydetail'
    //var url = 'http://ota2test.imike.cn/ots/recommend/querydetail'
    //var url = 'http://192.168.81.146:8080/ots/recommend/querydetail'
    var detailid = GetQueryString('detailid')
   
      $.ajax({
          type: 'POST',
          url: url,
          data: { detailid: detailid, callmethod: callmethod },
          dataType: 'json',
          context: $('body'),
          success: function(data){
           // var sec_img=""
            var sec_title=""
            var sec_word=""

            if (data.detail){ 
              // sec_img +='  <img src="'
              //     + data.detail.image
              //     +'" />'
              sec_title += '<h3>'
                +data.detail.title||""
                +'</h3>'
                +'<h4>'
                +data.detail.subtitle||""
                +'</h4>'

              sec_word +=data.detail.word


              if(sec_word){
                sec_word = sec_word.replace(/[\n]/g, "<br>");
              }

              //$('#sec-image').html(sec_img)
              $('#sec-title').html(sec_title)
              $('#sec-word').html(sec_word)

            }
          },
          error: function(xhr, type){
            console.log('xhr %s type %s', xhr, type)
          }
      });

     
         // loadBanner(token, url, bannerPosition, callmethod)
          //loadHoteList(token, url,listPosition, callmethod)

})


function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}



