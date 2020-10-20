<template>
	<view class="container">
		<!-- <navbar></navbar> -->
		<view class="main">
			<msg :reflesh='reflesh' v-if="homeTabbarIndex == 0"></msg>
			<mine v-if="homeTabbarIndex == 2"></mine>
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
			homeTabbarIndex: function() {
				this.reflesh += 1;
				return this.$store.state.homeIndex
			}
		},
		onLoad: function() {
			// 隐藏微信小程序tabbar
			wx.hideHomeButton();
			// this.$store.commit("changeHomeTabbar", 0);
			uni.setNavigationBarTitle({
				title: "我的消息"
			});
		},
		onShow: function() {
			if (this.homeTabbarIndex == 0) {
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
