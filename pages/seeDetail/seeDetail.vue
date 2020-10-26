<!-- 权限判断：
	1.当前巡检状态
	2.当前登录人信息判断
	3.
 -->
<template>
	<view :class="['container fadeIn', infoDetail.deptname?'':'data-null']">
		<haoheao-scroll class="haoheao-scroll" ref="scroll" @onPullDown="onPullDown" @onScroll="onScroll" @onLoadMore="onLoadMore">
			<view class="replay-null" v-if="!infoDetail.deptname">
				<view class="none">
					<view class="txt">请下拉重新加载...</view>
					<view class="line"></view>
				</view>
			</view>
			<view class="module info">
				<view class="top-view">
					<view v-if="infoDetail.deptname && postThereTrue || status == 1" :class="['state', infoDetail.status?'resolved':'']" @click="changeStatus()">
						{{infoDetail.status?'已解决':'未解决'}}
					</view>
					<view class="center"></view>
					<view class="right-more" v-if="infoDetail.deptname && infoDetail.status == 0 && infoDetail.loginspectionquestion.length == 0 && usernumber == infoDetail.usernumber">
						<view class="more" @click="showMoreList()">
							<!-- <view class="more" @click="moreChoice(1)"> -->
							<!-- <view class="s">•</view>
							<view class="b">•</view>
							<view class="s">•</view> -->
							撤回
						</view>
						<!-- <view class="more-list" v-if="showMore">
							<view class="item">删除</view>
						</view> -->
					</view>
				</view>
				<!-- <view class="title">{{infoDetail.title}}</view> -->
				<view class="title">{{infoDetail.remark}}</view>
				<view class="line" v-if="infoDetail.deptname"></view>
				<view class="detail-item uploader">
					<view class="item">上传人</view>
					<view class="content">
						<block v-if="infoDetail.deptname">{{infoDetail.deptname+ '-' +infoDetail.username}}</block>
					</view>
				</view>
				<view class="detail-item date">
					<view class="item">巡查日期</view>
					<view class="content">{{infoDetail.insertdate}}</view>
				</view>
				<view class="detail-item department">
					<view class="item">通知部门</view>
					<view class="content" v-if="infoDetail.mapinspectiondept.length != 0">
						<text>{{infoDetail.mapinspectiondept[0].deptname}}</text>
						<text v-for="(item,index) of infoDetail.mapinspectiondept" :key="index" v-if="index != 0">{{'、' + item.deptname}}</text>
					</view>
					<view class="content" v-if="infoDetail.mapinspectiondept.length == 0">无通知部门</view>
				</view>
				<view class="detail-item person">
					<view class="item">通知人员</view>
					<view class="content" v-if="infoDetail.mapinspectionuser.length != 0">
						<text>{{infoDetail.mapinspectionuser[0].username}}</text>
						<text v-for="(item,index) of infoDetail.mapinspectionuser" :key="index" v-if="index != 0">{{'、' + item.username}}</text>
					</view>
					<view class="content" v-if="infoDetail.mapinspectionuser == 0">无通知人员</view>
				</view>
				<!-- <view class="detail-item describe" @click="copy(infoDetail.remark)">
					<view class="item">描述</view>
					<text class="content">{{infoDetail.remark}}</text>
				</view> -->
			</view>
			<view class="module picture" v-if="infoDetail.loginspectionimg.length">
				<view class="head">
					<view class="title">图片</view>
					<view class="number">共{{infoDetail.loginspectionimg.length}}张</view>
				</view>
				<view class="content">
					<view class="item" v-for="(item,index) of infoDetail.loginspectionimg" :key="index" @click="seePicture(infoDetail.loginspectionimg,index)">
						<image class="img" :src="item.imgurl + '?x-oss-process=image/resize,m_mfit,h_120,w_120'" mode="widthFix"></image>
					</view>
				</view>
			</view>
			<view class="module reply" v-if="infoDetail.loginspectionquestion.length">
				<view class="head">
					<view class="title">回复记录</view>
					<view class="number">共{{infoDetail.loginspectionquestion.length}}条</view>
				</view>
				<view class="content">
					<view class="item" v-for="(item,index) of infoDetail.loginspectionquestion" :key="index">
						<view class="top">
							<view class="person">{{item.deptname}} - {{item.username}}</view>
							<view class="date">{{item.insertdate}}</view>
						</view>
						<view class="question reason">
							<view class="title" v-if="item.remark">问题原因</view>
							<view class="title" v-if="!item.remark">说明</view>
							<text class="txt">{{item.reason}}</text>
						</view>
						<view class="question method" v-if="item.remark">
							<view class="title">处理方法</view>
							<text class="txt">{{item.remark}}</text>
						</view>
						<view class="picture-list" v-if="item.loginspectionquestionimg.length">
							<view class="item" v-for="(ite,ind) of item.loginspectionquestionimg" :key="ind" @click="seePicture(item.loginspectionquestionimg,ind)">
								<image class="img" :src="ite.imgurl + '?x-oss-process=image/resize,m_mfit,h_120,w_120'" mode="widthFix"></image>
							</view>
						</view>
						<view class="reply-view" v-if="infoDetail.status == 0">
							<view class="number" v-if="item.loginspectionanswers.length != 0">{{item.loginspectionanswers.length}}条讨论</view>
							<view class="number" v-if="item.loginspectionanswers.length == 0">暂无讨论</view>
							<view class="reply-text del-raply" @click="delReply(item)" v-if="userid == item.userid && status == 0 && item.loginspectionanswers.length == 0 && item.replyTime">撤回</view>
							<view class="reply-text" @click="lookReplay(item)" v-if="postThereTrue">进行讨论</view>
						</view>
						<view class="reply-view" v-if="infoDetail.status == 1 && item.loginspectionanswers.length != 0">
							<view class="number" v-if="item.loginspectionanswers.length != 0">{{item.loginspectionanswers.length}}条讨论</view>
							<view class="reply-text" @click="lookReplay(item)">查看讨论</view>
						</view>
					</view>
				</view>
			</view>
			<!-- off -->
			<view class="replay-null" v-if="infoDetail.loginspectionquestion.length == 0 && infoDetail.status == 0">
				<view class="none">
					<view class="txt">暂无问题回复</view>
					<view class="line"></view>
				</view>
			</view>
			<view class="replay-null" v-if="infoDetail.loginspectionquestion.length != 0">
				<view class="none">
					<view class="txt">没有更多记录</view>
					<view class="line"></view>
				</view>
			</view>
		</haoheao-scroll>
		<view v-show="infoDetail.status == 0 && postThereTrue" class="replay-btn" @click="thatReply()">回复</view>

		<uni-popup ref="popup" type="top" :maskClick="false">
			<!-- <view :class="['popup-reply', up?'top':'']"> -->
			<view class="popup-reply">
				<view class="title">说明</view>
				<view class="textarea-view">
					<textarea fixed="true" auto-height="true" adjust-position="false" class="input-view reason" maxlength="200"
					 placeholder-style="color:#B6C6D6;" value="" placeholder="请输入说明(200字以内)" v-model="reason" />
					</view>
				<!-- <view class="title">解决方法</view>
				<view class="textarea-view">
					<textarea fixed="true" auto-height="true" adjust-position="false" class="input-view solve" maxlength="200" placeholder-style="color:#B6C6D6;" value="" placeholder="请输入处理方法或建议(200字以内)" v-model="solve" />
				</view> -->
				<view class="control-view">
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
						<view class="btn reply-btn" @click="addReply()">回复</view>
					</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="status" type="top" :maskClick="false">
			<view class="status-select popup-reply">
				<view class="select-view">
					<view class="title">具体位置</view>
					<view class="select-input">
						<input type="text" class="input" placeholder="请输入位置描述" placeholder-style="color:#B6C6D6;" v-model="selectInputtxt">
					</view>
					<view class="title">选择巡检归属</view>
					<view class="select-picker">
						
						<view class="uni-input" v-for="(item,index) of trueUnder" :key="index" @click="clickUnder(item,index)">{{item.item.name}}</view>
						
					</view>
					<view class="picker-list">
						<view :class="['item',item.select?'active':'']" v-for="(item,index) of nowUnder" :key="index" @click="selectUnder(item,index)">{{item.item.name}} <view v-if="item.select" class="text">√</view> </view>
					</view>
				</view>
				<view class="control-view">
					<view class="control">
						<view class="select-img"></view>
						<view class="btn reply-close" @click="closed()">取消</view>
						<view class="btn reply-btn" @click="changeStatusConfirm()">确认已解决</view>
					</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="showMore" type="center">
			<view class="more-list" v-if="showMoreType == 1">
				<view class="item" @click="moreChoice(1)">撤回此巡检记录</view>
			</view>
			<view class="detail-look-list" v-if="showMoreType == 2">
				<view class="tip" v-if="detailLookList.length != 0">以下人员已查看过该巡检记录,您确定要撤回吗?</view>
				<view class="tip" v-if="detailLookList.length == 0">您确定要撤回吗?</view>
				<view class="look-list">
					<view class="item" v-for="(item,index) of detailLookList" :key="index">{{item.deptname}} - {{item.username}}</view>
				</view>
				<view class="choice">
					<view class="btn close" @click="closeMore()">取消</view>
					<view class="btn confirm" @click="drawInfo()">确认撤回</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	let app = getApp().$vm;
    let utils = require('@/util/utils.js');
    let request = utils.request;
	export default {
		data() {
			return {
				infoDetail: [],
				usernumber:uni.getStorageSync("userinfo").usernumber,
				userid:uni.getStorageSync("userinfo").userid,
				deptList: [],
				// 查看图片
				seeImgList: [],
				// 回复
				reason:"",
				solve:"",
				imgList:[],
				// 归属列表
				underList:[],
				underListArr:[],
				// 已选中
				trueUnder:[],
				// 已选中的最后一个下标
				underLastIndex:'',
				// 正在选择
				nowUnder:[],
				// 已选中列表下标
				selectIdList:[],
				// 描述
				selectInputtxt:'',
				
				// 重复提交
				btnClickReply:true,
				// 当前巡检记录哪些人看过
				detailLookList:[],
				// 当前更多操作显示的窗口
				showMoreType:1,
				
				// 操作权限判断
				postThereTrue:false,
				// 巡检单状态
				status:0,
				upImgList:[]
			}
		},
		methods: {
			// 复制内容
			copy:function(data){
				app.copy(data)
			},
			// 权限判断
			powerUser:function(data){
				console.log(data)
				let deptTrue = false,
					userTrue = false;
				// 当前登录人信息
				let userinfo = uni.getStorageSync("userinfo");
				this.status = data.status;
				// 发送的部门
				for(let item of data.mapinspectiondept){
					if(userinfo.deptid == item.deptid){
						this.postThereTrue = true;
					}
				}
				// 发送的人员
				for(let item of data.mapinspectionuser){
					if(userinfo.usernumber == item.usernumber){
						this.postThereTrue = true;
					}
				}
				// 是不是我
				if(data.usernumber == userinfo.usernumber){
					this.postThereTrue = true;
				}
			},
			// 确认撤回
			drawInfo:function(){
				let _this= this;
				uni.request({
					url:request.drawInfo,
					data:{
						id:_this.infoDetail.inspectionlogid,
						usernumber:uni.getStorageSync("userinfo").usernumber
					}
				}).then(data=>{
					let [err,res] = data;
					console.log("确认撤回巡检反回信息:",err,res)
					if(err == null && res.data.success){
						uni.showToast({
							icon:"none",
							title:"成功撤回此巡检!",
							duration:3000
						})
						uni.navigateBack({delta:1});
					}else{
						uni.showToast({
							icon:"none",
							title:"撤回巡检失败," + err.errMsg,
							duration:3000
						});
					}
					_this.showMoreType = 2;
					this.$refs['showMore'].close()
				})
			},
			closeMore:function(){
				this.$refs['showMore'].close();
				this.showMoreType = 2;
			},
			showMoreList:function(){
				this.showMoreType = 2;
				this.moreChoice(1)
				this.$refs['showMore'].open();
			},
			// 更多操作选择
			moreChoice:function(type){
				let _this = this;
				if(type == 1){
					uni.showLoading({
						title:"请稍后..."
					});
					uni.request({
						url:request.getDetailLook + _this.infoDetail.inspectionlogid
					}).then(data=>{
						let [err,res] = data;
						uni.hideLoading();
						if(err == null && res.data.success){
							console.log("当前巡检记录谁查看过：",err,res);
							_this.detailLookList = res.data.data.viewlog;
							_this.showMoreType = 2;
						}else{
							_this.showMoreType = 2;
							uni.showToast({
								icon:"none",
								title:"查询失败," + err.errMsg,
								duration:3000
							})
						}
					})
				}
				// this.$refs['showMore'].close();
			},
			// 确认巡检单
			changeStatusConfirm:function(){
				let _this = this,
					trueUnder = this.trueUnder,
					nowUnder = this.nowUnder;
					
				if(trueUnder[trueUnder.length - 1].item.name == '未选择'){
					uni.showToast({
						icon:"none",
						title:"请选择巡检归属！"
					})
					return;
				}
				let typedesc = [];
				for(let item of trueUnder){
					typedesc.push(item.item.id);
				}
				let data = {
					// 确认巡检
					inspectionlogid:this.infoDetail.inspectionlogid,
					inspectionid:trueUnder[trueUnder.length - 1].item.id,
					usernumber:uni.getStorageSync("userinfo").usernumber,
					typedesc,
					place:this.selectInputtxt
				};
				console.log("确认巡检单：",data)
				uni.request({
					url:request.changeStatus,
					method:"POST",
					data
				}).then(data=>{
					let [err,res] = data;
					console.log(err,res)
					if(err == null && res.data.success){
						uni.showToast({
							icon:"none",
							title:"巡检单已确认！"
						})
						_this.$refs['status'].close()
					}else{
						uni.showToast({
							icon:"none",
							title:res.data.errmsg
						})
						_this.$refs['status'].close()
					}
					this.getDetail(_this.detail_id);
				})
			},
			// 归属已选择的点击
			clickUnder:function(item,index){
				let trueUnder = this.trueUnder,
					nowUnder = this.nowUnder,
					nulldata = {item:{name:"未选择"}};
				console.log(item,index,trueUnder)
				trueUnder = trueUnder.splice(0,index + 1)
				if(!index){
					trueUnder = [];
					trueUnder.push(nulldata)
					nowUnder = this.underList;
					let arr = [];
				}
				if(trueUnder[index - 1]){
					console.log(trueUnder[index - 1])
					if(trueUnder[index - 1].children){
						nowUnder = trueUnder[index - 1].children
					}
				}
				// if(item.children.length){
				// 	nowUnder = item.children
				// }
				this.trueUnder = trueUnder
				this.nowUnder = nowUnder
			},
			// 归属正在选择的点击
			selectUnder:function(item,index){
				let trueUnder = this.trueUnder,
					nowUnder = this.nowUnder,
					nulldata = {item:{name:"未选择"}},
					underLastIndex = this.underLastIndex;
				console.log(item,index,trueUnder,nowUnder)
				if(item.children){
					// 是不是未选择
					for(let item of nowUnder){
						item.select = false;
					}
					nowUnder[index].select = true;
					if(item.children.length){
						trueUnder.pop();
						trueUnder.push(item);
						trueUnder.push(nulldata);
						nowUnder = item.children
					}else{
						trueUnder.pop();
						trueUnder.push(item);
						underLastIndex = item.item;
						
						// nowUnder = item.children
					}
				}else{
					
				}
				this.trueUnder = trueUnder
				this.nowUnder = nowUnder
				console.log(this.trueUnder,this.nowUnder)
			},
			// 获取解决归属
			getUnder:function(){
				let _this = this;
				uni.request({
					url:request.getUder,
					method:"GET"
				}).then(data=>{
					let [err,res] = data;
					console.log("归属列表",err,res)
					_this.underList = res.data.data.menu;
					let arr = [],
						datanull = [{item:{name:"未选择"}}];
					for(let item of res.data.data.menu){
						arr.push(item)
					}
					_this.nowUnder = arr;
					_this.trueUnder = datanull;
				})
			},
			closed:function(){
				this.$refs['status'].close()
			},
			// 获取巡检单详细信息
			getDetail: function(id) {
				let _this = this;
				request.getDetail({
					id,
					usernumber:uni.getStorageSync("userinfo").usernumber
				})
				.then(data => {
					let [err, res] = data;
					console.log("巡检单详细信息",err,res)
					if(err == null && res.data.success){
						let reply = res.data.data.loginspection.loginspectionquestion;
						for(let item of reply){
							if(new Date().getTime() - new Date(item.insertdate).getTime() > 86400000){
								item.replyTime = false
							}else{
								item.replyTime = true
							}
						}
						this.infoDetail = res.data.data.loginspection;
						// 权限判断
						_this.powerUser(res.data.data.loginspection)
					}else{
						uni.showToast({
							icon: "none",
							duration:2500,
							title: "查找失败:" + err.errMsg
						})
					}
					
				})
			},
			// 每一条回复内容时间判断
			replyTimeIs:function(data){
				console.log(data)
			},
			// 进入讨论
			lookReplay: function(item) {
				uni.navigateTo({
					url: '../viewQuestion/viewQuestion?data=' + JSON.stringify(item) + '&id=' + item.inspectionlogid + '&reply_id=' + item.questionid + '&postThereTrue=' + this.postThereTrue + '&previs=false'
				})
			},
			// 撤回巡检
			delReply:function(item){
				let _this = this;
				console.log(item)
				uni.showModal({
					content:"您确定要撤回此回复吗?",
					success:(res)=>{
						if(res.confirm){
							uni.request({
								url:request.drawInfoReply + item.questionid
							}).then(data=>{
								let [err,res] = data;
								console.log("撤回回复返回信息：",err,res);
								if(err == null && res.data.success){
									uni.showToast({
										icon: "none",
										title: "撤回成功"
									})
								}else{
									uni.showToast({
										icon: "none",
										title: "撤回成功"
									})
								}
								this.getDetail(this.detail_id);
							})
						}
					}
				})
			},
			onPullDown(done) { // 下拉刷新
				this.getDetail(this.detail_id);
				this.getUnder()
				console.log("下拉刷新")
				setTimeout(() => {
					done();
				}, 1000)
			},
			onScroll(e) { // 监听滚动
				// console.log(e)
				// console.log(e.detail.scrollTop)
			},
			onLoadMore(e) { // 加载更多
				// console.log("加载更多", e)
			},
			change(e) {
				if(!e.show){
					this.reason = "";
					this.solve = "";
					this.imgList = [];
				}
			},
			thatReply:function(){
				this.$refs['popup'].open()
			},
			thatReplyClose:function(){
				this.reason = "";
				this.solve = "";
				this.imgList = [];
				this.$refs['popup'].close()
			},
			addImg:function(){
				utils.addImg(this);
			},
			delImg:function(index){
				utils.delImg(index,this);
			},
			// 添加回复
			addReply:function(){
				if(!this.btnClickReply){return;}
				this.btnClickReply = false;
				let reason = this.reason,
					solve = this.solve,
					upImgList = this.upImgList,
					_this = this;
				if(reason == ''){
					uni.showToast({
						icon:"none",
						title:"请填写问题原因"
					})
					this.btnClickReply = true;
					return;
				}
				// if(solve == ''){
				// 	uni.showToast({
				// 		icon:"none",
				// 		title:"请填写处理方法"
				// 	})
				// 	this.btnClickReply = true;
				// 	return;
				// }
				let data = {
					 //讨论
					loginspectionquestion:{
						questionid: 0,
						inspectionlogid: this.infoDetail.inspectionlogid,//巡检记录的id
						reason: reason, //问题原因
						remark: solve, //解决方法
						insertdate: "",
						userid: uni.getStorageSync("userinfo").userid,//登录人id
						username: uni.getStorageSync("userinfo").username,
						deptid: uni.getStorageSync("userinfo").deptid,//部门
						deptname: uni.getStorageSync("userinfo").deptname,//部门名称
						loginspectionquestionImg:[
							// {
								// "inspectionimgid":0,
								// "questionid":0,
								// "inspectionlogid":1,
								// "imgurl"
							// },
						]
					}
				}
				for(let item of upImgList){
					let obj = {
						inspectionimgid:0,
						questionid:0,
						inspectionlogid:1,
						imgurl:item.path
					}
					data.loginspectionquestion.loginspectionquestionImg.push(obj)
				}
				console.log("回复参数:",data);
				console.log("回复参数JSON:",JSON.stringify(data));
				uni.request({
					url:request.saveQiestion,
					method:"POST",
					data
				})
				.then(data=>{
					let [err,res] = data;
					console.log("回复内容返回:",res)
					if(err == null && res.data.success){
						_this.getDetail(_this.detail_id);
						_this.thatReplyClose();
					}else{
						uni.showToast({
							icon:"none",
							title:"回复失败！"
						})
					}
					this.btnClickReply = true;
				})
			},
			// 查看图片
			seePicture:function(list,index){
				utils.seePicture(list,index);
			},
			changeStatus:function(){
				if(this.infoDetail.status == 0){
					this.$refs['status'].open()
				}
			}
		},
		onLoad(option) {
			this.detail_id = option.id;
			console.log("巡检ID:",option)
		},
		onShow:function(){
			console.log("seeDetail onShow")
			this.getUnder()
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
			margin-top:20rpx;
			padding-bottom: 20rpx;

			.top-view {
				margin: 20rpx 10rpx;
				margin-left: 0;
				margin-top: 0;
				display:flex;
				just-content:flex-start;
				align-items:center;

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
				.center{
					flex:2;
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
				font-size: 24rpx;

				.item {
					color: #C2C4C6;
					width: 110rpx;
					min-width: 110rpx;
				}

				.content {
					color: #323436;
					width: 100%;
					// overflow: hidden;
					// text-overflow: ellipsis;
					// white-space: nowrap;
				}
			}
			.detail-item.describe{
				&:active{
					background:#f9f9f9;
					border-radius:5rpx;
				}
			}

			.detail-item:first-child {
				padding-top: 30rpx;
			}
		}

		.module.picture,
		.module.reply {
			padding-bottom: 10rpx;

			.head {
				display: flex;
				padding: 30rpx 0rpx;
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
		}

		// 图片
		.module.picture {
			.content {
				padding: 20rpx 0rpx;
				padding-bottom: 0;
				display: flex;
				flex-wrap: wrap;

				.item {
					border-radius: 6rpx;
					background: #F3F5F7;
					width: 120rpx;
					height: 120rpx;
					overflow: hidden;
					margin-right: 15rpx;
					margin-bottom: 15rpx;

					.img {
						width: 100%;
						min-height: 100%;
					}
				}
			}
		}

		// 回复
		.module.reply {
			margin-bottom:50rpx;
			.content {
				.item {
					margin-bottom:50rpx;
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

					// 回复
					.reply-view {
						display: flex;
						align-items: center;
						padding: 20rpx 0rpx;

						.number {
							color: #1BA1F3;
							font-size: 22rpx;
							flex: 2;
						}

						.reply-text {
							width: 130rpx;
							height: 48rpx;
							line-height: 48rpx;
							text-align: center;
							color: #1BA1F3;
							border: 1rpx solid #1BA1F3;
							font-size: 22rpx;
							border-radius: 24rpx;

							&:active {
								background: #1BA1F3;
								color: #fff;
							}
						}
						.reply-text.del-raply{
							border:0;
							width:auto;
							height:20rpx;
							line-height:20rpx;
							padding:8rpx 20rpx;
							border-radius:6rpx;
							margin-right:20rpx;
							
							&:active{
								background:#f2f2f2;
								color:#333;
							}
						}
					}
				}

				.item:last-child {
					margin-bottom:0;
					border: 0;
				}

			}
		}

		// 没有更多记录
		.replay-null {
			width: 100%;
			margin-bottom:140rpx;

			.none {
				width: 100%;
				height: 20rpx;
				margin: 40rpx 0rpx;
				position: relative;

				.txt {
					width: auto;
					height: 20rpx;
					white-space: nowrap;
					line-height: 20rpx;
					text-align: center;
					position: absolute;
					left: calc(50% - 78rpx);
					top: 0rpx;
					z-index: 2;
					padding:0rpx 20rpx;
					background: #E5EDF1;
					color: #B6C6D6;
					font-size: 20rpx;
				}

				.line {
					width: 310rpx;
					height: 1rpx;
					background: #B6C6D6;
					position: absolute;
					left: calc(50% - 145rpx);
					top: 10rpx;
					z-index: 1;
				}
			}
		}

		// 对此记录进行回复
		.replay-btn {
			width: calc(100% - 40rpx);
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			margin: 10rpx 20rpx;
			border-radius: 40rpx;
			color: #fff;
			background: #647484;
			font-size: 28rpx;
			position: fixed;
			left: 0;
			bottom: 10rpx;
			z-index: 998;
			margin-bottom: env(safe-area-inset-bottom);
			opacity: 0.9;
			letter-spacing:10rpx;

			&:active {
				opacity: 0.8;
			}
		}
	}
	// 弹出层
	.popup-reply{
		background:#fff;
		width:100%;
		padding:30rpx;
		padding-bottom:0;
		// padding-bottom: env(safe-area-inset-bottom);
		box-sizing:border-box;
		border-bottom-left-radius:10rpx;
		border-bottom-right-radius:10rpx;
		
		.title{
			height:38rpx;
			color:#647484;
			font-size:26rpx;
			font-weight:800;
			padding:20rpx 0rpx 10rpx 20rpx;
		}
		.textarea-view{
			width:100%;
			box-sizing:border-box;
			background:#F3F5F7;
			border-radius:10rpx;
			padding:26rpx 20rpx;
			
			.input-view{
				border-radius:10rpx;
				width:100%;
				min-height:126rpx;
				font-size:26rpx;
			}
		}
		.input-view{
			border-radius:10rpx;
			width:100%;
			min-height:126rpx;
			font-size:26rpx;
		}
		.solve{
			height:110rpx;
		}
		.control-view{
			width:100%;
			height:80rpx;
			// box-sizing:border-box;
			display:flex;
			align-items:center;
			padding: 20rpx 0rpx;
			
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
					position:relative;
					
					.del{
						position:absolute;
						right:-8rpx;
						top:-8rpx;
						width:20rpx;
						height:20rpx;
						line-height:20rpx;
						text-align:center;
						border-radius:50%;
						overflow:hidden;
						background:#C1C7CE;
						color:#fff;
						font-size:14rpx;
						box-shadow:0rpx 0rpx 10rpx -1rpx rgba(0,0,0,0.9);
						// display:none;
					}
					&:active .del{
						display:block;
						background:red;
					}
					
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
	
	// 归属
	.status-select.popup-reply{
		width:100vw;
		min-height:100vh;
		background:#fff;
		padding:30rpx;
		box-sizing:border-box;
		border-bottom-left-radius:10rpx;
		border-bottom-right-radius:10rpx;
		.select-view{
			.title{
				height:38rpx;
				color:#647484;
				font-size:26rpx;
				font-weight:800;
				padding:20rpx 0rpx 10rpx 20rpx;
			}
			.select-input{
				.input{
					width:100%;
					height:80rpx;
					box-sizing:border-box;
					background:#F3F5F7;
					border-radius:10rpx;
					font-size:26rpx;
					padding-left:20rpx;
				}
			}
			.select-picker{
				padding-bottom:0;
				border-radius:10rpx;
				background:#F3F5F7;
				border-radius:10rpx;
				color:#647484;
				display:flex;
				align-items:center;
				flex-wrap: wrap;
				
				.uni-input{
					height:75rpx;
					line-height:80rpx;
					border-bottom:5rpx solid #A3D9FA;
					margin-right:30rpx;
					padding:0rpx 20rpx;
				
					&:active{
						background:#f9f9f9;
					}
				}
				.uni-input:last-child{
					color:red;
					font-weight:800;
				}
			}
			.picker-list{
				width:100%;
				height:auto;
				max-height:66vh;
				overflow-x:scroll;
				background:#F3F5F7;
				.item{
					height:70rpx;
					line-height:70rpx;
					color:#647484;
					display:flex;
					align-items:center;
					padding-left:20rpx;
					border-bottom:1rpx solid #fff;
				
					&:active{
						opacity:0.9;
					}
					.text{
						flex: 2;
						text-align:right;
						padding-right:20rpx;
					}
				}
				.item:last-child{
					border:0;
				}
				.item.active{
					color:red;
					font-weight:800;
				}
			}
		}
		// .control{
		// 	position:fixed;
		// 	left:0;
		// 	bottom:0;
		// 	z-index: 2;
		// 	width:100%;
		// 	display: flex;
		// 	align-items:center;
		// 	.btn{
		// 		width: 50%;
		// 		height:100rpx;
		// 		text-align:center;
		// 		line-height:100rpx;
		// 		font-size:30rpx;
		// 		&:active{
		// 			opacity:0.9;
		// 		}
		// 	}
		// 	.btn.close{
		// 		background:#f2f2f2;
		// 		color:#999;
		// 	}
		// 	.btn.confirm{
		// 		background:#333;
		// 		color:#fff;
		// 	}
		// }
		
		
		
		.control-view{
			width:100%;
			display:flex;
			align-items:center;
			padding:0;
			height:auto;
			padding-top:20rpx;
			
			.img-list{
				max-width:100rpx;
			}
			
			.control{
				display:flex;
				align-items: center;
				margin-left:30rpx;
				flex:2;
				.select-img{
					flex:2;
				}
				.btn{
					padding-left:20rpx;
					padding-right:20rpx;
				}
			}
		}
		.select-control{
			margin-bottom: env(safe-area-inset-bottom);
		}
	}
	.container.data-null{
		.detail-item {
			.content{
				background:#f2f2f2;
				border-radius:10rpx;
			}
		}
	}
	.right-more{
		position:relative;
		.more{
			font-weight:900;
			height:44rpx;
			line-height:44rpx;
			padding:0rpx 20rpx;
			display:flex;
			align-items:center;
			color:#1BA1F3;
		
			&:active{
				background:#f2f2f2;
				border-radius:10rpx;
			}
			.s.b{
				height:44rpx;
				line-height:44rpx;
			}
			.s{
				font-size:28rpx;
			}
			.b{
				font-size:42rpx;
				padding:0rpx 2rpx;
			}
		}
		// .more-list{
		// 	position:absolute;
		// 	top:50rpx;
		// 	right:0;
		// 	z-index:999;
		// 	background:rgba(0,0,0,0.6);
		// 	border-radius:10rpx;
		// 	width:130rpx;
		// 	color:#fff;
		// 	// box-shadow: 0rpx 0rpx 15rpx -5rpx;
		// 	.item{
		// 		width:100%;
		// 		height:60rpx;
		// 		line-height:60rpx;
		// 		font-size:26rpx;
		// 		text-align: center;
		// 	}
		// }
	}
	.more-list{
		border-radius:10rpx;
		overflow:hidden;
		background:#fff;
		font-size:28rpx;
		font-weight:600;
		
		.item{
			width:500rpx;
			height:100rpx;
			line-height:100rpx;
			text-align:left;
			padding-left:40rpx;
			color:#333;
			border-bottom:1rpx solid #f9f9f9;
			
			&:active{
				backgorund:#f2f2f2;
				opacity:0.9;
			}
		}
		.item:last-child{
			border:0;
		}
	}
	.detail-look-list{
		border-radius:10rpx;
		overflow:hidden;
		background:#fff;
		font-size:28rpx;
		font-weight:600;
		width:540rpx;
		box-sizing:border-box;
		
		.tip{
			// width:calc(100% - 40rpx);
			padding:40rpx 40rpx;
			font-weight:700;
			border-bottom:2rpx solid #f9f9f9;
			// box-sizing:border-box;
		}
		
		.look-list{
			width:100%;
			// max-height:500rpx;
			max-height:700rpx;
			overflow-y:scroll;
			
			.item{
				padding:10rpx 40rpx;
				font-size:26rpx;
				color:#666;
			}
		}
		
		.choice{
			width:100%;
			height:100rpx;
			border-top:2rpx solid #f9f9f9;
			display:flex;
			
			.btn{
				width:50%;
				line-height:100rpx;
				box-sizing:border-box;
				border-right:2rpx solid #f9f9f9;
				text-align: center;
			}
			.btn.confirm{
				font-weight:700;
				
				&:active{
					background:#f2f2f2;
					opacity:0.9;
				}
			}
			.btn:last-child{
				border:0;
			}
		}
	}
</style>
