<template>
	<view class="container">
		<view class="tabs">
			<view class="left">{{tabelData.length?`共 ${tabelData.length} 条记录`:''}}</view>
			<view class="center"></view>
			<view class="right">
				<picker header-text="选择时间" mode="date" fields="month" @change="selectDataTime">
					<view class="content">{{moment(date.replace(/-/g, '/') + '/01').format("YYYY年MM月")}}</view>
				</picker>
			</view>
		</view>
		<view class="main">
			<scroll-view class="scroll-view" scroll-y refresher-enabled scroll-with-animation :enable-back-to-top="setting.enableBackToTop"
			 :refresher-triggered="getDataLoading" @refresherrefresh="onRefresh" @refresherrestore="onRestore">
				<block v-if="tabelData.length">
					<view style="height: 20rpx;"></view>
					<view class="item" @click="lookReplay(item)" v-for="(item,index) of tabelData" :key="index">
						<view class="question">
							<view class="txt">{{`${moment(item.chkdate.replace(/-/g, '/')).format("YYYY年MM月DD日")}  ${item.chktime.replace(/~/g, ' - ')}`}}</view>
						</view>
						<view class="info-view">
							<view class="title">检查机构及人员</view>
							<view class="content">
								{{item.orguser}}
							</view>
						</view>
						<view class="info-view">
							<view class="title">检查内容</view>
							<view class="content">{{item.chkplace}}</view>
						</view>
						<view class="info-view">
							<view class="title">陪检人员</view>
							<view class="content">{{item.compuser}}</view>
						</view>
					</view>
					<u-loadmore :status="getDataLoading?'loading':'nomore'" :icon-type="setting.iconType" :load-text="setting.loadText"
					 :is-dot="setting.isDot" :font-size="setting.loadmoreFontSize" :height="setting.loadmoreHeight" />
					<view style="height: 160rpx;"></view>
				</block>
				<view class="no-data-view" v-if="!tabelData.length">
					<view class="center">
						<image src="@/static/icon/no-data.svg" mode="widthFix" class="icon"></image>
						<view class="tip">暂无数据</view>
					</view>
				</view>
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
				getDataLoading: false,
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
			},
			// 刷新完成/重置
			onRestore() {
				this.getDataLoading = false;
				console.log("onRestore");
			},
			selectDataTime(e) {
				this.date = e.detail.value.replace(/-/g, '/')
				console.log('date', this.date)
				this.getData()
			},
			lookReplay(item) {
				uni.navigateTo({
					url: "../detail/index?inspectionlogid=" + item.orgchecklogid
				})
			},
			// 获取列表数据
			async getData() {
				if (this.getDataLoading) return
				this.getDataLoading = true
				try {
					let data = await uni.request({
						method: 'GET',
						url: this.api.storeinspection_getDataList,
						data: {
							sdate: this.moment(`${this.date}/01`).format("YYYY/MM/01"),
							edate: (new Date(`${this.date}/01`).getMonth() + 2 >
								12 ? new Date(`${this.date}/01`).getFullYear() + 1 : new Date(`${this.date}/01`).getFullYear()) + '/' + (
								new Date(
									`${this.date}/01`).getMonth() + 2 >
								12 ? '01' : new Date(`${this.date}/01`).getMonth() + 2) + '/' + '01',
						}
					})
					this.getDataLoading = false
					let [err, success] = data
					console.log('查询成功------>>>', err, success)
					if (!err && success.data.success) {
						this.tabelData = success.data.data[0]
						console.log('获取列表数据成功------>>>', this.tabelData)
					} else {
						uni.showToast({
							title: err ? err : success.data.errmsg,
							icon: 'none',
							duration: 3000
						});
					}
				} catch (e) {
					this.getDataLoading = false
					console.log(e)
				}
			},
		},
		onLoad: async function() {
			this.date = this.moment().format("YYYY/MM")
			console.log(this.date)
			this.getData()
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
							width: 4em;
							min-width: 4em;
							margin-right: 20rpx;
							white-space: normal;
						}

						.content {
							color: #333;
							word-break:break-all;
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
