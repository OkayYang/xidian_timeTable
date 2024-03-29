// pages/detailTopic/detailTopic.js
import Toast from '@vant/weapp/toast/toast';
import Notify from '@vant/weapp/notify/notify';
import Dialog from '@vant/weapp/dialog/dialog';
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		host: app.globalData.host,
		topicId: null,
		topic: null,
		comments: null,
		commentImg:null,
		InputBottom: 0,
		showPopup: false,
		placeholder: "我来说两句",
		inputText: null,
		userInfo: null,
		commentParentId: 0,
		commentCount: 0,
		selectCommentId: null,
		inputFocus: false,
		token: null,
		actions: [
			{ name: '删除', color: '#e74c3c' },
		],

	},
	//获得焦距
	InputFocus(e) {
		// wx.createSelectorQuery().selectViewport().scrollOffset((res) => {
		// 	// 计算需要滚动的距离，加上 100px
		// 	const scrollTop = res.scrollTop +  e.detail.height;
		// 	// 使用 wx.pageScrollTo 方法设置页面滚动的距离
		// 	wx.pageScrollTo({
		// 		scrollTop: scrollTop,
		// 		duration: 300,
		// 	});
		// }).exec();
		// this.setData({
		// 	InputBottom: e.detail.height,
		// })

		if (!this.isNullOrWhiteSpace(this.data.inputText)) {
			this.setData({
				placeholder: null
			})
		}
	},
	//失去焦距
	InputBlur(e) {
		this.setData({
			InputBottom: 0,
			//placeholder: "我来说两句"
		})
	},
	topicComment() {
		if (!this.data.token != null) {
			this.setData({
				placeholder: "我来说两句",
				commentParentId: 0,
				inputFocus: true,
			})
		}
	},
	commentInput(e) {
		//console.log(e)
		this.setData({
			inputText: e.detail.value,
		})

	},
	commentClick(e) {

		let replyUser = e.currentTarget.dataset.reply
		console.log(replyUser)
		if (this.data.token != null) {
			if (this.data.userInfo.uid != replyUser.uid) {
				this.setData({
					placeholder: "回复:" + replyUser.uNick,
					commentParentId: replyUser.discussId,
					inputFocus: true
				})
			} else {
				this.setData({
					showPopup: true,
					selectCommentId: replyUser.discussId,
					inputFocus: false
				});
			}
			//console.log(replyUser)

		} else {
			this.unLoginDialogTip()
		}


	},
	sendComment() {
		if (this.data.token != null) {
			if (!this.isNullOrWhiteSpace(this.data.inputText)||this.data.commentImg!=null) {
				Toast({
					duration: 1000,
					type: 'loading',
					message: '加载中...',
					onClose: () => {
						//console.log('执行OnClose函数');
					},
				});

				wx.request({
					url: this.data.host + '/wx/topic/detail/comment/add',
					method: 'POST',
					header: {
						token: this.data.token
					},
					data: {
						discussContent: this.data.inputText,
						relateId: this.data.topicId,
						parentId: this.data.commentParentId,
						discussImages:this.data.commentImg
					},
					success: (res) => {
						console.log(res)
						if (res.data.code == 200) {
							this.setData({
								commentParentId: 0,
								discussContent: null,
								placeholder: "我来说两句",
								inputText: null,
								commentImg:null
								


							})
							this.initComment(this.data.topicId)

							Notify({ type: 'success', message: '评论成功' });
						}
						else if(res.data.code==222){
							Notify({
								type: 'warning',
								message: '内容不能包含敏感词汇'
							});
						}
						else {
							Notify({ type: 'danger', message: '评论失败' });
						}
					},
					fail: (res) => {
						Notify({ type: 'danger', message: '服务器开小差了' });
					},
					complete: (res) => {
						Toast.clear()
					}
				})
				//Notify({ type: 'success', message: '评论成功' });
			} else {
				// 警告通知
				this.setData({
					inputText: null,
				})
				Notify({ type: 'warning', message: '评论内容不能为空' });
			}

		} else {
			this.unLoginDialogTip()

		}


	},
	cancelUpload(){
		this.setData({
			commentImg:null
		})

	},
	commentImgClick(){
		let that = this
		wx.chooseImage({
			count: 1, //默认9
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
									commentImg: resp.data
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
	unLoginDialogTip() {
		Dialog.confirm({
			title: '提示',
			message: '请先授权登录后再评论',
		})
			.then(() => {
				wx.navigateTo({
					//url: '/pages/authorize/authorize',
					url:'/pages/login/login'
				})
			})
			.catch(() => {
				// on cancel
			});
	},
	isNullOrWhiteSpace(str) {
		return (!str || str.trim().length === 0);
	},
	ViewComment(e){
		console.log(e)
		let urls = []
		urls.push(e.currentTarget.dataset.url)
		wx.previewImage({
			urls: urls,
			current: e.currentTarget.dataset.url
		});

	},

	ViewImage(e) {
    console.log(e)
    let urls = []
		urls.push(e.currentTarget.dataset.urls)
    //console.log(urls)
    let that = this
    let array=[]
    //console.log(urls[0].length)
    for (let index = 0; index < urls[0].length; index++) {
      array.push(this.data.host+urls[0][index]);
    }
    //console.log(array)
    
	
		//console.log(e)
		wx.previewImage({
			urls: array,
			current: e.currentTarget.dataset.url
		});
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		let tid = options.tid;
		this.setData({
			topicId: tid
		})
		if (tid == null) {
			Toast({
				type: 'fail',
				message: '您访问的页面不存在',
				onClose: () => {
					wx.navigateBack();
				},
			});
		} else {

			this.getToken()
			this.initArticle(tid)
			this.initComment(tid)

		}

	},
	getToken() {
		wx.getStorage({
			key: "user",
			success: (res) => {

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
	//长按评论
	onCommentLongPress(e) {
		console.log(e)
		let uid = e.currentTarget.dataset.uid
		let selectCommentId = e.currentTarget.dataset.reply.discussId
		if ((this.data.userInfo != null && this.data.userInfo.uid == uid) || this.data.userInfo.uid == this.data.topic.uid) {
			this.setData({
				showPopup: true,
				selectCommentId: selectCommentId,
				inputFocus: false
			});
		}

	},
	onPopupClose() {
		this.setData({ showPopup: false });
	},
	onPopupClick(e) {
		if (e.detail.name == "删除" && this.data.selectCommentId != null) {
			this.delComment(this.data.selectCommentId)
		}
	},
	delComment(cid) {
		Dialog.confirm({
			title: '提示',
			message: '确认要删除评论？',
		})
			.then(() => {
				wx.request({
					url: this.data.host + '/wx/topic/detail/comment/del/' + cid,
					header: {
						token: this.data.token
					},
					success: (res) => {
						if (res.data.code == 200) {
							this.setData({
								showPopup: false,
								selectCommentId: null
							});
							this.initComment(this.data.topicId)
							Notify({ type: 'success', message: '删除评论成功' });
						} else {
							this.initComment(this.data.topicId)
							Notify({ type: 'danger', message: '删除评论失败' });
						}
					},
					fail: (res) => {
						Notify({ type: 'warning', message: '服务器异常' });
					}
				})
				// on confirm
			})
			.catch(() => {
				// on cancel
			});
		
	},

	onGetUserInfo(e) {
		console.log(e.detail);
	},

	initComment(tid) {
		Toast({
			duration: 800,
			type: 'loading',
			message: '加载中...',
			onClose: () => {
				//console.log('执行OnClose函数');
			},
		});
		wx.request({
			url: this.data.host + '/wx/topic/detail/comments/' + tid,
			success: (res) => {
				if (res.data.code == 200) {
					let data = res.data.data
					let count = data.length
					for (let index = 0; index < data.length; index++) {
						count += data[index].childrenComments.length
					}
					this.setData({
						comments: data,
						commentCount: count
					})

				}

			},
			fail: (res) => {
				Notify({ type: 'warning', message: '服务器异常' });
			},
			complete: (res) => {
				Toast.clear()
			}
		})

	},
	initArticle(tid) {
		Toast({
			duration: 800,
			type: 'loading',
			message: '加载中...',
			onClose: () => {
				console.log('执行OnClose函数');
			},
		});
		wx.request({
			url: this.data.host + '/wx/topic/detail/' + tid,
			success: (res) => {
				if (res.data.code == 200) {
					this.setData({
						topic: res.data.data
					})

				}

			},
			complete: (res) => {
				Toast.clear()
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
		if (this.data.token == null) {
			this.getToken()
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
		this.initComment(this.data.topicId)
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