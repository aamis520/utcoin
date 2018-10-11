const cTwocUser = {
  state: {
    userCToC: {
      isExistPaymentPwd: '',
      paymentStatus: '',
      merchant:{
        status:'', // 1 商家， 0.普通用户
        userId: '',
        createTime: '', // 注册时间
        turnover: '',
        merchantName: '',
        id:''
      },
      verifyEmailStatus: ''
    },
    lang: 'en-us'
  },
  mutations: {
    // login(state, params) {
    //   state.userCToC = JSON.parse(params)
    //   localStorage.removeItem('userCToC')
    //   localStorage.setItem('userCToC', JSON.stringify(state.userCToC))
    // },
    // logout(state) {
    //   state.userCToC = {}
    //   localStorage.removeItem('userCToC')
    //   router.replace({path: '/user/login'})
    // },
    // 更新loca里边的mechant中的status
    updateCtoCStatus(state,params) {
      state.userCToC = JSON.parse(window.localStorage.getItem('userCToC'))
      state.userCToC.merchant.status = params
      window.localStorage.setItem('userCToC', JSON.stringify(state.userCToC))
    },
    // 更新loca里边的mechant中的merchantName
    updateMerchantName(state,params) {
      state.userCToC = JSON.parse(window.localStorage.getItem('userCToC'))
      state.userCToC.merchant.merchantName = params
      window.localStorage.setItem('userCToC', JSON.stringify(state.userCToC))
    },
    // 更新loca里边的mechant中的createTime
    updateCreatTime(state,params) {
      state.userCToC = JSON.parse(window.localStorage.getItem('userCToC'))
      state.userCToC.merchant.createTime = params
      window.localStorage.setItem('userCToC', JSON.stringify(state.userCToC))
    },
    // 更新loca里边的mechant中的userId
    updateMechantUserId(state,params) {
      state.userCToC = JSON.parse(window.localStorage.getItem('userCToC'))
      state.userCToC.merchant.userId = params
      window.localStorage.setItem('userCToC', JSON.stringify(state.userCToC))
    },
    // 更新loca里边的总成单次数
    updateTurNover(state,params) {
      state.userCToC = JSON.parse(window.localStorage.getItem('userCToC'))
      state.userCToC.merchant.turnover = params
      window.localStorage.setItem('userCToC', JSON.stringify(state.userCToC))
    },
    // 更新loca里边的设置支付方式
    updatePayWay(state,params) {
      state.userCToC = JSON.parse(window.localStorage.getItem('userCToC'))
      state.userCToC.paymentStatus = String(params)
      window.localStorage.setItem('userCToC', JSON.stringify(state.userCToC))
    },
    CHANGE_LANG(state, params) {
      state.lang = params.lang
      localStorage.removeItem('lang')
      localStorage.setItem('lang', params.lang)
    }
  },
  getters: {
    // 获取用户是否是商家的状态--如果vuex中不存在的话 status
    getterMerchantCtoCStatus (state) {
      if (!state.userCToC.merchant.status) {
        if (JSON.parse(window.localStorage.getItem('userCToC')) != null) {
          state.userCToC.merchant.status = JSON.parse(window.localStorage.getItem('userCToC')).merchant.status
        }
      }
      return state.userCToC.merchant.status
    },
    // 获取用户name--如果vuex中不存在的话 ，从新从loca里边取值
    getterMerchantName (state) {
      if (!state.userCToC.merchant.merchantName) {
        if (JSON.parse(window.localStorage.getItem('userCToC')) != null) {
          state.userCToC.merchant.merchantName = JSON.parse(window.localStorage.getItem('userCToC')).merchant.merchantName
        }
      }
      return state.userCToC.merchant.merchantName
    },
    // 获取用户createTime--如果vuex中不存在的话 ，从新从loca里边取值
    getterCreatTime (state) {
      if (!state.userCToC.merchant.createTime) {
        if (JSON.parse(window.localStorage.getItem('userCToC')) != null) {
          state.userCToC.merchant.createTime = JSON.parse(window.localStorage.getItem('userCToC')).merchant.createTime
        }
      }
      return state.userCToC.merchant.createTime
    },
    // 获取用户uid--如果vuex中不存在的话 ，从新从loca里边取值
    getterMechantUid (state) {
      if (!state.userCToC.merchant.userId) {
        if (JSON.parse(window.localStorage.getItem('userCToC')) != null) {
          state.userCToC.merchant.userId = JSON.parse(window.localStorage.getItem('userCToC')).merchant.userId
        }
      }
      return state.userCToC.merchant.userId
    },
    // 获取id--如果vuex中不存在的话 ，从新从loca里边取值
    getterMechantId(state) {
      if (!state.userCToC.merchant.id) {
        if (JSON.parse(window.localStorage.getItem('userCToC')) != null) {
          state.userCToC.merchant.id = JSON.parse(window.localStorage.getItem('userCToC')).merchant.id
        }
      }
      return state.userCToC.merchant.id
    },
    // 获取用户总成单次数--如果vuex中不存在的话 ，从新从loca里边取值
    getterTurNover (state) {
      if (!state.userCToC.merchant.turnover) {
        if (JSON.parse(window.localStorage.getItem('userCToC')) != null) {
          state.userCToC.merchant.turnover = JSON.parse(window.localStorage.getItem('userCToC')).merchant.turnover
        }
      }
      return state.userCToC.merchant.turnover
    },
    // 获取用户支付方式存在的状态--如果vuex中不存在的话 ，从新从loca里边取值
    getterPayWay (state) {
      if (!state.userCToC.paymentStatus) {
        if (JSON.parse(window.localStorage.getItem('userCToC')) != null) {
          state.userCToC.paymentStatus = JSON.parse(window.localStorage.getItem('userCToC')).paymentStatus
        }
      }
      return state.userCToC.paymentStatus
    },
    user: (state) => {
      return state.userCToC
    },
    getctocUserId: (state) => {
      return state.userCToC.id
    },
    getctocLang: (state) => {
      return state.lang
    }
  },
  actions: {
    // 异步更新loca里边status --是否是商家的状态
    getMerchantStatus({commit}, params) {
      commit('updateCtoCStatus', params)
    },
    // 异步更新loca里边merchantName
    getCreateTime({commit}, params) {
      commit('updateMerchantName', params)
    },
    // 异步更新loca里边uid
    getCreateTime({commit}, params) {
      commit('updateCreatTime', params)
    },
    // 异步更新loca里边uid
    getUid({commit}, params) {
      commit('updateMechantUserId', params)
    },
    // 异步更新loca里边总成单次数
    getTurNover({commit}, params) {
      commit('updateTurNover', params)
    },
    // 异步更新loca里边支付方式的存在状态
    getPayWay({commit}, params) {
      commit('updatePayWay', params)
    },
    changeLang({commit}, params) {
      commit('CHANGE_LANG', params)

    }
  }
}
export default cTwocUser
