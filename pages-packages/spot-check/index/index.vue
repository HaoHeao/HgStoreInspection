<template>
	<view class="container">
		<view class="head" @click.stop="$refs['screen'].open()">
			<view class="item left">
				<view class="content">{{difference?'有差异':'全部'}}</view>
			</view>
			<view class="item center">
				<view class="content">{{date}}</view>
			</view>
			<view class="item right">
				<view class="content">
					筛选
					<image src="@/static/icon/screen.svg" mode="widthFix" class="icon"></image>
				</view>
			</view>
		</view>
		<haoheao-scroll class="haoheao-scroll" ref="scroll" @onPullDown="onPullDown" @onLoadMore="onLoadMore">
			<view class="data-view" v-if="tabelData.length">
				<view class="info">{{conerno?`[${conerno}]${tabelData[0].conername}  `:''}}共 {{tabelInfo.total}} 条</view>
				<view class="item fadeIn" @click="openDetail(item)" v-for="(item,index) of tabelData" :key="index">
					<view class="title">
						<view class="round" v-if="item.difqty != 0"></view>{{conerno?'':`[${item.conerno}]`}}{{item.prodname}}
					</view>
					<view class="content-list">
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
			</view>
			<view class="no-data-view fadeIn" v-if="!tabelData.length">
				<view class="center">
					<image src="@/static/icon/no-data.svg" mode="widthFix" class="icon"></image>
					<view class="tip">暂无数据</view>
				</view>
			</view>
			<view class="null-data" v-if="tabelData.length">
				<view class="text">以上为全部消息</view>
				<view class="line"></view>
			</view>
		</haoheao-scroll>
		<view class="view-item control-list">
			<navigator url="../add/index" class="item">
				<image src="@/static/icon/add-white.svg" mode="widthFix" class="icon"></image>抽盘
			</navigator>
		</view>
		<popup ref="screen" type="top" :maskClick="false" @change="screenChange">
			<view class="popup screen">
				<view class="item-list">
					<view class="item">
						<view class="title">设置日期</view>
						<picker mode="date" :value="date" @change="bindDateChange">
							<view class="content date">{{date}}</view>
						</picker>
					</view>
					<view class="item">
						<view class="title">专柜号</view>
						<input type="number" placeholder="专柜号" class="content input" v-model="conerno" v-if="popupConerno" />
					</view>
					<view class="item">
						<view class="title">是否包含差异</view>
						<radio-group @change="radioChange" class="content">
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
				</view>
				<view class="control">
					<view class="btn" @click="reset()">重置</view>
					<view class="btn success" @click="pageindex=1,tabelData=[],search(1),$refs['screen'].close()">完成</view>
				</view>
			</view>
		</popup>
		<popup ref="detail" type="bottom">
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
		</popup>
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
				uni,
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
	@import '@/styles/popup.scss';

	page {
		background: #E5EDF1;
	}

	.container {
		height: calc(100vh - 70rpx);
		background: #E5EDF1;
		/* IOS XR */
		padding-bottom: env(safe-area-inset-bottom);

		.haoheao-scroll {
			height: 100%;
		}

		/* ------ */
		.head {
			width: 100%;
			height: 70rpx;
			display: flex;
			justify-content: space-between;
			background: #fff;
			position: sticky;
			top: 0;
			z-index: 9999;

			.item {
				line-height: 80rpx;
				font-size: 28rpx;
				min-width: 150rpx;

				&.left {
					.content {
						width: auto;

						&:active {
							// border-bottom: 4rpx solid transparent;
							background: transparent;
						}
					}
				}

				&.center {
					text-align: center;
					font-weight: 700;
				}

				&.right {
					display: flex;
					align-items: center;
					justify-content: flex-end;

					.icon {
						width: 26rpx;
						height: 26rpx;
						margin-left: 5rpx;
					}
				}

				.content {
					display: flex;
					align-items: center;
					padding: 0rpx 20rpx;
					box-sizing: border-box;
					height: 100%;

					&:active {
						background: #f9f9f9;
						opacity: 0.9;
					}
				}
			}
		}

		/* 操作列 */
		.control-list {
			position: fixed;
			bottom: 20rpx;
			right: 20rpx;
			/* IOS XR */
			margin-bottom: env(safe-area-inset-bottom);
			/* ------ */
			display: flex;
			align-items: center;
			line-height: 70rpx;
			justify-content: flex-end;

			.item {
				display: flex;
				align-items: center;
				padding: 0 40rpx;
				color: #fff;
				background: #647484;
				border-radius: 70rpx;
				margin-left: 20rpx;
				transition: .3s;

				&:active {
					opacity: .75;
				}

				.icon {
					width: 40rpx;
					height: 40rpx;
					margin-right: 10rpx;
				}

				&.del {
					background: #D56C68;
				}
			}
		}

		.data-view {
			font-size: 28rpx;
			// padding-bottom: 100rpx;

			>.info {
				margin: 20rpx;
				color: #333;
				font-weight: 800;
				padding: 0 10rpx;
			}

			>.item {
				margin: 20rpx;
				margin-top: 0;
				border-radius: 10rpx;
				background: #fff;
				transition: .3s;
				font-size: 24rpx;

				&:active {
					background: #e2e2e2;
				}

				>.title {
					display: flex;
					align-items: center;
					padding: 10rpx 20rpx;
					font-weight: 800;

					.round {
						width: 16rpx;
						height: 16rpx;
						background: #D56C68;
						margin: 20rpx;
						margin-left: 0;
						border-radius: 50%;
					}
				}

				>.content-list {
					display: flex;
					flex-wrap: wrap;
					padding: 0rpx 20rpx;
					padding-bottom: 10rpx;

					>.item {
						display: flex;
						margin-right: 20rpx;
						// font-size: 24rpx;
						padding-bottom: 10rpx;

						>.title {
							color: #647484;
						}

						.content {
							color: #333;
						}
					}
				}
			}
		}

		.popup {
			width: 100vw;
			max-height: 80%;
			overflow-y: auto;
			background: #fff;
			margin-top: 70rpx;
			font-size: 28rpx;

			&.screen {
				border-radius: 0;

				.item-list {
					display: flex;
					flex-wrap: wrap;

					.item {
						width: 100%;
						box-sizing: border-box;
						padding: 0rpx 20rpx;
						margin-top: 10rpx;

						.title {
							color: #A4B1BE;
							padding: 10rpx 0rpx;
						}

						.content {
							padding: 0rpx 20rpx;
							border-radius: 10rpx;
							background: #F6F7F9;
							color: #333;
							display: flex;
							align-items: center;
							height: 80rpx;

							&.date {
								width: 200rpx;
								justify-content: center;
							}

							&::placeholder {
								color: #A4B1BE;
							}

							.radio-item {
								display: flex;
								align-items: center;
								margin-right: 40rpx;

								.radio {
									zoom: 0.8;
									// background: #637684;
								}
							}

							// &.input {
							// 	background: red;
							// }
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
					line-height: 80rpx;
					letter-spacing: 2rpx;
					background: #F4F8FB;

					&.success {
						background: #637684;
						color: #fff;
					}
				}
			}
		}

		.no-data-view {
			width: 100%;
			min-height: 100%;
			height: 50vh;
			display: flex;
			justify-content: center;
			flex-wrap: wrap;
			align-items: center;

			.center {
				.icon {
					width: 380rpx;
					height: 380rpx;
				}

				.tip {
					min-width: 100%;
					font-size: 28rpx;
					color: #999;
					text-align: center;
				}
			}
		}

		.null-data {
			padding-bottom: 100rpx;

			.text {
				background: #E5EDF1;
			}
		}

		/deep/ .you-scroll {
			background: #E5EDF1;
		}
	}
</style>
