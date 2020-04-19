const app = getApp()

Component({

  //页面数据
  data: {
    avatarUrl: '/images/user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    theName: '点击登录',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    getPhoneNub:'默认手机'
  },
  methods: {
    onLoad: function () {

      // 获取用户信息 自动判断,如果授权过了就不用再弹出请求授权
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框      
            wx.getUserInfo({
              success: res => {
                console.log('已经授权 后用户信息拉取 ', res)
                app.globalData.localUserInfo = res
                //页面再设置好登录信息
                this.setData({
                  avatarUrl: res.userInfo.avatarUrl,
                  userInfo: res.userInfo,
                  theName: res.userInfo.nickName
                })
                //获取OpenId 放在Gloab中
                wx.cloud.callFunction({
                  name: 'login',
                  data: {},
                  success: res => {
                    console.log('[云函数] [login] user openid: ', res.result.openid)
                    app.globalData.openid = res.result.openid
                    app.globalData.Session_key=res.result.Session_key
                   //得到服务器上登录用户的全部信息
                    wx.cloud.callFunction({
                      name: "yunuserinfo",
                      data: {
                        uOpenid: app.globalData.openid
                      },
                      success(res) {
                        console.log('yunuserinfo后用户信息拉取 ', res)
                        app.globalData.serverUserInfo = res
                      }
                    })
                  }
                })
              }
            })
          } 
        }
      })
    },
    //点击登录成功之后,调用的页面
    bindGetUserInfo: function (e) {
     //第一次授权后,得到Openid放到数据库中去啊
     //获取OpenId 放在Gloab中
     wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('第一次授权后,得到Openid放到数据库中去啊', res.result.openid)
        app.globalData.openid = res.result.openid
      }})
      console.log('1111修改图标和显示昵称')
      //修改图标和显示昵称
      if (!this.data.logged && e.detail.userInfo) {
        this.setData({
          logged: true,
          avatarUrl: e.detail.userInfo.avatarUrl,
          userInfo: e.detail.userInfo
        })
      }     
    }
  },
///
getPhoneNumber(e) {
  var msg = e.detail.errMsg, that = this;
  var that = this;
  var sessionID=that.app.globalData.Session_key,
  encryptedDataStr=e.detail.encryptedData,
  iv= e.detail.iv;
  if (msg == 'getPhoneNumber:ok') {
    wx.checkSession({
      success:function(){
        that.deciyption(sessionID,encryptedDataStr,iv);
      },
      fail:function(){
        wx.login({
          success: res => {
            console.log(res,'sessionkey过期')
            wx.request('url',{code:res.code},function(res){
              var userinfo=res.data.data;
              wx.setStorageSync('userinfo',userinfo);
              that.setData({
                userinfo:userinfo
              });
              that.deciyption(userinfo.Session_key,encryptedDataStr,iv);
            })
          }
        })
      }
    })
  }
},
deciyption(sessionID,encryptedDataStr,iv){
  wx.request('url', {
    sessionID: sessionID,
    encryptedDataStr:encryptedDataStr,
    iv: iv
  }, function (res) {
  //这个res即可返回用户的手机号码
  })
},
///



  //这是TabBar控件页
  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 0
        })
      }
    }
  }
})