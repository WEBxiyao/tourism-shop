<template>
	<view style="background: #F5F5F5;">

		<!-- 选项卡 -->
		<view class="d-flex bg-white a-center font-md text-muted border-top border-bottom border-light-secondary">
			<view class="flex-1 d-flex a-center j-center py-2"
			v-for="(item,index) in tabBars" :key="index"
			:class="tabIndex === index ? 'tabactive' : ''"
			@tap="changeTab(index)">
				{{item.name}}
			</view>
		</view>
		
		<!-- 订单列表 -->
		<block v-for="(tab,tabI) in tabBars" :key="tabI">
			<view class="position-relative" v-show="tabI === tabIndex"
			style="min-height: 440rpx;">
				<template v-if="list.length > 0">
					<!-- 订单列表 -->
					<block v-for="(item,index) in list" :key="index">
						<order-list :item="item" :index="index"></order-list>
					</block>
					<view class="d-flex a-center j-center py-3"><text class="font-md" style="color: #B2B2B2;">{{loadtext}}</text></view>
				</template>
				<!-- 默认无 -->
				<template v-else>
					<no-thing :icon="tab.no_thing" :msg="tab.msg"></no-thing>
				</template>
			</view>
		</block>
	</view>
</template>

<script>
	import noThing from "@/compontent/common/no-thing.vue"
	import orderList from "@/compontent/order/order-list.vue"
	export default {
		components:{
			noThing,
			orderList
		},
		data() {
			return {
				tabIndex:0,
				loadtext:"上拉加载更多",
				list:[],
				tabBars:[
					{ 
						name:"全部",
						no_thing:"no_pay",
						msg:"你还没有订单",
						type:0
					},
					{
						name:"待确认",
						no_thing:"no_pay",
						msg:"你还没有待确认订单",
						type:6
					},
					{
						name:"待发货",
						no_thing:"no_receiving",
						msg:"你还没有待发货订单",
						type:7
					},
					
					{
						name:"待收货",
						no_thing:"no_receiving",
						msg:"你还没有待收货订单",
						type:8
					},
					
				],
				}
		},
		methods: {
			// 切换选项卡
			changeTab(index){
				if(this.tabIndex===index) return
				this.tabIndex = index
				this.getDateList(true)
			},
			getDateList(refresh = false){
				this.loadtext='加载中...'
				// 拿到当前分类的分页数
				let page = !refresh ? (Math.ceil(this.list.length/8) + 1) : 1
				this.$H.get('/api/orders',{
					status:this.tabBars[this.tabIndex].type,
					page,
				}).then(res=>{
					console.log(res)
					this.loadtext=res.items.length<8?'没有更多了':'上拉加载更多'
					this.list=!refresh?[...this.list,...res.items]:res.items
				})
			}
		},
		onLoad(e) {
			console.log(e)
			if(!e.tab) return
			this.tabIndex = Number(e.tab)
			this.getDateList()
		},
		onPageScroll() {
			// 没有更多了
			if (this.loadtext === '没有更多了') {
				return uni.showToast({ title: '没有更多了', icon: 'none' });
			}
			this.getDateList()
		}
	}
</script>

<style>
.tabactive{
	border-bottom: 5rpx solid #FD6801;
	color: #FD6801;
	margin-bottom: -5rpx;
}
</style>