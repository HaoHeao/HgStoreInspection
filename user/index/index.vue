<template>
	<view class="container">
		<!-- <navbar></navbar> -->
		<view class="main">
			<view class="fadeIn" v-if="homeTabbarIndex == 0">
				<msg :reflesh='reflesh'></msg>
			</view>
			<view class="fadeIn" v-if="homeTabbarIndex == 2">
				<mine></mine>
			</view>
		</view>
		<tabbar></tabbar>
	</view>
</template>

<script>
	let utils = require('@/util/utils.js');
	let request = utils.api;
	import tabbar from '@/components/homeTabbar'
	import msg from '@/user/msg/msg'
	import mine from '@/user/mine/mine'
	export default {
		components: {
			tabbar,
			msg,
			mine
		},
		data(){
			return {
				reflesh:1
			}
		},
		computed: {
			homeTabbarIndex: function() {
				this.reflesh += 1;
				return this.$store.state.homeIndex
			}
		},
		onLoad: function() {
			wx.hideHomeButton();
			this.$store.commit("changeHomeTabbar", 0);
			uni.setNavigationBarTitle({
				title: "我的消息"
			});
		},
		onShow:function(){
			if(this.homeTabbarIndex == 0){
				this.reflesh += 1;
				console.log("user index onShow");
			}
		},
		methods:{
			// getMsg(pageindex) {
			// 	let option = {
			// 		usernumber: uni.getStorageSync("userinfo").usernumber,
			// 		deptid: uni.getStorageSync("userinfo").deptid,
			// 		pagesize: this.$store.state.plan.pagesize,
			// 		pageindex
			// 	};
			// 	let _this = this;
			// 	console.log("请求页面信息参数", option);
			
			// 	request.getMsg(option).then(res => {
			// 		let [err, data] = res;
			// 		console.log("消息请求成功：", err, data.data);
			// 		// if (done) done();
			// 		if (err == null) {
			// 			console.log(data)
			// 			utils.timerDateString(data.data.data);
			// 			_this.msgList1 = _this.msgList1.concat(data.data.data);
			// 			if (!this.pagenum) {
			// 				this.pagenum = data.data.pagenum
			// 			}
			// 			this.pageindex = this.pageindex + 1;
			// 		} else {
			// 			uni.showToast({
			// 				icon: 'none',
			// 				title: '请求失败:' + err.errMsg,
			// 				duration: 3000
			// 			});
			// 		};
			// 	})
			// }
		},
		// 分享
		onShareAppMessage() {
			return {
				path: 'user/login/login'
			}
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
