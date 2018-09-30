var base = require("base.js");

function uploadOverviewPic(params, callback) {
  base.verifiedRequest({
    path: "/api/jigsaw/v1/upload/overview/",
    method: "POST",
    data: params,
    forceWait: true,
    success: function (res) {
      callback && callback(res)
    }
  });
}

function uploadBuildingPics(params, callback) {
  base.verifiedRequest({
    path: "/api/jigsaw/v1/upload/building/",
    method: "POST",
    data: params,
    forceWait: true,
    success: function (res) {
      callback && callback(res)
    }
  });
}

function getDetail(params, callback) {
  base.verifiedRequest({
    path: "/api/jigsaw/v1/jigsaw/detail/",
    method: "GET",
    data: params,
    success: function (res) {
      callback && callback(res)
      console.log(res)
    }
  });
}

module.exports = {
  uploadOverviewPic: uploadOverviewPic,
  uploadBuildingPics: uploadBuildingPics,
  getDetail: getDetail
}
