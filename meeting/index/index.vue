<template>
	<view class="container">
		<scroll-view class="date-view" scroll-x="true">
			<view v-for="(item,index) of bookedDateList" :key="index" :class="['item',item.index == activeBookedDate.index?'active':'']"
			 @click="selectDay(item)">
				<view class="date-day">{{item.text}}</view>
				<view class="date-week">{{item.week}}</view>
				<view class="date-info">{{item.info}}</view>
			</view>
		</scroll-view>
		<haoheao-scroll class="haoheao-scroll" ref="scroll" @onPullDown="onPullDown">
			<view class="data-view">
				<view class="item fadeIn" v-for="(item,index) of roomReserveList" :key="index">
					<view class="meeting" @click="reserve(item)">
						<view class="name">{{item.roomname}}</view>
						<view class="label" v-if="item.peoplelimit">人数：{{item.peoplelimit}}人</view>
						<view class="label" v-if="item.location">位置：{{item.location}}</view>
						<view class="label" v-if="item.fixedEquipment.length">
							设备：
							<block v-for="(itm,ind) of item.fixedEquipment" :key="ind">
								<block v-if="ind == 0">{{itm.goodsname}}{{itm.count == 1?'':'×' + itm.count}}</block>
								<block v-if="ind != 0">{{'、' + itm.goodsname}}{{itm.count == 1?'':'×' + itm.count}}</block>
							</block>
						</view>
						<image src="../../static/reservation.png" mode="widthFix" class="icon"></image>
					</view>
					<view class="meeting-list">
						<view class="item fadeIn" v-for="(itm,ind) of item.reserveRoomList" :key="ind" @click="goDetail({roomInfo:item,reserveInfo:itm})">
							<view class="info">
								<view class="time">{{itm.timeslotstart}} ~ {{itm.timeslotend}}</view>
								<view class="depart">{{itm.deptname + ' - ' + itm.optusername}}</view>
							</view>
							<view class="control" v-if="utils.getUserInfo(uni).usernumber == itm.optusernumber">
								<!-- <view class="control"> -->
								<view class="item fadeIn" @click.stop="showPassword(itm)">
									<view class="hand">
										<image class="icon" src="@/static/images/show_password.svg" mode="widthFix"></image>
									</view>
									<view :class="['info',itm.showPassword?'active':'']">{{itm.t_MeetingRoom.password?itm.t_MeetingRoom.password:'无密码'}}</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</haoheao-scroll>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				uni,
				// 日期列表
				bookedDateList: '',
				// 选中的日期
				activeBookedDate: '',
				// 房间列表+房间预约列表
				roomReserveList: ''
			}
		},
		computed: {
			mettingSetting() {
				return this.$store.state.metting
			}
		},
		methods: {
			// 显示密码
			showPassword(option) {
				option.showPassword = !option.showPassword
			},
			// 查看详情
			goDetail(options) {
				let userinfo = this.utils.getUserInfo(uni);
				if (userinfo.usernumber != options.reserveInfo.optusernumber) {
					uni.showToast({
						icon: "none",
						duration: 2000,
						title: '您不能查看此会议'
					});
					return
				}
				uni.navigateTo({
					url: `/meeting/detail/index?options=[${JSON.stringify(options.roomInfo)},${JSON.stringify(options.reserveInfo)}]`
				});
			},
			reserve(item) {
				if (item.status != 1000) {
					uni.showToast({
						icon: "none",
						title: '会议室停用，暂时不可预约'
					});
					return
				}
				uni.navigateTo({
					url: `/meeting/reserva/index?options=[${JSON.stringify(item)},${JSON.stringify(this.activeBookedDate)}]`
				});
			},
			// 下拉刷新
			async onPullDown(done) {
				await this.getBookedDateList();
				await this.getRoomList();
				await this.getDayReservationList(this.activeBookedDate);
				done();
			},
			// 切换日期
			async selectDay(item) {
				console.log('请求日期信息------>>>',item)
				await this.getRoomList();
				await this.getDayReservationList(item);
			},
			// 渲染可预约天列表
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
			},
			// 获取预约列表
			async getDayReservationList(item) {
				this.activeBookedDate = item
				try {
					let data = await uni.request({
						method: 'POST',
						url: this.api.meeting_getDayReservationList,
						data: {
							MeetingdateStart: this.moment(new Date(item.day.replace(/-/g, '/'))).format('YYYY-MM-DD 00:00:00'),
							MeetingdateEnd: this.moment(new Date(item.day.replace(/-/g, '/'))).format('YYYY-MM-DD 00:00:00')
						}
					})
					let [err, success] = data
					for (let index in success.data.data) {
						for (let ind in success.data.data[index]) {
							let item = success.data.data[index][ind]
							item.showPassword = false
							item.optusername = item.optuser.replace("/", " - ").split(' - ')[1];
							item.optusernumber = item.optuser.replace("/", " - ").split(' - ')[0];
							item.optuser = item.optuser.replace("/", " - ");
							item.timeslotend = this.insert_flg(item.timeslotend, ':', 2)
							item.timeslotstart = this.insert_flg(item.timeslotstart, ':', 2)
							success.data.data[index][Number(ind) + 1] ? item.nextreserve = success.data.data[index][Number(ind) + 1] : item.nextreserve = null
						}
					}
					for (let item of this.roomReserveList) {
						for (let index in success.data.data) {
							if (item.roomid == index) {
								item.reserveRoomList = success.data.data[index]
							}
						}
					}
					this.$forceUpdate()
					console.log('预约列表------>>>', success.data.data)
					console.log('会议室列表-------->>>', this.roomReserveList)
				} catch (e) {
					console.log(e)
				}
			},
			// 获取房间列表
			async getRoomList() {
				try {
					let data = await uni.request({
						method: 'GET',
						url: this.api.meeting_getRoomList,
					})
					let [err, success] = data
					if (success && success.data.success) {
						for (let item of success.data.data.roomlist) {
							item.reserveRoomList = []
						}
						this.roomReserveList = success.data.data.roomlist
					}
				} catch (e) {
					console.log(e)
				}
			},
			// 字符串插入操作
			insert_flg(str, flg, sn) {
				var newstr = "";
				for (var i = 0; i < str.length; i += sn) {
					var tmp = str.substring(i, i + sn);
					newstr += tmp + flg;
				}
				newstr = newstr.substring(0, newstr.length - 1);
				return newstr
			}
		},
		onLoad: async function() {
			await this.getBookedDateList();
			this.activeBookedDate = this.bookedDateList[0];
			await this.getRoomList();
			await this.getDayReservationList(this.activeBookedDate);
		},
		onShow: async function() {
			await this.getRoomList();
			await this.getDayReservationList(this.activeBookedDate);
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		min-height: 100vh;
		background: #F6F7F9;
		/* IOS XR */
		padding-bottom: env(safe-area-inset-bottom);
		/* ------ */

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
			padding: 10rpx;
			transition: .3s;

			&:last-child {
				padding-bottom: 0;
			}

			>.item {
				background: #f2f2f2f2;
				padding: 10rpx;
				margin-bottom: 10rpx;
				display: flex;
				box-sizing: border-box;
				transition: .3s;

				.meeting {
					background: #fff;
					border-radius: 6rpx;
					width: 270rpx;
					min-height: 190rpx;
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

					>.item {
						min-height: 90rpx;
						display: flex;
						align-items: center;
						background: #fff;
						border-radius: 6rpx;
						padding-left: 14rpx;
						box-sizing: border-box;
						margin-bottom: 10rpx;
						position: relative;

						&:last-child {
							margin: 0;
						}

						>.info {

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

						.control {
							position: absolute;
							top: 0;
							right: 0;
							display: flex;
							align-items: center;
							z-index: 998;

							.item {
								line-height: 90rpx;
								// min-width: 45rpx;
								display: flex;
								align-items: center;

								&:active {
									background: #e2e2e2;
								}

								>.hand {
									display: flex;
									align-items: center;
									line-height: 90rpx;
									min-width: 60rpx;
									justify-content: center;

									.icon {
										height: 40rpx;
										width: 40rpx;
									}
								}

								>.info {
									width: 0;
									overflow: hidden;
									transition: .3s;
									font-size: 22rpx;
									font-weight: 800;

									&.active {
										width: auto;
										padding-right: 20rpx;
									}
								}
							}
						}
					}
				}
			}
		}
	}
</style>
