<template>
	<view class="container">
		<view class="view-item">
			1
		</view>
		<view class="view-item">
			2
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		computed: {

		},
		methods: {

		},
		onLoad: function(option) {
			console.log('详细信息 option', option)
		},
		onShow: function() {

		}
	}
</script>

<style lang="scss" scoped>
	.container {
		box-sizing: border-box;
		min-height: 100vh;
		background: #F6F7F9;
		padding-top: 1rpx;
		/* IOS XR */
		padding-bottom: env(safe-area-inset-bottom);
		/* ------ */

		.view-item {
			margin: 20rpx;
			background: #fff;
			border-radius: 10rpx;
		}
	}
</style>
