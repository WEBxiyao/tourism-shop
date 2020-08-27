<template>
	<view>
		<!-- 轮播图 -->
		<swiper-image :imgArr="imageSwipe" :height="750"></swiper-image>
		<!-- 商品名字 -->
		<view class="p-2">
			<view class="text-dark font-md">{{goods.title}}</view>
			<view class="text-danger font-md">{{goods.pay_amount}}</view>
			<view class="d-flex a-center text-muted font-sm">
				<text>市场价：</text>
				<text style="text-decoration: line-through;">{{goods.amount}}</text>
				</view>
			<view class="d-flex a-center j-sb text-muted font-sm">
				<text>购买可得：{{goods.integral_bonus_1}}积分</text>
				<text>库存：{{attrNum}}</text>
			</view>
			<view class="d-flex a-center j-sb text-muted font-sm">
				<text>购买可得：{{goods.score_bonus_1}}余额</text>
			</view>
		</view>
		<view class="d-flex  a-center pl-2 text-muted font-md" @click="togglePopup">
				<text>规格：</text>
				<text>{{attrShop}}</text>
		</view>
		<!-- 商品详情 -->
		<view>
			<view class="d-flex a-center j-center py-2 bg-light mt-2">商品详情</view>
			<view class="py-4">
				<u-parse className="uparse" :content="content" @preview="preview" @navigate="navigate" ></u-parse>
			</view>
		</view>
		<!-- 底部导航 -->
		<view style="height: 127rpx;"></view>
		<view class="position-fixed d-flex a-center border-top" style="height: 127rpx;bottom: 0;left: 0;padding: 0 20rpx;width: 710rpx;background-color: #fafafc;">
			<view class="iconfont icongouwuche position-relative a-center j-center"  style="font-size: 30px; flex: 1;">
				<uni-badge class="smallIcon" :text="shopNum" type="warning" size="small" />
			</view>
			<view style="flex: 3.5;" class="d-flex a-center j-sb">
				<view @click="togglePopup" hover-class="main-bg-hover-color" class="ml-1 d-flex a-center j-center text-white font-md rounded main-bg-color" style="width: 263rpx;height: 95rpx;">加入购物车</view>
				<view @click="togglePopup" hover-class="buy" class="ml-1 d-flex a-center j-center text-white font-md rounded bg-danger" style="width: 263rpx;height: 95rpx;">立即购买</view>
			</view>
		</view>
		<!-- 弹出框 -->
		<uni-popup ref="showpopup" type="bottom" @change="change">
			<view class="bg-white p-2" style="height:680rpx;">
				<view style="height: 250rpx;" class=" d-flex a-center">
					<image class="border" style="width: 150rpx; height: 150rpx;" :src="goods.cover" mode="aspectFill"></image>
					<view class="d-flex flex-column ml-2">
						<text class="text-dark font-md">{{goods.title}}</text>
						<text class="text-danger font-md">￥{{goods.pay_amount}}</text>
					</view>
				</view>
					<scroll-view style="height: 250rpx;" scroll-y="true" >
						<view class="d-flex flex-wrap">
							<text @click="changeAttribute(index)" :class="attrIndex===index?'attrOn':''" v-for="(item,index) in shop" :key="index" class="border py-1 px-2 rounded text-muted font-md mr-2 mt-1">{{item.title}}</text>
						</view>
					</scroll-view>
					<uni-number-box  :min="1" :max="9" :value="1" @change="changeNum" />
				<view class="d-flex a-center j-sb mt-3">
					<view @click="addShop" hover-class="main-bg-hover-color" class="ml-1 d-flex a-center j-center text-white font-md rounded main-bg-color" style="width:300rpx;height: 95rpx;">加入购物车</view>
					<view @click="goBuy" hover-class="buy" class="ml-1 d-flex a-center j-center text-white font-md rounded bg-danger" style="width:300rpx;height: 95rpx;">立即购买</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>
<script>
	import swiperImage from '@/compontent/common/swiper-image.vue'
    import uniNumberBox from '@/compontent/uni/uni-number-box/uni-number-box.vue'
	import uParse from "@/compontent/uni/uParse/src/wxParse.vue"
	import uniBadge from '@/compontent/uni/uni-badge/uni-badge.vue'
	import uniPopup from '@/compontent/uni/uni-popup/uni-popup.vue'
	import { mapGetters,mapMutations} from 'vuex'
	export default {
		data() {
			return {
				attrIndex:0,
				id:0,
				imageSwipe:[],
				goods:'',
				content:'',
				shop:[],
				num:1
			}
		},
		components:{
			swiperImage,
			uniNumberBox,
			uParse,
			uniBadge,
			uniPopup
		},
		onLoad(e) {
			if(!e.id){
				return uni.navigateBack({
					delta:1
				})
				uni.showToast({
					title:'参数错误',
					icon:'none'
				})
			}
			this.id=e.id
			this.getDetail(e.id)
		},
		computed:{
			tid(){
				return this.shop.length>0? this.shop[this.attrIndex].id :0
			},
			...mapGetters(['shopNum']),
			attrShop() {
				return this.shop.length>0? this.shop[this.attrIndex].title :null
			},
			attrNum() {
				return this.shop.length>0? this.shop[this.attrIndex].num : null
			}
		},
		methods: {
			...mapMutations(['getData']),
			getDetail(id){
				uni.showLoading({
					title:'加载中...'
				})
				this.$H.get('/api/good',{id}).then(res=>{
					uni.hideLoading()
					console.log(res)
					this.imageSwipe=res.images.map(v=>{
						return {
							img_url:v
						}
					})
				    let content=res.goods.content?res.goods.content.replace(/&amp;nbsp;/ig, " "):'';
					console.log(content,"--mmm--")
					this.goods=res.goods
					this.content=content
					this.shop=res.types
				}).catch(err=>{
					uni.hideLoading()
				})
			},
			changeNum(e){
				console.log(e)
				this.num=e
			},
			preview(src, e) {
				// do something
				console.log("src: " + src);
			},
			navigate(href, e) {
				// 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
				console.log("href: " + href);
			},
			addShop(){
				console.log("加入购物车")
				uni.showLoading({
					mask:true,
					title:'加入中'
				})
				this.$H.post('/api/deal_add_cart',{
					id:this.id,
					num:this.num,
					tid:this.tid
				}).then(res=>{
					console.log(res,"加入购物车")
					uni.hideLoading()
					if(res.errcode==="00007"){
					   return uni.navigateTo({
							url:'/pages/login/login'
						})
					}
					this.$refs.showpopup.close()
					uni.showToast({
						icon:'none',
						title:res.msg
					})
					this.getData()
				}).catch(err=>{
					uni.hideLoading()
				})
			},
			goBuy(){
				uni.showLoading({
					mask:true,
					title:'购买中...'
				})
				this.$H.post('/api/deal_add_cart',{
					id:this.id,
					num:this.num,
					tid:this.tid
				}).then(res=>{
					uni.hideLoading()
					if(res.errcode==="00007"){
					   return uni.navigateTo({
							url:'/pages/login/login'
						})
					}
					this.$refs.showpopup.close()
					console.log(res,"购买成功")
					uni.navigateTo({
						url:'../order-confirm/order-confirm?ids='+res.id
					})
	  
				}).catch(err=>{
					uni.hideLoading()
				})
				
			},
			togglePopup() {
				this.$nextTick(() => {
					this.$refs.showpopup.open()
				})
			},
			change(e) {
				console.log('是否打开:' + e.show)
			},
			changeAttribute(index){
				this.attrIndex=index
			}
		}
	}
</script>

<style>
	.uparse .p{ padding: 0!important; }
	.uparse view,.uparse uni-view{ line-height: 0!important; }
	.smallIcon{
		position: absolute;
		top:10rpx;
		left:30rpx
	}
	.buy{
		background-color:rgba(238,139,45,0.8);
	}
   .attrOn{
	   border:1upx solid #dc3545 !important;
	   color: #dc3545 !important;
   }
   .uparse view,.uparse uni-view {
   line-height: 1!important;
   
   }

</style>
