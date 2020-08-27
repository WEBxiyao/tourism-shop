<template>
	<view>
		<!-- 导航 -->
		<view style="height: 95rpx;" class="d-flex a-center j-sb px-4 bg-white">
			<view @click="changeTab(index)" :class="index===tabIndex?'on pulse':''" class="d-flex a-center  text-dark animated faster" v-for="(item,index) in nav" :key="index">
				<view class="font-md">{{item.name}}</view>
				<view  :class="item.icon" class="iconfont  ml-1" v-if="item.type===4"></view>
			</view>
		</view>
		<!-- 内容商品 -->
		<view class="d-flex flex-wrap p-1 j-sb">
			<view style="width: 360rpx;" class="d-flex flex-column bg-white mt-2" @click="goDetail(item.id)" v-for="(item,index) in list" :key="index">
				<image style="width: 360rpx;height: 360rpx;" :src="item.cover" mode="aspectFill" lazy-load></image>
				<view class="d-flex flex-column p-1" style="line-height: 1.3;">
					<text class="text-dark font-md">{{item.title}}</text>
					<text class="text-danger font-md">¥{{item.pay_amount}}</text>
				</view>
			</view>
		</view>
		<view class="d-flex a-center j-center py-3"><text class="font-md" style="color: #B2B2B2;">{{loadtext}}</text></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loadtext:"上拉加载更多",
				nav:[
					{
					 name:'综合',
					 type:1,
					 icon:'iconsanjiaodown'
					},
					{
					 name:'新品',
					 type:2,
					 icon:'iconsanjiaodown'
					},
					{
					 name:'销量',
					 type:3,
					 icon:'iconsanjiaodown'
					},
					{
					 name:'价格',
					 type:4,
					 icon:'iconsanjiaodown'
					},
				],
				tabIndex:0,
				list:[]
			}
		},
		computed:{
			order(){
				return this.nav[3].icon==='iconsanjiaodown'?2:1
			}
		},
		methods: {
			goDetail(id){
				uni.navigateTo({
					url:'../detail/detail?id='+id
				})
			},
			changeTab(index){
				if(index===3){
					this.tabIndex=index
					if(this.tabIndex===index){
						this.nav[index].icon=this.nav[index].icon==="iconshangjiantou"?"iconsanjiaodown":"iconshangjiantou"
					}
				}else{
					if(this.tabIndex===index) return
					this.tabIndex=index
				}
				this.getData(true)
			},
			//获取首页数据
			getData(refresh = false){
				this.loadtext='加载中...'
				// 拿到当前分类的分页数
				let page = !refresh ? (Math.ceil(this.list.length/8) + 1) : 1
				this.$H.get('/api/goods',{
					orderby:this.nav[this.tabIndex].type,
					order:this.order,
					page
				}).then(res=>{
					console.log(res,"jjjj")
					this.loadtext=res.items.length<8?'没有更多了':'上拉加载更多'
					this.list=!refresh?[...this.list,...res.items]:res.items
				})
			}
		},
		onLoad() {
			this.getData()
		},
		onPageScroll() {
			// 没有更多了
			if (this.loadtext === '没有更多了') {
				return uni.showToast({ title: '没有更多了', icon: 'none' });
			}
			this.getData()
		}
	}
</script>

<style>
page{
	background-color: #f7f7f7;
}
.on{
	color:#FD6801 !important;
}
</style>
