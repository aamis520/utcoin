<!--  -->
<template>
  <div class="navibar c_shadow">
    <div class="navibar_container">
      <div class="navibar_container_left">
        <img class="logo" src="@/assets/navbar/logoAll.png" alt="icon">
      </div>
      <ul class="navibar_container_right">
        <li @click="goGoal(item)" :class="{ 'spanColor': item.title == 'C2C' }" class="rightBar" v-for="(item, index) in tabContent" :key="index">
          <span>{{item.title}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tabContent: [
        {title: this.$t('navigator.personCenter'),flag: 'person'},
        {title: this.$t('navigator.news'),flag: 'news'},
        {title: 'C2C',flag: 'c2c'},
        {title: this.$t('navigator.exchangeCenter'), flag: 'exchange'},
        {title: this.$t('navigator.home'),flag: 'home'}
      ]
    };
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    goGoal(item){

      let url = process.env.shangYaUrls

      switch (item.flag) {
        case 'home':
          let homeUrl = url + 'index'
          window.location.href = homeUrl
          break;
        case 'exchange':
          let exchangeUrl = url + 'tradeCenter'
          window.location.href = exchangeUrl
          break;
        case 'c2c':
          this.$router.push(
            {path: '/home'}
          )
          break;
        case 'news':
          let newsUrl  = url + 'news'
          window.location.href = newsUrl
          break;
        case 'person':
          let personUrl = url + 'personalCenter/myAssets'
          window.location.href = personUrl
          break;

      }
    }
  }
}

</script>
<style lang='scss' scoped>
  .c_shadow {
      box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.1), inset 0px -1px 0px 0px #e6e6e6;
  }
  .navibar{
    height: 80px;
    color: #495060;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "\5FAE\8F6F\96C5\9ED1", Arial, sans-serif;
    .rightBar span:hover {
      color: #1868B3;
    }
    .navibar_container{
      margin: 0 auto;
      height: 100%;
      width: 1200px;
       @keyframes spin {
        0%   {
            -webkit-transform: rotateY(0deg);
            -ms-transform: rotateY(0deg);
            transform: rotateY(0deg);
        }
        100% {
            -webkit-transform: rotateY(360deg);
            -ms-transform: rotateY(360deg);
            transform: rotateY(360deg);
        }
      }
      .navibar_container_left{
        -webkit-animation: spin 2s linear;
        animation: spin 2s linear;
        position: relative;
        float: left;
        height: 80px;
        width: 362px;
        vertical-align: middle;
        .logo{
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 316px;
          height: 51px;
        }
      }
      .navibar_container_right{
        height: 80px;
        font-size: 12px;
        min-width: 500px;
        .spanColor{
          color: #4a7bb8;
        }
        li {
          cursor: pointer;
        }
        .rightBar{
          margin-left: 26px;
          float: right;
          height: 80px;
          line-height: 80px;
          font-size: 16px;
          padding-left: 48px;
        }
      }
    }
  }
</style>
