<template>
	<block v-if="!infoDetail.status">
		<view class="skeleton mode">
			<view class="shadow-state backcolor"></view>
			<view class="shadow-title backcolor"></view>
			<view class="shadow-border backcolor2"></view>
			<view class="shadow-line">
				<view class="shadow-row left backcolor"></view>
				<view class="shadow-row right backcolor"></view>
			</view>
			<view class="shadow-line">
				<view class="shadow-row left backcolor"></view>
				<view class="shadow-row right backcolor"></view>
			</view>
			<view class="shadow-line">
				<view class="shadow-row left backcolor"></view>
				<view class="shadow-row right backcolor"></view>
			</view>
			<view class="shadow-line">
				<view class="shadow-row left backcolor"></view>
				<view class="shadow-row right backcolor"></view>
			</view>
			<view class="shadow-line">
				<view class="shadow-row left backcolor"></view>
				<view class="shadow-row right backcolor"></view>
			</view>
		</view>
		<view class="skeleton mode"></view>
		<view class="skeleton mode"></view>
		<view class="skeleton mode"></view>
		<view class="skeleton mode"></view>
		<view class="skeleton mode"></view>
	</block>
</template>

<script>
	export default {
		props: [],
		data() {
			return {

			}
		},
		onShow() {},
		methods: {}
	}
</script>

<style lang="scss" scoped>
	.skeleton.mode {
		background: #f2f2f2;
	}

	.backcolor {
		background: #e9e9e9;
	}

	.backcolor2 {
		background: #e1e1e1;
	}

	.skeleton {
		border-radius: 10rpx;
		margin: 20rpx;
		padding: 20rpx;
		width: calc(100vw - 80rpx);

		.shadow-state {
			border-radius: 40rpx;
			width: 125rpx;
			height: 44rpx;
		}

		.shadow-title {
			width: 100%;
			height: 55rpx;
			margin: 20rpx 0rpx;
			border-radius: 10rpx;
		}

		.shadow-border {
			height: 1rpx;
			margin-top: 20rpx;
		}

		.shadow-line {
			margin-top: 20rpx;
			display: flex;
			align-items: center;

			.shadow-row {
				height: 44rpx;
			}

			.shadow-row.left {
				width: 120rpx;
				margin-right: 30rpx;
			}

			.shadow-row.right {
				flex: 2;
			}
		}
	}
</style>
