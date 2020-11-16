<template>
	<view class="container">
		<scroll-view scroll-y class="scroll-view">
			<view class="main">
				<view class="item-title">问题描述</view>
				<view class="item-view textarea-view">
					<textarea v-model="question" disable-default-padding auto-height fixed maxlength="500" class="textarea" placeholder="在此填写问题描述"></textarea>
				</view>
				<block v-if="floorList.length">
					<view class="item-title">楼层</view>
					<view class="item-view label-add floor">
						<view :class="['item',item.floorvalue == floor?'active':'']" v-for="(item,index) of floorList" :key="index"
						 @click="floor == item.floorvalue?floor = '':floor = item.floorvalue">{{item.floorname}}</view>
					</view>
				</block>
				<view class="item-title">位置</view>
				<view class="item-view place">
					<input v-model="place" class="input" type="text" placeholder="在此填写位置" />
					<image src="@/static/icon/scan-code.svg" mode="widthFix" class="icon" @click="scanCode()"></image>
				</view>
				<view class="item-title">整改部门</view>
				<view class="item-view label-add">
					<view class="item" v-for="(item,index) of deptList" :key="index" v-if="item.rectifyLabel">{{item.deptname}}</view>
					<view class="item item-add" @click="$refs['rectifyDept'].open()">+</view>
				</view>
				<view class="item-title">整改人员</view>
				<view class="item-view label-add">
					<view class="item" v-for="(item,index) of userList.leaderlist" :key="index" v-if="item.rectifyLabel">{{item.username}}</view>
					<block v-for="(item,index) of userList.deptuserlist" :key="index">
						<view class="item" v-for="(itm,ind) of item.userlist" :key="ind" v-if="itm.rectifyLabel">{{itm.username}}</view>
					</block>
					<view class="item item-add" @click="$refs['rectifyUser'].open()">+</view>
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
				<view class="item-title">复核部门或人员</view>
				<view class="item-view label-add">
					<view class="item" v-for="(item,index) of deptList" :key="index" v-if="item.reviewLabel">{{item.deptname}}</view>
					<view class="item" v-for="(item,index) of userList.leaderlist" :key="index" v-if="item.reviewLabel">{{item.username}}</view>
					<block v-for="(item,index) of userList.deptuserlist" :key="index">
						<view class="item" v-for="(itm,ind) of item.userlist" :key="ind" v-if="itm.reviewLabel">{{itm.username}}</view>
					</block>
					<view class="item item-add" @click="$refs['review'].open()">+</view>
				</view>
				<view class="item-title tip">
					<image src="@/static/icon/tip.svg" mode="widthFix" class="icon"></image>
					如未指定则复核人员为提交人
				</view>
			</view>
		</scroll-view>
		<view :class="['sublimt-btn',submitLoading?'sublimt-btn':'']" @click="submit()">
			<u-loading :show="submitLoading" mode="circle" size="28"></u-loading>
			{{submitLoading?'':'提交'}}
		</view>
		<uni-popup ref="rectifyDept" type="bottom" :maskClick="false">
			<view class="popup rectify-dept top">
				<view class="title">
					<text class="content">整改部门</text>
					<view class="close" @click="$refs['rectifyDept'].close()">关闭</view>
				</view>
				<scroll-view scroll-y class="popup-content">
					<view class="data-list">
						<view :class="['item',item.rectifyLabel?'active':'']" v-for="(item,index) of deptList" :key="index" @click="deptList.filter(itm => itm.deptid == item.deptid)[0].rectifyLabel = ! deptList.filter(itm => itm.deptid == item.deptid)[0].rectifyLabel">
							<view class="title">{{item.deptname}}</view>
						</view>
					</view>
				</scroll-view>
				<view class="bottom-control">
					<view class="content">
						<view class="close" @click="dataListReset('rectifyDept')">重置</view>
					</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="rectifyUser" type="bottom" :maskClick="false">
			<view class="popup rectify-user top">
				<view class="title">
					<text class="content">整改人员</text>
					<view class="close" @click="$refs['rectifyUser'].close()">关闭</view>
				</view>
				<scroll-view scroll-y class="popup-content">
					<block v-if="userList.leaderlist.length">
						<view class="label-title">主要领导</view>
						<view class="data-list">
							<view :class="['item',item.rectifyLabel?'active':'']" v-for="(item,index) of userList.leaderlist" :key="index"
							 @click="userList.leaderlist.filter(itm => itm.usernumber == item.usernumber)[0].rectifyLabel = ! userList.leaderlist.filter(itm => itm.usernumber == item.usernumber)[0].rectifyLabel">
								<view class="title">{{item.username}}</view>
								<view class="position" v-if="item.postion">{{item.postion}}</view>
							</view>
						</view>
					</block>
					<block v-for="(item,index) of userList.deptuserlist" :key="index">
						<view class="label-title">{{item.deptname}}</view>
						<view class="data-list">
							<view :class="['item',itm.rectifyLabel?'active':'']" v-for="(itm,ind) of item.userlist" :key="ind" @click="deptUserSelect(itm,'rectify')">
								<view class="title">{{itm.username}}</view>
								<view class="position" v-if="itm.postion">{{itm.postion}}</view>
							</view>
						</view>
					</block>
				</scroll-view>
				<view class="bottom-control">
					<view class="content">
						<view class="close" @click="dataListReset('rectifyUser')">重置</view>
					</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="review" type="bottom" :maskClick="false">
			<view class="popup review top">
				<view class="title">
					<text class="content">复核部门或人员</text>
					<view class="close" @click="$refs['review'].close()">关闭</view>
				</view>
				<scroll-view scroll-y class="popup-content">
					<view class="label-title">复核部门</view>
					<view class="data-list">
						<view :class="['item',item.reviewLabel?'active':'']" v-for="(item,index) of deptList" :key="index" @click="deptList.filter(itm => itm.deptid == item.deptid)[0].reviewLabel = ! deptList.filter(itm => itm.deptid == item.deptid)[0].reviewLabel">
							<view class="title">{{item.deptname}}</view>
						</view>
					</view>
					<block v-if="userList.leaderlist.length">
						<view class="label-title">主要领导</view>
						<view class="data-list">
							<view :class="['item',item.reviewLabel?'active':'']" v-for="(item,index) of userList.leaderlist" :key="index"
							 @click="userList.leaderlist.filter(itm => itm.usernumber == item.usernumber)[0].reviewLabel = ! userList.leaderlist.filter(itm => itm.usernumber == item.usernumber)[0].reviewLabel">
								<view class="title">{{item.username}}</view>
								<view class="position" v-if="item.postion">{{item.postion}}</view>
							</view>
						</view>
					</block>
					<block v-for="(item,index) of userList.deptuserlist" :key="index">
						<view class="label-title">{{item.deptname}}</view>
						<view class="data-list">
							<view :class="['item',itm.reviewLabel?'active':'']" v-for="(itm,ind) of item.userlist" :key="ind" @click="deptUserSelect(itm,'review')">
								<view class="title">{{itm.username}}</view>
								<view class="position" v-if="itm.postion">{{itm.postion}}</view>
							</view>
						</view>
					</block>
				</scroll-view>
				<view class="bottom-control">
					<view class="content">
						<view class="close" @click="dataListReset('review')">重置</view>
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
				planid: '',
				// 问题描述
				question: "",
				// 楼层
				floor: '',
				floorList: [],
				// 位置
				place: "",
				// 部门列表
				deptList: [],
				// 人员列表
				userList: [],
				// 待上传图片列表
				tempFilePaths: [],
				// 上传成功的有效已选择的图片
				successUploadFileImages: [],
				// 复核部门或人员
				reviewDeptUserList: [],

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
						title: "请填写问题描述",
						duration: 3000
					})
					return;
				}
				if (!this.place) {
					uni.showToast({
						icon: 'none',
						title: "请填写位置",
						duration: 3000
					})
					return;
				}
				// 整改人员或部门必须选择一个
				if (!this.deptList.filter(item => item.rectifyLabel).length &&
					!this.userList.leaderlist.filter(item => item.rectifyLabel).length &&
					!this.userList.deptuserlist.filter(item => item.userlist.filter(itm => itm.rectifyLabel).length).length
				) {
					uni.showToast({
						icon: 'none',
						title: "请选择整改人员或部门",
						duration: 3000
					})
					return;
				}
				if (this.submitLoading) return;
				try {
					this.submitLoading = true
					// 上传图片
					await this.uploadFileImage()

					let mapplaninspectiondept = [],
						mapplaninspectionuser = [],
						planinspectionsolveuser = [],
						planinspectionquestionImg = [];

					// 整改部门
					this.deptList.filter(item => item.rectifyLabel).forEach(i => {
						mapplaninspectiondept.push({
							mpidid: 0,
							planquestionid: 0,
							deptid: i.deptid,
							deptname: i.deptname,
							insertdate: this.moment().format('YYYY-MM-DD hh:mm:ss')
						})
					})
					// 整改人员
					// 主要人员
					this.userList.leaderlist.filter(item => item.rectifyLabel).forEach(i => {
						mapplaninspectionuser.push({
							mpiuid: 0,
							planquestionid: 0,
							userid: i.userid, //通知人的id
							usernumber: i.usernumber, //通知人的工号
							username: i.username, //通知人的姓名
							mobile: i.mobile, //通知人的手机号
							deptid: i.deptid, //通知人的部门id
							deptname: i.deptname, //通知人的部门名称
							insertdate: this.moment().format('YYYY-MM-DD hh:mm:ss')
						})
					})
					// 其他人员
					this.userList.deptuserlist.forEach(item => {
						item.userlist.filter(itm => itm.rectifyLabel).forEach(i => {
							mapplaninspectionuser.push({
								mpiuid: 0,
								planquestionid: 0,
								userid: i.userid, //通知人的id
								usernumber: i.usernumber, //通知人的工号
								username: i.username, //通知人的姓名
								mobile: i.mobile, //通知人的手机号
								deptid: i.deptid, //通知人的部门id
								deptname: i.deptname, //通知人的部门名称
								insertdate: this.moment().format('YYYY-MM-DD hh:mm:ss')
							})
						})
					})
					// 复核部门或人员
					// 部门
					this.deptList.filter(item => item.reviewLabel).forEach(i => {
						planinspectionsolveuser.push({
							solveid: 0,
							planquestionid: 0,
							solvetype: 1, //1为部门，2为人员
							itemno: i.deptno,
							itemname: i.deptname,
							status: 1000,
							insertdate: this.moment().format('YYYY-MM-DD hh:mm:ss'),
							lstupdatedate: this.moment().format('YYYY-MM-DD hh:mm:ss')
						})
					})
					// 复核主要人员
					this.userList.leaderlist.filter(item => item.reviewLabel).forEach(i => {
						planinspectionsolveuser.push({
							solveid: 0,
							planquestionid: 0,
							solvetype: 2, // 1为部门，2为人员
							itemno: i.usernumber,
							itemname: i.username,
							status: 1000,
							insertdate: this.moment().format('YYYY-MM-DD hh:mm:ss'),
							lstupdatedate: this.moment().format('YYYY-MM-DD hh:mm:ss')
						})
					})
					// 其他人员
					this.userList.deptuserlist.forEach(item => {
						item.userlist.filter(i => i.reviewLabel).forEach(i => {
							planinspectionsolveuser.push({
								solveid: 0,
								planquestionid: 0,
								solvetype: 2, // 1为部门，2为人员
								itemno: i.usernumber,
								itemname: i.username,
								status: 1000,
								insertdate: this.moment().format('YYYY-MM-DD hh:mm:ss'),
								lstupdatedate: this.moment().format('YYYY-MM-DD hh:mm:ss')
							})
						})
					})
					// 上传图片
					this.successUploadFileImages.forEach(imgurl => {
						planinspectionquestionImg.push({
							planquestionimgid: 0,
							planquestionid: 0,
							planid: this.planid,
							imgurl,
							uploaddate: this.moment().format('YYYY-MM-DD hh:mm:ss')
						})
					})
					let data = await uni.request({
						method: 'POST',
						url: this.api.plan_submitQuestion,
						data: {
							planinspectionquestion: {
								planquestionid: 0,
								planid: this.planid, //计划id
								pitemid: 0, //巡检项目id
								iname: "", //巡检项目名称
								question: this.question, //问题
								inspectionplace: this.place, //位置
								remark: "", //备注
								usernumber: this.userinfo.usernumber, //提交人工号
								username: this.userinfo.username, //提交人
								insertdate: this.moment().format('YYYY-MM-DD hh:mm:ss'), //提交时间，可以为空
								deptid: this.userinfo.deptid, //提交人部门id
								deptno: "", //提交人部门名称
								deptname: this.userinfo.deptname,
								lstupdatedate: this.moment().format('YYYY-MM-DD hh:mm:ss'), //修改时间 可为空
								lstuserid: "", //修改人
								status: 1000, //状态
								other1: this.floor, //楼层
								other2: "", //为空
								confirmuserid: "", //为空
								confirmdate: "", //为空
								isnormal: 0, //为0即可
								planinspectionquestionImg,
								mapplaninspectiondept,
								mapplaninspectionuser,
								planinspectionsolveuser
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
					console.log(e)
					this.submitLoading = false
				}
			},
			// 部门人员选择重置
			dataListReset(type) {
				if (type == 'rectifyDept') {
					this.deptList.forEach(item => {
						item.rectifyLabel = false
					})
				} else if (type == 'rectifyUser') {
					for (let item of this.userList.leaderlist) {
						item.rectifyLabel = false
					}
					for (let item of this.userList.deptuserlist) {
						for (let itm of item.userlist) {
							itm.rectifyLabel = false
						}
					}
				} else if (type == 'review') {
					for (let item of this.userList.leaderlist) {
						item.reviewLabel = false
					}
					for (let item of this.userList.deptuserlist) {
						for (let itm of item.userlist) {
							itm.reviewLabel = false
						}
					}
					this.deptList.forEach(item => {
						item.reviewLabel = false
					})
				}
			},
			// 选择二级人员
			deptUserSelect(item, type) {
				for (let itm of this.userList.deptuserlist) {
					for (let it of itm.userlist) {
						if (it.usernumber == item.usernumber && type == 'rectify') it.rectifyLabel = !it.rectifyLabel
						if (it.usernumber == item.usernumber && type == 'review') it.reviewLabel = !it.reviewLabel
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
				let pages = getCurrentPages();
				let beforePage = pages[pages.length - 2];
				beforePage.$vm.getInspectionDetail('-1');
				wx.navigateBack({
					delta: 1
				})
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
					console.log('解析导购工牌请求成功------>>>', err, success)
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
						method: 'GET',
						url: this.api.getDeptList
					})
					let [err, success] = data
					console.log('部门列表请求成功------>>>', err, success)
					if (success.data.success) {
						for (let item of success.data.data.deptlist) {
							item.rectifyLabel = false
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
							item.rectifyLabel = false
							item.reviewLabel = false
						}
						for (let item of success.data.data.deptuserlist) {
							for (let itm of item.userlist) {
								itm.rectifyLabel = false
								item.reviewLabel = false
							}
						}
						this.userList = success.data.data
					}
				} catch (e) {
					console.log(e)
				}
			},
			// 请求楼层列表
			async getPlanFloorList() {
				try {
					let data = await uni.request({
						method: 'GET',
						url: this.api.getFloorlist
					})
					let [err, success] = data
					console.log('楼层列表请求成功------>>>', err, success)
					if (success.data.success) {
						this.floorList = success.data.data.floor
					}
				} catch (e) {
					console.log(e)
				}
			},
		},
		onLoad: function(option) {
			console.log(option)
			this.planid = option.planid
			this.getPlanDeptList()
			this.getPlanUserList()
			this.getPlanFloorList()
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
			margin-bottom: calc(140rpx + env(safe-area-inset-bottom));

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

				// 楼层
				&.floor {
					.item {
						width: calc(100%/5 - 12rpx);

						&:nth-child(3n) {
							margin-right: 15rpx;
						}

						&:nth-child(5n) {
							margin-right: 0rpx;
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
					flex-wrap: wrap;

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

			&.rectify-dept {}

			&.rectify-user,
			&.review {
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
