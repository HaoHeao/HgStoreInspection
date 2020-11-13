<template>
	<view class="container">
		<scroll-view class="scroll-view" scroll-y refresher-enabled scroll-with-animation :enable-back-to-top="setting.enableBackToTop"
		 :refresher-triggered="getDataRefresherLoading" @refresherrefresh="onRefresh" @refresherrestore="onRestore">
			<view class="top-placeholder"></view>
			<block v-if="inspectionDetail">
				<view class="question msg" @click.stop="navigateToPlan()" v-if="navigatePage">
					<view class="msg-title">{{inspectionDetail.title}}</view>
					<view class="msg-list">
						<view class="left">上传人</view>
						<view class="content">{{inspectionDetail.deptname + ' - ' + inspectionDetail.username}}</view>
					</view>
					<view class="msg-list">
						<view class="left">巡查日期</view>
						<view class="content">{{inspectionDetail.insertdate}}</view>
					</view>
					<view class="msg-list">
						<view class="left">描述</view>
						<view class="content">{{inspectionDetail.remark}}</view>
					</view>
				</view>
				<view class="question" v-if="inspectionQuestionDetail">
					<view class="question-info">
						<view class="user">{{inspectionQuestionDetail.deptname}} - {{inspectionQuestionDetail.username}}</view>
						<view class="timer">{{inspectionQuestionDetail.insertdate}}</view>
					</view>
					<view class="info-list">
						<view class="left">说明</view>
						<view class="content">{{inspectionQuestionDetail.remark}}</view>
					</view>
					<!-- 图片 -->
					<view class="question-img" v-if="inspectionQuestionDetail.loginspectionquestionimg.length">
						<view class="item" v-for="(item,index) of inspectionQuestionDetail.loginspectionquestionimg" :key="index" @click="previewImage(inspectionQuestionDetail.loginspectionquestionimg,index)">
							<image class="img" :src="item.imgurl + setting.OSSDownload" mode="widthFix"></image>
						</view>
					</view>
				</view>
				<block v-if="inspectionQuestionDetail.loginspectionanswers.length">
					<view class="reply-list-title">问题讨论</view>
					<view class="reply-list">
						<view class="reply-item" v-for="(item,index) of inspectionQuestionDetail.loginspectionanswers" :key="index">
							<view class="top">
								<view class="user">{{item.deptname}} - {{item.username}}</view>
								<view class="date">{{item.insertdate}}</view>
							</view>
							<view class="remark">{{item.reason}}</view>
						</view>
					</view>
				</block>
			</block>
			<u-loadmore :status="getDataLoading?'loading':'nomore'" :icon-type="setting.iconType" :load-text="setting.loadText"
			 :is-dot="setting.isDot" :font-size="setting.loadmoreFontSize" :margin-top="setting.loadmoreMarginTop"
			 :margin-bottom="setting.loadmoreMarginBottom" />
		</scroll-view>
		<view class="popup reply-view" v-if="inspectionDetail && inspectionDetail.feedback">
			<view class="popup-content">
				<view class="textarea-view">
					<textarea v-model="reason" disable-default-padding auto-height fixed maxlength="500" class="textarea" placeholder="处理方法或建议"></textarea>
				</view>
				<view class="send-btn" @click="sendReply()">
					<u-loading :show="sendFeedBackLoading" mode="circle" size="28"></u-loading>
					{{sendFeedBackLoading?'':'提交'}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				inspectionlogid: '',
				questionid: '',
				// 是否其他页面跳过来的
				navigatePage: false,
				// 巡检明细
				inspectionDetail: null,
				// 巡检问题明细
				inspectionQuestionDetail: null,
				reason: '',
				getDataLoading: false,
				getDataRefresherLoading: false,
				sendFeedBackLoading: false
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
			openReplyPopup() {
				this.reason = ''
				this.$refs['reply'].open()
			},
			// 触发下拉刷新
			async onRefresh() {
				this.getDataRefresherLoading = true
				await this.getInspectionDetail();
				this.getDataRefresherLoading = false
			},
			// 刷新完成/重置
			onRestore() {
				this.getDataRefresherLoading = false
			},
			// 是否可以回复和讨论
			feedbackFilter() {
				let _this = this;
				let feedback = (function() {
					// 通知部门
					for (let dept of _this.inspectionDetail.mapinspectiondept) {
						if (_this.userinfo.deptlist.filter(i => i.deptid == dept.deptid).length) return true;
					}
					// 通知人员
					for (let user of _this.inspectionDetail.mapinspectionuser) {
						if (user.usernumber == _this.userinfo.usernumber) return true;
					}
					// 上传人
					if (_this.inspectionDetail.usernumber == _this.userinfo.usernumber) return true
				}())
				// 巡检问题状态
				this.inspectionDetail.feedback = (feedback && this.inspectionDetail.status == 0) ? true : false
			},
			// 卖场巡检获取明细
			async getInspectionDetail() {
				if (this.getDataLoading) return
				this.getDataLoading = true
				uni.showNavigationBarLoading()
				try {
					let data = await uni.request({
						url: this.api.store_getQuestionDetail,
						data: {
							id: this.inspectionlogid,
							usernumber: this.userinfo.usernumber
						}
					})
					uni.hideNavigationBarLoading()
					let [err, success] = data
					this.getDataLoading = false
					console.log('卖场巡检获取明细--->>>', err, success)
					if (!err && success.data.success) {
						this.inspectionDetail = success.data.data.loginspection
						this.inspectionQuestionDetail = success.data.data.loginspection.loginspectionquestion.filter(item => item.questionid ==
							this.questionid)[0]
						console.log('卖场巡检数据--->>>', this.inspectionDetail, '卖场巡检回复数据--->>>', this.inspectionQuestionDetail)
						this.feedbackFilter()
						this.$forceUpdate()
					} else {
						uni.showToast({
							title: err ? err : success.data.errmsg,
							icon: 'none',
							duration: 3000
						});
					}
				} catch (e) {
					console.log(e)
					this.getDataLoading = false
					uni.hideNavigationBarLoading()
				}
			},
			// 查看图片
			previewImage(list, index) {
				uni.previewImage({
					current: index,
					urls: list.filter(item => item.imgurl).map(item => item.imgurl)
				});
			},
			// 讨论回复
			async sendReply() {
				let _this = this;
				if (!this.reason) {
					uni.showToast({
						icon: 'none',
						title: "请输入处理方法或建议",
						duration: 3000
					})
					return;
				}
				if (this.sendFeedBackLoading) return;
				this.sendFeedBackLoading = true
				try {
					let data = await uni.request({
						method: 'POST',
						url: this.api.store_replyFeedback,
						data: {
							loginspectionanswers: {
								answered: 0, //传0就行
								questionid: this.questionid, //这个是对应讨论的主键"
								reason: this.reason, //回复的内容
								remark: "", //为空就行,
								parentid: 0, //传0就行
								insertdate: this.moment().format('YYYY-MM-DD hh:mm:ss'),
								userid: this.userinfo.userid, //登录人id,
								usernumber: this.userinfo.usernumber, //登录人工号,
								username: this.userinfo.username, //名称,
								deptid: this.userinfo.deptid, //登录人部门id
								deptname: this.userinfo.deptname //部门名称
							}
						}
					})
					let [err, success] = data
					this.sendFeedBackLoading = false
					console.log('回复结果--->>>', err, success)
					if (!err && success.data.success) {
						this.reason = ''
						this.getInspectionDetail()
					} else {
						uni.showToast({
							title: err ? err : success.data.errmsg,
							icon: 'none',
							duration: 3000
						});
					}
				} catch (e) {
					console.log(e)
					this.sendFeedBackLoading = false
				}
			},
			// 顶部点击回到卖场巡检明细detail
			navigateToPlan() {
				uni.navigateTo({
					url: "/pages-packages/store/detail/detail?inspectionlogid=" + this.inspectionlogid
				})
			},
		},
		onLoad(option) {
			this.inspectionlogid = option.inspectionlogid
			this.questionid = option.questionid
			option.navigatePage == 1 ? this.navigatePage = true : this.navigatePage = false;
			this.getInspectionDetail()
		},
		onShow: function() {}
	}
</script>

<style scoped lang="scss">
	page {
		background: #E5EDF1;
	}

	.container {
		height: 100vh;
		background: #E5EDF1;
		padding-bottom: env(safe-area-inset-bottom);

		.scroll-view {
			height: 100vh;

			// 顶部20rpx间隔
			.top-placeholder {
				height: 20rpx;
			}

			// 消息页进入显示问题内容
			.question.msg {
				border: 4rpx solid #40A9FF;
				font-size: 26rpx;
				margin-bottom: 20rpx;

				.msg-title {
					font-weight: 700;
					font-size: 28rpx;
					padding-bottom: 10rpx;
				}

				.msg-list {
					display: flex;
					padding-bottom: 5rpx;
					color: #A4B1BE;

					.left {
						width: 125rpx;
					}

					.content {
						flex: 2;
						color: #323436;
						word-break: break-word;
					}
				}

				&:active {
					background: #f2f2f2;
					animation: fadeIn 300ms;
				}
			}

			.question {
				background: #fff;
				width: calc(100% - 40rpx);
				margin: 0 20rpx;
				padding: 20rpx;
				padding-bottom: 10rpx;
				font-size: 26rpx;
				box-sizing: border-box;
				border-radius: 10rpx;

				.item-title {
					color: #333;
					font-weight: 700;
				}

				.question-info {
					display: flex;
					justify-content: flex-start;
					color: #647484;
					padding-bottom: 20rpx;

					.timer {
						flex: 2;
						text-align: right;
						color: #B6C6D6;
					}
				}

				.info-list {
					display: flex;
					color: #A4B1BE;
					margin-bottom: 5rpx;

					.left {
						min-width: 4em;
						text-align-last: justify;
						padding-right: 10rpx;
						margin-right: 10rpx;
					}

					.content {
						flex: 2;
						color: #647484;
						word-break: break-word;
					}
				}

				.question-img {
					width: 100%;
					display: flex;
					justify-content: flex-start;
					flex-wrap: wrap;
					padding-top: 20rpx;

					.item {
						width: 120rpx;
						height: 120rpx;
						overflow: hidden;
						margin-right: 15rpx;
						margin-bottom: 15rpx;
						border-radius: 6rpx;

						.img {
							width: 100%;
							min-height: 100%;
							background: #f2f2f2;
						}
					}
				}
			}

			.reply-list-title {
				padding: 20rpx 0;
				color: #424242;
				font-size: 28rpx;
				text-align: center;
				width: 100%;
				font-weight: 700;
			}

			// 回复列表
			.reply-list {
				width: 100%;

				.reply-item {
					width: calc(100% - 40rpx);
					margin: 0 20rpx;
					margin-bottom: 20rpx;
					background: #fff;
					border-radius: 10rpx;
					box-sizing: border-box;

					.top {
						padding: 20rpx;
						display: flex;
						justify-content: flex-start;
						align-items: center;
						font-size: 24rpx;

						.user {
							color: #647484;
							flex: 2;
						}

						.date {
							height: 20rpx;
							line-height: 20rpx;
							color: #B6C6D6;
						}
					}

					>.remark {
						color: #647484;
						font-size: 24rpx;
						padding: 20rpx;
						padding-top: 0;
						word-wrap: break-word;
						word-break: normal;
					}
				}
			}
		}

		.popup.reply-view {
			padding: 0;
			padding-bottom: env(safe-area-inset-bottom);
			position: fixed;
			bottom: 0;
			left: 0;
			z-index: 999;
			width: 100%;
			box-shadow: 10rpx 0 10rpx 0 rgba(0, 0, 0, 0.1);

			.popup-content {
				padding: 20rpx;
				display: flex;
				align-items: flex-end;

				.textarea-view {
					padding: 20rpx;
					background: #F3F5F7;
					box-sizing: border-box;
					border-radius: 6rpx;
					overflow: hidden;

					.textarea {
						max-height: 200rpx;
						font-size: 28rpx;
						max-width: 100%;
					}
				}

				.send-btn {
					text-align: center;
					width: 100rpx;
					margin-left: 20rpx;
					white-space: nowrap;
					padding: 20rpx 0;
					border-radius: 6rpx;
					background: #f2f2f2;
					color: #1BA1F3;
					font-size: 26rpx;

					&:active {
						background: rgba(0, 0, 0, 0.2);
					}
				}
			}
		}
	}
</style>
