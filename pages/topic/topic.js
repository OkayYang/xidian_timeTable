// pages/topic/topic.js
import Toast from '@vant/weapp/toast/toast';
import Dialog from '@vant/weapp/dialog/dialog';
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		loadding: false,
		loaddingText: '到底了',
		active: 0,
		host: app.globalData.host,
		typeList: [],
		topicList: [],
		pageSize:0,
		pageNum:5,
		isEnd:false,
		token:null

	},
	ViewImage(e) {
		console.log(e)
		wx.previewImage({
			urls:e.currentTarget.dataset.urls,
			current: e.currentTarget.dataset.url
		});
	},
	detailTopic(event){
		wx.navigateTo({
			url: '/pages/detailTopic/detailTopic?tid='+event.currentTarget.dataset.tid,
		})
	},
	addTopicBtn() {
		let that = this
		if (this.data.token != null) {
			wx.navigateTo({
				url: '/pages/addTopic/addTopic',
				events: {
					// 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
					// acceptDataFromOpenedPage: function(data) {
					// 	console.log(data)
					// },	
				},
				success: function (res) {
					// 通过eventChannel向被打开页面传送数据
					//res.eventChannel.emit('topicList', { data:that.data.typeList})
				}
			})
		} else {
			Dialog.confirm({
					title: '提示',
					message: '请先授权登录',
				})
				.then(() => {
					wx.navigateTo({
						url: '/pages/authorize/authorize',
					})
				})
				.catch(() => {
					// on cancel
				});


		}

	},


	splitString(str) {
		return str.split(',').filter(item => item.trim() !== '');
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		Toast.loading({
			duration: 1000, // 持续展示 toast
			forbidClick: true,
			message: '加载中',
		});
		wx.request({
			url: this.data.host + '/wx/topic/type',
			success: (res) => {
				console.log(res)
				let data = res.data.data
				for (let index = 0; index < data.length; index++) {
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
	onReady() {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow() {
		this.initData()
		wx.getStorage({
			key: "token",
			success: (res) => {
				this.setData({
					token: res.data
				//	userInfo: res.data
				})
			}
		})
	},
	initData() {
		Toast.loading({
			duration: 1000,
			message: '加载中...',
			forbidClick: true,
		});
		wx.request({
			url: this.data.host + '/wx/topic/list',
			success: (res) => {
				//	console.log(res.data)
				if (res.data.code == 200) {
					this.setData({
						topicList: res.data.data
					})

				}
			},
			fail: (res) => {
				Toast.fail("连接服务器异常")
			},
			complete: (res) => {
				Toast.clear()
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
		wx.showNavigationBarLoading();
		this.initData()
		wx.hideNavigationBarLoading();
		//停止下拉刷新
		wx.stopPullDownRefresh();

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