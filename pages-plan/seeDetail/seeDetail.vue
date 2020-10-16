<template>
	<view class="container">
		<haoheao-scroll class="haoheao-scroll" ref="scroll" @onPullDown="onPullDown">
			<block v-if="!inspectionDetail">
				<view class="skeleton mode fadeIn">
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
			<block v-if="inspectionDetail">
				<view class="module info fadeIn">
					<view class="top-view">
						<view :class="['state',inspectionDetail.inspectionStatus == 0?'not-started':inspectionDetail.inspectionStatus == 2?'resolved':'']">
							{{inspectionDetail.inspectionStatus == 0?'未开始'
							:inspectionDetail.inspectionStatus == 1?'执行中'
							:inspectionDetail.inspectionStatus == 2?'已完成'
							:inspectionDetail.inspectionStatus == 3?'此巡检计划已删除':''}}
						</view>
					</view>
					<view class="title">{{inspectionDetail.title}}</view>
					<view class="line"></view>
					<view class="detail-item">
						<view class="item">上传人</view>
						<view class="content">
							<block>{{inspectionDetail.deptname + ' - ' + inspectionDetail.username}}</block>
						</view>
					</view>
					<view class="detail-item">
						<view class="item">巡查日期</view>
						<view class="content">{{moment(inspectionDetail.sdate.replace(/-/g, "/")).format('YYYY.MM.DD') + ' - ' + moment(inspectionDetail.edate.replace(/-/g, "/")).format('YYYY.MM.DD')}}</view>
					</view>
					<view class="detail-item">
						<view class="item">参与部门</view>
						<view class="content">
							<block v-if="inspectionDetail.planinspectionappenduser.filter(i=> i.appendtype == 1).length">
								<block v-for="(item,index) of inspectionDetail.planinspectionappenduser.filter(i=> i.appendtype == 1)" :key="index">
									{{index == 0?inspectionDetail.planinspectionappenduser[0].itemname:'、' + item.itemname}}
								</block>
							</block>
							<block v-else>未指定部门</block>
						</view>
					</view>
					<view class="detail-item">
						<view class="item">参与人员</view>
						<view class="content">
							<block v-if="inspectionDetail.planinspectionappenduser.filter(i=> i.appendtype == 2).length">
								<block v-for="(item,index) of inspectionDetail.planinspectionappenduser.filter(i=> i.appendtype == 2)" :key="index">
									{{index == 0?inspectionDetail.planinspectionappenduser[0].itemname:'、' + item.itemname}}
								</block>
							</block>
							<block v-else>未指定人员</block>
						</view>
					</view>
					<view class="detail-item">
						<view class="item">检查重点</view>
						<rich-text :nodes="inspectionDetail.content?inspectionDetail.content:'无描述'" class="content"></rich-text>
					</view>
				</view>
				<view class="module reply">
					<view class="head">
						<view class="title">巡检问题</view>
						<view class="number">共{{inspectionDetail.planinspectionquestion.length}}条</view>
					</view>
					<view class="question-view">
						<view class="feedback-tabs">
							<view :class="['item fadeIn',questionStatus == '-1'?'active':'']" @click="getInspectionDetail('-1')">
								<view class="btn">全部</view>
							</view>
							<view :class="['item fadeIn',questionStatus == '0'?'active':'']" @click="getInspectionDetail('0')">
								<view class="btn">待整改</view>
							</view>
							<view :class="['item fadeIn',questionStatus == '1'?'active':'']" @click="getInspectionDetail('1')">
								<view class="btn">待复核</view>
							</view>
							<view :class="['item fadeIn',questionStatus == '100'?'active':'']" @click="getInspectionDetail('100')">
								<view class="btn">已解决</view>
							</view>
						</view>
						<view class="question-list" v-if="inspectionDetail.planinspectionquestion.length">
							<view class="question-item item-none" v-for="(item,index) of inspectionDetail.planinspectionquestion" :key="index"
							 @tap.stop="lookReplay(item)">
								<view class="li li-top">
									<view class="question-status" v-if="item.status == 0"></view>
									<view class="sender">{{item.deptname + ' - ' + item.username}}</view>
									<view class="send-timer">{{moment(item.insertdate.replace(/-/g, "/")).format("MM-DD hh:mm:ss")}}</view>
								</view>
								<view class="li">
									<view class="left">问题描述</view>
									<view class="content"><text>{{item.question}}</text></view>
								</view>
								<view class="li" v-if="item.mapplaninspectiondept.length">
									<view class="left">整改部门</view>
									<view class="content">
										<block v-for="(ite,ind) of item.mapplaninspectiondept" :key="ind">{{ind == 0?item.mapplaninspectiondept[0].deptname:'、' + ite.deptname}}</block>
									</view>
								</view>
								<view class="li" v-if="item.mapplaninspectionuser.length">
									<view class="left">整改人员</view>
									<view class="content">
										<block v-for="(ite,ind) of item.mapplaninspectionuser" :key="ind">{{ind == 0?item.mapplaninspectionuser[0].username:'、' + ite.username}}</block>
									</view>
								</view>
								<view class="li">
									<view class="left">位置</view>
									<view class="content">{{item.inspectionplace?item.inspectionplace:'未填写位置'}}</view>
								</view>
								<view class="li">
									<view class="left">楼层</view>
									<view class="content">{{item.other1?item.other1:'未选择'}}</view>
								</view>
								<view class="li" v-if="item.status == 100">
									<view class="left">复核人</view>
									<view class="content">{{item.confirmuserid}}</view>
								</view>
								<view class="li" v-if="item.status == 100">
									<view class="left">复核时间</view>
									<view class="content">{{item.confirmdate}}</view>
								</view>
								<view class="li li-imgs" v-if="item.planinspectionquestionimg.length">
									<view class="img-view" v-for="(itm,ind) of item.planinspectionquestionimg" :key="ind" @tap.stop="seePicture(item.planinspectionquestionimg,ind)">
										<image class="img" :src="itm.imgurl + '?x-oss-process=image/resize,m_mfit,h_120,w_120'" mode=""></image>
									</view>
								</view>
								<view class="reply-view">
									<view class="number">{{item.status == 0?'暂未整改':`${item.planinspectionfeedback.length}条`}}</view>
									<!-- 复核 -->
									<view class="reply-button" @tap.stop="review(item)" v-if="item.status == 1 && (item.showRightIs || item.usernumber == userinfo.usernumber)">复核</view>
									<!-- 整改、查看 -->
									<view class="reply-button" v-if="item.status == 0 && (item.showFeedbackUser || item.showFeedbackDept)">整改</view>
									<view class="reply-button" v-if="(item.status == 0 && !item.showFeedbackUser && !item.showFeedbackDept) || (item.status == 1 && !item.showRightIs && item.usernumber != userinfo.usernumber) || item.status == 100">查看</view>
								</view>
								<view class="line"></view>
							</view>
						</view>
					</view>
				</view>
				<view class="replay-null">
					<view class="none">
						<view class="txt">{{inspectionDetail.planinspectionquestion.length?'没有更多内容':'暂无巡检问题'}}</view>
						<view class="line"></view>
					</view>
				</view>
			</block>
		</haoheao-scroll>
		<block v-if="inspectionDetail">
			<view class="replay-btn" @click="reply()" v-if="inspectionDetail.inspectionStatus == 1">提出巡检问题</view>
		</block>
		<block v-else>
			<view class="replay-btn backcolor2"></view>
		</block>
		<uni-popup ref="review" type="bottom">
			<view class="popup">
				<view class="title"><text class="content">复核问题</text>
					<view class="close" @click="$refs['review'].close()">关闭</view>
				</view>
				<view class="textarea-view">
					<textarea class="remark" v-model="remark" placeholder-style="color:#B6C6D6" cursor-spacing="180" placeholder="不通过请填写原因"
					 fixed="true" auto-height />
					</view>
				<view class="bottom-control">
					<view class="content">
						<view class="item del" @click="confirmQuestion(false)">
							<image src="@/static/images/del_white.svg" mode="widthFix" class="icon"></image>不通过</view>
						<view class="item" @click="confirmQuestion(true)">
							<image src="@/static/images/del_white.svg" mode="widthFix" class="icon"></image>通过</view>
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
				// 巡检明细
				inspectionDetail:null,
				// 复核填写原因
				focusReviewId:'',
				remark:'',
				// 巡检问题
				questionStatus:'-1'
			}
		},
		computed:{
			userinfo(){
				return this.utils.getUserInfo(uni)
			}
		},
		methods: {
			async onPullDown(done) { // 下拉刷新
				await this.getInspectionDetail('-1');
				done();
			},
			// 点击复核
			review(item){
				this.$refs['review'].open()
				this.remark = ''
				this.focusReviewId = item.planquestionid
			},
			// 查看图片
			seePicture(list,index){
				this.utils.seePicture(list,index);
			},
			async confirmQuestion(type) {
				if(!type && !this.remark){
					uni.showToast({
						icon: "none",
						title: '复核不通过请填写原因'
					});
					return
				}
				try {
					uni.showNavigationBarLoading()
					let data = await uni.request({
						method: 'POST',
						url: this.api.plan_submitInspectionReview,
						data:{
							usernumber: this.userinfo.usernumber,
							planquestionid: this.focusReviewId,
							confirmtype: type?1:0,
							remark: type?'复核通过':this.remark
						}
					})
					uni.hideNavigationBarLoading()
					let [err, success] = data
					console.log('复核完成--->>>',err, success)
					if (!err && success.data.success) {
						this.getInspectionDetail(this.questionStatus);
						this.$refs['review'].close()
					}else{
						uni.showToast({
							title: err?err:success.data.errmsg,
							icon: 'none',
							duration:3000
						});
					}
				} catch (e) {
					console.log(e)
					uni.hideNavigationBarLoading()
				}
			},
			// 当前登录人权限判断
			showRightIs(data, type) {
				for (let item of data) {
					if (type == 1) {
						// 整改部门反馈
						if (this.userinfo.deptlist.filter(itm => itm.deptid == item.deptid).length) return true;
					} else if (type == 2) {
						// 整改人员反馈
						if (item.usernumber == this.userinfo.usernumber) return true;
					} else if (type == 3) {
						// 确认核验权限
						if (this.inspectionDetail && this.inspectionDetail.usernumber == this.userinfo.usernumber) return true;
						if (item.itemno == this.userinfo.usernumber) return true;
						if (this.userinfo.deptlist.filter(itm => itm.deptno == item.itemno).length) return true
					}
				}
			},
			// 是否可以回复整改
			rectifyFilter() {},
			// 是否可以复核
			reviewFilter() {},
			// 是否可以提出巡检问题
			setQuestionFilter() {
				// if(this.)
			},
			// 计划巡检获取某一条巡检记录明细
			async getInspectionDetail(status){
				this.questionStatus = status
				try {
					uni.showLoading({
						title: '加载中,请稍后...'
					});
					let data = await uni.request({
						method: 'GET',
						url: this.api.plan_getPlaninspectionDetail,
						data:{
							planid:this.option.id,
							status
						}
					})
					uni.hideLoading();
					let [err, success] = data
					console.log('计划巡检获取某一条巡检记录明细--->>>',err, success)
					if (!err && success.data.success) {
						// 计划巡检判断 0:未开始 1:执行中 2:已结束 3:已删除
						let dateStatus = new Date(success.data.data.planinspectionset.sdate.replace(/-/g, "/")).getTime() > new Date().getTime()
						if(success.data.data.planinspectionset.status == 1000 && dateStatus){
							success.data.data.planinspectionset.inspectionStatus = 0
						}else{
							success.data.data.planinspectionset.inspectionStatus = 1
						}
						if(success.data.data.planinspectionset.status == 2000){
							success.data.data.planinspectionset.inspectionStatus = 2
						}
						if(success.data.data.planinspectionset.status == 3000){
							success.data.data.planinspectionset.inspectionStatus = 3
						}
						// 计划巡检权限添加
						for (let item of success.data.data.planinspectionset.planinspectionquestion) {
							// 整改部门反馈
							item.showFeedbackDept = this.showRightIs(item.mapplaninspectiondept, 1)
							// 整改人员反馈
							item.showFeedbackUser = this.showRightIs(item.mapplaninspectionuser, 2)
							// 确认核验权限
							item.showRightIs = this.showRightIs(item.planinspectionsolveuser, 3);
							// 是否可以提出巡检问题
						}
						this.questionStatusList = success.data.data.planinspectionset.planinspectionquestion
						this.inspectionDetail = success.data.data.planinspectionset
						this.$forceUpdate()
					}else{
						uni.showToast({
							title: err?err:success.data.errmsg,
							icon: 'none',
							duration:3000
						});
					}
				} catch (e) {
					console.log(e)
					uni.hideLoading();
				}
			},
			// 进入反馈
			lookReplay(item) {
				console.log('进入反馈', item);
				if (item.status == 0) {
					// 进入并回复
					uni.navigateTo({
						url: '/pages-plan/viewQuestion/viewQuestion?data=' + JSON.stringify(item) + '&id=' + item.planid + '&reply_id=' + item.planquestionid 
					})
				} else if (item.status == 1 || item.status == 100) {
					// 进入查看不能回复
					uni.navigateTo({
						url: '/pages-plan/viewQuestion/viewQuestion?data=' + JSON.stringify(item) + '&id=' + item.planid + '&reply_id=' + item.planquestionid
					})
				}
			},
			// 提出巡检问题
			reply() {
				uni.navigateTo({
					url: "../addQuestion/addQuestion?id=" + this.option.id
				})
			},
		},
		onLoad(option) {
			this.option = option;
		},
		onShow: function() {
			this.getInspectionDetail(this.questionStatus);
		}
	}
</script>

<style scoped lang="scss">
	@import '@/styles/popup.scss';
	page{
		background: #E5EDF1;
	}
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
			padding-top: 20rpx;
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
					padding: 0 20rpx;
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
				margin: 20rpx 0rpx;
				margin-bottom: 10rpx;
			}

			.detail-item {
				width: 100%;
				padding: 10rpx 0rpx;
				display: flex;
				font-size: 26rpx;
				padding-bottom: 0;

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
			// padding-bottom: 20rpx;

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
				
				// 问题tab切换
				.feedback-tabs{
					// background: #e2e2e2;
					padding: 0rpx 20rpx;
					display: flex;
					align-items: center;
					border-bottom: 1rpx dashed #EDEEEF;
					.item{
						padding: 20rpx 0;
						margin-right: 20rpx;
						.btn{
							border-radius: 10rpx;
							font-size: 26rpx;
							color: #333;
							padding: 15rpx 30rpx;
						}
						&.active{
							.btn{
								background: #f2f2f2;
								font-weight: 800;
								color: #27A6F4;
							}
						}
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
								min-width: 4em;
								margin-right: 20rpx;
								text-align-last: justify;
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
			// &.no-data{
			// 	padding-bottom: 0;
			// 	.feedback-tabs{
			// 		border: 0;
			// 	}
			// }
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
	.popup {
		padding: 30rpx;
		padding-bottom: 0;
		.title{
			display: flex;
			.content{
				flex: 2;
			}
			.close{
				padding: 4rpx 15rpx;
				border-radius: 5rpx;
				&:active{
					color: #1BA1F3;
					background: #f2f2f2;
				}
			}
		}
		.remark{
			min-height: 200rpx;
			background: #F3F5F7;
			border-radius: 10rpx;
			padding: 20rpx;
			font-size: 24rpx;
			width: 100%;
			box-sizing: border-box;
		}
		.bottom-control {
			z-index: 999;
			padding: 20rpx 20rpx;
			padding-right: 0;
			background: #fff;

			.item {
				line-height: 60rpx;
			}
		}

		.filter {
			display: flex;
			align-items: center;
			padding: 20rpx;
			position: sticky;
			top: 0;
			z-index: 999;
			background: #fff;
			border-radius: 20rpx;

			.item {
				line-height: 40rpx;
				padding: 8rpx 20rpx;
				border-bottom: 5rpx solid transparent;

				&.active {
					color: #333;
					font-weight: 800;
					font-size: 26rpx;
					border-bottom: 5rpx solid #ff0036;
				}

				&.date {
					flex: 2;
					text-align: right;
				}
			}
		}

		.person-txt {
			color: #333;
			font-size: 28rpx;
			border-bottom: 1rpx solid #f2f2f2;
			font-weight: 800;
			padding: 20rpx 0;
			margin: 0 20rpx;
		}

		.person-list {
			margin: 20rpx;

			.item {
				display: flex;
				align-items: center;
				font-size: 24rpx;
				margin-bottom: 15rpx;
				flex-wrap: wrap;

				.icon {
					width: 34rpx;
					height: 34rpx;
					margin-right: 10rpx;
				}

				.userinfo {
					color: #647484;
				}

				.date {
					flex: 2;
					text-align: right;
					color: #A4B1BE;
				}
				.remark{
					margin-left: 20rpx;
					margin-top: 20rpx;
					height: auto;
					min-height: auto;
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
