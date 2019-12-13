<template>
	<haoheao-scroll ref="scroll" @onPullDown="onPullDown" @onScroll="onScroll" @onLoadMore="onLoadMore">
		<view class="data-list">
			<view class="item" v-for="(item,index) in dataList" :key="index" @click="navigate(item)">
				<view class="top">
					<view class="name">{{item.deptname}} - {{item.username}}</view>
					<view class="time">{{item.insertdate}}</view>
				</view>
				<view class="title">
					<view :class="['state', item.status == 1?'solve':'']"></view>
					<!-- <view class="text">{{item.title}}</view> -->
					<view class="text">{{item.remark}}</view>
				</view>
				<!-- <view class="content">{{item.remark}}</view> -->
			</view>
			<view class="null-data" v-if="dataList.length != 0">
				<view class="text">以上为全部记录</view>
				<view class="line"></view>
			</view>
		</view>
		<view class="no-data" v-if="dataList.length == 0">
			<view class="img-v">
				<image class="img" src="../../static/data_null.png" mode="widthFix"></image>
			</view>
			<view class="txt">暂无新记录</view>
		</view>
		<!-- <div class="preloader_1">
			<span></span>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
		</div> -->
	</haoheao-scroll>
</template>

<script>
	import haoheaoScroll from '@/components/haoheao-scroll/haoheao-scroll.vue'
	export default {
		props: ['dataList', 'state'],
		components: {
			haoheaoScroll
		},
		data() {
			return {

			}
		},
		computed: {

		},
		mounted: function() {
			this.$emit('again', this.state);
		},
		methods: {
			onPullDown(done) { // 下拉刷新
				this.$emit('again', this.state);
				setTimeout(() => {
					done();
				}, 1000)
			},
			onScroll(e) { // 监听滚动
				// console.log(e)
			},
			onLoadMore(e) { // 加载更多
				this.$emit('againMore', this.state)
			},
			navigate(item) {
				wx.pageScrollTo({
					scrollTop: 0
				})
				uni.navigateTo({
					url: "../seeDetail/seeDetail?id=" + item.inspectionlogid
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.data-list {
		margin-bottom: env(safe-area-inset-bottom);
	}

	.item {
		width: calc(100% - 40rpx);
		margin: 20rpx;
		margin-bottom: 0;
		padding-bottom: 20rpx;
		box-sizing: border-box;
		background: #fff;
		border-radius: 20rpx;

		&:active {
			background: #f9f9f9;
			animation: linear 1000ms;
		}

		.top {
			padding: 20rpx;
			display: flex;
			align-items: center;
			border-bottom: 1rpx solid #EDEEEF;

			.name {
				color: #647484;
				font-size: 24rpx;
				margin-right: auto;
			}

			.time {
				color: #B6C6D6;
				font-size: 20rpx;
			}
		}

		.title {
			padding: 20rpx;
			display: flex;
			// align-items: center;

			.state {
				width: 20rpx;
				height: 20rpx;
				border-radius: 50%;
				background: #D56C68;
				margin-right: 10rpx;
				margin-top: 8rpx
			}

			.state.solve {
				background: #7ED58C;
			}

			.text {
				width: 100%;
				// overflow: hidden;
				// text-overflow: ellipsis;
				// white-space: nowrap;
				color: #313436;
				font-size: 26rpx;
				font-weight: 700;
			}
		}

		.content {
			height: auto;
			padding: 0rpx 20rpx;
			color: #647484;
			font-size: 24rpx;

			text-overflow: -o-ellipsis-lastline;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 3;
			line-clamp: 3;
			-webkit-box-orient: vertical;
		}
	}

	.item:last-child {
		margin-bottom: 20rpx;
	}

	.preloader_1 {
		height: 40px;
		line-height: 40px;
		position: relative;
		text-align: center;
	}

	.preloader_1 span {
		width: 5px;
		height: 5px;
		margin: 0 1px;
		display: inline-block;
		vertical-align: middle;
		background: #9b59b6;
		animation: preloader_1 1.5s infinite ease-in-out;
	}

	.preloader_1 span:nth-child(2) {
		animation-delay: .2s;
	}

	.preloader_1 span:nth-child(3) {
		animation-delay: .4s;
	}

	.preloader_1 span:nth-child(4) {
		animation-delay: .6s;
	}

	.preloader_1 span:nth-child(5) {
		animation-delay: .8s;
	}

	@keyframes preloader_1 {
		0% {
			height: 5px;
			background: #9b59b6;
		}

		25% {
			height: 30px;
			background: #3498db;
		}

		50% {
			height: 5px;
			background: #9b59b6;
		}

		100% {
			height: 5px;
			background: #9b59b6;
		}
	}
</style>
