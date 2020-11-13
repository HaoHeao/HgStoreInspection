<template>
	<view class="container">
		<scroll-view class="scroll-view" scroll-y refresher-enabled scroll-with-animation :enable-back-to-top="setting.enableBackToTop"
		 :refresher-triggered="getDataRefresherLoading" @refresherrefresh="onRefresh" @refresherrestore="onRestore">
			<skeleton v-if="!inspectionDetail"></skeleton>
			<block v-if="inspectionDetail">
				<view class="top-placeholder"></view>
				<view class="module info">
					<view class="top-view">
						<view class="state">{{inspectionDetail.feedback?'未解决':'已解决'}}</view>
						<view class="center"></view>
						<view class="right" @click="searchLookList()" v-if="!inspectionDetail.loginspectionquestion.length && inspectionDetail.feedback">
							<u-loading mode="circle" :show="searchLookListLoading"></u-loading>
							<block v-if="!searchLookListLoading">撤回</block>
						</view>
					</view>
					<view class="title">{{inspectionDetail.remark}}</view>
					<view class="line"></view>
					<view class="detail-item">
						<view class="item">上传人</view>
						<view class="content">
							<block>{{inspectionDetail.deptname + ' - ' + inspectionDetail.username}}</block>
						</view>
					</view>
					<view class="detail-item">
						<view class="item">巡查日期</view>
						<view class="content">{{inspectionDetail.insertdate}}</view>
					</view>
					<view class="detail-item">
						<view class="item">通知部门</view>
						<view class="content">
							<block v-for="(item,index) of inspectionDetail.mapinspectiondept" :key="index" v-if="inspectionDetail.mapinspectiondept.length">
								{{index == 0?inspectionDetail.mapinspectiondept[0].deptname:'、' + item.deptname}}
							</block>
							<block v-if="!inspectionDetail.mapinspectiondept.length">未指定部门</block>
						</view>
					</view>
					<view class="detail-item">
						<view class="item">通知人员</view>
						<view class="content">
							<block v-for="(item,index) of inspectionDetail.mapinspectionuser" :key="index" v-if="inspectionDetail.mapinspectionuser.length">
								{{index == 0?inspectionDetail.mapinspectionuser[0].username:'、' + item.username}}
							</block>
							<block v-if="!inspectionDetail.mapinspectionuser.length">未指定人员</block>
						</view>
					</view>
					<block v-if="!inspectionDetail.feedback">
						<view class="detail-item">
							<view class="item">具体位置</view>
							<view class="content">{{inspectionDetail.inspectionplace}}</view>
						</view>
						<view class="detail-item">
							<view class="item">巡检归属</view>
							<view class="content">{{inspectionDetail.typedesc}}</view>
						</view>
					</block>
					<view class="solve" v-if="inspectionDetail.feedback" @click="openUnderPopup()">确认已解决</view>
				</view>
				<view class="module image" v-if="inspectionDetail.loginspectionimg.length">
					<view class="head">
						<view class="title">图片</view>
						<view class="number">共{{inspectionDetail.loginspectionimg.length}}张</view>
					</view>
					<view class="image-list">
						<view class="image" v-for="(item,index) of inspectionDetail.loginspectionimg" :key="index" @tap.stop="previewImage(inspectionDetail.loginspectionimg,index)">
							<image :src="item.imgurl" mode="widthFix" class="icon"></image>
						</view>
					</view>
				</view>
				<view class="module reply" v-if="inspectionDetail.loginspectionquestion.length">
					<view class="head">
						<view class="title">回复记录</view>
						<view class="number">共{{inspectionDetail.loginspectionquestion.length}}条</view>
					</view>
					<view class="question-view">
						<view class="question-list" v-if="inspectionDetail.loginspectionquestion.length">
							<view class="question-item item-none" v-for="(item,index) of inspectionDetail.loginspectionquestion" :key="index"
							 @tap.stop="lookReplay(item)">
								<view class="li li-top">
									<view class="sender">{{item.deptname + ' - ' + item.username}}</view>
									<view class="send-timer">{{moment(item.insertdate.replace(/-/g, "/")).format("MM-DD hh:mm:ss")}}</view>
								</view>
								<view class="li reason">
									<view class="left">说明</view>
									<view class="content">{{item.reason}}</view>
								</view>
								<view class="li li-imgs" v-if="item.loginspectionquestionimg.length">
									<view class="img-view" v-for="(itm,ind) of item.loginspectionquestionimg" :key="ind" @tap.stop="previewImage(item.loginspectionquestionimg,ind)">
										<image class="icon" :src="itm.imgurl + setting.OSSDownload" mode="widthFix"></image>
									</view>
								</view>
								<view class="reply-view">
									<view class="number">{{item.loginspectionanswers.length == 0?'暂无讨论':`${item.loginspectionanswers.length}条`}}</view>
									<view class="reply-button">{{inspectionDetail.feedback?'讨论':'查看'}}</view>
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
		<view class="replay-btn" @click="openFeedbackPopup()" v-if="inspectionDetail && inspectionDetail.feedback">回复</view>
		<uni-popup ref="feedback" type="bottom" :maskClick="false">
			<view class="popup feedback top">
				<view class="title">
					<text class="content">回复</text>
					<view class="close" @click="$refs['feedback'].close()">关闭</view>
				</view>
				<view class="textarea-view">
					<textarea class="remark" fixed auto-height maxlength="500" placeholder-style="color:#B6C6D6;" placeholder="请输入说明"
					 v-model="remark" />
					</view>
				<view class="bottom-control">
					<view class="imgage-list">
						<view class="image" v-for="(item,index) of tempFilePaths" :key="index" @click="tempFilePaths.splice(index,1)">
							<image class="icon" :src="item" mode="widthFix"></image>
						</view>
						<view class="choose-imgage" @click="chooseImgage()">
							<image class="icon" src="@/static/icon/add_img.svg" mode="widthFix"></image>
						</view>
					</view>
					<view class="content">
						<view class="item" @click="getFeedBack()">
							<u-loading :show="sendFeedBackLoading" mode="circle" size="30"></u-loading>
							{{sendFeedBackLoading?'':'提交'}}
						</view>
					</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="lookover" type="bottom">
			<view class="popup lookover top">
				<view class="title">
					<text class="content">撤回巡检 - 已查看人员</text>
					<view class="close" @click="$refs['lookover'].close()">关闭</view>
				</view>
				<view class="look-list">
					<view class="item" v-for="(item,index) of lookList" :key="index">{{item.deptname}} - {{item.username}}</view>
				</view>
				<view class="bottom-control">
					<view class="content">
						<view class="item" @click="setQuestionWidthdraw()">撤回</view>
					</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="confirmSolve" type="bottom">
			<view class="popup confirmSolve top">
				<view class="title">
					<text class="content">确认已解决</text>
					<view class="close" @click="$refs['confirmSolve'].close()">关闭</view>
				</view>
				<view class="view-title">具体位置</view>
				<input type="text" class="place" v-model="place" placeholder="请输入位置描述" placeholder-style="color:#B6C6D6;">
				<view class="view-title">巡检归属</view>	
				<view class="under-view">
					<view class="under-select-view">
						<block v-if="underActiveList.length">
							<view class="item" v-for="(item,index) of underActiveList" :key="index" @click="underTabbarSelect(item,index)">{{item.select?item.item.name:'未选择'}}</view>
						</block>
						<block v-else>
							<view class="item">未选择</view>
						</block>
					</view>
					<scroll-view scroll-y class="under-list">
						<view :class="['item',item.select?'active':'']" v-for="(item,index) of underActiveList.length?underActiveList[underActiveList.length - 2].children:underList" :key="index" @click="underSelect(underActiveList.length?index:item)">
							<view class="content">{{item.item.name}}</view>
							<view class="check" v-if="item.select"><u-icon name="checkbox-mark"></u-icon></view>
						</view>
					</scroll-view>
				</view>
				<view class="bottom-control">
					<view class="content">
						<view class="item" @click="questionResolved()">
							<u-loading :show="sendResolvedLoading" mode="circle" size="28"></u-loading>
							{{sendResolvedLoading?'':'提交'}}
						</view>
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
				inspectionlogid:'',
				// 巡检明细
				inspectionDetail:null,
				getDataRefresherLoading:false,
				remark:'',
				// 待上传图片列表
				tempFilePaths:[],
				// 上传成功的有效已选择的图片
				successUploadFileImages:[],
				// 讨论上传loading
				sendFeedBackLoading:false,
				// 搜索已查看巡检人员loading
				searchLookListLoading:false,
				// 发送已解决请求loading
				sendResolvedLoading:false,
				// 位置描述
				place:'',
				// 查看过此巡检的人
				lookList:[],
				// 巡检归属源列表
				underList:[],
				// 巡检归属已选择的列表
				underActiveList:[]
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
			// 确认巡检问题已解决
			async questionResolved(){
				if(!this.underActiveList.length || !this.underActiveList[this.underActiveList.length - 1].select || this.underActiveList[this.underActiveList.length - 1].children.length){
					uni.showToast({
						icon:'none',
						title:"请选择巡检归属",
						duration:3000
					})
					return;
				}
				if(this.sendResolvedLoading) return
				try{
					let typedesc = [];
					this.underActiveList.forEach(i=>{
						typedesc.push(i.item.id)
					})
					this.sendResolvedLoading = true
					let data = await uni.request({
						method: 'POST',
						url: this.api.store_questionResolved,
						data:{
							inspectionlogid:this.inspectionlogid,
							inspectionid:this.underActiveList[this.underActiveList.length - 1].item.id,
							usernumber:this.userinfo.usernumber,
							typedesc,
							place:this.place
						}
					})
					this.sendResolvedLoading = false
					let [err,success] = data;
					console.log('确认巡检问题已解决------>>>',err,success)
					if (!err && success.data.success) {
						uni.showToast({
							title: '此巡检已确认解决',
							icon: 'none'
						});
						await this.getInspectionDetail();
						this.$refs['confirmSolve'].close()
					}else{
						uni.showToast({
							title: err?err:success.data.errmsg,
							icon: 'none',
							duration:3000
						});
					}
				}catch(e){
					this.sendResolvedLoading = false
					console.log(e)
				}
			},
			// 返回上一页并更新
			UpdateNavigationBack() {
				this.$store.state.storeshop.tabbarIndex == 0?this.$store.state.storeshop.tabbarIndex = 2:this.$store.state.storeshop.tabbarIndex = 0
				uni.navigateBack()
			},
			// 选择巡检归属tabbar
			underTabbarSelect(item,index){
				if(item.select && item.children.length){
					if(this.underActiveList.slice(0,index).length){
						this.underActiveList = this.underActiveList.slice(0,index);
						this.underActiveList.push({
							select:false,
							children:[]
						})
						this.resetUnderList(this.underActiveList[this.underActiveList.length - 2].children)
					}else{
						this.underActiveList = []
					}
				}
			},
			// 选择巡检归属
			underSelect(item){
				if(this.underActiveList.length){
					this.resetUnderList(this.underActiveList[this.underActiveList.length - 2].children)
					let data = this.underActiveList[this.underActiveList.length - 2].children[item]
					data.select = true;
					this.underActiveList.pop()
					this.underActiveList.push(data)
					if(data.children.length){
						this.underActiveList.push({
							select:false,
							children:[]
						})
					}
				}else{
					this.underList.forEach(i=>{i.select = false})
					item.select = true;
					this.underActiveList.push(item)
					if(item.children.length){
						this.underActiveList.push({
							select:false,
							children:[]
						})
					}
				}
				this.$forceUpdate()
				console.log('已选中巡检归属--->>>',this.underActiveList)
			},
			// 修改巡检归属已选中数组
			changeUnderActiveList(list){
				if(list.filter(item=> item.select).length){
					this.underActiveList.push(list.filter(item=> item.select)[0])
					if(list.filter(item=> item.select)[0].children.length){
						this.changeUnderActiveList(list.filter(item=> item.select)[0].children)
					}
				}
			},
			// 选择列表归属
			selectUnserItem(item){
				item.select = true;
				this.changeUnderActiveList([item])
			},
			// 格式化巡检归属列表
			resetUnderList(list){
				for(let item of list){
					item.select = false
					if(item.children.length) this.resetUnderList(item.children)
				}
			},
			// 打开解决popup
			openUnderPopup(){
				this.place = ''
				this.resetUnderList(this.underList)
				this.underActiveList = []
				this.$refs['confirmSolve'].open()
			},
			// 提出巡检问题打开popup
			openFeedbackPopup() {
				this.$refs['feedback'].open()
				this.remark = ''
				this.tempFilePaths = []
				this.successUploadFileImages = []
				this.sendFeedBackLoading = false
			},
			// 查看图片
			previewImage(list,index){
				uni.previewImage({
					current: index,
					urls: list.filter(item=> item.imgurl).map(item=> item.imgurl)
				});
			},
			// 请求归属列表
			async getUderList(){
				try{
					let data = await uni.request({
						url: this.api.store_getUderList
					})
					let [err,success] = data;
					console.log('归属列表请求成功------>>>',err,success)
					if (!err && success.data.success) {
						this.underList = success.data.data.menu
						this.resetUnderList(this.underList)
					}else{
						uni.showToast({
							title: err?err:success.data.errmsg,
							icon: 'none',
							duration:3000
						});
					}
				}catch(e){
					console.log(e)
				}
			},
			// 发送巡检撤回请求
			async setQuestionWidthdraw(){
				try{
					let data = await uni.request({
						url: this.api.store_questionWidthdraw,
						data:{
							id:this.inspectionlogid,
							usernumber:this.userinfo.usernumber
						}
					})
					let [err,success] = data;
					console.log('发送巡检撤回请求成功------>>>',err,success)
					if (!err && success.data.success) {
						uni.showToast({
							title: '撤回成功',
							icon: 'none',
							duration: 1000
						});
						uni.navigateBack()
						this.$store.state.storeshop.tabbarIndex == 0?this.$store.state.storeshop.tabbarIndex = 2:this.$store.state.storeshop.tabbarIndex = 0
					}else{
						uni.showToast({
							title: err?err:success.data.errmsg,
							icon: 'none',
							duration:3000
						});
					}
				}catch(e){
					console.log(e)
				}
			},
			// 查询那些人查看过此问题
			async searchLookList(){
				if(this.searchLookListLoading) return
				try{
					this.searchLookListLoading = true
					let data = await uni.request({
						url: `${this.api.store_getLookList}${this.inspectionlogid}`
					})
					this.searchLookListLoading = false
					let [err,success] = data;
					console.log('查询那些人查看过此问题------>>>',err,success)
					if (!err && success.data.success) {
						this.lookList = success.data.data.viewlog;
						if(this.lookList.length){
							this.$refs['lookover'].open()
						}else{
							uni.showModal({
								title: "确认撤回？",
								success: (res) => {
									if (res.confirm) {
										this.setQuestionWidthdraw()
									}
								}
							})
						}
					}else{
						uni.showToast({
							title: err?err:success.data.errmsg,
							icon: 'none',
							duration:3000
						});
					}
				}catch(e){
					this.searchLookListLoading = false
					console.log(e)
				}
			},
			// 选择图片
			chooseImgage(){
				let _this = this;
				uni.chooseImage({
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
							url: _this.api.uploadImage,
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
			// 是否可以回复和讨论
			feedbackFilter() {
				let _this = this;
				let feedback = (function(){
					// 通知部门
					for(let dept of _this.inspectionDetail.mapinspectiondept){
						if (_this.userinfo.deptlist.filter(i => i.deptid == dept.deptid).length) return true;
					}
					// 通知人员
					for(let user of _this.inspectionDetail.mapinspectionuser){
						if (user.usernumber == _this.userinfo.usernumber) return true;
					}
					// 上传人
					if(_this.inspectionDetail.usernumber == _this.userinfo.usernumber) return true
				}())
				// 巡检问题状态
				this.inspectionDetail.feedback = (feedback && this.inspectionDetail.status == 0)?true:false
			},
			// 卖场巡检获取明细
			async getInspectionDetail(){
				try {
					uni.showNavigationBarLoading()
					let data = await uni.request({
						url: this.api.store_getQuestionDetail,
						data:{
							id:this.inspectionlogid,
							usernumber:this.userinfo.usernumber
						}
					})
					uni.hideNavigationBarLoading()
					let [err, success] = data
					console.log('卖场巡检获取明细--->>>',err, success)
					if (!err && success.data.success) {
						this.inspectionDetail = success.data.data.loginspection
						this.feedbackFilter()
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
			// 讨论回复
			async getFeedBack(){
				let _this = this;
				if(!this.remark){
					uni.showToast({
						icon:'none',
						title:"请输入说明",
						duration:3000
					})
					return;
				}
				if(this.sendFeedBackLoading) return;
				try{
					this.sendFeedBackLoading = true
					// 上传图片
					await this.uploadFileImage()
					// 生成上传图片列表
					let loginspectionquestionImg = [];
					this.successUploadFileImages.map(imgurl=>{
						loginspectionquestionImg.push({
							inspectionimgid:0,
							questionid:0,
							inspectionlogid:this.inspectionlogid,
							imgurl
						})
					})
					console.log('生成好的图片上传列表--->>>',loginspectionquestionImg)
					let data = await uni.request({
						method: 'POST',
						url: this.api.store_feedback,
						data:{
							loginspectionquestion:{
								questionid: 0,
								inspectionlogid: this.inspectionlogid,// 巡检记录的id
								reason: this.remark,
								remark: this.remark, // 说明
								insertdate: this.moment().format('YYYY-MM-dd hh:mm:ss'),
								userid: this.userinfo.userid,//登录人id
								username: this.userinfo.username,
								deptid: this.userinfo.deptid,//部门
								deptname: this.userinfo.deptname,//部门名称
								loginspectionquestionImg
							}
						}
					})
					let [err, success] = data
					this.sendFeedBackLoading = false
					console.log('整改回复结果--->>>',err, success)
					if (!err && success.data.success) {
						this.getInspectionDetail()
						this.$refs['feedback'].close()
					}else{
						uni.showToast({
							title: err?err:success.data.errmsg,
							icon: 'none',
							duration:3000
						});
					}
				}catch(e){
					console.log(e)
					this.sendFeedBackLoading = false
				}
			},
			// 进入反馈
			lookReplay(item) {
				uni.navigateTo({
					url: `../discuss/discuss?inspectionlogid=${item.inspectionlogid}&questionid=${item.questionid}`
				})
			},
		},
		onLoad(option) {
			this.inspectionlogid = option.inspectionlogid
			this.getInspectionDetail();
			this.getUderList()
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
							&.resolved {
								background: #7ED58C;
							}
							&.not-started {
								background: #d2d2d2;
							}
						}
						.center {
							flex: 2;
						}
						.right{
							font-weight:900;
							height:44rpx;
							line-height:44rpx;
							padding:0rpx 20rpx;
							display:flex;
							align-items:center;
							color:#1BA1F3;
							border-radius:10rpx;
							&:active{
								background:#f2f2f2;
							}
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
						&.inp-item {
							.content-list {
								.li {
									padding: 2rpx 0rpx;
								}
							}
						}
						&:first-child {
							padding-top: 30rpx;
						}
					}
					.solve{
						background: #D56C68;
						color: #fff;
						padding: 0 50rpx;
						line-height: 80rpx;
						text-align: center;
						border-radius: 10rpx;
						margin-top: 20rpx;
						transition: 300ms;
						&:active{
							opacity: 0.9;
							box-shadow: 0 10rpx 10rpx 0 rgba(0,0,0,0.3);
						}
					}
				}
				// 图片
				&.image{
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
					.image-list{
						display: flex;
						flex-wrap: wrap;
						padding: 20rpx;
						padding-bottom: 5rpx;
						.image{
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
							.icon{
								width: 100%;
								min-height: 100%;
								border-radius: 6rpx;
								background: #f2f2f2;
							}
						}
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
									&.reason{
										padding-bottom: 15rpx;
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
			padding-bottom: env(safe-area-inset-bottom);
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
			&.feedback{
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
						}
					}
				}
			}
			&.lookover{
				.look-list{
					display: flex;
					flex-wrap: wrap;
					.item{
						padding: 0 30rpx;
						min-height: 60rpx;
						margin-right: 15rpx;
						margin-bottom: 15rpx;
						background: #F3F5F7;
						color: #647685;
						text-align: center;
						font-size: 24rpx;
						border-radius: 6rpx;
						display: flex;
						align-items: center;
						justify-content: center;
					}
				}
				.bottom-control {
					padding: 20rpx 0;
					background: #fff;
					.content{
						flex: 2;
						min-width: 200rpx;
						.item {
							line-height: 60rpx;
							white-space: nowrap;
						}
					}
				}
			}
			&.confirmSolve{
				font-size: 30rpx;
				.view-title{
					padding: 20rpx 0rpx 10rpx 20rpx;
					color: #647484;
					font-weight: 800;
				}
				.place{
					height: 80rpx;
					color: #647484;
					background: #F3F5F7;
					border-radius: 10rpx;
					padding:0 20rpx;
				}
				.under-view{
					background: #F3F5F7;
					overflow: hidden;
					border-radius: 10rpx;
					.under-select-view{
						display: flex;
						align-items: center;
						// border-bottom: 2rpx solid #fff;
						.item{
							padding: 20rpx 30rpx;
							text-align: center;
							display: flex;
							align-items: center;
							justify-content: center;
							border-bottom: 4rpx solid #F3F5F7;
							font-size: 28rpx;
							&:active{
								background: rgba(0,0,0,0.1);
							}
							&:last-child{
								color: #D56C68;
								border-bottom: 4rpx solid #1BA1F3;
								font-weight: 800;
							}
						}
					}
					.under-list{
						height: 40vh;
						color: #647484;
						.item{
							border-bottom: 2rpx solid #fff;
							display: flex;
							align-items: center;
							font-size: 28rpx;
							padding: 20rpx;
							&:active{
								background: rgba(0,0,0,0.1);
							}
							.content{
								flex: 2;
							}
							.check{
								
							}
							&.active{
								font-weight: 800;
								background: rgba(0,0,0,0.1);
							}
						}
					}
				}
				.bottom-control {
					padding: 20rpx 0;
					background: #fff;
					.content{
						flex: 2;
						min-width: 200rpx;
						.item {
							line-height: 60rpx;
							white-space: nowrap;
						}
					}
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
