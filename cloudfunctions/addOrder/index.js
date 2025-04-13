const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const { cartItems, totalPrice } = event
  const { OPENID } = cloud.getWXContext()

  if (!cartItems || cartItems.length === 0) {
    return { ok: false, msg: '购物车为空' }
  }

  const orderNo = `OD${Date.now()}${Math.random().toString().slice(-6)}`

  try {
    // ⚠️ 这里必须加 await
    await db.runTransaction(async trx => {
      await trx.collection('orders').add({
        data: {
          orderNo,
          userId: OPENID,
          items: cartItems,
          totalPrice,
          status: 'PENDING',
          createdAt: Date.now()
        }
      })
    })

    return { ok: true, orderNo }

  } catch (err) {
    console.error('事务失败:', err)
    return { ok: false, msg: '下单失败，请稍后重试' }
  }
}
