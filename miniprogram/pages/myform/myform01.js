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
    canIUse: wx.canIUse('button.open-type.getUserInfo')
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

                    //获取数据库中用户全部信息
                    console.log('yunuserinfo后用户信息拉取 失败 ', app.globalData.openid)
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
          } else {
            // //未授权,要重新登录
            // wx.switchTab({
            //   url: 'myform01',
            // })

          }
        }
      })

    },
    onGetUserInfo: function (e) {
      if (!this.data.logged && e.detail.userInfo) {
        this.setData({
          logged: true,
          avatarUrl: e.detail.userInfo.avatarUrl,
          userInfo: e.detail.userInfo
        })
      }
    },
    //点击登录成功之后,调用的页面
    bindGetUserInfo: function (e) {
      if (!this.data.logged && e.detail.userInfo) {
        this.setData({
          logged: true,
          avatarUrl: e.detail.userInfo.avatarUrl,
          userInfo: e.detail.userInfo
        })
      }
      wx.switchTab({
        url: 'myform01',
      })
    },
    //点击登录
    onGetOpenid: function () {
      console.log('start 点击登录')
      // wx.login({
      //   complete: (res) => {
      //     wx.getUserInfo({

      //     })
      //   },
      // })


    }
  },

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