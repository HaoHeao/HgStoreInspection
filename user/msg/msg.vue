<template>
	<view class="container">
		<haoheao-scroll class="haoheao-scroll" ref="scroll" @onPullDown="onPullDown" @onLoadMore="onLoadMore">
			<view class="msg_list" v-if="msgList.length">
				<view class="item fadeIn" @click="navigator(item)" v-for="(item,index) of msgList" :key="index">
					<view class="source">
						<image src="../../static/module1.png" mode="widthFix" class="img" v-if="item.itype == 1"></image>
						<image src="../../static/module2.png" mode="widthFix" class="img" v-if="item.itype == 2"></image>
						<image src="../../static/module3.png" mode="widthFix" class="img" v-if="item.itype == 3"></image>
						<view class="status" v-if="!item.logmsgview.length"></view>
					</view>
					<view class="right">
						<view class="sender">{{item.deptname}} - {{item.username}}</view>
						<view class="timer">{{item.insertdate1}}</view>
						<view class="desc">
							<text class="type" v-if="item.msgtype == 1">[@您]</text>
							<text class="type" v-if="item.msgtype == 2">[回复]</text>
							<text class="type" v-if="item.msgtype == 3">[新的巡检]</text>
							{{item.msg}}
						</view>
					</view>
				</view>
				<u-loadmore status="nomore" :icon-type="setting.iconType" :load-text="setting.loadText" :is-dot="setting.isDot"
				 :font-size="setting.loadmoreFontSize" :margin-top="setting.loadmoreMarginTop" :margin-bottom="setting.loadmoreMarginBottom" />
			</view>
			<view class="no-data-view fadeIn" v-if="!msgList.length">
				<view class="center">
					<image src="@/static/icon/no-data.svg" mode="widthFix" class="icon"></image>
					<view class="tip">暂无新消息</view>
				</view>
			</view>
		</haoheao-scroll>
	</view>
</template>

<script>
	let request = require('@/util/utils.js').api;
	export default {
		data() {
			return {
				msgList: [],
				pagenum: "",
				pageindex: 1
			}
		},
		computed: {
			setting() {
				return this.$store.state.setting
			},
			userinfo() {
				return this.utils.getUserInfo(uni)
			}
		},
		methods: {
			onPullDown(done) { // 下拉刷新
				this.pageindex = 1;
				this.msgList = [];
				this.getMsg(this.pageindex, done);
			},
			onLoadMore(e) {
				if (this.pageindex <= this.pagenum && this.pagenum != 1) {
					this.getMsg(this.pageindex);
				}
			},
			navigator(item) {
				console.log("查看信息参数", item);
				let insertdate = this.moment(new Date()).format('yyyy-MM-dd hh:mm:ss');
				let setMsg = {
					msgviewid: 0,
					imlogid: item.imlogid,
					usernumber: this.userinfo.usernumber,
					username: '',
					deptid: 0,
					deptname: '',
					insertdate
				}
				request.setMsgSee(setMsg);
				if (item.itype == 1) {
					if (item.questionid == 0) {
						uni.navigateTo({
							url: `/pages-packages/plan/plan/plan?planid=${item.inspectionid}&planquestionid=${item.questionid}`
						})
						return;
					}
					uni.navigateTo({
						url: `/pages-packages/plan/question/question?planid=${item.inspectionid}&planquestionid=${item.questionid}`
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
			getMsg(pageindex, done) {
				// console.log(pageindex)
				// done下拉刷新结束
				uni.hideLoading();
				uni.showLoading({
					title: '加载中'
				});
				let option = {
					usernumber: this.userinfo.usernumber,
					deptid: this.userinfo.deptid,
					pagesize: 20,
					pageindex
				};
				let _this = this;
				console.log("请求页面信息参数", option);
				request.getMsg(option).then(res => {
					let [err, data] = res;
					console.log("消息请求成功：", err, data.data);
					if (done) done();
					uni.hideLoading();
					if (err == null) {
						_this.utils.timerDateString(data.data.data);
						_this.msgList = _this.msgList.concat(data.data.data);
						if (!this.pagenum) {
							this.pagenum = data.data.pagenum
						}
						this.pageindex = this.pageindex + 1;
					} else {
						uni.showToast({
							icon: 'none',
							title: '请求失败:' + err.errMsg,
							duration: 3000
						});
					};
				}).then(() => {
					uni.hideLoading();
				})
			}
		},
		onHide() {
			uni.hideLoading();
		},
		created:function(){
			this.getMsg(this.pageindex);
		},
	}
</script>

<style scoped lang="scss">
	.container {
		height: calc(100vh - 100rpx);
		margin-bottom: 100rpx;
		background: #F6F7F9;

		.haoheao-scroll {
			height: 100%;
		}

		.msg_list {
			margin-top: 20rpx;
			padding-bottom: 20rpx;

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
