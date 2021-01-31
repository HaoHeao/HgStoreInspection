<template>
	<view class="container">
		<scroll-view class="scroll-view" scroll-y refresher-enabled scroll-with-animation :enable-back-to-top="setting.enableBackToTop"
		 :refresher-triggered="getDataRefresherLoading" @refresherrefresh="onRefresh" @refresherrestore="onRestore">
			<!-- <skeleton v-if="!inspectionDetail"></skeleton>
			<block v-if="inspectionDetail"> -->
			<view style="height: 20rpx;"></view>
			<view class="module info">
				<view class="detail-item">
					<view class="item">上传人</view>
					<view class="content">信息开发部 - 马浩
					</view>
				</view>
				<view class="detail-item">
					<view class="item">巡查日期</view>
					<view class="content">2021年01月29日 10:00 - 17:30</view>
				</view>
				<view class="detail-item">
					<view class="item">检查机构及人员</view>
					<view class="content">
						西城区消防总队李某某、西城区应急抢险中心刘某、西城区消防支队赵某某
						<!-- <block v-for="(item,index) of inspectionDetail.mapinspectiondept" :key="index" v-if="inspectionDetail.mapinspectiondept.length">
							{{index == 0?inspectionDetail.mapinspectiondept[0].deptname:'、' + item.deptname}}
						</block>
						<block v-if="!inspectionDetail.mapinspectiondept.length">未指定部门</block> -->
					</view>
				</view>
				<view class="detail-item">
					<view class="item">检查内容</view>
					<view class="content">
						位置或项目描述位置或项目描述位置或项目描述位置或项目描述位置或项目描述位置或项目描述位置或项目描述位置或项目描述
						<!-- <block v-for="(item,index) of inspectionDetail.mapinspectionuser" :key="index" v-if="inspectionDetail.mapinspectionuser.length">
							{{index == 0?inspectionDetail.mapinspectionuser[0].username:'、' + item.username}}
						</block>
						<block v-if="!inspectionDetail.mapinspectionuser.length">未指定人员</block> -->
					</view>
				</view>
				<view class="detail-item">
					<view class="item">问题及意见</view>
					<view class="content">问题或意见问题或意见问题或意见问题或意见问题或意见问题或意见问题或意见问题或意见问题或意见</view>
				</view>
				<view class="detail-item">
					<view class="item">陪检人员</view>
					<view class="content">李经理、蒋主管、孙经理、王晓明、刘永强、周东义、孙世豪、刘英</view>
				</view>
				<view class="detail-item">
					<view class="item">备注</view>
					<view class="content">备注备注备注备注备注备注备注备注备注备注备注备注备注</view>
				</view>
			</view>
			<view class="module image">
				<view class="head">
					<view class="title">图片</view>
					<view class="number">共 3 张</view>
				</view>
				<view class="image-list">
					<view class="image">
						<image src="@/static/icon/show_password.svg" mode="widthFix" class="icon"></image>
					</view>
					<view class="image">
						<image src="@/static/icon/show_password.svg" mode="widthFix" class="icon"></image>
					</view>
					<view class="image">
						<image src="@/static/icon/show_password.svg" mode="widthFix" class="icon"></image>
					</view>
					<view class="image">
						<image src="@/static/icon/show_password.svg" mode="widthFix" class="icon"></image>
					</view>
					<view class="image">
						<image src="@/static/icon/show_password.svg" mode="widthFix" class="icon"></image>
					</view>
					<view class="image">
						<image src="@/static/icon/show_password.svg" mode="widthFix" class="icon"></image>
					</view>
					<!-- <view class="image" v-for="(item,index) of inspectionDetail.loginspectionimg" :key="index" @tap.stop="previewImage(inspectionDetail.loginspectionimg,index)">
						<image :src="item.imgurl" mode="widthFix" class="icon"></image>
					</view> -->
				</view>
			</view>
			<u-loadmore :class="inspectionDetail && inspectionDetail.feedback?'loadmore-view':''" status="nomore" :icon-type="setting.iconType"
			 :load-text="setting.loadText" :is-dot="setting.isDot" :font-size="setting.loadmoreFontSize" :margin-top="setting.loadmoreMarginTop"
			 :margin-bottom="setting.loadmoreMarginBottom" />
			<!-- </block> -->
		</scroll-view>
		<view class="sublimt-btn" @click="openFeedbackPopup()">修改</view>
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
				inspectionlogid: '',
				// 巡检明细
				inspectionDetail: null,
				getDataRefresherLoading: false,
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
				this.getDataRefresherLoading = true
				await this.getInspectionDetail();
				this.getDataRefresherLoading = false
			},
			// 刷新完成/重置
			onRestore() {
				this.getDataRefresherLoading = false
			},
			// 查看图片
			previewImage(list, index) {
				uni.previewImage({
					current: index,
					urls: list.filter(item => item.imgurl).map(item => item.imgurl)
				});
			},
		},
		onLoad(option) {
			this.inspectionlogid = option.inspectionlogid
		},
		onShow: function() {}
	}
</script>

<style scoped lang="scss">
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
							width: 125rpx;
							min-width: 125rpx;
						}

						.content {
							color: #323436;
							width: 100%;
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
		}
	}
</style>
