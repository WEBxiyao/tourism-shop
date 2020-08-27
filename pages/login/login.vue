<template>
	<view class="d-flex a-center j-center" style="height: 100vh;">
		<!-- #ifdef MP-WEIXIN -->
		<button open-type="getPhoneNumber" style="width: 90%;" class="bg-success text-white animated  heartBeat"
		 @getphonenumber="getPhoneNumber">登陆</button>
		<!-- #endif -->
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
               code:''
			}
		},
		onLoad() {

		},
		methods: {
			...mapMutations(['login']),
			// 判断是不是通过分享进来的
			shareDate(){
				let id=uni.getStorageSync('shareId')
				if(id===0 || !id) return
				this.$H.post('/api/deal_user_commend',{
					id
				}).then(res=>{
					console.log(res,"推荐人成功")
				})
			},
			getPhoneNumber(e) {
				if (e.detail.errMsg == "getPhoneNumber:fail user deny") {
					return uni.showModal({
						title: "提示",
						showCancel: false,
						content: "未授权",
					});
				} 	
				let encryptedData = e.detail.encryptedData
				let iv = e.detail.iv
				if(encryptedData&&iv){
					console.log(this.code,"---",encryptedData,"---",iv)
					// 用户登录
					this.$H.post('/api/wx_login', {
						code:this.code,
						iv,
						encryptedData
					}).then(res => {
						console.log(res,"登陆成功")
						this.login({
							token: res.token
						})
						this.shareDate()
						uni.navigateBack({
							delta: 1
						})
					}).catch(err=>{
						console.log(err)
					})
				}
				
				
			},
		},
		onLoad() {
			uni.login({
				success: result => {
					this.code=result.code
				},
				fail:err=>{
					uni.showModal({
						title: "提示",
						showCancel: false,
						content: "code获取失败",
					});
				}
			});
		}
	}
</script>

<style>

</style>
