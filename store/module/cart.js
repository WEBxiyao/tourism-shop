import $H from '@/common/lib/request.js'
export default{
	state:{	
		cart:[]
	},
	getters:{
		// 总价
		totalPrice:(state)=>{
			var total = 0
			state.cart.forEach((item)=>{
				 total+=parseInt(item.goods_number)*parseInt(item.pay_amount)
			})
			return total.toFixed(2)
		},
		// 总件数
		totalNum:(state)=>{
			var num=0
			state.cart.forEach((item)=>{
				 num+=parseInt(item.goods_number)
			})
			return num.toFixed(0)
		},
		// 购物车的个数
		shopNum:(state)=>{
			return state.cart.length
		},
		// 购物车id集合
		cartIds:(state)=>{
			let arr=[]
			if(state.cart.length>0){
				arr=state.cart.map(v=>v.id)
				return arr
			}
			return arr
		}
	},
	mutations:{
		// 修改数量
		changNumCart(state,{index,num}){
			 state.cart[index].goods_number=Number(num)
		},
		// 初始化数据
		getData(state){
			$H.get('/api/carts').then(res=>{
				if(res.errcode==="00007"){
				   return uni.navigateTo({
						url:'/pages/login/login'
					})
				}
				state.cart=res.items
			})
		}
	},
	actions:{
		// 删除
		delect({state,commit},id){
			let index=state.cart.findIndex(v=>{
				return v.id===id
			})
			if(index!==-1){
			 return	state.cart.splice(index,1)
			}
		},
		
	}
}