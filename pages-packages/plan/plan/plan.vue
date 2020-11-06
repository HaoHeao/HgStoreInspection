<template>
	<view class="container">
		<scroll-view class="scroll-view" scroll-y refresher-enabled scroll-with-animation :enable-back-to-top="setting.enableBackToTop"
		 :refresher-triggered="getDataRefresherLoading" @refresherrefresh="onRefresh" @refresherrestore="onRestore">
			<skeleton v-if="!inspectionDetail"></skeleton>
			<block v-if="inspectionDetail">
				<view class="top-placeholder"></view>
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
							<view :class="['item',questionStatus == '-1'?'active':'']" @click="getInspectionDetail('-1')">
								<view class="btn">全部</view>
							</view>
							<view :class="['item',questionStatus == '0'?'active':'']" @click="getInspectionDetail('0')">
								<view class="btn">待整改</view>
							</view>
							<view :class="['item',questionStatus == '1'?'active':'']" @click="getInspectionDetail('1')">
								<view class="btn">待复核</view>
							</view>
							<view :class="['item',questionStatus == '100'?'active':'']" @click="getInspectionDetail('100')">
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
									<view class="img-view" v-for="(itm,ind) of item.planinspectionquestionimg" :key="ind" @tap.stop="previewImage(item.planinspectionquestionimg,ind)">
										<image class="icon" :src="itm.imgurl + setting.OSSDownload" mode="widthFix"></image>
									</view>
								</view>
								<view class="reply-view">
									<view class="number">{{item.status == 0?'暂未整改':`${item.planinspectionfeedback.length}条`}}</view>
									<view class="reply-button" @tap.stop="review(item)" v-if="item.review">复核</view>
									<view class="reply-button" v-if="item.feedback">整改</view>
									<view class="reply-button" v-if="item.viewBtn">查看</view>
								</view>
								<view class="line"></view>
							</view>
						</view>
					</view>
				</view>
				<u-loadmore status="nomore" :icon-type="setting.iconType" :load-text="setting.loadText" :is-dot="setting.isDot"
				 :font-size="setting.loadmoreFontSize" :margin-top="setting.loadmoreMarginTop" :margin-bottom="setting.loadmoreMarginBottom" />
			</block>
		</scroll-view>
		<view class="replay-btn" @click="submitQuestions()" v-if="inspectionDetail && inspectionDetail.submitQuestion">提出巡检问题</view>
		<uni-popup ref="review" type="bottom">
			<view class="popup top">
				<view class="title">
					<text class="content">复核问题</text>
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
	import skeleton from './skeleton.vue'
	export default {
		components:{
			skeleton
		},
		data() {
			return {
				// 计划巡检planid
				planid:'',
				getDataRefresherLoading:false,
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
			setting() {
				return this.$store.state.setting
			},
			userinfo(){
				return this.utils.getUserInfo(uni)
			}
		},
		methods: {
			// 触发下拉刷新
			async onRefresh() {
				this.getDataRefresherLoading = true
				await this.getInspectionDetail('-1');
				this.getDataRefresherLoading = false
			},
			// 刷新完成/重置
			onRestore() {
				this.getDataRefresherLoading = false
			},
			// 点击复核
			review(item){
				this.$refs['review'].open()
				this.remark = ''
				this.focusReviewId = item.planquestionid
			},
			// 查看图片
			previewImage(list,index){
				uni.previewImage({
					current: index,
					urls: list.filter(item=> item.imgurl).map(item=> item.imgurl)
				});
			},
			// 巡检复核
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
			// 是否可以回复整改
			replyFilter() {	
				let _this = this;
				for (let item of _this.inspectionDetail.planinspectionquestion) {
					let feedback = (function(){
						// 整改部门
						for(let dept of item.mapplaninspectiondept){
							if (_this.userinfo.deptlist.filter(userdept => userdept.deptid == dept.deptid).length) return true;
						}
						// 整改人员
						for(let user of item.mapplaninspectionuser){
							if (user.usernumber == _this.userinfo.usernumber) return true;
						}
					}())
					// 巡检问题状态
					item.feedback = (feedback && item.status == 0)?true:false
				}
			},
			// 是否可以复核
			reviewFilter() {
				let _this = this;
				for (let item of _this.inspectionDetail.planinspectionquestion) {
					let review = (function(){
						// 当前问题是否为登录人
						if (item.usernumber == _this.userinfo.usernumber) return true;
						// 巡检是否为登录人
						if (_this.inspectionDetail.usernumber == _this.userinfo.usernumber) return true;
						// 复核部门或人员
						for(let deptuser of item.planinspectionsolveuser){
							// 登录人部门权限列表是否包含复核部门
							if (_this.userinfo.deptlist.filter(dept => dept.deptno == deptuser.itemno).length) return true
							// 复核人列表里是否有登录人
							if (deptuser.itemno == _this.userinfo.usernumber) return true;
						}
					}())
					// 巡检复核状态
					item.review = (review && item.status == 1)?true:false
				}
			},
			// 是否显示查看按钮
			viewBtnFilter(){
				let _this = this;
				for (let item of _this.inspectionDetail.planinspectionquestion) {
					let viewBtn = (function(){
						// 没有整改或复核权限
						if (!item.feedback && !item.review) return true;
						// 此巡检问题是否已结束status=100
						if (item.status == 100) return true;
					}())
					// 巡检查看按钮状态
					item.viewBtn = viewBtn?true:false
				}
			},
			// 是否可以提出巡检问题
			setQuestionFilter() {
				this.inspectionDetail.submitQuestion = this.inspectionDetail.inspectionStatus == 1?true:false
			},
			// 计划巡检获取某一条巡检记录明细
			async getInspectionDetail(status){
				this.questionStatus = status
				try {
					uni.showNavigationBarLoading()
					let data = await uni.request({
						method: 'GET',
						url: this.api.plan_getPlaninspectionDetail,
						data:{
							planid:this.planid,
							status
						}
					})
					uni.hideNavigationBarLoading()
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
						this.inspectionDetail = success.data.data.planinspectionset
						this.replyFilter()
						this.reviewFilter()
						this.viewBtnFilter()
						this.setQuestionFilter()
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
					uni.hideNavigationBarLoading()
				}
			},
			// 进入反馈
			lookReplay(item) {
				uni.navigateTo({
					url: `../question/question?planid=${item.planid}&planquestionid=${item.planquestionid}`
				})
			},
			// 提出巡检问题
			submitQuestions() {
				uni.navigateTo({
					url: `../submitQuestions/submitQuestions?planid=${this.inspectionDetail.planid}`
				})
			},
		},
		onLoad(option) {
			this.planid = option.planid;
			this.getInspectionDetail(this.questionStatus);
		},
		onShow: function() {
		}
	}
</script>

<style scoped lang="scss">
	page{
		background: #E5EDF1;
	}
	.container {
		background: #E5EDF1;
		height: 100vh;
		padding-bottom: env(safe-area-inset-bottom);

		.scroll-view {
			height: 100vh;
		
			// 顶部20rpx间隔
			.top-placeholder{
				height: 20rpx;
			}
			.module {
				background: #fff;
				width: calc(100% - 40rpx);
				margin:0 20rpx;
				margin-bottom: 20rpx;
				border-radius: 10rpx;
				padding: 0rpx 20rpx;
				box-sizing: border-box;
				
				// 信息
				&.info {
					padding: 20rpx;

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
				&.reply {
					margin:0 20rpx;
					padding: 0rpx 0rpx;

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
										overflow: hidden;

										.icon {
											width: 100%;
											min-height: 100%;
											border-radius: 6rpx;
											background: #f2f2f2;
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
			}
		}
	
		.popup {
			padding: 30rpx;
			padding-bottom: 0;
			.textarea-view{
				padding: 20rpx;
				background: #F3F5F7;
				box-sizing: border-box;
				border-radius: 10rpx;
				overflow: hidden;
				.remark{
					min-height: 200rpx;
					font-size: 28rpx;
					width: 100%;
				}
			}
			>.bottom-control {
				padding: 20rpx 20rpx;
				padding-right: 0;
				background: #fff;

				.item {
					line-height: 60rpx;
				}
			}
		}
	
		// 对此计划提出问题
		.replay-btn {
			width: calc(100% - 40rpx);
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			margin: 0rpx 20rpx;
			border-radius: 40rpx;
			color: #fff;
			background: #647484;
			font-size: 28rpx;
			position: fixed;
			left: 0;
			bottom: 20rpx;
			z-index: 1;
			margin-bottom: env(safe-area-inset-bottom);
			// letter-spacing: 10rpx;

			&:active {
				opacity: 0.8;
			}
		}
	}
</style>
