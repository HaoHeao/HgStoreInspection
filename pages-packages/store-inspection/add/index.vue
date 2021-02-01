<template>
	<view class="container">
		<scroll-view scroll-y class="scroll-view">
			<view class="main">
				<view class="item-title">检查日期</view>
				<view class="item-view date">
					<picker class="item yearmonth" header-text="开始日期" mode="date" @change="selectMonthTime">
						<view :class="['picker-view',date?'':'nodata']">{{date?moment(date.replace(/-/g, '/')).format("YYYY年MM月DD日"):'检查日期'}}</view>
					</picker>
					<picker class="item hourminutes" header-text="开始时间" mode="time" @change="selectStartTime">
						<view :class="['picker-view',startTime?'':'nodata']">{{startTime?startTime:'开始时间'}}</view>
					</picker>
					<view class="txt">至</view>
					<picker class="item hourminutes" header-text="结束时间" mode="time" @change="selectEndTime">
						<view :class="['picker-view',endTime?'':'nodata']">{{endTime?endTime:'结束时间'}}</view>
					</picker>
				</view>
				<view class="item-title">检查机构及人员</view>
				<view class="item-view textarea-view">
					<textarea v-model="mechanismText" disable-default-padding auto-height fixed maxlength="200" class="textarea"
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
					<textarea v-model="userListText" disable-default-padding auto-height fixed maxlength="200" class="textarea"
					 placeholder="在此填写陪检人员"></textarea>
				</view>
				<view class="item-title">备注</view>
				<input v-model="remarkText" class="item-view remark" type="text" placeholder="在此填写备注" maxlength="500" />
				<view class="item-title">添加图片</view>
				<view class="item-view image-list">
					<view class="item" v-for="(item,index) of inspectionID?inspectionDetail.orgcheckimage:tempFilePaths" :key="index"
					 @click="delImage(index)">
						<image :src="inspectionID?item.url:item" class="icon" mode="widthFix"></image>
					</view>
					<view class="choose-image" @click="chooseImgage();">
						<image class="icon" src="@/static/icon/add_img.svg" mode="widthFix"></image>
					</view>
				</view>
			</view>
		</scroll-view>
		<view :class="['sublimt-btn',submitLoading?'sublimt-btn':'']" @click="submit()">
			<u-loading :show="submitLoading" mode="circle" size="28"></u-loading>
			{{submitLoading?'':inspectionID?'修改':'提交'}}
		</view>
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
				// 修改详细信息
				inspectionDetail: "",

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
				this.startTime = e.detail.value
				console.log(this.startTime)
			},
			selectEndTime(e) {
				this.endTime = e.detail.value
				console.log(this.endTime)
			},
			// 提交
			async submit() {
				if (!this.date) {
					uni.showToast({
						icon: 'none',
						title: "请选择检查日期",
						duration: 3000
					})
					return;
				}
				if (!this.startTime) {
					uni.showToast({
						icon: 'none',
						title: "请选择开始时间",
						duration: 3000
					})
					return;
				}
				if (!this.endTime) {
					uni.showToast({
						icon: 'none',
						title: "请选择结束时间",
						duration: 3000
					})
					return;
				}
				if (!this.mechanismText) {
					uni.showToast({
						icon: 'none',
						title: "请填写检查机构及人员",
						duration: 3000
					})
					return;
				}
				if (!this.contentText) {
					uni.showToast({
						icon: 'none',
						title: "请填写检查内容",
						duration: 3000
					})
					return;
				}
				if (!this.questionText) {
					uni.showToast({
						icon: 'none',
						title: "请填写问题及建议",
						duration: 3000
					})
					return;
				}
				if (!this.userListText) {
					uni.showToast({
						icon: 'none',
						title: "请填写陪检人员",
						duration: 3000
					})
					return;
				}
				if (this.submitLoading) return;
				this.submitLoading = true
				try {
					// 上传图片
					let orgcheckimage = [];
					if (this.inspectionID) {
						this.inspectionDetail.orgcheckimage.forEach(item => {
							orgcheckimage.push({
								orgcheckimgid: item.orgcheckimgid ? item.orgcheckimgid : '0',
								orgchecklogid: this.inspectionID,
								url: item.url,
								status: 1000,
								insertdate: this.moment().format('YYYY-MM-DD hh:mm:ss')
							})
						})
					} else {
						// 上传图片
						await this.uploadFileImage()
						this.successUploadFileImages.forEach(imgurl => {
							orgcheckimage.push({
								orgcheckimgid: 0,
								orgchecklogid: this.inspectionID ? this.inspectionID : '0',
								url: imgurl,
								status: 1000,
								insertdate: this.moment().format('YYYY-MM-DD hh:mm:ss')
							})
						})
					}
					let data = await uni.request({
						method: 'POST',
						url: this.inspectionID ? this.api.storeinspection_updata : this.api.storeinspection_submit,
						data: {
							orgchecklogid: this.inspectionID ? this.inspectionID : '0',
							chkdate: this.moment(this.date.replace(/-/g, '/')).format('YYYY-MM-DD hh:mm:ss'),
							chktime: `${this.startTime}~${this.endTime}`,
							orguser: this.mechanismText,
							compuser: this.userListText,
							chkplace: this.contentText,
							question: this.questionText,
							remark: this.remarkText,
							insertdate: this.moment().format('YYYY-MM-DD hh:mm:ss'),
							setuser: `${this.userinfo.usernumber}${this.userinfo.username}`,
							lstupdateuser: `${this.userinfo.usernumber}${this.userinfo.username}`,
							lstupdatedate: this.moment().format('YYYY-MM-DD hh:mm:ss'),
							status: 1000,
							orgcheckimage
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
			// 获取检查明细
			async getData() {
				if (this.getDataLoading) return
				this.getDataLoading = true
				try {
					let data = await uni.request({
						method: 'GET',
						url: `${this.api.storeinspection_getDetail}${this.inspectionID}`,
					})
					this.getDataLoading = false
					let [err, success] = data
					// console.log('查询成功------>>>', err, success)
					if (!err && success.data.success) {
						this.inspectionDetail = success.data.data.checklog
						this.date = this.inspectionDetail.chkdate;
						this.startTime = this.inspectionDetail.chktime.split('~')[0];
						this.endTime = this.inspectionDetail.chktime.split('~')[1];
						this.mechanismText = this.inspectionDetail.orguser;
						this.contentText = this.inspectionDetail.chkplace;
						this.questionText = this.inspectionDetail.question;
						this.userListText = this.inspectionDetail.compuser;
						this.remarkText = this.inspectionDetail.remark;
						console.log('获取检查明细成功------>>>', this.inspectionDetail)
					} else {
						uni.showToast({
							title: err ? err : success.data.errmsg,
							icon: 'none',
							duration: 3000
						});
					}
				} catch (e) {
					this.getDataLoading = false
					console.log(e)
				}
			},
			// 修改删除图片
			delImage(index) {
				if (this.inspectionID) {
					let _this = this;
					uni.showModal({
						title: '您确定删除此图片吗？',
						success: async function(res) {
							if (res.confirm) {
								let data = await uni.request({
									method: 'GET',
									url: _this.api.storeinspection_delImage,
									data: {
										orgcheckimgid: _this.inspectionDetail.orgcheckimage[index].orgcheckimgid,
									}
								})
								let [err, success] = data
								console.log("删除成功", success)
								if (success.data.success) {
									_this.inspectionDetail.orgcheckimage.splice(index, 1)
								}
							}
						}
					});
				} else {
					this.tempFilePaths.splice(index, 1)
				}
			},
			// 选择图片
			chooseImgage() {
				let _this = this;
				if (this.inspectionID) {
					this.tempFilePaths = []
				}
				uni.chooseImage({
					success: async function(res) {
						_this.utils.imagesFilter(res.tempFiles)
						_this.tempFilePaths = _this.tempFilePaths.concat(res.tempFiles.map(item => item.path))
						if (_this.inspectionID) {
							await _this.uploadFileImage()
						}
					}
				});
			},
			// 上传图片
			async uploadFileImage() {
				this.successUploadFileImages = [];
				for (let item of this.tempFilePaths) {
					try {
						let uploadResult = await uni.uploadFile({
							url: this.api.uploadImage,
							filePath: item,
							name: 'file',
							method: "POST",
						})
						let [err, success] = uploadResult
						if (!err && JSON.parse(success.data).code == 0) {
							if (this.inspectionID) {
								this.inspectionDetail.orgcheckimage.push({
									orgcheckimgid: 0,
									url: JSON.parse(success.data).data.url
								})
							} else {
								this.successUploadFileImages.push(JSON.parse(success.data).data.url)
							}
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
			// 返回上一页并更新
			UpdateNavigationBack() {
				let pages = getCurrentPages();
				let beforePage = pages[pages.length - 2];
				beforePage.$vm.getData();
				wx.navigateBack({
					delta: 1
				})
			},
		},
		onLoad: function(option) {
			console.log(option)
			if (option.inspectionID) {
				this.inspectionID = option.inspectionID
				this.getData()
			}
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
			padding-bottom: 10rpx;
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
						overflow: hidden;

						&.yearmonth {
							flex: 2;
							margin-right: 10rpx;

							.picker-view {
								width: 260rpx;
							}
						}

						&.hourminutes {
							width: 160rpx;

							.picker-view {
								width: 160rpx;
							}
						}

						.picker-view {
							height: 70rpx;
							display: flex;
							align-items: center;
							justify-content: center;

							&.nodata {
								color: #B6C6D6;
							}
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
