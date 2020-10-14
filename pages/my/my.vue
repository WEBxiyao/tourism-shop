<template>
	<view>
		<!-- 头部 -->
		<view class="main-bg-color d-flex a-center j-center  flex-column" style="height:540rpx;">
			<template v-if="loginStatus">
				<image @click="editor" style="width: 160rpx;height:160rpx;border-radius: 80rpx;" :src="userInfo.cover" mode="aspectFill" lazy-load></image>
				<view class="text-dark font-lg text-white">{{userInfo.name}}</view>
				<view class="text-dark font-lg text-white">{{userInfo.ugroup_title}}</view>
				<view class="text-dark font-lg text-white">余额:{{userInfo.score}}</view>
				<view class="text-dark font-lg text-white">积分:{{userInfo.integral}}</view>
				<view class="text-dark font-lg text-white">旅游券:{{userInfo.card_num}}</view>
			</template>
			<!-- #ifdef MP-WEIXIN -->
			<template v-else>
				<view class=" d-flex j-center flex-column a-center" @click="goLogin">
					<image style="width: 160rpx;height:160rpx;border-radius: 80rpx;" src="/static/image/tx.png" mode="aspectFill" lazy-load></image>
					<text class="text-dark font-lg text-white">点击去登录</text>
				</view>
			</template>
			<!-- #endif -->
		</view>
		<!-- 我的订单 -->
		<view>
			<uni-list-item @click="myOrder(0)" title="我的订单" rightText="全部订单" thumb="/static/tabbar/dd.png" />
			<view class="d-flex j-sb" style="padding: 20rpx 80rpx;">
				<view class="order" @click="myOrder(index+1)" v-for="(item,index) in order" :key="index">
					<view class="iconfont" :class="item.icon" style="font-size: 30px;">
						<!-- <uni-badge class="smallIcon" :text="item.num" type="warning" size="small" /> -->
					</view>
					<view>{{item.name}}</view>
				</view>
			</view>
		</view>
		
		<view style="height: 20rpx; background-color: #f4f5f7;"></view>
		<uni-list-item @click="shipGrade(3)"  title="购买会员套餐" rightText="查看详情" thumb="/static/tabbar/dengji.png" />
		<uni-list-item @click="shipGrade(4)"  title="充值和提现" rightText="查看详情" thumb="/static/tabbar/dengji.png" />
		<uni-list-item @click="shipGrade(1)"  title="发展的会员" rightText="查看详情" thumb="/static/tabbar/dengji.png" />
		<uni-list-item @click="shipGrade(2)"  title="积分和余额记录" rightText="查看详情" thumb="/static/tabbar/dengji.png" />
		<uni-list-item @click="LogOut"  title="退出登录"  thumb="/static/tabbar/dengji.png" />
		<view class="share" v-if="loginStatus"> <button open-type='share' class="btn-share">分享</button></view>
	</view>
</template>

<script>
	import uniListItem from '@/compontent/uni/uni-list-item/uni-list-item.vue'
	import uniBadge from '@/compontent/uni/uni-badge/uni-badge.vue';
	import cardImage from '@/compontent/index/card-image.vue'
	import {mapState,mapMutations} from 'vuex'
	export default {
		data() {
			return {
				userInfo:'',
				order:[
					{
						icon:'icondaifukuan',
						name:'待确认',
						num:2
					},
					{
						icon:'icondaifahuo',
						name:'待发货',
						num:2
					},
					{
						icon:'iconicon-test',
						name:'待收货',
						num:2
					},
				],
				huiyuan:{
					title:'会员分享'
				}
			}
		},
		components:{
			uniListItem,
			uniBadge,
			cardImage
		},
		computed:{
			...mapState({
				loginStatus:({userInfo})=>userInfo.loginStatus
			})
		},
		onLoad() {
		// 获取推荐人
		if(this.loginStatus){
			this.shareDate()		
		}
		},
		// #ifdef MP-WEIXIN
		  onShareAppMessage(res) {
              let id=this.userInfo.userId?this.userInfo.userId:0
		      return {
		        title: '点击得积分',
		        path: '/pages/index/index?id='+id,
				imageUrl:'/static/tabbar/vip.jpg'
		      }
			  },
		// #endif
		methods: {
			...mapMutations(['login','Logout']),
			// 判断是不是通过分享进来的
			shareDate(){
				let id=uni.getStorageSync('shareId')
				console.log(id,"---jjjjjjjjjjj---")
				if(id===0 || !id) return
				this.$H.post('/api/deal_user_commend',{
					id
				}).then(res=>{
					console.log(res,"--------------------推荐人成功----------------")
				})
			},
			myOrder(index){
				this.navigationLogin({
					url:'../order/order?tab='+index
				})
			},
			editor(){
				let user=JSON.stringify({
					cover:this.userInfo.cover,
					name:this.userInfo.name,
				})
				uni.navigateTo({
					url:'../editorPersion/editorPersion?user='+user
				})
			},
			goLogin(){
				uni.navigateTo({
					url:'../login/login'
				})
			},
			shipGrade(type){
				if(type===1){
					this.navigationLogin({
						url:'../shipGrade/shipGrade'
					})
				}else if(type===2){
					this.navigationLogin({
						url:'/pages/IntegralRecord/IntegralRecord'
					})
				}else if(type===3){
					this.navigationLogin({
						url:'/pages/buyPlan/buyPlan'
					})
				}else{
					this.navigationLogin({
						url:'/pages/moneyTopup/moneyTopup'
					})
				}		
			},
			LogOut(){
				uni.showModal({
				    title: '提示',
				    content: '是否退出登录',
				    success:(res)=>{
				        if (res.confirm) {
				           this.Logout()
						   uni.showToast({
						   	title:'退出成功'
						   })
				        } else if (res.cancel) {
				            console.log('用户点击取消');
							
				        }
				    }
				});
			},
			// 获取用户信息
			getUser(){
				this.$H.get('/api/account').then(res=>{
					console.log(res,"用户信息")
					if(!res.name){
						uni.showModal({
							title: "提示",
							showCancel: false,
							content: "请完善个人资料",
							success: (res) => {
								this.editor()
							}
						});
					}
					this.userInfo={
						cover:res.cover,
						score:res.score,
						integral:res.integral,
						name:res.name,
						userId:res.id,
						card_num:res.card_num,
						ugroup_title:res.ugroup_title
					}
				})
			},
		},
		onShow() {
			this.getUser()
		}
	}
</script>

<style>
	.order{
		position: relative;
	}
.smallIcon{
	position: absolute;
	top:10rpx;
	left:30rpx
}
.share{
	position: fixed;
	right: 0;
	width: 150rpx;
	height: 60rpx;
	background-color:#FD6801;
	top:60%;
	border-radius: 15rpx 0 0 15rpx;
}
.btn-share{
	width: 150rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color:#FD6801;
	color: #FFFFFF;
	font-size: 28rpx;
}
</style>
