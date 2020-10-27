<template>
	<view class="container">
		<scroll-view scroll-y class="scroll-view">
			<view class="main">
				<view class="item-title">问题描述</view>
				<view class="item-view textarea-view">
					<textarea v-model="remark" auto-height fixed maxlength="200" class="textarea" placeholder="在此填写问题描述"></textarea>
				</view>
				<block v-if="floorList.length">
					<view class="item-title">楼层</view>
					<view class="item-view label-add floor">
						<view :class="['item',item.floorvalue == floor?'active':'']" v-for="(item,index) of floorList" :key="index"
						 @click="selectFloor(item.floorvalue)">{{item.floorname}}</view>
					</view>
				</block>
				<view class="item-title">位置</view>
				<view class="item-view place">
					<input v-model="place" class="input" type="text" placeholder="在此填写位置" />
					<image src="@/static/icon/scan-code.svg" mode="widthFix" class="icon" @click="scanCode()"></image>
				</view>
				<view class="item-title">整改部门</view>
				<view class="item-view label-add">
					<view class="item" v-for="(item,index) of deptList" :key="index">{{item.deptname}}</view>
					<view class="item item-add" @click="openSelect(1)">+</view>
				</view>
				<view class="item-title">整改人员</view>
				<view class="item-view label-add">
					<view class="item" v-for="(item,index) of userList.leaderlist" :key="index">{{item.username}}</view>
					<view class="item" v-for="(item,index) of userListOnce" :key="index">{{item.username}}</view>
					<view class="item item-add" @click="openSelect(2)">+</view>
				</view>
				<view class="item-title">添加图片</view>
				<view class="item-view image-list">
					<view class="item" v-for="(item,index) of upImgList" :key="index" @click="delImg(index)">
						<image :src="item.path + setting.OSSDownload" class="icon"></image>
					</view>
					<view class="item item-add" @click="addImg();">
						<!-- <view class="icon">+</view>
						<view class="text">添加图片</view> -->
						<image class="icon" src="@/static/icon/add_img.svg" mode="widthFix"></image>
					</view>
				</view>
				<view class="item-title">复核部门或人员</view>
				<view class="item-view label-add">
					<view class="item" v-for="(item,index) of deptListConfirm" :key="index">{{item.deptname}}</view>
					<view class="item" v-for="(item,index) of userListConfirm.leaderlist" :key="index">{{item.username}}</view>
					<block v-for="(item,index) of userListConfirm.deptuserlist" :key="index">
						<view class="item" v-for="(item,index) of item.userlist" :key="index">{{item.username}}</view>
					</block>
					<view class="item item-add" @click="openSelect(3)">+</view>
				</view>
				<view class="item-title tip">
					<image src="@/static/icon/tip.svg" mode="widthFix" class="icon"></image>
					如未指定则复核人员为提交人
				</view>
			</view>
		</scroll-view>
		<view class="replay-btn" @click="submit()">提交</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				planid: '',
				// 问题描述
				question: "",
				// 楼层
				floor: '',
				floorList: [],
				// 位置
				place: "",
				// 整改部门列表
				deptList: [],
				// 整改人员
				dserList: [],
				// 图片上传列表
				upImageList: [],
				// 复核部门或人员
				reviewDeptUserList: []
			}
		},
		computed: {
			userinfo() {
				return this.utils.getUserInfo(uni)
			},
			setting() {
				return this.$store.state.setting
			}
		},
		methods: {
			// 扫码
			scanCode() {
				let _this = this
				uni.scanCode({
					success: function(res) {
						console.log('扫码成功------>>>', res);
						_this.getSalerqrcodeInfo(res.result)
					}
				});
			},
			// 解析导购工牌
			async getSalerqrcodeInfo(salerqrcode) {
				try {
					uni.showNavigationBarLoading()
					let data = await uni.request({
						method: 'POST',
						url: this.api.getSalerqrcodeInfo + `?salerqrcode=${salerqrcode}`,
					})
					let [err, success] = data
					uni.hideNavigationBarLoading()
					console.log('解析导购工牌请求成功------>>>', success)
					if (success.data.success) {
						this.floor = success.data.data.salerinfo.floorvalue
						this.place = success.data.data.salerinfo.conername
					} else {
						uni.showToast({
							title: err ? err : success.data.errmsg,
							icon: 'none',
							duration: 3000
						});
					}
				} catch (e) {
					uni.hideNavigationBarLoading()
					console.log(e)
				}
			},
			// 请求部门列表
			async getPlanDeptList() {
				try {
					let data = await uni.request({
						method: 'POST',
						url: this.api.getSalerqrcodeInfo + `?salerqrcode=${salerqrcode}`,
					})
					let [err, success] = data
					console.log('部门列表请求成功------>>>', success)
					if (success.data.success) {
						this.floor = success.data.data.salerinfo.floorvalue
						this.place = success.data.data.salerinfo.conername
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
			},
			async getPlanFloorList() {
				try {
					let data = await uni.request({
						method: 'GET',
						url: this.api.getFloorlist
					})
					let [err, success] = data
					console.log('计划巡检楼层请求成功------>>>', success)
					if (success.data.success) {
						this.floorList = success.data.data.floor
					}
				} catch (e) {
					console.log(e)
				}
			},
			// // 提交问题
			// sendQuestion:function(){
			// 	// if(!this.btnClick) {return;}
			// 	// this.btnClick = false;
			// 	if(this.question == ''){
			// 		uni.showToast({
			// 			icon:"none",
			// 			title:"请填写问题描述!"
			// 		});
			// 		return;
			// 	}
			// 	if(this.place == ''){
			// 		uni.showToast({
			// 			icon:"none",
			// 			title:"请填写位置信息!"
			// 		});
			// 		return;
			// 	}
			// 	let insertdate = this.moment().format('yyyy-MM-dd hh:mm:ss');
			// 	// 条件
			// 	let option = {
			// 		planinspectionquestion:{
			// 			planquestionid: 0,
			// 			planid: this.option.id,//计划id
			// 			pitemid:0,//巡检项目id
			// 			iname:"", //巡检项目名称
			// 			question: this.question,//问题
			// 			inspectionplace: this.place,//位置
			// 			remark: "",//备注
			// 			usernumber: uni.getStorageSync("userinfo").usernumber,//提交人工号
			// 			username: uni.getStorageSync("userinfo").username,//提交人
			// 			insertdate,//提交时间，可以为空
			// 			deptid:uni.getStorageSync("userinfo").deptid,//提交人部门id
			// 			deptno: "",//提交人部门名称
			// 			deptname:uni.getStorageSync("userinfo").deptname,
			// 			lstupdatedate: insertdate,//修改时间 可为空
			// 			lstuserid: "",//修改人
			// 			status: 1000,//状态
			// 			other1: this.floor,//楼层
			// 			other2: "",//为空
			// 			confirmuserid: "",//为空
			// 			confirmdate: "",//为空
			// 			isnormal:0,//为0即可
			// 			planinspectionquestionImg: [{
			// 				planquestionimgid:0,
			// 				planquestionid:0,
			// 				planid:1,
			// 				imgurl:"",//图片路径
			// 				uploaddate:"",//可为空
			// 			}], 
			// 			mapplaninspectiondept:[{
			// 				mpidid: 0,
			// 				planquestionid: 0,
			// 				deptid: 10,
			// 				deptname: "总办",
			// 				insertdate
			// 			}],
			// 			mapplaninspectionuser: [{
			// 				mpiuid:0,
			// 				planquestionid:0,
			// 				userid:0,//通知人的id
			// 				usernumber:"",//通知人的工号
			// 				username:"",//通知人的姓名
			// 				mobile:'',//通知人的手机号
			// 				deptid:0,//通知人的部门id
			// 				deptname:"",//通知人的部门名称
			// 				insertdate
			// 			}],
			// 			planinspectionsolveuser:[{
			// 				solveid:0,
			// 				planquestionid:0,
			// 				solvetype:1,//1为部门，2为人员
			// 				itemno:'',
			// 				itemname:'',
			// 				status:1000,
			// 				insertdate: "2019-08-29 09:50:37",
			// 				lstupdatedate:"2019-08-29 09:50:37"
			// 			}],
			// 		}
			// 	};
			// 	option.planinspectionquestion.mapplaninspectiondept = [];
			// 	option.planinspectionquestion.mapplaninspectionuser = [];
			// 	option.planinspectionquestion.planinspectionquestionImg = [];
			// 	option.planinspectionquestion.planinspectionsolveuser = [];
			// 	// 部门写入
			// 	for(let item of this.deptList){
			// 		if(item.select == true){
			// 			let it = {
			// 				mpidid: 0,
			// 				planquestionid: 0,
			// 				deptid: item.deptid,
			// 				deptname: item.deptname,
			// 				insertdate
			// 			}
			// 			option.planinspectionquestion.mapplaninspectiondept.push(it)
			// 		}
			// 	}
			// 	// 人员写入
			// 	for(let item of this.userList.leaderlist){
			// 		if(item.select == true){
			// 			let it = {
			// 				mpiuid:0,
			// 				planquestionid:0,
			// 				userid:item.userid,//通知人的id
			// 				usernumber:item.usernumber,//通知人的工号
			// 				username:item.username,//通知人的姓名
			// 				mobile:'',//通知人的手机号
			// 				deptid:item.deptid,//通知人的部门id
			// 				deptname:item.deptname,//通知人的部门名称
			// 				insertdate
			// 			}
			// 			option.planinspectionquestion.mapplaninspectionuser.push(it);
			// 		}
			// 	}
			// 	for(let item of this.userListOnce){
			// 		if(item.select == true){
			// 			let it = {
			// 				mpiuid:0,
			// 				planquestionid:0,
			// 				userid:item.userid,//通知人的id
			// 				usernumber:item.usernumber,//通知人的工号
			// 				username:item.username,//通知人的姓名
			// 				mobile:'',//通知人的手机号
			// 				deptid:item.deptid,//通知人的部门id
			// 				deptname:item.deptname,//通知人的部门名称
			// 				insertdate
			// 			}
			// 			option.planinspectionquestion.mapplaninspectionuser.push(it);
			// 		}
			// 	}
			// 	// 整改部门整改人员必须选择一个
			// 	if(!(option.planinspectionquestion.mapplaninspectiondept.length || option.planinspectionquestion.mapplaninspectionuser.length)){
			// 		uni.showToast({
			// 			icon:"none",
			// 			title:"请选择整改部门或整改人员!"
			// 		});
			// 		return;
			// 	}
			// 	// 复核人或部门选择判断
			// 	// if(!this.deptListConfirm.filter(item=> item.select).length && 
			// 	// 	!this.userListConfirm.leaderlist.filter(item=> item.select).length && 
			// 	// 	!this.userListConfirm.deptuserlist.filter(item=>{if(item.userlist.filter(itm=> itm.select).length) return true}).length){
			// 	// 	uni.showToast({
			// 	// 		icon:"none",
			// 	// 		title:"请选择复核部门或复核人员!"
			// 	// 	});
			// 	// 	return;
			// 	// }
			// 	// 复核部门和人员写入
			// 	for(let item of this.deptListConfirm){
			// 		if(item.select == true){
			// 			let it = {
			// 				solveid:0,
			// 				planquestionid:0,
			// 				solvetype:1,//1为部门，2为人员
			// 				itemno:item.deptno,
			// 				itemname:item.deptname,
			// 				status:1000,
			// 				insertdate: "2019-08-29 09:50:37",
			// 				lstupdatedate:"2019-08-29 09:50:37"
			// 			}
			// 			option.planinspectionquestion.planinspectionsolveuser.push(it);
			// 		}
			// 	}
			// 	for(let item of this.userListConfirm.leaderlist){
			// 		if(item.select == true){
			// 			let it = {
			// 				solveid:0,
			// 				planquestionid:0,
			// 				solvetype:2,//1为部门，2为人员
			// 				itemno:item.usernumber,
			// 				itemname:item.username,
			// 				status:1000,
			// 				insertdate: "2019-08-29 09:50:37",
			// 				lstupdatedate:"2019-08-29 09:50:37"
			// 			}
			// 			option.planinspectionquestion.planinspectionsolveuser.push(it);
			// 		}
			// 	}
			// 	for(let item of this.userListConfirm.deptuserlist){
			// 		for(let itm of item.userlist){
			// 			if(itm.select == true){
			// 				let it = {
			// 					solveid:0,
			// 					planquestionid:0,
			// 					solvetype:2,//1为部门，2为人员
			// 					itemno:itm.usernumber,
			// 					itemname:itm.username,
			// 					status:1000,
			// 					insertdate: "2019-08-29 09:50:37",
			// 					lstupdatedate:"2019-08-29 09:50:37"
			// 				}
			// 				option.planinspectionquestion.planinspectionsolveuser.push(it);
			// 			}
			// 		}
			// 	}
			// 	// 图片插入
			// 	for(let item of this.upImgList){
			// 		let obj = {
			// 			planquestionimgid:0,
			// 			planquestionid:0,
			// 			planid:1,
			// 			imgurl:item.path,//图片路径
			// 			uploaddate:insertdate,//可为空
			// 		}
			// 		option.planinspectionquestion.planinspectionquestionImg.push(obj)
			// 	}
			// 	console.log(option)
			// 	console.log(JSON.stringify(option))
			// 	uni.showLoading({
			// 		title:"正在添加反馈问题...",
			// 		mask:true
			// 	})
			// 	// 反馈
			// 	request.sendPlanReply(option).then(data=>{
			// 		let [err,res] = data;
			// 		console.log("上传回复结果:",err,res)
			// 		if (!err && res.data.success) {
			// 			this.resetOption();
			// 			uni.navigateBack({
			// 				delta:1
			// 			})
			// 		}else{
			// 			uni.showToast({
			// 				title: err?err:res.data.errmsg,
			// 				icon: 'none',
			// 				duration:3000
			// 			});
			// 			this.reserveLoading = false
			// 		}
			// 	})
			// },
		},
		onLoad: function(option) {
			console.log(option)
			this.planid = option.planid
			this.getPlanFloorList()
		},
		onShow: function() {

		}
	}
</script>

<style scoped lang="scss">
	@import '@/styles/popup.scss';

	.container {
		width: 100%;
		min-height: 100vh;
		background: #F6F7F9;

		.scroll-view {
			max-height: 100vh;
		}

		.main {
			width: 710rpx;
			box-sizing: border-box;
			background: #fff;
			border-radius: 10rpx;
			padding: 0rpx 30rpx;
			margin: 20rpx;
			margin-bottom: 140rpx;

			// 标题
			.item-title {
				font-size: 30rpx;
				font-weight: 700;
				color: #647484;
				padding: 30rpx 20rpx;
				padding-bottom: 15rpx;

				&.tip {
					display: flex;
					align-items: center;
					padding-top: 0;
					padding-bottom: 30rpx;
					color: #999;
					font-weight: 500;

					.icon {
						width: 30rpx;
						height: 30rpx;
						margin-right: 10rpx;
					}
				}
			}

			// 内容
			.item-view {
				color: #647685;
				box-sizing: border-box;
				overflow: hidden;

				// 问题描述
				&.textarea-view {
					background: #F3F5F7;
					padding: 20rpx;
					border-radius: 10rpx;

					.textarea {
						min-height: 150rpx;
						font-size: 30rpx;
					}
				}

				// 添加操作样式
				&.label-add {
					width: 100%;
					display: flex;
					justify-content: flex-start;
					flex-wrap: wrap;

					.item {
						width: calc(100%/3 - 36rpx);
						height: 60rpx;
						margin-right: 13rpx;
						margin-bottom: 13rpx;
						background: #F3F5F7;
						color: #647685;
						text-align: center;
						font-size: 24rpx;
						border-radius: 6rpx;
						white-space: nowrap;
						// text-overflow: ellipsis;
						border: 2rpx solid #F3F5F7;
						display: flex;
						align-items: center;
						justify-content: center;

						&.active {
							border-color: #40A9FF;
							background: #fff;
							box-shadow: 0 0 10rpx -8rpx #000;
						}

						&.item-add {
							width: 100rpx;
							border: 1rpx dashed #B6C6D6;
							background: #fff;
							color: #647484;
						}

						&:nth-child(3n) {
							margin-right: 0;
						}
					}
				}

				// 楼层
				&.floor {
					.item {
						width: calc(22% - 27rpx);

						&:nth-child(3n) {
							margin-right: 13rpx;
						}
					}
				}

				// 位置
				&.place {
					display: flex;
					align-items: center;
					background: #F3F5F7;
					color: #647685;
					height: 80rpx;
					border-radius: 10rpx;
					padding-left: 20rpx;

					.input {
						font-size: 30rpx;
						flex: 2;
						height: 100%;
					}

					>.icon {
						width: 40rpx;
						height: 40rpx;
						padding: 20rpx;

						&:active {
							background: #e2e2e2;
						}
					}
				}

				// 添加图片
				&.image-list {
					display: flex;

					.item {
						width: 50rpx;
						height: 50rpx;
						margin-right: 10rpx;
						margin-bottom: 10rpx;
						display: flex;
						align-items: center;
						justify-content: center;

						>.icon {
							width: 100%;
							min-height: 100%;
						}

						&.item-add {
							width: 100rpx;
							height: 100rpx;
							border: 1rpx dashed #B6C6D6;
							background: #fff;
							color: #647484;
							display: flex;
							align-items: center;
							justify-content: center;
							flex-wrap: wrap;

							.icon {
								width: 40rpx;
							}

							.text {
								width: 100%;
							}
						}
					}
				}
			}
		}

		// 提出问题
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
			bottom: 10rpx;
			z-index: 1;
			// margin-bottom: env(safe-area-inset-bottom);
			// letter-spacing: 10rpx;

			&:active {
				opacity: 0.8;
			}
		}
	}
</style>
