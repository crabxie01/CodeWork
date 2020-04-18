// pages/fireMan/fireman.js

const app = getApp()
let db=wx.cloud.database()

Page({

  /**报销费用，只能输入数值 */
  handleInput(e) {
    let value = this.validateNumber(e.detail.value)
    this.setData({
      value
    })
  },
validateNumber(val) {
    return val.replace(/\D/g, '')
  },
  
  

  /**
   * 页面的初始数据
   */
  data: {
    sqr:{},
    UserName:{},
    OthName:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this;
    let userData=db.collection("UserInfo").where(
      {Phone:'18071066601'}
    ).get({
      success:function(res){
        console.log(res)
        that.setData({
          OthName : res.data[0].Email,
      })
    }    
  })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})