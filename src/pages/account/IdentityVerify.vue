<template>
    <div >
        <div class="real_right_title">
            <div class="title_v">{{$t('ID Verification')}}</div>
            <div class="bj_ca"></div>
        </div>

        <!-- 为认证或认证被拒绝 -->
        <div class="from real-verify" v-if="authState == 1">
            <el-form ref="idInfo"  :model="idInfo" label-width="120px">
                <h5>1.{{$t('Personal Basic Information Certification')}}</h5> <!-- 个人基本资料认证 -->
                <el-form-item :label="$t('Name') + '：'" class="base-info-line modification" style="position:relative;"> <!-- 姓名 -->

                        <el-input :placeholder="fullName" @blur="nameBlur" @focus="nameFocus" :maxlength="62" v-model="idInfo.name" clearable style="float:left;"></el-input>
                        <div class="findpassword_error" style="padding-left: 15px;z-index:2000;position:absolute;top:20px;left:459px;" v-show="regname">
                            <!-- <p class="findpassword_error_3" style="background-position:10px 6px;text-indent: 30px;">长度为6~14个字符</p>
                            <p class="findpassword_error_2">支持数字,大小写字母和标点符号</p> -->
                            <p class="findpassword_error_1">{{fullName}}</p>
                        </div>
                </el-form-item>

                <el-form-item :label="labelName"  class="base-info-line modification" style="position:relative;">

                        <el-input  :placeholder="pHolder" @blur="idBlur" @focus="idFocus" v-model="idInfo.number" clearable></el-input>
                        <div class="findpassword_error" style="padding-left: 15px;z-index:2000;position:absolute;top:20px;left:459px;" v-show="regId">
                            <!-- <p class="findpassword_error_3" style="background-position:10px 6px;text-indent: 30px;">长度为6~14个字符</p>
                            <p class="findpassword_error_2">支持数字,大小写字母和标点符号</p> -->
                            <p class="findpassword_error_1">{{pHolder}}</p>
                        </div>

                </el-form-item>
                <h5 style="height:100px;line-height:125px;">2.{{$t('Information authentication')}}</h5><!-- 信息认证 -->
                <div class="information">
                    <div class="port">
                        <ul>
                            <li>{{$t('Document A surface')}}：</li><!-- 证件A面 -->
                            <li>
                                <img v-if="userNationality != 1" src="~@/assets/img/passport_2.png" alt="">
                                <img v-if="userNationality == 1" src="~@/assets/img/id_1.png" alt="">
                            </li>
                            <li>
                                <div class="image-preview">
                                    <img v-if="idInfo.faceimage" :src="idInfo.faceimage" class="avatar preview-img">
                                    <div v-else class="preview-area">
                                        <i class="el-icon-plus avatar-uploader-icon plus-mark"></i>
                                    </div>
                                </div>
                            </li>
                            <li class="upload-wrapper">
                                <el-upload
                                :action="uploadUrl"
                                :headers= "uploadHeader"
                                :on-success="idCardUploadSuccess"
                                :on-error = "uploadError"
                                :show-file-list="false"
                                >
                                <el-button class="upload-btn" size="small" type="primary">{{$t('Upload')}}<!-- 上传 -->
                                    <i class="el-icon-upload2 el-icon--right"></i>
                                </el-button>
                                </el-upload>
                                <!-- <span>上传</span>
                                <img src="~@/assets/img/chuan.png"/> -->
                            </li>
							<!-- 上传支持jpg/png -->
                            <li class="prompt">*{{$t('Upload support jpg/png')}}</li>
                            <li style="min-width:120px;height:120px;position: relative;" v-show="!idInfo.faceimage  && submitClicked">
                                <div class="findpassword_error" style="padding-left: 10px;z-index:2000;position:absolute;top:38px;left:0;min-width:156px;" >
                                    <!-- <p class="findpassword_error_3" style="background-position:10px 6px;text-indent: 30px;">长度为6~14个字符</p>
                                    <p class="findpassword_error_2">支持数字,大小写字母和标点符号</p> -->
                                    <p class="findpassword_error_1" style="min-width:120px;">{{positive}}</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="port">
                        <ul>
							<!-- 证件B面 -->
                            <li>{{$t('Document B surface')}}：</li>
                            <li>
                                <img v-if="userNationality != 1" src="~@/assets/img/passport_1.png" alt="">
                                <img v-if="userNationality == 1" src="~@/assets/img/id_2.png" alt="">
                            </li>
                            <li>
                                <div class="image-preview">
                                    <img v-if="idInfo.backimage" :src="idInfo.backimage" class="avatar preview-img">
                                    <div v-else class="preview-area">
                                        <i class="el-icon-plus avatar-uploader-icon plus-mark"></i>
                                    </div>
                                </div>
                            </li>
                            <li class="upload-wrapper">
                                <el-upload
                                :action="uploadUrl"
                                :headers= "uploadHeader"
                                :on-success="idCardBackUploadSuccess"
                                :on-error = "uploadError"
                                :show-file-list="false"
                                >
                                <el-button class="upload-btn" size="small" type="primary">{{$t('Upload')}}
                                    <i class="el-icon-upload2 el-icon--right "></i>
                                </el-button>
                                </el-upload>
                            </li>
                            <li class="prompt">*{{$t('Upload support jpg/png')}}</li>
                            <li style="min-width:120px;height:120px;position: relative;" v-show="!idInfo.backimage && submitClicked">
                                <div class="findpassword_error" style="padding-left: 10px;z-index:2000;position:absolute;top:38px;left:0;min-width:156px;" >
                                    <!-- <p class="findpassword_error_3" style="background-position:10px 6px;text-indent: 30px;">长度为6~14个字符</p>
                                    <p class="findpassword_error_2">支持数字,大小写字母和标点符号</p> -->
                                    <p class="findpassword_error_1" style="min-width:120px;">{{back}}</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div  class="int port">
                        <ul>
						<!-- 手持证件照 -->
                            <li>{{$t('Handheld passport photo')}}：</li>
                            <li>
                                <img src="~@/assets/img/id_3.png" alt="">
                            </li>
                            <li class="addimg">
                                <div class="image-preview">
                                    <img v-if="idInfo.bodyimage" :src="idInfo.bodyimage" class="avatar preview-img">
                                    <div v-else class="preview-area">
                                        <i class="el-icon-plus avatar-uploader-icon plus-mark"></i>
                                    </div>
                                </div>
                            </li>
                            <li class="upload-wrapper">
                                <el-upload
                                :action="uploadUrl"
                                :headers= "uploadHeader"
                                :on-success="idCardBodyUploadSuccess"
                                :on-error = "uploadError"
                                :show-file-list="false"
                                >
                                <el-button class="upload-btn" size="small" type="primary">{{$t('Upload')}}
                                    <i class="el-icon-upload2 el-icon--right"></i>
                                </el-button>
                                </el-upload>
                            </li>
							<!-- 请提供一张手持证件照 -->
                            <li class="prompt">*{{$t('Please provide a passport photo')}}</li>
                            <li style="min-width:120px;height:120px;position: relative;" v-show="!idInfo.bodyimage && submitClicked">
                                <div class="findpassword_error" style="padding-left: 10px;z-index:2000;position:absolute;top:38px;left:0;min-width:156px;" >
                                    <!-- <p class="findpassword_error_3" style="background-position:10px 6px;text-indent: 30px;">长度为6~14个字符</p>
                                    <p class="findpassword_error_2">支持数字,大小写字母和标点符号</p> -->
                                    <p class="findpassword_error_1" style="min-width:120px;">{{hold}}</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <!-- 提交 -->
                <div class="subBtn"><p class="submit-btn" @click="saveUserVerify"><span class="button">{{$t('submit')}}</span></p></div>

            </el-form>
        </div>

        <!-- 完成实名认证 -->
        <div class="cpt" v-show="authState == 3">
            <div class="cpt_ok">
                <i><img src="~@/assets/img/complete.png" /></i>
                <span>{{$t('Your ID information has been verified')}}~</span>
            </div>
             <el-button class="go_to_trade" @click="goExchange">{{$t('Go to deal')}}</el-button>
        </div>

        <!-- 实名认证审核中 -->
        <div class="cpt" v-show="authState == 2">
            <div class="cpt_ok">

                <i><img src="~@/assets/img/complete.png" /></i>
				<!-- 您的资料提交成功可以去交易了 -->
                <span>资料审核中~</span>
            </div>
            <!-- <div class="go_to_trade" @click="goExchange">去交易</div> -->
            <!-- <el-button class="go_to_trade" @click="goExchange">{{$t('Go to deal')}}</el-button> -->
        </div>

		<!-- 实名认证被拒绝 -->
        <div class="cpt" v-show="authState == 11">
            <div class="cpt_ok">
                <i><img src="~@/assets/img/wrong_big.png" /></i>
				<!-- 实名认证未通过请重新进行认证 -->
                <span>账户已激活~</span>
            </div>
            <!-- <div class="go_to_trade" @click="goExchange">去交易</div> -->
			<!-- 去认证 -->
            <el-button class="go_to_trade" @click="goAuthenticate">{{$t('Authenticate')}}</el-button>
        </div>
    </div>
</template>
<script>

	import { uploadUrl, saveUserVerify } from '@/static/authApi'
import { nationalityInfo } from "@/static/dataConfig";
import { Validate } from "@/static/common";
import { isLoop } from "babel-types";
export default {
  name: "IdentitiVerify",
  props: {},
  data() {
    return {
      uploadUrl: uploadUrl(),
      uploadHeader: {
        "Authorization": this.$store.getters.getToken
      },
      userNationality: 1,
      getUserDataTimmer: null,
      regname: false,
      regId: false,
      err: {},
      submitClicked: false,
      idInfo: {
        name: "",
        number: "",
        faceimage: "",
        backimage: "",
        bodyimage: ""
      }
    };
  },
  computed: {
    pHolder() {
      //'请输入身份证号'   '请输入护照号'
      return this.userNationality == 1
        ? this.$t("Please enter identification number")// 身份证号
        : this.$t("Please enter the passport number");// 护照号
    },
    labelName() {
      //身份证号   护照号
      return this.userNationality == 1
        ? this.$t("ID number") + "："
        : this.$t("Passport number") + "：";
    },
    fullName() {
      //'请输入与身份证相符的姓名'    '请输入与护照相符的姓名'
      return this.userNationality == 1
        ? this.$t("Please enter a name that matches your ID")
        : this.$t("Please enter a name that matches your passport");
    },
    positive() {
      //'未上传身份证A面照片'
      return this.userNationality == 1
        ? this.$t("A face photo was not uploaded")
        : this.$t("A face photo was not uploaded");
    },
    back() {
      //'未上传身份证背面照片'
      return this.userNationality == 1
        ? this.$t("No B-side photos uploaded")
        : this.$t("No B-side photos uploaded");
    },
    hold() {
      //'未上传身份证手持照片'
      return this.userNationality == 1
        ? this.$t("No handheld photo uploaded")
        : this.$t("No handheld photo uploaded");
    },
    authState() {
      return this.$store.getters.getUserStatus;
    }
  },
  beforeDestroy() {
    var self = this;
    clearInterval(self.getUserDataTimmer);
  },
  created() {
    if (this.$store.getters.loggedIn) {
      this.getUserData();
      var self = this;
      this.getUserDataTimmer = setInterval(function() {
        self.getUserData();
      }, 10000);
    }
  },
  methods: {
    uploadError(err, file, fileList){
      if(err.statusCode == 1000){
        this.$store.dispatch('userLogout')
      }
    },
    goAuthenticate() {
      this.$store.state.userStatus = 1;
      clearInterval(this.getUserDataTimmer);
    },
    idCardUploadSuccess(response, file, fileList) {
      if (response.statusCode == 200) {
        this.idInfo.faceimage = response.data;
      }else if(response.statucCode == 1000){
        this.$store.dispatch('userLogout')
      } else {
        this.$message({
          message: response.error_desc,
          iconClass: "errorMessage",
          duration: 1000
        });
      }
    },
    idCardBackUploadSuccess(response, file, fileList) {
      if (response.statusCode == 200) {
        this.idInfo.backimage = response.data;
      }else if(response.statucCode == 1000){
        this.$store.dispatch('userLogout')
      } else {
        this.$message({
          message: response.error_desc,
          iconClass: "errorMessage",
          duration: 1000
        });
      }
    },
    idCardBodyUploadSuccess(response, file, fileList) {
      if (response.statusCode == 200) {
        this.idInfo.bodyimage = response.data;
      }else if(response.statucCode == 1000){
        this.$store.dispatch('userLogout')
      } else {
        this.$message({
          message: response.error_desc,
          iconClass: "errorMessage",
          duration: 1000
        });
      }
    },
    saveUserVerify() {
      if(!this.idInfo.name){
        this.$message({
          iconClass:'errorMessage',
          message: this.fullName,
          duration:1000
        })
        return
      }
      if(!this.idInfo.number){
        this.$message({
          iconClass:'errorMessage',
          message: this.pHolder,
          duration:1000
        })
        return
      }
      if( this.userNationality == 1 && this.idInfo.number.length !== 18){
        this.$message({
          iconClass:'errorMessage',
          message: this.pHolder,
          duration:1000
        })
        return
      }
      this.submitClicked = true;
      var self = this;
      self.err = Validate.idVerify(
        self.idInfo.name,
        self.idInfo.number,
        self.idInfo.faceimage,
        self.idInfo.backimage,
        self.idInfo.bodyimage
      );

      if (self.err.errCode !== 1000) {
        this.$message({
          message: response.error_desc,
          iconClass: "errorMessage",
          duration: 1000
        });
        return;
      }

      var data = {
        "backimage": self.idInfo.backimage,
        "bodyimage": self.idInfo.bodyimage,
        "cardNo": self.idInfo.number,
        "faceimage": self.idInfo.faceimage,
        "name": self.idInfo.name,
        "type": "1",
        "userId": this.$store.getters.getUserId
        }
      saveUserVerify(data)
        .then(res => {
          if (res.statusCode == 200) {
            // store修改为提交中
            this.$store.dispatch("changeUserStatus", 2);
            this.getUserDataTimmer = setInterval(function() {
              self.getUserData();
            }, 10000);
            this.clearform();
          } else {
            this.$message({
              message: res.error_desc,
              iconClass: "errorMessage",
              duration: 1000
            });
          }
        })
        .catch(err => {});
    },
    goExchange() {
      this.$router.push({
        path: "/c2c"
      });
    },
    initUserInfo() {
      this.userNationality = this.$store.state.userInfo.nationality || 1;
    },
    // 提示框的显示和隐藏
    nameBlur() {
      if (this.idInfo.name == null || this.idInfo.name.length == 0) {
        this.regname = true;
      }
    },
    nameFocus() {
      this.regname = false;
    },
    idBlur() {
      if (this.idInfo.number == null || this.idInfo.number.length == 0) {
        this.regId = true;
      }
      // if(this.idInfo.number.length !== 18 || this.idInfo.numebr !== null){
      //   this.idInfo.number = ''
      //   this.regId = true
      // }
    },
    idFocus() {
      this.regId = false;
    },
    //获取用户数据
    getUserData() {
      var data = {};
      if(this.$store.getters.loggedIn){


      }
    },
    clearform() {
      this.idInfo.name = "";
      this.idInfo.number = "";
      this.idInfo.faceimage = "";
      this.idInfo.backimage = "";
      this.idInfo.bodyimage = "";
    }
  },
  mounted() {
    var self = this;
    if (
      typeof this.$store.getters.hasSettedPinCode == "undefined" ||
      this.$store.getters.hasSettedPinCode == 0
    ) {
      this.$message({
        // "请优先设置资金密码，现在正在跳转..."
        iconClass: "errorMessage",
        message: this.$t("setPincode"),
        type: "error",
        duration: 1800
      });
      setTimeout(function() {
        self.$router.replace({
          name: "security"
        });
      }, 2000);
    } else {
      this.initUserInfo();
    }
  }
};
</script>
<style lang="scss" scoped>
/* 右侧内容 */

/* 右侧内容 */
body {
  overflow: auto;
}
.real_right_title {
  width: 886px;
  margin: 0 auto;
  height: 82px;
  margin-top: 50px;
}
.title_v {
  float: left;
  width: 300px;
  height: 82px;
  font-size: 22px;
  color: #4148cd;
  background: url("~@/assets/img/v1.png") no-repeat left;
  background-size: contain;
  line-height: 82px;
  text-indent: 100px;
}
.bj_ca {
  float: right;
  background: url("~@/assets/img/ka.png") no-repeat;
  width: 153px;
  height: 92px;
  background-size: contain;
}
/* 表单 */
.from {
  width: 886px;
  height: 900px;
  margin: 0 auto;
  margin-top: 65px;
}
.from h5 {
  font-size: 14px;
  color: #c2c3ca;
  border-top: 1px solid #202234;
  line-height: 54px;
}
/* 信息验证 */
.port {
  height: 120px;
  border-top: 1px solid #202234;
}
.port ul {
  overflow: hidden;
  list-style: none;
}
.port li {
  float: left;
  line-height: 120px;
  height: 120px;
}
.port li:first-child {
  width: 130px;
  color: #a2b2c8;
  font-size: 14px;
  word-break: break-all;
  line-height: 1;
  padding-top: 50px;
  padding-left: 15px;
  box-sizing: border-box;
}
.port li img {
  margin: 0 auto;
  display: inline-block;
  vertical-align: middle;
  margin: 0 25px;
}

.upload {
  width: 76px;
  height: 26px;
  border-radius: 30px;
  text-align: center;
  background-color: #3a4a5e;
  margin: 47px 34px 47px 20px;
  line-height: 26px !important;
  font-size: 12px;
  color: #6d86a5;
  cursor: pointer;
}

.upload span {
  float: left;
  text-indent: 17px;
}
.upload img {
  float: left;
  margin: 7.5px 6px !important;
}
.prompt {
  font-size: 12px;
  line-height: 120px;
  color: #465971;
}
.int {
  border-bottom: 1px solid #202234;
}
/* 提交 */
.submit-btn {
  width: 310px;
  height: 50px;
  margin: 88px auto;
  line-height: 50px;
  background: #4c54f9;
  color: #fcfcf2;
  text-align: center;
  cursor: pointer;
  border: none;
  border-radius: 0;
  display: block;
  &.el-button:hover {
    color: #d3d4f4;
    background: #4c54f9;
  }
}

/* 去交易 */
.cpt {
  width: 509px;
  margin: 0 auto;
  margin-top: 100px;
}
.cpt_ok {
  min-width: 205px;
  height: 48px;
  background-size: contain;
  line-height: 48px;
  margin: 0 auto;
  text-align: center;
}
.cpt_ok img {
  margin: 0 8px;
}
.cpt_ok span {
  text-indent: 25px;
  position: relative;
  top: -17px;
}
.go_to_trade {
  width: 509px;
  height: 49px;
  background: #4c54f9;
  text-align: center;
  font-size: 18px;
  color: #d3d4f4;
  margin-top: 120px;
  border-radius: 0;
  border: none;
  &.el-button:hover {
    color: #d3d4f4;
    background: #4c54f9;
  }
}
.upload-wrapper {
  padding: 0 15px;
}
/* 错误提示 */
.findpassword_error {
  text-align: left;
  color: #8faacc;
  font-size: 12px;
  padding: 13px 16px;
  padding-left: 25px;
  box-sizing: border-box;
  border-radius: 2px;
  min-width: 120px;
  position: relative;
  min-height: 30px;
  height: auto;
  margin-left: 30px;
  background: #3a4a5e;
  float: left;
  line-height: 20px;
}
.findpassword_error::after {
  content: "";
  width: 0px;
  height: 0px;
  border-top: 6px solid rgba(0, 0, 0, 0);
  border-right: 6px solid #3a4a5e;
  border-bottom: 6px solid rgba(0, 0, 0, 0);
  border-left: 6px solid rgba(0, 0, 0, 0);
  position: absolute;
  left: 0px;
  margin-left: -12px;
  top: 17px;
}
// .findpassword_error_1{text-indent: 20px;}
// .findpassword_error_2{background:#3a4a5e url('~@/assets/img/findpassword6.png') no-repeat  10px 6px;text-indent: 30px;}
// .findpassword_error_3{background:#3a4a5e url('~@/assets/img/findpassword7.png') no-repeat  10px 20px;}

.image-preview {
  display: inline-block;
  vertical-align: middle;
  .preview-area {
    border: 1px dashed #6d86a5;
    width: 80px;
    height: 54px;
    vertical-align: middle;
    display: inline-block;
    position: relative;
    margin: 0 25px;
    .plus-mark {
      position: absolute;
      height: 54px;
      width: 80px;
      line-height: 54px;
      text-align: center;
      vertical-align: middle;
    }
  }
  .preview-img {
    width: 80px;
    display: block;
  }
}
.cpt_ok {
  span {
    color: #fff;
  }
}
</style>
