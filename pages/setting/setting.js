// pages/setting/setting.js
import settings from '../../settings.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkeds: [false, true, true, true],
  },

  twtotw(e) {
    let that = this
    if(e.detail.value){
      //12 to 24
      wx.getStorage({
        key: 'settings',
        success: function(res) {
          console.log(res.data)
          let setT = res.data
          setT.sets.switchs[0] = true
          that.setData({
            checkeds: setT.sets.switchs
          })
          console.log(that.data.checkeds)
          wx.setStorage({
            key: 'settings',
            data: setT,
            success(res){
              console.log(res)
            }
          })
        },
      })
    } else {
      //24 to 12
      wx.getStorage({
        key: 'settings',
        success: function (res) {
          console.log(res.data)
          let setT = res.data
          setT.sets.switchs[0] = false
          that.setData({
            checkeds: setT.sets.switchs
          })
          console.log(that.data.checkeds)
          wx.setStorage({
            key: 'settings',
            data: setT,
            success(res) {
              console.log(res)
            }
          })
        },
      })
    }
  },

  showSecond(e){
    let that = this
    if (e.detail.value) {
      //show sec
      wx.getStorage({
        key: 'settings',
        success: function (res) {
          console.log(res.data)
          let setT = res.data
          setT.sets.switchs[1] = true
          that.setData({
            checkeds: setT.sets.switchs
          })
          console.log(that.data.checkeds)
          wx.setStorage({
            key: 'settings',
            data: setT,
            success(res) {
              console.log(res)
            }
          })
        },
      })
    } else {
      //hidden sec
      wx.getStorage({
        key: 'settings',
        success: function (res) {
          console.log(res.data)
          let setT = res.data
          setT.sets.switchs[1] = false
          that.setData({
            checkeds: setT.sets.switchs
          })
          console.log(that.data.checkeds)
          wx.setStorage({
            key: 'settings',
            data: setT,
            success(res) {
              console.log(res)
            }
          })
        },
      })
    }
  },
  
  showDate(e) {
    let that = this
    if (e.detail.value) {
      //show date
      wx.getStorage({
        key: 'settings',
        success: function (res) {
          console.log(res.data)
          let setT = res.data
          setT.sets.switchs[2] = true
          that.setData({
            checkeds: setT.sets.switchs
          })
          console.log(that.data.checkeds)
          wx.setStorage({
            key: 'settings',
            data: setT,
            success(res) {
              console.log(res)
            }
          })
        },
      })
    } else {
      //hidden date
      wx.getStorage({
        key: 'settings',
        success: function (res) {
          console.log(res.data)
          let setT = res.data
          setT.sets.switchs[2] = false
          that.setData({
            checkeds: setT.sets.switchs
          })
          console.log(that.data.checkeds)
          wx.setStorage({
            key: 'settings',
            data: setT,
            success(res) {
              console.log(res)
            }
          })
        },
      })
    }
  },
  showWeek(e) {
    let that = this
    if (e.detail.value) {
      //show week
      wx.getStorage({
        key: 'settings',
        success: function (res) {
          console.log(res.data)
          let setT = res.data
          setT.sets.switchs[3] = true
          that.setData({
            checkeds: setT.sets.switchs
          })
          console.log(that.data.checkeds)
          wx.setStorage({
            key: 'settings',
            data: setT,
            success(res) {
              console.log(res)
            }
          })
        },
      })
    } else {
      //hidden week
      wx.getStorage({
        key: 'settings',
        success: function (res) {
          console.log(res.data)
          let setT = res.data
          setT.sets.switchs[3] = false
          that.setData({
            checkeds: setT.sets.switchs
          })
          console.log(that.data.checkeds)
          wx.setStorage({
            key: 'settings',
            data: setT,
            success(res) {
              console.log(res)
            }
          })
        },
      })
    }
  },


  tochoose: function (){
    wx.navigateTo({
      url: '../themes/themes',
    })
  },
  feedback: function() {
    wx.navigateTo({
      url: '../feedback/feedback',
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.getStorage({
      key: 'settings',
      success: function(res) {
        that.setData({
          checkeds: res.data.sets.switchs
        })
      },
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
  onShareAppMessage: function (res) {
    return {
      title: '我在用这款桌面全屏时钟，还有倒计时功能。',
      path: '/pages/clockcd/clockcd',
      imageUrl: '../../utils/resource/image/share.jpg',
      success: (res) => {
        console.log('share success', res)
      },
      fail: (res) => {
        console.log('share fail', res)
      }
    }
  },
})