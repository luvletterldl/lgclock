var base = require("base.js")

function preorder(params, callback) {
  base.verifiedRequest({
    path: '/api/miniprog/v1/preorder/detail/',
    data: params,
    method: 'POST', 
    forceWait: true,
    success: function(res){
      callback(res);
      console.log(res)
    },
    fail: function (res) { //.errMsg
      console.log(res)
      wx.showModal({title: "错误", content: res.errMsg});
    }
  })
}

module.exports = {
    preorder: preorder
}
