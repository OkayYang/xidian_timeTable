var oldX = 0;
Component({
  properties: {
    isShow: {
      type: Boolean,
      value: false
    },
    enableClose: {
      type: Boolean,
      value: true
    },
    bigImage: {
      type: String,
      value: '' // 期望传入背景图片的 Base64 编码
    },
    smallImage: {
      type: String,
      value: '' // 期望传入滑块图片的 Base64 编码
    }
  },
  data: {
    backIndex: 0,
    isMove: false,
    status: -1,
    box: {
      width: 100,
      height: 100,
      back: ''
    },
    slider:{
      width: 100,
      height: 100,
      left:0
    },
  },
  methods: {
    startClick(e) {
      this.setData({
        isMove: true
      });
      if (e.touches.length > 0) {
        oldX = e.touches[0].pageX;
      }
    },
    moveClick(e) {
      var _this = this;
      var newX = 0;
      if (e.touches.length > 0) {
        newX = e.touches[0].pageX;
      }
      var span = newX - oldX;
      span = Math.max(span, 0);
      span = Math.min(span, _this.data.box.width - 50);
      
      _this.setData({
        'slider.left': span,

      });
      //console.log(span)
    },
    endClick() {
      var _this = this;
      var slider = _this.data.slider;
      var span = Math.abs(slider.left);
      //console.log(span)
      // 不再在前端处理验证结果，而是触发一个 onverify 事件，由后端进行验证
      span = Math.ceil(span/_this.data.box.width*280)
      _this.triggerEvent('onverify', {
        span: span,
        componentInstance: _this // 传递组件实例
      }, {
        bubbles: false,
        composed: false
      });
      
    },
    closeClick() {
      this.setData({
        isShow: false
      });
    }
  },
  
  lifetimes: {
    ready() {
      var _this = this;
      wx.getSystemInfo({
        success: (result) => {
          var width = result.screenWidth - 20 - 20;
          var height = width / 59 * 36;
          var slider_width = height/120*31
          _this.setData({
            box: {
              width: width,
              height: height
            }
          });
          _this.setData({
            slider: {
              width: slider_width,
              height: height
            }
          });
          console.log(width)  
          //_this.refereshClick();
        },
      })
    }
  }
})
