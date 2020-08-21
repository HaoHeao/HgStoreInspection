<!-- 界面展示信息 -->
<template>
	<view class="container detail">
		<haoheao-scroll class="haoheao-scroll" ref="scroll" @onPullDown="onPullDown">
			<view class="view-item fadeIn" v-if="reserveInfo">
				<view class="detail-control">
					<view :class="['state',reserveInfo.meeting_state == 2?'active':'']">{{reserveInfo.meeting_state == 1?'会议未开始':reserveInfo.meeting_state == 2?'会议正在进行':reserveInfo.meeting_state == 3?'会议已结束':''}}</view>
				</view>
				<view class="title">{{reserveInfo.title}}</view>
				<view class="item">
					<view class="title">会议室</view>
					<view class="content">{{reserveInfo.roomname}}</view>
				</view>
				<view class="item">
					<view class="title">开会日期</view>
					<view class="content">{{moment(new Date(reserveInfo.meetingdate)).format("MM-DD ") + reserveInfo.timeslotstart}}
						~ {{moment(new Date(reserveInfo.meetingdate)).format("MM-DD ") + reserveInfo.timeslotend}}</view>
				</view>
				<view class="item">
					<view class="title">参会人数</view>
					<view class="content">{{reserveInfo.peoplecount}}人</view>
				</view>
				<view class="item">
					<view class="title">预约人员</view>
					<view class="content">{{reserveInfo.deptname + ' - ' + reserveInfo.optusername}}</view>
				</view>
			</view>
			<view class="view-item">
				<view class="item">
					<view class="title">位置</view>
					<view class="content">{{reserveInfo.t_MeetingRoom.location}}</view>
				</view>
				<view class="item">
					<view class="title">房间密码</view>
					<view class="content">{{reserveInfo.t_MeetingRoom.password?reserveInfo.t_MeetingRoom.password:'无密码'}}</view>
				</view>
			</view>
			<view class="view-item" v-if="roomInfo.fixedEquipment.length">
				<view class="item">
					<view class="title">固定设备</view>
				</view>
				<!-- 固定设备 -->
				<view class="equip-list">
					<view class="item" v-for="(item,index) of roomInfo.fixedEquipment" :key="index">
						<image class='icon' :src="iconurl + item.goodsitem.icon" mode="widthFix"></image>
						<view class="title">{{item.goodsname}}</view>
					</view>
				</view>
			</view>
			<!-- <view class="view-item" v-if="detailInfo.mobileEquipmentChoose.length">
				<view class="item">
					<view class="title">移动设备</view>
				</view>
				<view class="equip-list">
					<view class="item" v-for="(item,index) of detailInfo.mobileEquipmentChoose" :key="index">
						<image class='icon' :src="iconurl + item.icon" mode="widthFix"></image>
						<view class="title">{{item.goodsname}}</view>
						<view class="num">×{{item.usecount}}</view>
					</view>
				</view>
			</view> -->
			<view class="view-item control-list" v-if="reserveInfo.meeting_state == 1">
				<view class="item del" @click="controlTap(1)">
					<image src="@/static/images/del_white.svg" mode="widthFix" class="icon"></image>取消
				</view>
				<view class="item" @click="controlTap(2)" v-if="maxDelayTimeList.length">
					<image src="@/static/images/loading_time.svg" mode="widthFix" class="icon"></image>延时
				</view>
				<view class="item" @click="controlTap(3)">
					<image src="@/static/images/replacement.svg" mode="widthFix" class="icon"></image>置换
				</view>
			</view>
		</haoheao-scroll>
		<popup ref="loading_time" type="bottom" :maskClick="false">
			<view class="popup">
				<view class="item-view select">
					<image src="@/static/images/date.svg" class="icon" mode="widthFix"></image>
					<view class="title">{{moment(new Date(reserveInfo.meetingdate)).format("MM-DD ") + reserveInfo.timeslotend}} 散会</view>
					<picker class="content" mode="multiSelector" @columnchange="bindMultiPickerColumnChange" :value="multiIndex"
					 :range="[maxDelayTimeList]">
						延时至:{{maxDelayTimeList[multiIndex]}}
					</picker>
				</view>
				<view class="bottom-control">
					<view class="left">您最多可延时{{maxDelayTimeList.length/2}}小时至{{maxDelayTimeList[maxDelayTimeList.length - 1]}}</view>
					<view class="content">
						<view class="close" @click="multiIndex = 0;$refs['loading_time'].close()">取消</view>
						<view class="item" @click="changeReserveTime()">
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
					<picker :class="['content',replaceIndex.reserveRoomList.length?'':'active']" range-key="roomname" @change="bindPickerChange"
					 :value="replaceIndex" :range="roomReserveList">
						{{replaceIndex == null?'请选择会议室':roomReserveList[replaceIndex].roomname}}
					</picker>
					<image src="@/static/images/right.svg" :class="['icon select-icon',replaceIndex === null?'':'active']" mode="widthFix"></image>
				</view>
				<radio-group @change="radioChange" class="meeting-list">
					<view class="item" v-for="(item,index) of roomReserveList[replaceIndex].reserveRoomList" :key="item.value">
						<view class="left">
							<view class="time">{{item.timeslotstart + ' ~ ' + item.timeslotend}}</view>
							<view class="name">{{item.deptname}} - {{item.optusername}}</view>
						</view>
						<radio class="radio" :value="`${item.id},${item.roomid}`" color="#647484" />
					</view>
				</radio-group>
				<view class="bottom-control">
					<view class="content">
						<view class="close" @click="$refs['replacement'].close()">取消</view>
						<view class="item" @click="replacement()">
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
				iconurl: "https://hg-kaifa-test.oss-cn-beijing.aliyuncs.com/meetingroom/",
				// 设备类型列表
				typeEquipmentList: [],
				// 房间列表+房间预约列表
				roomReserveList: [],
				// 选择延时日期
				multiIndex: 0,
				// 有效延时列表
				maxDelayTimeList: [],
				replaceIndex: '',
				// 会议室信息
				roomInfo: '',
				// 预约信息
				reserveInfo: '',
				// 会议室预约详情
				detailInfo: "",
				// 置换会议室选中
				radioChangeCurrent: ""
			}
		},
		computed: {
			mettingSetting() {
				return this.$store.state.metting
			},
		},
		methods: {
			// 置换会议室
			radioChange: function(evt) {
				this.radioChangeCurrent = evt.target.value.split(',')
			},
			// 延时时间修改
			bindMultiPickerColumnChange: function(e) {
				this.multiIndex = e.detail.value
				this.$forceUpdate()
			},
			// 下拉
			async onPullDown(done) {
				await this.getReserveDetail()
				this.meetingState()
				done();
			},
			async replacement() {
				let userinfo = this.utils.getUserInfo(uni);
				console.log(this.radioChangeCurrent)
				let changeCurrent = ''
				for (let item of this.roomReserveList) {
					if (item.roomid == this.radioChangeCurrent[1]) {
						for (let itm of item.reserveRoomList) {
							if (itm.id == this.radioChangeCurrent[0]) {
								changeCurrent = itm
							}
						}
					}
				}
				console.log(changeCurrent)
				console.log({
					Swapid: 0,
					Meetingdate: this.detailInfo.meetingdate,
					Sourceroomid: this.detailInfo.roomid,
					Sourcetimeslotstart: this.detailInfo.timeslotstart,
					Targetroomid: changeCurrent.roomid,
					Targettimeslotstart: changeCurrent.timeslotstart.replace(/:/, ''),
					Reason: '',
					Lstuserid: `${userinfo.usernumber}/${userinfo.username}`,
					Checkuserid: '',
					Checkdate: '',
					Status: 0,
					Sourcedeptid: this.detailInfo.deptid,
					Targetdeptid: changeCurrent.deptid
				})
				try {
					let data = await uni.request({
						method: 'POST',
						url: this.api.meeting_newReplacement,
						data: {
							Swapid: 0,
							Meetingdate: this.detailInfo.meetingdate,
							Sourceroomid: this.detailInfo.roomid,
							Sourcetimeslotstart: this.detailInfo.timeslotstart,
							Targetroomid: changeCurrent.roomid,
							Targettimeslotstart: changeCurrent.timeslotstart.replace(/:/, ''),
							Reason: '',
							Lstuserid: `${userinfo.usernumber}/${userinfo.username}`,
							Checkuserid: '',
							Checkdate: '',
							Status: 0,
							Sourcedeptid: this.detailInfo.deptid,
							Targetdeptid: changeCurrent.deptid
						}
					})
					let [err, success] = data
					console.log(err, success)
					if (!err && success.data.success) {
						uni.showToast({
							title: '已请求置换！',
							icon: 'none'
						});
						this.$refs['replacement'].close()
					} else {
						uni.showToast({
							title: err ? err : success.data.errmsg,
							icon: 'none',
							duration: 3000
						});
					}
				} catch (e) {
					console.log(e)
				}
			},
			// 延时
			async changeReserveTime() {
				let userinfo = this.utils.getUserInfo(uni);
				try {
					let data = await uni.request({
						method: 'POST',
						url: this.api.meeting_changeReserveTime,
						data: {
							Id: this.reserveInfo.id,
							Reason: '',
							Changetype: 5,
							Timeslotdesc: '',
							Timeslotstart: this.reserveInfo.timeslotstart.replace(/:/g, ''),
							Timeslotend: this.maxDelayTimeList[this.multiIndex].replace(/:/g, ''),
							Remark: '',
							Lstuserid: `${userinfo.usernumber}/${userinfo.username}`
						}
					})
					let [err, success] = data
					console.log(data)
					if (success.data.success) {
						uni.showToast({
							title: '延时成功！',
							icon: 'none',
							position: 'bottom'
						});
						await this.getReserveDetail()
						this.meetingState()
						this.multiIndex = 0;
						this.$refs['loading_time'].close()
						return
					}
				} catch (e) {}
			},
			// 底部按钮操作
			async controlTap(type) {
				let _this = this;
				let userinfo = this.utils.getUserInfo(uni);
				if (type == 1) {
					uni.showModal({
						title: '确定取消此次会议吗？',
						success: async function(res) {
							if (res.confirm) {
								console.log('取消会议')
								console.log(JSON.stringify({
									Id: _this.reserveInfo.id,
									Lstuserid: `${userinfo.usernumber}/${userinfo.username}`
								}))
								let data = await uni.request({
									method: 'POST',
									url: _this.api.meeting_delreserve,
									data: {
										Id: _this.reserveInfo.id,
										Lstuserid: `${userinfo.usernumber}/${userinfo.username}`
									}
								})
								let [err, success] = data
								console.log(success)
								if (success.data.success) {
									uni.showToast({
										title: '已取消此次会议',
										icon: 'none'
									});
									await _this.delay(1000)
									uni.navigateBack();
								}
							}
						}
					});
				} else if (type == 2) {
					// 选择散会日期
					this.$refs['loading_time'].open()
				} else if (type == 3) {
					this.replaceIndex = null;
					this.radioChangeCurrent = ""
					this.$refs['replacement'].open()
				}
			},
			// 置换会议室修改
			bindPickerChange: function(e) {
				console.log('picker发送选择改变，携带值为', e.target.value)
				this.replaceIndex = e.target.value
			},
			// 获取设备类型
			async getGoodsTypeList() {
				try {
					let data = await uni.request({
						method: 'GET',
						url: this.api.meeting_getGoodsTypeList
					})
					let [err, success] = data
					this.typeEquipmentList = success.data.data.typelist
				} catch (e) {}
			},
			// 移动设备信息添加
			async getFixedEquipmentList() {
				await this.getGoodsTypeList()
				for (let item of this.typeEquipmentList) {
					for (let itm of this.roomInfo.fixedEquipment) {
						if (item.goodstypeid == itm.goodstypeid) {
							itm.goodsitem = item
						}
					}
				}
			},
			// 获取预约详细信息
			async getReserveDetail() {
				await this.getGoodsTypeList()
				try {
					let data = await uni.request({
						method: 'GET',
						url: this.api.meeting_reserveDetail,
						data: {
							id: this.reserveInfo.id
						}
					})
					let [err, success] = data
					for (let item of this.typeEquipmentList) {
						for (let itm of success.data.data.detailInfo.mobileEquipmentChoose) {
							if (item.goodstypeid == itm.goodstypeid) {
								itm.goodsitem = item
							}
						}
					}
					this.detailInfo = success.data.data.detailInfo
					console.log('会议预约详情-------->>>', this.detailInfo)
				} catch (e) {}
			},
			// 会议状态判断
			meetingState() {
				if (new Date().getTime() < new Date(this.moment(new Date(this.reserveInfo.meetingdate)).format("YYYY/MM/DD ").replace(
							/-/g, '/') +
						this.reserveInfo.timeslotstart).getTime()) {
					// 未开始
					this.reserveInfo.meeting_state = 1
				} else if (new Date().getTime() > new Date(this.moment(new Date(this.reserveInfo.meetingdate)).format("YYYY/MM/DD ")
						.replace(/-/g, '/') +
						this.reserveInfo.timeslotstart).getTime() && new Date().getTime() < new Date(this.moment(new Date(this.reserveInfo
						.meetingdate)).format("YYYY/MM/DD ") + this.reserveInfo.timeslotend).getTime()) {
					// 正在进行
					this.reserveInfo.meeting_state = 2
				} else if (new Date().getTime() > new Date(this.moment(new Date(this.reserveInfo.meetingdate)).format("YYYY/MM/DD ")
						.replace(/-/g, '/') +
						this.reserveInfo.timeslotend).getTime()) {
					// 已结束
					this.reserveInfo.meeting_state = 3
				}
			},
			// 计算可延长最大时段
			getMaxDelayTimeList() {
				let interval_time = 86400 / this.mettingSetting.interval * 1000
				let time_list = []
				for (var index = 1; index <= this.mettingSetting.interval; index++) {
					let time_item = this.moment(
						new Date(
							new Date(this.moment().format("YYYY/MM/DD 00:00:00"))
						).getTime() + interval_time * index
					).format('YYYY/MM/DD hh:mm:ss')
					// 同一天同一会议室多个预定
					if (this.reserveInfo.nextreserve != null) {
						if (new Date(time_item).getTime() > new Date(this.moment().format(`YYYY/MM/DD ${this.reserveInfo.timeslotend}:00`))
							.getTime() && new Date(time_item).getTime() <= new Date(this.moment()
								.format(`YYYY/MM/DD ${this.reserveInfo.nextreserve.timeslotend}:00`)).getTime()) {
							time_list.push(this.moment(time_item).format('hh:mm'))
						}
					} else {
						if (new Date(time_item).getTime() > new Date(this.moment().format(
								`YYYY/MM/DD ${this.reserveInfo.timeslotend}:00`)).getTime()) {
							time_list.push(this.moment(time_item).format('hh:mm'))
						}
					}
				}
				this.maxDelayTimeList = time_list
				console.log('计算可延长最大时段时间列表------>>>', this.maxDelayTimeList)
			},
			// 请求会议室列表
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
			// 请求当天所有会议预约信息
			async getTodayReserveList() {
				await this.getRoomList();
				try {
					let data = await uni.request({
						method: 'POST',
						url: this.api.meeting_getDayReservationList,
						data: {
							MeetingdateStart: this.moment(new Date(this.detailInfo.meetingdate)).format('YYYY-MM-DD 00:00:00').replace(
								/-/g, '/'),
							MeetingdateEnd: this.moment(new Date(this.detailInfo.meetingdate)).format('YYYY-MM-DD 00:00:00').replace(/-/g,
								'/')
						}
					})
					let [err, success] = data
					for (let index in success.data.data) {
						for (let ind in success.data.data[index]) {
							let item = success.data.data[index][ind]
							item.optusername = item.optuser.replace("/", " - ").split(' - ')[1];
							item.optusernumber = item.optuser.replace("/", " - ").split(' - ')[0];
							item.optuser = item.optuser.replace("/", " - ");
							item.timeslotend = this.insert_flg(item.timeslotend, ':', 2)
							item.timeslotstart = this.insert_flg(item.timeslotstart, ':', 2)
						}
					}
					for (let item of this.roomReserveList) {
						for (let index in success.data.data) {
							if (item.roomid == index) {
								item.reserveRoomList = success.data.data[index]
							}
						}
					}
					for (let index in this.roomReserveList) {
						if (!this.roomReserveList[index].reserveRoomList.length) {
							this.roomReserveList.splice(index, index + 1)
						}
					}
					this.$forceUpdate()
					console.log('预约列表------>>>', success.data.data)
					console.log('会议室列表-------->>>', this.roomReserveList)
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
		onLoad: async function(option) {
			this.roomInfo = JSON.parse(option.options)[0]
			this.reserveInfo = JSON.parse(option.options)[1]
			this.meetingState()
			console.log('会议室信息------>>>', this.roomInfo)
			console.log('预约信息------>>>', this.reserveInfo)
			await this.getFixedEquipmentList()
			await this.getReserveDetail()
			this.getMaxDelayTimeList()
			this.getTodayReserveList()
		},
		onShow: function() {}
	}
</script>

<style lang="scss" scoped>
	@import '@/styles/detail.scss';
	@import '@/styles/popup.scss';

	.container.detail .view-item .detail-control {
		.state {
			background: #999;

			&.active {
				background: #D56C68;
			}
		}
	}

	.container.detail {
		.control-list {
			position: static;
			background: transparent;
			padding: 0;
		}
	}

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
					color: #647484;
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

		// 会议室预约列表
		.meeting-list {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;

			.item {
				display: flex;
				align-items: center;
				background: #F3F5F7;
				border-radius: 10rpx;
				width: calc(100%/2 - 15rpx);
				margin-bottom: 20rpx;
				padding: 10px 10px;
				box-sizing: border-box;
				font-size: 26rpx;

				.left {
					flex: 2;
				}

				.time {
					font-weight: 900;
					color: #647484;
				}

				.name {
					font-size: 24rpx;
					color: #ccc;
				}

				.radio {
					zoom: 0.8;
				}

				>.state {
					font-size: 24rpx;
					color: #ccc;
				}
			}
		}

		.bottom-control {
			position: static;

			.left {
				color: #CCCCCC;
				font-size: 26rpx;
			}
		}
	}
</style>
