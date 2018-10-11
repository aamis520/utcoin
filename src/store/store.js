import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'
import cTwocUser from './modules/cTwocUserInfo'




Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    userInfo: {
      loggedin: false,   //登录状态
      nationality: 1,       //默认中国
      id: 0,                 //用户id
      name: '',             //用户名
      email: '',            //用户邮箱
      hasSettedPinCode: 0,   //是否设置了资金密码 1是0否
      authState: 1,         //认证状态 1未认证 2认证被拒绝 3认证中 4已认证
      lang:'en-us',
      userStatus: 1
      // language:'zh',
      // language_node:0,
    },
    authToken: localStorage.getItem('token') ? localStorage.getItem('token') : '',
    lang: 'en-us',
    userId: '',
    loggedin: false,
    hasSettedPinCode: 0,   //是否设置了资金密码 1是0否
    userStatus: 1, // 0未激活 1 已激活 2 认证中 3 认证成功
  },
  modules: {
    cTwocUser
  },
  mutations: {
    SET_TOKEN(state, token){
      state.authToken = token
    },
    login(state, params) {
      state.userInfo = params
      state.loggedin = true
      localStorage.removeItem('__uinfo')
      localStorage.setItem('__uinfo', JSON.stringify(state.userInfo))
    },
    logout(state) {
      state.loggedin = false
      state.userInfo.id = 0
      state.userInfo.nationality = 1
      state.userInfo.name = ''
      state.userInfo.paymentpsw = ''
      state.userInfo.token = ''
      state.userInfo.userMobile = ''
      state.userInfo.userId = ''
      state.userInfo.userRealName = ''
      state.userInfo.userStatus = '1'
      state.hasSettedPinCode = 0
      state.userId = ''
      state.userInfo.authState = 1

      localStorage.removeItem('__uinfo')
      localStorage.removeItem('userCToC')
      router.replace({path: '/user/login'})
    },
    LoginLong(state){
      state.loggedin = false
      state.userInfo.id = 0
      state.userInfo.nationality = 1
      state.userInfo.name = ''
      state.userInfo.email = ''
      state.hasSettedPinCode = 0
      state.userInfo.authState = 1
      localStorage.removeItem('__uinfo')
      router.replace
      ({path: '/home'})
    },
    completeAuth(state) {
      state.userInfo.authState = 3
      localStorage.removeItem('__uinfo')
      localStorage.setItem('__uinfo', JSON.stringify(state.userInfo))
    },
    completeSettedPinCode(state,status) {
      state.hasSettedPinCode = status
      localStorage.removeItem('hasSettedPinCode')
      localStorage.setItem('hasSettedPinCode', status)
    },
    CHANGE_LANG(state, params) {
      state.lang = params.lang
      localStorage.removeItem('lang')
      localStorage.setItem('lang', params.lang)
    },
    changeAuth(state, params){
      state.userInfo.authState = params.authState
      localStorage.removeItem('__uinfo')
      localStorage.setItem('__uinfo', JSON.stringify(state.userInfo))
    },
    // 更新loca里边的邮箱是否认证的状态
    // SET_USERID(state,params) {
    //   state.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
    //   state.userInfo.verifyEmailStatus = params
    //   window.localStorage.setItem('userInfo', JSON.stringify(state.userInfo))
    // },
    SET_USERID(state,id){
      state.userId = id
    },
    CHANGE_USER_STATUS(state, status){
      let userInfo = JSON.parse(localStorage.getItem('__uinfo'))
      userInfo.userStatus = status
      localStorage.removeItem('__uinfo')
      localStorage.setItem('__uinfo',JSON.stringify(userInfo))
      state.userInfo.userStatus = status
      state.userStatus = status
    }
  },
  getters: {
    getToken: (state) => {
      return state.authToken
    },
    loggedIn: (state) => {
      return state.loggedin
    },
    username: (state) => {
      return state.userInfo.userRealName
    },
    userPhoneNum: (state) => {
      return state.userInfo.userMobile
    },
    useremail: (state) => {
      return state.userInfo.email
    },
    authState: (state) => {
      return state.userInfo.authState
    },
    hasSettedPinCode: (state) => {
      return state.hasSettedPinCode

    },
    getLang: (state) => {
      return state.lang
    },
    getToken: (state) => {
      return state.authToken
    },
    getUserId: (state) => {
      return state.userId
    },
    getUserInfo: (state) => {
      return state.userInfo
    },
    getUserStatus: (state) => {
      return state.userStatus
    }
  },
  actions: {
    set_token({commit},token){
      commit('SET_TOKEN',token)
    },
    userLogin({commit}, params) {
      commit('login', params)
    },
    userLogout({commit}) {
      localStorage.removeItem('token')
      commit('SET_TOKEN','')
      commit('logout')
    },
    completeAuth({commit}) {
      commit('completeAuth')
    },
    completeSettedPincode({commit}, status) {
      commit('completeSettedPinCode', status)
    },
    changeLang({commit}, params) {
      commit('CHANGE_LANG', params)

    },
    changeAuthState({commit},params){
      commit('changeAuth',params)
    },
    // 登陆超时
    loginLong({commit}){
      commit('SET_TOKEN','')
      commit('LoginLong')
    },
    setUserId({commit},id) {
      commit('SET_USERID', id)
    },
    changeUserStatus({commit}, status){
      commit('CHANGE_USER_STATUS',status)
    }
  }
})

export default store
