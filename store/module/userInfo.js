export default {
	state:{
		userInfo:{
			avatarUrl:'/static/image/bg.jpg',
			nickName:'默认',
			token:''
		},
		loginStatus:false,
		token:null
	},
	mutations:{
		// 初始化值
		initUser(state){
			let user=uni.getStorageSync('user')
			if(user){
				let userInfo=JSON.parse(user)
				// state.avatarUrl=userInfo.avatarUrl
				// state.nickName=userInfo.nickName
				state.token=userInfo.token
				state.loginStatus=true
			}
		},
		// 登录
		login(state,userInfo){
			console.log(userInfo)
			// state.userInfo=userInfo
			state.loginStatus=true
			state.token=userInfo.token
			uni.setStorageSync('user',JSON.stringify(userInfo))
		},
		// 退出登录
		Logout(state){
			state.userInfo = {}
			state.loginStatus = false
			state.token = null
			uni.removeStorageSync('userInfo')
		}
	}
}