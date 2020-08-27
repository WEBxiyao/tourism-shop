<template>
	<view style="background: #F5F5F5;min-height: 100%;height: auto;">
		<!-- 地址选择 -->
		<view class="main-bg-color text-white d-flex a-center px-3" style="height: 250rpx;" hover-class="main-bg-hover-color"
		 @click="openPathList">
			<view>
				<template v-if="path">
					<view class="font-weight font-md d-flex a-center font-lg">
						{{path.userName}} {{path.telNumber}}
						<view class="border border-white rounded px-1 font ml-2" v-if="path.isdefault">默认</view>
					</view>
					<view class="font">
						{{path.provinceName}}{{path.cityName}}{{path.countyName}} {{path.detailInfo}}
					</view>
				</template>
				<template v-else>
					<view class="font-weight font-md d-flex a-center font-lg">
						请选择收货地址
					</view>
				</template>
			</view>
			<view class="iconfont iconyoujiantou ml-auto" style="font-size: 30px;"></view>
		</view>

		<view style="border-top-left-radius: 25rpx;border-top-right-radius: 25rpx;margin-top: -25rpx;overflow: hidden;">
			<view class="bg-white">
				<scroll-view scroll-x class="scroll-row p-2 border-bottom">
					<image  v-for="(item,index) in list" :key="index" :src="item.cover" style="width: 100rpx;height: 100rpx;" class="rounded mr-2 scroll-row-item"></image>
				</scroll-view>
				<view class="d-flex px-2 py-4 a-center j-sb border-bottom">
					<text>商品总价</text>
					<price>{{all_amount}}</price>
				</view>
				<view class="d-flex px-2 py-4 a-center j-sb border-bottom">
					<text>运费</text>
					<text>包邮</text>
				</view>
				<view class="d-flex px-2 py-4 a-center j-sb border-bottom">
					<text class="main-text-color">小计</text>
					<price>{{pay_amount}}</price>
				</view>
	
				<divider></divider>


			</view>
		</view>

		<view class="position-fixed d-flex a-center j-end border bottom-0 left-0 right-0 bg-white p-2 font-md">
			合计:
			<view class="ml-2">
				<price>{{pay_amount}}</price>
			</view>
			<view class="ml-2 px-2 py-1 main-bg-color text-white font-md" hover-class="main-bg-hover-color" style="border-radius: 80rpx;"
			 @click="openPayMethods">
				去支付
			</view>
		</view>

	</view>
</template>

<script>
	import uniListItem from "@/compontent/uni/uni-list-item/uni-list-item.vue"
	import price from "@/compontent/common/price.vue"
	export default {
		components: {
			uniListItem,
			price
		},
		data() {
			return {
				path: false,
				list:[],
				all_amount:'',
				pay_amount:'',
				shipping_amount:'',
				 ids:''
			}
		},

		onLoad(e) {
			if(!e.ids){
				uni.navigateBack({
					delta:1
				})
				uni.showToast({
					icon:'none',
					title:'参数不合法'
				})
				return
			}
			this.getOrderData(e.ids)
			this.ids=e.ids
          // 这个地方是获取本地是否有地址
		  let address=uni.getStorageSync('address')
		  if(address){
			  this.path=JSON.parse(address)
		  }
		},
		onUnload() {

		},
		methods: {
			openPathList() {
				console.log("选择地址")
				// #ifdef MP-WEIXIN
				uni.getSetting({
					success: (res) => {
						console.log(res)
						if (res.authSetting['scope.address']) {
							uni.chooseAddress({
								success: (res) => {
									console.log(res)
									this.path = res
									uni.setStorageSync('address',JSON.stringify(res))
								}
							})
							// 用户已经同意小程序使用录音功能，后续调用 uni.startRecord 接口不会弹窗询问
						} else {
							if (res.authSetting['scope.address'] == false) {
								uni.openSetting({
									success: (res) => {
										console.log(res.authSetting)
									}
								})
							} else {
								uni.chooseAddress({
									success: (res) => {
										console.log(res)
										this.path= res
										uni.setStorageSync('address',JSON.stringify(res))
									}
								})
							}
						}
					}
				})
				// #endif
			},

			openPayMethods() {
				if(!this.path){
					return uni.showToast({
						icon:'none',
						title:'请选择收货地址'
					})
				}
					uni.showLoading({
						title:'支付中...'
					})
					this.$H.post('/api/deal_add_order',{
						 ids:this.ids,
						 shipping_name:this.path.userName,
						 shipping_phone:this.path.telNumber,
						 shipping_address:`${this.path.provinceName}${this.path.cityName}${this.path.countyName}${this.path.detailInfo}`
					}).then(res=>{
						uni.hideLoading()
						console.log(res,"支付成功")
						uni.showToast({
							icon:'success',
							title:'支付成功'
						})
						setTimeout(()=>{
							uni.switchTab({
								url:'/pages/index/index'
							})
						},500)
					}).catch(err=>{
						uni.hideLoading()
					})
			},
			getOrderData(ids){
				uni.showLoading({
					title:'结算中...'
				})
				this.$H.post('/api/deal_confirm_order',{
					ids
				}).then(res=>{
					console.log(res)
					uni.hideLoading()
					this.list=res.items
					this.shipping_amount=res.shipping_amount
					this.all_amount=res.all_amount
					this.pay_amount=res.pay_amount
				}).catch(err=>{
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style>

</style>
