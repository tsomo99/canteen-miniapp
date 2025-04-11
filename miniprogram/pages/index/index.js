const db = wx.cloud.database()

Page({
  data: {
    categories: [],
    dishes: [],
    activeCatIndex: 0,
    loading: true
  },

  async onLoad() {
    await this.loadCategories()
    this.loadDishes()
  },
  

  async loadCategories() {
    const { data } = await db.collection('categories').get()
    if (!data.length) {
      wx.showToast({ title: '无分类数据', icon: 'none' })
      return
    }
    this.setData({ categories: data, activeCatIndex: 0 })
  },
  

  async loadDishes() {
    const cat = this.data.categories[this.data.activeCatIndex]
    if (!cat) return  // 防止异常
  
    const { data } = await db.collection('dishes')
      .where({ categoryId: cat._id })
      .get()
    this.setData({ dishes: data })
  },
  

  onTabChange: function (e) {
    this.setData({ activeCatIndex: e.detail.index })
    this.loadDishes()
  },

  onAddCart: function (e) {
    const dish = e.currentTarget.dataset.dish
    wx.showToast({ title: `已加入 ${dish.name}`, icon: 'success' })
  }
})
