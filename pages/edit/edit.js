// index.js
import Toast from '@vant/weapp/toast/toast';
import Notify from '@vant/weapp/notify/notify';
import Dialog from '@vant/weapp/dialog/dialog';
const app = getApp()
Page({

	data: {
		host: app.globalData.host,
		avatar: null,
		name: null,
		sex: '未设置',
		school: null,
		email: null,
		signature: null,
		tempName: '',
		tempEmail: '',
		tempSignature: '',
		initSchool: '请选择学校院系',
		initName: '未设置',
		initEmail: '未设置',
		initSignature: '未设置',
		sexColumns: ['男', '女', '外星人'],
		sexIndex: 0,
		schoolIndex: 0,
		nameShow: false,
		emailShow: false,
		signatureShow: false,
		department: null,
		major: null,
		checked: false,
		trueName: null,
		uXh: null,
		uClassname: null,
		

		//级联属性
		userInfo: null,
		token: null,
		form: {
			uNick: null,
			uImage: null,
			uEmail: null,
			uDesc: null,

		}

	},
	loginout(){
		Dialog.confirm({
			title: '提示',
			message: '是否退出登录',
		  })
			.then(() => {
				wx.clearStorage({
					success:(res)=>{
						Toast({
							type: 'success',
							message: '退出成功',
							onClose: () => {
								wx.restartMiniProgram({
									path:'/pages/index/index',
								})
							
							 
							},
						  });
					}
				})
		
			  // on confirm
			})
			.catch(() => {
			  // on cancel
			});
		
	},

	changeAvatar(e) {
		const {
			avatarUrl
		} = e.detail
		console.log(avatarUrl)
		wx.uploadFile({
			filePath: avatarUrl,
			name: 'file',
			url: this.data.host + '/wx/file/upload',
			success: (res) => {
				let resp = JSON.parse(res.data)
				if (resp.code == 200) {
					console.log(resp.data)
					this.setData({
						avatar: resp.data,
						['form.uImage']: resp.data
					})
					this.editUserRequest()
				}
			}
		})
		this.setData({
			avatarUrl,
		})

	},


	sexOnCancel() {
		Toast('取消');
	},

	///
	showNameDialog() {
		this.setData({
			nameShow: true,
		});
	},
	showEmailDialog() {
		this.setData({
			emailShow: true,
		});
	},

	showSignatureDialog() {
		this.setData({
			signatureShow: true,
		});
	},

	onNameConfirm(e) {
		let name = this.data.tempName
		console.log(e);
		//提交
		if (this.isValidName(name) && name != '') {

			//Toast.success("修改成功")
			this.setData({
				nameShow: false,
				//name: name,
				['form.uNick']: name
			})
			this.editUserRequest()

		} else {
			Toast.fail("格式错误")
		}
	},
	
	
	editUserRequest() {
		wx.request({
			url: this.data.host + '/wx/user/edit',
			method: 'POST',
			header: {
				token: this.data.token
			},
			data: this.data.form,
			success: (res) => {
				console.log(res)
				if (res.data.code == 200) {
					this.resetForm()
					this.freshUserStorage()

				}
				else if (res.data.code == 222) {
					Notify({
						type: 'warning',
						message: '内容不能包含敏感词汇'
					});
				}
				else {
					Notify({
						type: 'fail',
						message: '修改失败'
					});
				}
			},
			fail: (res) => {
				Notify({
					type: 'fail',
					message: '请求异常'
				});
			}
		})
	},
	freshUserStorage() {
		let that = this
		if (this.data.token != null) {
			wx.request({
				url: this.data.host + '/wx/user/my',
				header: {
					token: this.data.token
				},
				success: (resp) => {
					if (resp.data.code == 200) {
						let data = resp.data.data
						wx.setStorage({
							key: 'user',
							data: data,
							success: (res) => {
								//console.log(res)
								let sex = that.sextoString(data.uSex)
								let school = null
								if (!that.strIsNull(data.uDepartment)) {
									school = data.uDepartment
									if (!that.strIsNull(data.uMajor)) {
										school = school + '-' + data.uMajor
									}
								}
								that.setData({
									//userInfo: JSON.parse(res.data),
									userInfo: data,
									name: data.uNick,
									sex: sex,
									email: data.uEmail,
									signature: data.uDesc,
									trueName: data.uName,
									uXh: data.uXh,
									uClassname: data.uClassname,
									school: school,
									avatar: data.uImage

								})
								Notify({
									type: 'success',
									message: '修改成功'
								});

							}
						})
					}
				}

			})
		}

	},

	selectSex(e) {
		let sex = e.detail.value;
		this.setData({
			//sex: sex,
			['form.uSex']: sex,
		})
		this.editUserRequest();


	},
	onEmailConfirm(e) {
		let email = this.data.tempEmail
		console.log(e);
		if (this.isValidEmail(email) && email != null) {
			this.setData({
				emailShow: false,
				//email: email,
				['form.uEmail']: email,
			})
			this.editUserRequest();
		} else {
			Toast.fail("格式错误")
		}


	},
	onSignatureConfirm(e) {
		let signature = this.data.tempSignature
		console.log(e);

		if (signature != '') {
			this.setData({
				signatureShow: false,
				//signature: signature,
				['form.uDesc']: signature,
			})
			this.editUserRequest();
		} else {
			Toast.fail("格式错误")
		}


	},


	onNameCancel() {
		this.setData({
			nameShow: false,
			tempName: ''
		});
	},
	onEmailCancel() {
		this.setData({
			emailShow: false,
			tempEmail: '',
		});
	},
	onSignatureCancel() {
		this.setData({
			signatureShow: false,
			tempSignature: '',
		});
	},


	onNameInput(event) {
		this.setData({
			tempName: event.detail,
		});
	},
	onEmailInput(event) {
		this.setData({
			tempEmail: event.detail,
		});
	},
	onSignatureInput(event) {
		this.setData({
			tempSignature: event.detail,
		});
	},

	isValidName(name) {
		// 匹配非中文、字母和数字的字符，包括空格和其他特殊符号
		var regex = /[^\u4e00-\u9fa5a-zA-Z0-9]/g;
		return !regex.test(name);
	},
	isValidEmail(email) {
		var emailRegExp = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/; //验证邮箱的正则表达式
		return emailRegExp.test(email); //验证是否符合要求
	},
	resetForm() {
		this.setData({
			form: {
				uSex: null,
				uNick: null,
				uImage: null,
				uEmail: null,
				uSignature: null,
				uDepartment: null, //大学
				uMajor: null, //学院
				uClassname: null, //班级
				remark: null, //非本校
				uName: null,
				uXh: null,
			}
		})
	},
	

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let that = this
		wx.getStorage({
			key: "user",
			success: (res) => {
				this.setData({
					//userInfo: JSON.parse(res.data),
					userInfo: res.data,
					name: res.data.uNick,
					email: res.data.uEmail,
					signature: res.data.uDesc,
					trueName: res.data.uName,
					uXh: res.data.uXh,
					uClassname: res.data.uClassname,
					avatar: res.data.uImage
				})
				console.log(res)
				let sex = this.sextoString(res.data.uSex)
				let school = null
				if (!that.strIsNull(res.data.uDepartment)) {
					school = res.data.uDepartment
					if (!that.strIsNull(res.data.uMajor)) {
						school = school + '-' + res.data.uMajor
					}
				}
				console.log(school)
				this.setData({
					sex: sex,
					school: school
				})
				//console.log(school)

				wx.getStorage({
					key: "token",
					success: (res) => {
						this.setData({
							token: res.data
						})
						//更新数据
					}
				})

			},
			fail: (res) => {
				Dialog.alert({
					title: '提示',
					message: '请先授权登录',
				})
					.then(() => {
						if (this.data.userInfo == null) {
							//
						}

					})

			}
		})
	},
	strIsNull(str) {
		if (str == null || str.replace(/\ +/g, "") == '') {
			return true;
		} else {
			return false;
		}
	},
	sextoString(str) {
		if (str == 0) {
			return '男'
		}
		if (str == 1) {
			return '女'
		}
		return '外星人'
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