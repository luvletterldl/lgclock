// pages/countdown/countdown.js
var ttemp = null, blbl = null, setTime = null;
import sets from '../../settings.js'
import imgs from '../../utils/resource/base64/imgbs64.js'
Date.prototype.Format = function (fmt) {
  var o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours() - 8,
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    'S': this.getMilliseconds()
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
  }
  return fmt
}
Page({
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

  /**
   * 页面的初始数据
   */
  data: {

    othermsg: 'show',
    calfbtrans: '',

    dontfast: 'none',

    animationData: {},

    apm: '',

    recddis: false,
    pausedis: false,
    begindis: false,
    abortdis: false,
    sharedis: false,

    tocd: 'block',
    toclock: 'none',

    clock: 'hidden',
    codo: '',

    add: '',
    reduce: '',

    recdbtns: 'none',
    sharebtns: 'none',

    fintime: '',

    insistime: '',

    ho: '0',
    ht: '0',
    mo: '0',
    mt: '0',
    so: '0',
    st: '0',

    calendar: '',
    trans: '',

    week: '',
    mouth: '',
    day: '',
    year: '',

    cho: '0',
    cht: '0',
    cmo: '0',
    cmt: '0',

    bgcolors: [],
    navigationBar: '#000000',

    //hm / hms
    hmShow: false,
    apmShow: true,
    dateShow: true,
    weekShow: true,
    secShow: false,

    secblbl: true,

    cal: false,
    ste: false,

    showS: [false, true, true, true],
    //guides img
    guides: imgs.imgs.guides,
    guideshow: false,

  },
  //events
  toset: function () {
    wx.navigateTo({
      url: '../setting/setting',
    })
  },

  closeGuide: function() {
    this.setData({ guideshow: false})
  },

  msgswitch: function () {
    if (this.data.othermsg == 'show') {
      this.setData({
        othermsg: 'hidden',
        calfbtrans: 'hidden',
      })
    } else {
      this.setData({
        othermsg: 'show',
        calfbtrans: '',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.getStorage({
      key: 'settings',
      success(res) {
        wx.setNavigationBarColor({
          frontColor: '#ffffff', // 必写项
          backgroundColor: res.data.sets.theme.nativeBar, // 必写项
        })
        that.setData({
          showS: res.data.sets.switchs,
        })
        let nowPure = res.data.sets.theme.choosed
        if (nowPure == 'defaul') { 
          that.setData({ bgcolors: sets.sets.theme.defaul,})}
        else if (nowPure == 'white') {
          that.setData({ bgcolors: sets.sets.theme.white, })}
        else if (nowPure == 'blue') { 
          that.setData({ bgcolors: sets.sets.theme.blue,})}
        else if (nowPure == 'peach') { 
          that.setData({ bgcolors: sets.sets.theme.peach, })} 
        else if (nowPure == 'mi') {
          that.setData({ bgcolors: sets.sets.theme.mi, })}
      },
      fail(err) {
        wx.setStorage({
          key: 'settings',
          data: sets,
        })
        console.log(sets.sets.theme.defaul)
        that.setData({
          bgcolors: sets.sets.theme.defaul
        })
        wx.setNavigationBarColor({
          frontColor: '#ffffff', // 必写项
          backgroundColor: '#000000', // 必写项
        })
        that.setData({ guideshow : true})
      }
    })
    setTimeout(() => {
      this.setData({
        clock: 'show',
      })
    }, 1200)
    let ani = wx.createAnimation({})
    this.ani = ani
    this.ani.rotate(180).translate(-50, -200).step({ duration: 1000 })
    this.setData({
      animationData: this.ani.export()
    })
    // 屏幕常亮
    wx.setKeepScreenOn({
      keepScreenOn: true,
    })

    //share
    wx.showShareMenu({
      withShareTicket: true,
      success: function (e) {
        if (e.confirm) {
          console.log('share success')
        }
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
    let that = this
    let reloadF = null

    //设置时间在onShow中,防止在设置页面停留时间过长导致回到此页面秒钟快速跳动bug
    let weekday = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    let dates = new Date()
    let ttemp = dates.toString().split(' ');
    let mouth = ("0" + (dates.getMonth() + 1)).slice(-2);
    let day = weekday[dates.getDay()]
    setInterval(() => {
      this.setData({
        year: ttemp[3] + '年',
        mouth: mouth + '月',
        day: ttemp[2] + '日',
        week: day,
      })
    }, 1000)
    setTime = setInterval(() => {
      let time = new Date()
      let apm = ['AM', 'PM']
      let h = time.getHours()
      let m = time.getMinutes()
      let s = time.getSeconds()
      if (h < 12) { //设置上下午
        this.setData({ apm: apm[0], })
      } else { this.setData({ apm: apm[1] }) }
      if (h > 12 && !this.data.showS[0]) { //如果时大于12就-12
        h = h - 12
      }
      let lenh = h.toString().length
      let lenm = m.toString().length
      let lens = s.toString().length
      if (lenh == 1) h = '0' + h
      if (lenm == 1) m = '0' + m
      if (lens == 1) s = '0' + s
      let cho = h.toString().charAt(0)
      let cht = h.toString().charAt(1)
      let cmo = m.toString().charAt(0)
      let cmt = m.toString().charAt(1)
      let cso = s.toString().charAt(0)
      let cst = s.toString().charAt(1)
      this.setData({
        cho: cho,
        cht: cht,
        cmo: cmo,
        cmt: cmt,
        cso: cso,
        cst: cst,
        
      })
    }, 1000)

    blbl = setInterval(()=>{
      this.setData({
        secblbl: !this.data.secblbl
      })
    }, 1000)
    wx.getStorage({
      key: 'settings',
      success: function(res) {
        reloadF = res.data.sets.switchs
        if (that != reloadF){
          that.onLoad();
        }
      },
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(blbl)
    clearInterval(setTime)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(blbl)
    clearInterval(setTime)
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

})