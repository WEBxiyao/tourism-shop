<template>
	<view class="bg-white">
		<divider></divider>
		<!-- 头部 -->
		<view class="d-flex a-center p-2 border-bottom border-light-secondary">
			<text class="text-light-muted font-md">{{item.dateline}}</text>
			<text class="main-text-color ml-auto font-md">{{item.status_name}}</text>
		</view>
		<!-- 身体 -->
		<view class="px-2">
			<view class="border-bottom d-flex a-center py-2 border-light-secondary"
			v-for="(order,orderIndex) in item.goods" :key="orderIndex">
				<image :src="order.cover" mode="aspectFill"
				style="width: 150rpx;height: 150rpx;" class="rounded mx-2 flex-shrink"
				></image>
				<view class="flex-1">
					<view class="d-flex a-center">
						<text class="font-md text-dark">{{order.title}}</text>
						<text class="font-md text-light-muted ml-auto"
						>￥{{order.amount}}</text>
					</view>
					<view class="d-flex a-center">
						<text class="font text-light-muted">{{order.type_title}}</text>
						<text class="font text-light-muted ml-auto"
						>x{{order.num}}</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 底部 -->
		<view class="d-flex a-center p-2">
			<text class="text-dark font-md ml-auto">
				共{{allLength}}件商品，合计：￥{{allPrice}}
			</text>
		</view>
<!-- 		<view class="d-flex j-end a-center px-2 pb-2">
			<view class="rounded border border-light-secondary py-1 px-2 text-secondary" 
			hover-class="bg-light-secondary">
				查看物流
			</view> 
			<view class="ml-2 rounded border border-light-secondary py-1 px-2 text-secondary" 
			hover-class="bg-light-secondary">
				确认收货
			</view>
		</view> -->
	</view>
</template>

<script>
	export default {
		props: {
			item: Object,
			index:Number
		},
		computed:{
			allLength(){
				return this.item.goods.length>0?this.item.goods.length:0
			},
			allPrice(){
				var price=0
				if(this.item.goods.length>0){
					for(let i=0;i<this.item.goods.length;i++){
						price+=parseInt(this.item.goods[i].amount)*parseInt(this.item.goods[i].num)
					}
				}
				return price
			}
		}
	}
</script>

<style>
</style>
