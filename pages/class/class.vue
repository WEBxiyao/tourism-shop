<template>
	<view style="height: 100vh;" class="d-flex">
		<scroll-view scroll-y  style="background-color: #f6f6f8;flex: 2;" class="elip-1">
			<view @click="changeLeft(index)"  style="padding: 25rpx;" :class="index===changeIndex?'pulse bg-white':''" class="d-flex a-center animated faster" v-for="(item,index) in left" :key="index">
				{{item.name | esp}}
			</view>
		</scroll-view>
		<scroll-view scroll-y style="flex:4"  @scrolltolower="scrolltolower">
				<view class="d-flex flex-wrap pt-2">
					<block v-for="(item ,index) in right" :key="index">
						<view style="width: 130rpx; margin-left:30rpx;" class=" d-flex flex-column" @click="goDetail(item.id)">
							<image style="height:130rpx;" mode="aspectFill" :src="item.cover" lazy-load></image>
							<view class="elip-1"><text class="font-sm text-muted">{{item.title}}</text></view>
						</view>
					</block>
				</view>
			<view class="d-flex a-center j-center py-3"><text class="font-md" style="color: #B2B2B2;">{{loadtext}}</text></view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				changeIndex:0,
				left:[],
				right:[],
				loadtext:"上拉加载更多",
			}
		},
		filters: {
			esp:(value)=>{
				if(!value) return
				if(value.length>8){
					return value.slice(0,8) + '...';
				}
				return value
			}
		},
		methods: {
			changeLeft(index){
				if(this.changeIndex===index) return
				this.changeIndex=index
				this.getRightData(true)
			},
			goDetail(id){
				uni.navigateTo({
					url:'../detail/detail?id='+id
				})
			},
			// 获取分类信息
			getClassData(){
				uni.showLoading({
					title:'加载中...'
				})
				this.$H.get('/api/categories').then(res=>{
					uni.hideLoading()
					this.left=res.cates
					this.getRightData()
				})
			},
			// 获取右边的数据
			getRightData(refresh = false){
				this.loadtext='加载中...'
				// 拿到当前分类的分页数
				let page = !refresh ? (Math.ceil(this.right.length/8) + 1) : 1
				this.$H.get('/api/goods',{
					cate:this.left[this.changeIndex].id,
					page
				}).then(res=>{
					console.log(res)
					this.loadtext=res.items.length<8?'没有更多了':'上拉加载更多'
					this.right=!refresh?[...this.right,...res.items]:res.items
				})
			},
			// 上拉加载
			scrolltolower(){
				// 没有更多了
				if (this.loadtext === '没有更多了') {
					return uni.showToast({ title: '没有更多了', icon: 'none' });
				}
				this.getRightData()
			},
		},
		onLoad() {
			this.getClassData()
		}
	}
</script>

<style>
.bg-white{
	border-left: 5rpx solid red;
}
</style>
