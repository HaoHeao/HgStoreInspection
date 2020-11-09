<template>
	<view class="container">
		<view class="tabs" @click.stop="$refs['filter'].open()">
			<view class="left">{{difference?'有差异':'全部'}}</view>
			<view class="center">{{date}}</view>
			<view class="right">
				<view class="content">
					<view class="filter">
						<image src="@/static/icon/filter.svg" mode="widthFix" class="icon"></image>
						筛选
					</view>
				</view>
			</view>
		</view>
		<view class="main">
			<scroll-view class="scroll-view" scroll-y refresher-enabled scroll-with-animation :enable-back-to-top="setting.enableBackToTop"
			 :refresher-triggered="waitRefresherLoading" @refresherrefresh="onRefresh" @refresherrestore="onRestore"
			 @scrolltolower="onTolower">
				<block v-if="tabelData.length">
					<view class="length">{{conerno?`[${conerno}]${tabelData[0].conername}  `:''}}共 {{tabelInfo.total}} 条</view>
					<view class="item" @click="openDetail(item)" v-for="(item,index) of tabelData" :key="index">
						<view class="question">
							<view class="round" v-if="item.difqty != 0"></view>
							<view class="txt">{{conerno?'':`[${item.conerno}]`}}{{item.prodname}}</view>
						</view>
						<view class="info-list">
							<view class="item">
								<view class="title">编码：</view>
								<view class="content">{{item.prodplu}}</view>
							</view>
							<view class="item">
								<view class="title">库存：</view>
								<view class="content">{{item.storeqty}}</view>
							</view>
							<view class="item">
								<view class="title">实盘：</view>
								<view class="content">{{item.chkqty}}</view>
							</view>
							<view class="item">
								<view class="title">差异：</view>
								<view class="content">{{item.difqty}}</view>
							</view>
						</view>
					</view>
					<u-loadmore class="loadmore" :status="waitLoading?'loading':'nomore'" :icon-type="setting.iconType" :load-text="setting.loadText"
					 :is-dot="setting.isDot" />
				</block>
				<view class="no-data-view" v-if="!tabelData.length">
					<view class="center">
						<image src="@/static/icon/no-data.svg" mode="widthFix" class="icon"></image>
						<view class="tip">暂无数据</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<!-- <view class="view-item control-list">
			<image src="@/static/icon/add-white.svg" mode="widthFix" class="icon"></image>抽盘
		</view> -->
		<uni-popup ref="filter" type="top">
			<scroll-view scroll-y class="popup filter">
				<view class="content">
					<view class="title">设置日期</view>
					<view class="item date">
						<picker mode="date" :value="date" @change="bindDateChange">
							<view class="time">{{date}}</view>
						</picker>
					</view>
					<view class="title">专柜号</view>
					<input type="number" placeholder="专柜号" class="item input" v-model="conerno" />
					<view class="title">是否包含差异</view>
					<radio-group @change="radioChange" class="item radio-group">
						<label class="radio-item">
							<radio class="radio" value="1" color="#647484" checked />
							<view>全部</view>
						</label>
						<label class="radio-item">
							<radio class="radio" value="2" color="#647484" />
							<view>有差异</view>
						</label>
					</radio-group>
				</view>
				<view class="btn-list">
					<view class="btn reset" @click="reset()">重置</view>
					<view class="btn search" @click="pageindex=1,tabelData=[],search(1),$refs['screen'].close()">查询</view>
				</view>
			</scroll-view>
		</uni-popup>


		<uni-popup ref="detail" type="bottom">
			<view class="popup detail">
				<view class="title">
					<view class="round" v-if="item.difqty != 0"></view>{{detail.prodname}}
				</view>
				<view class="item-list">
					<view class="item row">
						<view class="title">专柜</view>
						<view class="content">{{conerno?'':`[${detail.conerno}]`}}{{detail.conername}}</view>
					</view>
					<view class="item">
						<view class="title">系统库存</view>
						<view class="content">{{detail.sysstoreqty}}</view>
					</view>
					<view class="item">
						<view class="title">线上未提</view>
						<view class="content">{{detail.onlineqty}}</view>
					</view>
					<view class="item">
						<view class="title">借出</view>
						<view class="content">{{detail.borrowqty}}</view>
					</view>
					<view class="item">
						<view class="title">当前库存</view>
						<view class="content">{{detail.storeqty}}</view>
					</view>
				</view>
				<view class="item-list">
					<view class="item">
						<view class="title">实盘数量</view>
						<view class="content">{{detail.chkqty}}</view>
					</view>
					<view class="item">
						<view class="title">差异</view>
						<view class="content">{{detail.difqty}}</view>
					</view>
					<view class="item row" v-if="detail.disremark">
						<view class="title">说明</view>
						<view class="content">{{detail.disremark}}</view>
					</view>
				</view>
				<view class="bottom-control">
					<view class="left"></view>
					<view class="content">
						<view class="item del" @click.stop="$refs['detail'].close()">关闭</view>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 时间
				date: "",
				// 专柜号
				conerno: "",
				// 是否包含差异
				difference: false,
				// 首页数据
				tabelData: [],
				tabelInfo: {},
				// 明细查看
				detail: {},
				pagesize: 20,
				pagenum: 1,
				pageindex: 1,
				popupConerno: false
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
			// 下拉刷新
			async onPullDown(done) {
				this.pageindex = 1;
				this.tabelData = [];
				console.log("下拉刷新")
				await this.search(1)
				done();
			},
			async onLoadMore(e) {
				console.log(e);
				if (this.pageindex <= this.pagenum && this.pagenum != 1) {
					console.log("加载更多")
					await this.search(this.pageindex);
				}
			},
			async openDetail(data) {
				this.$refs['detail'].open()
				this.detail = data;
			},
			async search(pageindex) {
				console.log(this.pageindex, this.pagenum)
				if (this.pageindex > this.pagenum) {
					return
				}
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				this.pageindex = this.pageindex + 1;
				let userinfo = this.utils.getUserInfo(uni);
				try {
					let data = await uni.request({
						method: 'GET',
						url: this.api.spotcheck_search,
						data: {
							rows: this.pagesize,
							page: pageindex,
							checkuserid: userinfo.usernumber,
							checkdate: this.date,
							conerno: this.conerno,
							// prodplu: this.goodsinfo.borrowqty,
							difflag: this.difference ? 1 : ''
						}
					})
					let [err, success] = data
					console.log('查询成功------>>>', data)
					uni.hideLoading();
					if (success.data.success && success.data.data.pBillStockSpotcheckDetail.length) {
						this.tabelInfo = success.data
						console.log(this.tabelInfo, success.data)
						this.tabelData = this.tabelData.concat(success.data.data.pBillStockSpotcheckDetail)
						this.pagenum = parseInt(success.data.total / this.pagesize) + 1
					} else {
						this.pageindex = this.pageindex - 1;
						this.tabelData = []
						uni.showToast({
							title: err ? err : success.data.errmsg,
							icon: 'none',
							duration: 3000
						});
					}
				} catch (e) {
					this.pageindex = this.pageindex - 1;
					uni.hideLoading();
					console.log(e)
				}
			},
			radioChange(evt) {
				let value = evt.target.value
				value == 1 ? this.difference = false : value == 2 ? this.difference = true : this.difference = false;
			},
			bindDateChange(e) {
				this.date = e.target.value
			},
			async screenChange(e) {
				await this.delay(100)
				if (e.show) {
					this.popupConerno = true
				} else {
					this.popupConerno = false
				}
			},
			reset() {
				this.date = this.moment().format("YYYY-MM-DD")
				this.conerno = ""
				this.difference = false
				this.pagesize = 20
				this.pageindex = 1
				uni.hideLoading();
			}
		},
		onLoad: async function() {
			this.date = this.moment().format("YYYY-MM-DD")
		},
		onShow: async function() {
			this.delay(100)
			console.log("页面加载")
			this.search(1)
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background: #E5EDF1;
	}

	.container {
		background: #E5EDF1;
		/* IOS XR */
		padding-bottom: env(safe-area-inset-bottom);

		.tabs {
			.left {
				line-height: 70rpx;
				padding-left: 20rpx;
			}

			.center {
				line-height: 70rpx;
				font-weight: 800;
			}
		}

		.main {
			height: calc(100vh - 70rpx);

			.scroll-view {
				height: 100%;

				.length {
					font-size: 24rpx;
					color: #333;
					font-weight: 700;
					padding: 20rpx;
					padding-bottom: 0;
				}

				>.item {
					width: calc(100% - 40rpx);
					margin: 20rpx;
					margin-bottom: 0;
					background: #fff;
					border-radius: 10rpx;
					padding: 0 20rpx;
					box-sizing: border-box;

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

					.info-list {
						display: flex;
						flex-wrap: wrap;
						padding: 0rpx 20rpx;
						padding-bottom: 10rpx;

						.item {
							display: flex;
							margin-right: 20rpx;
							padding-bottom: 10rpx;

							>.title {
								color: #647484;
							}

							.content {
								color: #333;
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

		.popup {
			&.filter {
				width: 100vw;
				min-height: 40vh;
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
						font-size: 28rpx;
					}

					.item {
						margin-bottom: 10rpx;
						color: #647685;
						font-size: 30rpx;

						&.date {
							line-height: 80rpx;
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
						}

						&.input {
							min-height: 80rpx;
							width: 100%;
							border-radius: 10rpx;
							background: #F3F5F7;
							padding: 0 20rpx;
							box-sizing: border-box;
						}

						&.radio-group {
							border-radius: 10rpx;
							background: #F3F5F7;
							display: flex;
							padding: 20rpx;

							.radio-item {
								display: flex;
								align-items: center;
								margin-right: 20rpx;

								.radio {
									zoom: 0.8;
									// background: #637684;
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

			&.detail {
				font-size: 28rpx;

				>.title {
					font-size: 32rpx;
					font-weight: 800;
					padding: 0 20rpx;
					padding-top: 20rpx;
					color: #333;
					display: flex;
					align-items: center;

					.round {
						width: 16rpx;
						height: 16rpx;
						background: #D56C68;
						margin: 20rpx;
						margin-left: 0;
						border-radius: 50%;
					}
				}

				.item-list {
					padding: 20rpx;
					display: flex;
					flex-wrap: wrap;
					border-top: 1px solid #f2f2f2;

					.item {
						display: flex;
						align-items: flex-start;
						margin-right: 60rpx;
						margin-bottom: 10rpx;

						.title {
							width: 140rpx;
							color: #A4B1BE;
						}

						.content {
							color: #333;
						}

						&.row {
							width: 100%;
							margin-right: 0;

							.content {
								flex: 2;
							}
						}
					}
				}

				.bottom-control {
					padding: 20rpx;
					padding-top: 40rpx;
				}
			}

			.control {
				display: flex;
				align-items: center;
				position: sticky;
				bottom: 0;
				margin-top: 40rpx;

				.btn {
					width: 50%;
					color: #D56C68;
					text-align: center;
					line-height: 100rpx;
					background: #F4F8FB;

					&.success {
						background: #637684;
						color: #fff;
					}
				}
			}
		}
	}
</style>
