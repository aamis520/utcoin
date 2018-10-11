<template>
  <div class="login_div"
       v-loading="isRegistSuccess"
       element-loading-text="Loading..."
       element-loading-background="rgba(0, 0, 0, 0.3)">
    <div class="login_div_top">{{$t('Sign Up')}}</div>
    <!-- TODO 验证码 -->
    <div class="login_div_phone" v-show="loginType == 'phone'">
      <el-tooltip class="item" effect="dark" :value="isPhoneErr" manual :content="err.errorMsg || ''" placement="right">
        <el-input style="width:300px;" v-model="phone" placeholder="请输入手机号" type="number" class="phone_input">
        </el-input>
      </el-tooltip>
    </div>
    <div class="login_yzm">
      <el-row>
        <el-col :span="18" class="login_yzm_wrap">
          <el-input v-model="yzm" minlength="4" min="0" maxlength="4" placeholder="请输入验证码" type="number" class="yzm_input">
        </el-input>
        </el-col>
        <el-col :span="6">
          <el-button class="yzm_btn" type="primary" :disabled="yzmCounting" size="small" @click="sendYzm">
            <countdown v-if="yzmCounting"
							:time="60000"
							:leadingZero="false"
              @countdownend="countIsPayEnd">
					    <template slot-scope="props" >
                <span v-if="props.seconds">{{ props.seconds }}s</span>
						    <span  v-else>{{$t('60s Resend')}}</span>
					    </template>
					</countdown>
          <span v-else>发送验证码</span>
          </el-button>
        </el-col>
      </el-row>

    </div>
    <div class="login_div_password">
      <el-tooltip class="item" effect="dark" manual :value="isPwdErr" :content="err.errMsg||''" placement="right">
        <el-input class="pwd_input" v-model="password" @focus="clearPwdToolTip" type="password"
                  :placeholder="$t('setPassword')"></el-input>
      </el-tooltip>
    </div>
    <div class="login_div_password">
      <el-tooltip class="item" effect="dark" manual :value="isPwd2Err||isPwdSameErr" :content="err.errMsg||''"
                  placement="right">
        <el-input class="pwd_input" v-model="password_t" @focus="clearPwd2ToolTip" type="password"
                  :placeholder="$t('Confirm Password')"></el-input>
      </el-tooltip>
    </div>
    <div class="sliderbox">
      <!-- <slider @slidercomplete="getSliderStatus"></slider> -->
      <p class="findpassword_error_1">{{$t('registSignUp')}}
        <!-- <span @click="goAgreement" style="color:#8f94fb;cursor:pointer;">{{$t('Terms')}}</span> -->
        <router-link target="_blank" style="color:#8f94fb;cursor:pointer;" :to="{path:'/explain/agreement'}">
          {{$t('Terms')}}
        </router-link>
      </p>
    </div>
    <div class="login_btn" :disabled="isRegistSuccess" @click="regist">{{$t('Sign Up')}}</div>
  </div>
</template>

<script>
  import Slider from '@/components/Slider'
  import {Validate, ERR} from '@/static/common'
  import {nationalityOption} from '@/static/dataConfig'
  import {nationalityOptionTwo} from '@/static/dataConfig'
  import {functionDeclaration} from 'babel-types';
  import {regist, sendActiveEmail, getVerifycode, checkverifycode} from '@/static/authApi'
  import countdown from '@xkeshi/vue-countdown'

  export default {
    name: 'Regist',
    props: {},
    data() {
      return {
        submitClicked: false,
        sliderStatus: true,
        email: '',
        password: '',
        password_t: '',
        nationality: '',
        nationalityOption: nationalityOption,
        isEmailErr: false,
        isPwdErr: false,
        isPwd2Err: false,
        isNationalityErr: false,
        isPwdSameErr: false,
        langs: {
          "zh-cn": {
            name: "简体中文",
            code: 1
          },
          "en-us": {
            name: "English",
            code: 0
          }
        },
        err: {},
        isRegistSuccess: false,
        // 新增手机号注册
        loginType: 'phone',
        phone: '',
        isPhoneErr: '',
        phonePrev: '',
        isClick: false,
        yzm: '',
        yzmCounting: false
      }
    },
    components: {
      Slider: Slider,
      countdown
    },
    created() {
      if (localStorage.getItem('lang') != "zh-cn") {
        this.nationalityOption = nationalityOptionTwo
      } else {
        this.nationalityOption = nationalityOption
      }
    },
    mounted() {

    },
    watch: {
      langType() {
        if (localStorage.getItem('lang') != "zh-cn") {
          this.nationalityOption = nationalityOptionTwo
        } else {
          this.nationalityOption = nationalityOption
        }
      }
    },
    computed: {
      langType() {
        return this.$store.getters.getLang
      }
    },
    methods: {
      countIsPayEnd(){
        this.yzmCounting = false
      },
      sendYzm(){
        if(this.phone != ""){
          let data = {}
          data.nationalNbr = '+86'
          data.mobile = this.phone
          this.yzmCounting = true
          getVerifycode(data).then(res => {
            console.log(res)
          }).catch(err => {
            this.yzmCounting = false
          })
        }else {
          this.$message.warning('请输入手机号')
        }

      },
      regist() {
        // TODO 注册类型切换 手机号合法性验证
        this.submitClicked = true;
        var self = this
        this.isEmailErr = false
        this.isPwdErr = false
        this.isPwd2Err = false
        this.isNationalityErr = false
        this.isPwdSameErr = false
        if(this.phone == ''){
          this.$message({
            iconClass: 'errorMessage',
            message: '请输入手机号',
            duration: 1000
          })
          return
        }
        if(this.yzm == ''){
          this.$message({
            iconClass: 'errorMessage',
            message: '请输入验证码',
            duration: 1000
          })
          return
        }
        if(this.password == ''){
          this.$message({
            iconClass: 'errorMessage',
            message: '请输入密码',
            duration: 1000
          })
          return
        }
        if(this.password_t == ''){
          this.$message({
            iconClass: 'errorMessage',
            message: '请再输入一次密码',
            duration: 1000
          })
          return
        }

        if(this.password_t !== this.password){
          this.$message({
            iconClass: 'errorMessage',
            message: '两次输入的密码不一致，请重新输入',
            duration: 1000
          })
          return
        }


        var params = {
          mobile: this.phone,
          password: this.password,
          confirmPassword: this.password_t,
          nationalNbr: '+86'
        }
        // 校验验证码
        let data = {}
        data.nationalNbr = '+86'
        data.mobile = this.phone
        data.identifyCode = this.yzm
        checkverifycode(data).then(res => {
          console.log(res)
          if(res.statusCode == 200){
            this.isRegistSuccess = true
            regist(params).then(res => {
              this.isRegistSuccess = false
              if(res.statusCode == 200 || res.statusCode == 1000){
                this.$message({
                  iconClass: 'successMessage',
                  message: '注册成功，稍后进行跳转',
                  duration: 1000
                })
                this.$router.push('/user/login')

              }else{
                this.$message({
                  iconClass: 'errorMessage',
                  message: res.msg,
                  duration: 1000
                })
                this.$router.push('/user/login')
              }
            }).catch(err => {
              this.isRegistSuccess = false
              this.$message({
                iconClass: 'errorMessage',
                message: err.msg,
                duration: 1000
              })
            })
          }else{
            this.$message({
							iconClass: 'errorMessage',
							message: res.msg,
							duration: 1000
						})
          }
        }).catch(err => {
          this.$message({
							iconClass: 'errorMessage',
							message: err.msg,
							duration: 1000
						})
        })


      },
      getSliderStatus(status) {
        this.sliderStatus = status
      },
      clearEmailToolTip() {
        if (this.isEmailErr) {
          this.isEmailErr = false
        }
      },
      clearPwdToolTip() {
        if (this.isPwdErr) {
          this.isPwdErr = false
        }
      },
      clearPwd2ToolTip() {
        if (this.isPwd2Err || this.isPwdSameErr) {
          this.isPwd2Err = false
          this.isPwdSameErr = false
        }
      },
      emailrepeat() {
        var data = {
          email: this.email
        }
        //        api.checkRegisterEmail(data)
        //          .then(function (res) {
        //            if (res.error_code != 1000) {
        //              this.$message(res.error_code)
        //            }
        //          }).catch(err => {
        //        })
      },
      // 国籍中英文切换
      // selectChange(){
      // 	if(this.$store.getters.getLang != "zh-cn"){
      // 		this.nationalityOption = nationalityOptionTwo
      // 	}else{
      // 		this.nationalityOption = nationalityOption
      // 	}
      // }
      goAgreement() {
        this.$router.push({
          name: "agreement",
          path: '/explain/agreement/'
        })
      }

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
  .login_div {
    width: 390px;
    overflow: hidden;
    margin-top: 135px;
    background: white;
    margin-left: auto;
    margin-right: auto;
    padding-bottom: 20px;
    .login_type {
      margin-top: 30px;
      width: 100%;
      span {
        display: inline-block;
        margin-right: 40px;
        margin-left: 40px;
        text-align: center;
        color: #666;
        border: none;
        font-size: 14px;
        cursor: pointer;
      }
      span.active {
        color: #7d7cfc;
        padding-bottom: 10px;
        border-bottom: 2px solid #7d7cfc;
      }
    }
  }

  .login_div_top {
    width: 100%;
    height: 64px;
    line-height: 64px;
    color: white;
    font-size: 24px;
    background: #202832
  }

  .login_div_nationality {
    margin-left: auto;
    margin-right: auto;
    margin-top: 25px;
    width: 340px;
    height: 58px;
    border: 1px dashed #efeff0;
    .nationality-span {
      color: #aeaeae;
      width: 60px;
      height: 58px;
      line-height: 58px;
    }
  }

  .login_div_user,
  .login_div_password {
    margin-left: auto;
    margin-right: auto;
    margin-top: 10px;
    width: 310px;
    height: 60px;
    background: url('~@/assets/img/user.png') no-repeat left;
    border-bottom: 1px solid #efeff0;
    padding-left: 30px;
    position: relative;
  }

  .login_div_user input {
    background: none;
    text-align: left;
    font-size: 14px;
    color: #363a3f;
    line-height: 60px;
    width: 270px;
    height: 60px;
    border: none;
  }

  .login_div_password {
    background: url('~@/assets/img/index9.png') no-repeat left;
  }

  .login_div_password input {
    background: none;
    text-align: left;
    font-size: 14px;
    color: #363a3f;
    line-height: 60px;
    width: 270px;
    height: 60px;
    border: none;
  }

  .login_div_other {
    margin-left: auto;
    margin-right: auto;
    width: 310px;
    height: 20px;
    margin-top: 30px;
  }
  .login_yzm{
    margin-left: auto;
    margin-right: auto;
    width: 310px;

    margin-top: 10px;
    .yzm_input{
      border-bottom:1px solid #efeff0;
    }
  }
  .login_yzm_wrap{
    padding-left: 30px;
    background: url('~@/assets/img/yzm.png') no-repeat left;
  }

  .login_div_phone {
    width: 310px;
    height: 60px;
    margin: 0 auto;
    margin-top: 15px;
    height: 60px;
    padding-left: 30px;
    background: url('~@/assets/img/phone.png') no-repeat left;
    border: none;
    border-left: none;
    .phone_input {
      margin-top: 10px;
      border-bottom: 1px solid #efeff0;
    }
    .el-select {
      border: 1px solid #efeff0;
    }
  }

  .el-input-group__prepend {
    border: none !important;
  }

  .login_div_other_left {
    width: 90px;
    height: 20px;
    font-size: 12px;
    float: left;
    color: #555555;
  }

  .login_div_other_left a {
    width: 12px;
    height: 12px;
    border: 1px solid #4e56f9;
    margin-top: 4px;
    display: block;
    float: left;
  }

  .login_div_other_left_a_click {
    background: url('~@/assets/img/index10.png') no-repeat left;
    border: none !important;
  }

  .login_div_other_left span {
    height: 20px;
    line-height: 20px;
    float: left;
    margin-left: 10px
  }

  .login_div_other_right {
    width: 80px;
    height: 20px;
    text-align: right;
    font-size: 12px;
    float: right;
    color: #8f94fb
  }

  .sliderbox {
    margin-left: auto;
    margin-right: auto;
    position: relative;
    margin-top: 25px;
    width: 312px;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
  }

  .login_btn {
    margin-left: auto;
    margin-right: auto;
    width: 310px;
    height: 50px;
    line-height: 50px;
    color: white;
    font-size: 18px;
    margin: 10px auto;
    background: #4c54f9;
    cursor: pointer;
  }

  .login_btn:hover {
    opacity: 0.9;
  }

  .login_btn:active {
    background: #444be0;
  }

  .login_register_div {
    margin-left: auto;
    margin-right: auto;
    width: 310px;
    font-size: 14px;
    margin-top: 30px;
    color: #8a8a8a;
    overflow: hidden;
  }

  .login_register_div a {
    color: #696ffa;
  }

  .login_error {
    text-align: left;
    color: white;
    font-size: 12px;
    padding: 13px 16px;
    padding-left: 25px;
    border-radius: 2px;
    position: absolute;
    min-height: 30px;
    height: auto;
    margin-left: 335px;
    background: #fc3759;
    float: left;
    line-height: 20px;
    top: 10px;
    width: 120px;
  }

  .login_error::after {
    content: "";
    width: 0px;
    height: 0px;
    border-top: 6px solid rgba(0, 0, 0, 0);
    border-right: 6px solid #fc3759;
    border-bottom: 6px solid rgba(0, 0, 0, 0);
    border-left: 6px solid rgba(0, 0, 0, 0);
    position: absolute;
    left: 0px;
    margin-left: -12px;
    top: 10px;
  }

  .login_error_1 {
    background: #fc3759 url('~@/assets/img/findpassword8.png') no-repeat 10px 20px;
  }

  //错误提示
  .findpassword_error_1 {
    text-align: center;
    color: #8a8a8a;
    font-size: 12px;
  }

  .el-select-dropdown__item {

    background-color: #232d39;
  }

  .el-select-dropdown__item:hover {
    font-weight: normal;
    background-color: rgb(53, 64, 78);
  }

  .el-select-dropdown__item.selected {
    font-weight: normal
  }
</style>
