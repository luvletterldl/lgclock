var base = require("base.js");
var env = require("../env.js")

// use FB
function getUploadToken(usage, successCallback, failCallback) {
  base.verifiedRequest({
    path: "/api/miniprog/v1/upload/token",
    method: "POST",
    data: { usage: usage },
    success: function (res) {
      successCallback && successCallback(res);
      console.log(res)
    },
    fail: function (msg) {
      failCallback && failCallback(msg);
      console.log(msg)
    }
  });
}

function singleUpload(tmpPath, usage, successCallback, failCallback) {
  if (tmpPath.indexOf("http://tmp/") < 0 && tmpPath.indexOf("wxfile://") < 0) {
    successCallback && successCallback(tmpPath);
    return;
  }
  wx.showLoading({
    title: usage,
    mask: true
  });
  getUploadToken(usage, function (token_res) {
    var token = token_res["token"]
    var key = token_res["key"]
    var url = token_res["url"]
    console.log(token_res, '123')
    wx.uploadFile({
      url: 'https://upload.qiniup.com/',
      filePath: tmpPath,
      name: 'file',
      formData: { "token": token, "key": key },
      success: function (res) {
        wx.hideLoading();
        successCallback && successCallback(url);
      },
      fail: function (msg) {
        wx.hideLoading();
        failCallback && failCallback(msg);
      }
    })
  }, function (errorMsg) {
    wx.hideLoading();
    failCallback && failCallback(errorMsg);
  })
}

function batchUpload(tmpPaths, usage, successCallback, failCallback) {
  if (tmpPaths.length == 0) {
    successCallback([])
    return;
  }
  var taskIndex = 0;
  var urls = [];
  function doTask() {
    var progress_intro = "上传中(" + (taskIndex + 1) + "/" + tmpPaths.length + ")";
    singleUpload(tmpPaths[taskIndex], progress_intro, function (url) {
      urls.push(url);
      taskIndex += 1;
      if (taskIndex >= tmpPaths.length) {
        successCallback(urls);
        console.log(urls)
      } else {
        doTask();
      }
    }, function (msg) {
      failCallback(msg);
    })
  }
  doTask();
}
function getFBulToken(usage, completeCallback) {
  console.log('enter');
  base.verifiedFBRequest({
    path: "/api/clock/img/token/",
    method: "POST",
    data: { usage: usage },
    success: function (res) {
      console.log('asddsadasd', res)
      completeCallback && completeCallback(res);
    }
  });
}
function singleFBUpload(tmpPath, usage, completeCallback) {
  if (tmpPath.indexOf("http://tmp/") < 0 && tmpPath.indexOf("wxfile://") < 0) {
    completeCallback && completeCallback(tmpPath);
    return;
  }
  wx.showLoading({
    title: usage,
    mask: true
  });
  getFBulToken(usage, function (res) {
    console.log('sssssss')
    console.log('ppp', res)
    var token = res.data.token;
    var key = res.data.key;
    var url = res.data.url;
    wx.uploadFile({
      url: 'https://upload.qiniup.com/',
      filePath: tmpPath,
      name: 'file',
      formData: { "token": token, "key": key },
      complete: function (res) {
        wx.hideLoading();
        completeCallback && completeCallback(url);
        console.log(url)
      },
    })
  },
  )
}


function batchFBUpload(tmpPaths, usage, completeCallback) {
  if (tmpPaths.length == 0) {
    console.log('tp', tmpPaths, JSON.stringify(tmpPaths))
    completeCallback([])
    return;
  }
  console.log('tp', tmpPaths, JSON.stringify(tmpPaths))
  var taskIndex = 0;
  var urls = [];
  function doTask() {
    var progress_intro = "上传中(" + (taskIndex + 1) + "/" + tmpPaths.length + ")";
    singleFBUpload(tmpPaths[taskIndex], progress_intro, function (url) {
      urls.push(url);
      console.log('urls' + JSON.stringify(urls) + url)
      taskIndex += 1;
      if (taskIndex >= tmpPaths.length) {
        completeCallback(urls);
        console.log(urls)
      } else {
        doTask();
      }
    }
    )
  }
  doTask();
}


module.exports = {
  getUploadToken: getUploadToken,
  getFBulToken: getFBulToken,
  singleUpload: singleUpload,
  singleFBUpload: singleFBUpload,
  batchUpload: batchUpload,
  batchFBUpload: batchFBUpload
}
