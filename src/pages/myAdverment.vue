<!--  -->
<template>
  <section class="otcHome ctocDialod">
  <div class="orderContainer">
    <div class="orderContent">
      <p class="title">
        <span>{{$t('advertisement.myAdvertise')}}</span>
      </p>
      <div class="orderListbar">
        <el-table
          :data="getPublishData"
          style="width: 100%">
          <el-table-column
            prop="transactionNo"
            width="180"
            class-name="orderNumber_bg"
            :label="$t('advertisement.advertiseNo')">
          </el-table-column>
          <el-table-column
            :label="$t('advertisement.type')">
            <template slot-scope="scope">
              <el-button v-if="scope.row.type == '1'" style="color:#db4d2b;font-size:14px;" @click="orderType(scope.row)" type="text" size="small">卖出{{scope.row.currency}}</el-button>
              <el-button v-if="scope.row.type == '0'" style="color:#59ba73;font-size:14px;" type="text" size="small">买入{{scope.row.currency}}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="amount"
            align="center"
            label="总量">
          </el-table-column>
          <el-table-column
            prop="processingAmount"
            align="center"
            :label="$t('advertisement.amount')">
          </el-table-column>
          <el-table-column
            prop="inTransitAmount"
            align="center"
            label="冻结数量">
          </el-table-column>
          <el-table-column
            prop="total"
            align="center"
            width="120"
            :formatter="totalFormatter"
            :label="$t('advertisement.total') + '(CNY）'">
          </el-table-column>
          <el-table-column
            prop="price"
            align="center"
            :formatter="priceParse"
            width="140"
            :label="$t('advertisement.price') + '(CNY）'">
          </el-table-column>
          <el-table-column
            prop="createTime"
            width="150"
            align="center"
            :formatter = "timeFormatterRemark"
            :label="$t('advertisement.time')">
          </el-table-column>
          <el-table-column
            width="120"
            align="center"
            :label="$t('advertisement.status')">
              <template slot-scope="scope">
                <el-button v-if="scope.row.status == '0'" style="color:#59ba73;font-size:14px;" type="text" size="small">进行中</el-button>
                <el-button v-if="scope.row.status == '1'" style="color:#db4d2b;font-size:14px;" type="text" size="small">已完成</el-button>
                <el-button v-if="scope.row.status == '2'" style="color:#999999;font-size:14px;" type="text" size="small">已取消</el-button>
                <el-button v-if="scope.row.status == '4'" style="color:#999999;font-size:14px;" type="text" size="small">部分成交</el-button>
              </template>
          </el-table-column>
            <el-table-column
            :label="$t('advertisement.copration')"
            align="center"
            width="200">
              <template slot-scope="scope">
                <!-- 只有进行中的可以取消 -->
                <el-button  v-if="scope.row.status == '0'" @click="cancelOrder(scope.row)" type="danger" size="small">取消</el-button>
                <el-button class="hoverBtn" @click="goDealRemark(scope.row)" style="color:#3068ae;font-size:12px;" size="small" plain>{{$t('advertisement.orderRecord')}}</el-button>
              </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="goPage">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNumber"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="pageSize"
          layout="total, prev, pager, next"
          :total="myTotalPage">
        </el-pagination>
      </div>

    </div>
     <!-- 点击取消弹窗 -->
     <el-dialog
      title="温馨提示"
      :visible.sync="isCancelPublishOrder"
      width="450px"
      :before-close="handleClose">
      <div class="cancelOrderContainer">
        <div class="cancelTitle">
          <span style="color:#2e2e2e;font-size:18px;">是否确认取消此广告?</span>
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
      myTotalPage: 0, // 总页数
      getPublishData: [], // 我发布的广告列表数据
      pageNumber: 1,
      pageSize: 5,
      isCancelPublishOrder: false, // 取消订单提示框
    };
  },

  components: {},

  computed: {},

  mounted(){
    this.getPublishPort()
  },

  methods: {
    priceParse(row,column){
      if(row.price) {
        return availableFilterTwo(row.price)
      }
    },
    totalFormatter(row, column){
      let val = row.total
      let arr = String(val).split('.')
      let str = ''
      if(arr.length > 1){
        str  = arr[1].slice(0,2)
      }
      // console.log(str)
      if(str){
        return arr[0] + '.' + str
      }else{
        return `${arr[0]}.00`
      }
    },
    timeFormatterRemark(row, column){
      if(row.createTime){
        return dateFtt(Number(row.createTime))
      }
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
          _this.getPublishPort()
        }else {
          this.$message.warning(res.msg)
        }
      })
      .catch(() => {
          // _this.$message.warning('取消失败')
      })
    },
    cancelOrder(data){
      this.saveCancelInfo = data
      this.isCancelPublishOrder = true
    },
    goOrderStatus(){
      this.$router.push({
        path: '/transactionInfo'
      })
    },
    // 我的订单点击进入详情
    myOrderGoShopDetail(data){
      this.$router.push({
        path: '/shopInfo',
        query:{
          id:data.merchantId
        }
      })
    },
    // 翻页事件
    handleSizeChange(val){
      this.pageSize = val
      this.getPublishPort()
    },
    handleCurrentChange(val){
      this.pageNumber = val
      this.getPublishPort()
    },
    // 我发布的广告
    getPublishPort(){
      var merchantId = this.$store.getters.getterMechantId
      var  type = 'all'
      var obj = {}
      obj.pageNo = this.pageNumber
      obj.pageSize = this.pageSize
      api.getTransactionByMerchantId(merchantId,type,obj)
      .then(res => {
        if(res.statusCode == 200){
          res.data.content.forEach(ele => {
            if(ele.status == 2 && ele.processingAmount != 0 && Number(ele.processingAmount) < Number(ele.amount)){
            // if(ele.status == 2 && ele.processingAmount != 0 && ele.inTransitAmount != 0){
              ele.status = '4'
            }
            ele.total = Number(ele.amount)*Number(ele.price)
          });
          this.getPublishData = res.data.content
          this.myTotalPage = Number(res.data.totalElements)
        }else {
          this.$message.warning(res.msg)
        }
      })
      .catch(res => {

      })
    },
    goShopDetail(){
      this.$router.push({
        path: '/shopInfo'
      })
    },
    temporarilyNot(){
      this.isCancelPublishOrder = false
    },
    cancelTrade(){
      this.cancelTransactionPort()
    },
    goDealRemark(data){
      // console.log(data)
      this.$router.push({
        path: '/dealRemark',
        query: {
          id: data.id
        }
      })
    },
    // 点击关闭事件
    handleClose(){
      this.isCancelPublishOrder = false
    },
    // 实时交易单点击事件
    goTradeBtn(){
      console.log('去交易')
    },
    orderClick(data){
      this.isCancelPublishOrder = true
      // console.log(data)
    }
  }
}

</script>
<style lang='scss' scoped>
  .orderContainer{
    width: 1300px;
    margin: 0 auto;
    height: auto;
    // background: red;
    .cancelOrderContainer{
      .cancelTitle{
        height: 125px;
        // background: red;
        border-bottom:1px solid #ebebec;
        margin-bottom:45px;
      }
    }
    .orderContent{
      min-height: 600px;
      .goPage{
        margin-top: 68px;
        margin-bottom:50px;
        text-align: center;
      }
      .title{
        color:#252524;
        font-size:30px;
        line-height: 185px;
        height:185px;
      }
      // .orderFormTable{
      //   height: 320px;
      // }
    }
  }
</style>
