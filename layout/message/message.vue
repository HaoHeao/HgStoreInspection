<template>
	<view class="container">
		<scroll-view class="scroll-view" scroll-with-animation enable-back-to-top scroll-y refresher-enabled
		 scroll-with-animation :enable-back-to-top="setting.enableBackToTop" :refresher-triggered="getDataRefresherLoading"
		 @refresherrefresh="onRefresh" @refresherrestore="onRestore" @scrolltolower="onTolower">
			<view class="message-list" v-if="messageData.length">
				<view style="height:20rpx;"></view>
				<view class="item fadeIn" @click="messageGoGoGo(item)" v-for="(item,index) of messageData" :key="index">
					<view class="source">
						<image src="@/static/module1.png" mode="widthFix" class="img" v-if="item.itype == 1"></image>
						<image src="@/static/module2.png" mode="widthFix" class="img" v-if="item.itype == 2"></image>
						<image src="@/static/module3.png" mode="widthFix" class="img" v-if="item.itype == 3"></image>
						<view class="status" v-if="!item.logmsgview.length"></view>
					</view>
					<view class="right">
						<view class="sender">{{item.deptname}} - {{item.username}}</view>
						<view class="timer">{{item.insertdate}}</view>
						<view class="desc">
							<text class="type" v-if="item.msgtype == 1">[@您]</text>
							<text class="type" v-if="item.msgtype == 2">[回复]</text>
							<text class="type" v-if="item.msgtype == 3">[新的巡检]</text>
							{{item.msg}}
						</view>
					</view>
				</view>
				<u-loadmore :status="getMessageLoading?'loading':'nomore'" :icon-type="setting.iconType" :load-text="setting.loadText"
				 :is-dot="setting.isDot" :font-size="setting.loadmoreFontSize" :height="setting.loadmoreHeight" />
			</view>
			<view class="no-data-view fadeIn" v-if="!messageData.length">
				<view class="center">
					<image src="@/static/icon/no-data.svg" mode="widthFix" class="icon"></image>
					<view class="tip">暂无新消息</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				messageData: [],
				pagenum: "",
				pageindex: 1,
				pagesize: 20,
				getDataRefresherLoading: false,
				getMessageLoading: false,
			}
		},
		computed: {
			setting() {
				return this.$store.state.setting
			},
			userinfo() {
				return this.utils.getUserInfo()
			}
		},
		methods: {
			// 触发下拉刷新
			async onRefresh() {
				console.log('下拉刷新')
				this.getDataRefresherLoading = true
				await this.getMessageReset()
				await this.getMessage()
				await this.delay(300)
				this.getDataRefresherLoading = false
			},
			// 刷新完成/重置
			onRestore() {
				this.getDataRefresherLoading = false;
				console.log("onRestore");
			},
			// 滚动触底
			async onTolower() {
				console.log('滚动触底')
				if (!(this.pageindex <= this.pagenum && this.pagenum != 1)) {
					return
				}
				console.log('加载更多------>>>')
				await this.getMessage()
			},
			getMessageReset() {
				this.messageData = []
				this.pagenum = ""
				this.pageindex = 1
				this.pagesize = 20
				// this.getDataRefresherLoading = false
				// this.getMessageLoading = false
			},
			// 获取消息列表
			async getMessage() {
				if (this.getMessageLoading) return
				uni.showNavigationBarLoading()
				this.getMessageLoading = true
				try {
					let data = await uni.request({
						method: 'POST',
						url: this.api.layout_getMessageList,
						data: {
							usernumber: this.userinfo.usernumber,
							deptid: this.userinfo.deptid,
							pagesize: this.pagesize,
							pageindex: this.pageindex,
						}
					})
					uni.hideNavigationBarLoading()
					this.getMessageLoading = false
					this.getDataRefresherLoading = false
					let [err, success] = data
					console.log('消息列表请求成功------>>>', success)
					if (!err && success.data.success) {
						this.messageData = this.messageData.concat(success.data.data)
						this.pagenum ? '' : this.pagenum = success.data.pagenum
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
					this.waitLoading = false
					console.log(e)
				}
			},
			async lookedMessage(item) {
				try {
					let data = await uni.request({
						method: 'POST',
						url: this.api.layout_sendMessageLooked,
						data: {
							msgviewid: 0,
							imlogid: item.imlogid,
							usernumber: this.userinfo.usernumber,
							username: '',
							deptid: 0,
							deptname: '',
							insertdate: this.moment().format('yyyy-MM-dd hh:mm:ss')
						}
					})
					let [err, success] = data
					console.log('发送消息已阅读成功------>>>', success)
				} catch (e) {
					console.log(e)
				}
			},
			messageGoGoGo(item) {
				console.log("查看信息参数", item);
				this.lookedMessage(item)
				if (item.itype == 1) {
					if (item.questionid == 0) {
						uni.navigateTo({
							url: `/pages-packages/store/detail/detail?inspectionlogid=${item.inspectionid}`
						})
						return;
					}
					uni.navigateTo({
						url: `/pages-packages/store/discuss/discuss?inspectionlogid=${item.inspectionid}&questionid=${item.questionid}&navigatePage=1`
					})
				} else if (item.itype == 2) {
					if (item.questionid == 0) {
						uni.navigateTo({
							url: `/pages-packages/plan/plan/plan?planid=${item.inspectionid}&planquestionid=${item.questionid}`
						})
						return;
					}
					uni.navigateTo({
						url: `/pages-packages/plan/question/question?planid=${item.inspectionid}&planquestionid=${item.questionid}&navigatePage=1`
					})
				}
			},
		},
		created: function() {
			uni.setNavigationBarTitle({
				title: "我的消息"
			});
			this.getMessageReset()
			this.getMessage();
		},
	}
</script>

<style scoped lang="scss">
	.container {
		background: #F6F7F9;

		.scroll-view {
			height: calc(100vh - 100rpx - env(safe-area-inset-bottom));
		}

		.message-list {

			.item {
				margin: 20rpx;
				margin-top: 0;
				background: #fff;
				border-radius: 8rpx;
				width: calc(100% - 40rpx);
				padding: 20rpx;
				display: flex;
				justify-content: flex-start;
				box-sizing: border-box;
				position: relative;

				.source {
					min-width: 60rpx;
					height: 78rpx;
					margin-right: 10rpx;
					display: flex;
					align-items: center;
					position: relative;

					.status {
						width: 18rpx;
						height: 18rpx;
						background: #D56C68;
						border-radius: 30rpx;
						position: absolute;
						right: 0;
						top: 0;
					}

					.img {
						width: 100%;
					}
				}

				.right {
					display: flex;
					justify-content: flex-start;
					flex-wrap: wrap;
					flex: 2;

					.sender {
						font-size: 28rpx;
						color: #333;
						font-weight: 700;
					}

					.timer {
						flex: 2;
						text-align: right;
						font-size: 26rpx;
						color: #ccc;
					}

					.desc {
						padding-top: 7rpx;
						min-width: 100%;
						font-size: 26rpx;
						color: #647484;
						word-break: break-word;

						.type {
							font-weight: 700;
						}

						.round {
							width: 18rpx;
							height: 18rpx;
							border-radius: 22rpx;
							background: #D56C68;
							display: inline-block;
						}

						.status {
							color: #D56C68;
							font-weight: 800;
						}
					}
				}

				&:active {
					background: #f2f2f2;
					animation: fadeIn 300ms;

					.timer {
						color: #333;
					}
				}
			}
		}
	}
</style>
