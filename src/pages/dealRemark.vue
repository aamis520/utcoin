<!--  -->
<template>
  <section class="otcHome">
  <div class="dealRemarkContainer">
    <div class="dealRemarkContainer_title">
      <span>{{$t('advertisement.myAdvertise')}}</span>
    </div>
    <div class="mainTable" style="margin-bottom:80px;">
        <el-table
          :data="mainTbaleList"
          style="width: 100%">
          <el-table-column
            prop="transactionNo"
            width="200"
            :label="$t('advertisement.advertiseNo')">
          </el-table-column>
          <el-table-column
            :label="$t('advertisement.type')">
              <template slot-scope="scope">
                <span v-if="scope.row.type == '1'" style="color:#db4d2b;font-size:14px;" type="text" size="small">卖出{{scope.row.currency}}</span>
                <span v-if="scope.row.type == '0'" style="color:#59ba73;font-size:14px;" type="text" size="small">买入{{scope.row.currency}}</span>
              </template>
          </el-table-column>
          <el-table-column
            prop="pubNumber"
            align="center"
            label="总量">
          </el-table-column>
          <!-- 总量 -->
          <!-- <el-table-column
            prop="pubNumber"
            align="center"
            :label="$t('advertisement.total')" + "(CNY）">
          </el-table-column> -->
          <!-- 成交数量 -->
          <el-table-column
            prop="dealNumber"
            align="center"
            label="成交数量">
          </el-table-column>
          <!-- 冻结数量 -->
          <el-table-column
            prop="frozenAmount"
            align="center"
            label="冻结数量">
          </el-table-column>
          <el-table-column
            prop="limitPrice"
            align="center"
            label="限额（CNY）">
             <template slot-scope="scope">
                {{scope.row.quotaMin | availableFilterTwo}} - {{scope.row.quotaMax | availableFilterTwo}}
              </template>
          </el-table-column>
          <el-table-column
            prop="pubTime"
            width="150"
            :formatter="pubFormatter"
            align="center"
            label="时间">
          </el-table-column>
          <el-table-column
            width="150"
            align="center"
            label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.status == '0'" style="color:#59ba73;font-size:14px;" type="text" size="small">进行中</span>
              <span v-if="scope.row.status == '1'" style="color:#db4d2b;font-size:14px;" type="text" size="small">已完成</span>
              <span v-if="scope.row.status == '2'" style="color:#999999;font-size:14px;" type="text" size="small">已取消</span>
              <span v-if="scope.row.status == '4'" style="color:#999999;font-size:14px;" type="text" size="small">部分成交</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="right"
            width="100">
            <template slot-scope="scope">
              <el-button @click="cancelOrder(scope.row)" v-if="scope.row.status == '0'" type="danger" size="small">取消</el-button>
            </template>
          </el-table-column>
        </el-table>
    </div>
    <div class="dealRemarkContainer_body">
      <el-table
        :data="remarkList"
        style="width: 100%">
        <el-table-column
          prop="orderNo"
          width="200"
          class-name="orderNumber_bg"
          label="订单编号">
        </el-table-column>
        <el-table-column
          label="交易类型">
            <template slot-scope="scope">
            <el-button v-if="scope.row.type == '0'" style="color:#db4d2b;font-size:14px;" @click="orderType(scope.row)" type="text" size="small">卖出{{scope.row.currency}}</el-button>
            <el-button v-if="scope.row.type == '1'" style="color:#59ba73;font-size:14px;" type="text" size="small">买入{{scope.row.currency}}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="amount"
          align="center"
          label="交易数量">
        </el-table-column>
        <el-table-column
          prop="total"
          align="center"
          :formatter ='totalPriceParse'
          label="总价（CNY）">
        </el-table-column>
        <el-table-column
          prop="price"
          :formatter ='pricePriceParse'
          align="center"
          label="单价（CNY）">
        </el-table-column>
        <el-table-column
          :formatter='timeFormatterRemark'
          prop="createTime"
          align="center"
          label="时间">
        </el-table-column>
        <el-table-column
          prop="merchant.merchantName"
          class-name="orderNumber_bg"
          width="120"
          align="center"
          label="交易对象">
        </el-table-column>
          <el-table-column
            width="80"
            align="right"
            label="状态">
            <template slot-scope="scope">
              <el-button v-if="scope.row.orderStatus == '50'&& scope.row.complaintStatus != '1'&& scope.row.complaintStatus != '2'" style="color:#59ba73;font-size:14px;" @click="orderClick(scope.row)" type="text" size="small">
                <span v-if="scope.row.payStatus == 51 && scope.row.dischargeStatus == 53">待付款</span>
                <span v-if="scope.row.payStatus == 52 && scope.row.dischargeStatus == 53">待放币</span>
                <span v-if="scope.row.payStatus == 52 && scope.row.dischargeStatus == 54">已放币 </span>
              </el-button>
              <el-button v-if="scope.row.orderStatus == '55'&& scope.row.complaintStatus != '1'&& scope.row.complaintStatus != '2'" style="color:#999999;font-size:14px;" @click="orderClick(scope.row)" type="text" size="small">已成交</el-button>
              <el-button v-if="scope.row.orderStatus == '56'&& scope.row.complaintStatus != '1'&& scope.row.complaintStatus != '2'" style="color:#999999;font-size:14px;" @click="orderClick(scope.row)" type="text" size="small">已取消</el-button>
              <el-button v-if="scope.row.complaintStatus == '1'" style="color:#db4d2b;font-size:14px;" @click="orderClick(scope.row)" type="text" size="small">申诉中</el-button>
              <el-button v-if="scope.row.complaintStatus == '2'" style="color:#db4d2b;font-size:14px;" @click="orderClick(scope.row)" type="text" size="small">已处理</el-button>
            </template>
          </el-table-column>
      </el-table>
    </div>
    <div class="goPage">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageRemark.orderPageNo "
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pageRemark.orderPageSize "
        layout="total, prev, pager, next"
        :total="pageTotal">
      </el-pagination>
    </div>
      <!-- 点击取消弹窗 -->
     <el-dialog
      title="温馨提示"
      :visible.sync="isCancelPublishOrder"
      width="450px"
      :before-close="handleClose">
      <div class="cancelOrderContainer">
        <div class="cancelTitle">
          <span style="color:#2e2e2e;font-size:18px;">是否确认取消此广告？</span>
        </div>
        <div style="height:50px;">
          <el-button @click="temporarilyNot" style="width:190px;height:48px;float:left;background:#ebebec;color:white;">暂不</el-button>
          <el-button @click="cancelTrade" style="width:190px;height:48px;float:right;background:#db4d2b;color:white;">取消广告</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
  </section>
</template>

<script>
import { api } from '@/static/otcApi'
import { dateFtt, availableFilterTwo } from '@/static/common.js'

export default {
  data () {
    return {
      saveCancelInfo: '', // 点击取消保存信息
      isCancelPublishOrder:false,
      pageRemark: {
        orderPageNo: 1,
        orderPageSize : 10,
      },
      pageTotal: 0,
      getBackData: [], // 保存后台返回的数据
      activeName: 'first',
      mainTbaleList:[], // 主信息列表
      tableData:[
        {id:'15',orderType:'已成交',price:'45654',pubNumber:'221',dealNumber: '4534',limitPrice: '45',pubTime: '2018-6-19',status:'121'}
      ],
      remarkList: [
        { orderNum: 'A1321321212', tradeType: '2', tradeNumber: '1000.00', totalPrice: '60320.00', singlePrice: '6.32', tradeTime: '2018/5/12 16:30', tradeObject: '某某币种'},
        { orderNum: 'A1513354132', tradeType: '1', tradeNumber: '1000.00', totalPrice: '60320.00', singlePrice: '6.32', tradeTime: '2018/5/12 16:30', tradeObject: '某某币种'},
        { orderNum: 'A1513354132', tradeType: '2', tradeNumber: '1000.00', totalPrice: '60320.00', singlePrice: '6.32', tradeTime: '2018/5/12 16:30', tradeObject: '某某币种'},
        { orderNum: 'A1513354132', tradeType: '1', tradeNumber: '1000.00', totalPrice: '60320.00', singlePrice: '6.32', tradeTime: '2018/5/12 16:30', tradeObject: '某某币种'},
        { orderNum: 'A1513354132', tradeType: '1', tradeNumber: '1000.00', totalPrice: '60320.00', singlePrice: '6.32', tradeTime: '2018/5/12 16:30', tradeObject: '某某币种'}
      ]
    };
  },

  components: {},

  computed: {},
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
      if(str && str.length <= 6){
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
  mounted(){
    this.getBackPort()
  },

  methods: {
    totalPriceParse(row,column){
      if(row.total){
         return availableFilterTwo(row.total)
      }
    },
    pricePriceParse(row,column){
      if(row.price){
         return availableFilterTwo(row.price)
      }
    },
    orderClick(data){
      // console.log(data)
      this.$router.push({
        path: '/myTransactionInfo',
        query: {
          id: data.id,
          type: data.type,
          orderStatus: data.orderStatus,
          complaintStatus: data.complaintStatus,
          payStatus: data.payStatus,
          dischargeStatus: data.dischargeStatus
        }
      })
    },
    // 取消交易接口
    cancelTransactionPort(){
      var _this = this
      var obj = {}
      obj.transactionId  = _this.saveCancelInfo.id
      api.cancelTransaction(obj)
      .then(res => {
        if(res.statusCode == 200) {
          _this.$message.success('取消成功')
          _this.isCancelPublishOrder = false
          _this.getBackPort()
        }
      })
      .catch((err) => {
          _this.$message.warning(err.msg)
      })
    },
    // 点击关闭事件
    handleClose(){
      this.isCancelPublishOrder = false
    },
    cancelOrder(data){
      this.saveCancelInfo = data
      this.isCancelPublishOrder = true
    },
    temporarilyNot(){
      this.isCancelPublishOrder = false
    },
    cancelTrade(){
      this.cancelTransactionPort()
    },
    // 下边是翻页事件
    handleSizeChange(val){
      this.pageRemark.orderPageSize = val
      this.getBackPort()
    },
    handleCurrentChange(val){
      this.pageRemark.orderPageNo = val
      this.getBackPort()
    },
    // 成交记录时间格式化
    timeFormatterRemark(row, column){
      if(row.createTime){
        return dateFtt(Number(row.createTime))
      }
    },
    // 我的 发布时间格式化
    pubFormatter(row, column){
      if(row.pubTime){
        return dateFtt(Number(row.pubTime))
      }
    },
    getBackPort(){
      var transactionId = this.$route.query.id
      api.getTransactionById(transactionId,this.pageRemark)
      .then(res => {
        if(res.statusCode == 200) {
          this.mainTbaleList = []
          var obj = {}
          obj.id = res.data.id
          obj.type = res.data.type
          obj.price = res.data.price
          obj.pubNumber = res.data.amount // 总量
          obj.dealNumber = res.data.processingAmount // 成交数量
          obj.frozenAmount = res.data.inTransitAmount  // 冻结数量
          obj.limitPrice = res.data.quotaMin + '-' + res.data.quotaMax
          obj.pubTime = res.data.createTime
          obj.currency = res.data.currency
          obj.quotaMin = res.data.quotaMin
          obj.quotaMax = res.data.quotaMax
          obj.transactionNo = res.data.transactionNo
          if(res.data.status == 2 && res.data.processingAmount != 0 && Number(res.data.processingAmount) < Number(res.data.amount)){
            obj.status = '4'
          } else {
            obj.status = res.data.status
          }
          this.mainTbaleList.push(obj)
          this.remarkList = res.data.orders.orderList
          this.pageTotal = Number(res.data.orders.pagination.totalRecord)
        }else {
          this.$message.warning(res.msg)
        }
      })
      .catch(() => {

      })
    }
  }
}

</script>
<style lang='scss' scoped>
.dealRemarkContainer{
  height: 1197px;
  width: 1200px;
  margin: 0 auto;
  .cancelOrderContainer{
    .cancelTitle{
      height: 125px;
      // background: red;
      border-bottom:1px solid #ebebec;
      margin-bottom:45px;
    }
  }
  .goPage{
    margin-top: 70px;
    text-align: center;
  }
  .dealRemarkContainer_title{
    height: 190px;
    line-height: 190px;
    color: #252524;
    font-size:30px;
  }
}
</style>
