<template>
	<view class="container">
		<view class="view-item info">
			<view class="date-view">
				<view class="date-day">{{option_data.text}}</view>
				<view class="date-week">{{option_data.week}}</view>
				<view class="date-info">{{option_data.info}}</view>
			</view>
			<view class="right">
				<!-- 名称 -->
				<view class="meeting-room">
					<view class="name">会议室名称1</view>
					<view class="open-detail" @click="openDetail = !openDetail">
						详细信息
						<image :class="['icon',openDetail?'active':'']" src="@/static/images/right.svg" mode="widthFix"></image>
					</view>
				</view>
				<!-- 会议室详细信息 -->
				<view class="room-info" v-show="openDetail">
					<!-- 会议室信息 -->
					<view class="info-view">
						<view class="item">位置：位置位置位置位置</view>
						<view class="item">人数限制：23人</view>
					</view>
					<!-- 固定设备 -->
					<view class="fixed-equip">
						<view class="title">固定设备</view>
						<view class="equip-list">
							<view class="item">
								<image class="icon" src="@/static/images/radio.svg" mode="widthFix"></image>
								<view class="name">收音机</view>
							</view>
							<view class="item">
								<image class="icon" src="@/static/images/radio.svg" mode="widthFix"></image>
								<view class="name">收音机</view>
							</view>
							<view class="item">
								<image class="icon" src="@/static/images/radio.svg" mode="widthFix"></image>
								<view class="name">收音机</view>
							</view>
							<view class="item">
								<image class="icon" src="@/static/images/radio.svg" mode="widthFix"></image>
								<view class="name">收音机</view>
							</view>
							<view class="item">
								<image class="icon" src="@/static/images/radio.svg" mode="widthFix"></image>
								<view class="name">收音机</view>
							</view>
							<view class="item">
								<image class="icon" src="@/static/images/radio.svg" mode="widthFix"></image>
								<view class="name">收音机</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 已预约 -->
				<view :class="['boooked',openDetail?'active':'']">
					<view class="gray-txt">今日已预约</view>
					<view class="item-booked">
						<view class="time">13:00 ~ 17:00</view>
						<view class="gray-txt">物业部 - 李信</view>
					</view>
					<view class="item-booked">
						<view class="time">13:00 ~ 17:00</view>
						<view class="gray-txt">物业部 - 李信</view>
					</view>
				</view>
			</view>
		</view>
		<view class="view-item input time">
			<view class="input-item">
				<view class="title">
					<image src="@/static/images/date.svg" mode="widthFix" class="icon"></image>
				</view>
				<view class="content">
					<picker class="time" mode="time" :value="startTime" :start="startTimeLimit" @change="startTimeChange">
						{{startTime}}
					</picker>
					<view class="center">~</view>
					<picker class="time" mode="time" :value="endTime" :start="endTimeLimit" @change="endTimeChange">
						{{endTime}}
					</picker>
				</view>
			</view>
		</view>
		<view class="view-item input">
			<view class="input-item">
				<view class="title">人数</view>
				<input type="number" value="" class="content" placeholder="参会人数" v-model="meetingNumber" />
				<view class="clear" @click="meetingNumber = ''" v-if="meetingNumber">
					<view class="view">×</view>
				</view>
			</view>
			<view class="input-item">
				<view class="title">会议主题</view>
				<input type="text" value="" class="content" placeholder="会议主题" v-model="meetingTitle" />
				<view class="clear" @click="meetingTitle = ''" v-if="meetingTitle">
					<view class="view">×</view>
				</view>
			</view>
		</view>
		<view class="view-item input equip">
			<view class="input-item">
				<view class="title">移动设备</view>
				<view class="content">
					<view class="add-equip">添加移动设备</view>
				</view>
			</view>
			<view class="input-item equip-list">
				<view class="item">
					<image src="@/static/images/radio.svg" class="icon" mode="widthFix"></image>
					<view class="name">收音机</view>
					<view class="num">×2</view>
					<view class="del">×</view>
				</view>
				<view class="item">
					<image src="@/static/images/radio.svg" class="icon" mode="widthFix"></image>
					<view class="name">收音机</view>
					<view class="num">×2</view>
					<view class="del">×</view>
				</view>
				<view class="item">
					<image src="@/static/images/radio.svg" class="icon" mode="widthFix"></image>
					<view class="name">收音机</view>
					<view class="num">×2</view>
					<view class="del">×</view>
				</view>
				<view class="item">
					<image src="@/static/images/radio.svg" class="icon" mode="widthFix"></image>
					<view class="name">收音机</view>
					<view class="num">×2</view>
					<view class="del">×</view>
				</view>
				<view class="item">
					<image src="@/static/images/radio.svg" class="icon" mode="widthFix"></image>
					<view class="name">收音机</view>
					<view class="num">×2</view>
					<view class="del">×</view>
				</view>
			</view>
		</view>
		<view class="mh-btn" @click="reserva()">预约</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 所要预约会议室信息
				option_roominfo: "",
				// 所要预约的天
				option_data: "",
				// 详细信息查看
				openDetail: false,
				startTime: '开会时间',
				endTime: '散会时间',
				// 参会人数
				meetingNumber: "",
				// 会议主题
				meetingTitle: "",
			}
		},
		computed: {
			startTimeLimit() {
				return this.moment(new Date()).format("hh:mm")
			},
			endTimeLimit() {
				if (this.startTime == '开会时间') {
					return this.moment(new Date()).format("hh:mm")
				}
				return this.startTime
			}
		},
		methods: {
			startTimeChange: function(e) {
				this.startTime = e.target.value
			},
			endTimeChange: function(e) {
				this.endTime = e.target.value
			},
			reserva: function() {
				console.log(this.option_roominfo, this.option_data)
				console.log({
					"Id": 0,
					"Roomid": this.option_roominfo.roomid,
					"Deptid": "",
					"Deptname": "",
					"Optuser": "",
					"Meetingdate": "2020-08-04T01:37:49.920Z",
					"Timeslotdesc": "",
					"Timeslotstart": "",
					"Timeslotend": "",
					"Title": this.meetingTitle,
					"Peoplecount": 0,
					"Mainpeople": "",
					"Mainleader": "",
					"Summary": "",
					"Remark": "",
					"Status": 0,
					"Lstuserid": "",
					"FixedEquipmentChoose": [{
						"Goodsid": 0,
						"Status": 0,
						"Lstuserid": ""
					}],
					"MeetingAppendix": [{
						"Appendixid": 0,
						"Id": 0,
						"Name": "",
						"Url": "",
						"Status": 0,
						"Lstuserid": ""
					}],
					"MobileEquipmentChoose": [{
						"Goodsid": 0,
						"Usecount": 0,
						"Status": 0,
						"Lstuserid": ""
					}]
				})
			}
		},
		onLoad: function(option) {
			this.option_roominfo = JSON.parse(option.options)[0]
			this.option_data = JSON.parse(option.options)[1]
			console.log('预约 option', JSON.parse(option.options))
		},
		onShow: function() {

		}
	}
</script>

<style lang="scss" scoped>
	.container {
		box-sizing: border-box;
		min-height: 100vh;
		background: #F6F7F9;
		padding-top: 1rpx;
		/* IOS XR */
		padding-bottom: env(safe-area-inset-bottom);
		/* ------ */

		.view-item {
			margin: 20rpx;
			background: #fff;
			border-radius: 10rpx;

			.date-view {
				width: 150rpx;
				height: 130rpx;
				background: #F3F5F7;
				margin-right: 20rpx;
				border-radius: 10rpx;
				text-align: center;
				background: #D56C68;

				.date-day {
					font-size: 28rpx;
					margin-top: 6rpx;
					font-weight: 800;
					color: #fff;
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
			}

			.right {
				flex: 2;

				/* 名称 */
				.meeting-room {
					display: flex;
					align-items: center;
					margin-bottom: 10rpx;

					.name {
						font-size: 28rpx;
						color: #647484;
						font-weight: 800;
						flex: 2;
						margin-right: 30rpx;
					}

					.open-detail {
						display: flex;
						align-items: center;
						color: #647484;
						font-size: 24rpx;
						padding: 5rpx 0;
						padding-left: 10rpx;
						border-radius: 5rpx;

						&:active {
							background: #f2f2f2;
						}

						.icon {
							transition: .3s;
							width: 18rpx;
							height: 18rpx;
							margin-left: 6rpx;

							&.active {
								transform: rotate(90deg);
							}
						}
					}
				}

				/* 会议室详细信息 */
				.room-info {
					transition: .3s;
					margin-bottom: 20rpx;

					.info-view {
						font-size: 24rpx;
						color: #647484;
						display: flex;
						align-items: center;
						flex-wrap: wrap;
						padding-bottom: 10rpx;

						.item {
							margin-right: 30rpx;
						}
					}

					.fixed-equip {
						background: #F3F5F7;
						border-radius: 10rpx;
						padding-top: 1rpx;

						.title {
							color: #647484;
							font-size: 30rpx;
							margin: 20rpx;
							margin-bottom: 0rpx;
						}

						.equip-list {
							display: flex;
							flex-wrap: wrap;
							color: #647484;

							.item {
								width: calc(100%/5);
								text-align: center;

								.icon {
									width: 40rpx;
									height: 40rpx;
									padding: 20rpx 0;
									padding-bottom: 10rpx;
								}

								.name {
									font-size: 24rpx;
									padding-bottom: 20rpx;
								}
							}
						}
					}
				}

				/* 今日已预约 */
				.boooked {
					transition: .3s;

					&.active {
						padding: 10rpx;
						border: 1px dashed #CCCCCC;
					}

					.gray-txt {
						font-size: 22rpx;
						color: #ccc;
						font-weight: 900;
						margin-bottom: 4rpx;
					}

					.item-booked {
						display: flex;
						align-items: center;

						.time {
							font-size: 28rpx;
							color: #647484;
							margin-right: 20rpx;
						}
					}
				}
			}

			// 信息展示
			&.info {
				display: flex;
				padding: 10rpx;
				padding-right: 20rpx;
				padding-bottom: 20rpx;
			}

			// 输入
			&.input {
				.input-item {
					height: 80rpx;
					display: flex;
					align-items: center;
					color: #647484;
					position: relative;

					.title {
						line-height: 80rpx;
						min-width: 130rpx;
						font-size: 28rpx;
						margin-right: 20rpx;
						text-align: right;
					}

					.content {
						height: 100%;
						line-height: 80rpx;
						flex: 2;
						border-bottom: 1px solid #E0E0E0;
						display: flex;

						&::placeholder {
							color: #ccc;
						}
					}

					.clear {
						width: 80rpx;
						height: 80rpx;
						position: absolute;
						top: 0;
						right: 0;
						z-index: 999;
						display: flex;
						align-items: center;
						justify-content: center;
						transition: .3s;

						.view {
							line-height: 30rpx;
							text-align: center;
							width: 30rpx;
							height: 30rpx;
							font-size: 28rpx;
							color: #647484;
						}
					}

					&:last-child {
						.content {
							border-bottom: 0;
						}
					}
				}
			}

			// 时间选择
			&.time {
				.input-item {

					.title {
						min-width: auto;
						display: flex;
						align-items: center;
						margin: 0;

						.icon {
							width: 40rpx;
							height: 40rpx;
							padding: 20rpx;
						}
					}

					.content {
						.time {
							min-width: 100rpx;
							text-align: center;
						}

						.center {
							padding: 0 10rpx;
						}
					}
				}
			}

			// 添加可移动设备vc
			&.equip {
				.input-item {

					.content {
						justify-content: flex-end;
						border: 0;

						// 添加可移动设备
						.add-equip {
							width: calc(100%/4);
							line-height: 60rpx;
							background: #F3F5F7;
							color: #FF0036;
							font-size: 22rpx;
							margin: 10rpx 20rpx;
							padding: 0 10rpx;
							transition: .2s;
							text-align: center;

							&:active {
								opacity: 0.6;
							}
						}
					}

					&.equip-list {
						display: flex;
						flex-wrap: wrap;
						padding-left: 20rpx;
						padding-top: 20rpx;
						height: auto;

						.item {
							width: calc(100%/4 - 20rpx);
							margin-right: 20rpx;
							margin-bottom: 20rpx;
							text-align: center;
							background: #F3F5F7;
							border-radius: 10rpx;
							font-size: 26rpx;
							color: #647484;
							position: relative;

							.icon {
								width: 60rpx;
								height: 60rpx;
								margin-top: 20rpx;
							}

							.name {
								margin: 10rpx 0;
								margin-bottom: 5rpx;
							}

							.num {
								padding-bottom: 10rpx;
							}

							.del {
								position: absolute;
								top: -10rpx;
								right: -10rpx;
								font-size: 22rpx;
								color: #fff;
								font-weight: 900;
								background: #ff0036;
								text-align: center;
								width: 36rpx;
								height: 36rpx;
								line-height: 36rpx;
								border-radius: 50%;

								&:active {
									opacity: 0.75;
								}
							}
						}
					}
				}
			}
		}

		.mh-btn {
			border-radius: 70rpx;
			line-height: 70rpx;
			width: calc(100% - 40rpx);
			margin: 20rpx;
			margin-top: 40rpx;
			background: #647484;
			color: #fff;
			letter-spacing: 5rpx;
			font-weight: 800;
			text-align: center;
			position: fixed;
			/* IOS XR */
			bottom: env(safe-area-inset-bottom);
			/* ------ */
			transition: .3s;

			&:active {
				opacity: 0.75;
			}
		}
	}
</style>
