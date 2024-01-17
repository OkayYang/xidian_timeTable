import Toast from '@vant/weapp/toast/toast';
var app = getApp();
var domain = app.globalData.host;
Page({
  data: {
    isVerification: true,
    bigImage:null,
    smallImage:null,
    isneed:false
  },
  
  onLoad(){
    wx.request({
      url: domain+'/wx/xdu/checkNeedCaptcha?username=23011210564',
      success:(res)=>{
        if(res.data){
          this.refreshCaptcha()
        }
      }
    })
   
    

  },
  toLogin() {
    this.setData({
      isVerification: true
    })
  },
  refreshCaptcha(){
    wx.request({
      url: domain+'/wx/xdu/openSliderCaptcha?username=23011210564',
      success:(res)=>{
        this.setData({
          bigImage:'data:image/png;base64,'+res.data.bigImage,
          smallImage:'data:image/png;base64,'+res.data.smallImage,
          cookies:res.data.cookies
        })
        console.log(res)
      }
    })
  },
  onVerifyHandler(event){
    var componentInstance  = event.detail.componentInstance;
    var spanValue = Math.round(event.detail.span);
    console.log('Received span:', spanValue);
    wx.request({
      url: domain+'/wx/xdu/verifyCaptcha',
      method:'POST',
      data:{
        cookies:JSON.stringify(this.data.cookies),
        username:23011210564,
        span:spanValue
      },
      success:(res)=>{
        console.log(res)
        if(res.data.code==200){
          componentInstance.setData({
            'status':1
          })
          Toast({
            type: 'success',
            message: '验证成功',
            onClose: () => {
              this.setData({
                isVerification:false
              })
      
            },
          });
        }else{
          componentInstance.setData({
            'status':0
          })
          Toast({
            type: 'fail',
            message: '验证失败',
            onClose: () => {
              this.refreshCaptcha()
              componentInstance.setData({
                'slider.left':0,
                'status':-1
              })
      
            },
          });
          
          
        }
      }

    })

  },
  

})
