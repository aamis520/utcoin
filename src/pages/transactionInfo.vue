<!-- 路由id是订单id,type是买卖的状态0 是买1是卖，orderStatus: 50是进行中，55 是已完成，56是已取消
      payStatus:支付状态51-未支付，52：已经支付
      dischargeStatus:放币状态53：未放币54：已经放币 -->
<template>
  <section class="otcHome">
  <div class="transactionInfoContainer">
    <div class="transactionInfoContainer_title">
      <p class="orderNum">订单号：{{orderInfo.orderNo}}</p>
      <p class="orderToWho" v-if="orderInfo.type == '0'">您向{{orderInfo.merchant.merchantName}}购买{{orderInfo.amount}} {{orderInfo.currency}}</p>
      <p class="orderToWho" v-if="orderInfo.type == '1'">您向{{orderInfo.merchant.merchantName}}出售{{orderInfo.amount}} {{orderInfo.currency}}</p>
      <!-- <p class="orderToWho" v-else>您向店铺购买{{orderInfo.amount}} {{orderInfo.currency}}</p> -->
      <p class="orderSinglePrice">单价：{{orderInfo.price | availableFilterTwo }} CNY / {{orderInfo.currency}}</p>
      <p class="orderTotalPrice">
        <span style="color:#5b5b5b;font-size:20px;">总价：</span>
        <span style="color:#59ba73;font-size:22px;">{{orderInfo.total | availableFilterTwo }} CNY</span>
      </p>
    </div>
    <!-- 卖出：状态：等待打款 -->
    <div class="myAlreadyPayContainer_body"
      v-if="orderInfo.orderStatus == 50 && orderInfo.payStatus == 51 && orderInfo.type == 1 && userId != orderInfo.merchant.userId && orderInfo.complaintStatus != 1 && orderInfo.complaintStatus != 2">
      <div class="top">
        <!-- <img style="vertical-align: middle;" src="../assets/home/wallert.png" alt="avater">
        <span style="color:#acacac;font-size:16px;margin-right:30px;">银行卡</span>
        <span style="color:#5c5c5c;font-size:16px;">甘老师 &nbsp; 6214808650870592</span>
        <span style="color:#5c5c5c;font-size:16px;margin-left:20px;">招商银行 &nbsp; 北京分行大运村支行</span> -->
      </div>
      <div class="bom">
        <span style="color:#565656;font-size:24px;">等待对方打款 ,{{orderInfo.merchant.merchantName}}需要向我支付{{orderInfo.total | availableFilterTwo}}CNY
        </span><br>
        <span style="color:#565656;font-size:24px;margin-top:20px;display:inline-block;">付款参考号：</span>
        <button>{{orderInfo.payReferenceNo}}</button>
      </div>
      <div style="color:#acacac;font-size:16px;margin-top:40px;">本次订单支付剩余时间
        <countdown v-if="Number(orderInfo.remainingTime) > 0"
            :time=" Number(orderInfo.remainingTime)"
            :leadingZero="true"
            @countdownend="countIsPayEnd">
            <template slot-scope="props" >
              <span v-if="props.seconds > 0 || props.hours > 0 || props.minutes > 0">{{props.hours}}:{{props.minutes}}:{{ props.seconds }}</span>
            </template>
          </countdown>
      </div>
    </div>
    <!-- 卖出：状态：放行 -->
    <div class="myAlreadyPayContainer_body" :disabled="countIsPayEndTime" v-if="orderInfo.dischargeStatus == 53 && orderInfo.payStatus == 52 && orderInfo.orderStatus == 50 && orderInfo.type == 1  && userId != orderInfo.merchant.userId">
      <div class="top">
        <!-- <img style="vertical-align: middle;" src="../assets/home/wallert.png" alt="avater">
        <span style="color:#acacac;font-size:16px;margin-right:30px;">银行卡</span>
        <span style="color:#5c5c5c;font-size:16px;">甘老师 &nbsp; 6214808650870592</span>
        <span style="color:#5c5c5c;font-size:16px;margin-left:20px;">招商银行 &nbsp; 北京分行大运村支行</span> -->
      </div>
      <div class="bom">
        <span style="color:#565656;font-size:24px;">{{orderInfo.merchant.merchantName}} , 已确认向我支付
           <span style="color:#59ba73;">{{orderInfo.total | availableFilterTwo}} CNY</span>
          , 请您查看是否入账
        </span><br><br>
        <span style="color:#565656;font-size:24px;">付款参考号：</span>
        <button>{{orderInfo.payReferenceNo}}</button>
      </div>
      <div class="alreadyPay">
          <button @click="fangxingUsdt" :disabled="countIsPayEndTime" style="background:#3068ae;width:218px;height:64px;cursor:pointer;" type="primary">放行{{orderInfo.currency}}</button>
      </div>
    </div>
    <!--买入 状态：待放币 -->
    <div class="waitBeanContainer_body" v-if="orderInfo.orderStatus == 50 && orderInfo.payStatus == 52 && orderInfo.type == 0 && orderInfo.complaintStatus != 1 && orderInfo.complaintStatus != 2">
      <div class="top" v-for="(item,index) in orderInfo.paymentInfos" :key = "index">
        <div v-if="item.type == '1'">
          <img style="vertical-align: middle;" src="../assets/home/wallert.png" alt="avater">
          <span style="color:#acacac;font-size:16px;margin-right:30px;">银行卡</span>
          <span style="color:#5c5c5c;font-size:16px;">{{item.name}} &nbsp; {{item.accountNo}}</span>
          <span style="color:#5c5c5c;font-size:16px;margin-left:20px;">{{item.bankName}} &nbsp; {{item.branchName}}</span>
        </div>
        <div v-if="item.type == '2'">
          <img style="vertical-align: middle;" src="../assets/home/zhifubao.png" alt="avater">
          <span style="color:#acacac;font-size:16px;margin-right:30px;">支付宝</span>
          <span style="color:#5c5c5c;font-size:16px;">{{item.name}} &nbsp; {{item.accountNo}}</span>
        </div>
      </div>
      <div class="bom">
        <span style="color:#565656;font-size:24px;line-height:34px;">已支付 ,  待{{orderInfo.merchant.merchantName}}确认并放币后 , 您将收到{{orderInfo.amount | availableFilterSix}}{{orderInfo.currency}}，
        </span> &nbsp;
        <span style="color:#565656;font-size:24px;">付款参考号：</span>
        <button>{{orderInfo.payReferenceNo}}</button>
      </div>
      <div class="alreadyPay">
          <button style="border:1px solid #bfbfbf;background:white;color:#bfbfbf;width:218px;height:64px;cursor:pointer;" type="primary">对方正在放币...</button>
      </div>
    </div>
    <!-- 买入 状态：我已付款 -->
    <div class="myAlreadyPayContainer_body" v-if="orderInfo.orderStatus == 50 && orderInfo.payStatus == 51 && orderInfo.type == 0&& orderInfo.complaintStatus != 1 && orderInfo.complaintStatus != 2">
      <div class="top" v-for="(item,index) in orderInfo.paymentInfos" :key = "index">
        <div v-if="item.type == '1'">
          <img style="vertical-align: middle;" src="../assets/home/wallert.png" alt="avater">
          <span style="color:#acacac;font-size:16px;margin-right:30px;">银行卡</span>
          <span style="color:#5c5c5c;font-size:16px;">{{item.name}} &nbsp; {{item.accountNo}}</span>
          <span style="color:#5c5c5c;font-size:16px;margin-left:20px;">{{item.bankName}} &nbsp; {{item.branchName}}</span>
        </div>
        <div v-if="item.type == '2'">
          <img style="vertical-align: middle;" src="../assets/home/zhifubao.png" alt="avater">
          <span style="color:#acacac;font-size:16px;margin-right:30px;">支付宝</span>
          <span style="color:#5c5c5c;font-size:16px;">{{item.name}} &nbsp; {{item.accountNo}}</span>
        </div>
      </div>
      <div class="bom">
        <span style="color:#565656;font-size:24px;">未付款 ,  请在
          <span style="color:#e25241;font-size:24px;">
            <countdown v-if="Number(orderInfo.remainingTime) > 0"
              :time=" Number(orderInfo.remainingTime)"
              :leadingZero="true"
              @countdownend="countIsPayEnd">
              <template slot-scope="props" >
                <span v-if="props.seconds > 0 || props.hours > 0 || props.minutes > 0">{{props.hours}}:{{props.minutes}}:{{ props.seconds }}</span>
              </template>
            </countdown>
          </span>
           内完成支付，
        </span> &nbsp;
        <span style="color:#565656;font-size:24px;">付款参考号：</span>
        <button>{{orderInfo.payReferenceNo}}</button>
      </div>
      <div class="alreadyPay">
          <button @click="alreadyPayMoney" :disabled="countIsPayEndTime" style="background:#3068ae;width:218px;height:64px;cursor:pointer;" type="primary">我已付款</button>
      </div>
    </div>
    <!-- 状态：订单已完成 -->
    <div class="transactionInfoContainer_body" v-if="orderInfo.orderStatus == 55&& orderInfo.complaintStatus != 1 && orderInfo.complaintStatus != 2">
      <div class="top">
        <img style="vertical-align: middle;" src="../assets/img/complete.png" alt="avater">
        <span style="color:#565656;font-size:24px;">订单已完成</span>
      </div>
      <!-- 0是买1是卖 -->
      <!-- <div class="bom">
        <span v-if="orderInfo.type == 0" style="color:#565656;font-size:16px;">现在转入币币交易账户，开始交易吧！</span> &nbsp;
        <span v-if="orderInfo.type == 0" @click="immediatelyTransfer" style="color:#478ce9;font-size:16px;cursor: pointer;">立即划转</span>
      </div> -->
    </div>
    <!-- 状态： 订单已取消 -->
    <div class="cancelContainer_body" v-if="orderInfo.orderStatus == 56 && orderInfo.complaintStatus != 1 && orderInfo.complaintStatus != 2">
      <div style="text-align:center;width:322px;height:30px;background:#eaeaea;line-height:30px;">
        <span style="color:white;font-size:14px;">订单已取消，无法查看支付信息</span>
      </div>
      <div class="imgsapn">
        <img src="../assets/cancelOrder/cancel.png" alt="icon">
        <span style="color:#565656;font-size:24px;font-weight:bold;">订单已取消</span>
      </div>
    </div>
    <!-- 状态： 订单申诉中 -->
    <div class="cancelContainer_body" v-if="orderInfo.complaintStatus == 1">
      <div class="imgsapn">
        <img src="../assets/cancelOrder/shensu.png" alt="icon">
        <span style="color:#e25241;font-size:24px;font-weight:bold;">订单申诉中</span>
        <div style="color:#666666;font-size:18px;margin-top:30px;">客服专员会及时与您沟通并处理当前订单，请耐心等待。</div>
      </div>
    </div>
    <!-- 状态： 申诉已处理 -->
    <div class="cancelContainer_body" v-if="orderInfo.complaintStatus == 2">
      <div class="imgsapn">
        <img src="../assets/cancelOrder/save.png" alt="icon">
        <span style="color:#565656;font-size:24px;font-weight:bold;">申诉已处理</span>
        <div style="color:#666666;font-size:18px;margin-top:30px;">申诉订单已处理，如有疑问，请联系客服。</div>
      </div>
    </div>
    <div class="transactionInfoContainer_bom">
      <div class="reminder">
        <span  v-if="orderInfo.type == 0" style="color:#bbbbc1;font-size:18px;line-height:30px;">
          1.您的汇款将直接进入卖方账户，交易过程中卖方出售的数字资产由平台托管保护；<br>
          2.请在规定时间内完成付款，请务必点击”我已付款“，卖方确认付款后，系统会将数字资产划转到您的账户中；<br>
          3.如果买方当日取消订单达3次，将会被限制当日的买入功能。
        </span>
        <span  v-if="orderInfo.type == 1" style="color:#bbbbc1;font-size:18px;line-height:30px;">
          1.您所出售的数字资产，已交由平台托管冻结，请在确认收到对方付款后，点击"确认放行"；<br>
          2.请不要相信任何催促放款的理由，确认收到款项后再释放数字资产，避免造成损失；<br>
          3.在收到到账短信后，请务必登录网上银行或手机银行查看款项是否入账，避免因收到诈骗短信释放数字资产。
        </span>
      </div>
    </div>
    <!-- 买家-我已付款-可以取消订单 -->
    <p @click="buyerCancelOrderPort" class="cancenOrder" v-if="orderInfo.orderStatus == 50 && orderInfo.payStatus == 51 && orderInfo.type == 0">取消订单</p>
    <!-- 买家；对方正在放币 -->
    <!-- v-if="orderInfo.dischargeStatus == 53 && orderInfo.payStatus == 52 && orderInfo.orderStatus == 50 && orderInfo.type == 1  && userId != orderInfo.merchant.userId && orderInfo.complaintStatus != 1 && orderInfo.complaintStatus != 2 " -->
    <p @click="submitComplain"  style="color:#e25241;" class="cancenOrder" v-if="orderInfo.orderStatus == 50 && orderInfo.payStatus == 52 && orderInfo.type == 0 && userId != orderInfo.merchant.userId&& orderInfo.complaintStatus != 1 && orderInfo.complaintStatus != 2">提交申诉</p>
    <!-- 卖家：放行usdt -->
    <!-- <p @click="submitComplain" style="color:#e25241;" class="cancenOrder" v-if="orderInfo.dischargeStatus == 53 &&orderInfo.orderStatus == 50 && orderInfo.type == 1  && userId != orderInfo.merchant.userId&& orderInfo.complaintStatus != 1 && orderInfo.complaintStatus != 2">提交申诉</p> -->
    <!-- 提交申诉弹窗 -->
     <el-dialog
      title="订单申诉"
      :visible.sync="isShowComplain"
      width="450px"
      :before-close="complainHandleClose">
      <div class="waitToBeanPoupContainer">
        <div>
          <span style="color:#ff5c5c;font-size:14px;line-height:20px;">提起申诉后资产将会冻结，申诉客服专员将介入本次交易，直 至结束。 恶意申诉视为扰乱平台运营秩序的行为，情节严重者 将冻结资产。</span>
        </div>
        <div class="orderNumber">
          <span style="color:#585d64;font-size:16px;margin-right:44px;">订单号</span>
          <span style="color:#a9a9a9;font-size:14px;">{{orderInfo.orderNo}}</span>
        </div>
        <div class="complainReason">
          <el-form ref="complainForm" :model="complainForm" label-width="95px">
            <el-form-item label="申诉原因">
              <el-select clearable v-model="complainForm.type" placeholder="请选择申诉原因">
                <el-option label="对方未付款" value="1"></el-option>
                <el-option label="对方未放币" value="2"></el-option>
                <el-option label="对方无应答" value="3"></el-option>
                <el-option label="对方有欺诈行为" value="4"></el-option>
                <el-option label="其他" value="5"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="saveBtn">
          <button @click="saveComplain('complainForm')" style="width:100%;" :class="classBg ? 'changeBg' : 'grayBg'">确定</button>
        </div>
        <div class="waitTime">
          <!-- TODO 申诉时间 -->
          <!-- <p style="#a9a9a9;font-size:12px;">付款成功5分钟后才可以发起申诉，您还需等待
            <countdown v-if="Number(orderInfo.complaintCountdown) > 0"
            :time=" Number(orderInfo.complaintCountdown)"
            :leadingZero="true"
            @countdownend="complaintCountdownEnd">
            <template slot-scope="props" >
              <span v-if="props.seconds > 0 || props.hours > 0 || props.minutes > 0">{{props.hours}}:{{props.minutes}}:{{ props.seconds }}</span>
            </template>
          </countdown>
          </p> -->
        </div>
      </div>
    </el-dialog>
     <!-- 资金划转弹窗 -->
     <el-dialog
      :title="$t('assets.assetsTransfer')"
      :visible.sync="isAssetsTransfer"
      width="450px"
      :before-close="isAssetsTransferClose">
      <div class="moneyTransferPoupContainer">
        <el-form ref="tranferForm" :model="tranferForm" label-width="60px">
          <el-form-item :label="$t('assets.coinType')">
            <el-select disabled style="width:100%;" v-model="tranferForm.symbol" placeholder="请选择币种">
              <el-option label="BTC" value="BTC"></el-option>
              <el-option label="ETH" value="ETH"></el-option>
              <el-option label="USDT" value="USDT"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('assets.from')">
            <el-select @change="formChange" :disabled="formIsDisabled" style="width:100%;" v-model="formAccount" :placeholder="$t('assets.fromToPlaceholder')">
              <el-option :label="$t('assets.c2cAccount')" value="1"></el-option>
              <el-option :label="$t('assets.coinAccount')" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('assets.to')">
            <el-select @change="toChange" :disabled="toIsDisabled" style="width:100%;" v-model="toAccount" :placeholder="$t('assets.fromToPlaceholder')">
              <el-option :label="$t('assets.c2cAccount')" value="1"></el-option>
              <el-option :label="$t('assets.coinAccount')" value="2"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item> -->
            <div class="chargeNumber">
              <span style="color:#a9a9a9;font-size:16px;line-height:50px;margin-right:5px;">{{$t('assets.amount')}}</span>
              <input type="text" :placeholder="$t('assets.amountPlaceholder')" v-model="tranferForm.amount">
              <span @click="totalTranfer" style="cursor: pointer;color:#478ce9;margin-left:-60px;font-size:12px;line-height:50px;">{{$t('assets.allTransfer')}}</span>
            </div>
          <!-- </el-form-item> -->
        </el-form>
        <div style="margin-top:15px;">
          <span style="color:#232d39;font-size:12px;float:right;">{{$t('assets.canTransferAmount')}}：{{okNumber}} {{saveTranferInfo.symbol}}</span>
        </div>
        <el-button @click="saveMoneyTranfer" style="width:100%;background:#3068ae;color:white;margin-top:36px;margin-bottom:30px;" type="primary">{{$t('home.confirm')}}</el-button>
      </div>
    </el-dialog>
    <!-- <el-dialog
      title="资金划转"
      :visible.sync="isShowMoneyTranfer"
      width="450px"
      :before-close="handleClose">
      <div class="moneyTransferPoupContainer">
        <el-form ref="tranferForm" :model="tranferForm" label-width="40px">
          <el-form-item label="币种">
            <el-select style="width:100%;" v-model="tranferForm.bean" placeholder="请选择币种">
              <el-option label="BTC" value="1"></el-option>
              <el-option label="UTCT" value="2"></el-option>
              <el-option label="USDT" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="从">
            <el-select style="width:100%;" v-model="tranferForm.account" placeholder="请选择账户">
              <el-option label="BTC" value="1"></el-option>
              <el-option label="UTCT" value="2"></el-option>
              <el-option label="USDT" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="转至">
            <el-select style="width:100%;" v-model="tranferForm.toAccouont" placeholder="请选择账户">
              <el-option label="BTC" value="1"></el-option>
              <el-option label="UTCT" value="2"></el-option>
              <el-option label="USDT" value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div style="margin-top:-20px;">
          <span style="color:#232d39;font-size:12px;float:right;">可转数量：1568.00USDT</span>
        </div>
        <el-button @click="saveMoneyTranfer" style="width:100%;background:#3068ae;color:white;margin-top:36px;margin-bottom:30px;" type="primary">确定</el-button>
      </div>
    </el-dialog> -->
    <el-dialog
      title="放行USDT"
      :visible.sync="isShowfangxingUsdt"
      width="450px"
      :before-close="fangxingHandleClose">
      <div class="moneyTransferPoupContainer">
        <div>
          <p style="margin-bottom:12px;">请输入资金密码</p>
          <el-input v-model="input" type="password" placeholder="请输入内容"></el-input>
        </div>
        <el-button @click="isShowfangxingUsdt = false" style="border:none;width:187px;background:#ebebec;color:white;margin-top:36px;margin-bottom:30px;" type="primary">取消</el-button>
        <el-button @click="saveFangxingUsdt" style="width:187px;background:#3068ae;color:white;margin-top:36px;margin-bottom:30px;" type="primary">确认放行</el-button>
      </div>
    </el-dialog>
    <!-- <div class="statusSuccessTranfer">
      <div class="statusSuccessTranfer_inner">

      </div>
    </div> -->
    <chat-list
      :from= "'order'"
      :orderId="orderId"
      :orderInfo="orderInfo"
      @orderInfoChange = "getOrderDetaiById"
      class="order_chat_list">
    </chat-list>
  </div>
  </section>
</template>

<script>
import chatList from '@/components/chat'
import { api } from '@/static/otcApi'
import countdown from "@xkeshi/vue-countdown"; // 倒计时插件
export default {
  data () {
    return {
      formIsDisabled: false,
      isAssetsTransfer: false,
      toIsDisabled: false,
      saveTranferInfo: '', // 保存点击划转item信息
      okNumber: '0',
      toAccount: '', // 到达账户
      formAccount: '', // 出账账户
      countIsPayEndTime: false, //付款倒计时时间是否已经超时
      canComplain: false,
      classBg: false,
      isShowComplain: false,
      complainForm: {
        content: '',
        type: ''
      },
      input: '',
      isShowfangxingUsdt: false,
      userId: this.$store.getters.getUserId,
      isShowMoneyTranfer: true,
      tranferForm:{
        coinId: '', //  币种id
        symbol: '',
        amount: '', // 数量
        bizType: '', // 1 转入 2 转出
        userId: ''
        // userId: this.$store.getters.getUserId
      },
      sellOrBuyStatus: '', // 上个页面传的买卖状态
      orderId: '', // 上一页传递的参数
      orderInfo: {
        merchant: {
          merchantName: '',
          userId: ''
        }
      }  // 接口获取的订单信息
    };
  },
  filters: {
    availableFilterTwo(val){
      let arr = String(val).split('.')
      let str = ''
      if(arr.length > 1){
        str  = arr[1].slice(0,2)
      }
      // console.log(str)
      if(str && str.length <= 2){
        var postFix = '' // 后缀
        var long = 2 - str.length
        for (let i = 0; i < long; i++) {
          postFix += '0'
        }
        return arr[0] + '.' + str + postFix
      }else{
        return arr[0] + '.00'
      }
    },
    availableFilterSix(val){
      let arr = String(val).split('.')
      let str = ''
      if(arr.length > 1){
        str  = arr[1].slice(0,6)
      }
      // console.log(str)
      if(str){
        return arr[0] + '.' + str
      }else{
        return arr[0] + '.00'
      }
    }
  },
  watch:{
    'complainForm.type': function(){
      if(this.complainForm.type){
        this.classBg = true
      }
    }
  },
  created () {
    // 获取参数 订单信息
    if(this.$router.currentRoute.query){
      this.orderId = this.$router.currentRoute.query.id
    }
    // 获取买卖的状态
    if(this.$router.currentRoute.query){
      this.sellOrBuyStatus = this.$router.currentRoute.query.type
    }
    this.getOrderDetaiById()
  },
  components: {
    chatList,
    countdown
  },

  computed: {
    // 计算当前订单 我是商家 买单
    // 计算当前订单 我是商家 卖单
    // 计算当前订单 我是用户 买单
    // 计算当前订单 我是用户 卖单
    // 再进行状态判断 待支付 已完成 已取消 申诉中 已处理

  },

  methods: {
    // 关闭资金划转
    isAssetsTransferClose(){
      this.isAssetsTransfer = false
    },
    // 点击全部划转
    totalTranfer(){
      this.tranferForm.amount = this.okNumber
    },
    // 转出账户值发生变化
    formChange(){
      this.tranferForm.amount = ''
      if(this.formAccount == '1') {
        this.okNumber = this.saveTranferInfo.available
        this.toAccount = '2'
      } else if(this.formAccount == '2') {
        this.okNumber = this.saveTranferInfo.amount
        this.toAccount = '1'
      }
    },
    toChange(){
      this.tranferForm.amount = ''
      if(this.toAccount == '1') {
        this.okNumber = this.saveTranferInfo.amount
        this.formAccount = '2'
      } else if(this.toAccount == '2'){
        this.okNumber = this.saveTranferInfo.available
        this.formAccount = '1'
      }
    },
    countIsPayEnd(){
      this.countIsPayEndTime = true
      this.getOrderDetaiById()
    },
    complaintCountdownEnd(){
      // 申诉倒计时时间结束 可以进行申诉
      this.canComplain = true
      this.getOrderDetaiById()
    },
    complainHandleClose(){
      this.isShowComplain = false
    },
    // 确定提交申诉
    saveComplain(formName){
      if(this.classBg){
        this.addComplainPort()
      } else {
        this.$message.warning('请选择申诉原因')
      }
    },
    // 申诉接口
    addComplainPort(){
      this.complainForm.petitionerId = JSON.parse(localStorage.getItem('__uinfo')).userId // 用户id
      this.complainForm.orderId = this.orderInfo.id
      if(JSON.parse(localStorage.getItem('__uinfo')).userId == this.orderInfo.userId){
        this.complainForm.defendantId	 = this.orderInfo.merchant.userId
      } else {
        this.complainForm.defendantId	 = this.orderInfo.userId
      }
      console.log(this.complainForm)
      var _this = this
      api.addComplaint(this.complainForm)
      .then(res => {
        if(res.statusCode == 200){
          _this.isShowComplain = false
          _this.getOrderDetaiById()
        }else {
          this.$message.warning(res.msg)
        }
      })
      .catch(() => {

      })
    },
    fangxingHandleClose(){
      this.isShowfangxingUsdt = false
    },
    saveFangxingUsdt(){
      if(this.input == ''){
        this.$message({
          message: '请输入密码',
          type: 'warning',
          duration: 10000
        })
        return
      }
      let data = {}
      data.userId = JSON.parse(localStorage.getItem('__uinfo')).userId
      data.orderId = this.orderInfo.id
      data.paymentPwd = this.input
      var _this = this
      api.sellerDischarge(data)
      .then(res => {
        if(res.statusCode == 200){
          _this.$message.success('放币成功')
        }else{
          _this.$message.warning(res.msg)
        }
        _this.fangxingHandleClose()
        _this.getOrderDetaiById()
      })
      .catch((res) => {
        _this.$message.warning(res.msg)
      })
    },
    // 点击放行usdt
    fangxingUsdt(){
      this.isShowfangxingUsdt = true
    },
    // 买家：提交申诉
    submitComplain(){
      if(this.canComplain){
        this.complainForm.type = ''
        this.isShowComplain = true
      }

    },
    // 点击买家付款
    alreadyPayMoney(){
      var obj = {
        userId: this.$store.getters.getUserId,
        orderId: this.orderInfo.id
      }
      api.buyerPay(obj)
      .then(res => {
        if(res.statusCode == 200) {
          this.getOrderDetaiById()
        }else{
          this.$message.error(res.msg)
        }
      })
      .catch((err) => {
        this.$message.error(err.msg)
      })
    },
    // 买家取消订单
    buyerCancelOrderPort(){
      let _this = this
      _this.$confirm('当日取消订单超过3次后您将不能再进行法币交易。', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var obj = {}
          obj.userId = JSON.parse(localStorage.getItem('__uinfo')).userId
          obj.orderId = _this.orderInfo.id
          // 区分买家取消和卖家取消
          if(_this.$route.query.type == 0) {
            api.buyerCancelOrder(obj)
            .then(res => {
              if(res.statusCode == 200) {
                _this.$message.success('取消成功')
                this.getOrderDetaiById()
              }else {
                _this.$message.success('取消失败')
              }
            })
            .catch(() => {
                _this.$message.warning('取消失败')
            })
          } else if(_this.$route.query.type == 1){

          }
        }).catch(() => {
          _this.$message({
            type: 'info',
            message: '取消操作'
          })
        })
    },
    saveMoneyTranfer(){
      if(!this.formAccount){
        this.$message('请选择账户')
        return
      }
      if(!this.tranferForm.amount){
        this.$message('请输入转账数量')
        return
      }
      if(Number(this.tranferForm.amount) > Number(this.okNumber)) {
        this.$message.warning('账户余额不足,请重新输入..')
        this.tranferForm.amount = ''
        return
      }
      if(Number(this.tranferForm.amount) <= 0){
        this.$message.warning('转账金额不能小于0，请重新输入...')
      }
      this.assetsTransferPort()
    },
    handleClose(){
      this.isShowMoneyTranfer = false
    },
    // 点击立即划转事件
    immediatelyTransfer(){
      this.$router.push({
        path: '/account'
      })
    },
    // 获取订单详情
    getOrderDetaiById() {
      if(this.orderId){
        api.getOrderDetai({orderId: this.orderId}).then(res => {
          // console.log(res)
          if(res.statusCode == 200){
            this.orderInfo = res.data
            if(Number(this.orderInfo.complaintCountdown) <= 0){
              this.canComplain = true
            }
            if(Number(this.orderInfo.remainingTime) < 0){
              this.countIsPayEndTime = true
            }
          }else {
            this.$message.warning(res.msg)
          }
        })
      }
    }
  }
}

</script>
<style lang='scss' scoped>
  .transactionInfoContainer{
    width: 1200px;
    margin: 0 auto;
    height: 1052px;
    padding-bottom: 100px;
    position: relative;
    .chargeNumber{
      height: 50px;
      input{
        box-sizing: border-box;
        padding: 0 80px 0 20px;
        outline: none;
        background: #f4f4f4;
        border: none;
        height: 50px;
        width:calc(100% - 47px);
      }
    }
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
    .statusSuccessTranfer{
      position: absolute;
      background: rgba(0,0,0, 0.3);
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      .statusSuccessTranfer_inner{
        top: 200px;
        width: 405px;
        height: 120px;
      }
    }
    .cancenOrder{
      cursor: pointer;
      margin-top: 33px;
      color: #478ce9;
      font-size: 18px;
    }
    .cancelContainer_body{
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
    .transactionInfoContainer_body{
      padding-top: 68px;
      height: 293px;
      .top{
        img{
          transform: translateY(-5px);
        }
      }
      .bom{
        margin-top: 40px;
        padding-right: 360px;
      }
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
        padding-right: 360px;
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
    .myAlreadyPayContainer_body{
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
        padding-right: 360px;
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
    .moneyTransferPoupContainer{
      .moneyTranferBtn{
        background: red;
        height: 40px;
        margin-top: 36px;
      }
    }
    .order_chat_list{
      position: absolute;
      top: 100px;
      right: 0px;
    }
  }
</style>
