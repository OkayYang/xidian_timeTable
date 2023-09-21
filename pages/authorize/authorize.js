// pages/authorize/authorize.js
import Toast from '@vant/weapp/toast/toast';

const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		host: app.globalData.host,
		avatarUrl: null,
		nameShow: false,
		name: null,

	},
	login(e) {
		this.setData({
			nameShow: true,
		});
		const {
			avatarUrl
		} = e.detail
		console.log(avatarUrl)
		wx.uploadFile({
			filePath: avatarUrl,
			name: 'file',
			url: this.data.host + '/wx/file/upload',
			success: (res) => {
				let resp = JSON.parse(res.data)
				if (resp.code == 200) {
					console.log(resp.data)
					this.setData({
						avatarUrl: resp.data
					})
				}
			}
		})
		this.setData({
			avatarUrl,
		})
	},
	isValidName(name) {
		// 匹配非中文、字母和数字的字符，包括空格和其他特殊符号
		var regex = /[^\u4e00-\u9fa5a-zA-Z0-9]/g;
		return !regex.test(name);
	},

	wxlogin(){
		wx.login({
				success(res) {
					if (res.code) {
						//发起网络请求
						wx.request({
							url: that.data.host + '/wx/user/login',
							method: 'POST',
							data: {
								code: res.code,
								
							},
							success: (res) => {
								if (res.data.code == 200) {
									let data = res.data.data
									wx.setStorage({
										key: "user",
										data: data.ncUser,
										success: (res) => {
											wx.setStorage({
												key: "token",
												data: data.token,
												success: (res) => {
													Toast({
														type: 'success',
														message: '登录成功',
														onClose: () => {
															wx.navigateBack()
														},
													});
												}
											})

										}
									})

								} else {
									Toast.fail("登录失败!")
								}
								console.log(res)
							}
						})
					} else {
						Toast.fail("登录失败!")
						console.log('登录失败！' + res.errMsg)
					}
				}
			})
		
	},

	//name

	onNameConfirm() {
		let that = this
		let name = this.data.name
		//提交登录
		if (this.isValidName(name) && name != null) {
			this.setData({
				name: name,
			})
			console.log(name, this.data.avatarUrl)
			wx.login({
				success(res) {
					if (res.code) {
						//发起网络请求
						wx.request({
							url: that.data.host + '/wx/user/login',
							method: 'POST',
							data: {
								code: res.code,
								avatarUrl: that.data.avatarUrl,
								nickName: name
							},
							success: (res) => {
								if (res.data.code == 200) {
									let data = res.data.data
									wx.setStorage({
										key: "user",
										data: data.ncUser,
										success: (res) => {
											wx.setStorage({
												key: "token",
												data: data.token,
												success: (res) => {
													Toast({
														type: 'success',
														message: '登录成功',
														onClose: () => {
															wx.navigateBack()
														},
													});
												}
											})

										}
									})

								} else {
									Toast.fail("登录失败!")
								}
								console.log(res)
							}
						})
					} else {
						Toast.fail("登录失败!")
						console.log('登录失败！' + res.errMsg)
					}
				}
			})

		} else {
			Toast.fail("格式错误")
		}
		this.setData({
			nameShow: false,
			name: null
		})

	},

	onNameCancel() {
		this.setData({
			nameShow: false,
			name: null,
		});
	},

	onNameInput(event) {
		this.setData({
			name: event.detail,
		});
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		wx.getStorage({
			key: 'user',
			success: (res) => {
				wx.navigateBack()
			}
		})


	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady() {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow() {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide() {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload() {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh() {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom() {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage() {

	},
	//执行登录
  doWechatLogin: function () {
    let _this = this
    //通过微信接口获取用户基本&加密信息
    if (!wx.getUserProfile) {
      wx.showToast({
        title: '微信版本过低，请先升级微信版本',
        icon: 'none',
        duration: 4000
      })
      return
    }
    wx.getUserProfile({
      lang: 'zh_CN',
      desc: '获取您的头像和昵称',
      success: (wechatInfo) => {
				console.log(wechatInfo)
        wx.showLoading({
          title: '正在登录',
          mask: true
        })
        if (!wechatInfo.encryptedData || !wechatInfo.iv) {
          wx.showToast({
            title: '微信版本过低，请先升级微信版本',
            icon: 'none',
            duration: 4000
          })
          return
        }
        wechatLogin({
          code: _this.data.code,
          encryptedData: wechatInfo.encryptedData,
          iv: wechatInfo.iv
        }).then((resolve) => {
          if (resolve.status == 0) {
            app.msg("登录成功", "success")
            wx.setStorageSync('login_session', resolve.data.session)
            wx.setStorageSync('user_id', resolve.data.stu_id)
            wx.setStorageSync('user_info', resolve.data.info)
            if (!resolve.data.stu_id) {
              wx.redirectTo({
                url: '/pages/bind/bind?redirect=' + _this.data.redirect,
              })
              setTimeout(() => {
                app.msg('请绑定教务系统账号')
              }, 500);
              return
            }
            updateAndGetCourseList()
            setTimeout(() => {
              loginRedirect(_this.data.redirect)
            }, 1000)
          }
        }).catch((error) => {
          _this.getCode()
          app.msg(error.message)
        })
      },
      fail: (err) => {
        console.error(err)
        app.msg("您拒绝了授权，无法正常登录")
      }
    })
  }
})