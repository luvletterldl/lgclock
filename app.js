//app.js
var wxuserService = require("service/wxuser.js");
var env = require("env.js");
App({
  authLogin: function (callback) {
    var that = this;
    wx.login({
      // 向微信服务器发起登陆请求
      success: function (res) {
        // console.log('res', res)
        if (res.code && res.code != "the code is a mock one") {
          // 向python部落发起登陆请求
          wx.request({
            url: env.domain + '/api/miniprog/v1/auth/',
            method: "POST",
            data: {
              code: res.code,
              prog_name: "default",
              app_id: 'wx7ed0d2dfd956d148',
            },
            success: function (res) {
              // console.log('xxxx', res)
              // 请求成功存储AC
              wx.setStorageSync(env.atKey,
                res.data.data.access_token);
              // 获取用户信息
              // that.getUserInfo()
              if (callback) {
                callback();
              }
            },
            fail: function (res) {
              // python部落服务器认证失败
              console.log(res)
            }
          })
        } else {
          // 微信服务器认证失败
          console.log(res.code)
        }
      },
      fail: function (res) {
        // 认证接口调用失败，检查网络
        console.log(res)
      }
    });
    login();
  },
  getSysinfo: function () {
    wx.getSystemInfo({
      success: (res) => {
        wx.setStorageSync('platform', res.platform)
      }
    })
  },
  ensureLogin: function (callback) {
    var that = this;
    wx.checkSession({
      // 登陆态未过期
      success: function () {
        // that.getUserInfo()
        // AC不存在则重新请求AC并重新登陆
        if (!wx.getStorageSync(env.atKey)) {
          that.authLogin(callback);
        } else {
          if (callback) {
            callback();
          }
        }
      },
      fail: function () {
        //登录态过期，重新登陆认证
        that.authLogin(callback);
      }
    })
  },
  onLaunch: function () {
    var that = this;
    this.getSysinfo()
    // that.getUserInfo()
    this.ensureLogin();
  },

  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      // 调用登录接口
      wx.getUserInfo({
        success: function (res) {
          wxuserService.updateUserInfo(res.encryptedData, res.iv)
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    platform: "ios"
  }
})