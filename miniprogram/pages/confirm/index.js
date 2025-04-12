const cart = require('../../store/cart')

Page({
  data: {
    list: [],
    totalCount: 0,
    totalPrice: 0
  },

  onLoad() {
    const items = Object.values(cart.data.items)
    if (!items.length) {
      wx.navigateBack()
      return
    }

    this.setData({
      list: items,
      totalCount: cart.totalCount(),
      totalPrice: cart.totalPrice()
    })
  },

  async onSubmit() {
    wx.showLoading({ title: '下单中…', mask: true })

    const res = await wx.cloud.callFunction({
      name: 'addOrder',
      data: {
        cartItems: this.data.list,
        totalPrice: Number(this.data.totalPrice)
      }
    })

    wx.hideLoading()

    if (res.result.ok) {
      cart.data.items = {}
      cart.save()
      wx.removeTabBarBadge({ index: 1 })
      wx.redirectTo({
        url: `/pages/order-success/index?no=${res.result.orderNo}`
      })
    } else {
      wx.showToast({ title: res.result.msg || '下单失败', icon: 'none' })
    }
  }
})
