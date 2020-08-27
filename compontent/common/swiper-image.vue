<template>
	<view>
		<swiper :style="{height:`${height}rpx`}" class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration">
			<swiper-item  v-for="(item,index) in imgArr" :key="index">
				<image mode="aspectFill" lazy-load="true" :style="{height:`${height}rpx`}" :src="item.img_url"></image>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500
			}
		},
		props:{
			imgArr:[Array,Object],
			height:Number,
			
		},
		created() {
			console.log(this.height)
		}
	}
</script>

<style>
</style>
