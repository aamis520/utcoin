<template>
    <div class="footer_back">
        <!-- <div class="footer">
            <div>
                <h2>公司信息</h2>
                <h3>备案号：渝ICP备18002775号-1</h3>
                <h3>网络文化经营许可证编号：渝网文（2018）5582-118号</h3>
            </div>
            <div>
                <h2>联系我们</h2>
                <h3>重庆享玩网络科技有限公司©版权所有</h3>
                <h3>客服电话：023-63503625</h3>
            </div>
            <div>
                <h2>关于我们</h2>
                <h3>统一社会信用代码：91500103MA5YUN7M8B</h3>
                <h3>公司地址：重庆市渝中区双钢路3号12楼1209号</h3>
            </div>
            <div class="logo">
                <img src="@/assets/logoBottom.png">
            </div>
        </div> -->
        <div class="foot_ut">
          <p>
            <img src="../assets/img/ut_bottom.png" alt="">
            <span @click="goArea">UTCOIN社区</span>
            <span>Copyright@2108UTCOIN</span>
            <span @click="aboutUs">关于我们</span>
          </p>
        </div>
    </div>
</template>

<script>
export default {
    name:'Foot',
    props:{

    },
    data(){
        return{

        }
    },
    created(){

    },
    mounted () {

    },
    watch:{

    },
    methods:{
      goArea(){
        window.open('https://t.me/utcoin_io')
      },
      aboutUs(){
        this.$router.push('/explain/aboutus')
      }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel='stylesheet/scss' scoped>
.footer_back{
    background-color:#151920;
   width: 100%;
   height: 200px;
   overflow: hidden;

}

.foot_ut p{
  text-align: center;
  margin-top: 90px;
  font-size: 14px;
  color: #767b89;
}
.foot_ut img{
  width: 20px;
  position: relative;
  top: 3px;
  margin-right: 0;
}
.foot_ut span{
  margin-right: 57px;
  margin-left: 2px;
}
.footer{
    width: 1050px;
    margin:30px auto;
    overflow: hidden;
}
.footer div{
    width: 300px;
    margin: 0 10px;
    float: left;
    color: #ffffff;
}
.footer div h2{
    font-size: 16px;
    line-height: 40px;
}
.footer div h3{
    font-size: 12px;
    font-weight: 200;
    line-height: 30px;
}
.footer .logo{
    width: 70px;
    min-height: 100px;
}
.footer .logo img{
    margin-top: 70px;
}
</style>
