<template>
	<view class="container">
		<view class="title">原密码</view>
		<input type="text" class="input-view" v-model.trim="oldPwd" placeholder="请填写原密码">
		<view class="title">新密码</view>
		<input type="text" class="input-view" v-model.trim="newPwd" placeholder="请填写新密码">
		<view class="title">确认密码</view>
		<input type="password" class="input-view" v-model.trim="confPwd" placeholder="请再次确认新密码">
		<view :class="['confirm-btn',btnLoading?'loading':'']" @click="change()">
			<u-loading :show="btnLoading" mode="circle" size="28"></u-loading>{{btnLoading?'':'确认修改'}}
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				oldPwd: '',
				newPwd: '',
				confPwd: '',
				btnLoading: false,
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
						uni.reLaunch({
							url: '/layout/index/index'
						});
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
			async change() {
				if (!this.oldPwd) {
					uni.showToast({
						icon: "none",
						title: "请填写原密码"
					})
					return;
				}
				if (!this.newPwd) {
					uni.showToast({
						icon: "none",
						title: "请填写新密码"
					})
					return;
				}
				if (this.newPwd != this.confPwd) {
					uni.showToast({
						icon: "none",
						title: "两次密码输入不一致！"
					})
					return;
				}
				try {
					this.btnLoading = true
					let data = await uni.request({
						url: this.api.layout_changePassword,
						method: "POST",
						data: {
							userid: this.userinfo.userid,
							oldpwd: this.oldPwd,
							newpwd: this.confPwd
						}
					})
					this.btnLoading = false
					let [err, success] = data
					console.log('修改密码成功------>>>', err, success)
					if (!err && success.data.success) {
						await this.sendLogout()
					} else {
						uni.showToast({
							title: err ? err : success.data.errmsg,
							icon: 'none',
							duration: 3000
						});
					}
				} catch (e) {
					this.btnLoading = false
					console.log(e)
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.container {
		.title {
			color: #647484;
			font-size: 26rpx;
			font-weight: 800;
			margin: 20rpx 0rpx 10rpx 50rpx;
		}

		.input-view {
			width: calc(100% - 60rpx);
			height: 88rpx;
			font-size: 26rpx;
			background: #F3F5F7;
			border-radius: 10rpx;
			margin: 0rpx 30rpx;
			padding: 26rpx 10rpx 26rpx 20rpx;
			box-sizing: border-box;
		}

		.confirm-btn {
			width: calc(100% - 60rpx);
			height: 100rpx;
			margin: auto;
			margin-top: 100rpx;
			background: #647484;
			color: #fff;
			border-radius: 50rpx;
			text-align: center;
			line-height: 100rpx;
			font-weight: 800;
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
</style>
