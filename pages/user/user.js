// pages/user/user.js
import Toast from '@vant/weapp/toast/toast';
import Dialog from '@vant/weapp/dialog/dialog';
import Notify from '@vant/weapp/notify/notify';
const app = getApp()

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		loadding: false,
		loaddingText: '到底了',
		host: app.globalData.host,
		active: 0,
		topics: null,
		comments: null,
		bisais: null,
		userInfo: null,


	},
	onChange(event) {
		// wx.showToast({
		//   title: `切换到标签 ${event.detail.name}`,
		//   icon: 'none',
		// });
	},

	loginbtn() {
		wx.navigateTo({
			url: '/pages/authorize/authorize',
		})
	},
	onClose(event) {
		const { position, instance } = event.detail;
		let tid = event.currentTarget.dataset.tid
		wx.request({
			url: this.data.host + '/wx/topic/list/my/del?tid=' + tid,
			header: {
				token: this.data.userInfo.token
			},
			success: (res) => {
				if (res.data.code == 200) {
					// 成功通知
					Notify({
						type: 'success',
						message: '删除成功'
					});
					this.initData()
				}

			},
			fail:(res)=>{
				// 危险通知
Notify({ type: 'danger', message: '删除失败' });
			}
		})
		instance.close();

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		wx.getStorage({
			key: "user",
			success: (res) => {
				console.log(res)
				this.setData({
					userInfo: JSON.parse(res.data)
					//userInfo:res.data
				})
				this.initData()
			},
			fail: (res) => {
				Dialog.confirm({
						title: '提示',
						message: '请先授权登录',
					})
					.then(() => {
						this.loginbtn()
					})
					.catch(() => {
						wx.switchTab({
							url: '/pages/index/index',
						})
					});

			}
		})


	},
	initData() {
		if (this.data.userInfo != null) {
			const token = this.data.userInfo.token
			wx.request({
				url: this.data.host + '/wx/topic/list/my',
				header: {
					token: token
				},
				success: (res) => {
					console.log(res)
					if (res.data.code == 200) {
						this.setData({
							topics: res.data.data
						})

					}
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
		if(this.data.topics!=null){
			this.initData()
		}
		
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