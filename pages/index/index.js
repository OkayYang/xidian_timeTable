// index.js
import Toast from '@vant/weapp/toast/toast';
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		nihao: '<div>Hello World!</div>',
		host: app.globalData.host,
		active: 0,
		rollText: '技术是开发它的人的共同灵魂。',
		swiperList: [
			
		],
		typeList: [

		]
	},

	/**
	 * 标签点击
	 * @param {*} event 
	 */
	onChange(event) {
		// wx.showToast({
		//   title: `切换到标签 ${event.detail.name}`,
		//   icon: 'none',
		// });
	},
	/**
	 * 轮播图点击
	 * @param {}} e 
	 */
	articleClick(e) {
		let id =e.detail.id!=null? e.detail.id:e.currentTarget.dataset.id
		wx.navigateTo({
			url: '/pages/detail/detail?id='+id,
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad:  function (options) {
		 this.initData()

	},
	initData() {
		Toast.loading({
			duration: 800, // 持续展示 toast
			forbidClick: true,
			message: '加载中',
		});

		wx.request({
			url: this.data.host + '/wx/notice/roll',
			success: (res) => {
				if (res.data.code == 200) {
					this.setData({
						rollText: res.data.data.noticeTitle
					})
				}
			}
		})
		wx.request({
			url: this.data.host + '/wx/article/swiper',
			success: (res) => {
				if (res.data.code == 200) {
					let data = res.data.data
					let list = []
					for (let index = 0; index < data.length; index++) {

						list.push({
							url: this.data.host + data[index].articleCover,
							id: data[index].articleId
						})
					}
					this.setData({
						swiperList: list
					})
				}
			}
		})
		wx.request({
			url: this.data.host + '/wx/article/type',
			success: (res) => {
				if (res.data.code == 200) {
					let data = res.data.data
					this.setData({
						typeList: data
					})

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
		wx.showNavigationBarLoading();
		this.initData()
		wx.hideNavigationBarLoading();
		//停止下拉刷新
		wx.stopPullDownRefresh();

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})