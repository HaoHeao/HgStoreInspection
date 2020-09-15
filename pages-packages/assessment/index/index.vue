<template>
	<view class="container">
		<haoheao-scroll class="haoheao-scroll" ref="scroll" @onPullDown="onPullDown" @onLoadMore="onLoadMore">
			<view class="data-view" v-if="tabelData.length">
				<view class="item fadeIn" @click="openDetail(item)" v-for="(item,index) of tabelData" :key="index">
					<view class="title">
						<view class="round" v-if="item.status == 1000"></view>{{item.questiontitle}}{{item.qlabel?`(${item.qlabel})`:''}}
					</view>
					<view class="content-list">
						<view class="item">
							<view class="title">内容：</view>
							<view class="content">{{item.qcontent}}</view>
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
				<view class="text">以上为全部考核项目</view>
				<view class="line"></view>
			</view>
		</haoheao-scroll>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				uni,
				// 首页数据
				tabelData: [],
				pagesize: 20,
				pagenum: 1,
				pageindex: 1,
			}
		},
		computed: {

		},
		methods: {
			// 下拉刷新
			async onPullDown(done) {
				this.pageindex = 1;
				this.tabelData = [];
				await this.search(1)
				done();
			},
			onLoadMore(e) {
				if (this.pageindex <= this.pagenum && this.pagenum != 1) {
					this.search(this.pageindex);
				}
			},
			async search(pageindex) {
				console.log(this.pageindex, pageindex, this.pagenum)
				if (this.pageindex > this.pagenum) {
					return
				}
				uni.showLoading({
					title: '加载中'
				});
				try {
					let data = await uni.request({
						method: 'GET',
						url: this.api.assessment_getQuestions,
						data: {
							rows: this.pagesize,
							page: pageindex,
						}
					})
					let [err, success] = data
					console.log('查询成功------>>>', data)
					uni.hideLoading();
					if (success.data.success && success.data.data.AssessmentQuestionsInfo.length) {
						this.tabelData = this.tabelData.concat(success.data.data.AssessmentQuestionsInfo)
						this.pagenum = Number((success.data.total / this.pagesize).toFixed(0)) + 1
						this.pageindex = this.pageindex + 1;
					} else {
						this.tabelData = []
						uni.showToast({
							title: err ? err : success.data.errmsg,
							icon: 'none',
							duration: 3000
						});
					}
				} catch (e) {
					uni.hideLoading();
					console.log(e)
				}
			},
		},
		onLoad: async function() {
			this.search(this.pageindex)
		},
		onShow: async function() {

		}
	}
</script>

<style lang="scss" scoped>
	page {
		background: #E5EDF1;
	}

	.container {
		height: 100vh;
		background: #E5EDF1;
		/* IOS XR */
		padding-bottom: env(safe-area-inset-bottom);

		.haoheao-scroll {
			height: 100%;
		}

		.data-view {
			font-size: 28rpx;
			padding-top: 20rpx;
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
							white-space: nowrap;
						}

						.content {
							color: #333;
						}
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

		.null-data .text {
			background: #E5EDF1;
		}
	}
</style>
