<template>
	<view>
		<!-- 导航 -->
		<view class="d-flex border-bottom py-2">
			<text @click="changeTab(index)" style="font-size: 32rpx;" :class="index===navIndex?'on':''" class="flex-1 j-center a-center d-flex" v-for="(item,index) in nav" :key="index">{{item.name}}</text>
		</view>
		<template v-if="navIndex===0">
			<input class="d-flex px-3 py-2 border m-3" type="number" placeholder="请输入充值金额" v-model="money" />
			<view class=" d-flex j-center a-center font-md text-white main-bg-color rounded position-fixed" style="width: 100%;height: 90rpx;bottom:0;left: 0;z-index: 9999;" @click="submit">{{moneyContent}}</view>
		</template>
		<template v-else>
			<view class="d-flex p-2 border a-center">
				<text class="font-28 mr-2">金额:</text>
				<input class="p-1 border flex-1" type="number" placeholder="请输入提现金额" v-model="form.score" />
			</view>
			<view class="d-flex p-2 j-center flex-column">
				<text class="p-2 font-28 border-bottom">提现方式</text>
				<view class="d-flex py-2 a-center">
					<text class="font-lg flex-1 text-center" :class="index===typeIndex?'on':''" @click="changeType(item)" v-for="(item,index) in wayType" :key="index">{{item.name}}</text>
				</view>	
			</view>
			<view class="d-flex p-2 border a-center">
				<text class="font-28 mr-2">提现账号:</text>
				<input class="p-1 border flex-1" type="number" placeholder="请输入提现账号" v-model="form.type_name" />
			</view>
			<!-- 如果是银行卡 -->
			<view v-if="form.type===3">
				<view class="d-flex p-2 border a-center">
					<text class="font-28 mr-2">开户人姓名:</text>
					<input class="p-1 border flex-1" type="number" placeholder="请输入开户人姓名" v-model="formType.bank_username" />
				</view>
				<view class="d-flex p-2 border a-center">
					<text class="font-28 mr-2">银行名称:</text>
					<input class="p-1 border flex-1" type="number" placeholder="请输入银行名称" v-model="formType.bank_name" />
				</view>
				<view class="d-flex p-2 border a-center">
					<text class="font-28 mr-2">预留手机号:</text>
					<input class="p-1 border flex-1" type="number" placeholder="请输入预留手机号" v-model="formType.phone" />
				</view>
			</view>
			<view  style="padding:20rpx; 2%">
				<textarea class="message border p-2" v-model="form.message" placeholder="用户备注" :maxlength="60" />
			</view>
			<view class=" d-flex j-center a-center font-md text-white main-bg-color rounded position-fixed" style="width: 100%;height: 90rpx;bottom:0;left: 0;z-index: 9999;" @click="submitWithdrawal">提现</view>
		</template>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				money:'',
				navIndex:0,
				typeIndex:0,
				nav:[
					{name:'充值'},
					{name:'提现'}
				],
				wayType:[
					{
						name:'微信',
						type:1,
						id:0
					},
					{
						name:'支付宝',
						type:2,
						id:1
					},
					{
						name:'银行卡',
						type:3,
						id:2
					},
				],
				form:{
					score:'',
					type:1,
					type_name:'',
					
					message:''
				},
				formType:{
					bank_username:'',
					bank_name:'',
					phone:'',
				}
			}
		},
		computed:{
			moneyContent(){
				return this.money?`充值￥${this.money}`:'请输入充值金额'
			}
		},
		methods: {
			changeTab(index){
				if(this.navIndex===index) return
				this.navIndex=index
			},
			changeType(item){
				if(this.typeIndex===item.id) return
				this.typeIndex=item.id
				this.form.type=item.type
			},
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
			// 提现
			submitWithdrawal(){
				let obj={}
				if(this.form.type===3){
					obj={...this.form,...this.formType}
				}else{
					obj={...this.form}
				}
				this.$H.post('/api/deal_add_export',
				obj).then(res=>{
					uni.showToast({
					    title: '提现成功',
					    icon:'success',
						success:()=>{
							setTimeout(()=>{
								uni.navigateBack({
									delta:1
								})
							},1000)
						}
					},
					)					
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
.on{
	color:#FD6801 !important;
	font-weight: bold;
}
.message{
	width: 96%;
	height: 100rpx;
}
</style>
