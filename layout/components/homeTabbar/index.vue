<template>
	<view class="container">
		<view class="main">
			<block v-for="(item,index) of home.tabbar" :key="index">
				<view :class="index == home.tabbarIndex?'item active':'item'" @click="selectTabbar(index)">
					<view class="image">
						<image :src="index == home.tabbarIndex?item.iconPath:item.selectedIconPath" mode="widthFix" class="icon"></image>
					</view>
					<view class="text">{{item.text}}</view>
				</view>
			</block>
		</view>
		<view class="work_view" v-if="work_view">
			<view class="content">
				<view class="mark fadeIn" @click="work_view = !work_view"></view>
				<view class="module_list" v-if="userinfo.menulist.length">
					<block v-if="userinfo.menulist.length">
						<view class="item" v-for="(item,index) of userinfo.menulist" :key="index" @click="toModule(item.mcode)">
							<view class="icon-view">
								<image :src="require(`@/static/tabbar/work/${item.mcode?item.mcode:'item'}.svg`)" mode="widthFix" class="icon"></image>
							</view>
							<view class="txt">{{item.mname}}</view>
						</view>
						
						<view class="item" @click="toModule('store-inspection')">
							<view class="icon-view">
								<image src="@/static/tabbar/work/store-inspection.svg" mode="widthFix" class="icon"></image>
							</view>
							<view class="txt">卖场检查</view>
						</view>
						<!-- <view class="item" @click="toModule('spot-check')">
							<view class="icon-view">
								<image src="@/static/tabbar/work/spot-check.svg" mode="widthFix" class="icon"></image>
							</view>
							<view class="txt">店面抽盘</view>
						</view> -->
					</block>
				</view>
				<view class="no-model" v-if="!userinfo.menulist.length">
					<view class="tips">您没有任何权限！</view>
					<view class="refresh" @click="refreshModel()">重新获取权限</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				work_view: false
			}
		},
		computed: {
			home() {
				return this.$store.state.home;
			},
			userinfo() {
				return this.utils.getUserInfo();
			}
		},
		methods: {
			selectTabbar(index) {
				if (index == 0) {
					uni.setNavigationBarTitle({
						title: "我的消息"
					});
				} else if (index == 1) {
					// 加载查看权限
					this.work_view = !this.work_view;
					return;
				} else if (index == 2) {
					uni.setNavigationBarTitle({
						title: "我的主页"
					})
				}
				this.work_view = false;
				this.$store.state.home.tabbarIndex = index
			},
			async toModule(type) {
				if (type == 'store') {
					// this.utils.getMarketDeptList(this);
					// this.utils.getMarketUserList(this);
					uni.reLaunch({
						url: '/pages-packages/store/index/index'
					})
				} else if (type == 'plan') {
					uni.reLaunch({
						url: '/pages-packages/plan/index/index'
					})
				} else if (type == 'meeting') {
					uni.reLaunch({
						url: '/pages-packages/meeting/index/index'
					})
				} else if (type == 'spot-check') {
					uni.reLaunch({
						url: '/pages-packages/spot-check/index/index'
					})
				} else if (type == 'plan-question') {
					uni.reLaunch({
						url: '/pages-packages/plan-question/index/index'
					})
				} else if (type == 'plan-review') {
					uni.reLaunch({
						url: '/pages-packages/plan-review/index/index'
					})
				} else if (type == 'store-inspection') {
					uni.reLaunch({
						url: '/pages-packages/store-inspection/index/index'
					})
				}
			},
			refreshModel() {
				// this.utils.getModelList(uni.getStorageSync('userinfo').usernumber, this);
			}
		}
	}
</script>

<style scoped lang="scss">
	.container {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		box-shadow: 10rpx 0 10rpx 0 rgba(0, 0, 0, 0.1);
		padding-bottom: env(safe-area-inset-bottom);
		
		>.main {
			width: 100%;
			height: 100rpx;
			box-sizing: border-box;
			display: flex;
			justify-content: space-between;
			padding: 0rpx 60rpx;
			padding-top: 15rpx;
			background: #fff;

			.item {
				width: 200rpx;
				text-align: center;

				.image {
					width: 100%;
					height: 42rpx;

					.icon {
						width: 42rpx;
						// height: 42rpx;
					}
				}

				.text {
					margin-top: 5rpx;
					padding-bottom: 10rpx;
					font-size: 20rpx;
					color: #647484;
				}

				&:active {
					opacity: 0.8;
				}
			}

			.item.active {
				.text {
					color: #1BA1F3;
				}
			}
		}

		.work_view {
			width: 100%;
			height: 100vh;
			position: fixed;
			left: 0;
			bottom: 100rpx;
			margin-bottom: env(safe-area-inset-bottom);

			.content {
				width: 100%;

				.mark {
					width: 100%;
					height: 100vh;
					background: rgba(153, 153, 153, 0.3);
				}

				.module_list {
					width: 100%;
					display: flex;
					justify-content: flex-start;
					flex-wrap: wrap-reverse;
					padding: 20rpx 60rpx;
					box-sizing: border-box;
					position: absolute;
					bottom: 0;
					left: 0;
					z-index: 999;
					background: #fff;
					opacity: 0.95;

					.item {
						width: calc(33.3%);
						height: 200rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						flex-wrap: wrap;
						border-radius: 10rpx;
						box-sizing: border-box;
						padding: 40rpx 0rpx;

						.icon-view {
							width: 50rpx;
							height: 50rpx;
							display: flex;
							justify-content: center;
							align-items: center;

							.icon {
								width: 100%;
								height: 100%;
							}
						}

						.txt {
							width: 100%;
							text-align: center;
							color: #333;
							font-size: 28rpx;
							white-space: nowrap;
						}

						&:active {
							background: #f2f2f2;
							animation: fadeIn 300ms;
						}
					}

					.item.date {
						position: relative;

						.date {
							width: 100%;
							text-align: center;
							position: absolute;
							left: 0;
							bottom: 110rpx;
							font-size: 16rpx;
							color: #333;
							font-weight: 700;
						}
					}
				}

				// 无权限
				.no-model {
					width: 100%;
					display: flex;
					justify-content: flex-start;
					flex-wrap: wrap;
					padding: 20rpx 60rpx;
					box-sizing: border-box;
					position: absolute;
					bottom: 0;
					left: 0;
					z-index: 999;
					background: #fff;
					opacity: 0.95;
					padding-bottom: 70rpx;

					.tips {
						width: 100%;
						height: 30rpx;
						text-align: center;
						line-height: 200rpx;
						font-size: 30rpx;
						color: #647484;
						font-weight: 700;
						padding-bottom: 70px;
					}

					.refresh {
						font-size: 26rpx;
						color: #999;
						font-weight: 700;
						margin: auto;
						padding: 20rpx;
						border-radius: 10rpx;
						text-decoration: underline;


						&:active {
							background: #f2f2f2;
						}
					}
				}
			}
		}
	}
</style>
