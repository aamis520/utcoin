// OTC 相关接口
import axios from 'axios'
import store from '../store/store'
import { Message } from 'element-ui'
// 创建axios实例
axios.defaults.headers.post['Content-Type'] = 'application/json';

const service = axios.create({
  // baseURL: process.env.API_HOST,
  // baseURL: 'http://10.6.3.233:9100/api',
  baseURL: 'https://japi.utcoin.io/api',
  timeout: 15000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  if(store.getters.getToken){
    config.headers['Authorization'] = store.getters.getToken
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    let msgFlag = false
    let url = response.config.url
    let chatUrl1 = 'https://japi.utcoin.io/api/chat/chatRecord/getChatRecordByOrderId'
    let chatUrl = 'https://japi.utcoin.io/api/chat/chatRecord/getUnread'
    if(url == chatUrl){
      msgFlag = true
    }
    console.log(msgFlag)
    if(response.statusCode) {
      var res = response
    } else {
      var res = response.data
    }
    // const res = response.data
    if(res.statusCode == 200){
      return res
    }else {
      if(res.statusCode == 1000){
        // let url = process.env.API_HOST + '/user/login'
        Message({
          message: '请重新登陆',
          showClose: true,
          type: 'warning',
          duration: 500
        })
        store.dispatch('userLogout')
      }else if(res.statusCode == 1026){
        Message({
          message: res.msg,
          type: 'warning',
          showClose: true,
          duration: 1000
        })
        router.replace('accountUser/identityverify')
      }else {
        if(!msgFlag){
          Message({
            message: res.msg,
            type: 'warning',
            duration: 1000
          })
        }

      }
      return Promise.reject(res)
    }
  },
  error => {
    console.log(error)
    if(error.statusCode == 1026){
      Message({
        message: error.msg,
        type: 'warning',
        duration: 1000
      })
      router.replace('accountUser/identityverify')
    }else {
      if(error.msg){
        Message({
          message: error.msg,
          iconClass: 'errorMessage',
          duration: 1000
        })

      }
    }
    return Promise.reject(error)
  }
)

const api = {
  /*
  * User
  */
  getUserInfoByUid (userId) {
    return service({
      url: '/otc/user/' + userId,
      method: 'get'
    })
  },
  /*
  * 资产 7010:
  */
  // 获取用户所有虚拟币
  getUserCoins (userId) {
    return service({
      url: '/account/accounts/' + userId,
      method: 'get'
    })
  },

  // 获取用户账户资产充值入账明细
  getUserAssetsDepositList (userId) {
    return service({
      url: '/account/accounts/' + userId,
      method: 'get'
    })
  },
  // 获取用户账户资产明细
  getUserAssetsList (userId, pageNo, pageSize) {
    return service({
      url: '/account/c2c/account/asset/detail/' + userId + '/' + pageNo +'/'+pageSize,
      method: 'get'
    })
  },

  // 获取用户账户资产划转入账明细
  getUserAssetsTransferInList (userId, pageNo, pageSize) {
    return service({
      url: '/account/c2c/account/asset/transfer/in/detail/' + userId + '/' + pageNo +'/'+pageSize,
      method: 'get'
    })
  },

  // 获取用户账户资产划转出账明细
  getUserAssetsTransferOutList (userId, pageNo, pageSize) {
    return service({
      url: '/account/c2c/account/asset/transfer/out/detail/' + userId + '/' + pageNo +'/'+pageSize,
      method: 'get'
    })
  },

  // 获取用户账户资产提现出账明细
  getUserAssetsWithdrawList (userId, pageNo, pageSize) {
    return service({
      url: '/account/c2c/account/asset/withdraw/detail/' + userId + '/' + pageNo +'/'+pageSize,
      method: 'get'
    })
  },

  // 获取用户法币账户所有币种信息
  getUserC2CCoins (userId) {
    return service({
      url: '/account/c2c/account/info/' + userId,
      method: 'get'
    })
  },

  // 获取用户法币账户指定币种信息
  getUserC2CCoinInfoBySymbol (userId) {
    return service({
      url: '/account/c2c/account/info/' + userId,
      method: 'get'
    })
  },

  // C2C交易是否支持的币种
  checkIsSupportCurrency (symbol) {
    return service({
      url: '/account/c2c/currency/'+ symbol + '/support',
      method: 'get'
    })
  },

  // 获取C2C交易支持的所有币种列表
  getSupportCurrencys (symbol) {
    return service({
      url: '/account/c2c/currency/list',
      method: 'get'
    })
  },

  /*
  * C2C
  */
  // 添加申诉
  addComplaint (data) {
    return service({
      url: '/otc/complaint/add',
      method: 'post',
      data: data
    })
  },

  // 添加商家
  addMerchant (data) {
    return service({
      url: 'http://10.6.3.233:9100/merchant/add',
      method: 'get',
      params: data
    })
  },

  // 获取商家信息
  getMerchantInfo (userId) {
    return service({
      url: '/otc/user/' + userId,
      method: 'get'
    })
  },

  // 获取订单列表
  getOrderList (data) {
    return service({
      url: '/otc/order',
      method: 'get',
      params: data
    })
  },
  // 获取实时交易单
  getTimeOrder (userId,data) {
    return service({
      url: '/otc/order/' + userId + '/progressing',
      method: 'get',
      params: data
    })
  },

  // 用户下单
  addOrder (data) {
    return service({
      url: '/otc/order/add',
      method: 'post',
      data
    })
  },

  // 买家取消买家取消
  buyerCancelOrder (data) {
    return service({
      url: '/otc/order/buyer/cancel',
      method: 'post',
      params:data
    })
  },

  // 买家付款付款
  buyerPay (data) {
    return service({
      url: '/otc/order/buyer/pay',
      method: 'post',
      params:data
    })
  },

  // 获取订单详情
  getOrderDetai (data) {
    return service({
      url: '/otc/order/detail',
      method: 'get',
      params: data
    })
  },

  // 卖家取消
   sellerCancelOrder (data) {
    return service({
      url: '/otc/order/seller/cancel',
      data,
      method: 'post'
    })
  },

  // 放行
   sellerDischarge (data) {
    return service({
      url: '/otc/order/seller/discharge',
      method: 'post',
      params:data
    })
  },

  // C2C交易 - 法币账户资金划转
   accountTransfer (data) {
    return service({
      url: '/otc/c2c/account/transfer',
      method: 'post',
      data: data
    })
  },

  // 发布交易信息
  addTransaction (data) {
    return service({
      url: '/otc/transaction/add',
      method: 'post',
      data
    })
  },

  // 取消交易信息
  cancelTransaction (data) {
    return service({
      url: '/otc/transaction/cancel',
      method: 'get',
      params: data
    })
  },

  // 根据类型、币种获取交易信息列表 （首页列表用）
  getTransactionListByCoinType (data) {
    return service({
      url: '/otc/transaction/list',
      method: 'get',
      params: data
    })
  },

  // 根据商家ID获取交易信息列表
  getTransactionByMerchantId (merchantId,type,data) {
    return service({
      url: '/otc/transaction/'+ merchantId + '/' + type,
      method: 'get',
      params: data
    })
  },

  // 根据交易信息ID获取详情
  getTransactionById (transactionId,data) {
    return service({
      url: '/otc/transaction/' + transactionId,
      method: 'get',
      params: data
    })
  },

  // 添加银行卡信息
  addBankCardInfo (data) {
    return service({
      url: '/otc/pay/banks',
      method: 'post',
      data:data
    })
  },

  // 银行卡开关开关
  setCardUseful (data) {
    return service({
      url: '/otc/pay/onOff',
      method: 'post',
      data: data
    })
  },

  // 获取银行卡信息
  getBankCardInfo (userId) {
    return service({
      url: '/otc/pay/' + userId + '/banks',
      method: 'get'
    })
  },

  // chat
  addChat(data) {
    return service({
      url: '/chat/chatRecord/add',
      method: 'post',
      data: data
    })
  },

  // 查询所有聊天记录通过订单ID
  getAllChatRecordByOrderId(data){
    return service({
      url: '/chat/chatRecord/getChatRecordByOrderId',
      method: 'post',
      data: data
    })
  },

  // 获取未读消息
  getUreadChatRecord(data){
    return service({
      url: '/chat/chatRecord/getUnread',
      method: 'post',
      data: data
    })
  }

}

export { api }

