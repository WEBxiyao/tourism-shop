

<template>
	<view>
		<template v-if="list.length>0">
			<!-- 这个地方是标题 -->
			<view class="p-2 d-flex a-center border-bottom" style="background-color: #f7f7f7;">
				<text class="text-dark font-md">共{{totalNum}}件商品，总价（不含运费）:</text>
				<text class="font-md text-danger">{{totalPrice}}</text>
				</view>
			<view class="p-2 border-bottom" v-for="(item,index) in list" :key="item.id">
				<view class="d-flex a-center">
					<image style="width: 205rpx;height: 147rpx;" :src="item.cover" mode="aspectFill"></image>
					<view class="p-2">
						<view class="elip-1"><text class="font-md text-muted">{{item.title}}</text></view>
						<view><text class="font-md font-weight text-danger">{{item.pay_amount}}</text></view>
						<view class="elip-1"><text class="font-md text-muted">规格:{{item.gt_title}}</text></view>
					</view>
				</view>
				<view class="d-flex j-sb py-2 a-center">
					<uni-number-box  :min="1" :max="9" :value="item.goods_number" @change="changeNum($event,item,index)" />
					<view @click="delectShop(item.id)" class="px-3 py-1 main-bg-color text-white font-md" hover-class="main-bg-hover-color">删除</view>
				</view>
			</view>
			<view style="height: 90rpx;"></view>
			<view class=" d-flex j-center a-center font-md text-white main-bg-color rounded position-fixed" style="width: 100%;height: 90rpx;bottom:0;left: 0;z-index: 9999;" @click="submit">立即结算</view>
		</template>
		<template v-else>
			<view class="d-flex a-center j-center py-3"><text class="font-md" style="color: #B2B2B2;">购物车为空</text></view>
		</template>
	</view>
</template>

<script>
	import uniNumberBox from '@/compontent/uni/uni-number-box/uni-number-box.vue'
	import { mapState,mapGetters,mapActions,mapMutations} from 'vuex'
	export default {
		data() {
			return {
				
			}
		},
		components:{
			uniNumberBox
		},
		computed:{
			...mapState({
				list:({cart})=>cart.cart
			}),
		...mapGetters(['totalPrice','totalNum','cartIds'])
		},
		methods: {
			changeNum(e,item,index){
				if(e===item.num) return
				uni.showLoading({
					title:'加载中...'
				})
				this.$H.post('/api/deal_change_num',{
					 id:item.id,
					 num:e, 
				}).then(res=>{
					uni.hideLoading()
					console.log(res)
					this.changNumCart({num:e,index})
				}).catch((err)=>{
					uni.hideLoading()
				})
				
			},
			...mapActions(['delect']),
			...mapMutations(['changNumCart','getData']),
			// 删除商品
			delectShop(id){
				uni.showLoading({
					title:'删除中...'
				})
				this.$H.post('/api/delete_cart',{
					ids:id
				}).then(res=>{
					uni.hideLoading()
					console.log(res)
					this.delect(id)
				}).catch(err=>{
					uni.hideLoading()
				})
			},
			// 结算
			submit(){
				uni.showLoading({
					title:'结算中...'
				})
				let ids=this.cartIds.join(',')
				this.$H.post('/api/deal_confirm_order',{
					ids
				}).then(res=>{
					console.log(res)
					uni.hideLoading()
					uni.navigateTo({
						url:'/pages/order-confirm/order-confirm?ids='+res.ids
					})
				}).catch(err=>{
					uni.hideLoading()
				})
			}
		},
		onShow() {
			// 初始化购物车数据
			this.getData()
			
		}
	}
</script>

<style>

</style>
