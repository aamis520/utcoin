<template>
  <div id="app" style="min-width:1100px;">
    <transition name="fade" mode="out-in" :duration="300">
      <router-view />
    </transition>
  </div>
</template>

<script>
  import {getUserInfo} from '@/static/authApi'
  export default {
    name: 'App',

    beforeCreate() {
      // 获取local


    },
    created(){
      var userInfo = JSON.parse(localStorage.getItem('__uinfo'))
      if (userInfo) {
        let userId = userInfo.userId
        getUserInfo(userId).then(res => {
          // 这个接口仅仅为了页面刷新更改用户实名状态
          if(res.statusCode == 200){
            console.log(res)
            userInfo.userStatus = res.data.userStatus
            this.$store.dispatch('userLogin', userInfo)
            this.$store.dispatch('setUserId', userInfo.userId)
            if(userInfo.userStatus){
              this.$store.dispatch('changeUserStatus',userInfo.userStatus)
            }
          }
        })

        var hasPayCode = localStorage.getItem('hasSettedPinCode')
        if(hasPayCode == 1){
          this.$store.dispatch('completeSettedPincode',1)
        }else{
          this.$store.dispatch('completeSettedPincode',0)
        }
      }
      this.$store.dispatch("changeLang", {
					lang:localStorage.getItem('lang')
      });
      this.changeLan()
    },
    computed:{
      lang(){
        if(this.$store.getters.getLang == localStorage.getItem('lang')){
             return this.$store.getters.getLang
			  }else {
            return localStorage.getItem('lang')
        }
      },
    },
    watch:{
      lang(){
        this.changeLan()
      }
    },
    methods:{
      // 改变语言
      changeLan() {
        let langs = {
          "zh-cn": {
            name:"简体中文",
            code:1
          },
          "en-us": {
            name:"English",
            code:0
          }
        }



      },
    }


  }
</script>

<style rel='stylesheet/scss' scoped>
  #app {
    font-family: 'Microsoft YaHei', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    width: 100%;
    margin: 0 auto;
    height: 100%;
  }

  *, body {
    padding: 0px;
    margin: 0px auto;
    box-sizing: border-box;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  a {
    text-decoration: none
  }

</style>
