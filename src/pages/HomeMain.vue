<template>
<div style="background:#fff;">
    <div class="banner">
        <img src="../assets/homeMain/banner.png">
    </div>
    <div class="title">
        <h2>UTCOIN交易中心</h2>
        <div>我们是全球领先的数字资产交易平台之一，服务数百万用户，我们有专业分布式架构和防DDOS攻击系统。UTCOIN.IO致力于为全球用户提供安全、快捷的数字货币的产品体验。</div>
    </div>
    <div class="icons">
        <div>
            <img  src="../assets/homeMain/icon1.png">
            <p>专业团队</p>
            <span>拥有顶级的分布式架构和反欺诈技术，为您的资金保驾护航</span>
        </div>
        <div>
            <img  src="../assets/homeMain/icon2.png">
            <p>稳定高效</p>
            <span>多重审核风控体系，保证交易量活跃，高效运作</span>
        </div>
        <div>
            <img  src="../assets/homeMain/icon3.png">
            <p>简单快捷</p>
            <span>操作简单，迅速下单，打造优质易用的产品</span>
        </div>
        <div>
            <img  src="../assets/homeMain/icon4.png">
            <p>专业团队</p>
            <span>我们的成员来自于顶级金融机构、互联网公司，为您提供极致的服务</span>
        </div>
    </div>
    <div class="title">
        <h2>买卖交易</h2>
    </div>
    <div class="buy">
        <div>
            <img  src="../assets/homeMain/ETH.png">
            <p>ETH</p>
            <p><el-button type="primary" plain @click="goC2C(1,'ETH')">购买</el-button></p>
            <p><el-button type="primary" plain @click="goC2C(2,'ETH')">出售</el-button></p>
        </div>
        <div>
            <img  src="../assets/homeMain/UTCT.png">
            <p>UTCT</p>
            <p><el-button type="primary" plain @click="goC2C(1,'UTCT')">购买</el-button></p>
            <p><el-button type="primary" plain @click="goC2C(2,'UTCT')">出售</el-button></p>
        </div>
        <div>
            <img  src="../assets/homeMain/usdt.png">
            <p>USDT</p>
            <p><el-button type="primary" plain @click="goC2C(1,'USDT')">购买</el-button></p>
            <p><el-button type="primary" plain @click="goC2C(2,'USDT')">出售</el-button></p>
        </div>
        <div>
            <img  src="../assets/homeMain/BTC.png">
            <p>BTC</p>
            <p><el-button type="primary" plain @click="goC2C(1,'BTC')">购买</el-button></p>
            <p><el-button type="primary" plain @click="goC2C(2,'BTC')">出售</el-button></p>
        </div>

    </div>
</div>
</template>
<script>
export default {
  computed: {
    userloggedin() {
      return this.$store.getters.loggedIn
    },
  },
  methods: {
    goC2C(type, symbol){
      if(this.userloggedin){
        this.$router.push({
          path: '/c2c'
        })
      }else{
        this.$message({
          type: 'warning',
          message: '请登录',
          duration: 1000
        })
        this.$router.push('/user/login')
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.banner{
    width: 100%;
    height: auto;
    img{
        width: 100%;
        height: auto;
    }
}
.title{
    width: 1200px;
    margin: 0 auto;
    padding: 60px 128px;
    color: #001454;
    text-align: center;
    h2{
        font-size: 36px;
        margin-bottom: 40px;
    }
    div{
        font-size: 18px;
        color: #858fb0;
    }
}
.icons{
    width:80%;
    margin: 0 10%;
    height: 220px;
    display: flex;
    justify-content: center;
    align-content: center;
    div{
        flex: 1;
        text-align: center;
        padding: 10px;
        p{
            margin: 10px 0;
          color: #001454;
          font-size: 20px;
        }
        span{
          text-align: center;
          display: block;
          padding: 0 32px;
          font-size: 16px;
          color: #a2a7b4;
        }
    }
}
.buy{
    width:80%;
    margin: 0 10%;
    height: 500px;
    padding-bottom: 150px;
    display: flex;
    justify-content: center;
    align-content: center;
    div{
        border: 1px solid #eeeeee;
        border-radius: 10px;
        flex: 1;
        text-align: center;
        margin: 10px 30px;
        padding: 50px 0;
        p{
            margin: 10px 0;
        }
        button{
            margin-bottom: 10px;
            width: 140px;
            height: 50px;
            background: #ffffff;
            color: #6679f4;
        }
    }
}
</style>
