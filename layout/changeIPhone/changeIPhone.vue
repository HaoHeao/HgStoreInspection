<template>
	<view class="container">
		<view class="title">原手机号</view>
		<input type="number" class="input-view" v-model.trim="oldPhone" placeholder="请填写原手机号">
		<view class="title">新手机号</view>
		<input type="number" class="input-view" v-model.trim="newPhone" placeholder="请填写新手机号">
		<view :class="['confirm-btn',btnLoading?'loading':'']" @click="change()">
			<u-loading :show="btnLoading" mode="circle" size="28"></u-loading>{{btnLoading?'':'确认修改'}}
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				oldPhone: "",
				newPhone: "",
				btnLoading: false,
			}
		},
		computed: {
			userinfo() {
				return this.utils.getUserInfo()
			}
		},
		methods: {
			async change() {
				if (!this.oldPhone) {
					uni.showToast({
						icon: "none",
						title: "请填写原手机号"
					})
					return;
				}
				if (!this.newPhone) {
					uni.showToast({
						icon: "none",
						title: "请填写新手机号"
					})
					return;
				}
				try {
					this.btnLoading = true
					let data = await uni.request({
						url: this.api.layout_changeIPhone,
						method: "POST",
						data: {
							userid: this.userinfo.userid,
							oldmobile: this.oldPhone,
							newmobile: this.newPhone
						}
					})
					this.btnLoading = false
					let [err, success] = data
					console.log('修改手机号成功------>>>', err, success)
					if (!err && success.data.success) {
						uni.showToast({
							icon: "none",
							title: "修改成功"
						})
						await this.delay(300)
						wx.navigateBack({
							delta: 1
						})
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
