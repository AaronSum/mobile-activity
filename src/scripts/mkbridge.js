/**
 * @desc 眯客APP与web通信bridge 
 * @ref https://github.com/marcuswestin/WebViewJavascriptBridge
 * @author Aaron(rongzhong.sun@imike.com)
 */
!(function () {
    'use strict';
    
    var MKbridge = window.MKbridge = {};
    /**
     * Native各模块跳转mapping,
     * 参数见 http://gitlab.imike.cc/bms/hybrid-bridge/blob/master/README.md
     */
    var targetMap = {
        home: {name:'首页', android: { androidActivity: 'main.MainActivity', androidFragment: '' }, ios: 'MainHome' },
        hotelList: {name:'酒店列表',  android: { androidActivity: 'hotel.HotelMapListActivity', androidFragment: '' }, ios: 'HotelList' },
        hotelDetail: {name:'酒店详情',  android: { androidActivity: 'hotel.HotelDetailActivity', androidFragment: '' }, ios: 'HotelDetail' },
        orderList: { name:'订单列表', android: { androidActivity: 'order.OrderActivity', androidFragment: 'OrderFragment' }, ios: 'OrderList' },
        orderDetail: { name:'订单详情', android: { androidActivity: 'order.OrderActivity', androidFragment: 'OrderDetailsFragment' }, ios: 'OrderDetail' },
        userCenter: {name:'用户中心',  android: { androidActivity: 'usercenter.UserCenterActivity', androidFragment: 'UserCenterFragment' }, ios: 'MineHome' },
        signin: { name:'登录', android: { androidActivity: 'login.LoginActivity', androidFragment: '' }, ios: 'Login' },
        myCoupons: {name:'我的优惠劵',  android: { androidActivity: 'coupon.CouponListActivity', androidFragment: '' }, ios: 'MineCoupon' },
        myMessages: { name:'我的消息', android: { androidActivity: 'usercenter.UserCenterActivity', androidFragment: 'MyNewsFragment' }, ios: 'MineMessage' },
        myAccount: { name:'我的钱包', android: { androidActivity: 'usercenter.UserCenterActivity', androidFragment: 'MyCostFragment' }, ios: 'MineBalance' },
        myHotels: { name:'我的酒店', android: { androidActivity: 'hotel.MyHotelsActivity', androidFragment: '' }, ios: 'MineHotel' },
        feedBack: {name:'投诉建议',  android: { androidActivity: 'usercenter.UserCenterActivity', androidFragment: 'OpinionErronReportFragment' }, ios: 'MineSuggestion' },
        hotelOneList: {name:'一元特价',  android: { androidActivity: 'hotel.HotelPromotionActivity', androidFragment: '' }, ios: 'HotelOneList' },
        hotelDayList: {name:'今日特价',  android: { androidActivity: 'hotel.HotelPromotionActivity', androidFragment: '' }, ios: 'hotelDayList' },
        hotelNightList: {name:'今夜特价',  android: { androidActivity: 'hotel.HotelPromotionActivity', androidFragment: '' }, ios: 'HotelNightList' },
        hotelThemeList: { name:'主题酒店', android: { androidActivity: 'hotel.HotelActivity', androidFragment: 'HotelThemeListFragment' }, ios: 'HotelThemeList' }
    };
    
    //bridge init
    var connection = {
        bridgeReady: function (callback) {
            if (window.WebViewJavascriptBridge) {
                callback(window.WebViewJavascriptBridge);
            } else {
                document.addEventListener('WebViewJavascriptBridgeReady', function () {
                    callback(window.WebViewJavascriptBridge);
                }, false);
            }
        },
        connectBridge: function () {
            this.bridgeReady(function (bridge) {
                bridge.init(function (message, cb) {
                    cb && cb(message);
                });
                bridge.ready = true;
            });
        }
    };
    //init
    connection.connectBridge();
    
    //bridge apis
    $.extend(MKbridge, {
        ready: function (ck) {
            if (this.getHandler()) {
                ck && ck();
            } else {
                $(document).on("WebViewJavascriptBridgeReady", function () {
                    ck && ck();
                });
            }
        },
        getHandler: function () { 
            return window.WebViewJavascriptBridge;
        },
        callHandler: function (name, param, callback) {  /* 公共调用方法 */
            if (typeof param != 'string') {
                param = JSON.stringify(param || {});
            }
            var handle = this.getHandler();
            if (handle) {
                handle.callHandler(name, param, callback);
            } else {
                callback({ success: false, message: 'Bridge is not ready!' });
            }
        },
        goNative: function (name, param, callback) { /* 跳转Native 可跳转目标,见mapping*/
            var targetParam = targetMap[name];
            if (!targetParam) {
                console.error(name, "未实现");
                callback({ success: false, message: 'method is undefined!' });
                return;
            }
            targetParam.param = param;
            this.callHandler('goNative', targetParam, callback);
        },
        getLocation: function (callback) {      /* 获取 location */
            this.callHandler('getLocation', {}, callback);
        },
        share: function (param, callback) {     /* 社会化分享 */
            this.callHandler('goShare', param, callback);
        },
        getUserInfo: function ( callback) {     /* 获取用户信息 */
            this.callHandler('getUserInfo', {}, callback);
        },
        showLoading:function(){                 /* 打开loading */
             this.callHandler('startLoading', {}, function(){});
        },
        hideLoading:function(){                 /* 关闭loading */
             this.callHandler('stopLoading', {},  function(){});
        }
    });
})();