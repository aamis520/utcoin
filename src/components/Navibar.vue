<template>
  <div class="index_top_t">
    <div class="logo" @click="goHome"></div>
    <div class="nav">
      <router-link class="navbar" active-class="navbar-active" to="/home">{{$t('navigation.home')}}</router-link>
      <!-- <router-link class="navbar" active-class="navbar-active" to="/exchange/coinexchange">
        {{$t('navigation.exchange')}}
      </router-link> -->
      <!-- <router-link class="navbar" to="/accountUser">个人中心</router-link> -->
      <router-link class="navbar" active-class="navbar-active" to="/c2c">C2C</router-link>
    </div>
    <div class="login_btn_div" v-if="!userloggedin">
      <router-link class="login_btn_div_login" to="/user/login">{{$t('Login')}}</router-link>
      <router-link class="login_btn_div_register" to="/user/regist">{{$t('Sign Up')}}</router-link>
    </div>
    <!-- <div class="person-nav-wrapper" v-if="userloggedin"> -->
    <div class="person-nav-wrapper" v-if="userloggedin">
      <router-link class="order-nav order-advertisement" active-class="order-adver-active" to="/myAdverment">
        我的广告
      </router-link>
      <router-link class="order-nav" active-class="order-nav-active" to="/orderHome" @click.native="clickOrder">
        {{$t('navigation.orders')}}
      </router-link>
      <el-dropdown class="person-nav" :class="{'person-nav-active':isPersonNav}" trigger="click">
        <el-badge is-dot :hidden="userNameBange">
          <span v-if="username">{{username}}</span>
          <span v-else>{{userMobile}}</span>
        </el-badge>
        <el-dropdown-menu slot="dropdown" class="nav-dropdown" style="background:#202832;border-color:#202832;">
          <el-dropdown-item style="">
            <span class="person-nav-block"></span>
          </el-dropdown-item>
          <el-dropdown-item class="el-hover-bg">
            <el-badge is-dot :hidden="setPassBange">
              <span class="person-nav-block" @click="goSecurity">{{$t('Account Security')}}</span>

            </el-badge>
          </el-dropdown-item>
          <el-dropdown-item class="el-hover-bg">
            <el-badge is-dot :hidden="authBange">
            <span class="person-nav-block" @click="goIdentityVerify">{{$t('Identity Authentication')}}</span>

            </el-badge>
          </el-dropdown-item>
          <el-dropdown-item class="el-hover-bg">
            <el-badge is-dot :hidden="payBange">
              <span class="person-nav-block" @click="goPayment">支付方式</span>
            </el-badge>
          </el-dropdown-item>
          <el-dropdown-item class="el-hover-bg">
            <span class="person-nav-block logout" @click="logout">{{$t('Log Out')}}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <router-link class="assets-nav" active-class="assets-nav-active" to="/property/coinoption"
        @click.native="clickAssets">{{$t('navigation.assets')}}
      </router-link>
    </div>
    <span :key="key"></span>
  </div>
</template>

<script>
  import { logout } from '@/static/authApi'

  export default {
    name: 'Navibar',
    props: {},
    data() {
      return {
        orderImg: true,
        assetsImg: true,
        user: {
          loggedin: false
        },
        isPersonNav: false
      }
    },
    computed: {
      userNameBange(){
        let authState = this.$store.getters.getUserStatus
        let hasSettedPinCode = this.$store.getters.hasSettedPinCode
        if((authState ==3 || authState ==4) && hasSettedPinCode== 1 ){
          return true
        }else{
          return false
        }
      },
      setPassBange(){
        let authState = this.$store.getters.authState
        let hasSettedPinCode = this.$store.getters.hasSettedPinCode
        if(hasSettedPinCode == 1){
          return true
        }else{
          return false
        }
      },
      authBange(){
        let authState = this.$store.getters.getUserStatus
        let hasSettedPinCode = this.$store.getters.hasSettedPinCode
        if((authState ==3 || authState ==4)){
          return true
        }else{
          return false
        }
      },
      payBange(){
        let status = this.$store.getters.getterPayWay
        if(status == '0'){
          return false
        }else{
          return true
        }
      },
      userloggedin() {
        return this.$store.getters.loggedIn
      },
      username() {
        return this.$store.getters.username
      },
      userMobile(){
        return this.$store.getters.userPhoneNum
      },
      key(){
        let name = this.$route.name
        let strs = ['security','identityverify','home']
        let flag = false
        for(let i=0;i<strs.length;i++){
          if(name == strs[i]){
            flag = true
            break
          }
        }
        if(flag){
          this.isPersonNav = true
        }else{
          this.isPersonNav = false
        }
        return this.$route.name !== undefined? this.$route.name +new Date(): this.$route +new Date()
      }
    },
    created() {},
    mounted() {},
    watch: {

    },
    methods: {
      changeIsPersonNav(){
        this.$message.success(this.$router.path)
      },
      goHome() {
        this.$router.push({name: 'home', path: '/home'})
      },
      goSecurity() {
        this.$router.push({name: 'security', path: '/account/security'})
      },
      goIdentityVerify() {
        this.$router.push({name: 'identityverify', path: '/accountUser/identityverify'})
      },
      goPayment(){
        this.$router.push({path: '/accountUser/Payment'})
      },
      logout() {
        // 先调java的接口
        // console.log(this.$store.getters) //
        let id = this.$store.getters.getUserId

        logout(id).then(res => {

          localStorage.removeItem('token')
          this.$store.dispatch('userLogout')

        }).catch(err => {
          localStorage.removeItem('token')
          this.$store.dispatch('userLogout')
        })
      },
      clickOrder() {
        // this.$router.push({path:'/orderHome'})
        this.orderImg = false
        this.assetsImg = true
      },
      clickAssets() {
        this.assetsImg = false
        this.orderImg = true
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel='stylesheet/scss' scoped>
  .index_top_t {
    text-align: center;
    width: 100%;
    min-height: 56px;
    height: auto;
    background: #202832;
    overflow: hidden
  }

  .logo {
    float: left;
    width: 132px;
    height: 56px;
    font-size: 20px;
    line-height: 56px;
    color: #fff;
    text-align: center;
    background: url('~@/assets/img/logo.png') no-repeat center;
    margin-left: 80px;
    cursor: pointer;
  }

  .nav {
    width: auto;
    margin-left: 90px;
    height: 56px;
    min-width: 320px;
    float: left;
    font-size: 14px;
  }

  .nav a {
    float: left;
    width: auto;
    margin-right: 65px;
    height: 56px;
    line-height: 56px;
    text-decoration: none;
  }

  .nav a:hover {
    color: #4c54f9;
    text-decoration: none;
  }

  .nav_show {
    color: #4c54f9 !important;
  }

  .login_btn_div {
    float: right;
    width: 170px;
    height: 56px;
    padding-top: 13px;
    box-sizing: border-box;
    margin-right: 95px;
  }

  .login_btn_div a {
    width: 80px;
    height: 30px;
    border-radius: 3px;
    font-size: 12px;
    display: block;
    float: left;
    box-sizing: border-box;
  }

  .login_btn_div_register {
    background: #4c54f9;
    color: white;
    float: right !important;
    line-height: 30px;
  }

  .login_btn_div_login {
    border: 1px solid #4c54f9;
    color: #4c54f9;
    line-height: 28px;
  }

  .person-nav-wrapper {
    float: right;
    height: 56px;
    padding-top: 13px;
    box-sizing: border-box;
    margin-right: 95px;
    overflow: hidden;
    cursor: pointer;
  }

  .person-nav-wrapper > a > img {
    display: inline-block;
    vertical-align: middle;
    margin-right: 10px;
  }

  .person-nav {
    color: #8d9fb8;
    padding: 0 20px;
    margin-left:10px;
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    display: block;
    float: left;
    box-sizing: border-box;
    outline: none;
    background: url('~@/assets/img/user.png') no-repeat left;
  }
  .person-nav-active{
    color: #4c54f9;
  }


  .person-nav > span > img {
    display: inline-block;
    vertical-align: middle;
    margin-right: 10px;
  }

  .person-nav-block {
    color: #c2c3ca;
    text-align: left;
    /* padding: 0 15px; */
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    display: block;
    box-sizing: border-box;
    outline: none;
    overflow: hidden;
    white-space: nowrap;
  }
  .person-nav-block.logout{
    color: #627482;
  }
  .order-nav {
    color: #8d9fb8;
    padding: 0 18px;
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    display: block;
    float: left;
    box-sizing: border-box;
    outline: none;
    background: url('../assets/img/order.png') no-repeat left;
  }

  .order-advertisement{
    background: url('../assets/img/adver.png') no-repeat left;
  }

  .order-nav-active {
    color: #4c54f9;
    background: url('../assets/img/selected-order.png') no-repeat left;
  }

  .order-adver-active{
    color: #4c54f9;
    background: url('../assets/img/adver_active.png') no-repeat left;
  }
  .assets-nav {
    color: #8d9fb8;
    padding: 0 20px;
    height: 30px;
    margin-left:10px;
    line-height: 30px;
    font-size: 12px;
    display: block;
    float: left;
    box-sizing: border-box;
    outline: none;
    background: url('../assets/img/assets.png') no-repeat left;
  }

  .assets-nav-active {
    color: #4c54f9;
    background: url('../assets/img/selected_assets.png') no-repeat left;
  }

  .person-nav-active {
    color: #4c54f9;
    padding: 0 20px;
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    display: block;
    float: left;
    box-sizing: border-box;
    outline: none;
    background: url('~@/assets/img/selcted_user.png') no-repeat left;
  }

  .navbar {
    color: #8d9fb8;
  }

  .nav:hover {
    color: #4c54f9;
    text-decoration: none;
  }

  .navbar-active {
    color: #4c54f9;
  }
</style>
