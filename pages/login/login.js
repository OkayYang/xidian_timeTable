//login.js
//获取应用实例
import Toast from '@vant/weapp/toast/toast';
var app = getApp();
var domain = app.globalData.host;
Page({
  data: {
    remind: '加载中',
    help_status: false,
    reset_status: false,
    userid_focus: false,
    passwd_focus: false,
    // vcode_focus: false,
    idcard_focus: false,
    userid: '',
    passwd: '',
    // vcode: '',
    // cookie: '',
    // vcodeUrl: '',
    idcard: '',
    angle: 0,
    percent: 0,
    costSeconds: 0,
    //验证码
    isVerification: false,
    bigImage:null,
    smallImage:null,
    isneed:false,
    cookies:null,
    clltValue:"userNameLogin",
    dlltValue: "generalLogin",
    ltValue: "",
    exeValue:"",

  },
  onVerifyHandler(event){
    let that = this
    var componentInstance  = event.detail.componentInstance;
    var spanValue = Math.round(event.detail.span);
    console.log('Received span:', spanValue);
    wx.request({
      url: domain+'/wx/xdu/verifyCaptcha',
      method:'POST',
      data:{
        cookies:JSON.stringify(that.data.cookies),
        username:that.data.userid,
        span:spanValue
      },
      success:(res)=>{
        console.log(res)
        if(res.data.code==200){
          componentInstance.setData({
            'status':1
          })
          Toast({
            type: 'success',
            message: '验证成功',
            onClose: () => {
              this.setData({
                isVerification:false
              })
              this.xdulogin()
              componentInstance.setData({
                'slider.left':0,
                'status':-1
              })

            },
          });
        }else{
          componentInstance.setData({
            'status':0
          })
          Toast({
            type: 'fail',
            message: '验证失败',
            onClose: () => {
              this.refreshCaptcha()
              componentInstance.setData({
                'slider.left':0,
                'status':-1
              })
      
            },
          });
          
          
        }
      }

    })

  },
  xdulogin(){
    let that =this
    if (!this.vaildForm()) {
      return
    }
    Toast({
      type: 'loading',
      message: '登录中...',
      duration: 0, // 持续展示 toast
      forbidClick: true
    });
    
		wx.login({
			success(res) {
				if (res.code) {
					//发起网络请求
					wx.request({
						url: domain + '/wx/user/login',
            method: 'POST',
						data: {
              code: res.code,
              username:that.data.userid,
              password:that.data.passwd,
              cookies:JSON.stringify(that.data.cookies),
              clltValue:that.data.clltValue,
              dlltValue:that.data.dlltValue,
              exeValue:that.data.exeValue,
              ltValue:that.data.ltValue,
						},
						success: (res) => {
							if (res.data.code == 200) {
                let data = res.data.data
                
								wx.setStorage({
									key: "user",
									data: data.ncUser,
									success: (res) => {
										wx.setStorage({
											key: "cookies",
											data: data.cookies,
											success: (res) => {
                        wx.setStorage({
                          key:'token',
                          data:data.token,
                          success:(res)=>{
                            Toast({
                              type: 'success',
                              message: '登录成功',
                              forbidClick: true,
                              onClose: () => {
                                wx.navigateBack()
                              },
                            });
                          }
                        })
                   
											}
										})

									}
                })
                let json = JSON.parse(data.kcb)
                json = json.datas.xspkjgcx.rows
                let list = []
                for (let i = 0; i < json.length; i++) {
                    let prop = json[i]
                    let data = {
                        "XQ": prop.XQ,
                        "KCMC": prop.KCMC,//课程名称
                        "ZCMC": prop.ZCMC,//周数
                        "JASMC": prop.JASMC,//教室
                        "JSJCDM": prop.JSJCDM,//第几节
                        "JSXM":prop.JSXM,//老师
                        "SKFSDM_DISPLAY":prop.SKFSDM_DISPLAY//上课方式

                    }
                    list.push(data)
                }
                wx.setStorage({
                  key:'kcb',
                  data:list
                })

							} else {
								Toast.fail("登录失败，请重新尝试!")
							}
					
						}
					})
				} else {

					Toast.fail("网络异常!")
					console.log('登录失败！' + res.errMsg)
				}
      },
      fail(res){
        console.log(res)
      }
    })

  },
	verifylogin(){
		let that =this
    if (!this.vaildForm()) {
      return
    }
    wx.request({
      url: domain+'/wx/xdu/checkNeedCaptcha?username='+that.data.userid,
      success:(res)=>{
        let data = res.data;
        console.log(data)
        this.setData({
          clltValue:data.clltValue,
          dlltValue:data.dlltValue,
          exeValue:data.exeValue,
          ltValue:data.ltValue
        })
        if(data.need){
          this.refreshCaptcha(that.data.userid)
          this.setData({
            isVerification:true
          })

        }
      }
    })
  },
  refreshCaptcha(username){
    wx.request({
      url: domain+'/wx/xdu/openSliderCaptcha?username='+username,
      success:(res)=>{
        this.setData({
          bigImage:'data:image/png;base64,'+res.data.bigImage,
          smallImage:'data:image/png;base64,'+res.data.smallImage,
          cookies:res.data.cookies
        })
        wx.setStorage({
          key:'cookies',
          data:res.data.cookies
        })
      }
    })
  },
  onLoad: function () {
  },
  onReady: function () {
    try {
      const edusysUserInfo = wx.getStorageSync('edusysUserInfo') || {}
      if (edusysUserInfo.name.length > 0) wx.switchTab({ url: './index' })
    } catch (error) {
      // this.getCookie();
    }

    var _this = this;
    setTimeout(function () {
      _this.setData({ remind: '' })
    }, 100);
    wx.onAccelerometerChange(function (res) {
      var angle = -(res.x * 30).toFixed(1);
      if (angle > 14) { angle = 14; }
      else if (angle < -14) { angle = -14; }
      if (_this.data.angle !== angle) {
        _this.setData({ angle: angle });
      }
    });
  },
  getUserInfo: function () {
    if (!this.vaildForm()) {
      return
    }
    // 登录进度条
    const _this = this
    const interval = 500
    var progress = setInterval(function () {
      let costSeconds = _this.data.costSeconds
      costSeconds = costSeconds + (interval * 2)
      const percent = (costSeconds / app.globalData.requestTimeout * 100).toFixed(2)
      if (parseInt(percent) < 90) _this.setData({ costSeconds: costSeconds, percent: percent })
    }, interval)
    this.login({}, progress);
  },
  vaildForm: function () {
    var uid = this.data.userid;
    var password = this.data.passwd;
    // var cookie = this.data.cookie;
    // var vcode = this.data.vcode;
    if (uid.length < 1) {
      wx.showToast({
        title: '请输入教务网账号',
        icon: 'none'
      })
      return false;
    }
    if (password.length < 1) {
      wx.showToast({
        title: '请输入教务网密码',
        icon: 'none'
      })
      return false
    }
    return true;
  },
  login: function (userInfo, progress) {
    var _this = this
    _this.setData({ remind: '加载中' })
    var uid = this.data.userid
    var password = this.data.passwd
    wx.request({
      url: `${domain}/edu/profile`,
      data: {
        uid: uid,
        pwd: password,
        userFrom: 'wechat',
        openid: app.globalData.openid
      },
      timeout: app.globalData.requestTimeout,
      method: 'POST',
      success: function (res) {
        // console.log('eduSysProfile：', res.data)
        try {
          if (res.data.name.length > 1) {
            _this.setData({ costSeconds: 0, percent: 100 })
            clearInterval(progress)
            res.data.password = password
            wx.setStorage({ data: res.data, key: 'edusysUserInfo' })
            app.globalData.edusysUserInfo = res.data
            wx.vibrateShort({ type: 'medium' })
            setTimeout(function () { wx.switchTab({ url: './index' }) }, 1000);
          }
        } catch (error) {
          // _this.getCookie();
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 5000
          })
          _this.setData({ remind: '' });
        }
      },
      fail: function (fail) {
        if (fail.errMsg == 'request:fail timeout') {
          wx.showToast({
            title: '失败了，要不要再试一次？',
            icon: 'none',
            duration: 5000
          })
          _this.setData({ remind: '' });
        }
      }
    })
  },

  showResetModal: function () {
    this.setData({
      help_status: false,
      reset_status: true
    })
  },
  closeResetModal: function () {
    this.setData({
      reset_status: false
    })
  },
  getCookie: function () {
    // 解脱了，不用输入验证码了
    // var _this = this;
    // wx.request({
    //   url: `${domain}/edu/cookie`,
    //   success: function(res) {
    //     _this.setData({
    //       vcode: res.data.vcodeOcr,
    //       cookie: res.data.cookie,
    //       vcodeUrl: res.data.vcode
    //     })
    //   }
    // })
  },
  useridInput: function (e) {
    this.setData({
      userid: e.detail.value
    });
    if (e.detail.value.length >= 11) {
      wx.hideKeyboard();
    }
  },
  passwdInput: function (e) {
    this.setData({
      passwd: e.detail.value
    });
  },
  // vcodeInput: function(e) {
  //   this.setData({
  //     vcode: e.detail.value
  //   });
  // },
  idcardInput: function (e) {
    this.setData({
      idcard: e.detail.value
    });
  },
  inputFocus: function (e) {
    if (e.target.id == 'userid') {
      this.setData({
        'userid_focus': true
      });
    } else if (e.target.id == 'passwd') {
      this.setData({
        'passwd_focus': true
      });
      // }else if(e.target.id == 'vcode'){
      //   this.setData({
      //     'vcode_focus': true
      //   });
    } else if (e.target.id == 'idcard') {
      this.setData({
        'idcard_focus': true
      });
    }
  },
  inputBlur: function (e) {
    if (e.target.id == 'userid') {
      this.setData({
        'userid_focus': false
      });
    } else if (e.target.id == 'passwd') {
      this.setData({
        'passwd_focus': false
      });
      // }else if(e.target.id == 'vcode'){
      //   this.setData({
      //     'vcode_focus': false
      //   });
    } else if (e.target.id == 'idcard') {
      this.setData({
        'idcard_focus': false
      });
    }
  },
  tapHelp: function (e) {
    if (e.target.id == 'help') {
      this.hideHelp();
    }
  },
  showHelp: function (e) {
    this.setData({
      'help_status': true
    });
  },
  hideHelp: function (e) {
    this.setData({
      'help_status': false
    });
  }
  
});