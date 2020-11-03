<template>
    <view class="container">
        <view class="head"></view>
        <view class="main">
            <!-- <view class="title">巡检标题</view>
            <view class="content itemInput">
                <input type="text" data-i="1" placeholder-style="color:#B6C6D6;" class="input fadeIn800" maxlength="200"
                    placeholder="请输入巡检标题" value="" :focus="titleFoc" v-model="title" />
            </view> -->
            <view class="title">巡检描述</view>
            <view class="content textarea-view">
                <textarea auto-height data-i="2" placeholder-style="color:#B6C6D6;" class="textarea fadeIn800"
                    maxlength="200" placeholder="对此条巡检进行描述说明(200字以内)" :focus="descFoc" v-model="desc" />
                </view>
			<view class="title">通知部门</view>
			<view class="content select-list department">
                <block v-for="(item,index) of departmentList" :key="index">
                    <view class="item fadeIn" v-if="item.select == true">{{item.deptname}}</view>
                </block>
				<view class="item add" @click="addFrom(1)">+</view><!-- 添加/修改 -->
			</view>
			<view class="title">通知人员</view>
			<view class="content select-list person">
                <block v-for="(item,index) of person" :key="index">
                    <view class="item fadeIn" v-if="item.select == true">{{item.username}}</view>
                </block>
				<view class="item add" @click="addFrom(2)">+</view>
			</view>
			<view class="title add-img">添加图片</view>
			<view class="content select-list picture">
				<view class="item" v-for="(item,index) of upImgList" :key="index" @click="delImg(index)">
					<image class="img" :src="item.path + '?x-oss-process=image/resize,m_mfit,h_120,w_120'"></image>
					<view class="del">×</view>
				</view>
				<view class="item add add-img-btn" @click="addImg()">
					<view class="icon">+</view>
					<view class="text">添加图片</view>
				</view>
			</view>
			<view class="add-from" @click="add()">提交</view>
		</view>
	</view>
</template>

<script>
    let utils = require('@/util/utils.js');
    let request = utils.request;
	export default {
		data() {
			return {
				popup: true,
				// titleHeight:"136",
				textHeight:"136",
				// 巡检标题
				title:"",
				titleFoc:false,
				// 巡检描述
				desc:"",
				descFoc:false,
				// // 通知部门
				// departmentList:[],
				// // 通知人员
				// person:[],
				// 图片上传列表
				imgNumber:9,
				upImgIndex:0,
				upImgList:[],
				
				// 重复提交
				btnClick:true
			}
		},
        computed:{
            departmentList(){
                return this.$store.state.market.addMarket.departmentList;
            },
            person(){
                let person = this.$store.state.market.addMarket.person;
                let leaderlist = person.leaderlist,
                    deptuserlist = person.deptuserlist,
                    allPerson = [];
                console.log(this.$store.state.market.addMarket.person)
                for(let item of deptuserlist){
                    for(let ite of item.userlist){
                        allPerson.push(ite)
                    }
                }
                for(let item of deptuserlist){
                    allPerson.push(item)
                }
                return allPerson;
            }
        },
		onShow:function(){
            this.$forceUpdate();
		},
		methods: {
            // 重置表单内容
            resetForm:function(){
                let departmentList = this.departmentList;
                for (let item of departmentList) {
                    item.select = false;
                }
                this.$store.commit("setAddDepart", departmentList);
                
                let person = this.$store.state.market.addMarket.person;
                let leaderlist = person.leaderlist,
                    deptuserlist = person.deptuserlist;
                // leader
                for (let item of leaderlist) {
                    item.select = false;
                }
                // deptuserlist
                for (let item of deptuserlist) {
                    for (let itm of item.userlist) {
                        itm.select = false;
                    }
                }
                person = {
                    leaderlist,
                    deptuserlist
                }
                this.$store.commit("setAddPerson", person);
            },
            sortArr: function(arr){            
                for(var i=0; i<arr.length; i++){
                    for(var j=i+1; j<arr.length; j++){
                        if(arr[i].deptid == arr[j].deptid){
                            arr.splice(j,1);
                            j--;
                        }
                    }
                }
                return arr;
            },
			add:function(){
				if(!this.btnClick) {return;}
				this.btnClick = false;
				uni.showLoading({
					title:"正在添加巡检...",
					mask:true
				})
				let _this = this;
				let option = {
					loginspection: {
						inspectionlogid: 0,
						inspectionid: 0,
						typedesc: "", // 设备 电梯 F1
						deptid: uni.getStorageSync("userinfo").deptid, // 登录人
						deptname: uni.getStorageSync("userinfo").deptname, // 部门名称
						title: this.title, // 标题
						insertdate: "", // 提交时间
						inspectionplace: "", // 位置
						remark: this.desc, // 描述
						status: 0, // 状态
						usernumber: uni.getStorageSync("userinfo").usernumber, // 操作人工号
						username: uni.getStorageSync("userinfo").username, // 名称
						lstupdatedate: "",
						lstuserid: "",
						other1: "",
						other2: "",
						confirmuserid: "",
						confirmdate: "",
						loginspectionimg: [ // 图片
							// {
							// 	inspectionimgid: 0,
							// 	inspectionlogid: 0,
							// 	imgurl: "string", // 地址
							// 	uploadtime: "" // 上传时间
							// }
						],
						loginspectionquestion: [ // 讨论
						// 	{
						// 		questionid: 0,
						// 		inspectionlogid: 0,
						// 		reason: "string", // 原因
						// 		remark: "string", // 解决办法
						// 		insertdate: "",
						// 		userid: "string", // 登录人id
						// 		username: "string", // 名称
						// 		deptid: 0, // 部门
						// 		deptname: "string" // 部门名称
						// 	}
						],
						loginspectiontype: [ //问题归属
						// 	{
						// 		loginspectiontypeid: 0,
						// 		inspectionlogid: 0,
						// 		inspectionid: 0,
						// 		inspectioncode: "string", // 编码
						// 		inspectionname: "string", // 名称
						// 		insertdate: ""
						// 	}
						],
						mapinspectiondept: [ //通知部门
							// {
							// 	mapinspectiondeptid: 0,
							// 	inspectionlogid: 0,
							// 	deptid: 1, // 部门id
							// 	deptname: "", // 名称
							// 	insertdate: ""
							// }
						],
						mapinspectionuser: [ //通知人员
							// {
							// 	miuid: 0,
							// 	inspectionlogid: 0,
							// 	userid: 0, // id
							// 	usernumber: "", // 工号
							// 	username: "", // 名称
							// 	mobile: "", // 手机
							// 	deptid: 0, // id
							// 	deptname: "", // 名称
							// 	insertdate: ""
							// }
						]
						}
				}
                // 人员
                console.log(option)
                let person = [];
				for(let item of this.person){
                    if(item.select == true){
                        person.push(item)
                        let obj = {
                            miuid: 0,
                            inspectionlogid: 0,
                            userid: item.userid, // id
                            usernumber: item.usernumber, // 工号
                            username: item.username, // 名称
                            mobile: "", // 手机
                            deptid: item.deptid, // id
                            deptname: item.deptname, // 名称
                            insertdate: ""
                        }
                        option.loginspection.mapinspectionuser.push(obj)
                    }
				}
                // 部门
                let deptlist = [];
                for(let item of this.departmentList){
                    if(item.select == true){
                        deptlist.push(item);
                    }
                }
                deptlist = this.sortArr(deptlist.concat(person));
				console.log(deptlist)
				for(let item of deptlist){
					let obj = {
						mapinspectiondeptid: 0,
						inspectionlogid: 0,
						deptid: item.deptid, // 部门id
						deptname: item.deptname, // 名称
						insertdate: ""
					}
					option.loginspection.mapinspectiondept.push(obj)
				}
				for(let item of this.upImgList){
					let obj = {
						inspectionimgid: 0,
						inspectionlogid: 0,
						imgurl: item.path, // 地址
						uploadtime: "" // 上传时间
					}
					option.loginspection.loginspectionimg.push(obj)
				}
				// if(!this.title){
				// 	uni.hideLoading();
				// 	this.btnClick = true;
				// 	uni.showModal({
				// 		title:"",
				// 		content:"请填写巡检标题！",
				// 		showCancel:false,
				// 		success:()=>{
				// 			_this.titleFoc = true
				// 		}
				// 	})
				// 	return;
				// }
				if(!this.desc){
					uni.hideLoading()
					this.btnClick = true;
					uni.showModal({
						title:"",
						content:"请填写巡检描述！",
						showCancel:false,
						success:()=>{
							_this.descFoc = true
						}
					})
					return;
				}
				// let nitice = false;
				if(!option.loginspection.mapinspectiondept.length && !option.loginspection.mapinspectionuser.length){
					uni.hideLoading()
					this.btnClick = true;
					uni.showModal({
						title:"",
						content:"请选择通知部门！",
						showCancel:false
					})
					return;
				}
				if(!option.loginspection.mapinspectionuser.length && !option.loginspection.mapinspectiondept.length){
					uni.hideLoading()
					this.btnClick = true;
					uni.showModal({
						title:"",
						content:"请选择通知人员！",
						showCancel:false
					})
					return;
				}
				console.log("开始添加巡检记录",option);
				console.log("开始添加巡检记录JSON",JSON.stringify(option));
				request.addDetail(option).then(data => {
					uni.hideLoading();
					let [err,res] = data;
					console.log("添加结果：",err,data);
					if(err == null && res.data.success){
						// 重置
						uni.showToast({
							icon:"success",
							title:"添加成功"
						})
						this.btnClick = true;
						uni.navigateBack({
							delta:1
						})
					}else{
						this.btnClick = true;
						uni.showToast({
							icon:"none",
							duration:3000,
							title:res.data.errmsg
						})
						return;
					}
				});
			},
			addImg:function(){
				utils.addImg(this);
			},
			delImg:function(index){
				utils.delImg(index,this);
			},
			addFrom:function(type){
				console.log("添加图表");
				uni.navigateTo({
					url:"../addSelect/addSelect?type=" + type
				})
			}
		},
		onHide: function() {
			console.log("add onHide")
		},
		onUnload: function() {
			console.log("add onUnload")
			this.$store.commit("changeTabbar", 2);
			// 重置
            this.resetForm();
		}
	}
</script>

<style scoped lang="scss">
	.container{
		padding-bottom: env(safe-area-inset-bottom);
		.main{
			padding-bottom:100rpx;
			.title{
				width:calc(100% - 60rpx);
				padding:20rpx 30rpx;
				padding-bottom:10rpx;
				color:#647484;
				font-size:26rpx;
				font-weight:800;
			}
			.title.add-img{
				padding-bottom:20rpx;
			}
			.content{
				width:calc(100% - 60rpx);
				height:auto;
				padding:20rpx 30rpx;
				padding-bottom:10rpx;
				padding-top:0rpx;
				.input{
					width:100%;
					height:130rpx;
					box-sizing:border-box;
					border-radius:10rpx;
					color:#647484;
					font-size:26rpx;
					background: #F3F5F7;
					padding:26rpx 20rpx;
				}
			}
			.content.textarea-view{
				background: #F3F5F7;
				padding:26rpx 20rpx;
				margin:0rpx 30rpx;
				width:calc(100% - 100rpx);
				border-radius:10rpx;
				.textarea{
					width:100%;
					min-height:130rpx;
					box-sizing:border-box;
					color:#647484;
					font-size:26rpx;
					line-height:26rpx;
					border-radius:10rpx;
					resize:none;
					box-sizing:border-box;
				}
			}
			.itemInput{
				height:85rpx;
				.input{
					height:100%;
					line-height: 85rpx;;
				}
			}
			.select-list{
				width:calc(100% - 60rpx);
				height:auto;
				display:flex;
				justify-content:flex-start;
				flex-wrap: wrap;

				.item {
					width: calc(33.3% - 36rpx);
					height: 38rpx;
					line-height: 38rpx;
					padding: 10rpx 10rpx;
					margin-right:13rpx;
					margin-bottom:13rpx;
					border:1rpx solid #F3F5F7;
					background: #F3F5F7;
					color: #647685;
					text-align:center;
					font-size:24rpx;
					border-radius:6rpx;
					white-space:nowrap;
					text-overflow:ellipsis;
					// overflow:hidden;
					
					&:active{
						opacity:0.9;
						background:#f9f9f9;
					}
				}
				.item.add{
					width:102rpx;
					border:1rpx dashed #B6C6D6;
					background: #fff;
					color: #647484;
					font-size: 32rpx;
					
					&:active{
						opacity:0.9;
						background:#f9f9f9;
						border:1rpx dotted #B6C6D6;
					}
				}

				.item:nth-child(3n) {
					margin-right: 0;
				}
			}
			.picture{
				.item{
					width:120rpx;
					height:120rpx;
					margin-bottom:25rpx;
					display: flex;
					border:1rpx solid transparent;
					justify-content:center;
					align-items:center;
					padding:0;
					flex-wrap: wrap;
					text-align:center;
					position:relative;
					.img{
						width:100%;
						height:100%;
						border-radius:6rpx;
					}
					.icon{
						width:100%;
						font-size:48rpx;
						font-weight:800;
						color: #F3F5F7;
						margin-top:24rpx;
					}
					.text{
						color: #647484;
						font-size:20rpx;
						margin-bottom:22rpx;
					}
					
					.del{
						position:absolute;
						right:-12rpx;
						top:-12rpx;
						width:30rpx;
						height:30rpx;
						line-height:30rpx;
						text-align:center;
						border-radius:50%;
						overflow:hidden;
						background:#C1C7CE;
						color:#fff;
						font-size:20rpx;
						box-shadow:0rpx 0rpx 10rpx -1rpx rgba(0,0,0,0.9);
					}
					
					&:active .del{
						background:red;
					}
				}
				.item.add{
					width:120rpx;
					border:1rpx dashed #B6C6D6;
					
					&:active{
						background:#f9f9f9;
						color:#f2f2f2;
					}
				}

				.item:nth-child(3n) {
					margin-right: 16rpx;
				}
				
			}
		}
		// 提交
		.add-from{
			width:calc(100% - 60rpx);
			height:80rpx;
			line-height:80rpx;
			text-align:center;
			margin:30rpx;
			margin-bottom:10rpx;
			background:#647484;
			color:#fff;
			font-size:28rpx;
			letter-spacing:20rpx;
			border-radius:40rpx;
			position:fixed;
			left:0;
			bottom:30rpx;
			z-index:1;
			opacity: 0.95;
			margin-bottom: env(safe-area-inset-bottom);
			
			&:active{
				opacity: 0.8;
			}
		}
		.add-from.active{
			background: #647484;
		}
	}
</style>
