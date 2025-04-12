Page({
  data: {
    orderNo: ''
  },

  onLoad(options) {
    this.setData({ orderNo: options.no })
  },

  back() {
    wx.switchTab({ url: '/pages/index/index' })
  }
})
