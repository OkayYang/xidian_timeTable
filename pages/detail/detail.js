// pages/detail/detail.js
import Toast from '@vant/weapp/toast/toast';

const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		host: app.globalData.host,
		article:null,
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
		let id = options.id;
		if(id!=null){
			wx.request({
				url: this.data.host+'/wx/article/detail?id='+id,
				success:(res)=>{
					if(res.data.code==200){
						this.setData({
							article:res.data.data
						})
					}
				},
				complete:(res)=>{
					Toast.clear()
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