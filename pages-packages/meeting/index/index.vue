<template>
	<view class="container">
		<scroll-view class="date-view" scroll-x>
			<view v-for="(item,index) of bookedDateList" :key="index" :class="['item',item.index == activeBookedDate.index?'active':'']"
			 @click="selectDay(item)">
				<view class="date-day">{{item.text}}</view>
				<view class="date-week">{{item.week}}</view>
				<view class="date-info">{{item.info}}</view>
			</view>
		</scroll-view>
		<scroll-view class="scroll-view" scroll-y refresher-enabled scroll-with-animation :enable-back-to-top="setting.enableBackToTop"
		 :refresher-triggered="getDataRefresherLoading" @refresherrefresh="onRefresh" @refresherrestore="onRestore">
			<view class="data-view">
				<view class="item fadeIn" v-for="(item,index) of roomReserveList" :key="index">
					<view :class="['meeting',item.status != 1000?'deactivate':'']" @click="reserve(item)">
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
						<image src="@/static/icon/reservation.png" mode="widthFix" class="icon" v-if="item.status == 1000"></image>
					</view>
					<view class="meeting-list" v-if="item.status == 1000">
						<view class="item" v-for="(itm,ind) of item.reserveRoomList" :key="ind" @click="looked({roomInfo:item,reserveInfo:itm})">
							<view class="info">
								<view class="time">{{itm.timeslotstart}} ~ {{itm.timeslotend}}</view>
								<view class="depart" v-if="itm.deptname && itm.optusername">{{itm.deptname + ' - ' + itm.optusername}}</view>
								<view class="title" v-if="userinfo.deptno == itm.deptid">{{itm.title}}</view>
							</view>
							<view class="control">
								<view class="item state" v-if="itm.isover">已结束</view>
								<view class="item replacement" v-if="userinfo.deptno == itm.deptid && itm.replacementList.length && itm.meeting_state != 3">换</view>
								<view :class="['item password',userinfo.deptno == itm.deptid?'no-active':'']" @click.stop="showPassword(itm)"
								 v-if="userinfo.deptno == itm.deptid">
									<view class="hand">
										<image class="icon" src="@/static/icon/show_password.svg" mode="widthFix"></image>
									</view>
									<view :class="['info',itm.showPassword?'active':'']">{{itm.t_MeetingRoom.password?itm.t_MeetingRoom.password:'无密码'}}</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<uni-popup ref="tips" type="center">
			<view class="popup">
				<view class="close" @click="$refs['tips'].close()">×</view>
				<view class="head">会议室管理规定</view>
				<scroll-view scroll-y class="info-list">
					<view class="title">一、线上预约</view>
					<view class="content">1.会议室实行预约制度，可预约一周以内的会议室。</view>
					<view class="content">2.会议申请人作为会议责任人，对会议室物品保管、用电安全、室内卫生负责。</view>
					<view class="content">3.如会议取消，请及时在系统中取消会议室使用申请。</view>
					<view class="content">4.需对调会议室时，请对调双方发起会议室置换。</view>
					<view class="content">5.会议如需延长，请及时在系统发起，延长最大期限以下场会议开始时间为准。</view>
					<view class="title">二、会议室使用</view>
					<view class="content">1.开会期间，为避免影响其他部门，请勿大声喧哗。</view>
					<view class="content">2.自觉爱惜会议室的设备设施，如出现设备设施损坏，请及时告知董办。</view>
					<view class="content">3.自觉保持会议室卫生清洁，如出现液体洒漏，请及时清理或通知总务部。</view>
					<view class="content">4.会议室内设备、工具、办公用品原则上不得拿出会议室作为他用。若确因需要借用，须征得董办同意后方可动用，事后归还原处并告知董办。</view>
					<view class="content">5.会议室内严禁用餐，禁止吸烟。</view>
					<view class="content">6.严禁坐、踏会议桌。</view>
					<view class="content">7.如需使用公司公用电脑，请自行联系信息开发部的IT运维人员。归还电脑时，请确认设备内无机密、重要文件。</view>
					<view class="content">8.会议室内矿泉水、纸巾、会议花等除专业设备以外的物品请自行准备。</view>
					<view class="title">二、会议室使用</view>
					<view class="content">1.会议结束应及时清理桌面、地面垃圾，将垃圾带至十层北货梯间并分类处理。</view>
					<view class="content">2.会议室结束使用应及时断电（灯、空调、投影、电子白板），复位桌椅并锁好门窗。</view>
					<view class="bottom-control">
						<view class="content">
							<view class="item confirm" @click="$refs['tips'].close()">确定</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 日期列表
				bookedDateList: '',
				// 选中的日期
				activeBookedDate: '',
				// 房间列表+房间预约列表
				roomReserveList: '',
				// 置换列表
				replacementList: '',
				getDataRefresherLoading: false,
			}
		},
		computed: {
			mettingSetting() {
				return this.$store.state.metting
			},
			setting() {
				return this.$store.state.setting
			},
			userinfo() {
				return this.utils.getUserInfo()
			}
		},
		methods: {
			// 触发下拉刷新
			async onRefresh() {
				this.getDataRefresherLoading = true
				await this.getBookedDateList();
				await this.getDayReservationList(this.activeBookedDate);
				this.getDataRefresherLoading = false
			},
			// 刷新完成/重置
			onRestore() {
				this.getDataRefresherLoading = false
			},
			// 显示密码
			showPassword(option) {
				option.showPassword = !option.showPassword
			},
			// 查看详情
			looked(options) {
				console.log(options)
				if (this.userinfo.deptno != options.reserveInfo.deptid) {
					uni.showToast({
						icon: "none",
						duration: 2000,
						title: '您不能查看此会议'
					});
					return
				}
				uni.navigateTo({
					url: `../detail/index?options=[${encodeURIComponent(JSON.stringify(options.roomInfo))},${encodeURIComponent(JSON.stringify(options.reserveInfo))}]`
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
					url: `../reserva/index?options=[${encodeURIComponent(JSON.stringify(item))},${encodeURIComponent(JSON.stringify(this.activeBookedDate))}]`
				});
			},
			// 切换日期
			async selectDay(item) {
				console.log('请求日期信息------>>>', item)
				await this.getDayReservationList(item);
			},
			// 渲染可预约天列表
			getBookedDateList() {
				let arr = [],
					date = new Date().getTime()
				for (let index = 0; index <= this.mettingSetting.maxDays; index++) {
					arr.push({
						day: this.moment(date).format('YYYY/MM/DD hh:mm:ss'),
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
				await this.getRoomList();
				await this.getReplacementList();
				try {
					let data = await uni.request({
						method: 'POST',
						url: this.api.meeting_getDayReservationList,
						data: {
							MeetingdateStart: this.moment(item.day).format('YYYY/MM/DD 00:00:00'),
							MeetingdateEnd: this.moment(item.day).format('YYYY/MM/DD 00:00:00')
						}
					})
					let [err, success] = data
					// 请求置换列表插入
					for (let item of this.replacementList) {
						for (let itm of Object.keys(success.data.data)) {
							for (let it of success.data.data[itm]) {
								it.replacementList = [];
								// 目标会议室id比对
								if (item.sourceappointmentid == it.id) {
									it.replacementList.push(item)
								}
							}
						}
					}
					for (let index in success.data.data) {
						for (let ind in success.data.data[index]) {
							let item = success.data.data[index][ind]
							item.showPassword = false
							item.optusername = item.optuser.replace("/", " - ").split(' - ')[1];
							item.optusernumber = item.optuser.replace("/", " - ").split(' - ')[0];
							item.optuser = item.optuser.replace("/", " - ");
							item.timeslotend = this.insert_flg(item.timeslotend, ':', 2)
							item.timeslotstart = this.insert_flg(item.timeslotstart, ':', 2)
							success.data.data[index][Number(ind) + 1] ? item.nextreserve = success.data.data[index][Number(ind) + 1] :
								item
								.nextreserve = null
							// 会议状态 - 是否已结束
							if (this.moment().format('YYYY/MM/DD') == this.moment(item.meetingdate).format('YYYY/MM/DD')) {
								new Date() >= new Date(this.moment(item.meetingdate).format('YYYY/MM/DD ') + item.timeslotend + ':00') ? item.isover =
									true : item.isover = false
							}
							// 会议室当前状态判断
							this.meetingState(item)
						}
					}
					// 插入会议室列表下
					for (let item of this.roomReserveList) {
						for (let index in success.data.data) {
							if (item.roomid == index) {
								item.reserveRoomList = success.data.data[index]
							}
						}
					}
					// next-day
					let next = new Date().getTime() + 86400000,
						meetingMessageDate = uni.getStorageSync('meeting_meetingMessageDate');
					if (meetingMessageDate) {
						if (new Date(this.moment().format('YYYY/MM/DD')).getTime() >= new Date(meetingMessageDate).getTime()) {
							uni.setStorageSync('meeting_meetingMessageDate', this.moment(next).format('YYYY/MM/DD'));
							this.$refs['tips'].open()
						}
					} else {
						uni.setStorageSync('meeting_meetingMessageDate', this.moment(next).format('YYYY/MM/DD'));
						this.$refs['tips'].open()
					}
					this.$forceUpdate()
					console.log('预约列表------>>>', success.data.data)
					console.log('会议室列表-------->>>', this.roomReserveList)
				} catch (e) {
					console.log(e)
				}
			},
			// 获取会议室列表
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
						// 会议室列表排序
						success.data.data.roomlist = success.data.data.roomlist.filter(function(item) {
							return item.status == 1000
						}).concat(success.data.data.roomlist.filter(function(item) {
							return item.status == 2000
						}))
						this.roomReserveList = success.data.data.roomlist
					}
				} catch (e) {
					console.log(e)
				}
			},
			// 请求置换列表
			async getReplacementList() {
				try {
					let data = await uni.request({
						method: 'POST',
						url: this.api.meeting_replacementList,
						data: {
							MeetingdateStart: this.moment(this.activeBookedDate.day).format('YYYY/MM/DD'),
							MeetingdateEnd: this.moment(this.activeBookedDate.day).format('YYYY/MM/DD'),
						}
					})
					let [err, success] = data
					console.log('请求置换列表------>>>', success)
					if (success && success.data.success) {
						let arr = []
						for (let index in success.data.data.list) {
							let status = success.data.data.list[index].status
							if (status == 0) {
								arr.push(success.data.data.list[index])
							}
						}
						this.replacementList = arr
					}
				} catch (e) {
					console.log(e)
				}
			},
			// 会议状态判断
			meetingState(item) {
				if (new Date().getTime() < new Date(this.moment(new Date(item.meetingdate)).format("YYYY/MM/DD ").replace(
							/-/g, '/') +
						item.timeslotstart).getTime()) {
					// 未开始
					item.meeting_state = 1
				} else if (new Date().getTime() > new Date(this.moment(new Date(item.meetingdate)).format("YYYY/MM/DD ")
						.replace(/-/g, '/') +
						item.timeslotstart).getTime() && new Date().getTime() < new Date(this.moment(new Date(item
						.meetingdate)).format("YYYY/MM/DD ") + item.timeslotend).getTime()) {
					// 正在进行
					item.meeting_state = 2
				} else if (new Date().getTime() > new Date(this.moment(new Date(item.meetingdate)).format("YYYY/MM/DD ")
						.replace(/-/g, '/') +
						item.timeslotend).getTime()) {
					// 已结束
					item.meeting_state = 3
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
			uni.showNavigationBarLoading();
			await this.getBookedDateList();
			this.activeBookedDate = this.bookedDateList[0];
			await this.getDayReservationList(this.activeBookedDate);
			uni.hideNavigationBarLoading()
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		height: 100vh;
		background: #F6F7F9;

		.date-view {
			width: 100%;
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

		.scroll-view {
			height: calc(100vh - 160rpx - env(safe-area-inset-bottom));
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

					&.deactivate {
						background: #f2f2f2;
						border: 2rpx dashed #647484;
						box-sizing: border-box;
					}

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
						padding: 10rpx 0rpx;
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

							.title {
								font-size: 22rpx;
								color: #647484;
								padding: 18rpx 60rpx 0rpx 0rpx;
							}
						}

						.control {
							position: absolute;
							top: 0;
							right: 0;
							display: flex;
							align-items: center;
							z-index: 998;
							min-height: 90rpx;
							background: rgba(255, 255, 255, 0.8);
							padding-left: 10rpx;

							.item {
								// line-height: 90rpx;
								// min-width: 45rpx;
								display: flex;
								align-items: center;
								transition: .2s;
								white-space: nowrap;

								&:active {
									background: #e2e2e2;
								}

								&.no-active {
									&:active {
										background: transparent;
									}
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

								&.state {
									line-height: 90rpx;
									color: #999;
									font-size: 22rpx;
									margin-right: 20rpx;

									&:active {
										background: transparent;
									}
								}

								&.replacement {
									color: #fff;
									background: #D56C68;
									border-radius: 50%;
									width: 30rpx;
									height: 30rpx;
									text-align: center;
									line-height: 30rpx;
									font-size: 22rpx;
									justify-content: center;
									margin-right: 10rpx;
								}

								&.password {
									min-height: 90rpx;
								}
							}
						}
					}
				}
			}
		}

		.popup {
			width: 650rpx;
			max-height: 90vh;
			border-radius: 20rpx;
			display: flex;
			flex-direction: column;
			position: relative;
			overflow: hidden;

			.close {
				background: #ff0036;
				color: #fff;
				width: 40rpx;
				height: 28rpx;
				line-height: 28rpx;
				border-radius: 40rpx;
				text-align: center;
				position: absolute;
				right: 20rpx;
				top: 20rpx;
				font-size: 22rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}

			>.head {
				line-height: 80rpx;
				text-align: center;
				background: #fff;
				font-size: 32rpx;
				font-weight: 900;
			}

			.info-list {
				flex: 2;
				max-height: 80vh;
				overflow-y: auto;
				padding-bottom: 20rpx;

				.title {
					line-height: 40rpx;
					font-size: 28rpx;
					color: #333;
					padding: 0 10rpx;
					padding-left: 20rpx;
					padding-bottom: 5rpx;
					margin: 0;
				}

				.content {
					font-size: 26rpx;
					color: #647484;
					text-indent: 46rpx;
					padding: 0 10rpx;
					// padding-left: 50rpx;
					line-height: 38rpx;
				}
			}

			.bottom-control {
				position: static;
				margin-top: 30rpx;
				padding: 0 20rpx;

				.item {
					text-indent: 0;
				}
			}
		}
	}
</style>
