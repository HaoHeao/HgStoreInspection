<template>
	<view class="container">
		<view class="head">
			<view class="line"></view>
		</view>
		<view :class="['main',tabbarList.length == 3?'three-item':'']">
			<block v-for="(item,index) of tabbarList" :key="index">
				<view :class="index == tabbarIndex?'item active':'item'" v-if="index != 1" @click="selectTabbar(index)">
					<view class="image">
						<image :src="index == tabbarIndex?item.iconPath:item.selectedIconPath" mode="widthFix" class="icon"></image>
					</view>
					<view class="text">{{item.text}}</view>
				</view>
				<view class="item add" v-if="index == 1" @click="selectTabbar(index)">
					<view :class="index == tabbarIndex?'button select':'button'">+</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		props: ['index'],
		data() {
			return {

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
				this.$store.commit("changeTabbar", index);
			}
		},
		created() {
			if (this.index) {
				this.$store.commit("changeTabbar", JSON.parse(this.index))
			}
		},
		computed: {
			tabbarList() {
				return this.$store.state.tabbar.tabbarList;
			},
			tabbarIndex() {
				return this.$store.state.tabbar.index;
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

		.main {
			width: 100%;
			height: 100rpx;
			box-sizing: border-box;
			display: flex;
			justify-content: space-between;
			padding: 17rpx 0rpx;
			background: #fff;
			opacity: 0.95;

			.item {
				width: 150rpx;
				text-align: center;

				.image {
					width: 100%;
					height: 42rpx;

					.icon {
						width: 34rpx;
						height: 42rpx;
					}
				}

				.text {
					margin-top: 8rpx;
					padding-bottom: 10rpx;
					font-size: 20rpx;
					color: #647484;
				}

				&:active {
					opacity: 0.8;
				}
			}

			.item.add {
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

				.button.select {
					background: #0faeff; //0faeff
				}
			}

			.item.active {
				.text {
					color: #1BA1F3;
				}
			}
		}
		
		// 三项
		.three-item{
			padding: 17rpx 60rpx;
		}
	}
</style>
