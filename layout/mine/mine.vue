<template>
	<view class="container">
		<view class="user-head">
			<view class="head-view">
				<view class="head-mark">😃</view><!-- 头像 -->
				<view class="head-user">
					<open-data type="userAvatarUrl" class="img"></open-data>
				</view>
			</view>
		</view>
		<view class="user-name">
			<open-data type="userNickName" lang="zh_CN" class="text"></open-data>
		</view>
		<view class="user-info">{{userinfo.deptname}} - {{userinfo.username}}</view>
		<view class="control">
			<navigator class="item" url="/layout/changeIPhone/changeIPhone">
				<image src="@/static/icon/phone.svg" mode="widthFix" class="icon"></image>
				<view class="title">修改手机号</view>
				<image src="@/static/icon/right.svg" mode="widthFix" class="right"></image>
			</navigator>
			<navigator class="item" url="/layout/changePassword/changePassword">
				<image src="@/static/icon/password.svg" mode="widthFix" class="icon"></image>
				<view class="title">修改密码</view>
				<image src="@/static/icon/right.svg" mode="widthFix" class="right"></image>
			</navigator>
		</view>
		<view :class="['logout',logoutLoading?'loading':'']" @click="logout()">
			<u-loading :show="logoutLoading" mode="circle" size="28"></u-loading>{{logoutLoading?'':'退出登录'}}
		</view>
		<view class="version">{{setting.systemName}} 版本({{setting.version}})</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				logoutLoading: false
			}
		},
		computed: {
			setting() {
				return this.$store.state.setting
			},
			userinfo() {
				return this.utils.getUserInfo()
			}
		},
		methods: {
			async sendLogout() {
				try {
					this.logoutLoading = true
					let data = await uni.request({
						url: `${this.api.layout_logout}${this.setting.openId}`
					})
					this.logoutLoading = false
					let [err, success] = data
					console.log('退出登录成功------>>>', err, success)
					if (!err && success.data.success) {
						this.$store.state.setting.hasLogin = false
						this.$store.state.setting.userinfo = ''
						this.$store.state.setting.openId = ''
						this.$store.state.home.tabbarIndex = '0'
					} else {
						uni.showToast({
							title: err ? err : success.data.errmsg,
							icon: 'none',
							duration: 3000
						});
					}
				} catch (e) {
					this.logoutLoading = false
					console.log(e)
				}
			},
			logout() {
				let _this = this;
				uni.showModal({
					content: "确认退出登录?",
					success: async res => {
						if (res.confirm) {
							await _this.sendLogout()
						}
					}
				})
			},
		},
		created: function() {
			uni.setNavigationBarTitle({
				title: "我的主页"
			});
		}
	}
</script>

<style scoped lang="scss">
	.container {
		width: 100%;
		height: calc(100vh - 100rpx);
		background: #f6f7f9;

		.user-head {
			width: 100%;
			padding: 3vh 0rpx;

			.head-view {
				width: 130rpx;
				height: 130rpx;
				overflow: hidden;
				border-radius: 50%;
				position: relative;
				margin-left: calc(50% - 65rpx);

				.head-mark {
					position: absolute;
					left: 0;
					top: 0;
					z-index: 1;
					width: 100%;
					height: 100%;
					background: #647484;
					text-align: center;
					line-height: 130rpx;
					white-space: nowrap;
					color: #fff;
				}

				.head-user {
					position: absolute;
					left: 0;
					top: 0;
					z-index: 2;
					width: 100%;
					height: 100%;

					.img {
						width: 100%;
						height: 100%;
					}
				}
			}
		}

		.user-name {
			width: 100%;
			height: 40rpx;
			line-height: 40rpx;
			text-align: center;
			color: #647484;
			font-size: 20rpx;

			.text {
				width: 100%;
				text-align: center;
			}
		}

		.user-info {
			width: 100%;
			text-align: center;
			color: #323436;
			font-size: 28rpx;
			padding-bottom: 1vh;
		}

		.control {
			width: calc(100% - 36rpx);
			margin: 18rpx;
			border-radius: 10rpx;
			background: #fff;
			overflow: hidden;

			.item {
				padding: 26rpx 26rpx;
				display: flex;
				justify-content: flex-start;
				// box-sizing:border-box;
				align-items: center;
				border-bottom: 1rpx solid transparent;
				position: relative;

				&:before {
					content: '';
					display: block;
					width: calc(100% - 52rpx);
					height: 1rpx;
					background: #EDEEEF;
					position: absolute;
					left: 26rpx;
					bottom: -1rpx;
				}

				&:active {
					background: #f2f2f2;
					animation: fadeIn 300ms;
				}

				.icon {
					width: 32rpx;
					margin-right: 10rpx;
				}

				.title {
					font-size: 28rpx;
					color: #323436;
					flex: 2;
				}

				.right {
					width: 28rpx;
				}
			}

			.item:last-child {
				&:before {
					display: none;
				}
			}
		}

		// 退出登录
		.logout {
			width: calc(100% - 60rpx);
			height: 100rpx;
			line-height: 100rpx;
			border-radius: 50rpx;
			font-size: 28rpx;
			margin: 0 auto;
			margin-top: 100rpx;
			background: #647484;
			text-align: center;
			color: #fff;
			transition: 300ms;

			&:active {
				opacity: 0.9;
				box-shadow: 0 10rpx 10rpx 0 rgba(0, 0, 0, 0.3);
			}

			&.loading {
				width: 100rpx;
				opacity: 0.9;
				box-shadow: 0 10rpx 10rpx 0 rgba(0, 0, 0, 0.3);
			}
		}
	}

	.version {
		padding: 5vh 0vh;
		width: 100%;
		height: 20rpx;
		line-height: 20rpx;
		font-size: 22rpx;
		color: #B6C6D6;
		text-align: center;
	}
</style>
