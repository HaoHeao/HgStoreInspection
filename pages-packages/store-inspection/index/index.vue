<template>
	<view class="container">
		<view class="tabs">
			<view class="left">共 3 条记录</view>
			<view class="center"></view>
			<view class="right">
				<picker header-text="选择时间" mode="date" fields="month" @change="selectDataTime">
					<view class="content">{{moment(date).format("YYYY年MM月")}}</view>
				</picker>
			</view>
		</view>
		<view class="main">
			<scroll-view class="scroll-view" scroll-y refresher-enabled scroll-with-animation :enable-back-to-top="setting.enableBackToTop"
			 :refresher-triggered="getDataLoading" @refresherrefresh="onRefresh" @refresherrestore="onRestore" @scrolltolower="onTolower">
				<!-- <block v-if="tabelData.length"> -->
				<view style="height: 20rpx;"></view>
				<view class="item" @click="lookReplay(item)">
					<view class="question">
						<view class="txt">测试测试测试测试测试测试测试</view>
					</view>
					<view class="info-view">
						<view class="title">检查机构及人员</view>
						<view class="content">
							测试测试测试测试测试
						</view>
					</view>
					<view class="info-view">
						<view class="title">检查内容</view>
						<view class="content">测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试</view>
					</view>
					<view class="info-view">
						<view class="title">陪检人员</view>
						<view class="content">测试测试测试测试测试</view>
					</view>
				</view>
				<u-loadmore class="loadmore" :status="waitLoading?'loading':'nomore'" :icon-type="setting.iconType" :load-text="setting.loadText"
				 :is-dot="setting.isDot" />
				<view class="bottom"></view>
				<!-- </block> -->
				<!-- <view class="no-data-view" v-if="!tabelData.length">
					<view class="center">
						<image src="@/static/icon/no-data.svg" mode="widthFix" class="icon"></image>
						<view class="tip">暂无数据</view>
					</view>
				</view> -->
			</scroll-view>
		</view>
		<navigator url="../add/index" class="bottom-btn">
			<image src="@/static/icon/add-white.svg" mode="widthFix" class="icon"></image>添加检查记录
		</navigator>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 时间
				date: "",
				// 首页数据
				tabelData: [],
				tabelInfo: {},
				getDataLoading: false,
				// 解决popup里input不显示
				showFilterPopup: false
			}
		},
		computed: {
			userinfo() {
				return this.utils.getUserInfo()
			},
			setting() {
				return this.$store.state.setting
			}
		},
		methods: {
			// 触发下拉刷新
			async onRefresh() {
				console.log('下拉刷新')
				await this.getData()
				this.getDataLoading = false
			},
			// 刷新完成/重置
			onRestore() {
				this.getDataLoading = false;
				console.log("onRestore");
			},
			selectDataTime(e) {
				this.date = e.detail.value.replace(/-/g, '/')
				console.log(this.date)
			},
			lookReplay(item) {
				uni.navigateTo({
					url: "../detail/index"
				})
			},
			async getData() {
				if (this.getDataLoading) return
				uni.showNavigationBarLoading()
				this.getDataLoading = true
				try {
					let data = await uni.request({
						method: 'GET',
						url: this.api.spotcheck_search,
						data: {
							rows: this.pagesize,
							page: this.pageindex,
							checkuserid: this.userinfo.usernumber,
							checkdate: this.date,
							conerno: this.conerno,
							difflag: this.difference ? 1 : ''
						}
					})
					this.getDataLoading = false
					uni.hideNavigationBarLoading()
					let [err, success] = data
					console.log('查询成功------>>>', err, data)
					if (!err && success.data.success) {
						this.tabelData = this.tabelData.concat(success.data.data.pBillStockSpotcheckDetail)
						this.tabelInfo = success.data
						this.pagenum ? '' : this.pagenum = success.data.page
						this.pageindex += 1
					} else {
						uni.showToast({
							title: err ? err : success.data.errmsg,
							icon: 'none',
							duration: 3000
						});
					}
				} catch (e) {
					uni.hideNavigationBarLoading()
					this.getDataLoading = false
					console.log(e)
				}
			},
		},
		onLoad: async function() {
			this.date = this.moment().format("YYYY-MM")
			console.log(this.date)
			// this.getData()
		},
		onShow: async function() {

		}
	}
</script>

<style lang="scss" scoped>
	.container {
		background: #E5EDF1;

		.tabs {
			height: 80rpx;

			.left {
				line-height: 70rpx;
				padding-left: 20rpx;
				font-weight: 700;
			}

			.right {
				.content {
					height: 56rpx;
					margin: 12rpx 0;
					padding: 0rpx 40rpx;
					white-space: nowrap;
					background: #F2F2F2;
					color: #647484;
					border-radius: 10rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					margin-right: 20rpx;

					&:active {
						color: #298DF8;
					}
				}
			}
		}

		.main {
			height: calc(100vh - 70rpx - env(safe-area-inset-bottom));

			.scroll-view {
				height: 100%;

				.item {
					width: calc(100% - 40rpx);
					margin: 20rpx;
					margin-top: 0;
					background: #fff;
					border-radius: 10rpx;
					padding: 0 20rpx;
					padding-bottom: 10rpx;
					box-sizing: border-box;

					.question {
						padding: 20rpx 0rpx;
						font-size: 28rpx;
						display: flex;
						align-items: flex-start;

						.txt {
							flex: 2;
							color: #333;
							font-size: 26rpx;
							font-weight: 800;
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
						padding-bottom: 8rpx;

						.title {
							color: #647484;
							min-width: 5em;
							width: 5em;
							margin-right: 20rpx;
							white-space: normal;
						}

						.content {
							color: #333;
						}
					}
				}
			}
		}

		.bottom-btn {
			position: fixed;
			right: 40rpx;
			bottom: 40rpx;
			background: #647685;
			color: #fff;
			border-radius: 35rpx;
			line-height: 70rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 0 40rpx;
			box-shadow: 0 10rpx 10rpx 0 rgba(0, 0, 0, 0.3);
			margin-bottom: env(safe-area-inset-bottom);

			&:active {
				opacity: 0.9;
			}

			.icon {
				width: 30rpx;
				height: 30rpx;
				margin-right: 10rpx;
			}
		}
	}
</style>
