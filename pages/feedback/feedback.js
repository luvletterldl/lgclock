// pages/feedback/feedback.js
const uploadService = require("../../service/upload.js");
const env = require("../../env.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fonts: 0,
    ccs: 0,
    images: [],
    cctx: '',
    suggestion: '',
  },

  //events
  inputfd: function (e) {
    this.setData({
      fonts: e.detail.cursor,
      suggestion: e.detail.value,
    })
  },
  inputcc: function (e) {
    this.setData({
      ccs: e.detail.cursor,
      cctx: e.detail.value,
    })
  },
  chooseimg: function () {
    wx.chooseImage({
      count: 4 - this.data.images.length,
      sizeType: ['original', 'compressed'],
      success: (res) => {
        console.log(res)
        this.setData({
          images: this.data.images.concat(res.tempFilePaths),
        })
      },
    })
  },
  delimg: function (e) {
    this.setData({
      images: this.data.images.splice(e.target.id, 1),
      images: this.data.images
    })
  },
  submit: function () {
    if (this.data.fonts == 0) {
      wx.showModal({
        title: '提示',
        content: '意见不能为空',
        showCancel: false,
      })
    } else if (this.data.ccs == 0) {
      wx.showModal({
        title: '提示',
        content: '联系方式不能为空',
        showCancel: false,
      })
    } else {
      //上传图片，获取图片url，提交反馈
      let that = this
      uploadService.batchFBUpload(this.data.images, "uploadfdimg", function (urls) {
        that.setData({ imgurls: urls })
        console.log(that.data.imgurls, 'urls')
        let suggestion = that.data.suggestion
        let cctx = that.data.cctx
        let imgurls = that.data.imgurls.toString()
        //upload
        wx.request({
          url: env.domain + "/api/clock/suggestion/?access_token=" + wx.getStorageSync(env.atKey),
          method: 'POST',
          data: {
            "suggestion": suggestion,
            "contact": cctx,
            "img": imgurls,
          },
          success: function (e) {
            console.log(e)
            wx.showModal({
              title: '反馈成功',
              content: '感谢您对小瓜时钟的关注与支持，我们将会认真处理你的反馈，尽快修复和完善相关功能。',
              showCancel: false,
              success: (res) => {
                if(res.confirm){
                  wx.navigateTo({
                    url: '../clockcd/clockcd',
                  })
                }
              }
            })
          }
        })
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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