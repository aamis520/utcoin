<template>
  <div class="login_div">
    <div class="login_div_top">{{$t('Login')}}</div>
      <el-form>
    <div class="login_div_user">


      <el-tooltip class="item" effect="red" manual :value="isEmailErr" :content="err.errMsg||''" placement="right">
        <el-input class="username_input" type="text" @focus="clearEmailToolTip" v-model="email"
                  placeholder="请输入手机号码"></el-input>
      </el-tooltip>
    </div>
    <div class="login_div_password">
      <el-tooltip class="item" effect="red" manual :value="isPwdErr" :content="err.errMsg||''" placement="right">
        <el-input class="pwd_input" @focus="clearPwdToolTip" type="password" v-model="pwd" :placeholder="$t('Password')"></el-input>
      </el-tooltip>
    </div>
    <div class="login_div_other">
      <!-- <div class="login_div_other_left"><a href="javascript:void(0);"> </a><span>记住密码</span></div> -->
      <input type="hidden" id="login_div_other_val" value="2">
      <a href="javascript:void(0);" @click="forgetPwd" class="login_div_other_right">{{$t('Forgot Password')}}？</a>
    </div>
    <div class="sliderbox">
      <slider @slidercomplete="getSliderStatus"></slider>
	  <!-- 请进行滑块认证 -->
      <p v-if="!sliderStatus && submitClicked" class="findpassword_error_1">{{$t('slider')}}</p>
    </div>

    <div class="login_btn" v-loading="LoginLoading" @click="login">{{$t('Login')}}</div>
    <div class="login_register_div"><a href="javascript:void(0);" @click="goRegist">{{$t('Sign')}}</a>?</div>
    </el-form>
  </div>
</template>

<script>
	import Slider from '@/components/Slider'
	import { Validate } from '@/static/common'
	import { assertReturnStatement } from 'babel-types';
	import { login } from '@/static/authApi'
	import { api } from '../../static/otcApi'
	import { getToken, setToken, removeToken } from '@/utils/auth'
	export default {
		name: 'Login',
		data() {
			return {
				submitClicked: false,
				sliderStatus: false,
				isEmailErr: false,
				isPwdErr: false,
				email: '',
				pwd: '',
        err: {},
        LoginLoading: false
			}
		},
		components: {
			Slider: Slider
    },
    created(){
      let query = this.$router.currentRoute.query
      if(query){
        if(query.type == 1000){
          this.email = query.email
        }else if(query.type == 2011){
          console.log(query)
          this.email = query.email
          // 账号未激活 跳转至重新发送验证码页面 同时发送邮件验证请求
          // api.sendEmailAgain({ email: query.email }).then(res => {
          //   this.$message({
          //     // '邮件发送成功'
          //     message: this.$t("messSent"),
          //     iconClass: "successMessage",
          //     duration: 1000
          //   });
          //   this.$router.push({
          //     path: '/home'
          //   })
          // });
        }
      }
    },
		methods: {
			login() {
        // 对滑块进行判断
        if(!this.sliderStatus){
          this.submitClicked = true
          return
        }
				var _this = this
				var params = {
					mobile: _this.email,
          password: _this.pwd,
          nationalNbr: '+86'
				}
        if(localStorage.getItem('token')){
          localStorage.removeItem('token')
        }
        // this.LoginLoading = true
        let userId = ''
				login(params).then(res => {
          console.log(res)
          if(res.statusCode == 200){
            if(res.data.userId){
              userId = res.data.userId
              localStorage.setItem('token',res.data.token)
              this.$store.dispatch('setUserId', userId) // 存userId在vuex
              this.$store.dispatch('set_token', res.data.token) // 存token在vuex-- authToken
              this.$store.dispatch('userLogin', res.data) // 101保存用户信息
              this.$store.dispatch('changeUserStatus',res.data.userStatus)
              if(res.data.paymentpsw){
                this.$store.dispatch('completeSettedPincode',1)
              }else{
                this.$store.dispatch('completeSettedPincode',0)
              }
              _this.getCtwoCInfo(userId)
              this.$router.push('/home')
            }
          }else{
            this.LoginLoading = false
            this.$message({
              message: res.msg,
              showClose: true,
              iconClass: "errorMessage",
              duration: 500
            })
          }

				}).catch(err => {
          this.LoginLoading = false
            this.$message({
              message: err.msg,
              showClose: true,
              iconClass: "errorMessage",
              duration: 500
            })
        })

      },
      // 获取c2c userinfo信息--获取商家信息
      getCtwoCInfo(data){
        var _this = this
        // let userId = this.$store.getters.getUserId
        api.getMerchantInfo(data).then(res => {
          if(res.statusCode == 200){
            if(res.data){
              localStorage.removeItem('userCToC')
              localStorage.setItem('userCToC',JSON.stringify(res.data))
            }
          }
        })
      },
			getSliderStatus(status) {
				this.sliderStatus = status
			},
			clearEmailToolTip() {
				if(this.isEmailErr) {
					this.isEmailErr = false
				}
			},
			clearPwdToolTip() {
				if(this.isPwdErr) {
					this.isPwdErr = false
				}
			},
			goRegist() {
				this.$router.push({
          name: 'regist',
          path: '/user/regist'
				})
			},
			forgetPwd() {
				this.$router.push({
					name: 'forgetpassword',
					path: '/user/forgetpassword',
  				params: {
						isforget: 1
					}
				})
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
	.login_div {
		width: 390px;
		height: 475px;
		margin-top: 135px;
		background: white;
		margin-left: auto;
		margin-right: auto;
	}

	.login_div_top {
		width: 100%;
		height: 64px;
		line-height: 64px;
		color: white;
		font-size: 24px;
		background: #202832
	}

	.login_div_user,
	.login_div_password {
		margin-top: 15px;
		width: 310px;
		height: 60px;
		background: url('~@/assets/img/phone.png') no-repeat left;
		border-bottom: 1px solid #efeff0;
		padding-left: 30px;
		position: relative;
		margin-left: auto;
		margin-right: auto;
	}
  .login_div_user{
    margin-top: 25px;
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
		width: 310px;
		height: 20px;
		margin-top: 10px;
		margin-left: auto;
		margin-right: auto;
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
		width: 110px;
		height: 20px;
		text-align: right;
		font-size: 12px;
		float: right;
		color: #8f94fb
	}

	.sliderbox {
		position: relative;
		margin-top: 35px;
		width: 312px;
		height: 40px;
		line-height: 40px;
		font-size: 14px;
		margin-left: auto;
		margin-right: auto;
	}

	.login_btn {
		width: 310px;
		height: 50px;
		line-height: 50px;
		color: white;
		font-size: 18px;
		margin-top: 33px;
		background: #4c54f9;
		margin-left: auto;
		margin-right: auto;
		cursor: pointer;
	}

	.login_btn:hover {
		opacity: 0.9;
	}

	.login_btn:active {
		background: #444be0;
	}

	.login_register_div {
		width: 310px;
		font-size: 14px;
		margin-top: 23px;
		color: #8a8a8a;
		margin-left: auto;
		margin-right: auto;
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
		color: #fc3759;
		font-size: 12px;
		font-weight: 600;
	}
</style>
