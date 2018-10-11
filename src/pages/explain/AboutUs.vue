<template>
 <section>
     <div class="about" v-if="langType == 'zh-cn'">
        <p class="title">{{$t('About Us')}}</p>

        <p class="about_mian">
           UTCOIN去中心化交易所是由世界各地的UTCOIN社区成员共同研发组建，主要技术基于UTC（Union Technology Chain）公链。交易所的所有交易对都由社区成员推荐上架，并通过UTC公链进行投票，投票达到上架标准后，系统会自动将其显示在UTCOIN交易所页面内，其具体运营由上架方自行管理，与UTCOIN.IO和社区成员无关。
        </p>
    </div>
      <div class="about english" v-if="langType == 'en-us'">
       <p class="title">{{$t('About Us')}}</p>

        <p class="about_mian">
            Australian Equity Exchange Center (AUEC), founded in August 2017 in New South Wales Australia,
            is a worldwide professional digital asset exchange platform. AUEC focuses on providing safe,
             steady and comfortable digital asset exchange services to the users. AUEC provides digital asset
              transaction and related services within the limits permitted by law in New South Wales. AUEC has
              also obtained the digital asset exchange license issued by Australian Securities and Investment Commission (ASIC).<br />

            AUEC has established a set of scientifically trading system, with leading technology to make it stable
            and highly-efficient. Led by experts, AUEC builds a team which has sound experience in traditional finance,
             cryptography, internet finance, blockchain technology, AI, marketing. Our team focuses on providing stable
             and efficient exchange platform for AUEC users.<br />

           AUEC insists that users’ interests as its first priority, adhering to the spirit of openness,
           freedom, and sharing of internet. AUEC is also dedicated to provide global users with excellent
            comprehensive digital asset services.
        </p>
    </div>
 </section>
</template>
<script>


	export default {
		name: 'AboutUs',
		props: {

    },
    computed:{
      langType(){
        return this.$store.getters.getLang
      }
    }
	}
</script>
<style lang="scss" scoped>
	/* 右侧  */
	.about{
        width: 987px;
        padding: 60px 80px;
        box-sizing: border-box;
    }
    .title{
        font-size: 26px;
        color: #fff;
    }
    .about_mian{
        font-size: 14px;
        color: #4d5f77;
        line-height: 35px;
        margin-top: 60px;
    }
    .english .about_mian{
      line-height: 24px
    }
</style>
