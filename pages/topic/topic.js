// pages/topic/topic.js
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
		active: 0,
		host: app.globalData.host,
		typeList: [],
		topicList: [],
		pageSize: 5,
		pageNum: 1,
		pageTopicTotal: 0,
		isEnd: false,
		token: null,
		currentTopicTypeId: 0,

	},
	ViewImage(e) {
	//	console.log(e)
		let array = e.currentTarget.dataset.urls;
		for (let index = 0; index < array.length; index++) {
			array[index]=this.data.host+array[index]
		}
		wx.previewImage({
			urls: e.currentTarget.dataset.urls,
			current: e.currentTarget.dataset.url
		});
	},
	onTabChange(e) {
		let index = e.detail.name
		let ttid = this.data.typeList[index].ttId
		// console.log("typeId:"+this.data.typeList[index].ttId)
		this.setData({
			active: index,
			currentTopicTypeId: ttid
		})
	},
	detailTopic(event) {
		wx.navigateTo({
			url: '/pages/detailTopic/detailTopic?tid=' + event.currentTarget.dataset.tid
			
		})
	},
	addTopicBtn() {
		let that = this
		if (this.data.token != null) {
			wx.navigateTo({
				url: '/pages/addTopic/addTopic',
				events: {
					// 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
					successSendEvent: function(data) {
						console.log(data.data)
						if(data.data==true){
							that.loadTopicType()
						}
					}
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

	initTopicData() {
		let array = this.data.typeList;
		console.log(array)
		for (let index = 0; index < array.length; index++) {
			let element = array[index];
			wx.request({
				url: this.data.host + '/wx/topic/list/' + element.ttId + '?pageSize=5&pageNum=' + element.currentPage,
				success: (res) => {
					//console.log(res.data)
					if (res.data.code == 200) {
						let param1 = 'typeList[' + index + '].wxTopics'
						let param2 = 'typeList[' + index + '].currentPage'
						let param3 = 'typeList[' + index + '].pageCount'
						this.setData({
							[param1]: res.data.rows,
							[param2]: element.currentPage+1,
							[param3]: res.data.total
						})
					}
				},
				fail: (res) => {
					Notify({ type: 'danger', message: '服务器异常' });
				},
				complete: (res) => {
					Toast.clear()
				}
			})

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
		this.loadTopicType()
	},
	loadTopicType() {
		wx.request({
			url: this.data.host + '/wx/topic/type',
			success: (res) => {
				//console.log(res)
				let data = res.data.data
				let active = this.data.active
				this.setData({
					typeList: data,
					currentTopicTypeId: data[active].ttId
				})
				this.initTopicData()
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
		console.log("show")
		// this.setData({
		// 	active: 0,
		// })
		
		wx.getStorage({
			key: "token",
			success: (res) => {
				this.setData({
					token: res.data
					//	userInfo: res.data
				})
			}
		})
		//this.loadTopicData()
	},
	loadTopicData() {
		Toast.loading({
			duration: 0, 
			message: '加载中...',
			forbidClick: true,
			loadingType: 'spinner',
		});
		wx.request({
			url: this.data.host + '/wx/topic/list/' + this.data.currentTopicTypeId + '?pageSize=5&pageNum=' + this.data.typeList[this.data.active].currentPage,
			success: (res) => {
				//	console.log(res.data)
				if (res.data.code == 200) {
					let param1 = 'typeList[' + this.data.active + '].wxTopics'
					let param2 = 'typeList[' + this.data.active + '].currentPage'
					let param3 = 'typeList[' + this.data.active + '].pageCount'
					this.setData({
						[param1]: this.data.typeList[this.data.active].wxTopics.concat(res.data.rows),
						[param2]:this.data.typeList[this.data.active].currentPage+1,
						[param3]:res.data.total
					})
				}
			},
			fail: (res) => {
				Notify({ type: 'danger', message: '服务器异常' });
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
		//更新数据
		let param1 = 'typeList[' + this.data.active + '].wxTopics'
		let param2 = 'typeList[' + this.data.active + '].currentPage'
		let param3 = 'typeList[' + this.data.active + '].pageCount'
		this.setData({
			[param2]: 1,
			[param3]: 0,
			[param1]: []
		})
		this.loadTopicData()
		//隐藏上方刷新
		wx.hideNavigationBarLoading();
		//停止下拉刷新
		wx.stopPullDownRefresh();

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom() {
		if(this.data.typeList[this.data.active].wxTopics.length<this.data.typeList[this.data.active].pageCount){
			//小于总数未加载完
			this.loadTopicData()
		}else{
			console.log(true)
		}
		

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage() {


	}
})