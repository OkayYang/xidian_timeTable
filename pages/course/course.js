// pages/course/course.js
import utils from '../../utils/utils.js'
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		colorArrays: ["#85B8CF", "#90C652", "#D8AA5A", "#FC9F9D", "#0A9A84", "#61BC69", "#12AEF3", "#E29AAD"],
		wlist: [
			{ "xqj": 1, "skjc": 1, "skcd": 3, "kcmc": "高等数学@教A-301" },
			{ "xqj": 1, "skjc": 5, "skcd": 3, "kcmc": "高等数学@教A-301" },
			{ "xqj": 2, "skjc": 1, "skcd": 2, "kcmc": "高等数学@教A-301" },
			{ "xqj": 2, "skjc": 8, "skcd": 2, "kcmc": "高等数学@教A-301" },
			{ "xqj": 3, "skjc": 4, "skcd": 1, "kcmc": "高等数学@教A-301" },
			{ "xqj": 3, "skjc": 8, "skcd": 1, "kcmc": "高等数学@教A-301" },
			{ "xqj": 3, "skjc": 5, "skcd": 2, "kcmc": "高等数学@教A-301" },
			{ "xqj": 4, "skjc": 2, "skcd": 3, "kcmc": "高等数学@教A-301" },
			{ "xqj": 4, "skjc": 8, "skcd": 2, "kcmc": "高等数学@教A-301" },
			{ "xqj": 5, "skjc": 1, "skcd": 2, "kcmc": "高等数学@教A-301" },
			{ "xqj": 6, "skjc": 3, "skcd": 2, "kcmc": "高等数学@教A-301" },
			{ "xqj": 7, "skjc": 5, "skcd": 3, "kcmc": "高等数学@教A-301" },

		],
		kcb: [],
		result: null,
		showWeekList: false,
		classShow:false,
		customBar: app.globalData.CustomBar,
		statusBar: app.globalData.StatusBar,
		custom: app.globalData.Custom,
		selectWeek:null

	},
	BackPage(){
		wx.navigateBack({
			delta: 1
		  });

	},
	clickClass(e) {
		wx.vibrateShort({
			type: 'medium',
		})
		this.setData({
			classShow:true,
			currentClass:e.currentTarget.dataset.index
		})
		console.log(e)

	},
	onClassClose(){
		this.setData({
			classShow:false
		})
	},
	selectWeek(e){
		var week = parseInt(e.currentTarget.dataset.index) + 1;
		var date = utils.getWeekDates(week)

		this.setData({
			selectWeek:week,
			date:date
		})
		wx.getStorage({
			key: "kcb",
			success: (res) => {
				let array = res.data
				let kcb = []
				for (let index = 0; index < array.length; index++) {
					const element = array[index];
					if (utils.checkWeekRange(element.ZCMC, week)) {
						kcb.push(element)
					}

				}
				//console.log(kcb)
				kcb = utils.getWeekSchedul(kcb)
				//console.log(kcb)
				this.setData({
					kcb: kcb
					//	userInfo: res.data
				})


			}
		})
		this.hideWeekList()
	},

	showWeekList() {
		wx.vibrateShort({
          type: 'heavy'
          
        })
		this.setData({
			showWeekList: true
		})
	},

	hideWeekList() {
		this.setData({
			showWeekList: false
		})
	},



	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		let result = utils.calcuWeek()
		let date = utils.getThisWeekDates()
		this.setData({
			result: result,
			date: date,
			selectWeek:result.week
		})
		wx.getStorage({
			key: "kcb",
			success: (res) => {
				let array = res.data
				let kcb = []
				for (let index = 0; index < array.length; index++) {
					const element = array[index];
					if (utils.checkWeekRange(element.ZCMC, result.week)) {
						kcb.push(element)
					}

				}
				kcb = utils.getWeekSchedul(kcb)
				console.log(kcb)
				this.setData({
					kcb: kcb
					//	userInfo: res.data
				})


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

	}
})