<template>
	<view class="container">
		<scroll-view scroll-y class="scroll-view">
			<view class="main">
				<view class="item-title">检查日期</view>
				<view class="item-view date">
					<picker :class="['item yearmonth',date?'':'nodata']" header-text="开始日期" mode="date" fields="month" @change="selectMonthTime">
						{{moment(date).format("YYYY年MM月")}}
					</picker>
					<picker :class="['item hourminutes',startTime?'':'nodata']" header-text="开始时间" mode="date" fields="time" @change="selectstartTime">
						{{moment(startTime).format("hh:mm")}}
					</picker>
					<view class="txt">至</view>
					<picker :class="['item hourminutes',endTime?'':'nodata']" header-text="结束时间" mode="date" fields="time" @change="selectendTime">
						{{moment(endTime).format("hh:mm")}}
					</picker>
				</view>
				<view class="item-title">检查机构及人员</view>
				<view class="item-view textarea-view">
					<textarea v-model="mechanismText" disable-default-padding auto-height fixed maxlength="500" class="textarea"
					 placeholder="在此填写检查机构及人员"></textarea>
				</view>
				<view class="item-title">检查内容</view>
				<view class="item-view textarea-view">
					<textarea v-model="contentText" disable-default-padding auto-height fixed maxlength="500" class="textarea"
					 placeholder="在此填写检查内容"></textarea>
				</view>
				<view class="item-title">问题及建议</view>
				<view class="item-view textarea-view">
					<textarea v-model="questionText" disable-default-padding auto-height fixed maxlength="500" class="textarea"
					 placeholder="在此填写问题及建议"></textarea>
				</view>
				<view class="item-title">陪检人员</view>
				<view class="item-view textarea-view">
					<textarea v-model="userListText" disable-default-padding auto-height fixed maxlength="500" class="textarea"
					 placeholder="在此填写陪检人员"></textarea>
				</view>
				<view class="item-title">备注</view>
				<view class="item-view remark">
					<input v-model="remarkText" class="input" type="text" placeholder="在此填写备注" />
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
				inspectionID: "",
				// 检查日期
				date: "",
				// 开始时间
				startTime: "",
				// 结束时间
				endTime: "",
				// 检查机构及人员
				mechanismText: "",
				// 检查内容
				contentText: "",
				// 问题及建议
				questionText: "",
				// 陪检人员
				userListText: "",
				// 备注
				remarkText: "",

				// 传参ID
				inspection: '',

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
			selectMonthTime(e) {
				this.date = e.detail.value.replace(/-/g, '/')
				console.log(this.date)
			},
			selectStartTime(e) {
				this.startTime = e.detail.value.replace(/-/g, '/')
				console.log(this.startTime)
			},
			selectEndTime(e) {
				this.endTime = e.detail.value.replace(/-/g, '/')
				console.log(this.endTime)
			},
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
				if (this.submitLoading) return;
				try {
					this.submitLoading = true
					// 上传图片
					await this.uploadFileImage()
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
			// 选择图片
			chooseImgage() {
				let _this = this;
				uni.chooseImage({
					success: function(res) {
						_this.utils.imagesFilter(res.tempFiles)
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
		},
		onLoad: function(option) {
			console.log(option)
			option.inspectionID ? this.inspectionID = option.inspectionID : ''
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
			}

			// 内容
			.item-view {
				color: #647685;
				box-sizing: border-box;
				overflow: hidden;

				// 检查日期
				&.date {
					display: flex;
					align-items: center;

					.item {
						background: #F3F5F7;
						border-radius: 10rpx;
						color: #333;
						height: 70rpx;
						display: flex;
						justify-content: center;
						align-items: center;

						&.yearmonth {
							flex: 2;
							margin-right: 10rpx;
						}

						&.hourminutes {
							width: 160rpx;
						}

						&.nodata {
							color: #B6C6D6;
						}
					}

					.txt {
						padding: 0 14rpx;
						color: #333;
					}
				}

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

				// 备注
				&.remark {
					display: flex;
					align-items: center;
					background: #F3F5F7;
					color: #647685;
					height: 80rpx;
					border-radius: 10rpx;
					padding-left: 20rpx;
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
	}
</style>
