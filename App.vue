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
			serverTime: "",
			/* 会议时预订 */
			max_booking_date: 14 // 最多可预订至多少天后
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
			// 去掉空格
			trim: function(str) {
				return str.replace(/(\s*$)/g, "");
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
	// page {
	// 	height: auto;
	// 	font-size: 28rpx;
	// }

	// .container {
	// 	width: 100%;
	// }

	// *::-webkit-scrollbar {
	// 	display: none;
	// }

	// *::-webkit-scrollbar {
	// 	width: 5px;
	// 	height: 8px;
	// 	background-color: #aaa;
	// }

	// /* Add a thumb */
	// *::-webkit-scrollbar-thumb {
	// 	background: #000;
	// }

	image {
		height: auto;
	}

	.no-data-view {
		width: 100%;
		// min-height: 100%;
		height: 50vh;
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		align-items: center;

		.center {
			.icon {
				width: 250rpx;
				height: 250rpx;
			}

			.tip {
				min-width: 100%;
				font-size: 24rpx;
				color: #999;
				text-align: center;
			}
		}
	}
	
	// 对此记录进行回复
	.replay-btn {
		width: calc(100% - 40rpx);
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		margin: 10rpx 20rpx;
		border-radius: 40rpx;
		color: #fff;
		background: #647484;
		font-size: 28rpx;
		position: fixed;
		left: 0;
		bottom: 10rpx;
		z-index: 1;
		margin-bottom: env(safe-area-inset-bottom);
		opacity: 0.9;
		letter-spacing: 10rpx;

		&:active {
			opacity: 0.8;
		}
	}
</style>
