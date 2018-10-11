<!--  -->
<template>
  <div class="waitBeanContainer">
    <div class="waitBeanContainer_title">
      <p class="orderNum">订单号：115160882403740</p>
      <p class="orderToWho">您向欧菲德尼购买1308 USDT</p>
      <p class="orderSinglePrice">订单号：115160882403740</p>
      <p class="orderTotalPrice">
        <span style="color:#5b5b5b;font-size:20px;">总价：</span>
        <span style="color:#59ba73;font-size:22px;">10.006.2CNY</span>
      </p>
    </div>
    <div class="waitBeanContainer_body">
      <div class="top">
        <img style="vertical-align: middle;" src="../assets/home/wallert.png" alt="avater">
        <span style="color:#acacac;font-size:16px;margin-right:30px;">银行卡</span>
        <span style="color:#5c5c5c;font-size:16px;">甘老师 &nbsp; 6214808650870592</span>
        <span style="color:#5c5c5c;font-size:16px;margin-left:20px;">招商银行 &nbsp; 北京分行大运村支行</span>
      </div>
      <div class="bom">
        <span style="color:#565656;font-size:24px;">已支付 ,  待欧菲德尼确认并放币后 , 您将收到1308USDT
           内完成支付，
        </span> &nbsp;
        <span style="color:#565656;font-size:24px;">付款参考号：</span>
        <button>{{referName}}</button>
      </div>
      <div class="alreadyPay">
          <button @click="waitClick" style="border:1px solid #bfbfbf;background:white;color:#bfbfbf;width:218px;height:64px;cursor:pointer;" type="primary">对方正在放币...</button>
      </div>

    </div>
    <div class="waitBeanContainer_bom">
      <div class="reminder">
        <span style="color:#bbbbc1;font-size:18px;line-height:30px;">
          1.您的汇款将直接进入卖方账户，交易过程中卖方出售的数字资产由平台托管保护；<br>
          2.请在规定时间内完成付款，请务必点击”我已付款“，卖方确认付款后，系统会将数字资产划转到您的账户中；<br>
          3.如果买方当日取消订单达3次，将会被限制当日的买入功能。
        </span>
      </div>
    </div>
    <p class="cancenOrder" @click="getComplain">提交申诉</p>
     <!-- 买入弹窗 -->
    <el-dialog
      title="订单申诉"
      :visible.sync="isShowComplain"
      width="450px"
      :before-close="handleClose">
      <div class="waitToBeanPoupContainer">
        <div>
          <span style="color:#ff5c5c;font-size:14px;line-height:20px;">提起申诉后资产将会冻结，申诉客服专员将介入本次交易，直 至结束。 恶意申诉视为扰乱平台运营秩序的行为，情节严重者 将冻结资产。</span>
        </div>
        <div class="orderNumber">
          <span style="color:#585d64;font-size:16px;margin-right:44px;">订单号</span>
          <span style="color:#a9a9a9;font-size:14px;">fhsjkl445435232</span>
        </div>
        <div class="complainReason">
          <el-form ref="conplainForm" :model="conplainForm" label-width="95px">
            <el-form-item label="申诉原因">
              <el-select v-model="conplainForm.region" placeholder="请选择申诉原因">
                <el-option label="对方未付款" value="1"></el-option>
                <el-option label="对方未付款" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="saveBtn">
          <button style="width:100%;" :class="classBg ? 'grayBg' : 'class-b'">确定</button>
        </div>
        <div class="waitTime">
          <p style="#a9a9a9;font-size:12px;">付款成功或取消申诉5分钟后才可以发起申诉，您还需等待04：21</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      conplainForm: {
        region: ''
      },
      classBg: false,
      isShowComplain: false,
      referName: '087165'
    };
  },
  components: {},

  computed: {},

  mounted() {},

  methods: {
    waitClick(){
      this.$router.push({
        path: '/transactionInfo'
      })
    },
    // 点击提交申诉事件
    getComplain(){
      this.isShowComplain = true
    },
    handleClose(){
      this.isShowComplain = false
    }
  }
}

</script>
<style lang='scss' scoped>
  .waitBeanContainer{
    width: 1200px;
    margin: 0 auto;
    height: 1152px;
    .waitToBeanPoupContainer{
      .complainReason{
        margin-top: 52px;
      }
      .waitTime{
        margin-top: 12px;
        margin-bottom:25px;
      }
      .saveBtn{
        button{
          margin-top: 50px;
          border: none;
          color: white;
          border-radius: 3px;
          font-size: 18px;
          height: 50px;
        }
        .grayBg{
          background: #ebebec;
        }
        .changeBg{
          background: #3068ae;
        }
      }
      .orderNumber{
        margin-top: 80px;
      }
    }
    .waitBeanContainer_bom{
    }
    .cancenOrder{
      cursor: pointer;
      margin-top: 33px;
      color: #e25241;
      font-size: 18px;
    }
    .waitBeanContainer_body{
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
    .waitBeanContainer_title{
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
