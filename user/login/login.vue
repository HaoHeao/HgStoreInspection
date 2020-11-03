<template>
	<view class="container">
		<view v-if="loading">
			<view class="title">请登录</view>
			<view class="input-view">
				<view class="icon">
					<image class="img" src="../../static/login_phone.png" mode="widthFix"></image>
				</view>
				<input type="number" placeholder-style="color:#B6C6D6;" class="input username fadeIn" placeholder="手机号/工号" v-model="username">
			</view>
			<view class="input-view">
				<view class="icon">
					<image class="img" src="../../static/login_pwd.png" mode="widthFix"></image>
				</view>
				<input type="password" placeholder-style="color:#B6C6D6;" class="input pwd fadeIn" placeholder="密码" v-model="password">
			</view>
			<view class="login fadeIn" @click="loginUser()">登录</view>
		</view>
		<view class="version">{{systemName}} 版本({{version}})</view>
	</view>
</template>

<script>
	let globalData = getApp().globalData;
	let utils = require('@/util/utils.js');
	let request = utils.api;
	export default {
		data() {
			return {
				username: "",
				password: "",
				version: globalData.system.version,
				systemName: globalData.system.systemName,
				loading: false
			}
		},
		methods: {
			login: function() {
				if (!uni.getStorageSync('userinfo')) {
					uni.showLoading({
						title: "正在登录,请稍后",
						mask: false
					})
				}
				this.loading = false;
				let _this = this;
				uni.login().then(data => {
					let [err, res] = data;
					console.log("微信自动登录：", err, res, globalData.system.appId);
					if (err) {
						uni.hideLoading();
						_this.loading = true;
						uni.showToast({
							icon: "none",
							duration: 2000,
							title: "微信登录失败,请检查网络"
						})
						return;
					}
					request.getOpenId({
							code: res.code,
							appId: globalData.system.appId
						})
						.then(data => {
							console.log(data)
							let [err, res] = data;
							console.log("openId解析返回信息：", err, res);
							if (!err && res.data.data) {
								// if (err == null && res.data.data) {
								let openId = res.data.data.openId;
								globalData.openId = openId;
								request.loginOpenid({
										openId: globalData.openId
									})
									.then(data => {
										let [err, res] = data;
										console.log("openid登录", err, res)
										uni.hideLoading();
										if (err == null && res.data.success) {
											globalData.userinfo = res.data.data.userinfo;
											// utils.getModelList(globalData.userinfo.usernumber, this);

											// 存入storage
											uni.setStorageSync("userinfo", res.data.data.userinfo);
											uni.redirectTo({
												url: '../index/index'
											});
											_this.loading = true;
										} else {
											_this.loading = true;
										}
									})
							} else {
								uni.hideLoading()
								_this.loading = true;
								uni.showModal({
									title: err ? err.errMsg : res,
									showCancel:false
								});
							}
						});
				})
			},
			loginUser: function() {
				let _this = this;
				console.log("手动登录信息:", this.username, this.password, globalData.openId)
				uni.showLoading({
					title: "正在登录,请稍后",
					mask: false
				})
				if (globalData.openId) {
					this.requestLogin()
				} else {
					uni.login().then(data => {
						let [err, res] = data;
						console.log("微信登录：", err, res, globalData.system.appId)
						if (err) {
							uni.hideLoading();
							uni.showToast({
								icon: "none",
								duration: 2000,
								title: "微信登录失败:" + err.errMsg
							})
							return;
						}
						request.getOpenId({
								code: res.code,
								appId: globalData.system.appId
							})
							.then(data => {
								let [err, res] = data;
								console.log("openId解析返回信息：", err, res);
								if (err == null && res.data.data) {
									let openId = res.data.data.openId;
									globalData.openId = openId;
									console.log("登录中...", res);
									// 存入storage
									globalData.userinfo = res.data.data.userinfo;
									// utils.getModelList(globalData.userinfo.usernumber, this);
									uni.setStorageSync("userinfo", res.data.data.userinfo);
									this.requestLogin();
								} else {
									uni.hideLoading();
									uni.showToast({
										icon: "none",
										duration: 3000,
										title: "登录失败:" + err.errMsg
									})
								}
							})
					})
				}
			},
			requestLogin: function() {
				let _this = this;
				// console.log('手动登录信息',_this.username,_this.password,_this.uni.getStorageSync('openid'))
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
			}
		},
		onShow() {
			// 静默登录
			this.login()
		},
		// 分享
		onShareAppMessage() {
		}
	}
</script>

<style scoped lang="scss">
	.container {
		.title {
			color: #323436;
			font-size: 52rpx;
			font-weight: 800;
			padding: 270rpx 0rpx 70rpx 40rpx;
		}

		.input-view {
			position: relative;
			margin-bottom: 40rpx;

			.icon {
				position: absolute;
				left: 58rpx;
				top: 28rpx;
				width: 26rpx;
				height: 36rpx;

				.img {
					width: 100%;
					height: 100%;
				}
			}

			.input {
				width: calc(100% - 60rpx);
				height: 88rpx;
				margin: 0rpx 30rpx;
				box-sizing: border-box;
				padding: 0rpx 70rpx;
				padding-right: 20rpx;
				background: #F3F5F7;
				color: #323436;
				border-radius: 10rpx;
				font-size: 26rpx;
			}
		}

		.login {
			width: calc(100% - 60rpx);
			height: 80rpx;
			line-height: 80rpx;
			margin: 0rpx 30rpx;
			text-align: center;
			color: #fff;
			background: #647484;
			font-size: 28rpx;
			font-weight: 800;
			border-radius: 40rpx;
			margin-top: 210rpx;

			&:active {
				opacity: 0.9;
			}
		}
	}
</style>
<style lang="scss">
	.version {
		position: fixed;
		left: 0;
		bottom: 120rpx;
		width: 750rpx;
		height: 20rpx;
		line-height: 20rpx;
		font-size: 20rpx;
		color: #B6C6D6;
		text-align: center;
		padding-bottom: env(safe-area-inset-bottom);
	}
</style>
