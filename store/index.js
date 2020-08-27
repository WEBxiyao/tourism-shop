import Vue from 'vue'
import Vuex from 'vuex'
import cart from './module/cart.js'
import userInfo from './module/userInfo.js'
Vue.use(Vuex)
export default new Vuex.Store({
	modules:{
		cart,
		userInfo
	}
})