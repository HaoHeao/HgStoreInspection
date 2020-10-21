<template>
	<view class="container">
		<view class="tabs">
			<view class="left"></view>
			<view class="center">
				<view class="btn-list">
					<view :class="['item', current == 0?'active':'']" @click="current = 0">进行中</view>
					<view :class="['item', current == 1?'active':'']" @click="current = 1">未总结</view>
				</view>
			</view>
			<view class="right"></view>
		</view>
		<view class="main">
			<swiper class="swiper" circular duration="100" :current="current" @change="swiperChange">
				<swiper-item class="swiper-item">
					<scroll-view class="scroll-view" scroll-y refresher-enabled :refresher-triggered="processingRefresherLoading"
					 @refresherrefresh="onRefresh" @refresherrestore="onRestore" @scroll="onViewScroll" :scroll-top="scrollTop">
						<block v-if="processingData.length">
							<view class="length">共 {{processingData.length}} 条</view>
							<view class="item no-bottom" v-for="(item,index) of processingData" :key="index" @click="lookReplay(item)">
								<view class="question">
									<view class="txt">{{item.title}}</view>
								</view>
								<view class="info-view">
									<view class="title">参与部门</view>
									<view class="content">
										<block v-for="(itm,ind) of item.planinspectionappenduser" :key="ind">{{ind == 0?itm.itemname:`、${itm.itemname}`}}</block>
									</view>
								</view>
								<view class="info-view">
									<view class="title">巡查日期</view>
									<view class="content">{{moment(item.sdate.replace(/-/g,'/')).format('YYYY.MM.DD') + ' - ' + moment(item.edate.replace(/-/g,'/')).format('YYYY.MM.DD')}}</view>
								</view>
							</view>
							<u-loadmore class="loadmore" :status="processingLoading?'loading':'nomore'" :icon-type="setting.iconType"
							 :load-text="setting.loadText" :is-dot="setting.isDot" />
						</block>
						<view class="no-data-view fadeIn" v-if="!processingData.length">
							<view class="center">
								<image src="@/static/icon/no-data.svg" mode="widthFix" class="icon"></image>
								<view class="tip">暂无待整改记录</view>
							</view>
						</view>
					</scroll-view>
				</swiper-item>
				<swiper-item class="swiper-item">
					<scroll-view class="scroll-view fadeIn" scroll-y refresher-enabled :refresher-triggered="notSumupRefresherLoading"
					 @refresherrefresh="onRefresh" @refresherrestore="onRestore" @scroll="onViewScroll" :scroll-top="scrollTop" scroll-with-animation>
						<block v-if="notSumupData.length">
							<view class="length">共 {{notSumupData.length}} 条</view>
							<view class="item no-bottom" v-for="(item,index) of notSumupData" :key="index" @click="lookReplay(item)">
								<view class="question">
									<view class="txt">{{item.title}}</view>
								</view>
								<view class="info-view">
									<view class="title">参与部门</view>
									<view class="content">
										<block v-for="(itm,ind) of item.planinspectionappenduser" :key="ind">{{ind == 0?itm.itemname:`、${itm.itemname}`}}</block>
									</view>
								</view>
								<view class="info-view">
									<view class="title">巡查日期</view>
									<view class="content">{{moment(item.sdate.replace(/-/g,'/')).format('YYYY.MM.DD') + ' - ' + moment(item.edate.replace(/-/g,'/')).format('YYYY.MM.DD')}}</view>
								</view>
							</view>
							<u-loadmore class="loadmore" :status="notSumupLoading?'loading':'nomore'" :icon-type="setting.iconType"
							 :load-text="setting.loadText" :is-dot="setting.isDot" />
						</block>
						<view class="no-data-view fadeIn" v-if="!notSumupData.length">
							<view class="center">
								<image src="@/static/icon/no-data.svg" mode="widthFix" class="icon"></image>
								<view class="tip">暂无已整改记录</view>
							</view>
						</view>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
		<view @click="goTop">
			<u-back-top :scroll-top="oldScrollTop" :icon-style="setting.iconStyle" :custom-style="setting.customStyle"></u-back-top>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				current: 0,
				// 进行中
				processingData: [],
				// 未总结
				notSumupData: [],
				// 进行中loading
				processingLoading: false,
				processingRefresherLoading: false,
				// 未总结loading
				notSumupLoading: false,
				notSumupRefresherLoading: false,
				scrollTop: 0,
				oldScrollTop: 0
			}
		},
		computed: {
			setting() {
				return this.$store.state.setting
			},
			userinfo() {
				return this.utils.getUserInfo(uni);
			}
		},
		methods: {
			goTop() {
				this.scrollTop = this.oldScrollTop
				this.$nextTick(() => {
					this.scrollTop = 0
				});
			},
			onViewScroll(e) {
				this.oldScrollTop = e.detail.scrollTop
			},
			// 触发下拉刷新
			async onRefresh() {
				console.log('下拉刷新')
				if (this.current == 0) {
					this.processingRefresherLoading = true
					await this.getData()
					this.processingRefresherLoading = false
				} else if (this.current == 1) {
					this.notSumupRefresherLoading = true
					await this.getData()
					this.notSumupRefresherLoading = false
				}
			},
			// 刷新完成/重置
			onRestore() {
				if (this.current == 0) this.processingRefresherLoading = false;
				if (this.current == 1) this.notSumupRefresherLoading = false;
			},
			swiperChange(e) {
				this.current = e.target.current
				this.oldScrollTop = 0
			},
			getData() {
				if (this.current == 0) this.getPlanProcessinglist()
				if (this.current == 1) this.getPlanNotSumupist()
			},
			lookReplay(item) {
				uni.navigateTo({
					url: "../seeDetail/seeDetail?id=" + item.planid
				})
			},
			// 计划巡检进行中列表
			async getPlanProcessinglist() {
				if (this.processingLoading) return
				uni.showNavigationBarLoading()
				this.processingLoading = true
				try {
					let data = await uni.request({
						method: 'GET',
						url: this.api.plan_getPlanList,
						data: {
							usernumber: this.userinfo.usernumber,
							datatype: 1
						}
					})
					uni.hideNavigationBarLoading()
					this.processingLoading = false
					let [err, success] = data
					console.log('计划巡检进行中列表------>>>', err, success)
					if (!err && success.data.success) {
						this.processingData = success.data.data.planinspectionset
					} else {
						uni.showToast({
							title: err ? err : success.data.errmsg,
							icon: 'none',
							duration: 3000
						});
					}
				} catch (e) {
					uni.hideNavigationBarLoading()
					this.processingLoading = false
					console.log(e)
				}
			},
			// 计划巡检未总结列表
			async getPlanNotSumupist() {
				if (this.notSumupLoading) return
				uni.showNavigationBarLoading()
				this.notSumupLoading = true
				try {
					let data = await uni.request({
						method: 'GET',
						url: this.api.plan_getPlanList,
						data: {
							usernumber: this.userinfo.usernumber,
							datatype: 2
						}
					})
					uni.hideNavigationBarLoading()
					this.notSumupLoading = false
					let [err, success] = data
					console.log('计划巡检未总结列表------>>>', err, success)
					if (!err && success.data.success) {
						this.notSumupData = success.data.data.planinspectionset
					} else {
						uni.showToast({
							title: err ? err : success.data.errmsg,
							icon: 'none',
							duration: 3000
						});
					}
				} catch (e) {
					uni.hideNavigationBarLoading()
					this.notSumupLoading = false
					console.log(e)
				}
			},
		},
		onLoad() {
			this.getPlanProcessinglist()
			this.getPlanNotSumupist()
		}
	}
</script>

<style scoped lang="scss">
	.container {
		height: 100vh;
		background: #F6F7F9;
		display: flex;
		flex-direction: column;

		.tabs {}

		.main {
			flex: 2;
			display: flex;
			flex-direction: column;

			.swiper {
				height: calc(100vh - 70rpx);

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
	}
</style>
