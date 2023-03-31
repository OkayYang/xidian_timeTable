// components/theSwiper.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
		list: Array,
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentIndex: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
		onTap: function (event) {
      this.triggerEvent('swiperClick', { id:event.currentTarget.dataset.id })
    },
		
    swiperChange(e) {
      this.setData({
        currentIndex: e.detail.current
      });
    }
  }
});
