<template>
	<view class="bg-white p-2  mt-2">
		<view class="d-flex py-2  border-bottom j-sb" >
			<view class="d-flex a-center ">
				<view style="width: 11rpx; height: 100%;" class="bg-danger"></view>
				<text class="text-muted font-md ml-2">{{item.name}}</text>
			</view>
			<view @click="lookMore" v-if="more"><text class="text-muted font-md">查看更多></text></view>
		</view>
		
		<slot></slot>
	</view>
</template>

<script>
	export default{
		props:{
			index:Number,
			item:Object,
			more:{
				type:Boolean,
				default:true
			}
		},
		methods:{
			lookMore(){
				this.$emit('lookMore',this.index)
			}
		}
	}
</script>

<style>
	
</style>
