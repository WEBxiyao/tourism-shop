<template>
	<view>
      <template v-if="navbar.length>0">
      	<!-- 导航 -->
      			<view class="d-flex border-bottom border-top bg-white px-5" style="height: 88rpx;">
      				<view class="d-flex flex-column a-center j-center flex-1 mt-2" v-for="(item, index) in navbar" :key="index" @tap="changeNav(index)">
      					<text :class="active === index ? ' main-text-color' : 'text-dark'" class="font-28">{{ item.name }}</text>
      					<text class="lineBottom animated faster" :class="active === index ? animatedStyle : 'bg-white'"></text>
      				</view>
      			</view>
      	 <view>
      			   <view class="border-bottom p-2">套餐介绍</view>
      			   <view class="p-2">
      				   {{introduce}}
      			   </view>
      	 </view>
      	<view class=" d-flex j-center a-center font-md text-white main-bg-color rounded position-fixed" style="width: 100%;height: 90rpx;bottom:0;left: 0;z-index: 9999;" @click="submit">支付￥{{buyPrice}}</view>
      </template>
	  <template v-else>
	  	<view class="d-flex a-center j-center py-3"><text class="font-md" style="color: #B2B2B2;">你已经是最高会员了...</text></view>
	  </template>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				navbar: [],
				animatedType:'',
				active: 0,
			}
		},
		computed: {
			animatedStyle() {
				return `${this.animatedType} main-bg-color`;
			},
			introduce(){
				return this.navbar.length>0? this.navbar[this.active].desc:''
			},
			buyPrice(){
				return this.navbar.length>0?this.navbar[this.active].price :''
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
			},
			getData(){
				uni.showLoading({
					title:'加载中...'
				})
				this.$H.get('/api/ugroups').then(res=>{
					console.log(res,"用户组")
					uni.hideLoading()
					this.navbar=res.items.map(v=>{
						return{
							id:v.id,
							name:v.title,
							desc:v.content,
							price:v.amount
						}
					})
				})
			},
			// 支付
			submit(){
				if(!this.navbar.length>0) return
				let id=this.navbar.length>0?this.navbar[this.active].id:0
				uni.showLoading({
					title:'支付中...',
					mask:true
				})
				this.$H.post('/api/deal_ugroup',{
					id
				}).then(res=>{
					console.log("支付",res)
					uni.hideLoading()
					if(res.is_pay){
						// 发起支付
					  	this.initiatePayment(res.pay_info,res.rid)
						return
					}else{
						uni.showToast({
							icon:'success',
							title:'支付成功',
							success: () => {
								uni.navigateBack({
									delta:1
								})
							}
						})
						
					}
					
				})
			},
			// 发起支付
			initiatePayment(res,id){
				uni.requestPayment({
				    provider: 'wxpay',
				    timeStamp:res.timeStamp,
				    nonceStr:res.nonceStr,
				    package:res.package,
				    signType:res.signType,
				    paySign:res.paySign,
				    success:(res)=>{
				        console.log('success:' + JSON.stringify(res));
						uni.showToast({
							icon:'success',
							title:'支付成功',
							success: () => {
								uni.navigateBack({
									delta:1
								})
							}
						})
				    },
				    fail:(err)=>{
						uni.showToast({
							icon:'none',
							title:'支付失败'
						})
						if(err.errMsg==='requestPayment:fail cancel'){
                           this.backIntegral(id)
						}
				    }
				});
			},
			// 取消支付返回积分
			backIntegral(id){
				console.log(id,"---555----")
				this.$H.post('/api/deal_cancel_pay',{
					id						  
				}).then(res=>{
					console.log(res,"返回积分")
				})
			}
			
		},
		onLoad() {
			this.getData()
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
