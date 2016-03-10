# Hyhrid Bridge 4 Mike

by [gp_application@imike.com](mailto:gp_application@imike.com)

## Summary
***
- H5 WebView特性方法
- 客户端协议接口约定（握手通讯）
- 客户端页面跳转及跳转拦截
- 客户端唤醒（调研总结）
- 降级方案（页面生存环境自适应）

## 面向Android和iOS的JS调用原理
****
1. `Android` 通过Bridge（内挂各种API方法）的方式进行调用，如 `window.mkbridge.['method'](params)`。
2. `iOS` 通过自定义 `Scheme`（如`native://method?data=JSON`）方式调用。
3. 需要回调的接口需要将函数名称在调用时一并传给客户端，同时将回调函数通过唯一名称挂在全局，待客户端执行回调后移除该全局函数。


## WebView/UIWebView支持
***
`WebView`/`UIWebView` 开启以下属性支持
- enable `Javascript`
- `localStorage` & `sessionStorage`
- `AppCache` / `manifest` (离线缓存)
- `webview` 默认不开启横屏

## UserAgent
***

起用mike公司辨识的`useragent`,同时区分android/IOS, something like this:

```js	
 // Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_1_2 like Mac OS X; zh-cn; mike/2.8.0) AppleWebKit/528.18 (KHTML, like Gecko) Version/4.0 Mobile Safari/528.16
 // Mozilla/5.0 (Linux; U; Android 4.1.1; zh-cn; MI 2 Build/JRO03L; mike/2.8.0) AppleWebKit/528.18 (KHTML, like Gecko) Version/4.0 Mobile Safari/528.16
```
> 请参照规范格式设置`WebView`的`UserAgent`，避免页面进行设备适配时取不到该字段的值或者取到的信息不正确。


# Bridge 协议
## 1.Native 跳转
***
### 方法名: `goNative`
跳转Native原生页面
### 参数
```javascript
//入参
{
    "ios":"HotelDetail", //类名
    "android":{
        "activity":"hotel.HotelDetailActivity"//类名
        "fragment":"" //fragment名
    },
    "param":{
        "hotelid":"123"//hotelid
        "isOnePromo":"1" //是否1元特价
    }
}

//返回值
```
*参数枚举如下:*

| 页面	      | activity	                     | fragment	                  | ios       |
| ------------- | :------------------------------  | :------------------------- | :---------- |
| 酒店详情       | hotel.HotelDetailActivity          | 	                   | HotelDetail |
| 酒店列表	     | hotel.HotelMapListActivity         | 	                     | HotelList |
| 特价酒店列表    | hotel.HotelPromotionActivity      | 		                 | HotelNightList |
| 主题	        | hotel.HotelActivity	           | HotelThemeListFragment	| HotelThemeList |
| 登录	        | login.LoginActivity                | 		                | Login  |
| 订单详情	  | order.OrderActivity	               | OrderDetailsFragment	| OrderDetail |
| 订单列表	  | order.OrderActivity	               | OrderFragment	             | OrderList |
| 用户中心	  | usercenter.UserCenterActivity	     | UserCenterFragment	    | MineHome |
| 优惠券列表	    | coupon.CouponListActivity	         |	                          | MineCoupon |
| 我的消息列表	| usercenter.UserCenterActivity	     | MyNewsFragment	        | MineMessage |
| 我的余额	  | usercenter.UserCenterActivity	 | MyCostFragment	        | MineBalance |
| 我的酒店	  | hotel.MyHotelsActivity	        | 	                          | MineHotel |
| 反馈	        | usercenter.UserCenterActivity	 | OpinionErronReportFragment	| MineSuggestion |

## 2.分享
*** 
### 方法名: `goShare`
调用原生分享
### 参数
```javascript
{
    "title":"大标题",
    "description":"描述",
    "imageUrl":"http://www.baidu.com",//图片Url
    "url":"http://www.baidu.com",//跳转Url
}

//返回值
{
    
}
```


## 3.获取用户登录信息
*** 
### 方法名: `getUserInfo`
调用原生分享
### 参数
```javascript
//入参
{
}

//返回值
{
    "usertoken":"sdflsdafjla",//token
    "phone":"18523482912",//电话
    "unionid":"123",//微信unionid,如未绑定为空
}
```

## 4 loading层

*** 
### 方法名: `startLoading`/`stopLoading`
菊花开启/菊花关闭
### 参数
### 参数
```javascript
//入参
{
}

//返回值
{
}
```