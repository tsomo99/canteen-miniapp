const db = wx.cloud.database()
const PAGE_SIZE = 10

Page({
  data: {
    activeTab: 0,
    orders: [],
    page: 0,
    finished: false
  },

  onShow() {
    this.resetAndLoad()
    this.timer = setInterval(() => this.refresh(), 5000)
  },

  onHide() {
    clearInterval(this.timer)
    console.log('我的订单页面加载')
  },
  onUnload() {
    clearInterval(this.timer)
  },

  onTabChange(e) {
    this.setData({ activeTab: Number(e.currentTarget.dataset.index) })
    this.resetAndLoad()
  },

  resetAndLoad() {
    this.setData({ orders: [], page: 0, finished: false })
    this.loadPage()
  },

  async loadPage(isRefresh = false) {
    if (this.data.finished) return

    const statusMap = ['', 'PENDING', 'DONE']
    const filter = statusMap[this.data.activeTab]

    let query = db.collection('orders')
    if (filter) {
      query = query.where({ status: filter })
    }

    const res = await query
      .orderBy('createdAt', 'desc')
      .skip(this.data.page * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .get()
    
    console.log(res)
    const list = res.data.map(o => ({
      ...o,
      totalCount: o.items.reduce((sum, i) => sum + i.count, 0),
      timeStr: this.formatTime(o.createdAt)
    }))

    this.setData({
      orders: isRefresh ? list : this.data.orders.concat(list),
      page: this.data.page + 1,
      finished: list.length < PAGE_SIZE
    })
  },

  refresh() {
    this.setData({ page: 0, finished: false })
    this.loadPage(true)
  },

  formatTime(ts) {
    const date = new Date(ts)
    return `${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
  }
})
