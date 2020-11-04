<template>
	<view class="container">
		<view class="tabs">
			<view class="left"></view>
			<view class="center">
				<view class="btn-list">
					<view :class="['item', current == 0?'active':'']" @click="current = 0">待解决</view>
					<view :class="['item', current == 1?'active':'']" @click="current = 1">已解决</view>
				</view>
			</view>
			<view class="right"></view>
		</view>
		<view class="main">
			<swiper class="swiper" :circular="setting.circular" :duration="setting.swiperDuration" :current="current" @change="swiperChange">
				<swiper-item class="swiper-item">
					<scroll-view class="scroll-view" scroll-y refresher-enabled scroll-with-animation :enable-back-to-top="setting.enableBackToTop"
					 :refresher-triggered="waitRefresherLoading" @refresherrefresh="onRefresh" @refresherrestore="onRestore"
					 @scrolltolower="onTolower">
						<block v-if="waitData.length">
							<view class="length">共 {{waitDataInfo}} 条</view>
							<view class="item no-bottom" v-for="(item,index) of waitData" :key="index" @click="lookReplay(item)">
								<view class="question">
									<view class="txt">{{item.deptname}}{{` - ${item.username}`}}</view>
									<view class="date">{{item.insertdate}}</view>
								</view>
								<view class="info-view">
									<!-- <view class="title">问题描述</view> -->
									<view class="content">{{item.remark}}</view>
								</view>
							</view>
							<u-loadmore class="loadmore" :status="waitLoading?'loading':'nomore'" :icon-type="setting.iconType" :load-text="setting.loadText"
							 :is-dot="setting.isDot" />
						</block>
						<view class="no-data-view fadeIn" v-if="!waitData.length">
							<view class="center">
								<image src="@/static/icon/no-data.svg" mode="widthFix" class="icon"></image>
								<view class="tip">暂无待解决记录</view>
							</view>
						</view>
					</scroll-view>
				</swiper-item>
				<swiper-item class="swiper-item">
					<scroll-view class="scroll-view" scroll-y refresher-enabled scroll-with-animation :enable-back-to-top="setting.enableBackToTop"
					 :refresher-triggered="solvedRefresherLoading" @refresherrefresh="onRefresh" @refresherrestore="onRestore"
					 @scrolltolower="onTolower">
						<block v-if="solvedData.length">
							<view class="length">共 {{solvedDataInfo}} 条</view>
							<view class="item no-bottom" v-for="(item,index) of solvedData" :key="index" @click="lookReplay(item)">
								<view class="question">
									<view class="txt">{{item.deptname}}{{` - ${item.username}`}}</view>
									<view class="date">{{item.insertdate}}</view>
								</view>
								<view class="info-view">
									<!-- <view class="title">问题描述</view> -->
									<view class="content">{{item.remark}}</view>
								</view>
							</view>
							<u-loadmore class="loadmore" :status="computedLoading?'loading':'nomore'" :icon-type="setting.iconType"
							 :load-text="setting.loadText" :is-dot="setting.isDot" />
						</block>
						<view class="no-data-view fadeIn" v-if="!solvedData.length">
							<view class="center">
								<image src="@/static/icon/no-data.svg" mode="widthFix" class="icon"></image>
								<view class="tip">暂无已解决记录</view>
							</view>
						</view>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pagesize: 20,
				current: 0,
				// 待解决
				waitData: [],
				waitDataInfo: '',
				waitPageindex: 1,
				waitPageNum: '',
				// 已解决
				solvedData: [],
				solvedDataInfo: '',
				solvedPageindex: 1,
				solvedNum: '',
				// 待解决loading
				waitLoading: false,
				waitRefresherLoading: false,
				// 已解决loading
				solvedLoading: false,
				solvedRefresherLoading: false,
				// 默认时间
				normalDay: 30,
				// 时间
				date: [],
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
			// 触发下拉刷新
			async onRefresh() {
				console.log('下拉刷新')
				if (this.current == 0) {
					this.waitRefresherLoading = true
					await this.getQuestionReset()
					await this.getQuestion()
					this.waitRefresherLoading = false
				} else if (this.current == 1) {
					this.solvedRefresherLoading = true
					await this.getQuestionReset()
					await this.getQuestion()
					this.solvedRefresherLoading = false
				}
			},
			// 刷新完成/重置
			onRestore() {
				if (this.current == 0) this.waitRefresherLoading = false;
				if (this.current == 1) this.solvedRefresherLoading = false;
				console.log("onRestore");
			},
			// 滚动触底
			async onTolower() {
				console.log('滚动触底')
				if (this.current == 0) {
					if (!(this.waitPageindex <= this.waitPageNum && this.waitPageNum != 1)) {
						return
					}
				} else if (this.current == 1) {
					if (!(this.completedPageindex <= this.completedNum && this.completedNum != 1)) {
						return
					}
				}
				console.log('加载更多------>>>')
				await this.getQuestion()
			},
			// 进入反馈
			lookReplay(item) {
				console.log('进入明细', item);
				uni.navigateTo({
					url: `/pages-packages/store/detail/detail?inspectionlogid=${item.inspectionlogid}`
				})
			},
			swiperChange(e) {
				this.current = e.target.current
			},
			getQuestionReset() {
				if (this.current == 0) {
					this.waitPageindex = 1
					this.waitPageNum = ''
					this.waitData = []
				} else if (this.current == 1) {
					this.solvedPageindex = 1
					this.solvedNum = ''
					this.solvedData = []
				}
			},
			getQuestion() {
				this.current == 0 ? this.getWaitData() : this.current == 1 ? this.getSolvedData() : true
			},
			// 待解决
			async getWaitData() {
				if (this.waitLoading) return
				uni.showNavigationBarLoading()
				this.waitLoading = true
				try {
					let data = await uni.request({
						method: 'POST',
						url: this.api.store_getQuestonNearList,
						data: {
							usernumber: this.userinfo.usernumber,
							sdate: this.moment(new Date().getTime() - this.normalDay * 24 * 60 * 60 * 1000).format("YYYY-MM-DD"),
							edate: this.moment().format("YYYY-MM-DD"),
							status: 0,
							senddpetid: [],
							inspectioncode: "",
							pagesize: this.pagesize,
							pageindex: this.waitPageindex,
						}
					})
					uni.hideNavigationBarLoading()
					this.waitLoading = false
					let [err, success] = data
					console.log('待解决请求成功------>>>', err, success)
					if (!err && success.data.success) {
						this.waitData = this.waitData.concat(success.data.data)
						this.waitDataInfo = success.data.pagenum
						this.waitPageNum ? '' : this.waitPageNum = success.data.pagenum
						this.waitPageindex += 1
					} else {
						uni.showToast({
							title: err ? err : success.data.errmsg,
							icon: 'none',
							duration: 3000
						});
					}
				} catch (e) {
					uni.hideNavigationBarLoading()
					this.waitLoading = false
					console.log(e)
				}
			},
			// 已解决
			async getSolvedData() {
				if (this.solvedLoading) return
				uni.showNavigationBarLoading()
				this.solvedLoading = true
				try {
					let data = await uni.request({
						method: 'POST',
						url: this.api.store_getQuestonNearList,
						data: {
							usernumber: this.userinfo.usernumber,
							sdate: this.moment(new Date().getTime() - this.normalDay * 24 * 60 * 60 * 1000).format("YYYY-MM-DD"),
							edate: this.moment().format("YYYY-MM-DD"),
							status: 1,
							senddpetid: [],
							inspectioncode: "",
							pagesize: this.pagesize,
							pageindex: this.solvedPageindex,
						}
					})
					uni.hideNavigationBarLoading()
					this.solvedLoading = false
					let [err, success] = data
					console.log('已解决请求成功------>>>', success)
					if (!err && success.data.success) {
						this.solvedData = this.solvedData.concat(success.data.data)
						this.solvedDataInfo = success.data.pagenum
						this.solvedNum ? '' : this.completedNum = success.data.pagenum
						this.solvedPageindex += 1
					} else {
						uni.showToast({
							title: err ? err : success.data.errmsg,
							icon: 'none',
							duration: 3000
						});
					}
				} catch (e) {
					this.solvedLoading = false
					uni.hideNavigationBarLoading()
					console.log(e)
				}
			},
		},
		created: async function() {
			this.getWaitData()
			this.getSolvedData()
		}
	}
</script>

<style scoped lang="scss">
	.container {
		background: #F6F7F9;
		display: flex;
		flex-direction: column;

		.tabs {}

		.main {
			flex: 2;
			display: flex;
			flex-direction: column;

			.swiper {
				height: calc(100vh - 70rpx - 100rpx);

				.swiper-item {
					display: flex;
					flex-direction: column;

					.scroll-view {
						height: 100%;

						.length {
							font-size: 24rpx;
							color: #333;
							font-weight: 700;
							padding: 20rpx;
							padding-bottom: 0;
						}

						.item {
							width: calc(100% - 40rpx);
							margin: 20rpx;
							margin-bottom: 0;
							background: #fff;
							border-radius: 10rpx;
							padding: 0 20rpx;
							box-sizing: border-box;

							&.no-bottom {
								padding-bottom: 10rpx;
							}

							.question {
								padding: 20rpx 0rpx;
								font-size: 28rpx;
								display: flex;
								align-items: flex-start;

								.txt {
									flex: 2;
									color: #647484;
									font-size: 26rpx;
								}

								.date {
									white-space: nowrap;
									color: #B6C6D6;
									margin-left: 20rpx;
									font-size: 24rpx;
									font-weight: 500;
								}
							}

							.info-view {
								display: flex;
								font-size: 24rpx;
								padding-bottom: 10rpx;

								.title {
									color: #A4B1BE;
									width: 4em;
									margin-right: 20rpx;
									white-space: nowrap;
									text-align-last: justify;
								}

								.content {
									color: #647484;
								}
							}

							.img-list {
								margin-top: 10rpx;
								display: flex;
								flex-wrap: wrap;

								.img-view {
									margin-right: 10rpx;
									margin-bottom: 10rpx;
									width: calc(100%/5 - 10rpx);
									height: 124rpx;
									display: flex;
									align-items: center;
									justify-content: center;
									overflow: hidden;

									.icon {
										border-radius: 10rpx;
										width: 100%;
										min-height: 100%;
										height: 100%;
									}
								}
							}

							.info {
								display: flex;
								align-items: center;
								padding: 20rpx 0;
								padding-top: 0;

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
										width: 130rpx;
										text-align: center;
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
			width: 100vw;
			min-height: 50vh;
			max-height: 80vh;
			background: #fff;
			overflow: hidden;
			display: flex;
			flex-direction: column;

			.content {
				font-size: 24rpx;
				box-sizing: border-box;
				padding: 20rpx;
				padding-bottom: 80rpx;
				flex: 2;

				.title {
					padding: 10rpx 0rpx 10rpx 5rpx;
					color: #A4B1BE;
				}

				.item {
					margin-bottom: 10rpx;
					color: #647685;

					&.date {
						line-height: 70rpx;
						display: flex;
						align-items: center;

						.time {
							border-radius: 10rpx;
							background: #F3F5F7;
							width: 250rpx;
							text-align: center;

							&:active {
								opacity: 0.8;
							}
						}

						.txt {
							padding: 0 20rpx;
						}
					}

					&.dept {
						display: flex;
						flex-wrap: wrap;

						.view {
							width: calc(100%/3 - 18rpx);
							min-height: 60rpx;
							border-radius: 6rpx;
							background-color: #F3F5F7;
							margin-right: 18rpx;
							margin-bottom: 18rpx;
							display: flex;
							justify-content: center;
							align-items: center;
							flex-wrap: wrap;
							text-align: center;
							padding: 14rpx 10rpx;
							white-space: normal;
							border: 2rpx solid #F3F5F7;

							&.active {
								border-color: #40A9FF;
								background: #fff;
								box-shadow: 4rpx 8rpx 16rpx 0rpx rgba(0, 0, 0, 0.1);
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
				overflow: hidden;

				.btn {
					flex: 2;
					text-align: center;
					line-height: 100rpx;
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
