<template>
  <section class="otcHome ctocDialod">


  <div class="homeContainer">
    <div class="homeContainer_head">
      <div class="left comm">
        <p class="buyIn">买入</p>
        <div class="left_bom">
          <div class="left_bom_div" v-for="(item,index) in supportCoinsShow" :key="index" :class="{ 'border_y': showStatus == (index + 1)}" @click="clickImg((index + 1),item)">
            <img :src="coinsIcons[item.symbol]" v-if="supportCoinsLen && showStatus != (index + 1)" alt="icon">
            <img :src="coinsIcons[item.symbol + '_active']" v-if="supportCoinsLen && showStatus == (index + 1)" alt="icon">
            <span v-if="supportCoinsLen && showStatus != (index + 1)">{{item.symbol}}</span>
            <span v-if="supportCoinsLen && showStatus == (index + 1)" style="color:#4a7bb8;">{{item.symbol}}</span>
          </div>

        </div>
      </div>
      <div class="middle comm">
        <p class="sellOut">卖出</p>
        <div class="middle_bom">
          <!-- 所有币种从接口获取 -->
          <div class="left_bom_div" v-for="(item,index) in supportCoinsShow" :key="index" :class="{ 'border_y': showStatus == (index + 5)}" @click="clickImg((index + 5),item)">
            <img :src="coinsIcons[item.symbol]" v-if="supportCoinsLen && showStatus != (index + 5)" alt="icon">
            <img :src="coinsIcons[item.symbol + '_active']" v-if="supportCoinsLen && showStatus == (index + 5)" alt="icon">
            <span v-if="supportCoinsLen && showStatus != (index + 5)">{{item.symbol}}</span>
            <span v-if="supportCoinsLen && showStatus == (index + 5)" style="color:#4a7bb8;">{{item.symbol}}</span>
          </div>
        </div>
      </div>
      <div class="right comm">
        <p class="blankp"></p>
        <div class="middle_bom">
          <div class="left_bom_div" style="float:right;margin-right: 0;">
            <el-button style="margin-right: 30px;width:135px;background:#3068ae;" size="small" type="primary" @click="releaseOrder">发布广告</el-button>
            <!-- <i class="iconfont" style="font-size:18px;">&#xe687;</i> -->
            <el-button @click="goInAccount" class="hoverBtn" style="width:135px;color:#3068ae;" size="small" plain>资产中心</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="homeContainer_body">
      <div class="formContainer">
        <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
              prop="price"
              :formatter="priceParse"
              label="单价(CNY)"
              class-name="orderNumber_bg">
            </el-table-column>
            <el-table-column
              :label="changeLabel">
              <template slot-scope="scope">
                <span>{{ sub(sub(Number(scope.row.amount), Number(scope.row.processingAmount)), Number(scope.row.inTransitAmount))}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="limitPrice"
              label="限额(CNY)">
              <template slot-scope="scope">
                {{scope.row.quotaMin | availableFilterTwo}} - {{scope.row.quotaMax | availableFilterTwo}}
              </template>
            </el-table-column>
            <el-table-column
              class-name="shop_row"
              label="商家（成单数/完成率）">
                <template slot-scope="scope">
                  <span v-if="scope.row.merchant.orderNum" style="font-size:14px;" @click="getShopInfo(scope.row)" type="text" size="small">{{scope.row.merchant.merchantName}}（{{scope.row.merchant.turnover}} / {{scope.row.merchant.turnover/scope.row.merchant.orderNum * 100 | availableFilterTwo}}%）</span>
                  <span v-else style="font-size:14px;" @click="getShopInfo(scope.row)" type="text" size="small">{{scope.row.merchant.merchantName}}（0/0.00%）</span>
                </template>
            </el-table-column>
            <el-table-column
              prop="payWay"
              align="center"
              label="支付方式">
              <template slot-scope="scope">
                <!-- <el-button @click="handleClick(scope.row)" type="text" size="small">买入</el-button> -->
                <!-- <el-button size="mini" type="success" plain>买入</el-button> -->
                <img v-if="scope.row.bankType == '1'" src="@/assets/home/wallert.png" alt="icon">
                <img v-if="scope.row.zhifuType == '1'" src="@/assets/home/zhifubao.png" alt="icon">
              </template>
            </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="100">
            <template slot-scope="scope">
              <el-button v-if="exchangeParams.type == 0" @click="sellOutClick(scope.row)" type="danger" size="small">卖出</el-button>
              <el-button v-if="exchangeParams.type == 1" @click="buyInClick(scope.row)" size="mini" type="success">买入</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="foot_page">
        <el-pagination
          background
          layout="total,prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="exchangeParams.pageNo"
          :page-size="exchangeParams.pageSize"
          :total="total">
        </el-pagination>
      </div>
    </div>
    <!-- 发布订单弹窗 -->
     <el-dialog
      title="发布广告"
      :visible.sync="isShowReleaseOrder"
      width="450px"
      :before-close="handleClosePublish">
      <div class="releaseOrderContainer">
        <div class="tabTop">
          <div @click="buyIn" style="cursor: pointer;" class="left" :class="classA ? 'class-b' : 'class-a' ">
            <span>买入</span>
          </div>
          <div @click="sellOut" style="cursor: pointer;" class="right" :class="classA ? 'class-a' : 'class-b' ">
            <span>卖出</span>
          </div>
        </div>
        <div class="tab_body">
          <p style="margin-top:30px;">
            <span style="color:#232d39;font-size:16px;">币种</span>
            <el-select style="calc(100% - 50px);border: 1px solid #ebeef5 !important;" require clearable v-model="pulishCurrencyForm"
             class="pulishCurrencyForm" type="pulishCurrencyForm" placeholder="请选择币种" @change="pulishCurrencyChange">
              <el-option
                class="pulishCurrencyFormOption"
                v-for="item in supportCoins"
                :key="item.id"
                :label="item.symbol"
                :value="item.id">
              </el-option>
            </el-select>
          </p>
          <p class="price" style="line-height:50px;height:50px;background:#f7f7f8;margin-top:22px;">
            <span style="color: #232d39; font-size: 14px;margin-left:25px;">价格</span>
            <span style="color:#c3c4c9;font-size:14px;min-width:66px;display: inline-block;">（CNY）</span>
            <el-input  style="width: 250px;height:50px;border:none;background:#f7f7f8;" min="0" type="number" v-model="publishForm.price"
              @keyup.native="amount(publishForm.price,['publishForm','price'],2)" :placeholder="priceHoder"></el-input>
          </p>
          <p class="number" style="line-height:50px;height:50px;background:#f7f7f8;margin-top:22px;">
            <span style="color: #232d39; font-size: 14px;margin-left:25px;">数量</span>
            <span style="color:#c3c4c9;font-size:14px;min-width:66px;display: inline-block;">（{{publishForm.currency}}）</span>
            <el-input style="width: 250px;height:50px;border:none;background:#f7f7f8;" min="0" type="number" v-model="publishForm.amount"
            @keyup.native="amount(publishForm.amount,['publishForm','amount'],4)" :placeholder="numberHoder"></el-input>
          </p>
          <p class="cnyPrice">
            <span style="color: #232d39; font-size: 16px;">金额</span>
            <span style="color:#c3c4c9;font-size:14px;">（CNY）</span>
            <span style="color:#000;margin-left:35px; font-size:16px;font-weight:bold;">{{publishComputedAll | availableFilterTwo}}</span>
          </p>
          <p class="limitMoney">
            <span style="color: #232d39; font-size: 14px;margin-left:25px;">限额</span>
            <span style="color:#c3c4c9;font-size:14px;">（CNY）</span>
              <el-input class="limitInput" type="number" min="0"  v-model="publishForm.quotaMin" @keyup.native="amount(publishForm.quotaMin,['publishForm','quotaMin'],2)"></el-input>
            <span style="color:#232d39;font-size:14px;">至</span>
              <el-input class="limitInput" type="number" min="0" v-model="publishForm.quotaMax" @keyup.native="amount(publishForm.quotaMax,['publishForm','quotaMax'],2)"></el-input>
          </p>
        </div>
        <div style="margin-top:40px;">
          <el-button style="width:100%;background:#3068ae;" type="primary" @click="publishConfirm" :disabled="isPublishing" v-loading="isPublishing">确定</el-button>
        </div>
        <div style="margin-top:20px;">
          <p style="color:#c3c4c9;font-size:12px;">成交后将收取平台服务费：0.00%</p>
        </div>
      </div>
    </el-dialog>
    <!-- 买入弹窗 -->
    <el-dialog
      :title="sellOrBuyTitle"
      :visible.sync="dialogVisible"
      width="450px"
      :before-close="handleCloseBuyIn">
      <div class="poupContainer">
        <!-- {{sellOrBuyInfo}} -->
        <p class="name" style="height:40px;line-height:35px;">
          <span style="color: #656667; font-size: 14px;">委托人（单数/完成率）：</span>
          <span v-if="!sellOrBuyInfo.merchant.turnover == 0"  style="color: #000; font-size: 16px;">{{sellOrBuyInfo.merchant.merchantName}}（{{sellOrBuyInfo.merchant.turnover}} / {{sellOrBuyInfo.merchant.turnover/sellOrBuyInfo.merchant.orderNum * 100 | availableFilterTwo}}%）</span>
          <span v-else  style="color: #000; font-size: 16px;">{{sellOrBuyInfo.merchant.merchantName}}（0/0.00%）</span>
        </p>
        <div class="payWay" style="height:40px;line-height:35px;">
          <span style="color: #656667; font-size: 14px;">可支付方式：</span>
          <div style="display:inline-block;margin-right:10px;" v-for="(item,index) in sellOrBuyInfo.paymentInfos" :key="index">
            <img v-if="item.type == '1'" style="vertical-align:middle;transform: translateY(-2px);" src="@/assets/home/wallert.png" alt="icon">
            <span v-if="item.type == '1'" style="color: #000; font-size: 14px;">银行卡</span>
            <img v-if="item.type == '2'" style="vertical-align:middle;transform: translateY(-2px);" src="@/assets/home/zhifubao.png" alt="icon">
            <span v-if="item.type == '2'" style="color: #000; font-size: 14px;">支付宝</span>
          </div>
        </div>
        <p class="orderLimit" style="height:60px;line-height:35px;border-bottom:1px solid #f1f1f2; ">
          <span style="color: #656667; font-size: 14px;">订单限额</span>
          <span style="color:#c3c4c9;font-size:14px;">（CNY）：</span>
          <span  style="color: #000; font-size: 14px;">{{sellOrBuyInfo.quotaMin | availableFilterTwo}}-{{sellOrBuyInfo.quotaMax | availableFilterTwo}}</span>
        </p>
        <p class="price" style="margin-top:35px;">
          <span style="color: #656667; font-size: 14px;padding-left:20px;">价格</span>
          <span style="color:#c3c4c9;font-size:14px;width:66px;display:inline-block;">（CNY）</span>
          <span  style="color: #000; font-size: 16px;font-weight:bold;">{{sellOrBuyInfo.price | availableFilterTwo}}</span>
        </p>
        <p style="background: #f7f7f8;height:50px;line-height:50px;margin-top:30px;">
          <span style="color:#232d39;font-size:14px;padding-left:20px;">数量</span>
          <span style="color:#c3c4c9;font-size:14px;width:66px;display:inline-block;">（{{sellOrBuyInfo.currency}}）</span>
          <input type="number" min="0"  style="border:none;height:48px;background:#f7f7f8;" v-model="sellOrBuyForm.amount"
            @keyup="amount(sellOrBuyForm.amount,['sellOrBuyForm','amount'],4)" :placeholder="'请输入'+sellOrBuySubitle+'数量'">
          <span class="hoverSpan" style="color:#478ce9;font-size:12px;float:right;margin-right:25px;cursor: pointer;" @click="amountAll">全部{{sellOrBuySubitle}}</span>
        </p>
        <p style="background: #f7f7f8;height:50px;line-height:50px;margin-top:30px;">
          <span style="color:#232d39;font-size:14px;padding-left:20px;">金额</span>
          <span style="color:#c3c4c9;font-size:14px;width:66px;display:inline-block;">（CNY）</span>
          <input type="text" style="border:none;height:48px;background:#f7f7f8;" v-model="buyOrSellComputedAll"
            disabled :placeholder="'请输入'+sellOrBuySubitle+'金额'">
          <span class="hoverSpan" style="color:#478ce9;font-size:12px;float:right;margin-right:25px;cursor: pointer;" @click="amountAll">全部{{sellOrBuySubitle}}</span>
        </p>
        <div style="margin-top:40px;">
          <el-button @click="saveBuyBtn" v-loading="isBuyOrSelling" style="width:100%;background:#3068ae;" type="primary">确定</el-button>
        </div>
      </div>
      <!-- <span slot="footer" class="dialog-footer"> -->
        <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
        <!-- <el-button type="primary" @click="dialogVisible = false">确 定</el-button> -->
      <!-- </span> -->
    </el-dialog>
    <div class="buyPoup" v-if="isShowPoup">

    </div>
  </div>
  </section>
</template>

<script>
import { api } from '@/static/otcApi'
import { availableFilterTwo } from '@/static/common'
import { add,sub, mul, div } from '@/static/calute'
// import func from './vue-temp/vue-editor-bridge';
export default {
  data() {
    return {
      changeLabel: '剩余数量(UTCT)',
      bankType: '',
      zhifuType: '',
      payWayHaveStatus: '', // 支付方式存在的状态
      payPassHaveStatus: '', // 支付密码存在status
      value: '',
      top_bean_list: [
        {imgUrl: require('../assets/home/bbean.png'), imgActiveUrl: require('../assets/home/bbeanBule.png')},
        {imgUrl: require('../assets/home/shapeGray.png'), imgActiveUrl: require('../assets/home/shapeBlue.png')},
        {imgUrl: require('../assets/home/tbeanGray.png'), imgActiveUrl: require('../assets/home/tbean.png')},
      ],
      showStatus: '1',
      priceHoder: '请输入预期买入价格',
      numberHoder: '请输入预期买入数量',
      isShowReleaseOrder: false,
      classA: false, // 弹窗动态的color
      dialogVisible: false,
      sellOrBuyTitle: '买入ETH',
      sellOrBuySubitle: '买入',
      sellOrBuyInfo: {
        merchant: {
          merchantName: ''
        }
      },
      isShowPoup: false,
      currentPage: 1,
      currentSize: 10,
      total: 0,
      beanList: [
        {bean: 'UTCT', value: '1', label: ''},
        {bean: 'KCF',  value: '2', label: ''}
      ],

      tableData: [],
      supportCoins: [],
      supportCoinsShow: [],
      coinsIcons: {
        BTC: 'static/home/bbean.png',
        BTC_active: 'static/home/bbeanBule.png',
        ETH: 'static/home/shapeGray.png',
        ETH_active: 'static/home/shapeBlue.png',
        USDT: 'static/home/tbeanGray.png',
        USDT_active: 'static/home/tbean.png',
        HKDT: require('../assets/home/newHKDT.png'),
        HKDT_active: require('../assets/home/newHKDT_1.png'),
        UTCT: 'static/home/UTCT.png',
        UTCT_active: 'static/home/UTCT1.png'
      },
      exchangeParams: {
        type: 1,
        currency: 'UTCT',
        pageSize: 10,
        pageNo: 1,
        userId: ''
      },
      // 发布订单
      publishForm: {
        type: 0,
        currency: 'UTCT',
        coinId: '',
        price: '',
        amount: '',
        quotaMax: '',
        quotaMin: '',
        userId: this.$store.getters.getUserId,
        // merchantId: this.$store.getters.user.merchant ? this.$store.getters.user.merchant.id  : ''
        merchantId: this.$store.getters.getterMechantId
      },
      pulishCurrencyForm: '',
      sellOrBuyForm: {
        amount: '',
        merchantId: this.$store.getters.getterMechantId,
        total: '',
        transactionId: '',
        userId: this.$store.getters.getUserId
      },
      isPublishing: false,
      isBuyOrSelling: false,
      query: {}
      // buyOrSellComputedAll: ''
    }
  },
  watch: {
  },
  components: {},
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
      if(str && str.length <= 6) {
        var postFix = '' // 后缀
        var long = 6 - str.length
        for (let i = 0; i < long; i++) {
          postFix += '0'
        }
        return arr[0] + '.' + str + postFix
      }else{
        return arr[0] + '.000000'
      }
    }
  },
  computed: {
    publishComputedAll () {
      return mul(Number(this.publishForm.price), Number(this.publishForm.amount))
    },
    buyOrSellComputedAll () {
      let amount = mul( Number(this.sellOrBuyForm.amount), Number(this.sellOrBuyInfo.price))
      let num = Number(amount).toFixed(3)
      let numTwo = num.substring(0, num.lastIndexOf('.') + 3)
      return numTwo
    },
    supportCoinsLen(){
      return this.supportCoins.length
    }
  },
  created() {
    // 是否从首页跳转过来的
    let query = this.$router.currentRoute.query
    if(query.type){
      this.query = query
    }
    if(this.query.type){

    }
    // this.getIsHavePayPass()
    // this.getIsHavePayWay()
  },
  mounted() {
    var a = this.$store.getters.getUserId
    console.log(a)
    setTimeout(() => {
      this.getSupportCoins()
      this.getExchangeListByCurrencyAndType()
    },1000)

  },
  methods: {
    notOpen(){
      this.tableData = []
      this.$message({
        type: 'warning',
        message: '暂未开放',
        duration: 1000
      })
    },
    priceParse(row,column){
      if(row.price) {
        return availableFilterTwo(row.price)
      }
    },
    sub(a,b){
      return sub(a,b)
    },
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
                  if(numTwo < 0){
                    this.$message.warning('请输入正确的数值')
                    this[arr[0]][arr[1]] = ''
                  }else{
                    this[arr[0]][arr[1]] = numTwo
                  }

                }else if(len== 1){
                  if(numTwo < 0){
                    this.$message.warning('请输入正确的数值')
                    this[arr[0]] = ''
                  }else{
                    this[arr[0]] = numTwo
                  }

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
                  if(numTwo < 0){
                    this.$message.warning('请输入正确的数值')
                    this[arr[0]][arr[1]] = ''
                  }else{
                    this[arr[0]][arr[1]] = numTwo
                  }
                }else if(len== 1){
                  if(numTwo < 0){
                    this.$message.warning('请输入正确的数值')
                    this[arr[0]] = ''
                  }else{
                    this[arr[0]] = numTwo
                  }
                }
              }
            }
          }
        }



    },
    // 对用户是否存在支付密码进行判断
    getIsHavePayPass(){
     this.payPassHaveStatus = this.$store.getters.getterPayPassword
    },
    // 对用户是否存在支付方式的状态
    getIsHavePayWay(){
     this.payWayHaveStatus = this.$store.getters.getterPayWay
    },
    amountAll(){
      let num = sub(Number(this.sellOrBuyInfo.amount), Number(this.sellOrBuyInfo.processingAmount))
      this.sellOrBuyForm.amount = sub(num, Number(this.sellOrBuyInfo.inTransitAmount))
      // this.sellOrBuyForm.amount = this.sellOrBuyInfo.amount -  - this.sellOrBuyInfo.inTransitAmount
    },
    // 获取支持交易的币种
    getSupportCoins(){
      this.supportCoins = []
      this.supportCoinsShow = []
      let noOpenCoins = [{
        symbol: "BTC",
      },{
        symbol: "USDT",
      }]
      api.getSupportCurrencys().then(res => {
        if(res.statusCode == 200){
          let arr = []
          arr = res.data
          arr.reverse()
          this.supportCoins = arr
          this.supportCoinsShow = arr.concat(noOpenCoins)
          // console.log(res.data)
        }else {
          this.$message.warning(res.msg)
        }
      })
    },
    // 获取买卖信息
    getExchangeListByCurrencyAndType(){
      this.tableData = []
      // this.total = 0
      console.log(this.$cookies.get('uid'))
      let uid = this.$cookies.get('uid')

      this.exchangeParams.userId = this.$store.getters.getUserId ? this.$store.getters.getUserId : uid
      // if(!this.exchangeParams.userId) return
      api.getTransactionListByCoinType(this.exchangeParams).then(res => {
        // console.log(res)
        if(res.statusCode == 200){
          if(res.data.rows.length){
            res.data.rows.forEach(ele => {
              if(ele.paymentInfos.length){
                ele.paymentInfos.forEach(childEle => {
                  if(childEle.type == 1){
                    ele.bankType = '1'
                  } else if(childEle.type == 2){
                    ele.zhifuType = '1'
                  }
                })
              }
            })
            let data  = JSON.parse(JSON.stringify(res.data.rows))
            if(this.exchangeParams.currency == data[0].currency && this.exchangeParams.type == data[0].type){
              this.tableData = data
              this.total = Number(res.data.pagination.totalRecord)
            }
          }else{
            this.total = 0
          }

        }else {
          this.$message.warning(res.msg)
        }
      })
    },
    // 关闭买入卖出兑换框
    handleCloseBuyIn(){
      this.dialogVisible = false
      // TODO 清空对话框的数据
    },
    // 关闭发布对话框
    handleClosePublish(){
      this.isShowReleaseOrder = false
      // TODO 清空对话框的数据
    },
    // 点击币种设置买卖查询参数
    clickImg(data, item){
      this.showStatus = data
      //TODO 设置当前选择的币种以及是买入还是卖出

      if(data <= 4){
        this.exchangeParams.type = 1 // 买
      }else{
        this.exchangeParams.type = 0 //卖
      }
      this.changeLabel = `剩余数量(${item.symbol})`
      this.exchangeParams.pageNo = 1
      this.total = 0
      this.exchangeParams.currency = item.symbol
      if(item.symbol == "BTC" || item.symbol == "USDT"){
        this.notOpen()
        return
      }
      this.getExchangeListByCurrencyAndType()
    },
    // 点击商家信息事件
    getShopInfo(){
      // TODO 暂时不做
      // this.$router.push({
      //   path: '/shopInfo'
      // })
    },
    saveBuyBtn(){
      let isLogin = this.checkUserIsLogin()
      if(!isLogin) return
      // TODO 错误处理

      var _this  = this
      // 买入或者卖出 根据sellOrBuyInfo的type 来判断
      console.log(this.buyOrSellComputedAll)
      _this.sellOrBuyForm.merchantId = _this.sellOrBuyInfo.merchantId
      _this.sellOrBuyForm.transactionId = _this.sellOrBuyInfo.id
      _this.sellOrBuyForm.userId = this.$store.getters.getterMechantUid
      if(this.sellOrBuySubitle == '买入'){
        if(!_this.sellOrBuyForm.amount){
          _this.$message.warning('买入数量不能为空')
          return
        }
        if(!_this.buyOrSellComputedAll){
          _this.$message.warning("买入金额不能为空")
          return
        }
      } else if(this.sellOrBuySubitle = '卖出'){
        if(!_this.sellOrBuyForm.amount){
          _this.$message.warning('卖出数量不能为空')
          return
        }
        if(!_this.buyOrSellComputedAll){
          _this.$message.warning("卖出金额不能为空")
          return
        }
      }
      if(Number(this.buyOrSellComputedAll) < Number(this.sellOrBuyInfo.quotaMin) ){
        _this.$message.warning('金额小于限额数量,请重新输入')
        _this.sellOrBuyForm.amount = ''
        return
      }
      if(Number(this.buyOrSellComputedAll) > Number(this.sellOrBuyInfo.quotaMax) ){
        _this.$message.warning('金额大于限额数量,请重新输入')
        _this.sellOrBuyForm.amount = ''
        return
      }
      if(this.isBuyOrSelling){
        return
      }
      this.isBuyOrSelling = true
      api.addOrder(_this.sellOrBuyForm).then(res => {
        if(res.statusCode == 200) {
          _this.$message.success('操作成功')
          _this.dialogVisible = false
          _this.$router.push({
            path:'/transactionInfo',
            query: {
              id: res.data,
              type: 0
            }
          })
        } else {
          if(res.statusCode == 1017){
            this.$router.push('/accountUser/Payment')
          }else if(res.statusCode == 1026){
            this.$router.push('/accountUser/identityverify')
          }
          _this.$message.warning(res.msg)
        }
        this.isBuyOrSelling = false
      })
      .catch((error) => {
        this.isBuyOrSelling = false
        if(error.statusCode == 1017){
          this.$router.push('/accountUser/Payment')
        }else if(res.statusCode == 1026){
            this.$router.push('/accountUser/identityverify')
          }
        _this.$message.warning(error.msg)
      })
    },
    // 点击资金划转事件
    goInAccount(){
      let isLogin = this.checkUserIsLogin()
      if(!isLogin) return
     this.payPassHaveStatus = this.$store.getters.hasSettedPinCode  // 资金密码是否设置
      this.payWayHaveStatus = this.$store.getters.getterPayWay        // 是否添加支付方式
      var status = this.$store.getters.getterMerchantCtoCStatus // 是否是商家
      if(this.payPassHaveStatus){
        if(this.payWayHaveStatus){
          this.$router.push({
            path: '/property/coinoption'
          })
        } else {
          this.$message.warning("请添加支付方式")
          this.$router.push({
            path: '/accountUser/Payment'
          })
          return
        }
      } else {
        this.$message.warning("请先设置资金密码")
        this.$router.push({
          path: '/accountUser/security'
        })
        return
      }

    },
    // 发布
    publishConfirm(){
      if(this.isPublishing){
        return
      }
      if(this.pulishCurrencyForm == ''){
        this.$message({
          message: '请选择币种',
          type: 'warning',
          duration: 1000
        })
        return
      }
      // 不为空
      if(this.publishForm.price == ''){
        this.$message({
          message: '请输入价格',
          type: 'warning',
          duration: 1000
        })
        return
      }
      if(this.publishForm.amount == ''){
        this.$message({
          message: '请输入数量',
          type: 'warning',
          duration: 1000
        })
        return
      }
      if(this.publishForm.quotaMax != '' && this.publishForm.quotaMin != '' && Number(this.publishForm.quotaMin) >= Number(this.publishForm.quotaMax)){
        this.$message.warning('请输入正确的限额数值')
        this.publishForm.quotaMin = ''
        return

      }
      if(this.publishForm.quotaMin == ''){
        this.publishForm.quotaMin = 0
      }
      if(this.publishForm.quotaMax == ''){
        this.publishForm.quotaMax = mul(Number(this.publishForm.price),Number(this.publishForm.amount))
      }
      // TODO 判断错误不发布
      // console.log(this.publishForm)
      if(!this.publishForm.currency || !this.publishForm.price || !this.publishForm.amount || !this.publishForm.quotaMin || !this.publishForm.quotaMax){
        this.$message.warning('请输入完整订单信息')
        return
      }
      this.publishForm.userId = this.$store.getters.getUserId
      this.publishForm.merchantId = this.$store.getters.getterMechantId
      if(this.isPublishing){
        return
      }
      this.isPublishing = true
      api.addTransaction(this.publishForm).then(res => {
        if(res.statusCode == 200){
          this.$message.success('发布广告成功')
          // 清空发布信息 关闭对话框
          // 重新请求列表
          this.clearPublishForm()
          this.getExchangeListByCurrencyAndType()
          this.isShowReleaseOrder = false
        } else {
          if(res.statusCode == 1017){
            this.$router.push('/accountUser/Payment')
          }else if(res.statusCode == 1026){
            this.$router.push('/accountUser/identityverify')
          }
          this.$message.warning(res.msg)
        }
        setTimeout( () => {
          this.isPublishing = false
        },500)
      }).catch(err => {
        if(err.statusCode == 1017){
            this.$router.push('/accountUser/Payment')
          }else if(res.statusCode == 1026){
            this.$router.push('/accountUser/identityverify')
          }
        this.$message.warning(err.msg)
        this.isPublishing = false
      })
    },
    clearPublishForm(){
      this.pulishCurrencyForm = ''
      this.publishForm.currency = ''
      this.publishForm.price = ''
      this.publishForm.amount = ''
      this.publishForm.quotaMin = ''
      this.publishForm.quotaMax = ''
    },
    // 发布选择币种发生改变设置提交的币种信息
    pulishCurrencyChange(item){
      let data = {}
      for(let i=0;i< this.supportCoins.length;i++){
        if(this.supportCoins[i].id == item){
          data = this.supportCoins[i]
          break
        }
      }
      this.publishForm.currency = data.symbol
      this.publishForm.coinId = data.coinId
    },
    buyIn(){
      // Tab切换买入
      this.classA = false
      this.publishForm.type = 0
      this.numberHoder = '请输入预期买入数量'
      this.priceHoder = '请输入预期买入价格'
    },
    sellOut(){
      // Tab切换卖出
      this.publishForm.type = 1
      this.classA = true
      this.numberHoder = '请输入预期卖出数量'
      this.priceHoder = '请输入预期卖出价格'
    },
    // 点击发布订单事件
    releaseOrder(){
      let isLogin = this.checkUserIsLogin()
      if(!isLogin) return
      // 如果不是商家 跳转到公告
      // let merchantStatus = this.$store.getters.getMerchantStatus
      // console.log(merchantStatus)
      // if(merchantStatus == 0){
      //   this.$confirm('您需要申请成为商家才能发布广告。', '提示', {
      //     confirmButtonText: '申请',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //   }).catch(() => {
      //     this.$message({
      //       type: 'info',
      //       message: '点击了取消'
      //     })
      //   })
      // }

      // this.isShowReleaseOrder = true
      this.payPassHaveStatus = this.$store.getters.hasSettedPinCode  // 资金密码是否设置
      this.payWayHaveStatus = this.$store.getters.getterPayWay        // 是否添加支付方式
      var status = this.$store.getters.getterMerchantCtoCStatus // 是否是商家
      if(this.payPassHaveStatus){
        if(!status){
          this.$message.warning("您不是商家,请联系管理员")
          return
        }
        if(this.payWayHaveStatus){
          this.isShowReleaseOrder = true
        } else {
          this.$message.warning("请添加支付方式")
          this.$router.push({
            path: '/accountUser/Payment'
          })
          return
        }
      } else {
        this.$message.warning("请先设置资金密码")
        this.$router.push({
          path: '/accountUser/security'
        })
        return
      }
    },
    tableRowClassName({row, rowIndex}) {
      return 'warning_row';
    },
    // 点击卖出事件
    sellOutClick(row){
      let isLogin = this.checkUserIsLogin()
      if(!isLogin) return
      this.payPassHaveStatus = this.$store.getters.hasSettedPinCode  // 资金密码是否设置
      this.payWayHaveStatus = this.$store.getters.getterPayWay        // 是否添加支付方式
      var status = this.$store.getters.getterMerchantCtoCStatus // 是否是商家
      if(this.payPassHaveStatus){
        // 买入卖出时候不对商家状态进行判断
        // if(!status){
        //   this.$message.warning("您不是商家")
        //   return
        // }
        if(this.payWayHaveStatus){
          this.dialogVisible = true
        } else {
          this.$message.warning("请添加支付方式")
          this.$router.push({
            path: '/accountUser/Payment'
          })
          return
        }
      } else {
        this.$message.warning("请先设置资金密码")
        this.$router.push({
          path: '/accountUser/security'
        })
        return
      }
      // console.log(row)
      this.sellOrBuyTitle = '卖出'+ row.currency
      this.sellOrBuySubitle = '卖出'
      this.sellOrBuyInfo = row
      this.sellOrBuyForm.amount = ''
      // TODO 设置对话框中的订单信息
    },
    // 点击买入事件
    buyInClick(row){
      let isLogin = this.checkUserIsLogin()
      if(!isLogin) return
      this.payPassHaveStatus = this.$store.getters.hasSettedPinCode  // 资金密码是否设置
      this.payWayHaveStatus = this.$store.getters.getterPayWay        // 是否添加支付方式
      var status = this.$store.getters.getterMerchantCtoCStatus // 是否是商家
      if(this.payPassHaveStatus){
        if(this.payWayHaveStatus){
          this.dialogVisible = true
        } else {
          this.$message.warning("请添加支付方式")
          this.$router.push({
            path: '/accountUser/Payment'
          })
          return
        }
      } else {
        this.$message.warning("请先设置资金密码")
        this.$router.push({
          path: '/accountUser/security'
        })
        return
      }
      // this.payPassHaveStatus = this.$store.getters.getterPayPassword
      this.sellOrBuyTitle = '买入'+ row.currency
      this.sellOrBuySubitle = '买入'
      this.sellOrBuyInfo = row
      this.sellOrBuyForm.amount = ''
      this.dialogVisible = true
      // TODO 设置对话框中的订单信息
    },
    // 进行分页事件
    handleSizeChange(val) {
      this.exchangeParams.pagesize = val
      this.getExchangeListByCurrencyAndType()
    },
    handleCurrentChange(val) {
      this.exchangeParams.pageNo = val
      this.getExchangeListByCurrencyAndType()
    },
    checkUserIsLogin(){
      let isLogin =  this.$store.getters.loggedIn
      if(!isLogin){
        this.$router.push('/user/login')
        this.$message({
          type: 'warning',
          message: '您需要登录才能操作',
          duration: 1000
        })

      }
      return isLogin
    }
  }
};
</script>
<style lang='scss' scoped>

.homeContainer {
  min-height: 600px;
  padding-bottom: 30px;
  width: 1200px;
  margin: 0 auto;
  .hoverSpan:hover{
    opacity: .7;
  }
  .poupContainer{
    input:focus {
      outline:none;
    }
  }
  .releaseOrderContainer{
    .tab_body{
      .limitMoney{
        margin-top: 30px;
        height: 50px;
        background: #f7f7f8;
        span{
          line-height: 50px;
        }
      }
      .cnyPrice{
        height: 63px;
        line-height: 63px;
        border-bottom: 1px solid #f1f1f2;
      }
      .price .number{
        input{
          font-size: 14px;
        }
        input::-webkit-input-placeholder{
          color:#c7cbd5;
        }
        input::-moz-placeholder{   /* Mozilla Firefox 19+ */
          color:#c7cbd5;
        }
        input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
          color:#c7cbd5;
        }
        input:-ms-input-placeholder{  /* Internet Explorer 10-11 */
          color:#c7cbd5;
        }
        input:focus {
          outline:none;
        }
      }
    }
    .tabTop{
      height: 45px;
      display: flex;
      font-size: 16px;
      font-weight: bold;
      color: #7b7b7b;
      .class-a{
        color: #4a7bb8;
        border-bottom: 2px solid #3068ae;
      }
      .class-b{
        border-bottom: 2px solid #e8e8e8;
      }
      .left{
        line-height: 45px;
        text-align: center;
        flex: 1;
      }
      .right{
        line-height: 45px;
        text-align: center;
        flex: 1;
      }
    }
  }
  .buyPoup{
    // 弹出样式
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .3)
  }
  .homeContainer_body {
    margin-top: 80px;
    height: calc(100% - 155px);
    .foot_page{
      margin-top: 72px;
      text-align: center;
    }
  }
  .homeContainer_head {
    display: flex;
    margin-top: 70px;
    height: 85px;
    .border_y{
      border-bottom:2px solid #4a7bb8;
    }
    .middle{
      padding-left:80px;
    }
    .left,
    .middle,
    .right {
      .buyIn {
        margin-left: 5px;
        margin-bottom: 36px;
      }
      .sellOut {
        margin-left: 5px;
        margin-bottom: 36px;
      }
      .blankp {
        height: 55px;
      }
      .left_bom,
      .middle_bom {
        height: 23px;
        .left_bom_div {
          cursor: pointer;
          float: left;
          margin-right: 24px;
          span {
            color: #999999;
            font-size: 18px;
            line-height: 23px;
          }
          img {
            transform: translateY(-2px);
            height: 23px;
            vertical-align: middle;
          }
        }
        .left_bom_div:last-child{
          margin-right: 0;
        }
      }
    }
    .middle {
      border-left: 1px solid #dedde3;
    }
    .comm {
      flex: 1;
      p {
        color: #000;
        font-size: 18px;
        font-weight: bold;
      }
    }
  }
}
.limitInput{

  height:40px;
  background:white;
  margin:5px 12px;
  width:100px;
  border-radius:5px;
  border:none;
  display: inline-block;
}

</style>
