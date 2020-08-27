<script>
	export default {
		onLaunch: function(option) {
			console.log(option,"进入小程序")
			// 初始化登录状态
			this.$store.commit('initUser')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
    /* #ifndef APP-NVUE */
    @import "/common/uni.css";
    @import "/common/animate.css";
    @import "/common/zcm-main.css";
	 @import "/common/icon.css";
    /* #endif */
	@import "/common/common.css";
</style>
