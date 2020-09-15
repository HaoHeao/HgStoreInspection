<!-- 界面展示信息 -->
<template>
	<view class="container detail">
		<haoheao-scroll class="haoheao-scroll" ref="scroll" @onPullDown="onPullDown">
			<view class="view-item fadeIn">
				<view class="detail-control">
					<view class="state">会议未开始</view>
				</view>
				<view class="title">考核主题考核主题考核主题考核主题考核主题考核主题考核主题考核主题</view>
				<view class="item">
					<view class="title">考核时间</view>
					<view class="content">2020/09/10 - 2020/09/14</view>
				</view>
				<view class="item">
					<view class="title">考核对象</view>
					<view class="content">后厨</view>
				</view>
				<view class="item">
					<view class="title">考核内容</view>
					<view class="content">考核内容考核内容考核内容考核内容</view>
				</view>
				<view class="bottom-btns">
					<view class="item person">参与人次：5次</view>
					<view class="item assessment">考核</view>
				</view>
			</view>
			<view class="view-item">
				<view class="item">
					<view class="title">位置</view>
				</view>
				<view class="questions">
					<view class="item">
						<view class="title">1.考核题目考核题目考核题目</view>
						<view class="content">
							<view class="answer">答</view>
							<view class="answer-txt">答案答案答案答案答案答案答案答案答案答案答案</view>
						</view>
					</view>
				</view>
			</view>
		</haoheao-scroll>
		<!-- <popup ref="loading_time" type="bottom">
			<view class="popup">
			
			</view>
		</popup> -->
	</view>
</template>

<script>
	import popup from '@/components/uni-popup/uni-popup.vue'
	export default {
		components: {
			popup
		},
		data() {
			return {

			}
		},
		methods: {

		},
		onLoad: async function(option) {

		},
		onShow: function() {}
	}
</script>

<style lang="scss" scoped>
	@import '@/styles/detail.scss';
	@import '@/styles/popup.scss';

	.container.detail .view-item .detail-control {
		.state {
			background: #999;

			&.active {
				background: #D56C68;
			}
		}
	}

	.container.detail {
		.control-list {
			position: static;
			background: transparent;
			padding: 0;

			.item {
				.replacement {
					color: #fff;
					background: #D56C68;
					border-radius: 50%;
					width: 30rpx;
					height: 30rpx;
					text-align: center;
					line-height: 30rpx;
					font-size: 22rpx;
					justify-content: center;
					margin-right: 10rpx;
				}
			}
		}
	}

	.popup {
		padding: 30rpx;

		.item-view {
			display: flex;
			align-items: center;
			color: #647484;
			margin-bottom: 30rpx;

			.icon {
				width: 40rpx;
				height: 40rpx;
				margin-right: 10rpx;
			}

			.title {
				white-space: nowrap;
				margin-right: 20rpx;
			}

			.content {
				flex: 2;
			}

			&.select {
				position: relative;

				.content {
					line-height: 80rpx;
					padding: 0 20rpx;
					color: #647484;
					background: #F3F5F7;
					border-radius: 10rpx;

					&.active {
						color: #647484;
					}
				}

				.select-icon {
					width: 24rpx;
					height: 24rpx;
					position: absolute;
					right: 20rpx;
					top: calc(50% - 12rpx);
					z-index: 999;
					transition: .2s;

					&.active {
						transform: rotate(90deg);
					}
				}
			}
		}

		// 会议室预约列表
		.meeting-list {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;

			.item {
				display: flex;
				align-items: center;
				background: #F3F5F7;
				border-radius: 10rpx;
				width: calc(100%/2 - 15rpx);
				margin-bottom: 20rpx;
				padding: 10px 10px;
				box-sizing: border-box;
				font-size: 26rpx;

				.left {
					flex: 2;
				}

				.time {
					font-weight: 900;
					color: #647484;
				}

				.name {
					font-size: 24rpx;
					color: #ccc;
				}

				.radio {
					zoom: 0.8;
				}

				>.state {
					font-size: 24rpx;
					color: #ccc;
				}

				&.refuse {
					border: 1px dashed #BBBBBB;
					background: #F2F2F2;

					.time {
						color: #B2B2B2;
					}

					.name {
						color: #CCCCCC;
					}

					.radio {
						display: none;
					}

					.refuse-text {
						color: #CCCCCC;
						font-size: 24rpx;
					}
				}
			}
		}

		.bottom-control {
			position: static;

			.left {
				color: #CCCCCC;
				font-size: 26rpx;
			}

			.refuse {
				background: #D56C68 !important;
			}
		}
	}
</style>
