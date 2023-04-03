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
		basics: 0,
		token:null,
		basicsList: [{
      icon: 'usefullfill',
      name: '报名成功'
    }, {
      icon: 'radioboxfill',
      name: '审核中'
    }, {
      icon: 'roundcheckfill',
      name: '报名成功'
    }, ],


	},
	clickTopicCard(e){
		//console.log(e)
		if (e && e.detail === "right") {
			// cell处于滑动关闭状态，不执行其他操作
			return;
		}
		let tid = e.currentTarget.dataset.tid
		wx.navigateTo({
			url: '/pages/detailTopic/detailTopic?tid='+tid,
		})

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
		//console.log(position)
		
		let tid = event.currentTarget.dataset.tid
		let that = this
		if(position=='right'){
			Dialog.confirm({
				title: '提示',
				message: '确认要删除该话题吗？',
			})
				.then(() => {
					wx.request({
						url: that.data.host + '/wx/topic/list/my/del?tid=' + tid,
						header: {
							token: that.data.token
						},
						success: (res) => {
							if (res.data.code == 200) {
								// 成功通知
								Notify({
									type: 'success',
									message: '删除成功'
								});
								that.initData()
							}
			
						},
						fail:(res)=>{
							// 危险通知
			Notify({ type: 'danger', message: '删除失败' });
						}
					})
					// on confirm
				})
				.catch(() => {
					// on cancel
				});

		}
		
		
		
		instance.close();

	},
	editbtn(){
		Dialog.alert({
			message: '开发者正在加班中。。。',
		}).then(() => {
			// on close
		});
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		this.validLogin()
	},
	validLogin(){
		wx.getStorage({
			key: "user",
			success: (res) => {
				//console.log(res)
				this.setData({
					//userInfo: JSON.parse(res.data)
					userInfo:res.data
				})
				wx.getStorage({
					key: "token",
					success:(res)=>{
						this.setData({
							token:res.data
						})
						this.initData()


					}
				})
				
			},
			fail: (res) => {
				
				Dialog.alert({
						title: '提示',
						message: '请先授权登录',
					})
					.then(() => {
						if(this.data.userInfo==null){
							this.loginbtn()
						}
						
					})
					
			}
		})

	},
	initData() {
		if (this.data.token != null) {
			const token = this.data.token
			wx.request({
				url: this.data.host + '/wx/topic/list/my',
				header: {
					token: token
				},
				success: (res) => {
					//console.log(res)
					if (res.data.code == 200) {
						this.setData({
							topics: res.data.data
						})

					}
				}
			})
			wx.request({
				url: this.data.host+'/wx/topic/notice/list',
				header: {
					token: token
				},
				success:(res)=>{
					if (res.data.code == 200) {
						this.setData({
							comments: res.data.data
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
		if(this.token==null){
			this.validLogin()
		}else{
			
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
		wx.showNavigationBarLoading();
		//更新数据
		Toast.loading({
			duration: 800, 
			message: '加载中...',
			forbidClick: true,
			loadingType: 'spinner',
		});
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