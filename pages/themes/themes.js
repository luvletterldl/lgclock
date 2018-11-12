// pages/themes/themes.js
import sets from '../../settings.js'
Page({


  /**
   * 页面的初始数据
   */
  data: {
    pures: [
      { pngs: 'defaul', status: true},
      { pngs: 'white', status: false},
      { pngs: 'blue', status: false},
      { pngs: 'peach', status: false},
      { pngs: 'mi', status: false},
    ],
  },

  setTheme(e){
    let that = this
    console.log(e)
    if(!e.target.dataset.status) {
      let nowPure = null 
      let nb = null;
      let puresT = []
      wx.getStorage({
        key: 'settings',
        success: function(res) {
          nowPure = res.data
          console.log(res.data)
          if (e.target.dataset.pure == 'defaul') { nb = '#000000'}
          else if (e.target.dataset.pure == 'white') { nb = '#000000'}
          else if (e.target.dataset.pure == 'blue') { nb = '#8ba4ff'}
          else if (e.target.dataset.pure == 'peach') { nb = '#eb5159'}
          else if (e.target.dataset.pure == 'mi') { nb = '#f3f3f3'}
          nowPure.sets.theme.choosed = e.target.dataset.pure
          nowPure.sets.theme.nativeBar = nb
          for (let item of that.data.pures){
            console.log(item.pngs, item.status,)
            if (item.pngs == e.target.dataset.pure) {
              item.status = !item.status
            } else {
              item.status = false
            }
            puresT.push({'pngs': item.pngs, 'status': item.status})
          }
          that.setData({
            pures: puresT
          })
          wx.setStorage({
            key: 'setheme',
            data: puresT,
          })
          wx.setStorage({
            key: 'settings',
            data: nowPure,
            success(){
              wx.reLaunch({
                url: '../clockcd/clockcd',
              })
              wx.setNavigationBarColor({
                frontColor: '#ffffff', // 必写项
                backgroundColor: nb, // 必写项
              })
            }
          })
        },
      })
      // console.log(e.target.dataset, this.data.pures, typeof (e.target.dataset), typeof(this.data.pures), e.target.dataset in this.data.pures)
      
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.getStorage({
      key: 'setheme',
      success(res) {
        console.log(res.data)
        that.setData({
          pures: res.data
        })
      },
      fail(){
        wx.setStorage({
          key: 'setheme',
          data: that.data.pures,
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