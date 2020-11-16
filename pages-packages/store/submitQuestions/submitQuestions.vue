<template>
	<view class="container">
		<scroll-view scroll-y class="scroll-view">
			<view class="main">
				<view class="item-title">巡检描述</view>
				<view class="item-view textarea-view">
					<textarea v-model="question" disable-default-padding auto-height fixed maxlength="500" class="textarea"
					 placeholder="在此填写巡检描述"></textarea>
				</view>
				<view class="item-title">通知部门</view>
				<view class="item-view label-add">
					<view class="item" v-for="(item,index) of deptList" :key="index" v-if="item.noticeLabel">{{item.deptname}}</view>
					<view class="item item-add" @click="$refs['noticeDept'].open()">+</view>
				</view>
				<view class="item-title">通知人员</view>
				<view class="item-view label-add">
					<view class="item" v-for="(item,index) of userList.leaderlist" :key="index" v-if="item.noticeLabel">{{item.username}}</view>
					<block v-for="(item,index) of userList.deptuserlist" :key="index">
						<view class="item" v-for="(itm,ind) of item.userlist" :key="ind" v-if="itm.noticeLabel">{{itm.username}}</view>
					</block>
					<view class="item item-add" @click="$refs['noticeUser'].open()">+</view>
				</view>
				<view class="item-title">添加图片</view>
				<view class="item-view image-list">
					<view class="item" v-for="(item,index) of tempFilePaths" :key="index" @click="tempFilePaths.splice(index,1)">
						<image :src="item" class="icon" mode="widthFix"></image>
					</view>
					<view class="choose-image" @click="chooseImgage();">
						<image class="icon" src="@/static/icon/add_img.svg" mode="widthFix"></image>
					</view>
				</view>
			</view>
		</scroll-view>
		<view :class="['sublimt-btn',submitLoading?'sublimt-btn':'']" @click="submit()">
			<u-loading v-if="submitLoading" mode="circle" size="28"></u-loading>
			{{submitLoading?'':'提交'}}
		</view>
		<uni-popup ref="noticeDept" type="bottom">
			<view class="popup notice-dept top">
				<view class="title">
					<text class="content">通知部门</text>
					<view class="close" @click="$refs['noticeDept'].close()">关闭</view>
				</view>
				<scroll-view scroll-y class="popup-content">
					<view class="data-list">
						<view :class="['item',item.noticeLabel?'active':'']" v-for="(item,index) of deptList" :key="index" @click="deptList.filter(itm => itm.deptid == item.deptid)[0].noticeLabel = ! deptList.filter(itm => itm.deptid == item.deptid)[0].noticeLabel">
							<view class="title">{{item.deptname}}</view>
						</view>
					</view>
				</scroll-view>
				<view class="bottom-control">
					<view class="content">
						<view class="close" @click="dataListReset('noticeDept')">重置</view>
					</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="noticeUser" type="bottom">
			<view class="popup notice-user top">
				<view class="title">
					<text class="content">通知人员</text>
					<view class="close" @click="$refs['noticeUser'].close()">关闭</view>
				</view>
				<scroll-view scroll-y class="popup-content">
					<block v-if="userList.leaderlist.length">
						<view class="label-title">主要领导</view>
						<view class="data-list">
							<view :class="['item',item.noticeLabel?'active':'']" v-for="(item,index) of userList.leaderlist" :key="index"
							 @click="userList.leaderlist.filter(itm => itm.usernumber == item.usernumber)[0].noticeLabel = ! userList.leaderlist.filter(itm => itm.usernumber == item.usernumber)[0].noticeLabel">
								<view class="title">{{item.username}}</view>
								<view class="position" v-if="item.postion">{{item.postion}}</view>
							</view>
						</view>
					</block>
					<block v-for="(item,index) of userList.deptuserlist" :key="index">
						<view class="label-title">{{item.deptname}}</view>
						<view class="data-list">
							<view :class="['item',itm.noticeLabel?'active':'']" v-for="(itm,ind) of item.userlist" :key="ind" @click="deptUserSelect(itm)">
								<view class="title">{{itm.username}}</view>
								<view class="position" v-if="itm.postion">{{itm.postion}}</view>
							</view>
						</view>
					</block>
				</scroll-view>
				<view class="bottom-control">
					<view class="content">
						<view class="close" @click="dataListReset('noticeUser')">重置</view>
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
				// 巡检描述
				question: "",
				// 部门列表
				deptList: [],
				// 人员列表
				userList: [],
				// 待上传图片列表
				tempFilePaths: [],
				// 上传成功的有效已选择的图片
				successUploadFileImages: [],

				// 提交loading
				submitLoading: false
			}
		},
		computed: {
			userinfo() {
				return this.utils.getUserInfo()
			},
			setting() {
				return this.$store.state.setting
			}
		},
		methods: {
			// 提交
			async submit() {
				if (!this.question) {
					uni.showToast({
						icon: 'none',
						title: "请填写巡检描述",
						duration: 3000
					})
					return;
				}
				// 整改部门必须选择
				if (!this.deptList.filter(item => item.noticeLabel).length) {
					uni.showToast({
						icon: 'none',
						title: "请选择通知部门",
						duration: 3000
					})
					return;
				}
				if (this.submitLoading) return;
				try {
					this.submitLoading = true
					// 上传图片
					await this.uploadFileImage()

					let mapinspectiondept = [],
						mapinspectionuser = [],
						loginspectionimg = [];

					// 通知部门
					this.deptList.filter(item => item.noticeLabel).forEach(i => {
						mapinspectiondept.push({
							mapinspectiondeptid: 0,
							inspectionlogid: 0,
							deptid: i.deptid, // 部门id
							deptname: i.deptname, // 名称
							insertdate: this.moment().format('YYYY-MM-DD hh:mm:ss')
						})
					})
					// 通知人员
					// 主要人员
					this.userList.leaderlist.filter(item => item.noticeLabel).forEach(i => {
						mapinspectionuser.push({
							miuid: 0,
							inspectionlogid: 0,
							userid: i.userid, // 通知人的
							usernumber: i.usernumber, // 通知人的工号
							username: i.username, // 通知人的姓名
							mobile: i.mobile, //通知人的手机号
							deptid: i.deptid, // 通知人的部门
							deptname: i.deptname, // 通知人的部门名称
							insertdate: this.moment().format('YYYY-MM-DD hh:mm:ss')
						})
					})
					// 其他人员
					this.userList.deptuserlist.forEach(item => {
						item.userlist.filter(itm => itm.noticeLabel).forEach(i => {
							mapinspectionuser.push({
								miuid: 0,
								inspectionlogid: 0,
								userid: i.userid, // 通知人的
								usernumber: i.usernumber, // 通知人的工号
								username: i.username, // 通知人的姓名
								mobile: i.mobile, //通知人的手机号
								deptid: i.deptid, // 通知人的部门
								deptname: i.deptname, // 通知人的部门名称
								insertdate: this.moment().format('YYYY-MM-DD hh:mm:ss')
							})
						})
					})
					// 上传图片
					this.successUploadFileImages.forEach(imgurl => {
						loginspectionimg.push({
							inspectionimgid: 0,
							inspectionlogid: 0,
							imgurl,
							uploadtime: this.moment().format('YYYY-MM-DD hh:mm:ss')
						})
					})
					let data = await uni.request({
						method: 'POST',
						url: this.api.store_submitQuestion,
						data: {
							loginspection: {
								inspectionlogid: 0,
								inspectionid: 0,
								typedesc: "",
								deptid: this.userinfo.deptid, // 登录人
								deptname: this.userinfo.deptname, // 部门名称
								title: '', // 标题
								insertdate: this.moment().format('YYYY-MM-DD hh:mm:ss'), // 提交时间
								inspectionplace: "",
								remark: this.question, // 描述
								status: 0, // 状态
								usernumber: this.userinfo.usernumber, // 操作人工号
								username: this.userinfo.username, // 名称
								lstupdatedate: "",
								lstuserid: "",
								other1: "",
								other2: "",
								confirmuserid: "",
								confirmdate: "",
								loginspectionimg, // 图片
								loginspectionquestion: [], // 讨论
								loginspectiontype: [], //问题归属
								mapinspectiondept, // 通知部门
								mapinspectionuser, //通知人员
							}
						}
					})
					this.submitLoading = false
					let [err, success] = data
					console.log('提交结果--->>>', err, success)
					if (!err && success.data.success) {
						uni.showToast({
							title: '提交成功！',
							icon: 'none'
						});
						await this.delay(300)
						this.UpdateNavigationBack()
					} else {
						uni.showToast({
							title: err ? err : success.data.errmsg,
							icon: 'none',
							duration: 3000
						});
					}
				} catch (e) {
					this.submitLoading = false
					console.log(e)
				}
			},
			// 部门人员选择重置
			dataListReset(type) {
				if (type == 'noticeDept') {
					this.deptList.forEach(item => {
						item.noticeLabel = false
					})
				} else if (type == 'noticeUser') {
					for (let item of this.userList.leaderlist) {
						item.noticeLabel = false
					}
					for (let item of this.userList.deptuserlist) {
						for (let itm of item.userlist) {
							itm.noticeLabel = false
						}
					}
				}
			},
			// 选择二级人员
			deptUserSelect(item) {
				for (let itm of this.userList.deptuserlist) {
					for (let it of itm.userlist) {
						if (it.usernumber == item.usernumber) it.noticeLabel = !it.noticeLabel
						this.$forceUpdate()
					}
				}
			},
			// 选择图片
			chooseImgage() {
				let _this = this;
				uni.chooseImage({
					success: function(res) {
						_this.tempFilePaths = _this.tempFilePaths.concat(res.tempFiles.map(item => item.path))
					}
				});
			},
			// 返回上一页并更新
			UpdateNavigationBack() {
				// let pages = getCurrentPages();
				// let beforePage = pages[pages.length - 2];
				// console.log(pages,beforePage)
				// beforePage.$vm.getWaitData();
				// beforePage.$vm.getSolvedData();
				this.$store.state.storeshop.tabbarIndex == 0 ? this.$store.state.storeshop.tabbarIndex = 2 : this.$store.state.storeshop
					.tabbarIndex = 0
				uni.navigateBack()
			},
			// 上传图片
			async uploadFileImage() {
				this.successUploadFileImages = []
				let _this = this;
				for (let item of this.tempFilePaths) {
					try {
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
					} catch (e) {
						uni.showToast({
							title: e.msg,
							icon: 'none',
							duration: 3000
						});
					}
				}
			},
			// 请求部门列表
			async getPlanDeptList() {
				try {
					let data = await uni.request({
						method: 'GET',
						url: this.api.getDeptList
					})
					let [err, success] = data
					console.log('部门列表请求成功------>>>', err, success)
					if (success.data.success) {
						for (let item of success.data.data.deptlist) {
							item.noticeLabel = false
							item.reviewLabel = false
						}
						this.deptList = success.data.data.deptlist
					}
				} catch (e) {
					console.log(e)
				}
			},
			// 请求人员列表
			async getPlanUserList() {
				try {
					let data = await uni.request({
						method: 'GET',
						url: this.api.getUserList
					})
					let [err, success] = data
					console.log('人员列表请求成功------>>>', err, success)
					if (success.data.success) {
						for (let item of success.data.data.leaderlist) {
							item.noticeLabel = false
							item.reviewLabel = false
						}
						for (let item of success.data.data.deptuserlist) {
							for (let itm of item.userlist) {
								itm.noticeLabel = false
								item.reviewLabel = false
							}
						}
						this.userList = success.data.data
					}
				} catch (e) {
					console.log(e)
				}
			},
		},
		onLoad: function(option) {
			this.getPlanDeptList()
			this.getPlanUserList()
		},
		onShow: function() {

		}
	}
</script>

<style scoped lang="scss">
	.container {
		width: 100%;
		min-height: 100vh;
		background: #F6F7F9;

		>.scroll-view {
			max-height: 100vh;
		}

		.main {
			width: 710rpx;
			box-sizing: border-box;
			background: #fff;
			border-radius: 10rpx;
			padding: 0rpx 30rpx;
			margin: 20rpx;
			margin-bottom: 110rpx;

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
						width: calc(100%/3 - 12rpx);
						min-height: 60rpx;
						margin-right: 15rpx;
						margin-bottom: 15rpx;
						background: #F3F5F7;
						color: #647685;
						text-align: center;
						font-size: 24rpx;
						border-radius: 6rpx;
						border: 2rpx solid #F3F5F7;
						display: flex;
						align-items: center;
						justify-content: center;

						&.active {
							border-color: #40A9FF;
							background: #fff;
							box-shadow: 4rpx 8rpx 16rpx 0rpx rgba(0, 0, 0, 0.1);
						}

						&.item-add {
							width: 116rpx;
							border: 2rpx dashed #B6C6D6;
							background: #fff;
							color: #647484;
						}

						&:nth-child(3n) {
							margin-right: 0;
						}
					}
				}

				// 添加图片
				&.image-list {
					display: flex;
					flex-wrap: wrap;
					padding-bottom: 10rpx;

					.item {
						width: 116rpx;
						height: 116rpx;
						margin-bottom: 15rpx;
						margin-right: 15rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						overflow: hidden;
						position: relative;
						border-radius: 6rpx;

						>.icon {
							width: 100%;
							min-height: 100%;
						}

						&:before {
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
					}

					.choose-image {
						width: 116rpx;
						height: 116rpx;
						margin-bottom: 15rpx;
						border: 2rpx dashed #B6C6D6;
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

		.popup {
			padding: 30rpx;
			padding-bottom: 0;
			display: flex;
			flex-direction: column;

			.label-title {
				font-size: 30rpx;
				font-weight: 800;
				color: #647484;
				padding-left: 10rpx;
				padding-bottom: 10rpx;
			}

			.data-list {
				display: flex;
				flex-wrap: wrap;
				white-space: nowrap;

				.item {
					width: calc(100%/3 - 18rpx);
					min-height: 60rpx;
					border-radius: 6rpx;
					background-color: #F3F5F7;
					margin-right: 18rpx;
					margin-bottom: 18rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					flex-wrap: wrap;
					text-align: center;
					padding: 14rpx 10rpx;
					white-space: normal;
					border: 2rpx solid #F3F5F7;

					&.active {
						border-color: #40A9FF;
						background: #fff;
						box-shadow: 4rpx 8rpx 16rpx 0rpx rgba(0, 0, 0, 0.1);
					}

					.title {
						width: 100%;
						font-size: 24rpx;
						color: #647685;
					}

					.position {
						font-size: 20rpx;
						color: #999;
					}
				}
			}

			&.notice-dept {}

			&.notice-user {
				.data-list {
					margin-bottom: 20rpx;
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
	}
</style>
