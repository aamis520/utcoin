<!-- 路由id是订单id,type是买卖的状态0 是买1是卖，orderStatus: 50是进行中，55 是已完成，56是已取消
      payStatus:支付状态51-未支付，52：已经支付
      dischargeStatus:放币状态53：未放币54：已经放币 -->
<template>
  <section class="otcHome">
  <div class="transactionInfoContainer">
    <div class="transactionInfoContainer_title">
      <p class="orderNum">订单号：{{orderInfo.orderNo}}</p>
      <p class="orderToWho" v-if="orderInfo.type == 1">您向{{orderInfo.userName}}购买{{orderInfo.amount}} {{orderInfo.currency}}</p>
      <p class="orderToWho" v-if="orderInfo.type == 0">您向{{orderInfo.userName}}出售{{orderInfo.amount}} {{orderInfo.currency}}</p>
      <!-- <p class="orderToWho" v-else>您向店铺购买{{orderInfo.amount}} {{orderInfo.currency}}</p> -->
      <p class="orderSinglePrice">单价：{{orderInfo.price | availableFilterTwo}} CNY / {{orderInfo.currency}}</p>
      <p class="orderTotalPrice">
        <span style="color:#5b5b5b;font-size:20px;">总价：</span>
        <span style="color:#59ba73;font-size:22px;">{{orderInfo.total | availableFilterTwo}} CNY</span>
      </p>
    </div>
    <!-- 卖出：状态：等待打款 -->
    <div class="myAlreadyPayContainer_body" v-if="orderInfo.orderStatus == 50 && orderInfo.payStatus == 51 && orderInfo.dischargeStatus == 53 && orderInfo.type == 0 &&userId == orderInfo.merchant.userId&& orderInfo.complaintStatus != 1 && orderInfo.complaintStatus != 2">
      <div class="top">
        <!-- <img style="vertical-align: middle;" src="../assets/home/wallert.png" alt="avater">
        <span style="color:#acacac;font-size:16px;margin-right:30px;">银行卡</span>
        <span style="color:#5c5c5c;font-size:16px;">甘老师 &nbsp; 6214808650870592</span>
        <span style="color:#5c5c5c;font-size:16px;margin-left:20px;">招商银行 &nbsp; 北京分行大运村支行</span> -->
      </div>
      <div class="bom">
        <span style="color:#565656;font-size:24px;">等待对方打款 ,{{orderInfo.userName}}需要向我支付{{orderInfo.total | availableFilterTwo}}CNY
        </span><br>
        <span style="color:#565656;font-size:24px;margin-top:20px;display:inline-block;">付款参考号：</span>
        <button>{{orderInfo.payReferenceNo}}</button>
      </div>
      <div v-if="Number(orderInfo.remainingTime) > 0" style="color:#acacac;font-size:16px;margin-top:40px;">本次订单支付剩余时间
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
    <!-- orderInfo.merchant.userId == localStorage.getItem('userLogin').userId -->
    <div class="myAlreadyPayContainer_body" v-if="orderInfo.orderStatus == 50 && orderInfo.dischargeStatus == 53&&orderInfo.payStatus == 52 && orderInfo.type == 0">
      <div class="top">
        <!-- <img style="vertical-align: middle;" src="../assets/home/wallert.png" alt="avater">
        <span style="color:#acacac;font-size:16px;margin-right:30px;">银行卡</span>
        <span style="color:#5c5c5c;font-size:16px;">甘老师 &nbsp; 6214808650870592</span>
        <span style="color:#5c5c5c;font-size:16px;margin-left:20px;">招商银行 &nbsp; 北京分行大运村支行</span> -->
      </div>
     <div class="bom">
        <span style="color:#565656;font-size:24px;">{{orderInfo.userName}} , 已确认向我支付
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
    <div class="waitBeanContainer_body" v-if="orderInfo.orderStatus == 50 && userId == orderInfo.merchant.userId && orderInfo.payStatus == 52 && orderInfo.type == 1 && orderInfo.complaintStatus != 1 && orderInfo.complaintStatus != 2">
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
        <span style="color:#565656;font-size:24px;">已支付 ,  待{{orderInfo.userName}}确认并放币后 , 您将收到{{orderInfo.amount | availableFilterSix}}{{orderInfo.currency}}，
        </span> &nbsp;
        <span style="color:#565656;font-size:24px;">付款参考号：</span>
        <button>{{orderInfo.payReferenceNo}}</button>
      </div>
      <div class="alreadyPay">
          <button style="border:1px solid #bfbfbf;background:white;color:#bfbfbf;width:218px;height:64px;cursor:pointer;" type="primary">对方正在放币...</button>
      </div>
    </div>
    <!-- 买入 状态：我已付款 -->
    <div class="myAlreadyPayContainer_body" v-if="orderInfo.orderStatus == 50 && orderInfo.payStatus == 51 && orderInfo.type == 1 && orderInfo.complaintStatus != 1 && orderInfo.complaintStatus != 2">
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
    <div class="transactionInfoContainer_body" v-if="orderInfo.orderStatus == 55 && orderInfo.complaintStatus != 1 && orderInfo.complaintStatus != 2">
      <div class="top">
        <img style="vertical-align: middle;" src="../assets/img/complete.png" alt="avater">
        <span style="color:#565656;font-size:24px;">订单已完成</span>
      </div>
      <!-- 0是买 1是卖 -->
      <!-- <div class="bom">
        <span v-if="orderInfo.type == 1" style="color:#565656;font-size:16px;">现在转入币币交易账户，开始交易吧！</span> &nbsp;
        <span v-if="orderInfo.type == 1" @click="immediatelyTransfer" style="color:#478ce9;font-size:16px;cursor: pointer;">立即划转</span>
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
        <span  v-if="orderInfo.type == 1" style="color:#bbbbc1;font-size:18px;line-height:30px;">
          1.您的汇款将直接进入卖方账户，交易过程中卖方出售的数字资产由平台托管保护；<br>
          2.请在规定时间内完成付款，请务必点击”我已付款“，卖方确认付款后，系统会将数字资产划转到您的账户中；<br>
          3.如果买方当日取消订单达3次，将会被限制当日的买入功能。
        </span>
        <span  v-if="orderInfo.type == 0" style="color:#bbbbc1;font-size:18px;line-height:30px;">
          1.您所出售的数字资产，已交由平台托管冻结，请在确认收到对方付款后，点击"确认放行"；<br>
          2.请不要相信任何催促放款的理由，确认收到款项后再释放数字资产，避免造成损失；<br>
          3.在收到到账短信后，请务必登录网上银行或手机银行查看款项是否入账，避免因收到诈骗短信释放数字资产。
        </span>
      </div>
    </div>
    <!-- 买家-我已付款-可以取消订单 -->
    <p @click="buyerCancelOrderPort" class="cancenOrder" v-if="orderInfo.orderStatus == 50 && orderInfo.payStatus == 51 && orderInfo.type == 1 && orderInfo.complaintStatus != 1 && orderInfo.complaintStatus != 2">取消订单</p>
    <!-- 买家；对方正在放币 -->
    <p @click="submitComplain" style="color:#e25241;" class="cancenOrder" v-if="orderInfo.orderStatus == 50 && orderInfo.dischargeStatus == 53&&orderInfo.payStatus == 52 && orderInfo.type == 1 && orderInfo.complaintStatus != 1 && orderInfo.complaintStatus != 2">提交申诉</p>
    <!-- 卖出：状态：放行usdt -->
    <!-- <p @click="submitComplain" style="color:#e25241;" class="cancenOrder"  v-if="orderInfo.orderStatus == 50 && orderInfo.dischargeStatus == 53&&orderInfo.payStatus == 52 && orderInfo.type == 0 && orderInfo.complaintStatus != 1 && orderInfo.complaintStatus != 2">提交申诉</p> -->
    <!-- <div class="statusSuccessTranfer">
      <div class="statusSuccessTranfer_inner">

      </div>
    </div> -->
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
          <!-- TODO 申诉剩余时间 -->
          <!-- <p style="#a9a9a9;font-size:12px;">付款成功5分钟后才可以发起申诉，您还需等待04：21</p> -->
        </div>
      </div>
    </el-dialog>
    <el-dialog
      title="放行USDT"
      :visible.sync="isShowfangxingUsdt"
      width="450px"
      :before-close="fangxingHandleClose">
      <div class="moneyTransferPoupContainer">
        <div>
          <p style="margin-bottom:12px;">请输入资金密码</p>
          <el-input v-model="input" type="password" placeholder="请输入资金密码"></el-input>
        </div>
        <el-button @click="isShowfangxingUsdt = false" style="border:none;width:187px;background:#ebebec;color:white;margin-top:36px;margin-bottom:30px;" type="primary">取消</el-button>
        <el-button @click="saveFangxingUsdt" style="width:187px;background:#3068ae;color:white;margin-top:36px;margin-bottom:30px;" type="primary">确认放行</el-button>
      </div>
    </el-dialog>
    <chat-list
      :from= "'publish'"
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
      countIsPayEndTime: false, //付款倒计时时间是否已经超时
      canComplain: false,
      orderPayType: [],
      input: '',
      isShowfangxingUsdt: false,
      userId: this.$store.getters.getUserId,
      complainForm: {
        content: '',
        type: ''
      },
      classBg: false,
      isShowComplain: false,
      tranferForm:{
        bean: '',
        account: '',
        toAccouont: ''
      },
      sellOrBuyStatus: '', // 上个页面传的买卖状态
      orderId: '', // 上一页传递的参数
      orderInfo: {
        merchant: {
          userId: '',
          merchantName: ''
        }
      },  // 接口获取的订单信息
      rules: {
        type: [
          { required: true, message: '请选择申诉原因', trigger: 'blur' }
        ]
      },
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
        if(this.complainForm.type == '1') {
          this.complainForm.content = '对方未付款'
        } else if(this.complainForm.type == '2'){
          this.complainForm.content = '对方未放币'
        } else if(this.complainForm.type == '3'){
          this.complainForm.content = '对方无应答'
        } else if(this.complainForm.type == '4'){
          this.complainForm.content = '对方有欺诈行为'
        } else if(this.complainForm.type == '5'){
          this.complainForm.content = '其他'
        }
        this.classBg = true
      } else {
        this.classBg = false
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
    countIsPayEnd(){
      this.countIsPayEndTime = true
      this.getOrderDetaiById()
    },
    complaintCountdownEnd(){
      // 申诉倒计时时间结束 可以进行申诉
      this.canComplain = true
      this.getOrderDetaiById()
    },
    fangxingHandleClose(){
      this.isShowfangxingUsdt = false
    },
    saveFangxingUsdt(){
      this.getFangxingPort()

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
      // console.log(this.complainForm)
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
    complainHandleClose(){
      this.isShowComplain = false
    },

    // 买家：点击提交申诉
    submitComplain(){
      if(this.canComplain){
        this.complainForm.type = ''
        this.isShowComplain = true
      }
    },
    // 点击放行usdt
    fangxingUsdt(){
      this.isShowfangxingUsdt = true
      console.log('放行usdt')
    },
    // 放行接口
    getFangxingPort(){
      var obj = {}
      if(this.input == ''){
        this.$message({
          message: '请输入密码',
          type: 'warning',
          duration: 10000
        })
        return
      }
      obj.userId = JSON.parse(localStorage.getItem('__uinfo')).userId
      obj.orderId = this.orderInfo.id
      obj.paymentPwd = this.input
      api.sellerDischarge(obj)
      .then(res => {
        if(res.statusCode == 200){
          this.$message.success('成功放行')
          this.isShowfangxingUsdt = false
          this.getOrderDetaiById()
        } else {
          this.isShowfangxingUsdt = false
          this.$message.warning(res.msg)
        }
      })
      .catch((err) => {
          this.$message.warning(err.msg)
      })
    },
    // 点击买家付款
    alreadyPayMoney(){
      var obj = {
        userId: this.userId,
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
      this.$confirm('是否取消该订单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var obj = {}
          obj.userId = JSON.parse(localStorage.getItem('__uinfo')).userId
          obj.orderId = this.orderInfo.id
          var _this = this
          // 区分买家取消和卖家取消
          if(_this.$route.query.type == 1) {
            api.buyerCancelOrder(obj)
            .then(res => {
              if(res.statusCode == 200) {
                _this.$message.success('取消成功')
                _this.getOrderDetaiById()
              }else {
                this.$message.warning(res.msg)
              }
            })
            .catch(() => {
                _this.$message.warning('取消失败')
            })
          } else if(_this.$route.query.type == 0){
            // api.sellerCancelOrder()
            // .then(res => {
            //   if(res.statusCode == 200) {
            //     this.$message.success('订单取消成功')
            //   } else {
            //     this.$message.warning('取消失败')
            //   }
            // })
            // .catch(() => {
            //     this.$message.warning('取消失败')
            // })
          }
        }).catch(() => {

        });
    },
    handleClose(){
      this.isShowMoneyTranfer = false
    },
    // 点击立即划转事件
    immediatelyTransfer(){
      this.$router.push({
        path: '/account'
      })
      // this.isShowMoneyTranfer = true
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
            // if(this.orderInfo.paymentInfos.length > 0) {
            //   this.orderInfo.paymentInfos.forEach(ele => {

            //     this.orderPayType = this.orderInfo.paymentInfos[0]
            //   });
            // }
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
        padding-right: 360px;
        margin-top: 40px;
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
