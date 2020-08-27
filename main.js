import Vue from 'vue'
import App from './App'
import store from './store/index.js'
Vue.config.productionTip = false
Vue.prototype.$store=store
// 引入request库
import $H from '@/common/lib/request.js';
Vue.prototype.$H = $H

// 这个地方是封装的跳转
Vue.prototype.navigationLogin=(options)=>{
	let userInfo=store.state.userInfo.loginStatus
	if(!userInfo){
		uni.showToast({
			title: '请先登录',
			icon: 'none'
		});
		return uni.navigateTo({
			url:'/pages/login/login'
		})
		
	}
	uni.navigateTo(options)
}

const app = new Vue({
	store,
    ...App
})
app.$mount()
