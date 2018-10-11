<!--  -->
<template>
<section class="otcHome">
  <div class="orderContainer">
    <div class="orderContent">
      <!-- <p class="title">
        <span>实时交易单</span>
      </p>
      <div class="orderFormTable">
         <el-table
          max-height="400"
          :data="getTimeBackData"
          style="width: 100%;">
          <el-table-column
            prop="id"
            class-name="orderNumber_bg"
            label="订单号">
          </el-table-column>
          <el-table-column
            prop="transactionId"
            label="所属订单ID">
          </el-table-column>
          <el-table-column
            label="交易类型">
              <template slot-scope="scope">
                <el-button v-if="scope.row.type == '1'" style="color:#59ba73;font-size:14px;" @click="orderType(scope.row)" type="text" size="small">卖出USDT</el-button>
                <el-button v-if="scope.row.type == '0'" style="color:#db4d2b;font-size:14px;" type="text" size="small">买入USDT</el-button>
              </template>
          </el-table-column>
          <el-table-column
            prop="price"
            label="单价">
          </el-table-column>
          <el-table-column
            prop="amount"
            label="交易数量">
          </el-table-column>
          <el-table-column
            prop="total"
            label="订单总价">
          </el-table-column>
          <el-table-column
            label="交易对象">
            <template slot-scope="scope">
              <el-button style="color:#4a7bb8;" @click="goTradeBtn(scope.row)" type="text" size="small">{{scope.row.merchant.merchantName}}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button @click="goTradeBtn(scope.row)" type="success" size="small">去交易</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="goPage">
          <el-pagination
            @size-change="timeHandleSizeChange"
            @current-change="timeHandleCurrentChange"
            :current-page="timePage.pageNo"
            :page-sizes="[3, 5, 10, 15]"
            :page-size="timePage.pageSize"
            layout="total, prev, pager, next"
            :total="timeTotalPage">
          </el-pagination>
        </div>
      </div> -->
      <p class="title">
        <span>{{$t('order.myOrder')}}</span>
      </p>
      <div class="orderListbar">
        <!-- <el-tabs v-model="activeName" @tab-click="handleClick()"> -->
          <!-- <el-tab-pane style="font-size:20px;" label="我的订单" name="first"> -->
            <el-table
              :data="getBackData"
              style="width: 100%">
              <el-table-column
                class-name="orderNumber_bg"
                width="190"
                align="left"
                :label="$t('order.orderNo')">
                <template slot-scope="scope">
                  <span style="color:#4a7bb8;font-size:14px;cursor: pointer;" @click="orderClick(scope.row)" type="text" size="small">{{scope.row.orderNo}}</span>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                :label="$t('order.exchangeType')">
                <template slot-scope="scope">
                  <el-button v-if="scope.row.type == '1'" style="color:#db4d2b;font-size:14px;" @click="orderType(scope.row)" type="text" size="small">卖出{{scope.row.currency}}</el-button>
                  <el-button v-if="scope.row.type == '0'" style="color:#59ba73;font-size:14px;" type="text" size="small">买入{{scope.row.currency}}</el-button>
                </template>
              </el-table-column>
              <el-table-column
                prop="amount"
                align="center"
                :label="$t('order.exchangeAmount')">
              </el-table-column>
              <el-table-column
                prop="total"
                :formatter="totalFormatter"
                :label="$t('order.total') + '（CNY）'">
              </el-table-column>
              <el-table-column
                prop="price"
                :formatter="priceFormatter"
                :label="$t('order.price') + '（CNY）'">
              </el-table-column>
              <el-table-column
                prop="createTime"
                align="center"
                :formatter = "timeFormatterRemark"
                timeFormatterRemark
                :label="$t('order.time')">
              </el-table-column>
              <el-table-column
                prop="merchant.merchantName"
                align="center"
                class-name="orderNumber_bg"
                :label="$t('order.exchangeUser')">
              </el-table-column>
              <el-table-column
                align="center"
                :label="$t('order.status')">
                <!-- 已取消可点击 -->
                  <template slot-scope="scope">
                    <el-button v-if="scope.row.orderStatus == '50'&& scope.row.complaintStatus != '1'&& scope.row.complaintStatus != '2'" style="color:#59ba73;font-size:14px;" @click="orderClick(scope.row)" type="text" size="small">
                      <span v-if="scope.row.payStatus == 51 && scope.row.dischargeStatus == 53">待付款</span>
                      <span v-if="scope.row.payStatus == 52 && scope.row.dischargeStatus == 53">待放币</span>
                      <span v-if="scope.row.payStatus == 52 && scope.row.dischargeStatus == 54">已放币 </span>
                      <!-- payStatus:支付状态51-未支付，52：已经支付dischargeStatus:放币状态53：未放币54：已经放币 -->
                    </el-button>
                    <el-button v-if="scope.row.orderStatus == '55'" style="color:#999999;font-size:14px;" @click="orderClick(scope.row)" type="text" size="small">{{$t('order.status_2')}}</el-button>
                    <el-button v-if="scope.row.orderStatus == '56'" style="color:#999999;font-size:14px;" @click="orderClick(scope.row)" type="text" size="small">{{$t('order.status_3')}}</el-button>
                    <el-button v-if="scope.row.complaintStatus == '1'" style="color:#db4d2b;font-size:14px;" @click="orderClick(scope.row)" type="text" size="small">{{$t('order.status_4')}}</el-button>
                    <el-button v-if="scope.row.complaintStatus == '2'" style="color:#db4d2b;font-size:14px;" @click="orderClick(scope.row)" type="text" size="small">{{$t('order.status_5')}}</el-button>
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
          <span style="color:#2e2e2e;font-size:18px;">当日取消订单超过3次后您将不能再进行法币交易。</span>
        </div>
        <div style="height:50px;">
          <el-button @click="temporarilyNot" style="width:190px;height:48px;float:left;background:#ebebec;color:white;">暂不</el-button>
          <el-button @click="cancelTrade" style="width:190px;height:48px;float:right;background:#db4d2b;color:white;">取消订单</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
  </section>
</template>

<script>
import { dateFtt, availableFilterTwo } from '@/static/common.js'
import { api } from '@/static/otcApi'
export default {
  data () {
    return {
      // getTimeBackData: [], // 保存实时交易返回的信息
      myTotalPage: 0, // 总页数
      getBackData: [], // 我交易的订单的列表数据
      getPublishData: [], // 我发布的广告列表数据
      timePage: {
        pageNo: 1,
        pageSize: 3
      },
      timeTotalPage: 0,
      pageNumber: 1,
      pageSize: 5,
      isCancelPublishOrder: false, // 取消订单提示框
      activeName: 'first'
    };
  },

  components: {},

  computed: {},

  mounted(){
    this.getPayOrderPort()
    // this.getActualTime() // 获取实时交易单
  },

  methods: {
    totalFormatter(row, column){
      if(row.total){
        return availableFilterTwo(row.total)
      }
    },
    priceFormatter(row, column){
      if(row.price){
        return availableFilterTwo(row.price)
      }
    },
  // 时间格式化
    timeFormatterRemark(row, column){
      if(row.createTime){
        return dateFtt(Number(row.createTime))
      }
    },
    goOrderStatus(row){
      this.$router.push({
        path: '/transactionInfo',
        query: {
          id: row.id
        }
      })
    },
    // 我的订单点击进入详情
    myOrderGoShopDetail(data){
      // this.$router.push({
      //   path: '/shopInfo',
      //   query:{
      //     id:data.merchantId
      //   }
      // })
    },
    // 翻页事件
    handleSizeChange(val){
      this.pageSize = val
      this.getPayOrderPort()
    },
    handleCurrentChange(val){
      this.pageNumber = val
      this.getPayOrderPort()
    },
    // 获取实时交易单
    getActualTime(){
      var userId = JSON.parse(localStorage.getItem('__uinfo')).userId
      var obj = {}
      obj.pageNo  = this.timePage.pageNo
      obj.pageSize  = this.timePage.pageSize
      api.getTimeOrder(userId,obj)
      .then(res => {
        if(res.statusCode == 200) {
          this.getTimeBackData = res.data.rows
          this.timeTotalPage = Number(res.data.pagination.totalRecord)
        }else {
          this.$message.warning(res.msg)
        }
      })
      .catch(() => {

      })
    },
    // 我发布的广告
    getPublishPort(){
      var transactionId = localStorage.getItem('shopId')
      var  type = 'all'
      var obj = {}
      obj.pageNo = this.pageNumber
      obj.pageSize = this.pageSize
      api.getTransactionByMerchantId(transactionId,type,obj)
      .then(res => {
        if(res.statusCode == 200){
          res.data.content.forEach(ele => {
            if(ele.status == 0 && ele.processingAmount != 0){
              ele.status = '4'
            }
            ele.total = Number(ele.amount)*Number(ele.price)
          });
          this.getPublishData = res.data.content
        }else {
          this.$message.warning(res.msg)
        }
      })
      .catch(res => {

      })
    },
    // 我交易的订单的接口
    getPayOrderPort(){
      var obj = {}
      obj.userId = JSON.parse(localStorage.getItem('__uinfo')).userId
      obj.status = 'all'
      obj.pageNo = this.pageNumber
      obj.pageSize = this.pageSize
      api.getOrderList(obj)
      .then(res => {
        if(res.statusCode == 200){
          this.getBackData = res.data.rows
          this.myTotalPage = Number(res.data.pagination.totalRecord)
        }else {
          this.$message.warning(res.msg)
        }
      })
      .catch(() => {

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
      this.isCancelPublishOrder = false
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
      // console.log(data)
      this.$router.push({
        path: '/transactionInfo',
        query: {
          id: data.id,
          type: data.type,
          orderStatus: data.orderStatus,
          complainStatus: data.complainStatus,
          payStatus: data.payStatus,
          dischargeStatus: data.dischargeStatus
        }
      })
    }
  }
}

</script>
<style lang='scss' scoped>
  .orderContainer{
    width: 1200px;
    min-height: 600px;
    padding-bottom: 30px;
    margin: 0 auto;
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
    }
  }
</style>
