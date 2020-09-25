<template>
	<view class="container">
		<view class="head">
			<view class="left">共 3 条</view>
			<view class="center"></view>
			<view class="right">
				<view class="filter" @click="filterLoading?($refs['popup'].close(),filterLoading = false):($refs['popup'].open(),filterLoading = true)">
					<image src="@/static/icon/screen.svg" mode="widthFix" class="icon"></image>
					筛选
				</view>
			</view>
		</view>
		<view class="main">
			<swiper class="swiper" circular="true" :autoplay="false" duration="100" :current="current" @change="swiperChange">
				<swiper-item class="swiper-item">
					<haoheao-scroll class="haoheao-scroll" ref="scroll" @onPullDown="onPullDown">
						<view class="item">
							<view class="question">
								<view class="txt">问题问题问题问题问题</view>
								<view class="date">2020-09-24 15:33</view>
							</view>
							<view class="place"><text class="label">位置：</text>位置位置位置</view>
							<view class="info">
								<view class="num active">3条</view>
								<view class="btn-list">
									<view class="btn">复核</view>
								</view>
							</view>
						</view>
						<view class="item">
							<view class="question">
								<view class="txt">问题问题问题问题问题题问题问题题问题问题题问题问题题问题问题题问题问题</view>
								<view class="date">2020-09-24 15:33</view>
							</view>
							<view class="place"><text class="label">位置：</text>位置位置位置</view>
							<view class="info">
								<view class="num">3条</view>
								<view class="btn-list">
									<view class="btn">复核</view>
								</view>
							</view>
						</view>
						<view class="item">
							<view class="question">
								<view class="txt">问题问题问题问题问题题问题问题题问题问题题问题问题题问题题题问题问题题问题问题题问题题题问题问题题问题问题题问题问题题问题问题</view>
								<view class="date">2020-09-24 15:33</view>
							</view>
							<view class="place"><text class="label">位置：</text>位置位置位置</view>
							<view class="info">
								<view class="num">3条</view>
								<view class="btn-list">
									<view class="btn">复核</view>
								</view>
							</view>
						</view>
						<view class="item">
							<view class="question">
								<view class="txt">问题问题问题问题问题题问题问题题问题问题题问题问题题问题题题问题问题题问题问题题问题题题问题问题题问题问题题问题问题题问题问题</view>
								<view class="date">2020-09-24 15:33</view>
							</view>
							<view class="place"><text class="label">位置：</text>位置位置位置</view>
							<view class="info">
								<view class="num">3条</view>
								<view class="btn-list">
									<view class="btn">复核</view>
								</view>
							</view>
						</view>
						<view class="item">
							<view class="question">
								<view class="txt">问题问题问题问题问题题问题问题题问题问题题问题问题题问题题题问题问题题问题问题题问题题题问题问题题问题问题题问题问题题问题问题</view>
								<view class="date">2020-09-24 15:33</view>
							</view>
							<view class="place"><text class="label">位置：</text>位置位置位置</view>
							<view class="info">
								<view class="num">3条</view>
								<view class="btn-list">
									<view class="btn">复核</view>
								</view>
							</view>
						</view>
						<view class="item">
							<view class="question">
								<view class="txt">问题问题问题问题问题题问题问题题问题问题题问题问题题问题题题问题问题题问题问题题问题题题问题问题题问题问题题问题问题题问题问题</view>
								<view class="date">2020-09-24 15:33</view>
							</view>
							<view class="place"><text class="label">位置：</text>位置位置位置</view>
							<view class="info">
								<view class="num">3条</view>
								<view class="btn-list">
									<view class="btn">复核</view>
								</view>
							</view>
						</view>
						<view class="item">
							<view class="question">
								<view class="txt">问题问题问题问题问题题问题问题题问题问题题问题问题题问题题题问题问题题问题问题题问题题题问题问题题问题问题题问题问题题问题问题</view>
								<view class="date">2020-09-24 15:33</view>
							</view>
							<view class="place"><text class="label">位置：</text>位置位置位置</view>
							<view class="info">
								<view class="num">3条</view>
								<view class="btn-list">
									<view class="btn">复核</view>
								</view>
							</view>
						</view>
						<view class="item">
							<view class="question">
								<view class="txt">问题问题问题问题问题题问题问题题问题问题题问题问题题问题题题问题问题题问题问题题问题题题问题问题题问题问题题问题问题题问题问题</view>
								<view class="date">2020-09-24 15:33</view>
							</view>
							<view class="place"><text class="label">位置：</text>位置位置位置</view>
							<view class="info">
								<view class="num">3条</view>
								<view class="btn-list">
									<view class="btn">复核</view>
								</view>
							</view>
						</view>
						<view class="item">
							<view class="question">
								<view class="txt">问题问题问题问题问题题问题问题题问题问题题问题问题题问题题题问题问题题问题问题题问题题题问题问题题问题问题题问题问题题问题问题</view>
								<view class="date">2020-09-24 15:33</view>
							</view>
							<view class="place"><text class="label">位置：</text>位置位置位置</view>
							<view class="info">
								<view class="num">3条</view>
								<view class="btn-list">
									<view class="btn">复核</view>
								</view>
							</view>
						</view>
						<view class="item">
							<view class="question">
								<view class="txt">问题问题问题问题问题题问题问题题问题问题题问题问题题问题题题问题问题题问题问题题问题题题问题问题题问题问题题问题问题题问题问题</view>
								<view class="date">2020-09-24 15:33</view>
							</view>
							<view class="place"><text class="label">位置：</text>位置位置位置</view>
							<view class="info">
								<view class="num">3条</view>
								<view class="btn-list">
									<view class="btn">复核</view>
								</view>
							</view>
						</view>
						<view class="item">
							<view class="question">
								<view class="txt">问题问题问题问题问题题问题问题题问题问题题问题问题题问题题题问题问题题问题问题题问题题题问题问题题问题问题题问题问题题问题问题</view>
								<view class="date">2020-09-24 15:33</view>
							</view>
							<view class="place"><text class="label">位置：</text>位置位置位置</view>
							<view class="info">
								<view class="num">3条</view>
								<view class="btn-list">
									<view class="btn">复核</view>
								</view>
							</view>
						</view>
					</haoheao-scroll>
				</swiper-item>
				<swiper-item class="swiper-item">
					<haoheao-scroll class="haoheao-scroll" ref="scroll" @onPullDown="onPullDown">
						已整改
					</haoheao-scroll>
				</swiper-item>
				<swiper-item class="swiper-item">
					<haoheao-scroll class="haoheao-scroll" ref="scroll" @onPullDown="onPullDown">
						已完成
					</haoheao-scroll>
				</swiper-item>
			</swiper>
		</view>
		<uni-popup ref="popup" type="center">
			<view class="popup">
				<view class="content">
					<view class="title">日期段</view>
					<view class="item date">
						<view class="time">2019-09-24</view>
						<view class="txt">至</view>
						<view class="time">2020-09-24</view>
					</view>
					<view class="title">楼层</view>
					<view class="item floor">
						<view class="view">全部</view>
						<view class="view active">1F</view>
						<view class="view">2F</view>
						<view class="view active">3F</view>
						<view class="view">4F</view>
						<view class="view">5F</view>
					</view>
					<view class="title">主题</view>
					<view class="item theme">
						<view class="view active">全部</view>
						<view class="view">主题主题主题</view>
						<view class="view">主题主题主题主题主</view>
						<view class="view">主题主题主题主题主题主题主题主题3</view>
						<view class="view">主题主题主题主题主题主题1</view>
						<view class="view">主题主题主题主题主题主题主题主题主题主题主题主题2</view>
						<view class="view">主题主题主题主题主题主题主题主题3</view>
						<view class="view">主题主题主题主题主题主题1</view>
						<view class="view">主题主题题主题2</view>
						<view class="view">主题题3</view>
						<view class="view">主题主题主题主题主题主题1</view>
						<view class="view">主题主题主题主题主题主题主题主题主题主题主题主题2</view>
						<view class="view">主题主题主题主题主题主题主题主题3</view>
						<view class="view">主题主题主题主题主题主题1</view>
						<view class="view">主题主题主题主题主题主题主题主题主题主题主题主题2</view>
						<view class="view">主题主题主题主题主题主题主题主题3</view>
						<view class="view">主题主题主题主题主题主题1</view>
						<view class="view">主题主题主题主题主题主题主题主题主题主题主题主题2</view>
						<view class="view">主题主题主题主题主题主题主题主题3</view>
						<view class="view">主题主题主题主题主题主题1</view>
						<view class="view">主题主题主题主题主题主题主题主题主题主题主题主题2</view>
						<view class="view">主题主题主题主题主题主题主题主题3</view>
						<view class="view">主题主题主题主题主题主题1</view>
						<view class="view">主题主题主题主题主题主题主题主题主题主题主题主题2</view>
						<view class="view">主题主题主题主题主题主题主题主题3</view>
						<view class="view">主题主题主题主题主题主题1</view>
						<view class="view">主题主题主题主题主题主题主题主题主题主题主题主题2</view>
						<view class="view">主题主题主题主题主题主题主题主题3</view>
						<view class="view">主题主题主题主题主题主题1</view>
						<view class="view">主题主题主题主题主题主题主题主题主题主题主题主题2</view>
						<view class="view">主题主题主题主题主题主题主题主题3</view>
						<view class="view">主题主题主题主题主题主题1</view>
						<view class="view">主题主题主题主题主题主题主题主题主题主题主题主题2</view>
						<view class="view">主题主题主题主题主题主题主题主题3</view>
						<view class="view">主题主题主题主题主题主题1</view>
						<view class="view">主题主题主题主题主题主题主题主题主题主题主题主题2</view>
						<view class="view">主题主题主题主题主题主题主题主题3</view>
					</view>
				</view>
				<view class="btn-list">
					<view class="btn reset">重置</view>
					<view class="btn search">查询</view>
				</view>
			</view>
		</uni-popup>
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
				current: 0,
				// 筛选loading
				filterLoading: false
			}
		},
		computed: {

		},
		methods: {
			swiperChange: function(e) {
				console.log(e)
				// this.current = e.detail.current;
			},
		}
	}
</script>

<style scoped lang="scss">
	/deep/ .uni-popup {
		margin-top: 70rpx;
	}

	.container {
		min-height: 100vh;
		background: #F6F7F9;
		display: flex;
		flex-direction: column;

		.head {
			width: 100%;
			height: 70rpx;
			box-sizing: border-box;
			background: transparent;
			display: flex;
			justify-content: space-between;
			border-bottom: 1rpx solid #f6f7f9;

			.left {
				flex: 1;
				font-size: 26rpx;
				// font-weight: 800;
				line-height: 70rpx;
				padding-left: 20rpx;
			}

			.center {
				flex: 2;
				display: flex;
				justify-content: center;
				text-align: center;
				color: #323436;
				font-size: 28rpx;

				.btn-list {
					width: 340rpx;
					line-height: 70rpx;
					display: flex;
					justify-content: space-around;
					align-items: center;

					.item {
						width: 50%;
						height: 100%;
						font-size: 26rpx;
						text-align: center;
						color: #434343;
						position: relative;

						&:active {
							background: #f9f9f9;
							opacity: 0.9;
						}
					}

					.item.active {
						color: #323436;
						font-size: 28rpx;
						font-weight: 700;

						&::before {
							content: '';
							display: block;
							width: 100%;
							height: 4rpx;
							position: absolute;
							left: 0;
							bottom: 0;
							background: #1BA1F3;
						}
					}
				}
			}

			.right {
				flex: 1;
				display: flex;
				justify-content: flex-end;

				.filter {
					height: 100%;
					display: flex;
					align-items: center;
					color: #647484;
					padding: 0 20rpx;

					.icon {
						width: 26rpx;
						height: 24rpx;
					}

					&:active {
						background: #f9f9f9;
						opacity: 0.9;
					}
				}
			}
		}

		.main {
			flex: 2;

			.swiper {
				height: calc(100vh - 70rpx);

				.swiper-item {

					.haoheao-scroll {
						flex: 2;

						.item {
							width: calc(100% - 40rpx);
							margin: 20rpx;
							background: #fff;
							border-radius: 10rpx;
							padding: 0 20rpx;
							box-sizing: border-box;

							&:first-child {
								margin-top: 0;
							}

							.question {
								padding: 20rpx 0rpx;
								font-size: 28rpx;
								// font-weight: 800;
								border-bottom: 1rpx solid #f2f2f2;
								margin-bottom: 10rpx;
								display: flex;
								align-items: flex-start;

								.txt {
									flex: 2;
								}

								.date {
									white-space: nowrap;
									color: #B6C6D6;
									margin-left: 20rpx;
									font-size: 24rpx;
									font-weight: 500;
								}
							}

							.place {
								color: #333;
								font-size: 26rpx;

								.label {
									color: #647484;
								}
							}

							.info {
								display: flex;
								align-items: center;
								padding: 20rpx 0;

								.num {
									color: #e2e2e2;
									font-size: 24rpx;

									&.active {
										color: #1BA1F3;
									}
								}

								.btn-list {
									flex: 2;
									display: flex;
									justify-content: flex-end;
									font-size: 24rpx;

									.btn {
										color: #1BA1F3;
										border: 1rpx solid #1BA1F3;
										padding: 0rpx 25rpx;
										line-height: 48rpx;
										border-radius: 24rpx;
									}
								}
							}

							&:active {
								background: #F6F6F6;

								.btn-list {
									.btn {
										background: #1BA1F3;
										color: #fff;
									}
								}
							}
						}
					}
				}
			}
		}

		.popup {
			// margin-top: 70rpx;
			min-width: 100vw;
			height: calc(100vh - 70rpx);
			overflow-y: scroll;
			background: #fff;

			.content {
				font-size: 24rpx;
				box-sizing: border-box;
				padding: 20rpx;
				padding-bottom: 80rpx;

				.title {
					padding: 10rpx 0rpx 10rpx 5rpx;
					color: #A4B1BE;
				}

				.item {
					margin-bottom: 10rpx;
					color: #647685;

					&.date {
						border-radius: 10rpx;
						background: #F3F5F7;
						line-height: 80rpx;
						display: flex;
						align-items: center;
						padding: 0 20rpx;

						.time {}

						.txt {
							padding: 0 20rpx;
						}
					}

					&.floor {
						display: flex;
						flex-wrap: wrap;

						.view {
							width: calc(100%/3 - 20rpx);
							// flex: 3;
							margin-right: 20rpx;
							text-align: center;
							line-height: 56rpx;
							background: #F3F5F7;
							border-radius: 10rpx;
							margin-bottom: 20rpx;
							border: 2rpx solid transparent;

							&:nth-child(3n + 3) {
								margin-right: 0;
							}

							&:active {
								opacity: 0.9;
							}

							&.active {
								border: 2rpx solid #1BA1F3;
								color: #1BA1F3;
								background: #fff;
							}
						}
					}

					&.theme {
						display: flex;
						flex-wrap: wrap;

						.view {
							margin-right: 20rpx;
							text-align: center;
							line-height: 56rpx;
							background: #F3F5F7;
							border-radius: 10rpx;
							margin-bottom: 20rpx;
							border: 2rpx solid transparent;
							padding: 0 10rpx;

							&:active {
								opacity: 0.9;
							}

							&.active {
								border: 2rpx solid #1BA1F3;
								color: #1BA1F3;
								background: #fff;
							}
						}
					}
				}
			}

			.btn-list {
				display: flex;
				align-items: center;
				position: sticky;
				bottom: 0;

				.btn {
					flex: 2;
					text-align: center;
					line-height: 80rpx;
					background: #F6F7F9;

					&:active {
						opacity: 0.9;
					}

					&.reset {
						color: #ff0036;
					}

					&.search {
						color: #fff;
						background: #647685;
					}
				}
			}
		}
	}
</style>
