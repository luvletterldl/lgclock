var base = require("base.js");

function updateUserInfo(encrypted_data, iv, callback){
  base.verifiedRequest({
    path: "/api/miniprog/v1/userinfo/ensure",
    method: "POST",
    data: { encrypted_data, iv},
    success: function(res){
      callback&&callback(res)
    }
  });
}

function loadUserInfo(callback) {
  base.verifiedRequest({
    path: "/api/miniprog/v1/userinfo/load",
    method: "GET",
    data: {},
    success: function (res) {
      callback && callback(res)
    }
  });
}

module.exports = {
  updateUserInfo: updateUserInfo,
  loadUserInfo: loadUserInfo
}
