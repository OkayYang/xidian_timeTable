// pages/addTopic/addTopic.js
import Dialog from '@vant/weapp/dialog/dialog';
import Notify from '@vant/weapp/notify/notify';
import Toast from '@vant/weapp/toast/toast';
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		host: app.globalData.host,
		token: null,
		topicTypeList: [],
		imgList: [],
		index: null,
		picker: [],
		textareaAValue: null

	},
	textareaAInput(e) {
		this.setData({
			textareaAValue: e.detail.value
		})
	},
	ChooseImage() {
		let that = this
		wx.chooseImage({
			count: 4, //默认9
			sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album'], //从相册选择
			success: (res) => {
				let list = []
				for (let index = 0; index < res.tempFilePaths.length; index++) {
					wx.uploadFile({
						filePath: res.tempFilePaths[index],
						name: 'file',
						url: that.data.host + '/wx/file/upload',
						success: (res) => {
							let resp = JSON.parse(res.data)
							if (resp.code == 200) {
								that.setData({
									imgList: that.data.imgList.concat(resp.data)
								})

							}
						},
						fail: (res) => {
							Toast.fail('图片上传失败');
							console.log(res)
						}
					})

				}

			}
		});
	},
	ViewImage(e) {
		wx.previewImage({
			urls: this.data.imgList,
			current: e.currentTarget.dataset.url
		});
	},
	DelImg(e) {
		wx.showModal({
			content: '确定要删除这张图片吗？',
			cancelText: '取消',
			confirmText: '确定',
			success: res => {
				if (res.confirm) {
					this.data.imgList.splice(e.currentTarget.dataset.index, 1);
					this.setData({
						imgList: this.data.imgList
					})
				}
			}
		})
	},
	PickerChange(e) {

		this.setData({
			index: e.detail.value
		})
	},
	publishTopic() {
		if (this.data.textareaAValue == null) {
			// 警告通知
			Notify({
				type: 'warning',
				message: '内容不能为空'
			});
			return
		}
		if (this.data.index == null) {
			// 警告通知
			Notify({
				type: 'warning',
				message: '请选择话题类别'
			});
			return
		}
		let content = this.data.textareaAValue
		let topicTypeId = this.data.topicTypeList[this.data.index].ttId
		let topicImages = this.data.imgList.join(',')
		let token = this.data.token
		wx.request({
			url: this.data.host + '/wx/topic/add',
			method: 'POST',
			header: {
				'token': token
			},
			data: {
				content: content,
				topicTypeId: topicTypeId,
				topicImages: topicImages
			},
			success: (res) => {
				if (res.data.code == 200) {
					const eventChannel = this.getOpenerEventChannel()
					eventChannel.emit('successSendEvent', { data: true });
					Toast({
						type: 'success',
						message: '发布成功',
						onClose: () => {
							wx.navigateBack()
						},
					});
				}
				else if (res.data.code == 222) {
					Notify({
						type: 'warning',
						message: '内容不能包含敏感词汇'
					});
				}
				//console.log(res)
			},
			fail: (res) => {
				Toast.fail(发布失败)
				console.log(res)
			}
		})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		let that = this
		
		wx.request({
			url: this.data.host + '/wx/topic/type',
			success: (res) => {
				if (res.data.code == 200) {
					let data = res.data.data.slice(1)
					that.setData({
						topicTypeList: data
					})
					let list = []
					for (let index = 0; index < data.length; index++) {
						list.push(data[index].ttName)
					}

					that.setData({
						picker: list
					})
				}

			}
		})



	},
	validLogin() {
		wx.getStorage({
			key: "token",
			success: (res) => {
				this.setData({
					token: res.data
				})
			},
			fail: (res) => {

				Dialog.alert({
					title: '提示',
					message: '请先授权登录',
				})
					.then(() => {
						wx.navigateTo({
							//url: '/pages/authorize/authorize',
							url: '/pages/login/login'
						})
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
		this.validLogin()

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