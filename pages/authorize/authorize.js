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

	}
})