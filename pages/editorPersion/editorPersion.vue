<template>
	<view>
		<view class="d-flex border-bottom j-sb py-3 px-2 a-center">
			<text>修改默认头像</text>
			<image @click="upImg" style="width: 160rpx;height:160rpx;border-radius: 80rpx;" :src="user.cover" mode="aspectFill" lazy-load></image>
		</view>
		<view class="d-flex border-bottom j-sb py-3 px-2 a-center">
			<text class="mr-4">修改名称</text>
			<input type="text" v-model="user.name" class="border flex-1 p-1 rounded" placeholder="请输入姓名" />
		</view>
		<view class=" d-flex j-center a-center font-md text-white main-bg-color rounded position-fixed" style="width: 100%;height: 90rpx;bottom:0;left: 0;z-index: 9999;" @click="submit">保存</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				user:{
					name:'',
					cover:'/static/image/tx.png'
				},
				coverBase:''
			}
		},
		methods: {
			urlTobase64(url){
			    uni.request({
			      url:url,
			      responseType: 'arraybuffer', //最关键的参数，设置返回的数据格式为arraybuffer
			      success:res=>{
				      //把arraybuffer转成base64
			            let base64 = uni.arrayBufferToBase64(res.data); 
			            
			            //不加上这串字符，在页面无法显示的哦
			            base64　= 'data:image/jpeg;base64,' + base64　
			            
			            //打印出base64字符串，可复制到网页校验一下是否是你选择的原图片呢
			        this.coverBase=base64
			          }
			    })
			 },
			submit(){
				if(!this.user.name && !this.user.cover){
					return uni.showToast({
						icon:'none',
						title:'请填写信息'
					})
				}
				this.$H.post('/api/deal_edit_info',{
					name:this.user.name,
					cover:this.coverBase
				}).then(res=>{
					console.log(res,'上传图片')
				   uni.navigateBack({
				   	delta:1
				   })
				})
			},
			upImg(){
				uni.chooseImage({
				    count: 1, //默认9
				    success:(res)=>{
						let arr=res.tempFilePaths
						this.user.cover=arr[0]
						this.urlTobase64(arr[0]) 
				    }
				});
			}
		},
		onLoad(e) {
			if(e.user){
				this.user=JSON.parse(e.user)
			}
		}
	}
</script>

<style>

</style>
