<!--  -->
<template>
  <div class="transactionInfoContainer">
    <div class="transactionInfoContainer_title">
      <p class="orderNum">订单号：115160882403740</p>
      <p class="orderToWho">您向欧菲德尼购买1308 USDT</p>
      <p class="orderSinglePrice">订单号：115160882403740</p>
      <p class="orderTotalPrice">
        <span style="color:#5b5b5b;font-size:20px;">总价：</span>
        <span style="color:#59ba73;font-size:22px;">10.006.2CNY</span>
      </p>
    </div>
    <div class="transactionInfoContainer_body">
      <div style="text-align:center;width:322px;height:30px;background:#eaeaea;line-height:30px;">
        <span style="color:white;font-size:14px;">订单已取消，无法查看支付信息</span>
      </div>
      <div class="imgsapn">
        <img src="../assets/cancelOrder/cancel.png" alt="icon">
        <span style="color:#565656;font-size:24px;font-weight:bold;">订单已取消</span>
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
  </div>
</template>

<script>
export default {
  data () {
    return {
    };
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {}
}

</script>
<style lang='scss' scoped>
  .transactionInfoContainer{
    width: 1200px;
    margin: 0 auto;
    height: 1152px;
    .transactionInfoContainer_body{
      padding-top: 32px;
      .imgsapn{
        margin-top: 94px;
        margin-bottom: 143px;
        img{
          transform: translateY(-5px);
          height: 64px;
          width: 64px;
          vertical-align: middle;
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
