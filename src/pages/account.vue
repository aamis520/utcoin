<!--  -->
<template>
<section class="otcHome">
  <div class="accountContainer">
    <div class="accountContainer_top">
      <p style="color:#252524;font-size:30px;">{{$t('assets.myAssets')}}</p>
    </div>
    <div class="accountContainer_beanList">
      <div class="btc_div" v-for="(item,index) in getBackData" :key="index">
        <div class="one comm">
          <div style="margin-top:90px;">
            <img style="vertical-align: middle;transform: translateY(-3px);height:26px;width:26px;" :src="item.coinLogo" alt="icon">
            <span style="color:#505050;font-weight:bold;font-size:24px;">{{item.symbol}}</span>
          </div>
        </div>
        <div class="two comm">
          <p class="beanTitle">{{$t('assets.c2cAccount')}}</p>
          <p class="beanContent">
            <span class="defaultSpan" style="color:#b1b1ba;font-size:14px;">{{$t('assets.useful')}}</span> &nbsp;
            <span class="defaultSpan" style="color:#212122;font-size:16px;">{{item.available}}&nbsp;{{item.symbol}}</span>
          </p>
          <p>
            <span class="defaultSpan" style="color:#b1b1ba;font-size:14px;">{{$t('assets.frozen')}}</span> &nbsp;
            <span class="defaultSpan" style="color:#212122;font-size:16px;">{{item.frozen}}&nbsp;{{item.symbol}}</span>
          </p>
        </div>
        <div class="three comm">
          <p class="beanTitle">{{$t('assets.coinAccount')}}</p>
          <p class="beanContent">
            <span class="defaultSpan" style="color:#b1b1ba;font-size:14px;">{{$t('assets.useful')}}</span>&nbsp;
            <span class="defaultSpan" style="color:#212122;font-size:16px;">{{item.amount}}&nbsp;{{item.symbol}}</span>
          </p>
          <p>
            <span class="defaultSpan" style="color:#b1b1ba;font-size:14px;">{{$t('assets.frozen')}}</span>&nbsp;
            <span class="defaultSpan" style="color:#212122;font-size:16px;">{{item.amountForzen}}&nbsp;{{item.symbol}}</span>
          </p>
        </div>
        <div class="four comm">
          <div style="margin-top:50px;width:128px;font-size:16px;height:45px;">
             <!-- <el-button @click="chargePoup" style="color:#fff;width:128px;font-size:16px;height:45px;background:#3068ae;" >充值</el-button> -->
          </div>
          <div style="margin-top:20px;">
              <el-button class="hoverBtn" @click="assetsTransfer(item)" style="color:#3068ae;font-size:16px;width:128px;height:45px;background:#fff;">{{$t('assets.transfer')}}</el-button>
          </div>
        </div>
      </div>
    </div>

    <div class="accountContainer_top">
      <p style="color:#252524;font-size:30px;">{{$t('assets.assetsDetail')}}</p>
    </div>
    <div class="assetsDetails" style="padding-top:0;">
      <el-table
        :data="getUserDetail"
        style="width: 100%">
        <el-table-column
          prop="bizType"
          :formatter="typeFormatter"
          :label="$t('assets.type')">
        </el-table-column>
        <el-table-column
          prop="symbol"
          :label="$t('assets.coinType')">
        </el-table-column>
        <el-table-column
          prop="opTime"
          :formatter="timeParse"
          :label="$t('assets.time')">
        </el-table-column>
        <el-table-column
          prop="amount"
          :label="$t('assets.amount')"
          width="100">
        </el-table-column>
      </el-table>
    </div>
    <div class="pageOver" style="text-align:center;margin-top:20px;">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="form.pageNumber"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="form.pageSize"
        layout="total, prev, pager, next"
        :total="pageTotal">
      </el-pagination>
    </div>
    <!-- 充值弹窗 -->
     <el-dialog
      title="充值USDT"
      :visible.sync="isShowRecharge"
      width="450px"
      :before-close="handleClose">
      <div class="chargeContainer">
        <p class="title comm">
          <span style="color:#a9a9a9;font-size:14px;">请将USDT充值到如下地址</span>
        </p>
        <p class="address comm">
          <span style="color:#000;font-size:14px;">sgjdf;lskglfk;ghsfk;dlkgdld;fjm;</span>
        </p>
        <p class="copyTitle">
          <span style="color:#478ce9;font-size:14px;">复制地址</span>
        </p>
        <div class="erweimaWrapper">
          <div class="img">
          </div>
          <p class="getAddressTitle">或扫描二维码地址获取地址</p>
        </div>
        <div class="ruleWrapper">
          <p class="rule">
            请勿向上述地址充值任何非USDT资产，否则资产将不可找回。<br>
            您充值至上述地址后，需整个网络节点的确认，30次网络确认后可划
            转，到账时间一般为10分钟-60分钟。<br>
            最小充值金额：100USDT，小于最小金额的充值将不会上账。<br>
            目前不支持使用智能合约或区块奖励(Coinbase)的转账充值，智能合约
            或区块奖励的转账将不会上账，请您谅解。
          </p>
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
              <input type="number" :placeholder="$t('assets.amountPlaceholder')"
               @keyup="amount(tranferForm.amount,['tranferForm','amount'],4)" v-model="tranferForm.amount">
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
  </div>
  </section>
</template>

<script>
import { api } from '@/static/otcApi'
import { dateFtt, dataParse } from '@/static/common'
export default {
  data () {
    return {
      okNumber: '0',
      saveTranferInfo: '', // 保存点击划转item信息
      formIsDisabled: false,
      toIsDisabled: false,
      toAccount: '', // 到达账户
      formAccount: '', // 出账账户
      tranferForm:{
        coinId: '', //  币种id
        symbol: '',
        amount: '', // 数量
        bizType: '', // 1 转入 2 转出
        userId: this.$store.getters.getUserId
      },
      getBackData:[],
      getUserDetail: [],
      pageTotal: 0,
      form: {
        pageSize: 5,
        pageNumber: 1
      },
      value: '',
      isShowRecharge: false,
      isAssetsTransfer: false,
      beanList:[
        {iconUrl: require('@/assets/account/b.png'),bbfrozzen:'0.00000',bbcanUse: '0.00000', facanUse: '0.000000', beanName: 'BTC',fafrozzenNumber: '0.00000', },
        {iconUrl: require('@/assets/account/shape.png'),bbfrozzen:'0.00000',bbcanUse: '0.00000', facanUse: '0.000000', beanName: 'ETH',fafrozzenNumber: '0.00000', },
        {iconUrl: require('@/assets/account/t.png'),bbfrozzen:'0.00000',bbcanUse: '0.00000', facanUse: '0.000000', beanName: 'BTC',fafrozzenNumber: '0.00000', }
      ],
      detailList: [
        {type: '充值',beanClassify: 'USDT', time: '2018-8-18', number: '10000.00'},
        {type: '转入',beanClassify: 'USDT', time: '2018-8-18', number: '10000.00'},
        {type: '转出',beanClassify: 'USDT', time: '2018-8-18', number: '10000.00'}
      ]
    };
  },

  components: {},

  computed: {},
  created () {},
  mounted() {
    this.getBackPort()
    this.getAssetsDetail()
  },

  methods: {
    amount(e, arr, many){
        if (!e) return
        if(many == 2){
          if (!/^\d*\.?\d{0,2}$/.test(e)) {
            let num = Number(e).toFixed(3)
            let numTwo = num.substring(0, num.lastIndexOf('.') + 3)
            if(typeof(arr) == 'object'){
              if( arr instanceof Array){
                let len = arr.length
                if(len == 2){
                  this[arr[0]][arr[1]] = numTwo
                }else if(len== 1){
                  this[arr[0]] = numTwo
                }
              }
            }
          }
        }else if(many == 4){
          if (!/^\d*\.?\d{0,6}$/.test(e)) {
            let num = Number(e).toFixed(7)
            let numTwo = num.substring(0, num.lastIndexOf('.') + 7)
            if(typeof(arr) == 'object'){
              if( arr instanceof Array){
                let len = arr.length
                if(len == 2){
                  this[arr[0]][arr[1]] = numTwo
                }else if(len== 1){
                  this[arr[0]] = numTwo
                }
              }
            }
          }
        }

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
    typeFormatter(row, column) {
      if(row.bizType == '1'){
        return '转入'
      } else if(row.bizType == '2') {
        return '转出'
      } else if(row.bizType == '8') {
        return '卖出'
      } else if(row.bizType == '9') {
        return '买入'
      }
    },
    timeParse(row,column){
      if(row.opTime){
        return dateFtt(row.opTime)
      } else {
        ''
      }
    },
    handleCurrentChange(val) {
      this.form.pageNumber = val
      this.getAssetsDetail()
      // console.log(val)
    },
    handleSizeChange(val){
      this.form.pageSize = val
      this.getAssetsDetail()
    },
    // 资金划转接口口 1入 2 出
    assetsTransferPort(){
      if(this.formAccount == '1') {
        this.tranferForm.bizType = 2
      } else if(this.formAccount == '2'){
        this.tranferForm.bizType = 1
      }
      var _this = this
      api.accountTransfer(_this.tranferForm)
      .then(res => {
        if(res.statusCode == 200) {
          _this.$message.success('资金划转成功')
          _this.isAssetsTransfer = false
          _this.getBackPort()
          _this.getAssetsDetail()
        }else {
          _this.$message.warning(res.msg)
        }
      })
      .catch(() => {

      })
    },
    // 资产明细接口
    getAssetsDetail(){
      var userId = JSON.parse(localStorage.getItem('__uinfo')).userId
      var pageNo = this.form.pageNumber
      var pageSize = this.form.pageSize
      api.getUserAssetsList(userId, pageNo, pageSize)
      .then(res => {
        if(res.statusCode == 200) {
          this.getUserDetail = res.data.rows
          this.pageTotal = Number(res.data.pagination.totalRecord)
        }else {
          this.$message.warning(res.msg)
        }
      })
      .catch(() => {

      })
    },
    // 资产列表接口
    getBackPort(){
      var userId = JSON.parse(localStorage.getItem('__uinfo')).userId
      api.getUserC2CCoinInfoBySymbol(userId)
      .then(res => {
        if(res.statusCode == 200) {
          this.getBackData = res.data
        }else {
          this.$message.warning(res.msg)
        }
      })
      .catch(() => {

      })
    },
    // 关闭资金划转
    isAssetsTransferClose(){
      this.isAssetsTransfer = false
    },
    // 点击资金划转
    assetsTransfer(data){
      this.formAccount = ''
      this.toAccount = ''
      this.tranferForm = {
        coinId: '', //  币种id
        symbol: '',
        amount: '', // 数量
        bizType: '' // 1 转入 2 转出
      },
      this.tranferForm.userId = JSON.parse(localStorage.getItem('__uinfo')).userId
      // console.log(data)
      this.saveTranferInfo = data
      this.tranferForm.symbol = data.symbol
      this.tranferForm.coinId = data.coinId
      this.isAssetsTransfer = true
    },
    handleClose(){
      this.isShowRecharge = false
    },
    // 点击充值
    chargePoup(){
      this.isShowRecharge = true
    }
  }
}

</script>
<style lang='scss' scoped>
.accountContainer{
  min-height: 1779px;
  width: 1200px;
  margin: 0 auto;
  padding-bottom: 50px;
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
  // background: yellowgreen;
  // .moneyTransferPoupContainer{
  //   .moneyTranferBtn{
  //     background: red;
  //     height: 40px;
  //     margin-top: 36px;
  //   }
  // }
  .chargeContainer{
    height: 465px;
    .ruleWrapper{
      margin-top: 30px;
      height: 160px;
      font-size: 12px;
      color:#bbb;
      line-height: 23px;
    }
    .title{
      height: 38px;
    }
    .address{
      text-align: center;
      height: 27px;
    }
    .copyTitle{
      text-align: center;
      height: 50px;
    }
    .erweimaWrapper{
      text-align: center;
      height: 170px;
      border-bottom:1px solid #f0f0f0;
      .getAddressTitle{
        margin-top: 16px;
        color: #a9a9a9;
        font-size: 14px;
      }
      .img{
        background: red;
        height: 100px;
        width: 100px;
        margin: 0 auto;
      }
    }
    .comm{
      text-align: center;
    }
  }
  .accountContainer_top{
    padding-top:90px;
    height: 190px;
    p{
    }
  }
  .assetsDetails{
    padding: 28px 80px ;
    box-shadow: 0px 0px 25px #e8e8e8;
    height: 600px;
    border-radius: 10px;
    background: white;
  }
  .accountContainer_beanList{
    padding: 28px 80px ;
    box-shadow: 0px 0px 25px #e8e8e8;
    // height: 690px;
    border-radius: 10px;
    background: white;
    .beanTitle{
      margin-top: 50px;
      color:#393c41;
      font-size: 16px;
    }
    .defaultSpan{
      line-height: 30px;
    }
    .beanContent{
      margin-top:45px;
    }

    .btc_div{
      height: 210px;
      display: flex;
      .four{
        text-align: right;
        border-bottom:1px solid #efefef;
      }
      .one{
        text-align: left;
      }
      .three{
        padding-left:70px;
        border-bottom:1px solid #efefef;
      }
      .two{
        border-bottom:1px solid #efefef;
      }
      .comm{
        flex: 1;

      }
    }
    .btc_div:nth-last-child(1) .three,  .btc_div:nth-last-child(1) .two,  .btc_div:nth-last-child(1) .four{
      border-bottom: none;
    }
  }
}
</style>
