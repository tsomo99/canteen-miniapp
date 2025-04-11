const CART_KEY = 'CART_V1'
const store = {
  data: { items: {} },

  load() {
    this.data.items = wx.getStorageSync(CART_KEY) || {}
  },
  save() {
    wx.setStorageSync(CART_KEY, this.data.items)
  },
  add(dish) {
    const { _id } = dish
    if (this.data.items[_id]) {
      this.data.items[_id].count += 1
    } else {
      this.data.items[_id] = { ...dish, count: 1 }
    }
    this.save()
  },
  totalCount() {
    return Object.values(this.data.items).reduce((s, i) => s + i.count, 0)
  },
  totalPrice() {
    return Object.values(this.data.items)
      .reduce((s, i) => s + i.count * i.price, 0)
      .toFixed(2)
  }
  
}
module.exports = store
