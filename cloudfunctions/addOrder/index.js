const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  console.log('接收到的参数:', event)
  const { cartItems, totalPrice } = event
  const { OPENID } = cloud.getWXContext()

  if (!cartItems || cartItems.length === 0) {
    return { ok: false, msg: '购物车为空' }
  }

  const orderNo = `OD${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substr(2,3)}`

  try {
    await db.collection('orders').add({
      data: {
        orderNo,
        userId: OPENID,
        items: cartItems,
        totalPrice,
        status: 'PENDING',
        createdAt: Date.now()
      }
    })
    return { ok: true, orderNo }
  } catch (e) {
    console.error('订单添加失败:', e)
    return { ok: false, msg: '下单失败' }
  }
}
