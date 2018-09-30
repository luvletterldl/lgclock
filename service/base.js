var env = require("../env.js");
var platform = wx.getStorageSync('platform');

function reLogin(config, callback) { // 请求AC
  wx.login({
    success: function (res) {  // 请求code服务器成功
      if (res.code && res.code != "the code is a mock one") {
        // 请求code成功
        wx.request({ // 请求AC
          url: env.domain + '/api/miniprog/v1/auth/',
          method: "POST",
          data: {
            code: res.code,
            prog_name: "default",
            app_id: 'wx7ed0d2dfd956d148',
          },
          success: function (res) { // 请求AC成功
            console.log(res)
            wx.setStorageSync(env.atKey, res.data.data.access_token); // 设置 AC
            actualFBRequest(config) // 继续请求
          },
          fali: function (res) { // 请求AC失败，检查网络
            wx.showModal({ content: `请检查网络${res}` })
          }
        })
      } else {  // 请求code失败，检查参数或服务器
        wx.showModal({
          content: `${res.code}`
        })
      }
    },
    fail: function (res) {
      wx.showModal({
        content: `${res}`
      }) // 请求code服务器失败,检查网络
    }
  });
}

function actualRequest(config) {
  var success = function (res) { // 请求成功回调
    if (config.forceWait) {
      wx.hideLoading({});
    } else if (platform == "ios" && config.ioscd) {
      wx.hideLoading({})
    } else {
      wx.hideNavigationBarLoading()
    }
    if (res.data.status == "ok") { // 数据正常取回
      if (config.success) {
        config.success(res.data.data);
      }
    } else if (res.data.status == "access_token_expired") { //AC 过期,未取回数据

      if (wx.getStorageSync(env.atKey)) { // 如果 AC 存在则设置 AC 为空,避免并发请求新AC
        wx.setStorageSync('access_token', null)
        reLogin(config)
        return
      } else { // AC 不存在(被上一轮请求置空),处理并发请求,再次发起请求(actualRequest已包含轮询)
        actualRequest(config);
      }
    } else { // 服务器错误,检查参数或服务器
      if (config.fail) {
        config.fail(res.data.msg)
      } else {
        wx.showModal({
          title: "提示",
          content: `${res.data.msg}`,
          showCancel: false
        })
      }
    }
  }
  var fail = function (res) { //请求失败,请检查网络
    if (config.forceWait) {
      wx.hideLoading({})
    } else if (platform == "ios" && config.ioscd) {
      wx.hideLoading({})
    } else {
      wx.hideNavigationBarLoading()
    }
    wx.showModal({ title: "提示", content: `请求失败:请检查网络` + res.errMsg, showCancel: false });
  }
  var time = setInterval(function () {  // 500ms 轮询 AC
    if (wx.getStorageSync(env.atKey)) { // AC 存在
      var arg = {
        url: env.domain + config.path,
        data: config.data,
        header: { "Access-Token": wx.getStorageSync(env.atKey) },  //取 AC
        method: config.method,
        success: success,
        fail: fail
      }
      clearInterval(time); //取消轮询
      wx.request(arg) //发起请求

      if (config.forceWait) {
        wx.showLoading({
          title: "加载中",
          mask: true
        })
      } else if (platform == "ios" && config.ioscd) {
        wx.showLoading({
          title: "加载中"
        })
      } else {
        wx.showNavigationBarLoading()
      }
    }
  }, 500)
}

function actualFBRequest(config) {
  console.log('config:' + JSON.stringify(config))
  var success = function (res) { // 请求成功回调
    console.log('res' + JSON.stringify(res))
    wx.hideLoading({})
    // if (platform == "ios" && config.ioscd) {
    // } else {
    //   wx.hideNavigationBarLoading()
    // }
    if (res.data.msg == "ok") { // 数据正常取回
      console.log('123')
      if (config.success) {
        config.success(res.data.data);
      }
    } else if (res.data.msg == "access token 无效") { //AC 过期,未取回数据

      if (wx.getStorageSync(env.atKey)) { // 如果 AC 存在则设置 AC 为空,避免并发请求新AC
        wx.setStorageSync('access_token', null)
        reLogin(config)
        return
      } else { // AC 不存在(被上一轮请求置空),处理并发请求,再次发起请求(actualRequest已包含轮询)
        actualRequest(config);
      }
    } else { // 服务器错误,检查参数或服务器
      if (config.fail) {
        config.fail(res.data.msg)
      } else {
        wx.showModal({
          title: "提示",
          content: `${res.data.msg}`,
          showCancel: false
        })
      }
    }
  }
  var fail = function (res) { //请求失败,请检查网络
    if (config.forceWait) {
      wx.hideLoading({})
    } else if (platform == "ios" && config.ioscd) {
      wx.hideLoading({})
    } else {
      wx.hideNavigationBarLoading()
    }
    wx.showModal({ title: "提示", content: `请求失败:请检查网络` + res.errMsg, showCancel: false });
  }
  var time = setInterval(function () {  // 500ms 轮询 AC
    if (wx.getStorageSync(env.atKey)) { // AC 存在
      var arg = {
        url: env.domain + config.path,
        data: config.data,
        header: { "Access-Token": wx.getStorageSync(env.atKey) },  //取 AC
        method: config.method,
        success: success,
        fail: fail
      }
      clearInterval(time); //取消轮询
      wx.request(arg) //发起请求

      if (config.forceWait) {
        wx.showLoading({
          title: "加载中",
          mask: true
        })
      } else if (platform == "ios" && config.ioscd) {
        wx.showLoading({
          title: "加载中"
        })
      } else {
        wx.showNavigationBarLoading()
      }
    }
  }, 500)
}

function verifiedRequest(config) {
  actualRequest(config);
}

function verifiedFBRequest(config) {
  actualFBRequest(config);
}
module.exports = {
  verifiedRequest: verifiedRequest,
  verifiedFBRequest: verifiedFBRequest,
}
