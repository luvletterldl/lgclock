// pages/clock/clock.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    calendar: '',
    trans: '',

    week: 'Fir',
    mouth: 'Aug',
    day: '22',
    year: '2018',

    ho: '0',
    ht: '0',
    mo: '0',
    mt: '0',
  },

  // events
  toCountdown: function () {
    wx.navigateTo({
      url: '../countdown/countdown'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setKeepScreenOn({
      keepScreenOn: true,
    })

    let ttemp = new Date().toString().split(' ');
    setInterval(() => {
      this.setData({
        week: ttemp[0],
        mouth: ttemp[1],
        day: ttemp[2],
        year: ttemp[3],
      })
    }, 1000)
    setInterval(() => {
      let time = new Date()
      let h = time.getHours()
      let m = time.getMinutes()
      let lenh = h.toString().length
      let lenm = m.toString().length
      if (lenh == 1) h = '0' + h
      if (lenm == 1) m = '0' + m
      let ho = h.toString().charAt(0)
      let ht = h.toString().charAt(1)
      let mo = m.toString().charAt(0)
      let mt = m.toString().charAt(1)
      this.setData({
        ho: ho,
        ht: ht,
        mo: mo,
        mt: mt,
      })
    }, 1000)
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log(res.target, 'from page')
    } else {
      console.log('from right top')
    }
    return {
      title: '我在用这款横屏翻页时钟，还有倒计时功能。',
      path: '/pages/clock/clock',
      success: (res) => {
        console.log('share success', res)
      },
      fail: (res) => {
        console.log('share fail', res)
      }
    }
  },
})