// pages/countdown/countdown.js
var cd = null
var ttemp = null, instemp = null, setTime = null, tips = null
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
      console.log(res.target,'from page')
    } else{
      console.log('from right top')
    }
    return {
      title: '我在用这款横屏翻页时钟，还有倒计时功能。',
      path: '/pages/clock/clock',
      imageUrl: '../../utils/resource/image/share.jpg',
      success: (res) => {
        console.log('share success', res)
      },
      fail: (res) => {
        console.log('share fail', res)
      }
    }
  },

  back: function () {
    // wx.navigateBack()
    wx.navigateTo({
      url: '../clock/clock'
    })
  },

  /**
   * 页面的初始数据
   */
  data: {

    add: '',
    reduce: '',

    recdbtns: 'none',
    sharebtns:'none',

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
  },

  //events
  // recountdown
  recdbtn: function (){
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
  // pause & recover
  leftbtn: function () {
    pausetoplay = !pausetoplay
    if (pausetoplay){
      clearInterval(cd)
      this.setData({ leftbtn: '恢复计时' })
      console.log('pause')
    }else {
      this.setData({ leftbtn: '暂停计时' })
      console.log('go on')
      cd = setInterval(() => {
        ttemp = ttemp - 1000
        console.log(ttemp)
        if (ttemp < 1000) {
          clearInterval(cd)
          this.setData({
            finished: 'block'
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
    this.leftbtn()
    instemp = setTime - ttemp
    let insistime = null;
    if (parseInt(new Date(instemp).Format('h')) > 0){
      insistime = new Date(instemp).Format('h小时m分钟s秒')
    } else if (parseInt(new Date(instemp).Format('h')) == 0 && parseInt(new Date(instemp).Format('m')) > 0) {
      insistime = new Date(instemp).Format('m分钟s秒')
    } else {
      insistime = new Date(instemp).Format('s秒')
    }
    this.setData({
      areysure: 'block',
      insistime: insistime,
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
    })
    clearInterval(cd)
  },
  //countdown
  midbtn: function () {
    ttemp = this.data.ho * 36000 * 1000 + this.data.mo * 600 * 1000 + this.data.so * 10000 +
                this.data.ht * 3600 * 1000 + this.data.mt * 60 * 1000 + this.data.st * 1000
    setTime = ttemp
    console.log(ttemp)
    if (ttemp < 1000){
      this.setData({
        waring: 'block'
      })
      setTimeout(() => {
        this.setData({
          waring: 'none'
        })
      }, 1200)
    }else {
      //hidden add reduce
      this.setData({
        add: 'hidden',
        reduce: 'hidden',
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
          })
          tips.play()
          // tips.onPlay((e) => {
          //   console.log('start play', e, tips)
          // })
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
    if (parseInt(this.data.ht) < 9 && ho < 2){
      this.setData({
        ht: ht += 1
      })
    } else if(ho < 2) {
      this.setData({
        ho: ho += 1,
        ht: '0'
      })
    } else if(ho == 2){
      if(ht < 4){
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
    if(ht > 0){
      this.setData({
        ht: ht -= 1,
      })
    } else if(ht == 0 && ho > 0){
      this.setData({
        ho: ho -=1,
        ht: '9'
      })
    } else {
      this.setData({
        ho: '2',
        ht: '4'
      })
    }
    console.log(this.data.ho,this.data.ht)
  },
  // reduce min
  redcm: function () {
    let mo = parseInt(this.data.mo)
    let mt = parseInt(this.data.mt)
    if(mt > 0){
      this.setData({
        mt: mt -= 1,
      })
    } else if(mt == 0 && mo > 0){
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
    console.log(this.data.mo,this.data.mt)
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
    tips = wx.createInnerAudioContext()
    tips.src = 'https://cdn2.didiapp.com/calendar/video/tips.mp3'
    tips.autoplay = false
    tips.volume = 0.8
    wx.setKeepScreenOn({
      keepScreenOn: true,
    })
    console.log(new Date().getTime())
    //share
    wx.showShareMenu({
      withShareTicket: true,
      success: function (e) {
        if(e.confirm){
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