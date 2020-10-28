<template>
	<view class="container">
		<!-- <navbar></navbar> -->
		<view class="main">
			<msg :reflesh='reflesh' v-if="tabbarIndex == 0"></msg>
			<mine v-if="tabbarIndex == 2"></mine>
		</view>
		<tabbar></tabbar>
	</view>
</template>

<script>
	import tabbar from '@/user/homeTabbar'
	import msg from '@/user/msg/msg'
	import mine from '@/user/mine/mine'
	export default {
		components: {
			tabbar,
			msg,
			mine
		},
		data() {
			return {
				reflesh: 1
			}
		},
		computed: {
			tabbarIndex: function() {
				this.reflesh += 1;
				return this.$store.state.home.tabbarIndex
			}
		},
		onLoad: function() {
			// 隐藏微信小程序tabbar
			wx.hideHomeButton();
			uni.setNavigationBarTitle({
				title: "我的消息"
			});
		},
		onShow: function() {
			if (this.tabbarIndex == 0) {
				this.reflesh += 1;
				console.log("user index onShow");
			}
		},
		methods: {

		}
	}
</script>

<style scoped lang="scss">
	.container {
		.main {
			width: 100%;
			height: calc(100vh - 100rpx);
			background: #F6F7F9;
		}
	}
</style>
