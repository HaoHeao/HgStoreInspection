<template>
	<view class="container">
		<view class="top"></view>
		<view class="main">首页</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {

		},
		created:function(){
			console.log(1)
		}
	}
</script>

<style scoped lang="scss">
	.container{
		width:100%;
		height:138rpx;
		position:fixed;
		left:0;
		top:0;
		background:red;
	}
</style>
