<template>
	<view class="container">
		<view class="head">
			<view class="line"></view>
		</view>
		<view class="main">
			<block v-for="(item,index) of tabbarList" :key="index">
				<view :class="index == tabbarIndex?'item active':'item'" @click="selectTabbar(index)">
					<view class="image">
						<image :src="index == tabbarIndex?item.iconPath:item.selectedIconPath" mode="widthFix" class="icon"></image>
					</view>
					<view class="text">{{item.text}}</view>
				</view>
			</block>
		</view>
		<view class="work_view" v-if="work_view">
			<view class="content">
				<view class="mark fadeIn500" @click="work_show()"></view>
				<view class="module_list fadeIn" v-if="userModelList.length">
				<!-- <view class="module_list fadeIn"> -->
					<!-- <view class="item item1" @click="work_go(1)">
						<image src="../../static/module1.png" mode="widthFix" class="img"></image>
						<view class="txt">卖场巡检</view>
					</view>
					<view class="item item2" @click="work_go(6)">
						<image src="../../static/module2.png" mode="widthFix" class="img"></image>
						<view class="txt">计划巡检</view>
					</view> -->
					<view class="item item1" v-for="(item,index) of userModelList" :key="index" @click="work_go(item.menuid)">
						<image src="../../static/module1.png" mode="widthFix" class="img" v-if="item.menuid == 1"></image>
						<image src="../../static/module2.png" mode="widthFix" class="img" v-if="item.menuid == 6"></image>
						<view class="txt">{{item.mname}}</view>
					</view>
				</view>
				<view class="no-model" v-if="!userModelList.length">
				<!-- <view class="no-model"> -->
					<view class="tips">您没有任何权限！</view>
					<view class="refresh" @click="refreshModel()">重新获取权限</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	let utils = require('@/util/utils.js');
	let request = utils.api;
	export default {
		props: ['index'],
		data() {
			return {
				work_view: false
			}
		},
		computed: {
			tabbarList() {
				return this.$store.state.homeTabbar;
			},
			tabbarIndex() {
				return this.$store.state.homeIndex;
			},
			userModelList() {
				return this.$store.state.usermodel.modelList;
			}
		},
		created() {
			if (this.index) {
				this.$store.commit("changeHomeTabbar", JSON.parse(this.index))
			}
		},
		methods: {
			selectTabbar(index) {
				if (index == 0) {
					this.work_view = false;
					uni.setNavigationBarTitle({
						title: "我的消息"
					});
				} else if (index == 1) {
					// 加载查看权限
					// console.log("加载查看用户权限",this.$store.state.usermodel.modelList)
					utils.getModelList(uni.getStorageSync('userinfo').usernumber,this);
					this.work_view = !this.work_view;
					// uni.setNavigationBarTitle({
					// 	title: "巡检入口"
					// });
					return;
				} else if (index == 2) {
					this.work_view = false;
					uni.setNavigationBarTitle({
						title: "我的主页"
					})
				}
				this.$store.commit("changeHomeTabbar", index);
			},
			work_show: function() {
				this.work_view = false;
			},
			work_go: function(type) {
				utils.getMarketDeptList(this);
				utils.getMarketUserList(this);
				if (type == 1) {
					this.$store.commit("changeTabbar", 0);
					uni.reLaunch({
						url: '/pages/index/index'
					})
				} else if (type == 6) {
					uni.reLaunch({
						url: '/pages-plan/index/index'
					})
				}
			},
			refreshModel:function(){
				utils.getModelList(uni.getStorageSync('userinfo').usernumber,this);
			}
		}
	}
</script>

<style scoped lang="scss">
	.container {
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 997;
		width: 100%;
		padding-bottom: env(safe-area-inset-bottom);

		.head {
			width: 100%;

			.line {
				width: 100%;
				height: 1rpx;
				background: #f6f7f9;
			}
		}

		>.main {
			width: 100%;
			height: 100rpx;
			box-sizing: border-box;
			display: flex;
			justify-content: space-between;
			padding: 0rpx 60rpx;
			padding-top: 15rpx;
			// padding: 17rpx 0rpx;
			background: #fff;
			opacity: 0.95;
			// margin-bottom: env(safe-area-inset-bottom);
			z-index:999;
			// backdrop-filter: saturate(180%) blur(3px);
			// background-color: rgba(255,255,255,0.7);
			// transition: background-color 0.5s cubic-bezier(0.28, 0.11, 0.32, 1);

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
					flex-wrap: wrap;
					padding: 20rpx 60rpx;
					box-sizing: border-box;
					position: absolute;
					bottom: 0;
					left: 0;
					z-index: 999;
					background: #fff;
					opacity: 0.95;

					.item {
						// width: 200rpx;
						width: calc(33.3%);
						height: 200rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						flex-wrap: wrap;
						border-radius: 10rpx;
						box-sizing: border-box;
						padding: 40rpx 0rpx;
						// animation: zoombig 1000ms linear;

						// @keyframes zoombig {
						//     0% {
						//         zoom: 0.5;
						//     }

						//     100% {
						//         zoom: 1;
						//     }
						// }

						.img {
							width: 50rpx;
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
				.no-model{
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
					
					.tips{
						width:100%;
						height:30rpx;
						text-align:center;
						line-height:200rpx;
						font-size:30rpx;
						color:#647484;
						font-weight:700;
						padding-bottom: 70px;
					}
					
					.refresh{
						font-size: 26rpx;
						color: #999;
						font-weight: 700;
						margin: auto;
						padding: 20rpx;
						border-radius: 10rpx;
						text-decoration: underline;

						
						&:active{
							background:#f2f2f2;
						}
					}
				}
			}
		}
	}
</style>
