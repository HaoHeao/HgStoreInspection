<template>
	<view class="container">
		<view class="main">
			<view class="item-title" v-if="option.itemIs">巡检项目</view>
			<view class="item-view label-info" v-if="option.itemIs">
				<view class="item-name">1.三楼东南角卫生间检查</view>
				<image src="../../static/right2.png" mode="widthFix" class="img"></image>
			</view>
			<view class="item-title">问题描述</view>
			<view class="item-view label-info">
				<textarea v-model="question" class="inp area-inp" v-if="!popup" auto-height="true" placeholder="在此填写问题描述" />
				<view class="inp area-inp textarea-text" v-if="popup">{{question == ''?'在此填写问题描述':question}}</view>
            </view>
            <view class="item-title">位置</view>
            <view class="item-view label-info">
                <input v-model="place" class="inp" type="text" value="" placeholder="在此填写位置" />
            </view>
            <view class="item-title">整改部门</view>
            <view class="item-view label-add">
				<view class="item-true fadeIn" v-for="(item,index) of deptList" :key="index" v-if="item.select == true">{{item.deptname}}</view>
                <view class="item-true item-true-btn" @click="openSelect(1)">+</view>
            </view>
            <view class="item-title">整改人员</view>
            <view class="item-view label-add">
				<view class="item-true fadeIn" v-for="(item,index) of userList.leaderlist" :key="index" v-if="item.select == true">{{item.username}}</view>
				<view class="item-true fadeIn" v-for="(item,index) of userListOnce" :key="index" v-if="item.select == true">{{item.username}}</view>
                <view class="item-true item-true-btn" @click="openSelect(2)">+</view>
            </view>
            <view class="item-title">添加图片</view>
            <view class="item-view label-add">
                <view class="item-img-true fadeIn" v-for="(item,index) of upImgList" :key="index" @click="delImg(index)">
                    <image :src="item.path + '?x-oss-process=image/resize,m_mfit,h_120,w_120'" class="img"></image>
					<view class="del">×</view>
                </view>
                <view class="item-img-true item-img-true-img" @click="addImg();">
                    <view class="icon">+</view>
                    <view class="text">添加图片</view>
                </view>
            </view>
			
            <view class="item-title">复核部门或人员</view>
            <view class="item-view label-add">
				<view class="item-true fadeIn" v-for="(item,index) of deptListConfirm" :key="index" v-if="item.select == true">{{item.deptname}}</view>
				<view class="item-true fadeIn" v-for="(item,index) of userListConfirm.leaderlist" :key="index" v-if="item.select == true">{{item.username}}</view>
				<block v-for="(item,index) of userListConfirm.deptuserlist" :key="index">
					<view class="item-true fadeIn" v-for="(item,index) of item.userlist" :key="index" v-if="item.select == true">{{item.username}}</view>
				</block>
				
                <view class="item-true item-true-btn" @click="openSelect(3)">+</view>
            </view>
        </view>
        <view class="confirm-btn" @click="sendQuestion()">提交</view>
        
        <popup ref="popup" type="center" @change="popupChange">
			<view v-if="selectForm == 1" class="popup-from">
				<view scroll-y="true" class="popup depart">
					<!-- cover-view -->
					<view class="title">整改部门</view>
					<view class="item-list">
						<block v-for="(item,index) of deptList" :key="index">
							<view :class="['item fadeIn',item.select?'active':'']" @click="addSetDeptList({type:1,item})">{{item.deptname}}</view>
						</block>
					</view>
					<view class="popup-down"></view>
				</view>
				<view class="control">
					<view class="center"></view>
					<view class="reset-from" @click="resetFrom(true)">重置</view>
					<view class="confirm" @click="openSelect(0)">确定</view>
				</view>
				<view class="close-btn" @click="openSelect(0)">×</view>
			</view>
			<view v-if="selectForm == 2" class="popup-from">
				<view scroll-y="true" class="popup depart user">
					<view class="title">主要领导：</view>
					<view class="item-list">
						<block v-for="(item,index) of userList.leaderlist" :key="index">
							<view :class="['item fadeIn',item.select?'active':'']" @click="addSetDeptList({type:2,item})">{{item.username}}</view>
						</block>
					</view>
					
					<block v-for="(item,index) of userList.deptuserlist" :key="index">
						<view class="title">{{item.deptname}}</view>
						<view class="item-list">
							<block v-for="(itm,ind) of item.userlist" :key="ind">
								<view :class="['item fadeIn',itm.select?'active':'']" @click="addSetDeptList({type:2,item:itm})">{{itm.username}}</view>
							</block>
						</view>
					</block>
					<!-- <view class="title">保安：</view>
					<view class="item-list">
						<view class="item">保安</view>
						<view class="item">工程</view>
						<view class="item">总办</view>
						<view class="item">人事</view>
					</view> -->
					<view class="popup-down"></view>
				</view>
				<view class="control">
					<view class="center"></view>
					<view class="reset-from" @click="resetFrom(false)">重置</view>
					<view class="confirm" @click="openSelect(0)">确定</view>
				</view>
				<view class="close-btn" @click="openSelect(0)">×</view>
			</view>
			<view v-if="selectForm == 3" class="popup-from">
				<view scroll-y="true" class="popup depart user">
					<view class="title">复核部门：</view>
					<view class="item-list">
						<block v-for="(item,index) of deptListConfirm" :key="index">
							<view :class="['item fadeIn',item.select?'active':'']" @click="addSetDeptList({type:3,item})">{{item.deptname}}</view>
						</block>
					</view>
					<view class="title">主要领导：</view>
					<view class="item-list">
						<block v-for="(item,index) of userListConfirm.leaderlist" :key="index">
							<view :class="['item fadeIn',item.select?'active':'']" @click="addSetDeptList({type:4,item})">{{item.username}}</view>
						</block>
					</view>
					
					<block v-for="(item,index) of userListConfirm.deptuserlist" :key="index">
						<view class="title">{{item.deptname}}</view>
						<view class="item-list">
							<block v-for="(itm,ind) of item.userlist" :key="ind">
								<view :class="['item fadeIn',itm.select?'active':'']" @click="addSetDeptList({type:4,item:itm})">{{itm.username}}</view>
							</block>
						</view>
					</block>
					<!-- <view class="title">保安：</view>
					<view class="item-list">
						<view class="item">保安</view>
						<view class="item">工程</view>
						<view class="item">总办</view>
						<view class="item">人事</view>
					</view> -->
					<view class="popup-down"></view>
				</view>
				<view class="control">
					<view class="center"></view>
					<view class="reset-from" @click="resetFromConfirm()">重置</view>
					<view class="confirm" @click="openSelect(0)">确定</view>
				</view>
				<view class="close-btn" @click="openSelect(0)">×</view>
			</view>
        </popup>
    </view>
</template>

<script>
    import popup from '@/components/uni-popup/uni-popup.vue'
	let utils = require('@/util/utils.js');
	let request = utils.request;
	let moment = utils.moment;
    export default {
        components: {
            popup
        },
        data() {
            return {
                popup: false,
                selectForm:2,
                // 问题
                question:"",
                // 位置
                place:"",
				// 图片上传列表
				imgNumber:9,
				upImgIndex:0,
				upImgList:[],
				deptList:this.$store.state.plan.questionSend.deptlist,
				userList:this.$store.state.plan.questionSend.userlist,
				deptListConfirm:uni.getStorageSync('planQuestionDeptSendConfirm'),
				userListConfirm:uni.getStorageSync('setQuestionUserSendConfirm'),
				// userListOnceConfirm:this.userListOnceConfirm1(this.userListConfirm)
            }
        },
        computed: {
            userListOnce(){
                let person = this.$store.state.plan.questionSend.userlist;
                let leaderlist = person.leaderlist,
                    deptuserlist = person.deptuserlist,
                    allPerson = [];
                for(let item of deptuserlist){
                    for(let ite of item.userlist){
                        allPerson.push(ite)
                    }
                }
                for(let item of deptuserlist){
                    allPerson.push(item)
                }
                return allPerson;
            },
        },
		onLoad:function(option){
			console.log(option)
			this.option = option
		},
		onUnload:function(){
			this.resetOption();
		},
        methods: {
			userListOnceConfirm1:function(person){
				let leaderlist = person.leaderlist,
			        deptuserlist = person.deptuserlist,
			        allPerson = [];
			    for(let item of deptuserlist){
			        for(let ite of item.userlist){
			            allPerson.push(ite)
			        }
			    }
			    for(let item of deptuserlist){
			        allPerson.push(item)
			    }
			    return allPerson;
			},
            popupChange:function(e){
                this.popup = !this.popup;
            },
            // 打开选择蒙层
            openSelect:function(type){
				console.log(this)
                if(type == 0){
                    this.selectForm = false;
                    this.$refs['popup'].close();
                    return;
                }
                this.selectForm = type;
                this.$refs['popup'].open();
            },
			// 选择部门人员
			addSetDeptList:function(option){
				console.log(option);
                if (option.type == 1) {
                    console.log(this.deptList);
                    let deptList = this.deptList;
                    for (let index in deptList) {
                        if (deptList[index].deptid == option.item.deptid) {
                            if (deptList[index].select == true) {
                                deptList[index].select = false;
                            } else {
                                deptList[index].select = true;
                            }
                        }
                    }
                } else if (option.type == 2) {
                    let userList = this.userList;
                    let leaderlist = userList.leaderlist,
                        deptuserlist = userList.deptuserlist;
                    // leader
                    for (let index in leaderlist) {
                        if (leaderlist[index].userid == option.item.userid) {
                            if (leaderlist[index].select == true) {
                                leaderlist[index].select = false;
                            } else {
                                leaderlist[index].select = true;
                            }
                        }
                    }
                    // deptuserlist
                    for (let item of deptuserlist) {
                        for (let index in item.userlist) {
                            if (item.userlist[index].userid == option.item.userid) {
                                if (item.userlist[index].select == true) {
                                    item.userlist[index].select = false;
                                } else {
                                    item.userlist[index].select = true;
                                }
                            }
                        }
                    }
                    userList = {
                        leaderlist,
                        deptuserlist
                    }
                }else if(option.type == 3) {
                    console.log(this.deptList);
                    let deptList = this.deptListConfirm;
                    for (let index in deptList) {
                        if (deptList[index].deptid == option.item.deptid) {
                            if (deptList[index].select == true) {
                                deptList[index].select = false;
                            } else {
                                deptList[index].select = true;
                            }
                        }
                    }
					this.deptListConfirm = deptList;
                } else if (option.type == 4) {
                    let userList = this.userListConfirm;
                    let leaderlist = userList.leaderlist,
                        deptuserlist = userList.deptuserlist;
                    // leader
					console.log(leaderlist)
                    for (let index in leaderlist) {
                        if (leaderlist[index].userid == option.item.userid) {
                            if (leaderlist[index].select == true) {
                                leaderlist[index].select = false;
                            } else {
                                leaderlist[index].select = true;
                            }
                        }
                    }
                    // deptuserlist
                    for (let item of deptuserlist) {
                        for (let index in item.userlist) {
                            if (item.userlist[index].userid == option.item.userid) {
                                if (item.userlist[index].select == true) {
                                    item.userlist[index].select = false;
                                } else {
                                    item.userlist[index].select = true;
                                }
                            }
                        }
                    }
                    userList = {
                        leaderlist,
                        deptuserlist
                    }
					this.userListConfirm = userList;
                }
                this.$forceUpdate();
			},
			// 取消提出问题
			cancelQuestion:function(){
				this.resetOption();
				uni.navigateBack({
					delta:1
				})
			},
			// 添加问题
			sendQuestion:function(){
				// if(!this.btnClick) {return;}
				// this.btnClick = false;
				uni.showLoading({
					title:"正在添加反馈问题...",
					mask:true
				})
				if(this.question == ''){
					uni.showToast({
						icon:"none",
						title:"请填写问题描述!"
					});
					return;
				}
				if(this.place == ''){
					uni.showToast({
						icon:"none",
						title:"请填写位置信息!"
					});
					return;
				}
				let insertdate = moment().format('yyyy-MM-dd hh:mm:ss');
				// 条件
				let option = {
					planinspectionquestion:{
						planquestionid: 0,
						planid: this.option.id,//计划id
						pitemid:0,//巡检项目id
						iname:"", //巡检项目名称
						question: this.question,//问题
						inspectionplace: this.place,//位置
						remark: "",//备注
						usernumber: uni.getStorageSync("userinfo").usernumber,//提交人工号
						username: uni.getStorageSync("userinfo").username,//提交人
						insertdate,//提交时间，可以为空
						deptid:uni.getStorageSync("userinfo").deptid,//提交人部门id
						deptno: "",//提交人部门名称
						deptname:uni.getStorageSync("userinfo").deptname,
						lstupdatedate: insertdate,//修改时间 可为空
						lstuserid: "",//修改人
						status: 1000,//状态
						other1: "",//为空
						other2: "",//为空
						confirmuserid: "",//为空
						confirmdate: "",//为空
						isnormal:0,//为0即可
						planinspectionquestionImg: [{
							planquestionimgid:0,
							planquestionid:0,
							planid:1,
							imgurl:"",//图片路径
							uploaddate:"",//可为空
						}], 
						mapplaninspectiondept:[{
							mpidid: 0,
							planquestionid: 0,
							deptid: 10,
							deptname: "总办",
							insertdate
						}],
						mapplaninspectionuser: [{
							mpiuid:0,
							planquestionid:0,
							userid:0,//通知人的id
							usernumber:"",//通知人的工号
							username:"",//通知人的姓名
							mobile:'',//通知人的手机号
							deptid:0,//通知人的部门id
							deptname:"",//通知人的部门名称
							insertdate
						}],
						planinspectionsolveuser:[{
							solveid:0,
							planquestionid:0,
							solvetype:1,//1为部门，2为人员
							itemno:'',
							itemname:'',
							status:1000,
							insertdate: "2019-08-29 09:50:37",
							lstupdatedate:"2019-08-29 09:50:37"
						}],
					}
				};
				option.planinspectionquestion.mapplaninspectiondept = [];
				option.planinspectionquestion.mapplaninspectionuser = [];
				option.planinspectionquestion.planinspectionquestionImg = [];
				option.planinspectionquestion.planinspectionsolveuser = [];
				// 部门写入
				for(let item of this.deptList){
					if(item.select == true){
						let it = {
							mpidid: 0,
							planquestionid: 0,
							deptid: item.deptid,
							deptname: item.deptname,
							insertdate
						}
						option.planinspectionquestion.mapplaninspectiondept.push(it)
					}
				}
				// 人员写入
				for(let item of this.userList.leaderlist){
					if(item.select == true){
						let it = {
							mpiuid:0,
							planquestionid:0,
							userid:item.userid,//通知人的id
							usernumber:item.usernumber,//通知人的工号
							username:item.username,//通知人的姓名
							mobile:'',//通知人的手机号
							deptid:item.deptid,//通知人的部门id
							deptname:item.deptname,//通知人的部门名称
							insertdate
						}
						option.planinspectionquestion.mapplaninspectionuser.push(it);
					}
				}
				for(let item of this.userListOnce){
					if(item.select == true){
						let it = {
							mpiuid:0,
							planquestionid:0,
							userid:item.userid,//通知人的id
							usernumber:item.usernumber,//通知人的工号
							username:item.username,//通知人的姓名
							mobile:'',//通知人的手机号
							deptid:item.deptid,//通知人的部门id
							deptname:item.deptname,//通知人的部门名称
							insertdate
						}
						option.planinspectionquestion.mapplaninspectionuser.push(it);
					}
				}
				
				// 整改部门整改人员必须选择一个
				if(!(option.planinspectionquestion.mapplaninspectiondept.length || option.planinspectionquestion.mapplaninspectionuser.length)){
					uni.showToast({
						icon:"none",
						title:"请选择整改部门或整改人员!"
					});
					return;
				}
				// 审核部门和人员写入
				for(let item of this.deptListConfirm){
					if(item.select == true){
						let it = {
							solveid:0,
							planquestionid:0,
							solvetype:1,//1为部门，2为人员
							itemno:item.deptno,
							itemname:item.deptname,
							status:1000,
							insertdate: "2019-08-29 09:50:37",
							lstupdatedate:"2019-08-29 09:50:37"
						}
						option.planinspectionquestion.planinspectionsolveuser.push(it);
					}
				}
				for(let item of this.userListConfirm.leaderlist){
					if(item.select == true){
						let it = {
							solveid:0,
							planquestionid:0,
							solvetype:2,//1为部门，2为人员
							itemno:item.usernumber,
							itemname:item.username,
							status:1000,
							insertdate: "2019-08-29 09:50:37",
							lstupdatedate:"2019-08-29 09:50:37"
						}
						option.planinspectionquestion.planinspectionsolveuser.push(it);
					}
				}
						console.log(option.planinspectionquestion.planinspectionsolveuser)
				for(let item of this.userListConfirm.deptuserlist){
					for(let itm of item.userlist){
						if(itm.select == true){
							let it = {
								solveid:0,
								planquestionid:0,
								solvetype:2,//1为部门，2为人员
								itemno:itm.usernumber,
								itemname:itm.username,
								status:1000,
								insertdate: "2019-08-29 09:50:37",
								lstupdatedate:"2019-08-29 09:50:37"
							}
							option.planinspectionquestion.planinspectionsolveuser.push(it);
						}
					}
				}
				console.log(option.planinspectionquestion.planinspectionsolveuser)
				// 图片写入
				for(let item of this.upImgList){
					let obj = {
						planquestionimgid:0,
						planquestionid:0,
						planid:1,
						imgurl:item.path,//图片路径
						uploaddate:insertdate,//可为空
					}
					option.planinspectionquestion.planinspectionquestionImg.push(obj)
				}
				console.log(option)
				console.log(JSON.stringify(option))
				// 反馈
				request.sendPlanReply(option).then(data=>{
					let [err,res] = data;
					console.log("上传回复结果:",err,res)
					if(err == null && res.data.success){
						this.resetOption();
						uni.navigateBack({
							delta:1
						})
					}else{
						uni.showToast({
							icon: "none",
							title: err.errmsg
						})
					}
				})
			},
			addImg:function(){
				utils.addImg(this);
			},
			delImg:function(index){
				utils.delImg(index,this);
			},
			resetFromConfirm:function(){
				this.deptListConfirm = uni.getStorageSync('planQuestionDeptSendConfirm');
				this.userListConfirm = uni.getStorageSync('setQuestionUserSendConfirm');
			},
			resetFrom:function(type){
				// 部门
				if(type){
					let deptList = this.deptList;
					for(let index in deptList){
						deptList[index].select = false;
					}
					this.$store.commit("setQuestionDeptSend", deptList);
				}else{
					// 人员
					let userList = this.userList;
					console.log(userList)
					let leaderlist = userList.leaderlist,
						deptuserlist = userList.deptuserlist;
					// leader
					for (let index in leaderlist) {
						console.log(leaderlist[index])
						leaderlist[index].select = false;
					}
					// deptuserlist
					for (let item of deptuserlist) {
						for(let index in item.userlist){
							if(item.userlist[index].select){
								item.userlist[index].select = false;
							}
						}
					}
					userList = {
						leaderlist,
						deptuserlist
					}
					console.log(userList)
					this.$store.commit("setQuestionUserSend", userList);
					this.$store.commit("setQuestionUserSend", userList);
				}
				this.$forceUpdate();
			},
			// 格式化
			resetOption:function(){
				this.question = '';
				this.place = '';
				this.upImgList = [];
				let deptList = this.deptList;
				for(let index in deptList){
					deptList[index].select = false;
				}
                this.$store.commit("setQuestionDeptSend", deptList);
					
				let userList = this.userList;
				let leaderlist = userList.leaderlist,
					deptuserlist = userList.deptuserlist;
				// leader
				for (let index in leaderlist) {
					console.log(leaderlist[index])
					leaderlist[index].select = false;
				}
				// deptuserlist
				for (let item of deptuserlist) {
					for(let index in item.userlist){
						if(item.userlist[index].select){
							item.userlist[index].select = false;
						}
					}
				}
				userList = {
					leaderlist,
					deptuserlist
				}
				this.$store.commit("setQuestionUserSend", userList);
			},
        },
    }
</script>

<style scoped lang="scss">
    .container {
        width:100%;
        min-height:calc(100vh - 40rpx);
        background:#F6F7F9;
        padding:20rpx 0rpx;
		
		.confirm-btn{
			width:710rpx;
			height:80rpx;
			line-height:80rpx;
			text-align:center;
			font-size:24rpx;
			border-radius:80rpx;
			color:#fff;
			background:#647484;
			position:fixed;
			left:20rpx;
			bottom:20rpx;
			margin-bottom: env(safe-area-inset-bottom);
			
			&:active{
				opacity:0.9;
			}
		}
        
        .main{
            width:710rpx;
            box-sizing:border-box;
            margin:0rpx 20rpx;
            background:#fff;
            border-radius:10rpx;
            padding:0rpx 30rpx;
            padding-bottom: env(safe-area-inset-bottom);
			margin-bottom:120rpx;
			padding-bottom:40rpx;
            
            .item-title{
                font-size:28rpx;
                font-weight:700;
                color:#647484;
                padding:30rpx 20rpx;
                padding-bottom:15rpx;
            }
            .item-view{
                color:#647685;
                box-sizing:border-box;
            }
            .item-view.label-info{
                background:#F3F5F7;
                border-radius:10rpx;
                padding:20rpx;
                display:flex;
                align-items:center;
                .item-name{
                    font-weight:700;
                    flex:2;
                }
                .img{
                    width:30rpx;
                }
                .inp.area-inp{
                    min-height:130rpx;
                }
                .inp.textarea-text{
                    margin-top:4rpx;
                    min-height:126rpx;
                    word-wrap: break-word;
                }
                .inp{
                    width:100%;
                    line-height:28rpx;
                }
            }
            // 部门或人员
            .item-view.label-add{
                width:100%;
                display:flex;
                justify-content:flex-start;
				flex-wrap: wrap;
                .item-true{
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
                    
                    &:active{
                        opacity:0.9;
                        background:#f9f9f9;
                    }
                }

                .item-true:nth-child(3n) {
                    margin-right: 0;
                }
				.item-true.item-true-btn{
					width:92rpx;
					border:1rpx dashed #B6C6D6;
					background: #fff;
					color: #647484;
					
					&:active{
						opacity:0.9;
						background:#f9f9f9;
						border:1rpx dotted #B6C6D6;
					}
				}
            }
            // 图片
            .item-view.label-add{
                width:100%;
                display:flex;
                justify-content:flex-start;
				flex-wrap: wrap;
                
                .item-img-true{
					width:110rpx;
					height:110rpx;
					margin-bottom:25rpx;
					margin-right:15rpx;
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
                
				.item-img-true-img{
					border:1rpx dashed #B6C6D6;
					background: #fff;
					color: #647484;
                    
                    .icon{
                        width:100%;
                        font-size:48rpx;
                        font-weight:800;
                        color: #F3F5F7;
                        margin-top:2rpx;
                    }
                    .text{
                        color: #647484;
                        font-size:20rpx;
                        margin-bottom:22rpx;
                    }
					
					&:active{
						opacity:0.9;
						background:#f9f9f9;
						border:1rpx dotted #B6C6D6;
					}
				}
            }
            
            // 操作
            .control{
                display: flex;
                justify-content:flex-start;
                padding-bottom:20rpx;
                
                .center{
                    flex: 2;
                }
                
                .btn{
                    width:120rpx;
                    height:50rpx;
                    line-height:50rpx;
                    text-align:center;
                    font-size:24rpx;
                    border-radius:50rpx;
                }
                
                .btn.confirm{
                    color:#fff;
                    background:#647484;
                    
                    &:active{
                        opacity:0.9;
                    }
                }
            }
        }
		
		.popup-from{
			box-sizing:border-box;
			// 选择
			.popup{
				width:650rpx;
				overflow:hidden;
				z-index:999;
			}
			.popup.depart{
				border-radius:10rpx;
				background:#fff;
				padding:0rpx 20rpx;
				width:650rpx;
				box-sizing:border-box;
				max-height:70vh;
				overflow-y:scroll;
				position:relative;
				
				.title{
					color:#647484;
					font-weight:700;
					font-size:25rpx;
					padding:20rpx;
					padding-bottom:10rpx;
				}
				
				.item-list{
					display:flex;
					justify-content:flex-start;
					flex-wrap: wrap;
					
					.item{
						width: calc(33.3% - 36rpx);
						height: 38rpx;
						line-height: 38rpx;
						padding: 10rpx 10rpx;
						margin-right:18rpx;
						margin-bottom:18rpx;
						border:2rpx solid #F3F5F7;
						background: #F3F5F7;
						color: #647685;
						text-align:center;
						font-size:22rpx;
						border-radius:6rpx;
						white-space:nowrap;
						text-overflow:ellipsis;
						
						&:active{
							opacity:0.9;
							background:#f9f9f9;
						}
					}

					.item.active {
						border: 2rpx solid #1BA1F3;
						color: #1BA1F3;
						background: #fff;

						.postion {
							color: #1BA1F3;
						}
					}

					.item:nth-child(3n) {
						margin-right: 0;
					}
				}
				.popup-down{
					padding-bottom:90rpx;
				}
			}
			
			.close-btn{
				position: absolute;
				right: 0rpx;
				top: 0rpx;
				text-align: center;
				line-height: 50rpx;
				z-index: 999;
				background: #647484;
				width: 50rpx;
				height: 50rpx;
				color: #fff;
				border-bottom-left-radius: 10rpx;
				border-top-right-radius: 10rpx;

			}
			.control{
				width:100%;
				display: flex;
				align-items:center;
				position:absolute;
				left:0;
				bottom:0;
				background:#fff;
				z-index: 999;
				padding:20rpx;
				box-sizing: border-box;
				border-bottom-left-radius:10rpx;
				border-bottom-right-radius:10rpx;
				
				.center{
					flex:2;
				}
				
				.confirm{
					width:120rpx;
					height:50rpx;
					line-height:50rpx;
					text-align:center;
					font-size:24rpx;
					border-radius:50rpx;
					color:#fff;
					background:#647484;
					
					&:active{
						opacity:0.9;
					}
				}
			}
			
			.reset-from{
				padding-right:50rpx;
				color:#666;
				font-size: 26rpx;
			}
		}
        .popup.depart.user{}
    }
</style>
