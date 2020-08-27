<template>
	<view>
		<input class="d-flex px-3 py-2 border m-3" type="number" placeholder="请输入充值金额" v-model="money" />
		<view class=" d-flex j-center a-center font-md text-white main-bg-color rounded position-fixed" style="width: 100%;height: 90rpx;bottom:0;left: 0;z-index: 9999;" @click="submit">{{moneyContent}}</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				money:''
			}
		},
		computed:{
			moneyContent(){
				return this.money?`充值￥${this.money}`:'请输入充值金额'
			}
		},
		methods: {
			submit(){
				uni.showLoading({
					title:'支付中...',
					mask:true
				})
				this.$H.post('/api/deal_recharge',{
					score:this.money
				}).then(res=>{
					uni.hideLoading()
						this.initiatePayment(res.pay_info)
				})
			},
			// 发起支付
			initiatePayment(res){
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
				    }
				});
			},
		}
	}
</script>

<style>

</style>
