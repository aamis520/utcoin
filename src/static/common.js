import enUS from '../lang/en-us.json'
import zhCN from '../lang/zh-cn.json'
// 正则
const reg = {
    emailReg:/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
    pwdReg:/^[a-zA-Z0-9]{6,12}$/,
    // pwdRegTwo:/^\d{6}$/
}
/**************************************时间格式化处理************************************/
const dataParse = function (time) { //author: meizz
  var date = new Date(time);
  var year = date.getFullYear(),
      month = date.getMonth() + 1,//月份是从0开始的
      day = date.getDate(),
      hour = date.getHours(),
      min = date.getMinutes(),
      sec = date.getSeconds();
      if(sec.length == 1){
        sec = `0${sec}`
      }
  var newTime = year + '-' +
              month + '-' +
              day + ' ' +
              hour + ':' +
              min + ':' +
              sec;
  return newTime;
}
const dateFtt =  function (time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}
// 整数保留
const availableFilterTwo = function(val){
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
}
// 错误处理
const ERR = {
    NOERR:1000,     //没错误
    // 登录
    EMAILERR:1001,  //邮箱格式错误
    EMAILNULL:2003, //邮箱不能为空
    PWDERR:1002,    //密码必须为6-12位数字字母组合
    PWDNULL:2004,   //密码不能为空
    PWD2ERR:1003,   //重复密码必须为2-6位数字
    NATIONALITYERR:1004,   //国籍错误
    PWDNOTSAME:1005,    //两次密码不同
    SLIDERERR:1010, //滑块验证

    // 实名认证
    FULLNAMEEMPTY:2000,     //全名为空
    CODEEMPTY:2001,          //证件号为空
    NOFACEIMG:2002,            //缺少证件照正面
    NOBACKIMG:2003,           //缺少证件照背面
    NOBODYIMG:2004,            //缺少手持证件照

    //资金密码设置
    TRADEPWDERR:2004,    //请输入资金密码
    TRADEPWDDE:2005,     //两次输入的密码不一致
}

var lang =localStorage.getItem('lang')
let lanJson = {}
if(lang == 'en-us'){
    lanJson = enUS
}else if(lang == 'zh-cn'){
    lanJson = zhCN
}
const Validate = {
    // 登录验证
    login:function(email,pwd,sliderStatus){
        var res = {}
        // console.log(email)
        if (email.length == 0 || !email.length) {
            // console.log(self,'this')
            res.errCode = ERR.EMAILNULL
            res.errMsg = lanJson.emialAddress
        }else if(!reg.emailReg.test(email)){
            res.errCode = ERR.EMAILERR
            // 请输入正确的邮箱地址
            res.errMsg = lanJson.correctEmail
        }else if(pwd.length ==0 || !pwd.length){
            res.errCode = ERR.PWDNULL
            // '请输入密码'
            res.errMsg = lanJson.spassword
        }else if(!reg.pwdReg.test(pwd)){
            res.errCode = ERR.PWDERR
            // '密码必须为6-12位数字字母组合'
            res.errMsg = lanJson.passwordLang
        }else if(!sliderStatus){
            res.errCode = ERR.SLIDERERR
            res.errMsg = lanJson.slider
        }else if(reg.emailReg.test(email) && reg.pwdReg.test(pwd) && sliderStatus){
            res.errCode = ERR.NOERR
            // '校验合法'
            res.errMsg = lanJson.CheckLegal
        }
        // console.log(res)
        return res
    },
    // 注册验证
    regist:function(email,pwd,pwd2,nationality,sliderStatus){
        var res = {}
        if (email.length == 0 || !email.length) {
            res.errCode = ERR.EMAILNULL
            // '请输入邮箱地址'
            res.errMsg = lanJson.emialAddress
        }else if(!reg.emailReg.test(email)){
            res.errCode = ERR.EMAILERR,
            // '请输入正确的邮箱地址'
            res.errMsg = lanJson.correctEmail
        }else if (pwd.length == 0 || !pwd.length) {
            res.errCode = ERR.PWDNULL
            // '需设置6-12位数字和字母组合密码'
            res.errMsg = lanJson.noPwd
        }else if(!reg.pwdReg.test(pwd) ){
            res.errCode = ERR.PWDERR,
            // '密码必须为6-12位数字字母组合'
            res.errMsg = lanJson.passwordLang
        } else if (pwd != pwd2) {
            res.errCode = ERR.PWDNOTSAME
            // '两次输入密码不一致'
            res.errMsg = lanJson.pwdTwice
        }else if(typeof nationality == undefined || nationality == ''){
            res.errCode = ERR.NATIONALITYERR
            // '请选择国籍'
            res.errMsg = lanJson.nationality
        }else {
            res.errCode =  ERR.NOERR
            // '校验合法'
            res.errMsg = lanJson.CheckLegal
        }
        return res
    },
    // 实名认证step1
    idVerify(name,number,faceimg,backimg,bodyimg){
        var res = {}
        if(!name.length || name.length == 0){
            res.errCode =  ERR.TRADEPWDERR
            res.errMsg = '请填写全名'
        }else if(!number.length || number.length == 0){
            res.errCode =  ERR.FULLNAMEEMPTY
            res.errMsg = '请填写证件号'
        }else if(!faceimg || faceimg == ''){
            res.errCode =  ERR.NOFACEIMG
            res.errMsg = '请上传证件正面照片'
        }else if(!backimg || backimg == ''){
            res.errCode =  ERR.NOBACKIMG
            res.errMsg = '请上传证件反面照片'
        }else if(!bodyimg || bodyimg == ''){
            res.errCode =  ERR.NOBODYIMG
            res.errMsg = '请上传手持证件照片'
        }else{
            res.errCode =  ERR.NOERR
            res.errMsg = '校验合法'
        }
        return res
    },
    // 密码重置
    // pwdReset(pwd,pwd2){
    //     var res = {}
    //     if (!name.length || name.length == 0) {
    //         res.errCode = ERR.TRADEPWDERR
    //         res.errMsg = '请输入密码'
    //     }else if (!reg.pwdRegTwo.test(pwd) ){
    //         res.errCode = ERR.PWDERR,
    //         res.errMsg = '密码必须为6位数字'
    //     }else if(pwd != pwd2){
    //         res.errCode = ERR.TRADEPWDDE
    //         res.errMsg = '两次输入的密码不一致'
    //     }else{
    //         res.errCode =  ERR.NOERR
    //         res.errMsg = '校验合法'
    //     }
    //     return res
    // }
}



export { Validate,ERR ,nationalityOption, dateFtt,dataParse,availableFilterTwo}
