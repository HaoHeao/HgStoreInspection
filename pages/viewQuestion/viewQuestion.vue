<template>
	<view class="container">
		<haoheao-scroll class="haoheao-scroll" ref="scroll" @onPullDown="onPullDown">
			<view class="question msg" @click="navigitorShowDeail(detailInfo)" v-if="option.previs == 'true'">
				<view class="msg-title">{{detailInfo.title}}</view>
				<view class="msg-list">
					<view class="left">上传人</view>
					<view class="content">{{detailInfo.deptname}} - {{detailInfo.lstuserid}}</view>
				</view>
				<view class="msg-list">
					<view class="left">巡检日期</view>
					<view class="content">{{detailInfo.insertdate}}</view>
				</view>
				<view class="msg-list">
					<view class="left">描述</view>
					<view class="content">{{detailInfo.remark}}</view>
				</view>
				<view class="msg-list-img">
					<view class="item" v-for="(item,index) of detailInfo.loginspectionimg" :key="index">
						<image :src="item.imgurl + '?x-oss-process=image/resize,m_mfit,h_120,w_120'" mode="" class="img"></image>
					</view>
				</view>
			</view>
			<view class="question">
				<view class="question-txt">
					<view class="title" v-if="option.data.remark">问题原因:</view>
					<view class="title" v-if="!option.data.remark">说明:</view>
					<view class="content">{{option.data.reason}}</view>
				</view>
				<view class="question-txt" v-if="option.data.remark">
					<view class="title">处理方法:</view>
					<view class="content">{{option.data.remark}}</view>
				</view>
				<view class="question-img">
					<view class="item" v-for="(item,index) of option.data.loginspectionquestionimg" :key="index" @click="seePicture(option.data.loginspectionquestionimg,index)">
						<image class="img" :src="item.imgurl + '?x-oss-process=image/resize,m_mfit,h_120,w_120'" mode=""></image>
					</view>
				</view>
			</view>
			<view class="question-discuss-title" v-if="option.data.loginspectionanswers.length">问题讨论</view>
			<view class="discuss-list" v-if="option.data.loginspectionanswers.length">
				<view :class="['discuss-item',option.previs == 'true' && item.questionid == option.id?'that-item':'']" v-for="(item,index) of option.data.loginspectionanswers" :key="index">
					<view class="info">
						<view class="user">{{item.deptname}} - {{item.username}}</view>
						<view class="date">{{item.insertdate}}</view>
						<!-- <view class="reply-btn">
							<view class="img-btn">
								<image class="img" src="../../static/reply.png" mode="widthFix"></image>
							</view>
							<text class="txt">回复</text>
						</view> -->
					</view>
					<view class="content">{{item.reason}}</view>
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
			<view class="replay-null" v-if="option.data.loginspectionanswers.length == 0">
				<view class="none">
					<view class="txt">暂时无人回复</view>
					<view class="line"></view>
				</view>
			</view>
			<view class="replay-null" v-if="option.data.loginspectionanswers.length != 0">
				<view class="none">
					<view class="txt">没有更多记录</view>
					<view class="line"></view>
				</view>
			</view>
		</haoheao-scroll>
		<view class="replay-btn" @click="thatReply()" v-if="detailInfo.status == 0 && option.postThereTrue">对此问题发起讨论...</view>

		<uni-popup ref="popup" type="top">
			<view class="popup-reply">
				<view class="textarea-view">
					<textarea auto-height="true" fixed="true" class="input-view solve" maxlength="200" placeholder-style="color:#B6C6D6;"
					 value="" placeholder="请输入处理方法或建议(200字以内)" v-model="replyTxt" />
					</view>
				<view class="control-view">
					<view class="control">
						<view class="left"></view>
						<view class="btn reply-close" @click="thatReplyClose()">取消</view>
						<view class="btn reply-btn" @click="addReply()">回复</view>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
    let utils = require('@/util/utils.js');
    let request = utils.request;
	export default {
		data() {
			return {
				option: {},
				// 查看图片
				seeImgList: [],
				replyTxt:"",
				// 此巡检全局数据
				detailInfo:{},
				// 此回复数据
				// 重复提交
				btnClickReply:true,
				replyInfo:{},
				// 信息页传过来的数据
				msg:{}
			}
		},
		methods: {
			onPullDown(done) { // 下拉刷新
				this.getDetail(this.option.id,this.option.reply_id,done);
				console.log("下拉刷新")
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
			getDetail: function(id,reply_id,done) {
				let _this = this;
				request.getDetail({
					id,
					usernumber:uni.getStorageSync("userinfo").usernumber
				})
				.then(data => {
					let [err, res] = data;
					console.log("获取巡检信息:",err,res);
					// 巡检单信息
					this.detailInfo = res.data.data.loginspection;
					console.log("巡检单信息:",this.detailInfo)
					// 巡检信息
					for(let item of res.data.data.loginspection.loginspectionquestion){
						if(item.questionid == reply_id){
							this.option.data = item;
							console.log(item)
						}
					}
					console.log("获取巡检数据",this.option)
					if(done) done();
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
				let data = {
					 //讨论
					loginspectionanswers:{
						answered:0,//传0就行
						questionid:_this.option.data.questionid,//这个是对应讨论的主键"
						reason:_this.replyTxt,//回复的内容
						remark:"",//为空就行,
						parentid:0,//传0就行
						insertdate:"",
						userid:uni.getStorageSync("userinfo").userid,//登录人id,
						usernumber:uni.getStorageSync("userinfo").usernumber,//登录人工号,
						username:uni.getStorageSync("userinfo").username,//名称,
						deptid:uni.getStorageSync("userinfo").deptid, //登录人部门id
						deptname: uni.getStorageSync("userinfo").deptname //部门名称
					}
				}
				console.log("二级回复参数：",data)
				console.log("二级回复参数JSON：",JSON.stringify(data))
				uni.request({
					url:request.replyQiestion,
					method:"POST",
					data
				})
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
							title:"回复失败:" + err.errmsg
						})
					}
					this.btnClickReply = true;
				})
			},
			// 返回详情页
			navigitorShowDeail:function(item){
				uni.navigateTo({
					url:"../seeDetail/seeDetail?id=" + item.inspectionlogid
				})
			}
		},
		onLoad: function(option) {
			console.log("pages viewQuestion option：", option);
			if(option.msg){
				this.msg = option.msg;
				// uni.showLoading({
				// 	title:"正在加载数据...",
				// 	mask:true
				// })
				this.getDetail(option.id,option.reply_id);
			}
			if(option.data){
				option.data = JSON.parse(option.data);
				this.getDetail(option.id,option.reply_id);
			}
			this.option = option;
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
				}
			}
			.msg-list-img{
				margin-top: 20rpx;
				width: 100%;
				display: flex;
				justify-content: flex-start;
				flex-wrap: wrap;

				.item {
					width: 119rpx;
					height: 119rpx;
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

			&:active{
				background:#f2f2f2;
				animation: fadeIn 300ms;
			}
		}
		.question {
			background: #fff;
			width: calc(100% - 40rpx);
			margin: 20rpx;
			padding: 30rpx 20rpx;
			padding-bottom: 10rpx;
			font-size: 24rpx;
			box-sizing: border-box;
			border-radius: 10rpx;
			margin-top: 20rpx;


			.question-txt {

				.title {
					color: #A4B1BE;
					font-weight: 800;
				}

				.content {
					color: #647484;
					margin-bottom: 20rpx;
				}
			}

			.question-img {
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

					.user {
						color: #647484;
						font-size: 24rpx;
						flex: 2;
					}

					.date {
						height: 20rpx;
						line-height: 20rpx;
						font-size: 20rpx;
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
				}


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
			.that-item{
				border:1rpx solid #647484;
				background:#e2e2e2;

				&:active{
					border:0rpx solid #647484;
					background:#fff;
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
		// 			left: 0;
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
