<template>
  <section class="chat">
    <div class="chatheader">
      <div class="seller_img">
        <!--  -->
        <p v-if="from == 'order'">
          <span>O</span>
        </p>
        <p v-else>
          <span>O</span>
        </p>
      </div>
      <div class="seller_info">
        <p class="seller_name" v-if="from == 'order'">
          {{orderInfo.merchant.merchantName}}
        </p>
        <p class="seller_name" v-else>{{orderInfo.userName}}</p>
        <p class="seller_list" v-if="from == 'order'">总成单：{{orderInfo.merchant.turnover}}</p>
        <!-- TODO 需要查别人的成单数量 -->
        <p class="seller_list" v-else>总成单：{{orderInfo.merchant.turnover}}</p>
      </div>
    </div>
    <div class="chatlist" ref="chatList_box">
      <!-- 这里有 系统信息 买家 卖家三种 类型的消息 -->
      <div class="box" ref="chatList">
        <div class="content" v-for="(item, index) in chatList" :key="index" v-show="userId != ''">
          <div class="system_msg" v-if="item.chatType == 0">
            <p class="tip_time">{{item.createTime | timeFilter}}</p>
            <p class="tip_info">{{item.chatContent}}</p>
          </div>
          <div v-else>
            <div class="seller_msg" v-if="item.sendUid != userId">
              <div class="user_img">
                <span v-if="item.receiveName">{{item.receiveName[0]}}</span>
                <span v-else>O</span>
              </div>
              <div class="user_msg">
                <span>{{item.chatContent}}</span>
              </div>
            </div>
            <div class="buyer_msg" v-if="item.sendUid == userId">
              <div class="user_msg">
                <span>{{item.chatContent}}</span>
              </div>
              <div class="user_img">我</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="chatfoot">
      <div>
        <input class="sendMsg" v-model="msg" @keyup.enter="sendChatMsg" :placeholder="$t('orderDetail.chatPlaceholder')" type="text">
      </div>
    </div>
  </section>
</template>
<script>
import { api } from '@/static/otcApi'
import { dateFtt } from '@/static/common'
export default {
  props: {
    from: {
      type: String,
      default: 'order'
    },
    // 控制聊天框是否显示
    isShow: {
      type: Boolean,
      default: true
    },
    orderId: {
      type: String,
      default: ''
    },
    // 包含当前订单的信息 读取聊天记录和发送聊天信息都需要订单ID *
    orderInfo: {
      type: Object,
    },
    // 卖家信息 头像名称 *
    sellerInfo: {
      type: Object,
    },
    // 买家信息 头像名称 *
    buyerInfo: {
      type: Object,
    },
    // 系统发送的消息  *
    sysInfo: {
      type: Object,
    },
    // 用于判断是否新增了系统消息，如果发生变化，则从sysInfo里面读取数据，添加到聊天框中 *
    sysNum: {
      type: Number,
      default: 0
    }
  },
  filters: {
    timeFilter(val){
      return dateFtt(val)
    }
  },
  data () {
    return {
      chatList: [],
      userName: this.$store.getters.user.accountName,
      userId: this.$store.getters.getUserId ? this.$store.getters.getUserId : JSON.parse(localStorage.getItem('__uinfo')).userId,
      msg: '',
      lastMsgTime: 0,  // 最后一条消息的ID
      searchChatRecordTimer: null,
    }
  },
  created () {
  },
  watch: {
    // 监听是否有系统消息
  },
  mounted () {
    // 读取聊天记录
    this.getChatRecord()
    this.serchChatRecordEveryFiveSecods()
  },
  methods: {
    // 0.5秒查询一次聊天未读信息
    serchChatRecordEveryFiveSecods(){
      this.searchChatRecordTimer = null
      const searchChatRecordTimer = setInterval(() => {
        this.getNoReadMsg()
      },1000)
      this.$once('hook:beforeDestroy', () => {
          clearInterval(searchChatRecordTimer);
      })
    },
    getChatRecord() {
      // 读取聊天记录
      let data = {}
      // console.log(this.orderId)
      data.orderId = this.orderId
      data.userId = JSON.parse(localStorage.getItem('__uinfo')).userId
      api.getAllChatRecordByOrderId(data).then(res => {
       if(res.data){
         if(res.data.length){
           this.chatList = res.data

           this.lastMsgTime = this.chatList[this.chatList.length -1].createTime
           let _this = this
           _this.$nextTick(()=> {
             setTimeout(() => {
             _this.$refs.chatList_box.scrollTo(_this.$refs.chatList.offsetLeft,  _this.$refs.chatList.offsetHeight)
             },500)
           })
         }
       }
      })
    },
    sendChatMsg () {
      // console.log(this.msg)
      // 发送消息
      if(this.msg == '') return
      let data = {}
      data.chatContent = this.msg
      data.orderId = this.orderId
      data.sendUid = JSON.parse(localStorage.getItem('__uinfo')).userId
      data.chatType = '1'
      this.msg = ''
      api.addChat(data).then(res => {
        // console.log(this.$refs.chatList.offsetHeight)
        if(res.statusCode == 200){
          // this.getNoReadMsg()

        }
      })

    },
    getNoReadMsg () {
      // 读取未读消息
      this.searchChatRecordTimer = null
      let data = {}
      data.orderId = this.orderId
      data.userId = JSON.parse(localStorage.getItem('__uinfo')).userId
      if(this.chatList.length){
        this.lastMsgTime = this.chatList[this.chatList.length -1].createTime
      }
      data.createTime = this.lastMsgTime
      api.getUreadChatRecord(data).then(res => {
        if(res.statusCode == 200){
          if(res.data){
            if(res.data.length){
              let newData = res.data
              let ifSysHave = false
              newData.forEach(item => {
                this.chatList.push(item)
                if(item.chatType == '0'){
                  ifSysHave = true
                }
              })
              let _this = this
              if(ifSysHave){
                _this.$emit('orderInfoChange')
              }
              this.$nextTick(()=> {
                _this.$refs.chatList_box.scrollTo(_this.$refs.chatList.offsetLeft,  _this.$refs.chatList.offsetHeight - 60)
              })
            }

          }
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.chat{
  width: 350px;
  height: 560px;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 1px #fff;
  position: relative;
}
.chatheader{
  width: 100%;
  background: #fff;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  border-bottom: 2px solid #ddd;
  margin-bottom: 20px;
  .seller_img{
    width: 40px;
    height: 40px;
    font-size: 20px;
    line-height: 40px;
    color: #fff;
    font-weight: bold;
    text-align: center;
    background: #008000;
    border-radius: 40px;
    margin: 30px 30px 20px 30px;
  }
  .seller_info{
    flex: 1;
    align-items: center;
    .seller_name{
      font-size: 20px;
      line-height: 34px;
      font-weight: bold;
      color: #333;
    }
    .seller_list{
      font-size: 14px;
      line-height: 20px;
      color: #999;
    }
  }
}
.chatlist{
  width: 100%;
  height: 100%;
  padding-top: 110px;
  padding-bottom: 50px;
  box-sizing: border-box;
  overflow: scroll;
  @-moz-document url-prefix() {
    .box{
      padding-bottom: 50px;
    }
  }
  .content {
    .system_msg{
      padding: 20px 30px;
    }
    .system_msg{
      text-align: center;
      .tip_time{
        font-size: 12px;
        color: #999;
        line-height: 18px;

      }
      .tip_info{
        font-size: 14px;
        color: #666;
        line-height: 20px;
      }
    }
    .seller_msg, .buyer_msg{
      display: flex;
      align-items: center;
      margin: 0 30px;
      margin-bottom: 20px;
      .user_img{
        width: 40px;
        height: 40px;
        background: #008000;
        border-radius: 40px;
        margin-right: 15px;
      }
      .user_msg{
        flex: 1;
        span{
          display: inline-block;
          padding: 10px 20px;
          background: #ccc;
          border-radius: 6px;
          text-align: left;
          max-width: 230px;
          word-break: break-word;
        }
      }
    }
    .seller_msg{
      text-align: left;
      .user_img {
        font-size: 20px;
        line-height: 40px;
        font-weight: bold;
        text-align: center;
        color: #fff;
      }

    }
    .buyer_msg{
      .user_img{
        margin-right: 0;
        margin-left: 15px;
        font-size: 20px;
        line-height: 40px;
        font-weight: bold;
        text-align: center;
        color: #fff;
      }
      text-align: right;
    }

  }
}
.chatfoot{
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  background: #fff;
  div{
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border-top: 2px solid #ccc;
    .sendMsg{
      outline: none;
      -webkit-appearance: none;
      border-radius: 0;
      border: none;
      background: none;
      height: 50px;
      line-height: 50px;
      width: 100%;
      padding: 0 10px;
      font-size: 16px;
      color: #333;
    }
  }

}
</style>
