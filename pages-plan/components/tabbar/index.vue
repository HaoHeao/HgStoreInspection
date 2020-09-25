<template>
	<view class="container">
		<view class="head">
			<view class="line"></view>
		</view>
		<view class="main">
			<block v-for="(item,index) of setting.tabbarList" :key="index">
				<!-- <view :class="['item',index == setting.tabbarIndex?'item active':'']" @click="selectTabbar(index)"> -->
				<view class="item" @click="selectTabbar(index)">
					<view class="image">
						<!-- <image :src="index == setting.tabbarIndex?require(`@/static/tabbar/plan/${item.selectedIconPath}`):require(`@/static/tabbar/plan/${item.iconPath}`)"
						 mode="widthFix" class="icon"></image> -->
						<image :src="require(`@/static/tabbar/plan/${item.iconPath}`)" mode="widthFix" class="icon"></image>
					</view>
					<view class="text">{{item.text}}</view>
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
			setting() {
				return this.$store.state.plan
			}
		},
		methods: {
			selectTabbar(index) {
				index == 0 ? uni.navigateTo({
					url: '/pages-plan/rectify/index'
				}) : index == 1 ? uni.navigateTo({
					url: '/pages-plan/review/index'
				}) : true
				// this.$store.state.plan.tabbarIndex = index
			}
		},
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

		.main {
			width: 100%;
			height: 100rpx;
			box-sizing: border-box;
			display: flex;
			justify-content: space-around;
			align-items: center;
			background: #fff;
			opacity: 0.95;

			.item {
				flex: 2;
				text-align: center;

				.image {
					width: 100%;

					.icon {
						width: 42rpx;
						height: 42rpx;
					}
				}

				.text {
					font-size: 20rpx;
					// color: #647484;
					color: #333;
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
	}
</style>
