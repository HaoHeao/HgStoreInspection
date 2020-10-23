<script>
	let config = {
		// 每页的数据
		pagesize: 20
	};
	export default {
		globalData: {
			system: {
				version: "0.9.4",
				lastmodified: "2020/10/20",
				systemName: "北京汉光巡检系统",
				appId: "wx252743e71090a061"
			},
			openId: "",
		},
		onShow: function() {
			this.upApp();
		},
		methods: {
			// 点击复制
			copy: function(data) {
				uni.setClipboardData({
					data,
					success: function() {
						uni.showToast({
							icon: "none",
							duration: 2000,
							title: "复制成功"
						})
					}
				});
			},
			upApp: function() {
				/**
				 * 检测当前的小程序
				 * 是否是最新版本，是否需要下载、更新
				 */
				const updateManager = uni.getUpdateManager();
				updateManager.onCheckForUpdate(function(res) {
					// 请求完新版本信息的回调
					console.log('请求完新版本信息的回调', res);
				});
				updateManager.onUpdateReady(function(res) {
					uni.showModal({
						title: '更新提示',
						content: '新版本已经准备好，是否重启应用？',
						success(res) {
							if (res.confirm) {
								// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
								updateManager.applyUpdate();
							}
						}
					});

				});
				updateManager.onUpdateFailed(function(res) {
					console.log("新版本下载失败")
					uni.showModal({
						title: '新版本已发布',
						content: '请您删除当前小程序，到微信 “发现-小程序” 页，重新搜索打开',
						showCancel: false
					})
				});
			},
		}
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
</style>
