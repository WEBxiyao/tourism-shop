import $store from '@/store/index.js'
import {Base64} from './base.js'
import sha256  from './sha256.js'
export default {
	// 全局配置
	common:{
		// #ifndef H5
		baseUrl:"https://www.xz131419.com",
		// #endif
		// #ifdef H5
		baseUrl:"/api",
		// #endif
		header:{
			'Content-Type':'application/x-www-form-urlencoded',
		},
		data:{},
		method:'GET',
		dataType:'json',
	},
	// 请求 返回promise
	request(options = {}){
		// 组织参数
		options.url = this.common.baseUrl + options.url
		options.header = options.header || this.common.header
		options.data = options.data || this.common.data
		options.method = options.method || this.common.method
		options.dataType = options.dataType || this.common.dataType
		
		// token
		// if (options.token) {
		// 	options.header.token = $store.state.user.token
		// 	// 二次验证
		// 	if (options.checkToken && !options.header.token) {
		// 		uni.showToast({
		// 			title: '请先登录',
		// 			icon: 'none'
		// 		});
		// 		return uni.navigateTo({
		// 			url: '/pages/login/login',
		// 		});
		// 	}
		// }
		let token=$store.state.userInfo.token;
		let Authorization="";
		if(!token){
			const timestamp =(Date.parse(new Date()))/1000;
			console.log(timestamp,"----time------")
			const API_SK='ARcDf17H1yUPhqplsgrShPGHGDQl/SElY3jZD+DVL+M=';
			const sign=`${timestamp}${API_SK}`;
			const signa=sha256.sha256_digest(sign);
			console.log(signa,"jjjjj-----jjjj----signa")
			Authorization =`${signa}${timestamp}`;
		}else{
			const timestamp =(Date.parse(new Date()))/1000;
			const API_SK='ARcDf17H1yUPhqplsgrShPGHGDQl/SElY3jZD+DVL+M=';
			const sign=`${token}${timestamp}${API_SK}`;
			const signa=sha256.sha256_digest(sign);
			 Authorization =`${signa}${timestamp}${token}`;
		}
		let encodeStr = Base64.encode(Authorization);
		console.log(encodeStr ,"kkkkk")
		options.header.Authorization=encodeStr ;
		// 请求
		return new Promise((res,rej)=>{
			// 请求之前... todo
			// 请求中...
			uni.request({
				...options,
				success: (result) => {
					console.log(result,"初始数据")
					// 服务端失败
					if(!result.data.result){
						return uni.showToast({
							icon:'none',
							title:result.data.msg
						}) 
					}
					// 成功
					let data = result.data
					res(data)  
				},
				fail: (error) => {
					uni.showToast({
						title: error.errMsg || '请求失败',
						icon: 'none'
					});
					return rej()
				}
			});
		})
	},
	// get请求
	get(url,data = {},options = {}){
		options.url = url
		options.data = data
		options.method = 'GET'
		return this.request(options)
	},
	// post请求
	post(url,data = {},options = {}){
		options.url = url
		options.data = data
		options.method = 'POST'
		return this.request(options)
	},
	// delete请求
	del(url,data = {},options = {}){
		options.url = url
		options.data = data
		options.method = 'DELETE'
		return this.request(options)
	},
	upload(url,data,onProgress = false){
		let token=$store.state.userInfo.token;
		let Authorization="";
		const timestamp =(Date.parse(new Date()))/1000;
		const API_SK='ARcDf17H1yUPhqplsgrShPGHGDQl/SElY3jZD+DVL+M=';
		const sign=`${token}${timestamp}${API_SK}`;
		const signa=sha256.sha256_digest(sign);
		 Authorization =`${signa}${timestamp}${token}`;
		let encodeStr = Base64.encode(Authorization);
		console.log(data.filePath,"---kkk-----")
		return new Promise((result,reject)=>{
			 uni.uploadFile({
				url:this.common.baseUrl + url,
				filePath:data.filePath,
				name:data.name || "files",
				header:{ 
					'Authorization':encodeStr,
					 "Content-Type": "multipart/form-data",
					  'accept': 'application/json',
					},
				success: (res) => {
					console.log(res,"这个是上传返回")
					let message = JSON.parse(res.data)
					// 服务端失败
					if(!message.result){
						let title=res.data.msg
						 uni.showToast({
						     title:message.msg,
							 icon:'none'
						 });
						return
					}	
					result(message);
				},
				fail: (err) => {
					console.log(err);
					reject(err)
				}
			})
			
		})
	}
}