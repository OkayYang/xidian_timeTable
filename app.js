// app.js
App({
	globalData: {
		host:"https://xdu.ywenrou.cn",
		//host:"http://localhost:8080",
		//host:"http://192.168.137.1:8080"
	},
	
	onLaunch: function() {
		wx.getSystemInfo({
			success: e => {
			  this.globalData.StatusBar = e.statusBarHeight;
			  let capsule = wx.getMenuButtonBoundingClientRect();
			  if (capsule) {
				   this.globalData.Custom = capsule;
				  this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
			  } else {
				  this.globalData.CustomBar = e.statusBarHeight + 50;
			  }
			}
		  })
	}
})
