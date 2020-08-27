<template>
	<view>
		<view class="d-flex p-2 border-bottom j-sb a-center" v-for="(item,index) in list" :key="index">
			<view class="d-flex flex-column">
				<text>名字:{{item.name}}</text>
				<text>手机:{{item.phone}}</text>
				<text>获得积分:{{item.integral}}</text>
			</view>
			<view><image style="width: 160rpx;height:160rpx;border-radius: 80rpx;" :src="item.cover" mode="aspectFill" lazy-load></image></view>
		</view>
		<view class="d-flex a-center j-center py-3"><text class="font-md" style="color: #B2B2B2;">{{loadtext}}</text></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loadtext:"上拉加载更多",
				list:[]
			}
		},
		methods:{
			getDateList(refresh = false){
				this.loadtext='加载中...'
				// 拿到当前分类的分页数
				let page = !refresh ? (Math.ceil(this.list.length/8) + 1) : 1
				this.$H.get('/api/commends',{
					page
				}).then(res=>{
					console.log(res,"我的推荐")
					this.loadtext=res.items.length<8?'没有更多了':'上拉加载更多'
					this.list=!refresh?[...this.list,...res.items]:res.items
				})
			},
		},
		onReachBottom() {
			this.getDateList()
		},
		onLoad() {
			this.getDateList()
		}
	}
</script>

<style>

</style>
