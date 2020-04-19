//app.js
App({
  onLaunch: function () {
    var that = this
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env:"fireman-84f8l",
        traceUser: true,
      })
    }
    this.globalData = {
      localUserInfo:null,
      openid:null,
      serverUserInfo:null,
      Session_key:null
    }
  }
})
