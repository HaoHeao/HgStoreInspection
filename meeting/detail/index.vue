<template>
	<view class="container detail">
		<haoheao-scroll class="haoheao-scroll" ref="scroll" @onPullDown="onPullDown">
			<view class="view-item">
				<view class="detail-control">
					<view class="state">会议正在进行</view>
				</view>
				<view class="title">会议主题会议主题会议主题会议主题会议主题会议主题会议主题会议主题会议。</view>
				<view class="item">
					<view class="title">会议室</view>
					<view class="content">会议室11</view>
				</view>
				<view class="item">
					<view class="title">开会日期</view>
					<view class="content">2020-07-15 13:00 ~ 2020-07-15 17:00</view>
				</view>
				<view class="item">
					<view class="title">参会人数</view>
					<view class="content">12人1</view>
				</view>
				<view class="item">
					<view class="title">预约人员</view>
					<view class="content">物业部 - 李欣</view>
				</view>
			</view>
			<view class="view-item">
				<view class="item">
					<view class="title">位置</view>
					<view class="content">会议室位置会议室位置</view>
				</view>
				<view class="item">
					<view class="title">房间密码</view>
					<view class="content">123456</view>
				</view>
			</view>
			<view class="view-item">
				<view class="item">
					<view class="title">固定设备</view>
				</view>
				<!-- 固定设备 -->
				<view class="equip-list">
					<view class="item">
						<image class='icon' src="@/static/images/radio.svg" mode="widthFix"></image>
						<view class="title">收音机</view>
					</view>
					<view class="item">
						<image class='icon' src="@/static/images/radio.svg" mode="widthFix"></image>
						<view class="title">收音机</view>
					</view>
					<view class="item">
						<image class='icon' src="@/static/images/radio.svg" mode="widthFix"></image>
						<view class="title">收音机</view>
					</view>
					<view class="item">
						<image class='icon' src="@/static/images/radio.svg" mode="widthFix"></image>
						<view class="title">收音机</view>
					</view>
					<view class="item">
						<image class='icon' src="@/static/images/radio.svg" mode="widthFix"></image>
						<view class="title">收音机</view>
					</view>
					<view class="item">
						<image class='icon' src="@/static/images/radio.svg" mode="widthFix"></image>
						<view class="title">收音机</view>
					</view>
					<view class="item">
						<image class='icon' src="@/static/images/radio.svg" mode="widthFix"></image>
						<view class="title">收音机</view>
					</view>
					<view class="item">
						<image class='icon' src="@/static/images/radio.svg" mode="widthFix"></image>
						<view class="title">收音机</view>
					</view>
				</view>
			</view>
			<view class="view-item">
				<view class="item">
					<view class="title">移动设备</view>
				</view>
				<view class="equip-list">
					<view class="item">
						<image class='icon' src="@/static/images/radio.svg" mode="widthFix"></image>
						<view class="title">收音机</view>
						<view class="num">×2</view>
					</view>
					<view class="item">
						<image class='icon' src="@/static/images/radio.svg" mode="widthFix"></image>
						<view class="title">收音机</view>
						<view class="num">×2</view>
					</view>
					<view class="item">
						<image class='icon' src="@/static/images/radio.svg" mode="widthFix"></image>
						<view class="title">收音机</view>
						<view class="num">×2</view>
					</view>
					<view class="item">
						<image class='icon' src="@/static/images/radio.svg" mode="widthFix"></image>
						<view class="title">收音机</view>
						<view class="num">×2</view>
					</view>
					<view class="item">
						<image class='icon' src="@/static/images/radio.svg" mode="widthFix"></image>
						<view class="title">收音机</view>
						<view class="num">×2</view>
					</view>
					<view class="item">
						<image class='icon' src="@/static/images/radio.svg" mode="widthFix"></image>
						<view class="title">收音机</view>
						<view class="num">×2</view>
					</view>
					<view class="item">
						<image class='icon' src="@/static/images/radio.svg" mode="widthFix"></image>
						<view class="title">收音机</view>
						<view class="num">×2</view>
					</view>
					<view class="item">
						<image class='icon' src="@/static/images/radio.svg" mode="widthFix"></image>
						<view class="title">收音机</view>
						<view class="num">×2</view>
					</view>
				</view>
			</view>
		</haoheao-scroll>
		<view class="control-list">
			<view class="item del" @click="controlTap(1)">
				<image src="@/static/images/del_white.svg" mode="widthFix" class="icon"></image>取消
			</view>
			<view class="item" @click="controlTap(2)">
				<image src="@/static/images/loading_time.svg" mode="widthFix" class="icon"></image>延时
			</view>
			<view class="item" @click="controlTap(3)">
				<image src="@/static/images/replacement.svg" mode="widthFix" class="icon"></image>置换
			</view>
		</view>
		<popup ref="loading_time" type="bottom" :maskClick="false">
			<view class="popup">
				<view class="item-view select">
					<image src="@/static/images/date.svg" class="icon" mode="widthFix"></image>
					<view class="title">07-15 17:00 散会</view>
					<picker :class="['content',meetingEndtime == '延时至'?'':'active']" mode="time" :value="meetingEndtime" @change="bindTimeChange">
						{{meetingEndtime}}
					</picker>
				</view>
				<view class="bottom-control">
					<view class="left">您最多可延时2小时至18:30</view>
					<view class="content">
						<view class="close" @click="$refs['loading_time'].close()">取消</view>
						<view class="item">
							<image src="@/static/images/loading_time.svg" class="icon" mode="widthFix"></image>延时
						</view>
					</view>
				</view>
			</view>
		</popup>
		<popup ref="replacement" type="bottom" :maskClick="false">
			<view class="popup">
				<view class="title">请选择要置换的会议室</view>
				<view class="item-view select">
					<picker :class="['content',replaceIndex === null?'':'active']" @change="bindPickerChange" :value="replaceIndex"
					 :range="replaceList">
						{{replaceIndex === null?'请选择会议室':replaceList[replaceIndex]}}
					</picker>
					<image src="@/static/images/right.svg" :class="['icon select-icon',replaceIndex === null?'':'active']" mode="widthFix"></image>
				</view>
				<view class="bottom-control">
					<view class="content">
						<view class="close" @click="$refs['replacement'].close()">取消</view>
						<view class="item">
							<image src="@/static/images/replacement.svg" class="icon" mode="widthFix"></image>置换
						</view>
					</view>
				</view>
			</view>
		</popup>
	</view>
</template>

<script>
	import popup from '@/components/uni-popup/uni-popup.vue'
	export default {
		components: {
			popup
		},
		data() {
			return {
				// 选择散会日期
				meetingEndtime: "延时至",
				replaceIndex: null,
				replaceList: ['中国', '美国', '巴西', '日本'],
			}
		},
		computed: {

		},
		methods: {
			async onPullDown(done) {
				done();
			},
			async controlTap(type) {
				if (type == 1) {
					console.log('取消')
				} else if (type == 2) {
					console.log('延时')
					// 选择散会日期
					this.meetingEndtime = "延时至"
					this.$refs['loading_time'].open()
				} else if (type == 3) {
					console.log('置换')
					this.replaceIndex = null;
					this.$refs['replacement'].open()
				}
			},
			async bindTimeChange(e) {
				this.meetingEndtime = e.target.value
			},
			bindPickerChange: function(e) {
				console.log('picker发送选择改变，携带值为', e.target.value)
				this.index = e.target.value
			},
		},
		onLoad: function(option) {
			console.log('详细信息 option', option)
		},
		onShow: function() {

		}
	}
</script>

<style lang="scss" scoped>
	@import '@/styles/detail.scss';
	@import '@/styles/popup.scss';

	.popup {
		padding: 30rpx;

		.item-view {
			display: flex;
			align-items: center;
			color: #647484;
			margin-bottom: 30rpx;

			.icon {
				width: 40rpx;
				height: 40rpx;
				margin-right: 10rpx;
			}

			.title {
				white-space: nowrap;
				margin-right: 20rpx;
			}

			.content {
				flex: 2;
			}

			&.select {
				position: relative;

				.content {
					line-height: 80rpx;
					padding: 0 20rpx;
					color: #B6C6D6;
					background: #F3F5F7;
					border-radius: 10rpx;

					&.active {
						color: #647484;
					}
				}

				.select-icon {
					width: 24rpx;
					height: 24rpx;
					position: absolute;
					right: 20rpx;
					top: calc(50% - 12rpx);
					z-index: 999;
					transition: .2s;

					&.active {
						transform: rotate(90deg);
					}
				}
			}
		}

		.bottom-control {
			.left {
				color: #CCCCCC;
				font-size: 26rpx;
			}
		}
	}
</style>
