<template>
	<view class="container">
		<view class="head">
			<view class="line"></view>
		</view>
		<view class="main">
			<block v-for="(item,index) of storeshop.tabbar" :key="index">
				<view :class="index == storeshop.tabbarIndex?'item active':'item'" v-if="index != 1" @click="selectTabbar(index)">
					<view class="image">
						<image :src="index == storeshop.tabbarIndex?item.iconPath:item.selectedIconPath" mode="widthFix" class="icon"></image>
					</view>
					<view class="text">{{item.text}}</view>
				</view>
				<view class="item add" v-if="index == 1" @click="selectTabbar(index)">
					<view class="button">+</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		computed: {
			storeshop() {
				return this.$store.state.storeshop;
			}
		},
		methods: {
			selectTabbar(index) {
				if (index == 1) {
					uni.navigateTo({
						url: '../../pages/add/add'
					})
					return;
				}
				this.$store.state.storeshop.tabbarIndex = index
			}
		},
	}
</script>

<style scoped lang="scss">
	.container {
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

		.main {
			width: 100%;
			height: 100rpx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			background: #fff;

			.item {
				height: 100%;
				box-sizing: border-box;
				display: flex;
				justify-content: center;
				align-items: center;
				flex-wrap: wrap;
				flex: 2;
				padding: 10rpx 0;

				.image {
					width: 34rpx;
					height: 42rpx;

					.icon {
						width: 100%;
						height: 100%;
					}
				}

				.text {
					width: 100%;
					margin-top: 4rpx;
					// padding-bottom: 10rpx;
					font-size: 20rpx;
					color: #647484;
					text-align: center;
				}

				&.add {
					width: auto;
					margin-top: -5rpx;

					.button {
						width: 80rpx;
						height: 80rpx;
						line-height: 80rpx;
						text-align: center;
						background: #249AF2; //0faeff
						color: #f2f2f2;
						border-radius: 50%;
						font-weight: 900;
						font-size: 42rpx;
					}
				}

				&.active {
					.text {
						color: #1BA1F3;
					}
				}

				&:active {
					opacity: 0.8;
				}
			}
		}
	}
</style>
