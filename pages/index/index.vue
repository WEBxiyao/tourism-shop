<template>
	<view>
		<!-- 轮播图 -->
		<swiper-image :imgArr="imageSwipe" :height="350"></swiper-image>
		<!-- 广告三图 -->
	<!-- 	<view class="d-flex" style="height: 385rpx;margin-top: 15rpx;">
			<view class="flex-1 border" @click="goDetail">
				<image style="height: 100%;" mode="aspectFill" src="/static/image/bg.jpg" lazy-load></image>
			</view>
			<view class="flex-1 border flex-column line-h0">
				<image @click="goDetail" style="height: 50%;" mode="aspectFill" src="/static/image/bg.jpg" lazy-load></image>
				<image @click="goDetail" style="height:50%;" mode="aspectFill" src="/static/image/bg.jpg" lazy-load></image>
			</view>
		</view> -->
		<!-- 推荐产品 -->
		<view class="bg-white p-2">
			<view class="d-flex j-sb flex-wrap">
				<image v-for="(item,index) in hot_goods" :key="index" class="mb-2" @click="goDetail(item.id)"  style="height:350rpx; width: 350rpx;" mode="aspectFill" :src="item.cover" lazy-load></image>
			</view>
			<!-- 产品类别查看更多 -->
			<block v-for="(item,index) in list" :key="index">
				<card-image @lookMore="lookMore" :item="item" :index="index"></card-image>
				<view class="d-flex flex-wrap">
					<block v-for="(itema,indexa) in item.goods" :key="indexa">
						<view style="margin-left: 5rpx;" @click="goDetail(itema.id)">
							<card-shop :itema="itema" :indexa="indexa"></card-shop>
						</view>
					</block>
				</view>
			</block>
		</view>
		<!-- 更多惊喜 -->
		<view class="mt-3">
			<view class="font-md font-weight text-dark text-center pt-2">更多惊喜</view>
			<view class="d-flex flex-wrap p-2">
				<block v-for="(item,index) in surprised" :key="index">
					<view @click="goDetail(item.id)" style="margin-left: 5rpx; background-color: #FFFFFF;margin-top: 20rpx;">
						<card-shop :itema="item" :indexa="index"></card-shop>
					</view>
				</block>
			</view>
		</view>
	</view>
</template>

<script>
	import swiperImage from '@/compontent/common/swiper-image.vue'
	import cardImage from '@/compontent/index/card-image.vue'
	import cardShop from "@/compontent/index/card-shop.vue"
	export default {
		data() {
			return {
				hot_goods:[],
				list:[],
				surprised:[],
				imageSwipe:[]
			}
		},
		components:{
			swiperImage,
			cardImage,
			cardShop
		},
		onLoad(e) {
          this.getData()
		  if(e.id){
			  uni.setStorageSync('shareId',e.id)
		  }
		},
		methods: {
            goDetail(id){
				uni.navigateTo({
					url:'../detail/detail?id='+id
				})
			},
			// 查看更多
			lookMore(e){
				console.log(e)
				uni.navigateTo({
					url:'../shopClass/shopClass'
				})
			},
			// 获取首页数据
			getData(callback=false){
				uni.showLoading({
					title:'加载中...'
				})
				this.$H.get('/api/index').then(res=>{
					uni.hideLoading()
					this.imageSwipe=res.rotate
					this.hot_goods=res.hot_goods
					this.list=res.cates
					this.surprised=res.new_goods
					if(typeof callback==='function'){
						callback()
					}
				}).catch(err=>{
					uni.hideLoading()
				})
			}
		},
		onPullDownRefresh() {
			this.getData(()=>{
				uni.stopPullDownRefresh()
				uni.showToast({
					title:'刷新成功',
					icon:'success'
				})
			})
		}
	}
</script>

<style>
page{
	background-color: #f4f5f7;
}
</style>
