<template>
	<view>
		<!-- 导航 -->
		<view class="d-flex border-bottom border-top bg-white px-5" style="height: 88rpx;">
			<view class="d-flex flex-column a-center j-center flex-1 mt-2" v-for="(item, index) in navbar" :key="index" @tap="changeNav(index)">
				<text :class="active === index ? ' main-text-color' : 'text-dark'" class="font-28">{{ item.name }}</text>
				<text class="lineBottom animated faster" :class="active === index ? animatedStyle : 'bg-white'"></text>
			</view>
		</view>
		<scroll-view scroll-y :style="scollHeight" @scrolltolower="scrolltolower">
		<view class="d-flex px-2 py-3 border-bottom flex-column" v-for="(item,index) in list" :key="index">
			<text>{{item.dateline}}</text>
			<text>支付{{typeContent}}:{{item.score}}</text>
			<text>{{item.message}}</text>
		</view>
		<view class="d-flex a-center j-center py-3"><text class="font-md" style="color: #B2B2B2;">{{loadtext}}</text></view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				navbar: [{
					name:'积分'
				},{
					name:'余额'
				}],
				animatedType:'',
				active: 0,
				loadtext:"上拉加载更多",
				list:[]
			}
		},
		computed: {
			animatedStyle() {
				return `${this.animatedType} main-bg-color`;
			},
			scollHeight() {
				let H = 0;
				uni.getSystemInfo({
					success: res => {
						H = res.windowHeight - uni.upx2px(90);
					}
				});
				return `height:${H}px`;
			},
			typeContent(){
				return this.active==0?'积分':'余额'
			}
		},
		watch: {
			active(newValue, oldValue) {
				if (newValue > oldValue) {
					return (this.animatedType = 'slideInLeft');
				}
				return (this.animatedType = 'slideInRight');
			}
		},
		methods: {
			// 切换导航
			changeNav(index) {
				if (this.active === index) return;
				this.active = index;
				this.getDate(true)
			},
			getDate(refresh = false){
				this.loadtext='加载中...'
				let url=this.active===0?'/api/integrals':'/api/scores'
				// 拿到当前分类的分页数
				let page = !refresh ? (Math.ceil(this.list.length/10) + 1) : 1
				this.$H.get(url,{
					page
				}).then(res=>{
					console.log(res)
					this.loadtext=res.items.length<10?'没有更多了':'上拉加载更多'
					this.list=!refresh?[...this.list,...res.items]:res.items
				})
			},
			scrolltolower() {
				// 没有更多了
				if (this.loadtext === '没有更多了') {
					return uni.showToast({ title: '没有更多了', icon: 'none' });
				}
				this.getDate()
			},
		},
		onLoad() {
			// 获取积分记录
			this.getDate()
		}
	}
</script>

<style>
.lineBottom {
	width: 84rpx;
	height: 6rpx;
	border-radius: 3rpx;
	display: block;
	margin-top: 12rpx;
}
</style>
