<template>
	<view class="container">
		<haoheao-scroll class="haoheao-scroll" ref="scroll" @onPullDown="onPullDown">
			<block v-if="!infoDetail.status">
				<view class="skeleton mode">
					<view class="shadow-state backcolor"></view>
					<view class="shadow-title backcolor"></view>
					<view class="shadow-border backcolor2"></view>
					<view class="shadow-line">
						<view class="shadow-row left backcolor"></view>
						<view class="shadow-row right backcolor"></view>
					</view>
					<view class="shadow-line">
						<view class="shadow-row left backcolor"></view>
						<view class="shadow-row right backcolor"></view>
					</view>
					<view class="shadow-line">
						<view class="shadow-row left backcolor"></view>
						<view class="shadow-row right backcolor"></view>
					</view>
					<view class="shadow-line">
						<view class="shadow-row left backcolor"></view>
						<view class="shadow-row right backcolor"></view>
					</view>
					<view class="shadow-line">
						<view class="shadow-row left backcolor"></view>
						<view class="shadow-row right backcolor"></view>
					</view>
				</view>
				<view class="skeleton mode"></view>
				<view class="skeleton mode"></view>
				<view class="skeleton mode"></view>
				<view class="skeleton mode"></view>
				<view class="skeleton mode"></view>
			</block>
			<!-- <view class="replay-null">
                <view class="none">
                    <view class="txt">请下拉重新加载...</view>
                    <view class="line"></view>
                </view>
            </view> -->
			<block v-if="infoDetail.status">
				<view class="module info fadeIn">
					<view class="top-view">
						<view class="state not-started" v-if="infoDetail.status == 1000 && !infoDetail.notStarted">
							未开始
						</view>
						<view class="state" v-if="infoDetail.status == 1000 && infoDetail.notStarted">
							执行中
						</view>
						<view class="state resolved" v-if="infoDetail.status == 2000">
							已完成
						</view>
						<view class="center"></view>
					</view>
					<view class="title" v-if="infoDetail.title">{{infoDetail.title}}</view>
					<view class="line" v-if="infoDetail.title"></view>
					<view class="detail-item uploader" v-if="infoDetail.deptname">
						<view class="item">上传人</view>
						<view class="content">
							<block>{{infoDetail.deptname?infoDetail.deptname:''}} - {{infoDetail.username?infoDetail.username:''}}</block>
						</view>
					</view>
					<view class="detail-item date" v-if="infoDetail.sdate1">
						<view class="item">巡查日期</view>
						<view class="content">{{infoDetail.sdate1?infoDetail.sdate1:''}} - {{infoDetail.edate1?infoDetail.edate1:''}}</view>
					</view>
					<view class="detail-item department">
						<view class="item">参与部门</view>
						<view class="content" v-if="infoDetail.itemdeptlist.length">
							<text>
								<block>{{infoDetail.itemdeptlist[0]}}</block>
								<block v-for="(ite,ind) of infoDetail.itemdeptlist" :key="ind" v-if="ind != 0">{{'、' + ite}}</block>
							</text>
						</view>
						<view class="content" v-if="!infoDetail.itemdeptlist.length">无整改部门</view>
					</view>
					<view class="detail-item person">
						<view class="item">参与人员</view>
						<view class="content" v-if="infoDetail.itempersonlist.length">
							<text>
								<block>{{infoDetail.itempersonlist[0]}}</block>
								<block v-for="(ite,ind) of infoDetail.itempersonlist" :key="ind" v-if="ind != 0">{{'、' + ite}}</block>
							</text>
						</view>
						<view class="content" v-if="!infoDetail.itempersonlist.length">未指定人员</view>
					</view>
					<view class="detail-item describe">
						<view class="item">检查重点</view>
						<text class="content" v-if="infoDetail.content">{{infoDetail.content}}</text>
						<text class="content" v-if="!infoDetail.content">无描述</text>
						<!-- <rich-text :nodes="infoDetail.content"></rich-text> -->
					</view>
					<!-- <view class="detail-item inp-item">
					<view class="item">巡检项目</view>
					<view class="content-list" v-if="infoDetail.planinspectionitem.length">
						巡检项目 
						<blok v-for="(item,index) of infoDetail.planinspectionitem"></blok>
						<view class="li">1.三楼东南角卫生间检查</view>
						<view class="li">2.三楼西南角储物间检查消防安全水管插座水质来源安全问题检查</view>
						<view class="li">3.二楼背面安全通道隐患排除</view>
						<view class="li">4.三楼西北角栅栏放下</view>
						<view class="li">5.消防设施设备期限检查</view>
						<view class="li">6.地面平整度安全检查</view>
					</view>
					<view class="content-list" v-if="!infoDetail.planinspectionitem.length">无巡检项目</view>
				</view> -->
				</view>
				<view class="module reply fadeIn500" v-if="infoDetail.planinspectionquestion.length">
					<view class="head" v-if="infoDetail.planinspectionquestion.length">
						<view class="title">巡检问题</view>
						<view class="number" v-if="infoDetail.planinspectionquestion.length">共{{infoDetail.planinspectionquestion.length}}条</view>
					</view>
					<view class="question-block" v-if="!item.planinspectionquestion.length">
						<view class="question-view">
							<view class="question-list">
								<view class="question-item item-none" v-for="(item,index) of infoDetail.planinspectionquestion" :key="index"
								 @tap.stop="lookReplay(item)">
									<view class="li li-top">
										<!-- <view :class="['question-status',item.status == 1?'solve':'']"></view> -->
										<view class="question-status" v-if="item.status == 0"></view>
										<view class="sender">{{item.deptname}} - {{item.username}}</view>
										<view class="send-timer">{{item.insertdate1}}</view>
									</view>
									<view class="li">
										<view class="left">问题描述</view>
										<view class="content"><text>{{item.question}}</text></view>
									</view>
									<view class="li" v-if="item.mapplaninspectiondept.length">
										<view class="left">整改部门</view>
										<view class="content">
											<text>
												<block>{{item.mapplaninspectiondept[0].deptname}}</block>
												<block v-for="(ite,ind) of item.mapplaninspectiondept" :key="ind" v-if="ind != 0">{{'、' + ite.deptname}}</block>
											</text>
										</view>
									</view>
									<!-- <view class="li" v-if="item.mapplaninspectionuser.length">
										<view class="left">整改人员</view>
										<view class="content">
											<text>
												<block>{{item.mapplaninspectionuser[0].username}}</block>
												<block v-for="(ite,ind) of item.mapplaninspectionuser" :key="ind" v-if="ind != 0">{{'、' + ite.username}}</block>
											</text>
										</view>
									</view> -->
									<div v-if="item.shopAds == !null" class="commodity_introduce">{{item.shopAds}}</div>
									<div v-if="item.shopAds == null" class="commodity_introduce">{{item.shop_add}}</div>
									<view :class="['li',item.status == 0?'place':'']" v-if="item.inspectionplace">
										<view class="left">位置</view>
										<view class="content">{{item.inspectionplace}}</view>
									</view>
									<view class="li" v-if="item.status == 100">
										<view class="left">复核人</view>
										<view class="content">{{item.confirmuserid}}</view>
									</view>
									<view :class="['li',item.status == 100?'place':'']" v-if="item.status == 100">
										<view class="left">复核时间</view>
										<view class="content">{{item.confirmdate}}</view>
									</view>
									<!-- {{item.showFeedbackUser}} - {{item.showFeedbackDept}} - {{item.showRightIs}} -->
									<view class="li li-imgs" v-if="item.planinspectionquestionimg.length">
										<view class="img-view" v-for="(itm,ind) of item.planinspectionquestionimg" :key="index" @tap.stop="seePicture(item.planinspectionquestionimg,ind)">
											<image class="img" :src="itm.imgurl + '?x-oss-process=image/resize,m_mfit,h_120,w_120'" mode=""></image>
										</view>
									</view>
									<view class="reply-view">
										<view class="number" v-if="item.planinspectionfeedback.length">{{item.planinspectionfeedback.length}}条</view>
										<view class="number" v-if="!item.planinspectionfeedback.length && item.status == 0">暂未整改</view>
										<!-- 复核 -->
										<block v-if="item.planinspectionsolveuser.length">
											<view :class="['reply-button confirm', item.status == 1 && (infoDetail.usernumber == usernumber || item.showRightIs)?'right':'']"
											 @click.stop="confirmQuestion(item)" v-if="item.status == 1 && (infoDetail.usernumber == usernumber || item.showRightIs)">复核</view>
										</block>
										<block v-if="!item.planinspectionsolveuser.length">
											<view :class="['reply-button confirm', item.status == 1 && (infoDetail.usernumber == usernumber)?'right':'']"
											 @click.stop="confirmQuestion(item)" v-if="item.status == 1 && (infoDetail.usernumber == usernumber)">复核</view>
										</block>
										<!-- 整改、查看 -->
										<block v-if="item.mapplaninspectionuser.length">
											<view :class="['reply-button', (item.status == 0 || item.status == 1) && (infoDetail.usernumber == usernumber || item.showRightIs)?'left':'']"
											 v-if="(item.status == 0 || item.status == 1) && (item.showFeedbackUser)">整改</view>
											<view :class="['reply-button', item.status == 0 && (infoDetail.usernumber == usernumber || item.showRightIs)?'left':'']"
											 v-if="item.status == 0 && (!item.showFeedbackUser)">查看</view>
										</block>
										<block v-if="!item.mapplaninspectionuser.length">
											<view :class="['reply-button', (item.status == 0 || item.status == 1) && (infoDetail.usernumber == usernumber || item.showRightIs)?'left':'']"
											 v-if="(item.status == 0 || item.status == 1) && (item.showFeedbackDept)">整改</view>
											<view :class="['reply-button', item.status == 0 && (infoDetail.usernumber == usernumber || item.showRightIs)?'left':'']"
											 v-if="item.status == 0 && (!item.showFeedbackDept)">查看</view>
										</block>

										<!-- <view class="reply-button right">确认</view> -->

									</view>
									<view class="line"></view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<!-- off -->
				<!-- <view class="replay-null">

            </view> -->
				<view class="replay-null" v-if="!infoDetail.planinspectionquestion.length">
					<view class="none">
						<view class="txt">暂无巡检问题</view>
						<view class="line"></view>
					</view>
				</view>
				<view class="replay-null" v-if="infoDetail.planinspectionquestion.length">
					<view class="none">
						<view class="txt">没有更多内容</view>
						<view class="line"></view>
					</view>
				</view>
			</block>
		</haoheao-scroll>
		<block v-if="infoDetail.status && infoDetail.notStarted">
			<view class="replay-btn" @click="reply()">提出巡检问题</view>
		</block>
		<block v-if="!infoDetail.status">
			<view class="replay-btn backcolor2"></view>
		</block>
	</view>
</template>

<script>
	let app = getApp().$vm;
	import haoheaoScroll from '@/components/haoheao-scroll/haoheao-scroll.vue'
	import popup from '@/components/uni-popup/uni-popup.vue'
	let utils = require('@/util/utils.js');
	let request = utils.request;
	export default {
		components: {
			haoheaoScroll,
			popup
		},
		data() {
			return {
				infoDetail: [],
				usernumber: uni.getStorageSync("userinfo").usernumber,
				userid: uni.getStorageSync("userinfo").userid,
				deptList: [],
				// 查看图片
				seeImgList: [],
				// 回复
				reason: "",
				solve: "",
				imgList: [],
				// 归属列表
				underList: [],
				underListArr: [],
				// 已选中
				trueUnder: [],
				// 已选中的最后一个下标
				underLastIndex: '',
				// 正在选择
				nowUnder: [],
				// 已选中列表下标
				selectIdList: [],
				// 描述
				selectInputtxt: '',

				// 重复提交
				btnClickReply: true,
				// 当前巡检记录哪些人看过
				detailLookList: [],
				// 当前更多操作显示的窗口
				showMoreType: 1,

				// 操作权限判断
				postThereTrue: false,
				// 巡检单状态
				status: 0,
			}
		},
		methods: {
			// 当前登录人权限判断
			showRightIs(data, type) {
				if (!data) return false;
				let user = uni.getStorageSync('userinfo');
				for (let item of data) {
					if (type == 1) {
						if (item.deptid == user.deptid) {
							return true;
						}
					} else if (type == 2) {
						if (item.usernumber == user.usernumber) {
							return true;
						}
					} else if (type == 3) {
						if (item.itemno == user.usernumber) {
							return true;
						}
						if (item.itemno == user.deptno) {
							return true;
						}
					}
				}
			},
			// 复制内容
			copy: function(data) {
				app.copy(data)
			},
			// 获取巡检单详细信息
			getDetail: function(id, done) {
				let _this = this;
				request.getPlanDetail(id)
					.then(res => {
						let [err, data] = res;
						console.log("巡检单详细信息", err, res)
						if (err == null && data.data.success) {
							this.infoDetail = data.data.data.planinspectionset;
							// 时间过滤
							this.infoDetail.sdate1 = this.infoDetail.sdate.slice(0, 10).replace(/-/g, ".");
							this.infoDetail.edate1 = this.infoDetail.edate.slice(0, 10).replace(/-/g, ".");
							/* 2020/09/07
							 * 初始判断巡检是否开始
							 * 计划巡检必须手动结束后，状态变为2000，才可以判断结束,此时状态显示执行中并且可以提出巡检问题
							 * 结束后状态显示已结束，不可提出问题
							 */
							// console.log()
							if (this.moment(new Date(this.infoDetail.sdate)).date.getTime() > this.moment(new Date()).date.getTime()) {
								this.infoDetail.notStarted = false
							} else {
								this.infoDetail.notStarted = true
							}

							// 部门人员过滤
							this.infoDetail.itemdeptlist = [];
							this.infoDetail.itempersonlist = [];
							for (let itm of this.infoDetail.planinspectionappenduser) {
								if (itm.appendtype == 1) {
									this.infoDetail.itemdeptlist.push(itm.itemname);
								} else if (itm.appendtype == 2) {
									this.infoDetail.itempersonlist.push(itm.itemname);
								}
							}

							// 问题列表项目人员过滤

							// 回复内容时间过滤
							utils.timerDateString(this.infoDetail.planinspectionquestion, this);
							var str = this.infoDetail.content.replace(/<.*?>/ig, "");
							this.infoDetail.content = str;

							for (let item of this.infoDetail.planinspectionquestion) {
								console.log(item)
								// 整改部门反馈
								item.showFeedbackDept = this.showRightIs(item.mapplaninspectiondept, 1)
								// 整改人员反馈
								item.showFeedbackUser = this.showRightIs(item.mapplaninspectionuser, 2)
								// 确认核验权限
								item.showRightIs = this.showRightIs(item.planinspectionsolveuser, 3);
							}
							console.log("巡检单详细信息2", this.infoDetail)
							// 回复内容过滤
							if (done) done();
						} else {
							uni.showToast({
								icon: "none",
								duration: 2500,
								title: "查找失败:" + err.errMsg
							})
						}
					})
			},
			// 进入反馈
			lookReplay: function(item) {
				// uni.navigateTo({
				//     url: '../viewQuestion/viewQuestion?data=' + JSON.stringify(item) + '&id=' + item.inspectionlogid +
				//         '&reply_id=' + item.questionid + '&postThereTrue=' + this.postThereTrue + '&replyIs=true'
				// })
				console.log('进入反馈', item);
				if (item.status == 0) {
					// 进入并回复
					uni.navigateTo({
						url: '../viewQuestion/viewQuestion?data=' + JSON.stringify(item) + '&id=' + item.planid + '&reply_id=' + item.planquestionid +
							'&postThereTrue=' + this.postThereTrue + '&previs=false' + '&replyIs=true'
					})
				} else if (item.status == 1) {
					if (item.planinspectionfeedback.length) {
						// 进入查看不能回复
						uni.navigateTo({
							url: '../viewQuestion/viewQuestion?data=' + JSON.stringify(item) + '&id=' + item.planid + '&reply_id=' + item
								.planquestionid +
								'&postThereTrue=' + this.postThereTrue + '&previs=false' + '&replyIs=false'
						})
					} else {
						uni.showToast({
							icon: "none",
							title: "此问题已解决,无反馈信息",
							duration: 2000
						})
						return;
					}
				}
			},

			onPullDown(done) { // 下拉刷新
				this.getDetail(this.detail_id, done);
				console.log("下拉刷新")
				// done();
			},
			reply: function() {
				console.log(this.option)
				console.log(this.infoDetail)
				let itemIs = this.infoDetail.planinspectionitem.length ? this.infoDetail.planinspectionitem : false;
				console.log(itemIs)
				uni.navigateTo({
					url: "../addQuestion/addQuestion?id=" + this.option.id + "&itemIs=" + itemIs
				})
			},
			// 查看图片
			seePicture: function(list, index) {
				utils.seePicture(list, index);
			},
			confirmQuestion(item) {
				uni.showModal({
					title: "确认该问题已解决？",
					success: (res) => {
						if (res.confirm) {
							request.confirmPlanQuestion({
									usernumber: this.usernumber,
									planquestionid: item.planquestionid
								})
								.then(data => {
									let [err, res] = data;
									console.log("确认巡检返回:", err, res)
									this.getDetail(this.detail_id);
									if (!err == null) {
										uni.showToast({
											icon: "none",
											title: err.errmsg
										});

										return;
									}
									if (res.data.success) {
										uni.showToast({
											icon: "none",
											title: '问题已确认解决！'
										});

									} else {
										uni.showToast({
											icon: "none",
											title: res.data.errmsg
										});

									}
								})
						}
					}
				})
			}
		},
		onLoad(option) {
			console.log("巡检详细onLoad option:", option)
			this.option = option;
			this.detail_id = option.id;
		},
		onShow: function() {
			console.log("seeDetail onShow");
			this.getDetail(this.detail_id);
		}
	}
</script>

<style scoped lang="scss">
	.container {
		background: #E5EDF1;
		min-height: 100vh;
		padding-bottom: 20rpx;
		padding-bottom: env(safe-area-inset-bottom);

		.haoheao-scroll {
			height: 100vh;
		}

		.module {
			background: #fff;
			width: calc(100% - 40rpx);
			margin: 20rpx;
			margin-top: 0;
			border-radius: 10rpx;
			padding: 0rpx 20rpx;
			box-sizing: border-box;
		}

		// 信息
		.module.info {
			padding-top: 30rpx;
			margin-top: 20rpx;
			padding-bottom: 20rpx;

			.top-view {
				margin: 20rpx 10rpx;
				margin-left: 0;
				margin-top: 0;
				display: flex;
				just-content: flex-start;
				align-items: center;

				.state {
					min-width: 120rpx;
					height: 44rpx;
					text-align: center;
					background: #D56C68;
					border-radius: 24rpx;
					font-size: 24rpx;
					line-height: 44rpx;
					color: #fff;
				}

				.state.resolved {
					background: #7ED58C;
				}

				.state.not-started {
					background: #d2d2d2;
				}

				.center {
					flex: 2;
				}
			}

			.title {
				font-size: 34rpx;
				color: #323436;
				font-weight: 800;
				line-height: 48rpx;
			}

			.line {
				height: 1rpx;
				background: #EDEEEF;
				width: 100%;
				margin: 30rpx 0rpx;
				margin-bottom: 20rpx;
			}

			.detail-item {
				width: 100%;
				padding: 10rpx 0rpx;
				display: flex;
				font-size: 26rpx;

				.item {
					color: #C2C4C6;
					width: 125rpx;
					min-width: 125rpx;
				}

				.content {
					color: #323436;
					width: 100%;
					// overflow: hidden;
					// text-overflow: ellipsis;
					// white-space: nowrap;
				}
			}

			.detail-item.describe {
				&:active {
					background: #f9f9f9;
					border-radius: 5rpx;
				}
			}

			.detail-item.inp-item {
				.content-list {
					.li {
						padding: 2rpx 0rpx;
					}
				}
			}

			.detail-item:first-child {
				padding-top: 30rpx;
			}
		}

		// 回复
		.module.reply {
			background: #fff;
			width: calc(100% - 40rpx);
			margin: 20rpx;
			margin-top: 0;
			margin-bottom: 50rpx;
			border-radius: 10rpx;
			padding: 0rpx 0rpx;
			padding-bottom: 20rpx;

			.head {
				display: flex;
				padding: 30rpx 20rpx;
				border-bottom: 1rpx solid #EDEEEF;

				.title {
					color: #647484;
					font-size: 28rpx;
					flex: 2;
					font-weight: 800;
				}

				.number {
					color: #B6C6D6;
					font-size: 24rpx;
				}
			}

			.content {
				.item {
					margin-bottom: 50rpx;
					border-bottom: 2rpx solid #EDEEEF;

					&:active {
						opacity: 0.9;
					}

					.top {
						margin: 20rpx 0rpx;
						display: flex;

						.person {
							font-size: 24rpx;
							color: #647484;
							flex: 1;
						}

						.date {
							font-size: 20rpx;
							color: #B6C6D6;
						}
					}

					.question {
						margin-bottom: 20rpx;

						.title {
							font-size: 24rpx;
							color: #A4B1BE;
							font-weight: 800;
						}

						.txt {
							color: #647484;
							font-size: 24rpx;
						}
					}

					// 回复图片
					.picture-list {
						padding-top: 5rpx;
						display: flex;
						flex-wrap: wrap;

						.item {
							width: 120rpx;
							height: 120rpx;
							overflow: hidden;
							border-radius: 6rpx;
							margin-right: 15rpx;
							margin-bottom: 15rpx;

							.img {
								width: 100%;
								height: 100%;
							}
						}
					}
				}

				.item:last-child {
					margin-bottom: 0;
					border: 0;
				}
			}

			.question-block {
				border-bottom: 1rpx solid #EDEEEF;
			}

			.question-block:last-child {
				border: 0;
			}

			.question-view {
				.question-text {
					display: flex;
					justify-content: flex-start;
					align-items: center;
					padding: 20rpx 20rpx;
					font-weight: 700;

					&:active {
						background: #f2f2f2;
						animation: fadeIn 300ms;
					}

					.txt {
						flex: 2;
					}

					.icon {
						width: 24rpx;
						height: 24rpx;
					}
				}

				// 问题列表
				.question-list {
					.question-item {
						padding: 0rpx 40rpx;
						padding-top: 20rpx;
						font-size: 26rpx;


						.li {
							display: flex;
							justify-content: flex-start;
							padding-bottom: 8rpx;

							.question-status {
								width: 22rpx;
								height: 22rpx;
								border-radius: 30rpx;
								background: #D56C68;
								margin-right: 15rpx;
							}

							.question-status.solve {
								background: #7ED58C;
							}

							.left {
								color: #A4B1BE;
								min-width: 125rpx;
							}

							.content {
								color: #647484;
								white-space: pre-wrap;
								word-break: break-word;
								flex: 2;
							}

							.sender {
								color: #647484;
							}

							.send-timer {
								font-size: 26rpx;
								width: 140rpx;
								color: #B6C6D6;
								flex: 2;
								text-align: right;
							}
						}

						.li-top {
							align-items: center;
						}

						.li.place {
							padding-bottom: 20rpx;
						}

						.li-imgs {
							width: 100%;
							display: flex;
							justify-content: flex-start;
							flex-wrap: wrap;
							// margin-top: 20rpx;


							.img-view {
								width: 118rpx;
								height: 118rpx;
								margin-bottom: 15rpx;
								margin-right: 15rpx;
								display: flex;
								border: 1rpx solid transparent;
								justify-content: center;
								align-items: center;
								padding: 0;
								flex-wrap: wrap;
								text-align: center;

								.img {
									width: 100%;
									height: 100%;
									border-radius: 6rpx;
								}
							}
						}

						// 回复
						.reply-view {
							display: flex;
							align-items: center;
							// border-bottom: 1rpx solid #EDEEEF;

							.number {
								color: #1BA1F3;
								font-size: 22rpx;
								flex: 2;
								padding: 20rpx 0rpx;
								padding-top: 0;
							}

							.reply-button {
								width: 130rpx;
								height: 48rpx;
								line-height: 48rpx;
								text-align: center;
								color: #1BA1F3;
								border: 1rpx solid #1BA1F3;
								font-size: 22rpx;
								border-radius: 24rpx;
								margin: 20rpx 0rpx;
								margin-top: 0;

								&:active {
									background: #1BA1F3;
									color: #fff;
								}
							}

							.reply-button.left {
								border-top-left-radius: 0;
								border-bottom-left-radius: 0;
							}

							.reply-button.right {
								border-top-right-radius: 0;
								border-bottom-right-radius: 0;
							}

							.reply-button.confirm {
								border-right: 0;
							}

							// .reply-text.del-raply {
							// 	border: 0;
							// 	width: auto;
							// 	height: 20rpx;
							// 	line-height: 20rpx;
							// 	padding: 8rpx 20rpx;
							// 	border-radius: 6rpx;
							// 	margin-right: 20rpx;

							// 	&:active {
							// 		background: #f2f2f2;
							// 		color: #333;
							// 	}
							// }
						}

						&:active {
							background: #f6f6f6;

							.reply-button {
								background: #1BA1F3;
								color: #fff;
								border: 1rpx solid #fff;
							}

							.reply-text.del-raply {
								background: #f2f2f2;
								color: #333;
							}
						}

						.line {
							width: 100%;
							height: 2rpx;
							background: #EDEEEF;
						}
					}

					.question-item:last-child {
						.reply-view {
							border: 0;
						}
					}

					.question-item:last-child {
						.line {
							display: none;
						}
					}

					.question-item.item-none {
						padding: 0rpx 20rpx;
						padding-top: 20rpx;
					}
				}
			}
		}


		.container.data-null {
			.detail-item {
				.content {
					background: #f2f2f2;
					border-radius: 10rpx;
				}
			}
		}
	}
</style>
<style lang="scss">
	.skeleton.mode {
		background: #f2f2f2;
	}

	.backcolor {
		background: #e9e9e9;
	}

	.backcolor2 {
		background: #e1e1e1;
	}

	.skeleton {
		border-radius: 10rpx;
		margin: 20rpx;
		padding: 20rpx;
		width: calc(100vw - 80rpx);

		.shadow-state {
			border-radius: 40rpx;
			width: 125rpx;
			height: 44rpx;
		}

		.shadow-title {
			width: 100%;
			height: 55rpx;
			margin: 20rpx 0rpx;
			border-radius: 10rpx;
		}

		.shadow-border {
			height: 1rpx;
			margin-top: 20rpx;
		}

		.shadow-line {
			margin-top: 20rpx;
			display: flex;
			align-items: center;

			.shadow-row {
				height: 44rpx;
			}

			.shadow-row.left {
				width: 120rpx;
				margin-right: 30rpx;
			}

			.shadow-row.right {
				flex: 2;
			}
		}
	}

	.skeleton-btn {}
</style>
