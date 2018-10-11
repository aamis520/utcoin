<!--  -->
<template>
  <div class="setNickWrapper">
    <div class="setNickWrapper_content">
      <p>请先设置一个昵称</p>
    </div>
    <div class="setNickWrapper_input">
      <el-input style="width:363px;" v-model="form.name" placeholder="请输入昵称"></el-input>
    </div>
    <div class="setNickWrapper_btn">
        <el-button @click="saveNickNameBtn" :class="isChangeBg ? 'buldBg' : 'grayBg' " style="width:128px;border:none;" type="primary">确定</el-button>
    </div>
  </div>
</template>

<script>
import { api } from '@/static/otcApi'
export default {
  data () {
    return {
      form: {
        name: ''
      },
      isChangeBg: false
    };
  },
  watch:{
    'form.name': function () {
      if (this.form.name){
        this.isChangeBg = true
      } else {
        this.isChangeBg = false
      }
    }
  },
  components: {},

  computed: {},

  mounted() {},

  methods: {
    // 点击确定事件
    saveNickNameBtn(){
      if(this.form.name) {
        localStorage.setItem('c2cnickname', this.form.name)
        api.addMerchant({userId: JSON.parse(localStorage.getItem('__uinfo')).userId,merchantName: this.form.name}).then(res => {
          // console.log(res)
          if(res.statusCode == 200 ){
            this.$message('设置昵称成功')
            this.$router.push({
              path:'/Home'
            })

          }
        })
      } else {
        this.$message('请输入昵称')
      }
    }
  }
}

</script>
<style lang='scss' scoped>
  .setNickWrapper{
    height: 1097px;
    width: 1200px;
    margin: 0 auto;
    .setNickWrapper_content{
      margin-top: 70px;
      font-size: 30px;
      font-weight: bold;
      color: #252524;
    }
    .setNickWrapper_input{
      margin-top: 56px;
    }
    .setNickWrapper_btn{
      margin-top: 80px;
      .buldBg{
        background:#3068ae;
      }
      .grayBg{
        background:#dddde1;
      }
    }
  }
</style>
