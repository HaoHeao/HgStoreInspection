<script>
	let config = {
		// 每页的数据
		pagesize: 20
	};
	export default {
		globalData: {
			system: {
				version: "0.8.5",
				lastmodified: "2020/08/28",
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
	page {
		height: auto;
		font-size: 28rpx;
	}

	.container {
		width: 100%;
	}

	*::-webkit-scrollbar {
		display: none;
	}

	*::-webkit-scrollbar {
		width: 5px;
		height: 8px;
		background-color: #aaa;
	}

	/* Add a thumb */
	*::-webkit-scrollbar-thumb {
		background: #000;
	}

	image {
		height: auto;
	}

	.img {
		width: 100%;
	}

	.fadeIn {
		animation: fadeIn 300ms linear;
	}

	.fadeIn500 {
		animation: fadeIn 500ms linear;
	}

	.fadeIn800 {
		animation: fadeIn 800ms linear;
	}

	@keyframes fadeIn {
		0% {
			opacity: 0.2;
		}

		100% {
			opacity: 1;
		}
	}

	.no-data {
		padding-top: 320rpx;
		text-align: center;

		.img-v {
			width: 184rpx;
			height: 176rpx;
			margin: auto auto;

			.img {
				width: 100%;
				height: 100%;
			}
		}

		.txt {
			padding-top: 30rpx;
			width: 100%;
			color: #C1C7CE;
			font-size: 20rpx;
			text-align: center;
		}
	}

	// 没有更多数据
	.null-data {
		width: 100%;
		height: 20rpx;
		margin: 40rpx 0rpx;
		position: relative;

		.text {
			width: auto;
			height: 20rpx;
			white-space: nowrap;
			line-height: 20rpx;
			text-align: center;
			position: absolute;
			left: calc(50% - 78rpx);
			top: 0rpx;
			z-index: 2;
			padding: 0rpx 20rpx;
			background: #F6F7F9;
			color: #B6C6D6;
			font-size: 20rpx;
		}

		.line {
			width: 310rpx;
			height: 1rpx;
			background: #B6C6D6;
			position: absolute;
			left: calc(50% - 145rpx);
			top: 10rpx;
			z-index: 1;
		}
	}



	// 没有更多记录
	.replay-null {
		width: 100%;
		margin-bottom: 140rpx;

		.none {
			width: 100%;
			height: 20rpx;
			margin: 40rpx 0rpx;
			position: relative;

			.txt {
				width: 136rpx;
				height: 20rpx;
				white-space: nowrap;
				line-height: 20rpx;
				text-align: center;
				position: absolute;
				left: calc(50% - 78rpx);
				top: 0rpx;
				z-index: 2;
				padding: 0rpx 20rpx;
				background: #E5EDF1;
				color: #B6C6D6;
				font-size: 20rpx;
			}

			.line {
				width: 310rpx;
				height: 1rpx;
				background: #B6C6D6;
				position: absolute;
				left: calc(50% - 145rpx);
				top: 10rpx;
				z-index: 1;
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
		z-index: 998;
		margin-bottom: env(safe-area-inset-bottom);
		opacity: 0.9;
		letter-spacing: 10rpx;

		&:active {
			opacity: 0.8;
		}
	}
</style>
