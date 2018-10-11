// 用户相关接口  资产相关接口
import axios from 'axios'
import { Message } from 'element-ui'
import store from '../store/store.js'

// 创建axios实例
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';


const service = axios.create({
  // baseURL: process.env.AUTH_API_HOST,
  // baseURL: 'http://10.6.3.233:9100/api',
  baseURL: 'https://japi.utcoin.io/api',
  timeout: 10000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  if (store.getters.getToken) {
    config.headers['Authorization'] = store.getters.getToken // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(

  response => {
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
        Message({
          message: '请重新登陆',
          showClose: true,
          type: 'warning',
          duration: 500
        })
        store.dispatch('userLogout')
      }
      return Promise.reject(res)
    }
  },
  error => {
    Message({
      message: error.msg,
      showClose: true,
      iconClass: 'errorMessage',
      duration: 1000
    })
    return Promise.reject(error)
  }
)



// 账号激活
export function activateAccount(token) {
  return service({
    url: 'activate',
    method: 'post',
    params: { token }
  })
}
// 查询激活状态
export function getActiveStatus(data){
  return service({
    url: 'activeStatus',
    method: 'post',
    data: data
  })
}
// 发送激活邮件
export function sendActiveEmail(params){
  return service({
    url: 'sendActiveEmail',
    method: 'post',
    data: params
  })
}
// 再次发送
// 注册


// 退出



// 忘记密码 1
export function forgetPwdStepFirst(email) {
  return service({
    url: '/password/step1/confirm/email',
    method: 'post',
    data:{email}
  })
}

// 忘记密码 2
export function forgetPwdStepSecond( params ) {
  return service({
    url: '/password/get/step2/'+ params.email + '/' + params.code + '/confirm',
    method: 'get'
  })
}

//
export function sendEmailCode ( ){
  return service({
    url: '/get/step2/code',
    method: ''
  })
}

// 忘记密码 3
export function forgetPwdStepThird( params ) {
  return service({
    url: '/password/get/step3/reset'+ params.userid + '/' + params.password,
    method: 'get'
  })
}
// User
let UserURL= '/user/'
// 根据手机号获取验证码
export function getVerifycode( params ) {
  return service({
    url: UserURL +  'getVerifycode',
    method: 'post',
    data: params
  })
}
// 根据手机号校验验证码
export function checkverifycode( params ){
  return service({
    url: UserURL +  'checkverifycode',
    method: 'post',
    data: params
  })
}
// 注册
export function regist(data) {
  return service({
    url: UserURL + 'register',
    method: 'post',
    data: data
  })
}
// 登陆
export function login(data) {
  return service({
    url: UserURL + 'login',
    method: 'post',
    data: data
  })
}
// 获取用户信息
export function getUserInfo(uid) {
  return service({
    url: UserURL + 'info/' + uid,
    method: 'get',
  })
}
// 添加银行卡
export function addBanks(data) {
  return service({
    url: UserURL + 'banks',
    method: 'post',
    data: data
  })
}
// 提交身份验证信息 certification
export function certification(data) {
  return service({
    url: UserURL + 'certification',
    method: 'post',
    data: data
  })
}
// 找回密码 changepsw
export function changepsw(data) {
  return service({
    url: UserURL + 'changepsw',
    method: 'post',
    data: data
  })
}
// 退出登陆
export function logout(uid) {
  return service({
    url: UserURL + 'logout/' + uid,
    method: 'get',
  })
}
// 设置资金密码
export function setPayPwd(data) {
  return service({
    url: UserURL + 'paymentPwd/setting',
    method: 'post',
    data: data
  })
}
// 获取银行卡信息
export function getBanks(uid) {
  return service({
    url: UserURL + uid + '/banks',
    method: 'get',
  })
}
// 校验资金密码
export function checkPayPwd(uid,pwd) {
  return service({
    url: UserURL + uid + '/paymentPwd/vertify?paymentPwd=' + pwd,
    method: 'get',
  })
}
// 图片上传URL
export function uploadUrl() {
  return 'https://japi.utcoin.io/api/user/img/upload/multiFile'
}
// 校验资金密码
export function saveUserVerify(data) {
  return service({
    url: UserURL + 'certification',
    method: 'post',
    data: data
  })
}
// 生成用户充币地址
let assetUrl = '/dw/user'
export function createDepositAddress(userId, symbol){
  return service({
    url: assetUrl + '/address/deposit/' + userId + '/' + symbol + '/create',
    method: 'post'
  })
}
// 获取用户充币地址
export function getAddressByUserIdAndSymbol(userId, symbol) {
  return service({
    url: assetUrl + '/address/deposit/' + userId + '/' + symbol + '/get',
    method: 'get'
  })
}
// 获取指定用户充币流水
export function getDepositListByUserId(userId, pageNo, pageSize){
  return service({
    url: assetUrl + '/deposit/record/' + userId + '/list/' + pageNo + '/' + pageSize,
    method: 'get'
  })
}
// 用户发起转账申请
export function transferByUser(data) {
  return service({
    url: assetUrl + '/transfer',
    method: 'post',
    data: data
  })
}
// 获取传输费用
export function getFee(symbol, addr){
  return service({
    url: assetUrl + '/transfer/fee/' + symbol + '/' + addr,
    method: 'get'
  })
}
// 获取转账列表
export function getTransferList(userId, symbol){
  return service({
    url: assetUrl + '/transfer/list/' + userId + '/' + symbol,
    method: 'get'
  })
}
// 获取转账验证码
export function getTransferCode(data){
  return service({
    url: assetUrl + '/transfer/sendVerifyCode',
    method: 'post',
    data: data
  })
}
// 验证提币地址是否有效
export function checkWithdraw(symbol,addr){
  return service({
    url: assetUrl + '/address/withdraw/valid' + symbol + '/' + addr,
    method: 'get'
  })
}
// 删除指定提币地址
export function delWithdraw(addrId,userId){
  return service({
    url: assetUrl + '/address/withdraw/' + addrId + '/' + userId + '/delete',
    method: 'post'
  })
}
// 获取用户所有的提币地址
export function getAllWithdrawAddr(userId, pageNo, pageSize){
  return service({
    url: assetUrl + '/address/withdraw/' + userId + '/list/' + pageNo + '/' + pageSize,
    method: 'get'
  })
}
// 获取指定币种的提币地址
export function getWithdrawAddrBySymbol(userId, symbol){
  return service({
    url: assetUrl + '/address/withdraw/' + userId + '/'+ symbol + '/list',
    method: 'get'
  })
}
// 创建新的提币地址
export function addAddress(userId, symbol, address){
  return service({
    url: assetUrl + '/address/withdraw/' + userId + '/' + symbol + '/'+ address + '/create',
    method: 'post'
  })
}
// 获取指定用户的提币申请
export function getUserWithdrawApplyList(userId, pageNo, pageSize){
  return service({
    url: assetUrl + '/withdraw/apply/' + userId + '/list/' + pageNo + '/' + pageSize,
    method: 'get'
  })
}
// 获取提币费用
export function getUserWithdrawFee(symbol, amount){
  return service({
    url: assetUrl + '/withdraw/fee/' + symbol + '/' + amount + '/get',
    method: 'get'
  })
}
// 获取所有提币规则策略
export function getWithdrawRules(symbol){
  return service({
    url: assetUrl + '/withdraw/strategy/list',
    method: 'get'
  })
}
// 获取提币规则策略
export function getWithdrawRuleBySymbol(symbol){
  return service({
    url: assetUrl + '/withdraw/strategy/' + symbol + '/get',
    method: 'get'
  })
}
// 用户发起提币申请
export function applyWithdraw(data){
  return service({
    url: assetUrl + '/withdraw/' + data.userId + '/' + data.symbol + '/' + data.address + '/' + data.amount + '/apply',
    method: 'post'
  })
}
//
//
//
//
//
//
