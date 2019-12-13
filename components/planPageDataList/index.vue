<template>
	<haoheao-scroll class="scroll" ref="scroll" @onPullDown="onPullDown" @onLoadMore="onLoadMore">
		<view class="data-list" v-if="dataList.length != 0">
			<!-- <view class="item" @click="navigate(item)">
				<view class="title-head">
					<view :class="['state', item.status == 1?'solve':'']"></view>
					<view class="text">标题标题标题标题标题标题标题标题</view>
				</view>
				<view class="content-list">
					<view class="item-label">
						<text class="title">参与部门</text>
						<text class="content">工程部、企划部</text>
					</view>
					<view class="item-label">
						<text class="title">参与人员</text>
						<text class="content">李经理、蒋主管、孙经理、王晓明、刘永强、周东义、孙世豪、刘英</text>
					</view>
					<view class="item-label">
						<text class="title">巡查日期</text>
						<text class="content">2019.10.20 - 2019.10.29</text>
					</view>
				</view>
			</view> -->
			<view class="item" @click="navigate(item)" v-for="(item,index) of dataList" :key="index">
				<view class="title-head">
					<!-- <view :class="['state', item.status == 1000?'':'solve']"></view> -->
					<view class="text">{{item.title}}</view>
				</view>
				<view class="content-list">
					<view class="item-label" v-if="item.itemdeptlist.length">
						<text class="title">参与部门</text>
						<text class="content">
							<block>{{item.itemdeptlist[0]}}</block>
							<block v-for="(ite,ind) of item.itemdeptlist" :key="ind" v-if="ind != 0">{{'、' + ite}}</block>
						</text>
					</view>
					<view class="item-label" v-if="item.itempersonlist.length">
						<text class="title">参与人员</text>
						<text class="content">
							<block>{{item.itempersonlist[0]}}</block>
							<block v-for="(ite,ind) of item.itempersonlist" :key="ind" v-if="ind != 0">{{'、' + ite}}</block>
						</text>
					</view>
					<view class="item-label">
						<text class="title">巡查日期</text>
						<text class="content">{{item.sdate1}} - {{item.edate1}}</text>
					</view>
				</view>
			</view>
			<view class="null-data">
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
		methods: {
			onPullDown(done) { // 下拉刷新
				this.$emit('again');
				// this.$emit('againMore', this.state)
				setTimeout(() => {
					done();
				}, 1000)
			},
			onLoadMore(e) { // 加载更多
				console.log("onLoadMore", e);
			},
			navigate(item) {
				wx.pageScrollTo({
					scrollTop: 0
				})
				uni.navigateTo({
					url: "../seeDetail/seeDetail?id=" + item.planid
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.scroll {
		height: calc(100vh - 100rpx);
	}

	.data-list {
		// min-height: calc(100vh - 100rpx);
		padding-bottom: env(safe-area-inset-bottom);
		box-sizing:border-box;
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

		.title-head {
			width: calc(100% - 40rpx);
			margin: 20rpx;
			padding: 30rpx 0rpx;
			display: flex;
			align-items: center;
			border-bottom: 1rpx solid #F2F2F2;
			font-weight: 700;
			margin-bottom: 0;


			.state {
				width: 20rpx;
				height: 20rpx;
				border-radius: 50%;
				background: #D56C68;
				margin-right: 10rpx;
			}

			.state.solve {
				background: #7ED58C;
			}

			.text {
				width: 100%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				color: #313436;
				font-size: 26rpx;
				font-weight: 700;
			}
		}

		.content-list {
			.item-label {
				padding: 10rpx 20rpx;
				padding-bottom: 0;
				box-sizing: border-box;
				display: flex;
				justify-content: flex-start;

				.title {
					min-width: 135rpx;
					color: #647484;
				}

				.content {
					color: #333;
				}
			}
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
