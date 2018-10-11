// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)
import store from './store/store'



import ElementUI from 'element-ui'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import enUS from './lang/en-us.json'
import zhCN from './lang/zh-cn.json'

import '@/permission' // permission control

// 设置默认语言
let localeDefault = localStorage.getItem('lang')
console.log(localeDefault == null)
if(localeDefault == null){
  localStorage.setItem('lang', 'zh-cn')
}


import VueI18n from 'vue-i18n'
Vue.use(VueI18n);

const messages = {
  'en-us':  Object.assign(enUS, enLocale),
  'zh-cn': Object.assign(zhCN, zhLocale)
}
const i18n = new VueI18n({
  locale: localStorage.getItem('lang') ? localStorage.getItem('lang') : 'zh-cn', // set locale
  messages:messages
})

Vue.use(ElementUI, {
	i18n: (key, value) => i18n.t(key, value)
})



// import 'element-ui/lib/theme-chalk/index.css';
import './style/ctocmain.scss';
import './style/main.scss';


import router from './router';
import Vuebar from 'vuebar';
Vue.use(Vuebar);


Vue.config.productionTip = false


// 设置白名单 未登录是可以看到的页面
router.beforeEach((to,from,next ) => {
  if(localStorage.getItem('__uinfo')){
    if(JSON.parse(localStorage.getItem('__uinfo')) && JSON.parse(localStorage.getItem('__uinfo')).loggedin && (to.path == '/user/login' || to.path == "/user/regist")){
      next()

      // next('/home')
    }else{
      next()
    }
  }else{
    next()
    // next('/user/login')
  }
})

/* eslint-disable no-new */
new Vue({
  i18n,
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
