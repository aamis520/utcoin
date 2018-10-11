
<template>
	<span>
		<i class="icon">
			<img :src="imgSrc" alt="" />
		</i>
		<i class="text" :style="">{{title}}</i>
	</span>
</template>

<script>
	export default{
		props:{
			title: {
				type: String,
				default: ''
			},
			isBold:{
				type: Boolean,
				default: false
			},
			color:{
				type: String,
				default: ''
			}
			imgSrc:{
				type: String,
				default: ''
			}
		},
	  data(){
	    return{
	        
	    }
	  },
	  methods:{
	  }
	}
</script>

<style>
</style>