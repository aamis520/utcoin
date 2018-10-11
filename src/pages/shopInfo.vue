<!--  -->
<template>
  <div class="shopInfoContainer">
    <div class="shopInfoContainer_title">
      <div class="left">
        <span style="color:#252524;font-size:30px;">小甘老师</span>
      </div>

      <div class="rightTwo commdiv">
        <div class="innerWrapper">
          <span class="commspan">1231次</span><br>
          <span class="comnmspanbom">完成单数</span>
        </div>
      </div>
      <!-- <div class="rightThree commdiv">
        <div class="innerWrapper">
          <span class="commspan">62次</span><br>
          <span class="comnmspanbom">30日成单</span>
        </div>
      </div> -->
      <div class="rightone commdiv">
        <div class="innerWrapper">
          <span class="commspan">92%</span><br>
          <span class="comnmspanbom" >完成率</span>
        </div>
      </div>
    </div>
    <div class="sellTitle">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="在线出售" name="first">
            <div class="sellTbody" v-for="(item,index) in getSellData" :key="index">
              <div class="sellTbody_one comm">
                <img style="vertical-align: middle;" src="../assets/account/b.png" alt="icon">
                <span style="color:#000;font-size:16px;font-weight:bold;line-height:30px;">{{item.currency}}</span>
              </div>
              <div class="sellTbody_two comm">
                <span style="color:#03877c;font-size:16px;line-height:30px;">{{Number(item.amount)*Number(item.price)}} CNY / {{item.currency}}</span><br>
                <span style="color:#babac0;font-size:14px;line-height:30px;">限额：</span>
                <span style="color:#000;font-size:16px;line-height:30px;">{{item.quotaMin}}-{{item.quotaMax}}</span>
              </div>
              <div class="sellTbody_three comm">
                <div class="sellTbody_three_inner">
                  <img style="vertical-align:middle;" src="../assets/home/wallert.png" alt="icon">
                  <span>银行卡</span>
                  <img style="vertical-align:middle;margin-left:20px;" src="../assets/home/zhifubao.png" alt="icon">
                  <span>支付宝</span>
                </div>
              </div>
              <div class="sellTbody_four comm">
                  <el-button class="buInBtn" type="success">买入</el-button>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="在线购买" name="second">
            <div class="sellTbody" v-for="(item,index) in getBuyData" :key="index">
              <div class="sellTbody_one comm">
                <img style="vertical-align: middle;" src="../assets/account/b.png" alt="icon">
                <span style="color:#000;font-size:16px;font-weight:bold;line-height:30px;">{{item.currency}}</span>
              </div>
              <div class="sellTbody_two comm">
                <span style="color:#03877c;font-size:16px;line-height:30px;">{{Number(item.amount)*Number(item.price)}} CNY / {{item.currency}}</span><br>
                <span style="color:#babac0;font-size:14px;line-height:30px;">限额：</span>
                <span style="color:#000;font-size:16px;line-height:30px;">{{item.quotaMin}}-{{item.quotaMax}}</span>
              </div>
              <div class="sellTbody_three comm">
                <div class="sellTbody_three_inner">
                  <img style="vertical-align:middle;" src="../assets/home/wallert.png" alt="icon">
                  <span>银行卡</span>
                  <img style="vertical-align:middle;margin-left:20px;" src="../assets/home/zhifubao.png" alt="icon">
                  <span>支付宝</span>
                </div>
              </div>
              <div class="sellTbody_four comm">
                  <el-button class="buInBtn" type="danger">卖出</el-button>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
    </div>
  </div>
</template>

<script>
import { api } from '@/static/otcApi'
export default {
  data () {
    return {
      getSellData: [], // 在线出售数据
      getBuyData:[], // 在线购买的数据
      status:'1', // 0 是买 1是卖
      activeName: 'first',
      buyOnlineList: [
        {imgUrl: require('../assets/account/shape.png'), limitLower: '5.000', limitHigh: '200.00', beanRemarkPrice:'4618.88',unit: 'CNY / BTC'},
        {imgUrl: require('../assets/account/shape.png'), limitLower: '5.000', limitHigh: '200.00', beanRemarkPrice:'4618.88',unit: 'CNY / BTC'},
        {imgUrl: require('../assets/account/shape.png'), limitLower: '5.000', limitHigh: '200.00', beanRemarkPrice:'4618.88',unit: 'CNY / BTC'}
      ]
    };
  },

  components: {},

  computed: {},

  mounted() {
    this.getSellBack()
  },

  methods: {
    getSellBack(){
      var _this = this
      var merchantId = _this.$route.query.id
      var type = '1'
      var obj = {}
      obj.pageNo = 1
      obj.pageSize = 5
      api.getTransactionByMerchantId(merchantId,type,obj)
      .then(res => {
        if(res.statusCode == 200){
          _this.getSellData = res.data.content
        }
      })
      .catch(() => {

      })
    },
    getBuyBack(){
      var _this = this
      var merchantId = _this.$route.query.id
      var type = '0'
      var obj = {}
      obj.pageNo = 1
      obj.pageSize = 5
      api.getTransactionByMerchantId(merchantId,type,obj)
      .then(res => {
        if(res.statusCode == 200){
          _this.getBuyData = res.data.content
        }
      })
      .catch(() => {

      })
    },
    // 点击切换tab
    handleClick(){
      if(this.activeName == 'first'){
        this.status = '1'
        this.getSellBack()
      } else if(this.activeName == 'second'){
        this.getBuyBack()
      }
    }
  }
}

</script>
<style lang='scss' scoped>
  .shopInfoContainer{
    margin: 0 auto;
    width: 1200px;
    height: 1100px;
    .sellTitle{
      margin-top: 54px;
      color: #78787b;
      font-size: 16px;
    }
    .buyonline_title{
      padding-top: 54px;
      margin-top: 72px;
      // height: 115px;
      // line-height: 115px;
      border-top: 1px solid #e4e5e8;
    }
    .sellTbody{
      margin-top: 65px;
      height: 62px;
      display: flex;
      .sellTbody_one{
        flex: 1;
      }
      .sellTbody_two{
        flex: 2;
      }
      .sellTbody_three{
        flex: 2;
        position: relative;
        .sellTbody_three_inner{
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
        }
      }
      .sellTbody_four{
        flex: 1;
        text-align: right;
        .buInBtn{
          margin-top: 12px;
          width:83px;
        }
      }
    }
    .shopInfoContainer_title{
      height: 180px;
      border-bottom: 1px solid #e4e5e8;
      .commspan{
        color:#010101;
        font-size:16px;
      }
      .comnmspanbom{
        display: inline-block;
        margin-top: 5px;
        color:#999;
        font-size:14px;
      }
      .commdiv{
        text-align: center;
        position: relative;
        height: 100%;
        width: 100px;
        float: right;
        .innerWrapper{
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
        }
      }
      .left{
        height: 100%;
        line-height: 180px;
        float: left;

      }
    }
  }
</style>
