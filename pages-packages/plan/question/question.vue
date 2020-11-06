<template>
	<view class="container">
		<scroll-view class="scroll-view" scroll-y refresher-enabled scroll-with-animation :enable-back-to-top="setting.enableBackToTop"
		 :refresher-triggered="getDataRefresherLoading" @refresherrefresh="onRefresh" @refresherrestore="onRestore">
			<view class="top-placeholder"></view>
			<block v-if="inspectionDetail">
				<view class="question msg" @click="navigateToPlan()" v-if="navigatePage">
					<view class="msg-title">{{inspectionDetail.title}}</view>
					<view class="msg-list">
						<view class="left">发起部门</view>
						<view class="content">{{inspectionDetail.deptname?inspectionDetail.deptname:'' + '-' + inspectionDetail.username?inspectionDetail.username:''}}</view>
					</view>
					<view class="msg-list">
						<view class="left">巡查日期</view>
						<view class="content">{{moment(inspectionDetail.sdate.replace(/-/g, "/")).format('YYYY.MM.DD') + ' - ' + moment(inspectionDetail.edate.replace(/-/g, "/")).format('YYYY.MM.DD')}}</view>
					</view>
					<view class="msg-list">
						<view class="left">检查重点</view>
						<rich-text :nodes="inspectionDetail.content?inspectionDetail.content:'无描述'" class="content"></rich-text>
					</view>
					<view class="msg-list">
						<view class="left">巡检级别</view>
						<view class="content">{{inspectionDetail.properties == 0?'未定级别':inspectionDetail.properties == 1?'公司级别':inspectionDetail.properties == 2?'部门级别':''}}</view>
					</view>
				</view>
				<view class="question" v-if="inspectionQuestionDetail">
					<view class="question-status">
						<view :class="['status-round',inspectionQuestionDetail.status == 100?'solve':'']"></view>
						<view class="status-title">{{inspectionQuestionDetail.status == 0?'待整改':inspectionQuestionDetail.status == 1?'已整改':inspectionQuestionDetail.status == 100?'问题已解决':''}}</view>
						<view class="confirm-question" v-if="inspectionQuestionDetail.review" @click="openReviewPpup()">复核</view>
						<view v-if="inspectionQuestionDetail.withdrawQuestion" class="del" @click="delPlanQuestion()">撤回</view>
					</view>
					<view class="question-info">
						<view class="user">{{inspectionQuestionDetail.deptname?inspectionQuestionDetail.deptname:''}} -
							{{inspectionQuestionDetail.username?inspectionQuestionDetail.username:''}}</view>
						<view class="timer">{{inspectionQuestionDetail.insertdate}}</view>
					</view>
					<view class="info-list">
						<view class="left">巡检问题</view>
						<view class="content">{{inspectionQuestionDetail.question}}</view>
					</view>
					<view class="info-list" v-if="inspectionQuestionDetail.mapplaninspectiondept.length">
						<view class="left">整改部门</view>
						<view class="content">
							<text>
								<block>{{inspectionQuestionDetail.mapplaninspectiondept[0].deptname}}</block>
								<block v-for="(ite,ind) of inspectionQuestionDetail.mapplaninspectiondept" :key="ind" v-if="ind != 0">{{'、' + ite.deptname}}</block>
							</text>
						</view>
					</view>
					<view class="info-list" v-if="inspectionQuestionDetail.mapplaninspectionuser.length">
						<view class="left">整改人员</view>
						<view class="content">
							<text>
								<block>{{inspectionQuestionDetail.mapplaninspectionuser[0].username}}</block>
								<block v-for="(ite,ind) of inspectionQuestionDetail.mapplaninspectionuser" :key="ind" v-if="ind != 0">{{'、' + ite.username}}</block>
							</text>
						</view>
					</view>
					<!-- 确认部门或人员 -->
					<view class="info-list" v-if="inspectionQuestionDetail.planinspectionsolveuser.length">
						<view class="left">
							<!-- 复核人员或部门 -->复核部门</view>
						<view class="content">
							<text>
								<block>{{inspectionQuestionDetail.planinspectionsolveuser[0].itemname}}</block>
								<block v-for="(ite,ind) of inspectionQuestionDetail.planinspectionsolveuser" :key="ind" v-if="ind != 0">{{'、' + ite.itemname}}</block>
							</text>
						</view>
					</view>
					<!-- 复核人和时间 -->
					<view class="info-list" v-if="inspectionQuestionDetail.status == 100">
						<view class="left">复核人</view>
						<view class="content">{{inspectionQuestionDetail.confirmuserid}}</view>
					</view>
					<view class="info-list" v-if="inspectionQuestionDetail.status == 100">
						<view class="left">复核时间</view>
						<view class="content">{{inspectionQuestionDetail.confirmdate}}</view>
					</view>
					<!-- 信息 -->
					<view class="info-list">
						<view class="left">位置</view>
						<view class="content">{{inspectionQuestionDetail.inspectionplace}}</view>
					</view>
					<!-- 图片 -->
					<view class="question-img" v-if="inspectionQuestionDetail.planinspectionquestionimg.length">
						<view class="item" v-for="(item,index) of inspectionQuestionDetail.planinspectionquestionimg" :key="index" @click="previewImage(inspectionQuestionDetail.planinspectionquestionimg,index)">
							<image class="img" :src="item.imgurl + setting.OSSDownload" mode="widthFix"></image>
						</view>
					</view>
				</view>
				<block v-if="inspectionQuestionDetail.planinspectionfeedback.length">
					<view class="reply-list-title">整改记录</view>
					<view class="reply-list">
						<view class="reply-item" v-for="(item,index) of inspectionQuestionDetail.planinspectionfeedback" :key="index">
							<view class="top">
								<view class="user">{{item.deptname}} - {{item.username}}</view>
								<view class="date">{{item.insertdate}}</view>
								<view class="back-btn" v-if="item.withdrawQuestionReply" @click="feedbackClick(item)">撤回</view>
							</view>
							<view class="remark">{{item.content}}</view>
							<view class="img-list">
								<view class="item" v-for="(itm,ind) of item.planinspectionfeedbackimg" :key="ind" @click="previewImage(item.planinspectionfeedbackimg,ind)">
									<image class="icon" :src="itm.imgurl + setting.OSSDownload" mode="widthFix"></image>
								</view>
							</view>
							<!-- 复核记录 -->
							<view class="review-result" v-if="item.confirmresult">
								<view :class="['title',item.confirmresult == '通过'?'':'not']">复核结果：<span>{{item.confirmresult}}</span></view>
								<view class="date">{{item.confirmuserid}}</view>
								<view class="title by" v-if="item.confirmdate">复核时间：{{item.confirmdate}}</span></view>
								<view class="remark" v-if="item.confirmresult == '不通过'">原因：{{item.confirmremark}}</view>
							</view>
						</view>
					</view>
				</block>
			</block>
			<u-loadmore :status="getDataLoading?'loading':'nomore'" :icon-type="setting.iconType" :load-text="setting.loadText" :is-dot="setting.isDot"
			 :font-size="setting.loadmoreFontSize" :margin-top="setting.loadmoreMarginTop" :margin-bottom="setting.loadmoreMarginBottom" />
		</scroll-view>
		<view class="replay-btn" v-if="inspectionQuestionDetail && inspectionQuestionDetail.feedback" @click="openReplyPopup()">整改</view>
		<!-- uni-popup的底部蒙层 -->
		<uni-popup ref="reply" type="bottom">
			<view class="popup reply top">
				<view class="title">
					<text class="content">整改</text>
					<view class="close" @click="$refs['reply'].close()">关闭</view>
				</view>
				<view class="textarea-view">
					<textarea class="remark" fixed auto-height maxlength="500" placeholder-style="color:#B6C6D6;" placeholder="请输入处理方法或建议"
					 v-model="remark" />
					</view>
				<view class="bottom-control">
					<view class="imgage-list">
						<view class="image fadeIn" v-for="(item,index) of tempFilePaths" :key="index" @click="tempFilePaths.splice(index,1)">
							<image class="icon" :src="item" mode="widthFix"></image>
						</view>
						<view class="choose-imgage" @click="chooseImgage()">
							<image class="icon" src="@/static/icon/add_img.svg" mode="widthFix"></image>
						</view>
					</view>
					<view class="content">
						<view :class="['item',getFeedBackLoading?'loading':'']" @click="getFeedBack()"><u-loading v-if="getFeedBackLoading" class="loading" mode="circle" size="28"></u-loading>提交</view>
					</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="review" type="bottom">
			<view class="popup review top">
				<view class="title"><text class="content">复核问题</text><view class="close" @click="$refs['review'].close()">关闭</view></view>
				<view class="textarea-view">
					<textarea class="remark" fixed auto-height v-model="remark" placeholder-style="color:#B6C6D6" cursor-spacing="180" placeholder="不通过请填写原因" />
				</view>
				<view class="bottom-control">
					<view class="content">
						<view class="item error" @click="confirmQuestion(false)">
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
				planid:'',
				planquestionid:'',
				// 是否其他页面跳过来的
				navigatePage:false,
				// 巡检明细
				inspectionDetail:null,
				// 巡检问题明细
				inspectionQuestionDetail:null,
				getDataLoading:false,
				getDataRefresherLoading:false,
				remark:'',
				// 待上传图片列表
				tempFilePaths:[],
				// 上传成功的有效已选择的图片
				successUploadFileImages:[],
				getFeedBackLoading:false
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
				await this.getInspectionDetail();
				this.getDataRefresherLoading = false
			},
			// 刷新完成/重置
			onRestore() {
				this.getDataRefresherLoading = false
			},
			// 此巡检问题是否可以撤回
			withdrawQuestionFilter(){
				let _this = this;
				let withdrawQuestion = (function(){
					// 此巡检问题是否是登录人提出
					// 此巡检问题提出时间要大于今天
					// 不能有巡检整改回复
					// 问题状态必须为0
					let nextDate = _this.moment(new Date().getTime() + 24*60*60*1000).format("YYYY/MM/DD")
					if(_this.userinfo.username == _this.inspectionQuestionDetail.username &&
					 new Date(_this.inspectionQuestionDetail.insertdate).getTime() < new Date(nextDate) &&
					 _this.inspectionQuestionDetail.planinspectionfeedback.length == 0 && 
					 _this.inspectionQuestionDetail.status == 0
					) return true
				}())
				this.inspectionQuestionDetail.withdrawQuestion = withdrawQuestion?true:false
			},
			// 巡检问题整改是否可以撤回
			withdrawQuestionReplyFilter() {
				let _this = this;
				for (let item of this.inspectionQuestionDetail.planinspectionfeedback) {
					let withdrawQuestionReply = (function(){
						if(item.usernumber == _this.userinfo.usernumber && _this.inspectionQuestionDetail.status != 100 && !item.confirmresult) return true
					}())
					// 巡检复核状态
					item.withdrawQuestionReply = withdrawQuestionReply?true:false
				}
			},
			// 是否可以回复整改
			replyFilter() {	
				let _this = this;
				let feedback = (function(){
					// 整改部门
					for(let dept of _this.inspectionQuestionDetail.mapplaninspectiondept){
						if (_this.userinfo.deptlist.filter(userdept => userdept.deptid == dept.deptid).length) return true;
					}
					// 整改人员
					for(let user of _this.inspectionQuestionDetail.mapplaninspectionuser){
						if (user.usernumber == _this.userinfo.usernumber) return true;
					}
				}())
				// 巡检问题状态
				this.inspectionQuestionDetail.feedback = (feedback && this.inspectionQuestionDetail.status == 0)?true:false
			},
			// 是否可以复核
			reviewFilter() {
				let _this = this;
				let review = (function(){
					// 当前问题是否为登录人
					if (_this.inspectionQuestionDetail.usernumber == _this.userinfo.usernumber) return true;
					// 巡检是否为登录人
					if (_this.inspectionDetail.usernumber == _this.userinfo.usernumber) return true;
					// 复核部门或人员
					for(let deptuser of _this.inspectionQuestionDetail.planinspectionsolveuser){
						// 登录人部门权限列表是否包含复核部门
						if (_this.userinfo.deptlist.filter(dept => dept.deptno == deptuser.itemno).length) return true
						// 复核人列表里是否有登录人
						if (deptuser.itemno == _this.userinfo.usernumber) return true;
					}
				}())
				// 巡检复核状态
				this.inspectionQuestionDetail.review = (review && this.inspectionQuestionDetail.status == 1)?true:false
			},
			// 计划巡检获取某一条巡检记录明细
			async getInspectionDetail(){
				if (this.getDataLoading) return
				this.getDataLoading = true
				uni.showNavigationBarLoading()
				try {
					let data = await uni.request({
						method: 'GET',
						url: this.api.plan_getPlaninspectionDetail,
						data:{
							planid:this.planid,
							status:'-1'
						}
					})
					uni.hideNavigationBarLoading()
					let [err, success] = data
					this.getDataLoading = false
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
						this.inspectionQuestionDetail = success.data.data.planinspectionset.planinspectionquestion.filter(item=> item.planquestionid == this.planquestionid)[0]
						console.log('巡检计划数据--->>>',this.inspectionDetail,'巡检计划问题数据--->>>',this.inspectionQuestionDetail)
						this.replyFilter()
						this.reviewFilter()
						this.withdrawQuestionFilter()
						this.withdrawQuestionReplyFilter()
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
					this.getDataLoading = false
					uni.hideNavigationBarLoading()
				}
			},
			// 打开复核popup
			openReviewPpup(){
				this.$refs['review'].open()
				this.remark = ''
			},
			// 打开整改popup
			openReplyPopup(){
				this.$refs['reply'].open()
				this.remark = ''
				this.tempFilePaths = []
				this.successUploadFileImages = []
				this.getFeedBackLoading = false
			},
			// 撤回整改问题
			feedbackClick(item){
				uni.showModal({
					title: "确认撤回此整改回复？",
					success: async (res) => {
						if (res.confirm) {
							try {
								let data = await uni.request({
									method: 'GET',
									url: this.api.plan_delReplydeep,
									data: {
										planfeedbackid:item.planfeedbackid,
										usernumber:this.userinfo.usernumber
									}
								})
								let [err, success] = data
								console.log('撤回整改回复------>>>', success)
								if (!err && success.data.success) {
									this.getDetail(this.option.id,this.option.reply_id);
								} else {
									uni.showToast({
										title: err ? err : success.data.errmsg,
										icon: 'none',
										duration: 3000
									});
								}
							} catch (e) {
								console.log(e)
							}
						}
					}
				})
			},
			// 撤回巡检问题
			delPlanQuestion(){
				uni.showModal({
					title: "确认撤回？",
					success: async (res) => {
						if (res.confirm) {
							try {
								let data = await uni.request({
									method: 'POST',
									url: this.api.plan_withdrawQuestionFeedBack,
									data: {
										planquestionid:this.planquestionid,
										usernumber:this.userinfo.usernumber
									}
								})
								let [err, success] = data
								console.log('撤回整改回复返回------>>>', success)
								if (!err && success.data.success) {
									uni.navigateBack({
										delta: 1
									});
								} else {
									uni.showToast({
										title: err ? err : success.data.errmsg,
										icon: 'none',
										duration: 3000
									});
								}
							} catch (e) {
								console.log(e)
							}
						}
					}
				})
			},
			// 选择图片
			chooseImgage(){
				let _this = this;
				uni.chooseImage({
					sizeType:['original'],
					success: function (res) {
						_this.tempFilePaths = _this.tempFilePaths.concat(res.tempFiles.map(item=> item.path))
					}
				});
			},
			// 上传图片
			async uploadFileImage(){
				this.successUploadFileImages = []
				let _this = this;
				for(let item of this.tempFilePaths){
					try{
						let uploadResult = await uni.uploadFile({
							url: _this.api.plan_uploadImage,
							filePath: item,
							name: 'file',
							method: "POST",
						})
						let [err, success] = uploadResult
						if (!err && JSON.parse(success.data).code == 0) {
							this.successUploadFileImages.push(JSON.parse(success.data).data.url)
						} else {
							uni.showToast({
								title: err ? err : success.data,
								icon: 'none',
								duration: 3000
							});
						}
					}catch(e){
						uni.showToast({
							title: e.msg,
							icon: 'none',
							duration: 3000
						});
					}
				}
			},
			// 查看图片
			previewImage(list,index){
				uni.previewImage({
					current: index,
					urls: list.filter(item=> item.imgurl).map(item=> item.imgurl)
				});
			},
			// 讨论回复
			async getFeedBack(){
				let _this = this;
				if(!this.remark){
					uni.showToast({
						icon:'none',
						title:"请输入处理方法或建议",
						duration:3000
					})
					return;
				}
				if(this.getFeedBackLoading) return;
				try{
					this.getFeedBackLoading = true
					// 上传图片
					await this.uploadFileImage()
					// 生成上传图片列表
					let planinspectionfeedbackimg = [];
					this.successUploadFileImages.map(imgurl=>{
						planinspectionfeedbackimg.push({
							planquestionimgid:0,
							planfeedbackid:0,
							planquestionid:1,
							imgurl,
							uploaddate:this.moment().format('YYYY-MM-dd hh:mm:ss')
						})
					})
					console.log('生成好的图片上传列表--->>>',planinspectionfeedbackimg)
					let data = await uni.request({
						method: 'POST',
						url: this.api.plan_getQuestionReply,
						data:{
							planinspectionfeedback:{
								planfeedbackid:0,
								planquestionid:this.planquestionid,
								planid:this.planid,
								content:this.remark,// 反馈内容
								deptno:'',// 反馈部门编码
								deptname:this.userinfo.deptname,// 反馈部门名称
								usernumber:this.userinfo.usernumber,// 反馈人工号
								username:this.userinfo.username,// 反馈人姓名
								status:1000,
								insertdate:this.moment().format('YYYY-MM-dd hh:mm:ss'),
								lstupdatedate:this.moment().format('YYYY-MM-dd hh:mm:ss'),
								lstuserid:"",
								planinspectionfeedbackimg
							}
						}
					})
					let [err, success] = data
					this.getFeedBackLoading = false
					console.log('整改回复结果--->>>',err, success)
					if (!err && success.data.success) {
						this.getInspectionDetail()
						this.$refs['reply'].close()
					}else{
						uni.showToast({
							title: err?err:success.data.errmsg,
							icon: 'none',
							duration:3000
						});
					}
				}catch(e){
					console.log(e)
					this.getFeedBackLoading = false
				}
			},
			// 顶部点击回到巡检计划主页plan
			navigateToPlan(){
				uni.navigateTo({
					url:"/pages-packages/plan/plan/plan?planid=" + this.planid
				})
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
							planquestionid: this.planquestionid,
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
		},
		onLoad(option) {
			this.planid = option.planid
			this.planquestionid = option.planquestionid
			option.navigatePage == 1?this.navigatePage = true:this.navigatePage = false;
			this.getInspectionDetail()
		},
		onShow:function(){
		}
	}
</script>

<style scoped lang="scss">
	page{
		background: #E5EDF1;
	}
	.container {
		height: 100vh;
		background: #E5EDF1;
		padding-bottom: env(safe-area-inset-bottom);
		
		.scroll-view{
			height: 100vh;
			// 顶部20rpx间隔
			.top-placeholder{
				height: 20rpx;
			}
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
				margin: 0 20rpx;
				padding: 20rpx;
				padding-bottom: 10rpx;
				font-size: 26rpx;
				box-sizing: border-box;
				border-radius: 10rpx;
				
				&.msg{
					margin-bottom: 20rpx;
				}
				
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
						font-size: 22rpx;
						width: 130rpx;
						height: 48rpx;
						line-height: 48rpx;
						text-align: center;
						&:active{
							background:#1BA1F3;
							color:#fff;
						}
					}
					.del{
						marign-right:10rpx;
						color:#27A6F4;
						padding: 3px 6px;
						border-radius: 2px;
						&:hover{
							background: #f2f2f2;
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
						min-width:4em;
						text-align-last: justify;
						padding-right:10rpx;
						margin-right:10rpx;
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
				font-weight:700;
			}

			// 回复列表
			.reply-list {
				width: 100%;

				.reply-item {
					width: calc(100% - 40rpx);
					margin:0 20rpx;
					margin-bottom: 20rpx;
					background: #fff;
					border-radius: 10rpx;
					box-sizing: border-box;

					.top {
						border-bottom: 1rpx solid #EDEEEF;
						padding: 26rpx 0rpx;
						display: flex;
						justify-content: flex-start;
						align-items: center;
						font-size: 24rpx;
						margin: 0 20rpx;

						.user {
							color: #647484;
							flex: 2;
						}

						.date {
							height: 20rpx;
							line-height: 20rpx;
							color: #B6C6D6;
						}
						
						/* 撤回按钮 */
						.back-btn{
							color: #1BA1F3;
							padding: 5rpx 10rpx;
							margin-left: 20rpx;
							border-radius: 5rpx;
							// background:#E5EDF1;
							&:active{
								color: #666;
							}
						}
					}

					>.remark {
						color: #647484;
						font-size: 24rpx;
						padding: 20rpx;
						word-wrap: break-word;
						word-break: normal;
					}
					
					.img-list{
						width: 100%;
						display: flex;
						flex-wrap: wrap;
						padding: 0 20rpx;
					
						.item {
							width: 120rpx;
							height: 120rpx;
							overflow: hidden;
							margin-right: 15rpx;
							margin-bottom: 15rpx;
							border-radius: 6rpx;
							display: flex;
							justify-content: center;
							align-items: center;
					
							.icon {
								width: 100%;
								min-height: 100%;
								background: #f2f2f2;
							}
						}
					}

					/* 复核状态 */
					.review-result{
						display: flex;
						flex-wrap: wrap;
						// border-top: 1rpx dashed #EDEEEF;
						font-size: 24rpx;
						padding: 20rpx;
						color: #647484;
						box-shadow: 0rpx -4rpx 10rpx -10rpx #000;
						
						.title{
							flex: 2;
							&.not{
								span{
									color: #ff0036;
								}
							}
							&.by{
								width: 100%;
								flex: auto;
							}
						}
						
						.userinfo{
							flex: 2;
						}
						
						.date{
							white-space: nowrap;
							display: flex;
							.status{
								margin-left: 10rpx;
								&.not{
									color: #ff0036;
								}
							}
						}
						
						.remark{
							width: 100%;
							padding: 5rpx 0;
							padding-top: 0;
						}
					}
				}
			}
		}
	
		.popup {
			padding: 30rpx;
			padding-bottom: 0;
			>.title{
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
			&.reply{
				.bottom-control {
					padding-top: 20rpx;
					background: #fff;
					
					// 已选择图片列表
					.imgage-list{
						display: flex;
						flex-wrap: wrap;
						flex: 2;
						.image{
							width: 100rpx;
							height: 100rpx;
							border-radius: 6rpx;
							overflow: hidden;
							display: flex;
							justify-content: center;
							align-items: center;
							background: #F3F5F7;
							margin-right: 15rpx;
							margin-bottom: 15rpx;
							position: relative;
							&:before{
								content: "×";
								border-radius: 50%;
								font-size: 16rpx;
								width: 20rpx;
								height: 20rpx;
								background: #D56C68;
								color: #fff;
								text-align: center;
								line-height: 20rpx;
								position: absolute;
								top: 5rpx;
								right: 5rpx;
							}
							.icon{
								width: 100%;
								min-height: 100%;
							}
						}
					
						// 选择图片按钮
						.choose-imgage{
							width: 100rpx;
							height: 100rpx;
							border-radius: 6rpx;
							background: #f2f2f2;
							padding: 25rpx;
							margin-bottom: 15rpx;
							.icon{
								width: 100%;
								height: 100%;
							}
						}
					}
					.content{
						flex: 0;
						min-width: 200rpx;
						.item {
							line-height: 60rpx;
							white-space: nowrap;
							&.loading{
								background: #b2b2b2;
							}
							.loading{
								margin-right: 10rpx;
							}
						}
					}
				}
			}
			&.review{
				.bottom-control {						
					.item {
						line-height: 60rpx;
					}
					.content{
						padding: 20rpx 0;
					}
				}
			}
		}
	
		// 对此问题提出整改回复
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
