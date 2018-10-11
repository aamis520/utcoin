<!--  -->
<template>
  <div class="transactionInfoContainer">
    <div class="transactionInfoContainer_title">
      <p class="orderNum">订单号：{{getBackData.orderNo}}</p>
      <p class="orderToWho">您向欧菲德尼购买{{getBackData.amount}} {{getBackData.currency}}</p>
      <p class="orderSinglePrice">订单号：115160882403740</p>
      <p class="orderTotalPrice">
        <span style="color:#5b5b5b;font-size:20px;">总价：</span>
        <span style="color:#59ba73;font-size:22px;">{{getBackData.total}}CNY</span>
      </p>
    </div>
    <div class="transactionInfoContainer_body">
      <div class="top">
        <img style="vertical-align: middle;" src="../assets/home/wallert.png" alt="avater">
        <span style="color:#acacac;font-size:16px;margin-right:30px;">银行卡</span>
        <span style="color:#5c5c5c;font-size:16px;">甘老师 &nbsp; 6214808650870592</span>
        <span style="color:#5c5c5c;font-size:16px;margin-left:20px;">招商银行 &nbsp; 北京分行大运村支行</span>
      </div>
      <div class="bom">
        <span style="color:#565656;font-size:24px;">未付款 ,  请在
          <span style="color:#e25241;font-size:24px;">19分15秒</span>
           内完成支付，
        </span> &nbsp;
        <span style="color:#565656;font-size:24px;">付款参考号：</span>
        <button>{{referName}}</button>
      </div>
      <div class="alreadyPay">
          <button @click="alreadyPayMoney" style="background:#3068ae;width:218px;height:64px;cursor:pointer;" type="primary">我已付款</button>
      </div>
    </div>
    <div class="transactionInfoContainer_bom">
      <div class="reminder">
        <span style="color:#bbbbc1;font-size:18px;line-height:30px;">
          1.您的汇款将直接进入卖方账户，交易过程中卖方出售的数字资产由平台托管保护；<br>
          2.请在规定时间内完成付款，请务必点击”我已付款“，卖方确认付款后，系统会将数字资产划转到您的账户中；<br>
          3.如果买方当日取消订单达3次，将会被限制当日的买入功能。
        </span>
      </div>
    </div>
    <p class="cancenOrder" @click="cancelOrder">取消订单</p>
  </div>
</template>

<script>
import { api } from '@/static/otcApi'
export default {
  data () {
    return {
      referName: '087165',
      getBackData: ''
    };
  },

  components: {},

  computed: {},

  mounted() {
    this.geOrderDetailPort()
  },

  methods: {
    // 获取订单详情
    geOrderDetailPort(){
      var obj = {}
      obj.orderId = this.$route.query.id
      api.getOrderDetai(obj)
      .then(res => {
        if(res.statusCode == 200) {
          this.getBackData = res.data
        }
      })
      .catch(() => {

      })
    },
    // 点击取消订单事件
    cancelOrder(){
      this.$router.push({
        path: '/cancelOrder'
      })
    },
    // 点击我已付款事件
    alreadyPayMoney(){
      this.$router.push({
        path: '/waitToBean'
      })
    }
  }
}

</script>
<style lang='scss' scoped>
  .transactionInfoContainer{
    width: 1200px;
    margin: 0 auto;
    height: 1152px;
    .transactionInfoContainer_bom{
    }
    .cancenOrder{
      cursor: pointer;
      margin-top: 33px;
      color: #478ce9;
      font-size: 18px;
    }
    .transactionInfoContainer_body{
      padding-top: 35px;
      height: 345px;
      .alreadyPay{
        margin-top: 30px;
        button{
          font-size: 20px;
          color: white;
          border: none;
          border-radius: 10px;
        }
        .btnRightImgWrapper{
          display: inline-block;
          background-size: (100%, 100%);
          background-repeat: no-repeat;
          background-image: url('../assets/nopaymoney/381400186187179138.png');
          width: 340px;
          height:65px;
        }
      }
      .bom{
        font-weight:bold;
        margin-top: 85px;
        button{
          color: #565656;
          font-size:24px;
          background: #f5f5f5;
          width: 110px;
          height: 35px;
          border-radius: 10px;
          border: 1px solid #434343;
        }
      }
    }
    .transactionInfoContainer_title{
      padding-top: 95px;
      height: 362px;
      border-bottom: 1px solid #e8eae9;
      .orderNum{
        color: #9fa2a8;
        font-size: 18px;
      }
      .orderSinglePrice{
        color: #5b5b5b;
        font-size: 22px;
        line-height: 35px;
      }
      .orderToWho{
        margin-top: 35px;
        margin-bottom: 30px;
        font-weight: bold;
        color: #5b5b5b;
        font-size: 34px;
      }
    }
  }
</style>
