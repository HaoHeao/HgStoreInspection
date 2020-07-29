<template>
	<view class="container">
		<scroll-view class="date-view" scroll-x="true">
			<view v-for="(item,index) of bookedDateList" :key="index" :class="['item',item.index == activeBookedDate.index?'active':'']"
			 @click="getDayReservationList(item)">
				<view class="date-day">{{item.text}}</view>
				<view class="date-week">{{item.week}}</view>
				<view class="date-info">{{item.info}}</view>
			</view>
		</scroll-view>
		<view class="data-view">
			<view class="item">
				<view class="meeting">
					<view class="name">会议室名称1</view>
					<view class="label">人数：23人</view>
					<view class="label">设备：设备：投影仪、激光笔、水、椅子×23、羽毛×6、空调</view>
					<image src="../../static/reservation.png" mode="widthFix" class="icon"></image>
				</view>
				<view class="meeting-list">
					<view class="item">
						<view class="info">
							<view class="time">13:00 ~ 17:00</view>
							<view class="depart">物业部 - 李信</view>
						</view>
						<view class="control"></view>
					</view>
					<view class="item">
						<view class="info">
							<view class="time">13:00 ~ 17:00</view>
							<view class="depart">物业部 - 李信</view>
						</view>
						<view class="control"></view>
					</view>
				</view>
			</view>
			<view class="item">
				<view class="meeting">
					<view class="name">会议室名称1</view>
					<view class="label">人数：23人</view>
					<view class="label">设备：设备：投影仪、激光笔、水、椅子×23、羽毛×6、空调</view>
					<image src="../../static/reservation.png" mode="widthFix" class="icon"></image>
				</view>
				<view class="meeting-list">
					<view class="item">
						<view class="info">
							<view class="time">13:00 ~ 17:00</view>
							<view class="depart">物业部 - 李信</view>
						</view>
						<view class="control"></view>
					</view>
					<view class="item">
						<view class="info">
							<view class="time">13:00 ~ 17:00</view>
							<view class="depart">物业部 - 李信</view>
						</view>
						<view class="control"></view>
					</view>
					<view class="item">
						<view class="info">
							<view class="time">13:00 ~ 17:00</view>
							<view class="depart">物业部 - 李信</view>
						</view>
						<view class="control"></view>
					</view>
				</view>
			</view>
			<view class="item">
				<view class="meeting">
					<view class="name">会议室名称1</view>
					<view class="label">人数：23人</view>
					<view class="label">设备：设备：投影仪、激光笔、水、椅子×23、羽毛×6、空调设备：投影仪、激光笔、水、椅子×23、羽毛×6、空调</view>
					<image src="../../static/reservation.png" mode="widthFix" class="icon"></image>
				</view>
				<view class="meeting-list">
					<view class="item">
						<view class="info">
							<view class="time">13:00 ~ 17:00</view>
							<view class="depart">物业部 - 李信</view>
						</view>
						<view class="control"></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				bookedDateList: '',
				activeBookedDate: ''
			}
		},
		computed: {
			mettingSetting() {
				return this.$store.state.metting
			}
		},
		methods: {
			getBookedDateList() {
				let arr = [],
					date = new Date().getTime()
				for (let index = 0; index <= this.mettingSetting.maxDays; index++) {
					arr.push({
						day: this.moment(date).format('YYYY-MM-DD hh:mm:ss'),
						text: this.moment(date).format('MM.DD'),
						week: new Date(date).getDay() == 1 ? '一' : new Date(date).getDay() == 2 ? '二' : new Date(date).getDay() == 3 ?
							'三' : new Date(date).getDay() == 4 ? '四' : new Date(date).getDay() == 5 ? '五' : new Date(date).getDay() == 6 ?
							'六' : new Date(date).getDay() == 0 ? '日' : new Date(date).getDay(),
						info: new Date(date).getDay() == 6 || new Date(date).getDay() == 0 ? '休息日' : "工作日",
						index: index
					})
					date += 24 * 60 * 60 * 1000
				}
				this.bookedDateList = arr;
				this.activeBookedDate = arr[0];
			},
			async getDayReservationList(item) {
				// 获取天预约列表
				this.activeBookedDate = item
				try {
					uni.showLoading();
					let data = await uni.request({
						method: 'POST',
						url: 'http://192.168.128.66:8081/MeetingRoom/api/appointment/query',
						data: {
							MeetingdateStart: this.moment(new Date(item.day)).format('YYYY-MM-DD hh:mm:ss'),
							MeetingdateEnd: this.moment(new Date(item.day)).format('YYYY-MM-DD hh:mm:ss')
						}
					})
					setTimeout(() => {
						uni.hideLoading();
					}, 2000)
					console.log(data)
				} catch (e) {
					console.log(e)
					uni.hideLoading();
				}
			}
		},
		onShow: async function() {
			await this.getBookedDateList()
			this.getDayReservationList(this.activeBookedDate)
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		min-height: 100vh;
		background: #F6F7F9;

		.date-view {
			width: 100%;
			position: sticky;
			top: 0;
			z-index: 999;
			background: #fff;
			padding: 16rpx 10rpx;
			height: 160rpx;
			box-sizing: border-box;
			white-space: nowrap;

			.item {
				height: 130rpx;
				width: 150rpx;
				background: #F3F5F7;
				margin-right: 10rpx;
				border-radius: 8rpx;
				text-align: center;
				display: inline-block;
				transition: .3s;

				.date-day {
					font-size: 28rpx;
					margin-top: 6rpx;
					font-weight: 800;
				}

				.date-week {
					font-size: 24rpx;
					color: #EBC9C3;
					margin-top: 8rpx;
				}

				.date-info {
					font-size: 24rpx;
					color: #EBC9C3;
					margin-top: 0rpx;
				}

				&.active {
					background: #D56C68;

					.date-day {
						color: #fff;
					}
				}
			}
		}

		.data-view {
			height: 2000rpx;
			padding: 10rpx;

			>.item {
				background: #f2f2f2f2;
				padding: 10rpx;
				margin-bottom: 10rpx;
				display: flex;
				box-sizing: border-box;

				.meeting {
					background: #fff;
					border-radius: 6rpx;
					max-width: 270rpx;
					min-height: 180rpx;
					position: relative;
					padding: 20rpx;
					margin-right: 10rpx;
					box-sizing: border-box;

					.name {
						font-size: 26rpx;
						color: #333;
						margin-bottom: 2rpx;
					}

					.label {
						color: #647484;
						font-size: 20rpx;
					}

					.icon {
						width: 38rpx;
						height: 38rpx;
						padding: 20rpx 14rpx;
						position: absolute;
						right: 0;
						top: 0;
						z-index: 998;
					}
				}

				.meeting-list {
					flex: 2;

					.item {
						min-height: 90rpx;
						display: flex;
						align-items: center;
						background: #fff;
						border-radius: 6rpx;
						padding-left: 14rpx;
						box-sizing: border-box;
						margin-bottom: 10rpx;

						&:last-child {
							margin: 0;
						}

						.time {
							font-size: 26rpx;
							color: #647484;
							font-weight: 800;
						}

						.depart {
							font-size: 20rpx;
							color: #ccc;
							margin-top: 2rpx;
						}
					}
				}
			}
		}
	}
</style>
