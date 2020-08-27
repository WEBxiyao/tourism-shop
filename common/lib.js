export default {

	// 网络状态
	isConnect: false,
	// 监听网络状态
	On() {
		// 监听登录状态微信
		uni.checkSession({
			success: (res) => {
	         console.log(res,"没失效")
			},
			fail: () => {
				uni.login()
			}
		})
		// 获取当前网络状态
		uni.getNetworkType({
			success: (res) => {
				if (res.networkType !== 'none') {
					this.isConnect = true;
					return;
				}
				uni.showToast({
					icon: "none",
					title: '请先连接网络',
				});
			}
		})
		// 监听网络状态变化
		uni.onNetworkStatusChange((res) => {
			this.isConnect = res.isConnected;
			switch (res.networkType) {
				case 'wifi':
					uni.showToast({
						icon: "none",
						title: '您目前处于wifi状态',
					});
					break;
				case '2g':
					uni.showToast({
						icon: "none",
						title: '您目前处于2g状态',
					});
					break;
				case '3g':
					uni.showToast({
						icon: "none",
						title: '您目前处于3g状态',
					});
					break;
				case '4g':
					uni.showToast({
						icon: "none",
						title: '您目前处于4g状态',
					});

					break;
				case 'none':
					uni.showToast({
						icon: "none",
						title: '您目前处于断网状态',
					});

					break;
				default:
					break;
			}

		})
	},
}
