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
							<!-- <view class="round"></view> -->
							<!-- <text class="type status" v-if="!item.logmsgview.length">[ 未读 ]</text> -->
							<text class="type" v-if="item.msgtype == 1">[@您]</text>
							<text class="type" v-if="item.msgtype == 2">[回复]</text>
							{{item.msg}}
						</view>
					</view>
				</view>
				<!-- <view class="item" @click="navigator()">
					<view class="source">
						<image src="../../static/module1.png" mode="widthFix" class="img"></image>
					</view>
					<view class="right">
						<view class="sender">法务部 - 刘永强</view>
						<view class="timer">12:59</view>
						<view class="desc"><text class="type">[@您]</text>描述描述描述描述描述描述描述描述描述</view>
					</view>
				</view>
				<view class="item">
					<view class="source">
						<image src="../../static/module2.png" mode="widthFix" class="img"></image>
					</view>
					<view class="right">
						<view class="sender">法务部 - 刘永强</view>
						<view class="timer">昨天 12:59</view>
						<view class="desc"><text class="type">[回复]</text>描述描述描述描述描述描述描述描述描述</view>
					</view>
				</view>
				<view class="item">
					<view class="source">
						<image src="../../static/module3.png" mode="widthFix" class="img"></image>
					</view>
					<view class="right">
						<view class="sender">法务部 - 刘永强</view>
						<view class="timer">2019-10-23 12:59</view>
						<view class="desc"><text class="type"></text>描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述</view>
					</view>
				</view> -->
				<view class="null-data">
					<view class="text">以上为全部消息</view>
					<view class="line"></view>
				</view>
			</view>
			<view class="no-data" v-if="!msgList.length">
				<view class="img-v">
					<image class="img" src="../../static/data_null.png" mode="widthFix"></image>
				</view>
				<view class="txt">暂无新消息</view>
			</view>
		</haoheao-scroll>
	</view>
</template>

<script>
	let utils = require('@/util/utils.js');
	let request = utils.api;
	let moment = utils.moment;
	import haoheaoScroll from '@/components/haoheao-scroll/haoheao-scroll.vue'
	import skeleton from '@/components/skeleton/skeleton.vue'
	export default {
		props: ['reflesh'],
		components: {
			haoheaoScroll,
			skeleton,
		},
		data() {
			return {
				msgList: [],
				pagenum: "",
				pageindex: 1
			}
		},
		watch: {
			reflesh(news, old) {
				this.pageindex = 1;
				this.msgList = [];
				this.getMsg(this.pageindex);
			}
		},
		onHide() {
			uni.hideLoading();
		},
		methods: {
			onPullDown(done) { // 下拉刷新
				this.pageindex = 1;
				this.msgList = [];
				this.getMsg(this.pageindex, done);
			},
			onLoadMore(e) {
				// console.log(e);
				// console.log(this.pageindex)
				// console.log(this.pagenum)
				if (this.pageindex <= this.pagenum && this.pagenum != 1) {
					this.getMsg(this.pageindex);
					// this.pageindex += 1;
				}
			},
			navigator(item) {
				utils.getMarketDeptList(this);
				utils.getMarketUserList(this);
				console.log("查看信息参数", item);
				let insertdate = moment().format('yyyy-MM-dd hh:mm:ss');
				let setMsg = {
					msgviewid: 0,
					imlogid: item.imlogid,
					usernumber: uni.getStorageSync('userinfo').usernumber,
					username: '',
					deptid: 0,
					deptname: '',
					insertdate
				}
				request.setMsgSee(setMsg);
				if (item.itype == 1) {
					if (item.questionid == 0) {
						uni.navigateTo({
							url: "../../pages/seeDetail/seeDetail?id=" + item.inspectionid + "&reply_id=" + item.questionid +
								"&msg=" + 'true' + '&postThereTrue=' + "true" + "&previs=" + true
						})
						return;
					}
					// if (item.msgtype == 1) {
					uni.navigateTo({
						url: "../../pages/viewQuestion/viewQuestion?id=" + item.inspectionid + "&reply_id=" + item.questionid +
							"&msg=" + 'true' + '&postThereTrue=' + "true" + "&previs=" + true
					})
				} else if (item.itype == 2) {
					if (item.questionid == 0) {
						uni.navigateTo({
							url: "../../pages-plan/seeDetail/seeDetail?id=" + item.inspectionid + "&reply_id=" + item.questionid +
								"&msg=" + 'true' + '&postThereTrue=' + "true" + "&previs=" + 'true'
						})
						return;
					}
					// if (item.msgtype == 1) {
					console.log("计划巡检-回复")
					uni.navigateTo({
						url: "../../pages-plan/viewQuestion/viewQuestion?id=" + item.inspectionid + "&reply_id=" + item.questionid +
							"&previs=" + 'true' + "&room=" + 'msg'
					});
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
					usernumber: uni.getStorageSync("userinfo").usernumber,
					deptid: uni.getStorageSync("userinfo").deptid,
					pagesize: this.$store.state.plan.pagesize,
					// pagesize: 10,
					pageindex
				};
				let _this = this;
				console.log("请求页面信息参数", option);
				request.getMsg(option).then(res => {
					let [err, data] = res;
					console.log("消息请求成功：", err, data.data);
					if (done) done();
					if (err == null) {
						utils.timerDateString(data.data.data);
						_this.msgList = _this.msgList.concat(data.data.data);
						if (!this.pagenum) {
							this.pagenum = data.data.pagenum
						}
						this.pageindex = this.pageindex + 1;
						uni.hideLoading();
					} else {
						uni.showToast({
							icon: 'none',
							title: '请求失败:' + err.errMsg,
							duration: 3000
						});
					};
					uni.hideLoading();
				}).then(() => {
					uni.hideLoading();
				})
			}
		}
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
