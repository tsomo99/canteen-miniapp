const cart = require('../../store/cart')

Page({
  data: {
    dishes: []
  },

  onLoad() {
    this.loadDishes()
  },

  async loadDishes() {
    const db = wx.cloud.database()
    const res = await db.collection('dishes').get()
    this.setData({ dishes: res.data })
  },

  onAddCart(e) {
    const dish = e.currentTarget.dataset.dish
    cart.add(dish)
    wx.setTabBarBadge({ index: 1, text: String(cart.totalCount()) })
    wx.showToast({ title: '已加入购物车', icon: 'success' })
  }
})
