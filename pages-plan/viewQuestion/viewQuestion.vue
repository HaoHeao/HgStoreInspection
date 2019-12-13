<template>
	<view class="container">
		<haoheao-scroll class="haoheao-scroll" ref="scroll" @onPullDown="onPullDown">
			<view class="question msg" @click="navigitorShowDeail(detailInfo)" v-if="option.room == 'msg'">
				<view class="msg-title">{{detailInfo.title}}</view>
				<view class="msg-list">
					<view class="left">发起部门</view>
					<view class="content">{{detailInfo.deptname?detailInfo.deptname:''}} -
						{{detailInfo.username?detailInfo.username:''}}</view>
				</view>
				<view class="msg-list">
					<view class="left">巡查日期</view>
					<view class="content">{{detailInfo.sdate1?detailInfo.sdate1:''}} - {{detailInfo.edate1?detailInfo.edate1:''}}</view>
				</view>
				<view class="msg-list">
					<view class="left">检查重点</view>
					<view class="content">{{detailInfo.content}}</view>
				</view>
				<view class="msg-list">
					<view class="left">巡检级别</view>
					<view class="content" v-if="detailInfo.properties == 0">未定级别</view>
					<view class="content" v-if="detailInfo.properties == 1">公司级别</view>
					<view class="content" v-if="detailInfo.properties == 2">部门级别</view>
				</view>
			</view>
			<view class="question" v-if="option.data">
				<view class="question-status">
					<view :class="['status-round',option.data.status == 1?'solve':'']"></view>
					<view class="status-title" v-if="option.data.status == 0">待解决...</view>
					<view class="status-title" v-if="option.data.status == 1">问题已解决</view>
					<view class="confirm-question" v-if="option.data.status == 0 && option.data.usernumber == usernumber" @click="confirmQuestion(option.data)">确认已解决</view>
				</view>
				<view class="item-title" v-if="detailInfo.planinspectionitem.length">1.巡检项目</view>
				<view class="question-info">
					<view class="user">{{option.data.deptname?option.data.deptname:''}} -
						{{option.data.username?option.data.username:''}}</view>
					<view class="timer">{{option.data.insertdate1}}</view>
				</view>
				<view class="info-list">
					<view class="left">巡检问题</view>
					<view class="content">{{option.data.question}}</view>
				</view>
				<view class="info-list" v-if="option.data.mapplaninspectiondept.length">
					<view class="left">通知部门</view>
					<view class="content">
						<text>
							<block>{{option.data.mapplaninspectiondept[0].deptname}}</block>
							<block v-for="(ite,ind) of option.data.mapplaninspectiondept" :key="ind" v-if="ind != 0">{{'、' + ite.deptname}}</block>
						</text>
					</view>
				</view>
				<view class="info-list" v-if="option.data.mapplaninspectionuser.length">
					<view class="left">通知人员</view>
					<view class="content">
						<text>
							<block>{{option.data.mapplaninspectionuser[0].username}}</block>
							<block v-for="(ite,ind) of option.data.mapplaninspectionuser" :key="ind" v-if="ind != 0">{{'、' + ite.username}}</block>
						</text>
					</view>
				</view>
				<view class="info-list">
					<view class="left">位置</view>
					<view class="content">{{option.data.inspectionplace}}</view>
				</view>
				<view class="question-img" v-if="option.data.planinspectionquestionimg.length">
					<view class="item" v-for="(item,index) of option.data.planinspectionquestionimg" :key="index" @click="seePicture(option.data.planinspectionquestionimg,index)">
						<image class="img" :src="item.imgurl + '?x-oss-process=image/resize,m_mfit,h_120,w_120'" mode=""></image>
					</view>
				</view>
			</view>
			<view class="question-discuss-title" v-if="option.data.planinspectionfeedback.length">问题反馈</view>
			<view class="discuss-list">
				<view class="discuss-item" v-for="(item,index) of option.data.planinspectionfeedback" :key="index">
					<view class="info">
						<view class="user">{{item.deptname}} - {{item.username}}</view>
						<view class="date">{{item.insertdate1}}</view>
						<!-- <view class="reply-btn">
							<view class="img-btn">
								<image class="img" src="../../static/reply.png" mode="widthFix"></image>
							</view>
							<text class="txt">回复</text>
						</view> -->
					</view>
					<view class="content">{{item.content}}</view>
					<view class="img-list">
						<!-- <view class="item">
							<image class="img" src="../../static/1.jpg" mode=""></image>
						</view> -->
						<view class="item" v-for="(itm,ind) of item.planinspectionfeedbackimg" :key="ind" @click="seePicture(item.planinspectionfeedbackimg,ind)">
							<image class="img" :src="itm.imgurl + '?x-oss-process=image/resize,m_mfit,h_120,w_120'" mode=""></image>
						</view>
					</view>
					<!-- <view class="reply-list">
						<view class="item">(人资部)张章：回复了一个内容，文字显示，文字显示，文字显示，文字显示。</view>
						<view class="item">(人资部)张章：回复了一个内容，文字显示，文字显示。</view>
						<view class="item">(人资部)张章：回复了一个内容。</view>
						<view class="item">(人资部)张章：回复了一个内容，文字显示，文字显示，文字显示，文字显示。</view>
					</view>
					<view class="reply-view">
						<textarea class="reply-input" placeholder-style="color:#B6C6D6;" value="" placeholder="对此条讨论进行发言" />
						<view class="reply-confirm-btn">
						<view class="left"></view>
						<view class="cancel">取消</view>
						<view class="confirm">确认</view>
					</view> -->
				</view>
			</view>
			<!-- off -->
			<!-- <view class="replay-null">
				<view class="none">
					<view class="txt">暂时无人回复</view>
					<view class="line"></view>
				</view>
			</view> -->
			<view class="replay-null">
				<view class="none">
					<view class="txt">没有更多记录</view>
					<view class="line"></view>
				</view>
			</view>
		</haoheao-scroll>
		<view class="replay-btn" v-if="option.data.status == 0" @click="thatReply()">提出反馈</view>
		<!-- uni-popup的底部蒙层 -->
		<uni-popup ref="popup" type="bottom">
			<view class="popup-reply">
				<view class="textarea-view">
					<textarea auto-height="false" fixed="true" class="input-view solve" maxlength="200" placeholder-style="color:#B6C6D6;"
					 value="" placeholder="请输入处理方法或建议(200字以内)" v-model="replyTxt" @focus="inpFoc" @blur="inpBur" />
					</view>
				<view class="control-view" :style="{'padding-bottom':bottomHeight}">
					<view class="img-list">
						<view class="img-view" v-for="(item,index) of upImgList" :key="index" @click="delImg(index)">
							<image class="img" :src="item.path + '?x-oss-process=image/resize,m_mfit,h_120,w_120'" mode=""></image>
							<view class="del">×</view>
						</view>
					</view>
					<view class="control">
						<view class="select-img" @click="addImg()">
							<image class="img" src="../../static/select-img.png" mode="widthFix"></image>
						</view>
						<view class="btn reply-close" @click="thatReplyClose()">取消</view>
						<view class="btn reply-btn" @click="addReply()">提交</view>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import haoheaoScroll from '@/components/haoheao-scroll/haoheao-scroll.vue'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
    let utils = require('@/util/utils.js');
	let moment = utils.moment;
    let request = utils.request;
	export default {
		components: {
			haoheaoScroll,
			uniPopup
		},
		data() {
			return {
				usernumber:uni.getStorageSync('userinfo').usernumber,
                bottomHeight:'20rpx',
				keyBoardHeight:"",
				option: {},
				// 查看图片
				seeImgList: [],
				replyTxt:"",
				// 此巡检全局数据
				detailInfo:{},
				// 此回复数据
				replyInfo:{},
				
				// 重复提交
				btnClickReply:true,
				imgList:[],
				upImgList:[]
			}
		},
		methods: {
			onPullDown(done) { // 下拉刷新
				this.getDetail(this.option.id,this.option.reply_id);
				console.log("下拉刷新")
				setTimeout(() => {
					done();
				}, 1800)
			},
			// 查看图片
			seePicture:function(list,index){
				utils.seePicture(list,index);
			},
			// 打开回复框
			thatReply:function(){
				this.$refs['popup'].open()
			},
			// 关闭回复框并且清空详细信息
			thatReplyClose:function(){
				this.replyTxt = "";
				this.$refs['popup'].close()
			},
			// 获取巡检数据
			getDetail: function(id,reply_id) {
				let _this = this;
				request.getPlanDetail(id)
				.then(data => {
					let [err, res] = data;
					console.log("获取巡检信息:",err,res.data.data);
					// 巡检单信息
					this.detailInfo = res.data.data.planinspectionset;

					// 时间过滤
					this.detailInfo.sdate1 = this.detailInfo.sdate.slice(0, 10).replace(/-/g, ".");
					this.detailInfo.edate1 = this.detailInfo.edate.slice(0, 10).replace(/-/g, ".");

					// 部门人员过滤
					this.detailInfo.itemdeptlist = [];
					this.detailInfo.itempersonlist = [];
					for (let itm of this.detailInfo.planinspectionappenduser) {
						if (itm.appendtype == 1) {
							this.detailInfo.itemdeptlist.push(itm.itemname);
						} else if (itm.appendtype == 2) {
							this.detailInfo.itempersonlist.push(itm.itemname);
						}
					}
					// 巡检信息
					for(let item of res.data.data.planinspectionset.planinspectionquestion){
						if(item.planquestionid == reply_id){
							// 部门人员过滤
							item.itemdeptlist = [];
							item.itempersonlist = [];
							for (let itm of item.mapplaninspectiondept) {
								item.itemdeptlist.push(itm.deptname);
							}
							console.log(item)

							// 回复内容时间过滤
							utils.timerDateString(item.planinspectionfeedback,this);
							utils.timerDateString([item],this);
							this.option.data = item;
						}
					}
					
					// HTML标签过滤
					var str = this.detailInfo.content.replace(/<.*?>/ig, "");
					this.detailInfo.content = str
					
					console.log("detailInfo:",this.detailInfo);
					console.log("option",this.option);
				})
			},
			// 讨论回复
			addReply:function(){
				if(!this.btnClickReply){return;}
				this.btnClickReply = false;
				let _this = this;
				if(this.replyTxt == ""){
					uni.showToast({
						icon:'none',
						title:"请填写讨论内容"
					})
					this.btnClickReply = true;
					return;
				}
				let insertdate = moment().format('yyyy-MM-dd hh:mm:ss');
				let data = {
					 //讨论
					planinspectionfeedback:{
						planfeedbackid:0,
						planquestionid:this.option.reply_id,
						planid:this.option.id,
						content:this.replyTxt,// 反馈内容
						deptno:'',// 反馈部门编码
						deptname:uni.getStorageSync('userinfo').deptname,// 反馈部门名称
						usernumber:uni.getStorageSync('userinfo').usernumber,// 反馈人工号
						username:uni.getStorageSync('userinfo').username,// 反馈人姓名
						status:1000,
						insertdate,
						lstupdatedate:insertdate,
						lstuserid:"",
						planinspectionfeedbackimg:[{
							planquestionimgid:0,
							planfeedbackid:0,
							planquestionid:1,
							imgurl:'图片地址',
							uploaddate:insertdate
						}]
					}
				}
				data.planinspectionfeedback.planinspectionfeedbackimg = [];
				// 插入图片
				for(let item of this.upImgList){
					let obj = {
						planquestionimgid:0,
						planfeedbackid:0,
						planquestionid:this.option.reply_id,
						imgurl:item.path,
						uploaddate:insertdate
					};
					data.planinspectionfeedback.planinspectionfeedbackimg.push(obj)
				}
				console.log(this.option)
				console.log("二级回复参数：",data)
				console.log("二级回复参数JSON：",JSON.stringify(data))
				request.sendQuestionReply(data)
				.then(data=>{
					let [err,res] = data;
					console.log("二级回复信息：",err,res)
					if(err == null && res.data.success){
						// 重新刷新页面
						let option = _this.option;
						_this.getDetail(option.id,option.reply_id);
						_this.thatReplyClose();
					}else{
						uni.showToast({
							icon:"none",
							title:"回复失败:" + err
						})
					}
					this.btnClickReply = true;
				})
			},
            inpFoc:function(e){
                console.log(e.detail)
                if(!e.detail.height){this.bottomHeight = '20rpx';return;}
                this.bottomHeight = e.detail.height + 'rpx';
            },
            inpBur:function(e){
                this.bottomHeight = '20rpx'
            },
			addImg:function(){
				utils.addImg(this);
			},
			delImg:function(index){
				utils.delImg(index,this);
			},
			navigitorShowDeail(item){
				console.log(item);
				uni.navigateTo({
					url:"../seeDetail/seeDetail?id=" + item.planid
				})
			},
			confirmQuestion(item) {
				// console.log(item);
				uni.showModal({
					title: "确认该问题已解决？",
					success: (res) => {
						if (res.confirm) {
							request.confirmPlanQuestion({
									usernumber: uni.getStorageSync('userinfo').usernumber,
									planquestionid: item.planquestionid
								})
								.then(data => {
									let [err, res] = data;
									console.log("确认巡检返回:", err, res)
									this.getDetail(this.option.id,this.option.reply_id);
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
		onLoad: function(option) {
			if(option.data)option.data = JSON.parse(option.data);
			this.option = option;
			console.log("plan-viewQuestion option:",this.option)
		},
		onShow:function(){
			this.getDetail(this.option.id,this.option.reply_id);
		}
	}
</script>

<style scoped lang="scss">
	.container {
		min-height: 100vh;
		width: 100%;
		background: #E5EDF1;
		padding-bottom: 50rpx;
		padding-bottom: env(safe-area-inset-bottom);
		box-sizing: border-box;
		
		// 消息页进入显示问题内容
		.question.msg{
			// box-shadow:0rpx 0rpx 8rpx -2rpx #40A9FF;
			border: 4rpx solid #40A9FF;
			font-size:26rpx;
			
			.msg-title{
				font-weight:700;
				font-size:28rpx;
				padding-bottom:10rpx;
			}
			
			.msg-list{
				display: flex;
				padding-bottom:5rpx;
				color:#A4B1BE;
				.left{
					width:125rpx;
				}
				.content{
					flex:2;
					color:#323436;
					word-break:break-word;
				}
			}
			
			&:active{
				background:#f2f2f2;
				animation: fadeIn 300ms;
			}
		}
		.question {
			background: #fff;
			width: calc(100% - 40rpx);
			margin: 20rpx;
			padding: 20rpx;
			padding-bottom: 10rpx;
			font-size: 26rpx;
			box-sizing: border-box;
			border-radius: 10rpx;
			margin-top: 20rpx;
			
			// 问题的状态显示
			.question-status{
				display:flex;
				align-items: center;
				font-size: 26rpx;

				.status-round{
					width:22rpx;
					height: 22rpx;
					border-radius:22rpx;
					background:#D56C68;
					margin-right:10rpx;
				}
				.status-round.solve{
					background:#7ED58C;
				}
				.status-title{
					flex:2;
				}
				.confirm-question{
					background:#fff;
					border:1rpx solid #1BA1F3;
					color:#1BA1F3;
					border-radius:40rpx;
					padding: 5rpx 15rpx;
					font-size: 22rpx;
					 &:active{
						 background:#1BA1F3;
						 color:#fff;
					 }
				}
			}

            .item-title{
                color:#333;
                font-weight:700;
            }
            .question-info{
				display:flex;
				justify-content:flex-start;
				color:#647484;
				padding:20rpx 0rpx;
				
				.timer{
					flex:2;
					text-align:right;
					color:#B6C6D6;
				}
            }
			
			.info-list{
				display: flex;
				color:#A4B1BE;
				margin-bottom:5rpx;
				
				.left{
					width:125rpx;
				}
				
				.content{
					flex:2;
					color:#647484;
					word-break:break-word;
				}
			}
            
			.question-txt {
				.title {
					color: #A4B1BE;
					font-weight: 800;
				}

				.content {
					color: #647484;
					margin-bottom: 20rpx;
					word-break:break-word;
				}
			}

			.question-img {
				width: 100%;
				display: flex;
				justify-content: flex-start;
				flex-wrap: wrap;
				padding-top:20rpx;

				.item {
					width: 120rpx;
					height: 120rpx;
					overflow: hidden;
					margin-right: 15rpx;
					margin-bottom: 15rpx;
					border-radius: 6rpx;

					.img {
						width: 100%;
						height: 100%;
					}
				}
			}
		}

		.question-discuss-title {
			// padding-top: 74rpx;
			padding-bottom: 20rpx;
			color: #424242;
			font-size: 28rpx;
			text-align: center;
			width: 100%;
			font-weight:700;
		}

		// 回复列表
		.discuss-list {
			width: 100%;
			// position: relative;

			.discuss-item {
				width: calc(100% - 40rpx);
				margin: 20rpx;
				margin-top: 0;
				background: #fff;
				border-radius: 10rpx;
				box-sizing: border-box;
				padding: 20rpx;
				padding-top: 0;

				// &:active {
				// 	opacity: 0.9;
				// }

				.info {
					border-bottom: 1rpx solid #EDEEEF;
					padding: 26rpx 0rpx;
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

					.reply-btn {
						height: 48rpx;
						border: 1rpx solid #8ABAF5;
						border-radius: 48rpx;
						margin-left: 20rpx;
						padding: 0rpx 20rpx;
						display: flex;
						align-items: center;
						justify-content: flex-start;
						background: #fff;

						&:active {
							background: #f9f9f9;
						}

						.img-btn {
							width: 28rpx;
							height: 28rpx;
							margin-right: 6rpx;

							.img {
								width: 100%;
							}
						}

						.txt {
							color: #1474EA;
							font-size: 22rpx;
						}
					}
				}

				.content {
					color: #647484;
					font-size: 24rpx;
					margin-bottom: 16rpx;
					margin-top: 20rpx;
					word-break:break-word;
				}
				
				.img-list{
					width: 100%;
					display: flex;
					justify-content: flex-start;
					flex-wrap: wrap;
				
					.item {
						width: 120rpx;
						height: 120rpx;
						overflow: hidden;
						margin-right: 15rpx;
						margin-bottom: 15rpx;
				
						.img {
							width: 100%;
							height: 100%;
							border-radius: 6rpx;
						}
					}
				}

				// 聊天
				.reply-list {
					position: relative;
					margin-top: 32rpx;
					background: #F6F7F9;
					border-radius: 10rpx;
					padding: 20rpx;
					box-sizing: border-box;
					font-size: 22rpx;
					color: #A4B1BE;

					// 三角
					&:before {
						display: block;
						content: '';
						position: absolute;
						left: 50rpx;
						top: -32rpx;
						border: 16rpx transparent dashed;
						border-bottom: 16rpx #F6F7F9 solid; //F6F7F9
						// border-top: 16rpx transparent dashed;
						// border-left: 16rpx transparent dashed;
						// border-right: 16rpx transparent dashed;
					}

					.item {
						margin-bottom: 6rpx;
					}
				}
			}
		}

		// // 没有更多记录
		// .replay-null {
		// 	width: 100%;
		// 	height: 200rpx;

		// 	.none {
		// 		width: 100%;
		// 		height: 20rpx;
		// 		margin: 40rpx 0rpx;
		// 		position: relative;

		// 		.txt {
		// 			width: 136rpx;
		// 			height: 20rpx;
		// 			line-height: 20rpx;
		// 			text-align: center;
		// 			position: absolute;
		// 			left: calc(50% - 68rpx);
		// 			top: 0rpx;
		// 			z-index: 2;
		// 			background: #E5EDF1;
		// 			color: #B6C6D6;
		// 			font-size: 20rpx;
		// 		}

		// 		.line {
		// 			width: 290rpx;
		// 			height: 1rpx;
		// 			background: #B6C6D6;
		// 			position: absolute;
		// 			left: calc(50% - 145rpx);
		// 			top: 10rpx;
		// 			z-index: 1;
		// 		}
		// 	}
		// }

		// 对此记录进行回复
		.replay-btn {
			width: calc(100% - 40rpx);
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			margin: 10rpx 20rpx;
			margin-bottom: 0;
			border-radius: 40rpx;
			color: #fff;
			background: #647484;
			font-size: 28rpx;
			position: fixed;
			left: 0;
			bottom: 10rpx;
			z-index: 2;
			margin-bottom: env(safe-area-inset-bottom);
			opacity: 0.9;

			&:active {
				opacity: 0.8;
			}
		}
	}
</style>
<style lang="scss">
	.reply-view {
		padding-top: 20rpx;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;

		.reply-input {
			width: 100%;
			height: 126rpx;
			background: #F3F5F7;
			border-radius: 10rpx;
			padding: 20rpx;
			color: #647484;
			box-sizing: border-box;
		}

		.reply-confirm-btn {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			margin: 20rpx 0rpx;

			.left {
				flex: 2;
			}

			.cancel {
				color: #545658;
				font-size: 22rpx;
				width: 130rpx;
				text-align: center;
				margin-right: 10rpx;
			}

			.confirm {
				width: 130rpx;
				height: 48rpx;
				line-height: 48rpx;
				background: #A3D9FA;
				color: #fff;
				text-align: center;
				border-radius: 48rpx;
				font-size: 22rpx;

				&:active {
					opacity: 0.8;
				}
			}
		}
	}

	.reply-view.mark-view {
		width: 100%;
		box-sizing: border-box;
		padding: 20rpx;
		padding-bottom: 0;
	}
	
	
	
	// 弹出层
	.popup-reply{
		background:#fff;
		width:100%;
		box-sizing:border-box;
		border-bottom-left-radius:10rpx;
		border-bottom-right-radius:10rpx;
		padding-top:30rpx;
		
		.textarea-view{
			width:calc(100% - 60rpx);
			margin:0rpx 30rpx;
			padding:26rpx 20rpx;
			border-radius:10rpx;
			background:#F3F5F7;
			box-sizing:border-box;
		}
		.title{
			height:38rpx;
			color:#647484;
			font-size:26rpx;
			font-weight:800;
			padding:20rpx 0rpx 10rpx 20rpx;
		}
		
		.input-view{
			width:100%;
			min-height:126rpx;
			box-sizing:border-box;
			font-size:26rpx;
		}
		.solve{
			height:164rpx;
		}
		.control-view{
			width:calc(100% - 60rpx);
			height:80rpx;
			// box-sizing:border-box;
			display:flex;
			align-items:center;
			padding: 20rpx 30rpx;
			
			.img-list{
				width: auto;
				max-width:300rpx;
				padding: 20rpx 0rpx;
				display:flex;
				align-items:center;
				overflow-x:scroll;
				
				.img-view{
					width:80rpx;
					min-width:80rpx;
					height:80rpx;
					background:#F3F5F7;
					margin-right:10rpx;
					border-radius:10rpx;
					overflow:hidden;
					
					.img{
						width:80rpx;
						height:80rpx;
					}
				}
			}
			.control{
				display:flex;
				align-items: center;
				margin-left:30rpx;
				flex:2;
				
				.left{
					flex:2;
				}
				.select-img{
					display:flex;
					align-items: center;
					flex:2;
					
					&:active{
						opacity:0.9;
					}
					.img{
						width: 42rpx;
					}
				}
				.btn{
					width:130rpx;
					height:48rpx;
					text-align:center;
					line-height:48rpx;
					color:#fff;
					background:#647484;
					margin-left:10rpx;
					border-radius:48rpx;
					font-size:22rpx;
					
					&:active{
						opacity:0.9;
					}
				}
				.btn.reply-close{
					background:transparent;
					color:#545658;
				}
			}
		}
	}
</style>
