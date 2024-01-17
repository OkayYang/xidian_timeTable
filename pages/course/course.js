// pages/course/course.js
import utils from '../../utils/utils.js'
import Dialog from '@vant/weapp/dialog/dialog';
const app = getApp()
var domain = app.globalData.host;
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		colorArrays: ["#85B8CF", "#90C652", "#D8AA5A", "#FC9F9D", "#0A9A84", "#61BC69", "#12AEF3", "#E29AAD"],
		kcb: null,
		result: null,
		showWeekList: false,
		classShow: false,
		customBar: app.globalData.CustomBar,
		statusBar: app.globalData.StatusBar,
		custom: app.globalData.Custom,
		selectWeek: null,
		isLogin: false

	},
	BackPage() {
		wx.navigateBack({
			delta: 1
		});

	},
	clickClass(e) {
		wx.vibrateShort({
			type: 'medium',
		})
		this.setData({
			classShow: true,
			currentClass: e.currentTarget.dataset.index
		})
		console.log(e)

	},
	onClassClose() {
		this.setData({
			classShow: false
		})
	},
	selectWeek(e) {
		var week = parseInt(e.currentTarget.dataset.index) + 1;
		var date = utils.getWeekDates(week)

		this.setData({
			selectWeek: week,
			date: date
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
	isLogin() {
		wx.getStorage({
			key: "user",
			success: (res) => {
				this.setData({
					isLogin: true
				})

			},
			fail: (res) => {
				console.log(res)


				Dialog.alert({
					title: '提示',
					message: '请先授权登录',
				}).then(() => {

						if (!this.data.isLogin) {
							wx.navigateTo({
								//url: '/pages/authorize/authorize',
								url: '/pages/login/login'
							})

						}


					})

			}
		})
		let result = utils.getCurrentWeekday()

		let date = utils.getWeekDates(result.week)
		this.setData({
			result: result,
			date: date,
			selectWeek: result.week
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


			},

		})
	},


	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
    this.isLogin()
    // wx.getStorage({
		// 	key: "cookies",
		// 	success: (res) => {
    //     console.log(res)
    //     let cookies = res.data
    //     wx.request({
    //       url: domain+'/wx/xdu/xskcb',
    //       method:'POST',
    //       data:JSON.stringify(cookies),
    //       success: (res) =>{
    //         console.log(res)
    //       }
          
    //     })
    //   }
    // })



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
		Dialog.close()
		
		if (!this.data.isLogin) {
			this.isLogin()
		} else {
			
		}

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide() {
		console.log("hide")

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