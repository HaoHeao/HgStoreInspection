<template>
	<view class="container detail">
		<scroll-view class="scroll-view" scroll-y refresher-enabled scroll-with-animation :enable-back-to-top="setting.enableBackToTop"
		 :refresher-triggered="getDataLoading" @refresherrefresh="onRefresh" @refresherrestore="onRestore">
			<skeleton v-if="!inspectionDetail"></skeleton>
			<block v-if="inspectionDetail">
				<view style="height: 20rpx;"></view>
				<view class="module info">
					<view class="detail-item">
						<view class="item">上传人</view>
						<view class="content">{{inspectionDetail.setuser}}
						</view>
					</view>
					<view class="detail-item">
						<view class="item">检查日期</view>
						<view class="content">{{`${moment(inspectionDetail.chkdate.replace(/-/g, '/')).format("YYYY年MM月DD日")}  ${inspectionDetail.chktime.replace(/~/g, ' - ')}`}}</view>
					</view>
					<view class="detail-item">
						<view class="item">检查机构及人员</view>
						<view class="content">{{inspectionDetail.orguser}}</view>
					</view>
					<view class="detail-item">
						<view class="item">检查内容</view>
						<view class="content">{{inspectionDetail.chkplace}}</view>
					</view>
					<view class="detail-item">
						<view class="item">问题及意见</view>
						<view class="content">{{inspectionDetail.question}}</view>
					</view>
					<view class="detail-item">
						<view class="item">陪检人员</view>
						<view class="content">{{inspectionDetail.compuser}}</view>
					</view>
					<view class="detail-item" v-if="inspectionDetail.remark">
						<view class="item">备注</view>
						<view class="content">{{inspectionDetail.remark}}</view>
					</view>
				</view>
				<view class="module image" v-if="inspectionDetail.orgcheckimage.length">
					<view class="head">
						<view class="title">图片</view>
						<view class="number">共 {{inspectionDetail.orgcheckimage.length}} 张</view>
					</view>
					<view class="image-list">
						<view class="image" v-for="(item,index) of inspectionDetail.orgcheckimage" :key="index" @tap.stop="previewImage(inspectionDetail.orgcheckimage,index)">
							<image :src="item.url" mode="widthFix" class="icon"></image>
						</view>
					</view>
				</view>
				<view class="control-list" v-if="inspectionDetail.setuser.slice(0,5) == userinfo.usernumber">
					<view class="item del" @click="withdraw()">
						<image src="@/static/icon/del_white.svg" mode="widthFix" class="icon"></image>撤回
					</view>
					<view class="item" @click="modify()">
						<image src="@/static/icon/modify-white.svg" mode="widthFix" class="icon"></image>修改
					</view>
				</view>
				<u-loadmore :status="getDataLoading?'loading':'nomore'" :icon-type="setting.iconType" :load-text="setting.loadText"
				 :is-dot="setting.isDot" :font-size="setting.loadmoreFontSize" :height="setting.loadmoreHeight" />
			</block>
		</scroll-view>
	</view>
</template>

<script>
	import skeleton from './skeleton.vue'
	export default {
		components: {
			skeleton
		},
		data() {
			return {
				// ID
				inspectionlogid: '',
				// 巡检明细
				inspectionDetail: null,
				getDataLoading: false,
			}
		},
		computed: {
			setting() {
				return this.$store.state.setting
			},
			userinfo() {
				return this.utils.getUserInfo()
			}
		},
		methods: {
			// 触发下拉刷新
			async onRefresh() {
				await this.getData();
			},
			// 刷新完成/重置
			onRestore() {
				this.getDataLoading = false
			},
			// 获取检查明细
			async getData() {
				if (this.getDataLoading) return
				this.getDataLoading = true
				try {
					let data = await uni.request({
						method: 'GET',
						url: `${this.api.storeinspection_getDetail}${this.inspectionlogid}`,
					})
					this.getDataLoading = false
					let [err, success] = data
					// console.log('查询成功------>>>', err, success)
					if (!err && success.data.success) {
						this.inspectionDetail = success.data.data.checklog
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
			// 撤回
			withdraw() {
				let _this = this;
				uni.showModal({
					title: '您确定撤回吗？',
					success: async function(res) {
						if (res.confirm) {
							let data = await uni.request({
								method: 'GET',
								url: _this.api.storeinspection_withdraw,
								data: {
									orgchecklogid: _this.inspectionlogid,
								}
							})
							let [err, success] = data
							console.log("撤回成功", success)
							if (success.data.success) {
								uni.showToast({
									title: '撤回成功！',
									icon: 'none'
								})
								_this.UpdateNavigationBack()
							}
						}
					}
				});
			},
			// 修改
			modify() {
				uni.navigateTo({
					url: "../add/index?inspectionID=" + this.inspectionlogid
				})
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
			// 查看图片
			previewImage(list, index) {
				uni.previewImage({
					current: index,
					urls: list.filter(item => item.url).map(item => item.url)
				});
			},
		},
		onLoad(option) {
			this.inspectionlogid = option.inspectionlogid
			this.getData()
		},
		onShow: function() {}
	}
</script>

<style scoped lang="scss">
	@import '@/styles/detail.scss';

	.container {
		background: #E5EDF1;
		height: 100vh;

		.scroll-view {
			height: 100vh;

			.module {
				background: #fff;
				width: calc(100% - 40rpx);
				margin: 0 20rpx;
				margin-bottom: 20rpx;
				border-radius: 10rpx;
				padding: 0rpx 20rpx;
				box-sizing: border-box;

				// 信息
				&.info {
					padding: 20rpx;

					.detail-item {
						width: 100%;
						padding: 12rpx 0rpx;
						display: flex;
						font-size: 26rpx;
						padding-top: 0;

						.item {
							color: #A4B1BE;
							width: 4em;
							min-width: 4em;
							margin-right: 20rpx;
						}

						.content {
							color: #323436;
							width: 100%;
							word-break: break-all;
						}

						&:last-child {
							padding-bottom: 0rpx;
						}
					}
				}

				// 图片
				&.image {
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

					.image-list {
						display: flex;
						flex-wrap: wrap;
						padding: 20rpx;
						padding-bottom: 5rpx;

						.image {
							width: 118rpx;
							height: 118rpx;
							margin-bottom: 15rpx;
							margin-right: 15rpx;
							display: flex;
							border: 2rpx solid transparent;
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
				}
			}

			.control-list {
				position: static;
				padding-right: 20rpx;
				// background: transparent;
				// padding: 0;
			}
		}
	}
</style>
