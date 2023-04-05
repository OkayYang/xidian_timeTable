// pages/contestDetail/contestDetail.js
import Toast from '@vant/weapp/toast/toast';
import Dialog from '@vant/weapp/dialog/dialog';
import Notify from '@vant/weapp/notify/notify';
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		host: app.globalData.host,
		contest: null,
		token: null,
		userInfo: null,
	},
	contestEnroll(e) {
		let id = e.currentTarget.dataset.id
		if (this.data.token != null) {
			let user = this.data.userInfo
			if ((!this.strIsNull(user.uXh) && !this.strIsNull(user.uName) && !this.strIsNull(user.uMajor) && !this.strIsNull(user.uDepartment) && !this.strIsNull(user.uClassname)) || !this.strIsNull(user.remark)) {
				wx.request({
					url: this.data.host + '/wx/contest/enroll/add?id=' + id,
					header: {
						token: this.data.token
					},
					success: (res) => {
						if (res.data.code == 200) {
							this.setData({
								['contest.status']: 1
							})
							Notify({ type: 'success', message: '报名成功' });
						} else {
							Notify({ type: 'fail', message: '报名失败' });
						}
					},
					fail: (res) => {
						Notify({ type: 'fail', message: '服务器异常' });
					}
				})
			} else {

				Dialog.confirm({
					title: '提示',
					message: '请先完善教务信息后才可报名',
				})
					.then(() => {
						wx.navigateTo({
							url: '/pages/edit/edit',
						})
						// on confirm
					})
					.catch(() => {
						// on cancel
					});
			}

		} else {
			this.validLogin()
		}


	},
	validLogin() {
		wx.getStorage({
			key: "user",
			success: (res) => {
				//console.log(res)
				this.setData({
					//userInfo: JSON.parse(res.data)
					userInfo: res.data
				})
				wx.getStorage({
					key: "token",
					success: (res) => {
						this.setData({
							token: res.data
						})
					}
				})

			},
			fail: (res) => {

				Dialog.alert({
					title: '提示',
					message: '请先授权登录',
				})
					.then(() => {
						if (this.data.userInfo == null) {
							this.loginbtn()
						}

					})

			}
		})

	},
	strIsNull(str) {
		if (str == null || str == '') {
			return true;
		} else {
			return false;
		}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		
		Toast.loading({
			duration: 800, // 持续展示 toast
			message: '加载中...',
			forbidClick: true,
			loadingType: 'spinner',
		});
		let cid = options.cid;
		console.log(cid)
		if (cid != null) {
			wx.getStorage({
				key: "token",
				success: (res) => {
					//console.log(res)
					this.setData({
						//userInfo: JSON.parse(res.data)
						token: res.data
					})
					wx.getStorage({
						key: "user",
						success: (res) => {
							this.setData({
								userInfo: res.data
							})
						},
						
					})
				},
				complete:(res)=>{
					wx.request({
						url: this.data.host + '/wx/contest/detail?cid=' + cid,
						header: {
							token: this.data.token
						},
						success: (res) => {
							if (res.data.code == 200) {
								this.setData({
									contest: res.data.data
								})
							}
						},
						complete: (res) => {
							Toast.clear()
						}
					})
				}
			})
			
		}
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
		wx.getStorage({
			key: "user",
			success: (res) => {
				//console.log(res)
				this.setData({
					//userInfo: JSON.parse(res.data)
					userInfo: res.data
				})
				wx.getStorage({
					key: "token",
					success: (res) => {
						this.setData({
							token: res.data
						})
					}
				})

			}
		})

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