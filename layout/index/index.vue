<template>
	<view class="container">
		<block v-if="setting.hasLogin">
			<view class="main">
				<message v-if="tabbarIndex == 0"></message>
				<mine v-if="tabbarIndex == 2"></mine>
			</view>
			<tabbar></tabbar>
		</block>
		<login v-if="!setting.hasLogin"></login>
	</view>
</template>

<script>
	import login from '@/layout/login/login'
	import tabbar from '@/layout/components/homeTabbar/index'
	import message from '@/layout/message/message'
	import mine from '@/layout/mine/mine'
	import {
		mapGetters
	} from 'vuex'
	export default {
		components: {
			login,
			tabbar,
			message,
			mine
		},
		data() {
			return {

			}
		},
		computed: {
			tabbarIndex() {
				return this.$store.state.home.tabbarIndex
			},
			userinfo() {
				return this.utils.getUserInfo(uni)
			},
			setting() {
				return this.$store.state.setting
			}
		},
		watch: {
			
		},
		onLoad: function() {
			// 隐藏微信小程序tabbar
			wx.hideHomeButton();
			// uni.setNavigationBarTitle({
			// 	title: "我的消息"
			// });
		}
	}
</script>
