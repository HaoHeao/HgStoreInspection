<template>
	<view class="container">
		<view class="head">
			<view class="left"></view>
			<view class="center">
				<view class="btn-list">
					<view :class="['item', current == 0?'active':'']" @click="!filterLoading?current = 0:''">待整改</view>
					<view :class="['item', current == 1?'active':'']" @click="!filterLoading?current = 1:''">已整改</view>
					<view :class="['item', current == 2?'active':'']" @click="!filterLoading?current = 2:''">已完成</view>
				</view>
			</view>
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
					<haoheao-scroll class="haoheao-scroll" ref="scroll" @onPullDown="onPullDown" @onLoadMore="onLoadMore">
						<block v-if="waitData.length">
							<view class="length">共 {{waitDataInfo}} 条</view>
							<view class="item" v-for="(item,index) of waitData" :key="index">
								<view class="question">
									<view class="txt">{{item.question}}</view>
									<view class="date">{{item.insertdate}}</view>
								</view>
								<view class="place"><text class="label">位置：</text>{{item.inspectionplace}}</view>
								<view class="info">
									<view class="num active"></view>
									<view class="btn-list">
										<view class="btn">整改</view>
									</view>
								</view>
							</view>
							<view class="null-data">
								<view class="text">以上为全部记录</view>
								<view class="line"></view>
							</view>
						</block>
						<view class="no-data-view fadeIn" v-if="!waitData.length">
							<view class="center">
								<image src="@/static/icon/no-data.svg" mode="widthFix" class="icon"></image>
								<view class="tip">暂无待整改记录</view>
							</view>
						</view>
					</haoheao-scroll>
				</swiper-item>
				<swiper-item class="swiper-item">
					<haoheao-scroll class="haoheao-scroll" ref="scroll" @onPullDown="onPullDown" @onLoadMore="onLoadMore">
						<block v-if="completedData.length">
							<view class="length">共 {{completedDataInfo}} 条</view>
							<view class="item" v-for="(item,index) of completedData" :key="index">
								<view class="question">
									<view class="txt">{{item.question}}</view>
									<view class="date">{{item.insertdate}}</view>
								</view>
								<view class="place"><text class="label">位置：</text>{{item.inspectionplace}}</view>
								<view class="info">
									<view class="num active">{{item.planinspectionfeedback.length}}条</view>
									<view class="btn-list">
										<view class="btn">复核</view>
									</view>
								</view>
							</view>
							<view class="null-data">
								<view class="text">以上为全部记录</view>
								<view class="line"></view>
							</view>
						</block>
						<view class="no-data-view fadeIn" v-if="!completedData.length">
							<view class="center">
								<image src="@/static/icon/no-data.svg" mode="widthFix" class="icon"></image>
								<view class="tip">暂无已整改记录</view>
							</view>
						</view>
					</haoheao-scroll>
				</swiper-item>
				<swiper-item class="swiper-item">
					<haoheao-scroll class="haoheao-scroll" ref="scroll" @onPullDown="onPullDown" @onLoadMore="onLoadMore">
						<block v-if="finishData.length">
							<view class="length">共 {{finishDataInfo}} 条</view>
							<view class="item" v-for="(item,index) of finishData" :key="index">
								<view class="question">
									<view class="txt">{{item.question}}</view>
									<view class="date">{{item.insertdate}}</view>
								</view>
								<view class="place"><text class="label">位置：</text>{{item.inspectionplace}}</view>
								<view class="info">
									<view class="num active">{{item.planinspectionfeedback.length}}条</view>
									<view class="btn-list">
										<view class="btn">查看</view>
									</view>
								</view>
							</view>
							<view class="null-data">
								<view class="text">以上为全部记录</view>
								<view class="line"></view>
							</view>
						</block>
						<view class="no-data-view fadeIn" v-if="!finishData.length">
							<view class="center">
								<image src="@/static/icon/no-data.svg" mode="widthFix" class="icon"></image>
								<view class="tip">暂无已完成整改记录</view>
							</view>
						</view>
						<!-- <view class="item">
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
						</view> -->
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
						<view class="view active">1F</view>
						<view class="view">2F</view>
						<view class="view active">3F</view>
						<view class="view">4F</view>
						<view class="view">5F</view>
					</view>
					<view class="title">主题</view>
					<view class="item theme">
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
				pagesize: 20,
				current: 0,
				// 待整改
				waitData: [],
				waitDataInfo: '',
				waitPageindex: 1,
				waitPageNum: '',
				// 已整改
				completedData: [],
				completedDataInfo: '',
				completedPageindex: 1,
				completedNum: '',
				// 已完成
				finishData: [],
				finishDataInfo: '',
				finishPageindex: 1,
				finishNum: '',
				// 筛选loading
				filterLoading: false,
				// 时间
				date: "",
				// 楼层
				floorList: [],
				floor: '',
				// 主题
				titleList: [],
				title: ''
			}
		},
		methods: {
			async onPullDown(done) {
				await this.tabbarBind()
				done()
			},
			async onLoadMore(e) {
				if (this.current == 0) {
					if (!(this.waitPageindex <= this.waitPageNum && this.waitPageNum != 1)) {
						return
					}
				} else if (this.current == 1) {
					if (!(this.completedPageindex <= this.completedNum && this.completedNum != 1)) {
						return
					}
				} else if (this.current == 2) {
					if (!(this.finishPageindex >= this.finishNum && this.finishNum != 1)) {
						return
					}
				}
				await this.getQuestion()
			},
			swiperChange(e) {
				this.current = e.target.current
				this.tabbarBind()
			},
			getQuestionReset() {
				this.waitPageindex = 1
				this.completedPageindex = 1
				this.finishPageindex = 1
				this.waitPageNum = ''
				this.completedNum = ''
				this.finishNum = ''
				this.waitData = []
				this.completedData = []
				this.finishData = []
			},
			getQuestion() {
				this.current == 0 ? this.getQuestionWait() : this.current == 1 ? this.getQuestionCompleted() : this.current == 2 ?
					this.getQuestionFinish() :
					true
			},
			// tabbar切换请求数据
			async tabbarBind() {
				this.getQuestionReset()
				await this.getQuestion()
			},
			// 待整改
			async getQuestionWait() {
				let userinfo = this.utils.getUserInfo(uni);
				uni.showNavigationBarLoading()
				try {
					let data = await uni.request({
						method: 'POST',
						url: this.api.plan_questionWait,
						data: {
							pagesize: this.pagesize,
							pageindex: this.waitPageindex,
							usernumber: userinfo.usernumber,
							floor: 'all',
							planid: 0,
							sdate: '2019-09-25',
							edate: '2020-09-25',
							status: 0
						}
					})
					uni.hideNavigationBarLoading()
					let [err, success] = data
					console.log('待整改请求成功------>>>', success)
					if (success.data.success) {
						this.waitData = this.waitData.concat(success.data.data.question)
						this.waitDataInfo = success.data.pagecount
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
					console.log(e)
				}
			},
			// 已整改
			async getQuestionCompleted() {
				let userinfo = this.utils.getUserInfo(uni);
				uni.showNavigationBarLoading()
				try {
					let data = await uni.request({
						method: 'POST',
						url: this.api.plan_questionCompleted,
						data: {
							pagesize: this.pagesize,
							pageindex: this.completedPageindex,
							usernumber: userinfo.usernumber,
							floor: 'all',
							planid: 0,
							sdate: '2019-09-25',
							edate: '2020-09-25',
							status: 1
						}
					})
					uni.hideNavigationBarLoading()
					let [err, success] = data
					console.log('已整改请求成功------>>>', success)
					if (success.data.success) {
						this.completedData = this.completedData.concat(success.data.data.question)
						this.completedDataInfo = success.data.pagecount
						this.completedNum ? '' : this.completedNum = success.data.pagenum
						this.completedPageindex += 1
					} else {
						uni.showToast({
							title: err ? err : success.data.errmsg,
							icon: 'none',
							duration: 3000
						});
					}
				} catch (e) {
					uni.hideNavigationBarLoading()
					console.log(e)
				}
			},
			// 已完成
			async getQuestionFinish() {
				let userinfo = this.utils.getUserInfo(uni);
				uni.showNavigationBarLoading()
				try {
					let data = await uni.request({
						method: 'POST',
						url: this.api.plan_questionFinish,
						data: {
							pagesize: this.pagesize,
							pageindex: this.finishPageindex,
							usernumber: userinfo.usernumber,
							floor: 'all',
							planid: 0,
							sdate: '2019-09-25',
							edate: '2020-09-25',
							status: 100
						}
					})
					uni.hideNavigationBarLoading()
					let [err, success] = data
					console.log('已完成请求成功------>>>', success)
					if (success.data.success) {
						this.finishData = this.finishData.concat(success.data.data.asset)
						this.finishDataInfo = success.data.pagecount
						this.finishNum ? '' : this.finishNum = success.data.pagenum
						this.finishPageindex += 1
					} else {
						uni.showToast({
							title: err ? err : success.data.errmsg,
							icon: 'none',
							duration: 3000
						});
					}
				} catch (e) {
					uni.hideNavigationBarLoading()
					console.log(e)
				}
			},
			// 获取筛选条件
			async getFilterData() {
				let userinfo = this.utils.getUserInfo(uni);
				uni.showNavigationBarLoading()
				try {
					let data = await uni.request({
						method: 'POST',
						url: this.api.plan_getFilterData,
						data: {
							pagesize: this.pagesize,
							pageindex: this.finishPageindex,
							usernumber: userinfo.usernumber,
							floor: '',
							planid: 0,
							sdate: '2019-09-25',
							edate: '2020-09-25',
							status: this.current == 0 ? 0 : this.current == 1 ? 1 : this.current == 2 ? 100 : ''
						}
					})
					uni.hideNavigationBarLoading()
					let [err, success] = data
					console.log('筛选条件请求成功------>>>', success)
					if (success.data.success) {

					} else {
						uni.showToast({
							title: err ? err : success.data.errmsg,
							icon: 'none',
							duration: 3000
						});
					}
				} catch (e) {
					uni.hideNavigationBarLoading()
					console.log(e)
				}
			}
		},
		onShow: function() {
			this.tabbarBind()
			this.getFilterData()
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
			background: #fff;
			display: flex;
			justify-content: space-between;
			border-bottom: 1rpx solid #f6f7f9;

			.left {
				flex: 1;
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

						&:nth-child(2) {
							margin: 0 30rpx;
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
							background: #fff;
							border-radius: 10rpx;
							padding: 0 20rpx;
							box-sizing: border-box;

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
