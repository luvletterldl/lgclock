// pages/countdown/countdown.js
var cd = null
var ttemp = null, instemp = null, setTime = null, tips = null, fasetest = null
var pausetoplay = false

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

    recdbtn: '重新计时',
    sharebtn: '推荐给朋友',

    fintime: '',

    insistime: '',

    leftbtns: 'hidden',
    midbtns: "block",
    rightbtns: 'hidden',

    waring: 'none',
    finished: 'none',
    areysure: 'none',

    leftbtn: '暂停计时',
    midbtn: '开始倒计时',
    rightbtn: '放弃',

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
  },
  back: function () {
    console.log('back')
    this.setData({
      clock: 'show',
      codo: '',
      tocd: 'block',
      toclock: 'none',
    })
  },

  toCountdown: function () {
    console.log('tocd')
    this.setData({
      codo: 'show',
      clock: '',
      toclock: 'block',
      tocd: 'none',
    })
  },

  //events
  tofdbk: function () {
    wx.navigateTo({
      url: '../feedback/feedback',
    })
  },

  msgswitch: function () {
    if(this.data.othermsg == 'show'){
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

  // recountdown
  recdbtn: function () {
    this.setData({
      recdbtns: 'none',
      sharebtns: 'none',
      midbtns: 'block',
    })
    this.setData({
      add: '',
      reduce: '',
    })
  },
  // 取消放弃
  cancel: function () {
    this.setData({
      areysure: 'none',
      //取消放弃，还原按钮状态
      pausedis: false,
      abortdis: false,
    })
    this.leftbtn()
  },
  // 确定放弃
  confirm: function () {
    this.setData({
      areysure: 'none',
      leftbtns: 'hidden',
      rightbtns: 'hidden',
      midbtns: 'block',
      ho: '0',
      ht: '0',
      mo: '0',
      mt: '0',
      so: '0',
      st: '0',
    })
    clearInterval(cd)
    ttemp = null
    this.setData({
      add: '',
      reduce: '',
    })
  },
  // //recover
  // recover: function () {
  //   this.setData({
  //     dontfast: 'none',
  //     pausedis: false,
  //     abortdis: false,
  //   })
  // },

  // pause & recover
  leftbtn: function () {
    // if(fasetest == null){
    //   fasetest = new Date().getTime();
    // }else {
    //   if(parseInt(new Date().getTime() - fasetest) < 350){
    //     this.leftbtn()
    //     this.setData({ 
    //       // dontfast: 'block',
    //       pausedis: true,
    //       abortdis: true,
    //     })
    //     setTimeout(() => {
    //       console.log('11111111s')
    //       this.setData({
    //         // dontfast: 'none',
    //         pausedis: false,
    //         abortdis: false,
    //       })
    //     },2000)
    //   }
    // }
    pausetoplay = !pausetoplay
    if (pausetoplay) {
      clearInterval(cd)
      this.setData({ leftbtn: '恢复计时' })
      console.log('pause')
    } else {
      this.setData({ leftbtn: '暂停计时' })
      console.log('go on')
      cd = setInterval(() => {
        ttemp = ttemp - 1000
        console.log(ttemp)
        if (ttemp < 1000) {
          clearInterval(cd)
          this.setData({
            finished: 'block',
            //弹出提示时，按钮不可用
            recddis: true,
            sharedis: true,
          })
        }
        let surplus = new Date(ttemp);
        let ho = surplus.Format('hh').charAt(0)
        let ht = surplus.Format('hh').charAt(1)
        let mo = surplus.Format('mm').charAt(0)
        let mt = surplus.Format('mm').charAt(1)
        let so = surplus.Format('ss').charAt(0)
        let st = surplus.Format('ss').charAt(1)
        console.log(surplus, so, st)
        this.setData({
          ho: ho,
          ht: ht,
          mo: mo,
          mt: mt,
          so: so,
          st: st,
        })
      }, 1000)
    }

  },
  //放弃
  rightbtn: function () {
    // 如果是已暂停状态什么都不做，否则暂停
    if(pausetoplay){
    }else{
      this.leftbtn()
    }
    instemp = setTime - ttemp
    let insistime = null;
    if (parseInt(new Date(instemp).Format('h')) > 0) {
      insistime = new Date(instemp).Format('h小时m分钟s秒')
    } else if (parseInt(new Date(instemp).Format('h')) == 0 && parseInt(new Date(instemp).Format('m')) > 0) {
      insistime = new Date(instemp).Format('m分钟s秒')
    } else {
      insistime = new Date(instemp).Format('s秒')
    }
    this.setData({
      areysure: 'flex',
      insistime: insistime,
      //弹出框后，按钮不可用
      pausedis: true,
      abortdis: true,
    })
  },
  //finished tips
  closefin: function () {
    this.setData({
      finished: 'none',
      leftbtns: 'hidden',
      rightbtns: 'hidden',
      recdbtns: 'block',
      sharebtns: 'block',
      // 点击确定后，恢复按钮功能
      recddis: false,
      sharedis: false,
    })
    clearInterval(cd)
  },
  //countdown
  midbtn: function () {
    ttemp = this.data.ho * 36000 * 1000 + this.data.mo * 600 * 1000 + this.data.so * 10000 +
      this.data.ht * 3600 * 1000 + this.data.mt * 60 * 1000 + this.data.st * 1000
    setTime = ttemp
    console.log(ttemp)
    if (ttemp < 1000) {
      this.setData({
        waring: 'block',
      })
      setTimeout(() => {
        this.setData({
          waring: 'none'
        })
      }, 1200)
    } else {
      //hidden add reduce
      this.setData({
        add: 'hidden',
        reduce: 'hidden',
        pausedis: false,
        abortdis: false,
      })
      console.log(ttemp)
      let fintime = null;
      if (parseInt(new Date(ttemp).Format('h')) > 0) {
        fintime = new Date(ttemp).Format('h小时m分钟s秒')
      } else if (parseInt(new Date(ttemp).Format('h')) == 0 && parseInt(new Date(ttemp).Format('m')) > 0) {
        fintime = new Date(ttemp).Format('m分钟s秒')
      } else {
        fintime = new Date(ttemp).Format('s秒')
      }
      this.setData({
        leftbtns: 'block',
        rightbtns: 'block',
        midbtns: 'hidden',
        fintime: fintime,
      })
      cd = setInterval(() => {
        ttemp = ttemp - 1000
        console.log(ttemp)
        if (ttemp < 1000) {
          wx.vibrateLong({})
          clearInterval(cd)
          this.setData({
            finished: 'block',
            leftbtns: 'hidden',
            rightbtns: 'hidden',
            recdbtns: 'block',
            sharebtns: 'block',
            // 弹出窗口后，禁用按钮
            recddis: true,
            sharedis: true,
          })
          console.log('before play')
          tips.play()
          tips.onPlay((e) => {
            console.log('start play', e, tips)
          })
          tips.onError((e) => {
            console.log('err', e)
          })
        }
        let surplus = new Date(ttemp);
        let ho = surplus.Format('hh').charAt(0)
        let ht = surplus.Format('hh').charAt(1)
        let mo = surplus.Format('mm').charAt(0)
        let mt = surplus.Format('mm').charAt(1)
        let so = surplus.Format('ss').charAt(0)
        let st = surplus.Format('ss').charAt(1)
        console.log(surplus, so, st)
        this.setData({
          ho: ho,
          ht: ht,
          mo: mo,
          mt: mt,
          so: so,
          st: st,
        })
      }, 1000)
    }
  },
  // add hour
  addh: function () {
    let ht = parseInt(this.data.ht)
    let ho = parseInt(this.data.ho)
    if (parseInt(this.data.ht) < 9 && ho < 2) {
      this.setData({
        ht: ht += 1
      })
    } else if (ho < 2) {
      this.setData({
        ho: ho += 1,
        ht: '0'
      })
    } else if (ho == 2) {
      if (ht < 4) {
        this.setData({
          ht: ht += 1
        })
      } else {
        this.setData({
          ho: '0',
          ht: '0'
        })
      }
    }
    console.log(this.data.ho, this.data.ht)
  },
  // add min
  addm: function () {
    let mo = parseInt(this.data.mo)
    let mt = parseInt(this.data.mt)
    if (parseInt(this.data.mt) < 9 && mo < 5) {
      this.setData({
        mt: mt += 1
      })
    } else if (mo < 5) {
      this.setData({
        mo: mo += 1,
        mt: '0'
      })
    } else if (mo == 5) {
      if (mt < 9) {
        this.setData({
          mt: mt += 1
        })
      } else {
        this.setData({
          mo: '0',
          mt: '0'
        })
      }
    }
    console.log(this.data.mo, this.data.mt)
  },
  // add seco
  adds: function () {
    let so = parseInt(this.data.so)
    let st = parseInt(this.data.st)
    if (parseInt(this.data.st) < 9 && so < 5) {
      this.setData({
        st: st += 1
      })
    } else if (so < 5) {
      this.setData({
        so: so += 1,
        st: '0'
      })
    } else if (so == 5) {
      if (st < 9) {
        this.setData({
          st: st += 1
        })
      } else {
        this.setData({
          so: '0',
          st: '0'
        })
      }
    }
    console.log(this.data.so, this.data.st)
  },
  // reduce hour
  redch: function () {
    let ho = parseInt(this.data.ho)
    let ht = parseInt(this.data.ht)
    if (ht > 0) {
      this.setData({
        ht: ht -= 1,
      })
    } else if (ht == 0 && ho > 0) {
      this.setData({
        ho: ho -= 1,
        ht: '9'
      })
    } else {
      this.setData({
        ho: '2',
        ht: '4'
      })
    }
    console.log(this.data.ho, this.data.ht)
  },
  // reduce min
  redcm: function () {
    let mo = parseInt(this.data.mo)
    let mt = parseInt(this.data.mt)
    if (mt > 0) {
      this.setData({
        mt: mt -= 1,
      })
    } else if (mt == 0 && mo > 0) {
      this.setData({
        mo: mo -= 1,
        mt: '9'
      })
    } else {
      this.setData({
        mo: '5',
        mt: '9'
      })
    }
    console.log(this.data.mo, this.data.mt)
  },
  // reduce seco
  redcs: function () {
    let so = parseInt(this.data.so)
    let st = parseInt(this.data.st)
    if (st > 0) {
      this.setData({
        st: st -= 1,
      })
    } else if (st == 0 && so > 0) {
      this.setData({
        so: so -= 1,
        st: '9'
      })
    } else {
      this.setData({
        so: '5',
        st: '9'
      })
    }
    console.log(this.data.so, this.data.st)
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    setTimeout(() => {
      this.setData({
        clock: 'show',
      })
    },1000)
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
    setInterval(() => {
      let time = new Date()
      let apm = ['AM', 'PM']
      let h = time.getHours()
      let m = time.getMinutes()
      if (h < 12) { //设置上下午
        this.setData({ apm: apm[0], })
      } else { this.setData({ apm: apm[1] }) }
      if(h > 12) { //如果时大于12就-12
        h = h - 12
      }
      let lenh = h.toString().length
      let lenm = m.toString().length
      if (lenh == 1) h = '0' + h
      if (lenm == 1) m = '0' + m
      let cho = h.toString().charAt(0)
      let cht = h.toString().charAt(1)
      let cmo = m.toString().charAt(0)
      let cmt = m.toString().charAt(1)
      this.setData({
        cho: cho,
        cht: cht,
        cmo: cmo,
        cmt: cmt,
      })
    }, 1000)


    tips = wx.createInnerAudioContext()
    tips.src = 'https://cdn2.didiapp.com/calendar/video/tips.mp3'
    tips.autoplay = false
    tips.volume = 0.8
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

})