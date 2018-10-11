<template>
    <div class="section">
        <div class="basic">
            <h5 class="basic_title">支付方式<el-button @click="addPayMoney" size="small" style="float:right;" type="primary">添加支付方式</el-button></h5>

        </div>
        <div style="height:63px;line-height:63px;border-bottom:1px solid #202234;margin:0 30px"  v-if="bankList.accountNo">
          <img style="float:left;margin-top:20px;margin-right:10px;vertical-align: middle;" src="../../assets/home/wallert.png" alt="icon">
          <span style="color:#bab9b9;font-size:14px;float:left;">银行卡</span>
          <el-switch
            style="float:right;margin-top:22px;"
            v-model="bankList.status"
            @change = bankSwitchOnOrNo(1)
            active-color="#478ce9"
            inactive-color="#cecbce">
          </el-switch>
          <span @click="changeBankInfo" class="addbank" style="color:#a2b2c8;font-size:16px;float:right;margin-right:40px; cursor: pointer;">修改</span>
          <span :title="bankList.accountNo + ' ' + bankList.name + ' ' + bankList.bankName + ' ' + bankList.branchName" style="text-align:right;color:#bab9b9;overflow:hidden;width:500px;font-size:14px;float:right;margin-right:40px;text-overflow: ellipsis;white-space: nowrap;">{{bankList.accountNo}}    {{bankList.name}}    {{bankList.bankName}}    {{bankList.branchName}}</span>
        </div>
        <div style="height:63px;line-height:63px;padding:0 30px;" v-if="zhifuList.accountNo">
          <img style="float:left;margin-top:20px;margin-right:10px;vertical-align: middle;" src="../../assets/home/zhifubao.png" alt="icon">
          <span style="color:#bab9b9;font-size:14px;float:left;">支付宝</span>
          <el-switch
            style="float:right;margin-top:22px;"
            v-model="zhifuList.status"
            @change = bankSwitchOnOrNo(2)
            active-color="#478ce9"
            inactive-color="#cecbce">
          </el-switch>
          <span @click="changezhifuInfo" class="addbank" style="color:#a2b2c8;font-size:16px;margin-right:40px;float:right; cursor: pointer;">修改</span>
          <span :title="zhifuList.accountNo + ' ' + zhifuList.name " style="text-align:right;color:#bab9b9;overflow:hidden;width:500px;font-size:14px;float:right;margin-right:40px;text-overflow: ellipsis;white-space: nowrap;">{{zhifuList.accountNo}}    {{zhifuList.name}}   </span>
        </div>

      <!-- 添加支付方式弹窗 -->
     <el-dialog
      title="添加支付方式"
      :visible.sync="isShowPay"
      width="450px"
      :before-close="isShowPayClose">
      <div class="moneyTransferPoupContainer ctocDialod">
        <el-form ref="payForm" :model="payForm" :rules="rules" label-width="80px">
          <el-form-item label="支付方式" prop="type">
            <el-select @change="bankChange" clearable style="width:310px;" v-model="payForm.type" placeholder="请选择支付方式">
              <el-option label="银行卡" value="1"></el-option>
              <el-option label="支付宝" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="payForm.name" placeholder="开户人请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="开户银行" v-if="payForm.type != 2" prop="bankName">
            <el-input placeholder="请输入开户银行" v-model="payForm.bankName"></el-input>
          </el-form-item>
          <el-form-item label="开户支行" v-if="payForm.type != 2" prop="branchName">
            <el-input placeholder="请输入开户支行" v-model="payForm.branchName"></el-input>
          </el-form-item>
          <el-form-item :label="bankName" prop="accountNo">
            <el-input :placeholder="placeHolderName" v-model="payForm.accountNo"></el-input>
          </el-form-item>
        </el-form>
        <el-button @click="saveBankInfo('payForm')" style="width:100%;background:#3068ae;color:white;margin-top:36px;margin-bottom:30px;" type="primary">确定</el-button>
      </div>
    </el-dialog>
      <!-- 修改支付方式 -->
     <el-dialog
      title="修改支付方式"
      :visible.sync="isShowchangePayTpye"
      width="450px"
      :before-close="changePayClose">
      <div class="moneyTransferPoupContainer">
        <el-form ref="changepayForm" :rules="rules" :model="changepayForm" label-width="80px">
          <el-form-item label="支付方式" prop="type">
            <el-select @change="changePaybankChange" disabled style="width:310px;" v-model="changepayForm.type" placeholder="请选择活动区域">
              <el-option label="银行卡" value="1"></el-option>
              <el-option label="支付宝" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="changepayForm.name" placeholder="开户人请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="开户银行" v-if="changeStatus == 1" prop="bankName">
            <el-input placeholder="请输入开户银行" v-model="changepayForm.bankName"></el-input>
          </el-form-item>
          <el-form-item label="开户支行" v-if="changeStatus == 1" prop="branchName">
            <el-input placeholder="请输入开户支行" v-model="changepayForm.branchName"></el-input>
          </el-form-item>
          <el-form-item :label="changeBankName" prop="accountNo">
            <el-input :placeholder="changePlaceHolderName" v-model="changepayForm.accountNo"></el-input>
          </el-form-item>
        </el-form>
        <el-button @click="changeSaveBankInfo('changepayForm')" style="width:100%;background:#3068ae;color:white;margin-top:36px;margin-bottom:30px;" type="primary">确定</el-button>
      </div>
    </el-dialog>




	</div>
</template>
<script>
import { api } from '@/static/otcApi'
import { dateFtt } from '@/static/common'
export default {
  data () {
    return {
      // status 1 开启2 关闭
      changeStatus: '1', // 1是修改银行卡2 是修改支付宝
      isShowchangePayTpye: false,
      bankList:{
        accountNo: ''
      }, // 保存后台获取银行卡信息
      zhifuList:{
        accountNo: ''
      }, // 保存后台获取支付宝信息
      bankName: '银行卡号',
      placeHolderName: '请输入银行卡号',
      changeBankName: '银行卡号',
      changePlaceHolderName: '请输入银行卡号',
      payForm:{
        type: '', // 支付方式
        accountNo: '',
        bankName: '',
        branchName: '',
        name: '',
        userId: this.$store.getters.getUserId
      },
      changepayForm:{
        type: '', // 支付方式
        accountNo: '',
        bankName: '',
        branchName: '',
        name: '',
        // userId: this.$store.getters.getUserId
        userId: ''
      },
      isShowPay: false,
      valueSwitch: true,
      rules: {
        type: [
          { required: true, message: '请选择支付方式', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入开户人姓名', trigger: 'change' }
        ],
        bankName: [
          { required: true, message: '请输入开户银行', trigger: 'change' }
        ],
        branchName: [
          { required: true, message: '请输入开户支行', trigger: 'change' }
        ],
        accountNo: [
          { required: true, message: '请输入银行卡账号', trigger: 'change' }
        ]
      }
    };
  },

  components: {

  },
  filters: {
    timeFilter: function(val){
      if(val) {
        return dateFtt(val)
      }
    },
    approveParse: function(val){
      if(val) {
        return '已绑定'
      } else {
        return '去绑定'
      }
    }
  },
  watch: {
    'bankList.status': function(){
      if(this.bankList.status || this.zhifuList.status){
        this.$store.dispatch('getPayWay', 1)
      } else if(!this.bankList.status && !this.bankList.status){
        this.$store.dispatch('getPayWay', 0)
      }
    },
    'zhifuList.status': function(){
      if(this.bankList.status || this.zhifuList.status){
        this.$store.dispatch('getPayWay', 1)
      } else if(!this.bankList.status && !this.bankList.status){
        this.$store.dispatch('getPayWay', 0)
      }
    }
  },
  computed: {
    numberTime: function(){
      var num = this.$store.getters.getterTurNover
      return num
    },
    accountUserId: function(){
      var id = this.$store.getters.getterMechantUid
      return id
    },
    createTime: function(){
      var time = this.$store.getters.getterCreatTime
      return  time
    },
    merchantName: function(){
      var name = this.$store.getters.getterMerchantName
      return  name
    },
    emailStatus: function(){
      var approveEmail = this.$store.getters.getterEmailApprove
      console.log(approveEmail)
      return  approveEmail
    }
  },
  created () {},
  mounted() {
    this.getBankCardInfoPort()
  },

  methods: {
    // 点击去绑定邮箱事件
    goBindEmail(){
      if(!this.approveParse){
        // window.location.href = process.env.shangYaUrls + 'personalCenter/mySafeBind'
        // window.location.href = 'http://test-hksy-index-otc.syextest.com:8986/#/personalCenter/mySafeBind'
      } else {
        return false
      }
    },
    // 点击去修改密码
    changePass(){
      // window.location.href = process.env.shangYaUrls + 'personalCenter/myPasswordSetting'
      // window.location.href = 'http://test-hksy-index-otc.syextest.com:8986/#/personalCenter/myPasswordSetting'
    },
    // 支付方式开关接口
    bankSwitchOnOrNo(data){
      var obj = {}
      if(data == 1) {
        obj.payId = this.bankList.payId
        if(this.bankList.status){
          obj.status = '1'
        } else {
          obj.status = '2'
        }
      } else if(data == 2){
        obj.payId = this.zhifuList.payId
        if(this.zhifuList.status){
          obj.status = '1'
        } else {
          obj.status = '2'
        }
      }
      api.setCardUseful(obj)
      .then(res => {
        if(res.statusCode == 200) {
          // console.log(obj.status)
          // if(obj.status == 1){
          //   this.$store.dispatch('getPayWay', '1')
          // }
          // 修改VUEX中的数据
          this.getBankCardInfoPort()
        }else {
          this.$message.warning(res.msg)
        }
      })
      .catch(() => {

      })
    },
    // 点击去修改银行卡信息事件
    changeBankInfo(){
      this.changeStatus = '1'
      this.changeBankName = '银行卡号'
      this.changePlaceHolderName = '请输入银行卡号'
      this.isShowchangePayTpye = true
      this.changepayForm = Object.assign({}, this.bankList)
      this.changepayForm.type = '1'
    },
    changezhifuInfo(){
      this.changeStatus = '2'
      this.changeBankName = '支付宝'
      this.changePlaceHolderName = '请输入支付宝账号'
      this.isShowchangePayTpye = true
      this.changepayForm = Object.assign({}, this.zhifuList)
      this.changepayForm.type = '2'
    },
    changePayClose(){
      this.isShowchangePayTpye = false
    },
    // select切换
    bankChange(){
      this.payForm.name = ''
      this.payForm.bankName = ''
      this.payForm.branchName = ''
      this.payForm.accountNo = ''
      // console.log(this.payForm.type)
      if(this.payForm.type == 2){
        this.bankName = '账号'
        this.placeHolderName = '请输入支付宝账号'
      }
    },
    // select切换
    changePaybankChange(){
      this.changepayForm.name = ''
      this.changepayForm.bankName = ''
      this.changepayForm.branchName = ''
      this.changepayForm.accountNo = ''
      // console.log(this.changepayForm.type)
      if(this.changepayForm.type == 2){
        this.bankName = '账号'
        this.placeHolderName = '请输入支付宝账号'
      }
    },
    saveBankInfo(payForm){
      this.$refs[payForm].validate((valid) => {
        if (valid) {
          this.addBankCardInfoPort()
        } else {
          return false;
        }
      })
    },
    changeSaveBankInfo(changepayForm){
      this.$refs[changepayForm].validate((valid) => {
        if (valid) {
          this.changeBankCardInfoPort()
        } else {
          return false;
        }
      });
    },
    // 1是银行卡2是支付宝
    // 获取银行卡信息
    getBankCardInfoPort(){
      // var userId = JSON.parse(localStorage.getItem('__uinfo')).userId
      var userId = this.$store.getters.getUserId
      api.getBankCardInfo(userId)
      .then(res => {
        if(res.statusCode == 200) {
          // this.bankList = []
          // this.zhifuList = []
          res.data.forEach(ele => {
              if(ele.type == 1) {
                this.bankList = ele
                if(this.bankList.status == 1) {
                  this.bankList.status = true
                } else {
                  this.bankList.status = false
                }
              } else if (ele.type == 2) {
                this.zhifuList = ele
                if(this.zhifuList.status == 1) {
                  this.zhifuList.status = true
                } else {
                  this.zhifuList.status = false
                }
              }
          })
        }else {
          this.$message.warning(res.msg)
        }
      })
      .catch(() => {

      })
    },
    // 添加银行卡接口
    addBankCardInfoPort(){
      if(this.payForm.type == 2) {
        delete(this.payForm.bankName)
        delete(this.payForm.branchName)
      }
      // console.log(this.payForm)
      api.addBankCardInfo(this.payForm)
      .then(res => {
        if(res.statusCode == 200) {
          this.isShowPay = false
          this.getBankCardInfoPort()
          this.$message.success('添加成功')
        } else {
          this.$message.warning(res.msg)
        }
      })
      .catch((res) =>{
          this.$message.warning(res.msg)
      })
    },
    // 修改支付方式接口
    changeBankCardInfoPort(){
      if(this.changepayForm.type == '2') {
        delete(this.changepayForm.bankName)
        delete(this.changepayForm.branchName)
      }
      delete(this.changepayForm.status)
      // console.log(this.changepayForm)
      api.addBankCardInfo(this.changepayForm)
      .then(res => {
        if(res.statusCode == 200) {
          this.isShowchangePayTpye = false
          this.getBankCardInfoPort()
          this.$message.success('修改成功')
        } else {
          this.$message.warning(res.msg)
        }
      })
      .catch(() =>{
          this.$message.warning(res.msg)
      })
    },
    isShowPayClose(){
      this.isShowPay = false
    },
    // 点击添加支付方式
    addPayMoney(){
      this.isShowPay = true
    }
  }
}
</script>
<style lang="scss" scoped>
	/* 右侧  */
	.section {
		width: 987px;
		height: 946px;
		float: right;
	}

	.basic {
		width: 987px;
		/* height: 437px; */
		background: #191f27;
		padding: 0 30px;
		box-sizing: border-box;
	}

	.basic_title {
    margin-top: 30px;
    padding-bottom: 30px;
    border-bottom:1px solid #202234;
		font-size: 14px;
		color: #c2c3ca;
		line-height: 54px;
	}
</style>
