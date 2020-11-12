<template>
	<view class="container">
		<view class="title">请登录</view>
		<view class="label-input">
			<image class="icon" src="@/static/login_phone.png" mode="widthFix"></image>
			<input type="number" :disabled="loading" placeholder-style="color:#B6C6D6;" class="input" placeholder="手机号/工号"
			 v-model="username">
		</view>
		<view class="label-input">
			<image class="icon" src="@/static/login_pwd.png" mode="widthFix"></image>
			<input type="password" :disabled="loading" placeholder-style="color:#B6C6D6;" class="input" placeholder="密码" v-model="password">
		</view>
		<view :class="['login-btn',loading?'loading':'']" @click="login()">
			<u-loading :show="loading" mode="circle" size="28"></u-loading>{{loading?'':'登录'}}
		</view>
		<view class="version">{{setting.systemName}} 版本({{setting.version}})</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				username: "",
				password: "",
				loading: false,
				wxloginCode: ''
			}
		},
		computed: {
			userinfo() {
				return this.utils.getUserInfo(uni)
			},
			setting() {
				return this.$store.state.setting
			}
		},
		methods: {
			requestLogin() {
				let _this = this;
				request.login({
						loginid: _this.username,
						pwd: _this.password,
						openid: globalData.openId
					})
					.then(data => {
						let [err, res] = data;
						console.log("登录信息:", err, res);
						uni.hideLoading();
						if (err) {
							uni.showToast({
								icon: "none",
								duration: 3000,
								title: "登录失败:" + res.data.errmsg
							})
						}
						if (res.data.success) {
							console.log("登录成功", res.data)
							globalData.userinfo = res.data.data.userinfo;
							// 存入storage
							uni.setStorageSync("userinfo", res.data.data.userinfo);
							// utils.getModelList(globalData.userinfo.usernumber, this);
							uni.redirectTo({
								url: '../index/index'
							});
						} else {
							uni.showToast({
								icon: "none",
								duration: 3000,
								title: "登录失败:" + res.data.errmsg
							})
						}
					})
			},
			async login() {},
			// 微信登录
			async wxLogin() {
				let data = await new Promise(resolve => {
					uni.login().then(data => resolve(data))
				});
				let [err, success] = data
				console.log('微信登录成功------>>>', data)
				if (!err && success.code) {
					this.wxloginCode = success.code
				} else {
					uni.showModal({
						title: '微信登录失败',
						showCancel: false,
						content: err ? err : success
					});
				}
			},
			// 获取openid
			async getOpenId() {
				if (!this.wxloginCode) return
				try {
					let data = await uni.request({
						url: `${this.api.getOpenid}?code=${this.wxloginCode}&appId=${this.setting.appId}`,
						method: "POST"
					})
					let [err, success] = data
					console.log('获取openid------>>>', err, success)
					if (!err && success.data.data.openId) {
						this.$store.state.setting.openId = success.data.data.openId
					} else {
						uni.showModal({
							title: 'openId获取失败',
							showCancel: false,
							content: err ? err : success
						});
					}
				} catch (e) {
					console.log(e)
				}
			},
			// openId登录
			async openidLogin() {
				try {
					this.loading = true
					await this.delay(3000)
					let data = await uni.request({
						url: `${this.api.layout_openidLogin}${this.setting.openId}`,
					})
					this.loading = false
					let [err, success] = data
					console.log('openId登录------>>>', err, success)
					if (!err && success.data.success) {
						this.$store.state.setting.hasLogin = true
					}
				} catch (e) {
					this.loading = false
					console.log(e)
				}
			},
			// 手动登录
			async login() {}
		},
		created: async function() {
			// 静默登录
			await this.wxLogin()
			await this.getOpenId()
			await this.openidLogin()
			console.log(this.setting)
		},
		// 分享
		onShareAppMessage() {}
	}
</script>

<style scoped lang="scss">
	.container {
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;

		.title {
			color: #323436;
			font-size: 60rpx;
			font-weight: 800;
			padding: 0 0 30rpx 40rpx;
		}

		.label-input {
			width: calc(100% - 60rpx);
			margin: 0rpx 30rpx;
			margin-bottom: 40rpx;
			display: flex;
			align-items: center;
			border-radius: 10rpx;
			overflow: hidden;
			background: #F3F5F7;

			.icon {
				width: 28rpx;
				padding: 26rpx;
			}

			.input {
				height: 100rpx;
				color: #323436;
				font-size: 26rpx;
			}
		}

		.login-btn {
			width: calc(100% - 60rpx);
			line-height: 100rpx;
			margin: 0rpx 30rpx;
			text-align: center;
			color: #fff;
			background: #647484;
			font-size: 28rpx;
			font-weight: 800;
			border-radius: 50rpx;
			margin-top: 100rpx;
			margin-bottom: 200rpx;
			transition: 300ms;

			&:active {
				opacity: 0.9;
				box-shadow: 0 10rpx 10rpx 0 rgba(0, 0, 0, 0.3);
			}

			&.loading {
				opacity: 0.9;
				box-shadow: 0 10rpx 10rpx 0 rgba(0, 0, 0, 0.3);
			}
		}
	}

	.version {
		position: fixed;
		left: 0;
		bottom: 50rpx;
		width: 100vw;
		line-height: 20rpx;
		font-size: 24rpx;
		color: #B6C6D6;
		text-align: center;
		padding-bottom: env(safe-area-inset-bottom);
	}
</style>
