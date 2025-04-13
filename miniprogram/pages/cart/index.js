
const cart = require('../../store/cart')

Page({
  data: {
    list: [],
    totalCount: 0,
    totalPrice: '0.00'
  },
  onLoad(){
    this.syncBadge()
  },
  onShow() {
    cart.load()
    this.refresh()
    this.syncBadge()
  },

  refresh() {
    const items = Object.values(cart.data.items)
    const totalCount = cart.totalCount()
    const totalPrice = cart.totalPrice()

    this.setData({
      list: items,
      totalCount,
      totalPrice
    })
  },

  onCheckout() {
    if (!this.data.totalCount) {
      wx.showToast({ title: '购物车为空', icon: 'none' })
      return
    }
    wx.navigateTo({ url: '/pages/confirm/index' }) // 下一阶段页
  },
  syncBadge() {
    const count = this.totalCount()
    if (count > 0) {
      wx.setTabBarBadge({ index: 1, text: String(count) })
    } else {
      wx.removeTabBarBadge({ index: 1 })
    }
  }
  
})

