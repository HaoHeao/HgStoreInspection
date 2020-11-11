<template>
	<scroll-view scroll-y class="container">
		<view class="top"></view>
		<view class="view-item info">
			<view class="date-view">
				<view class="date-day">{{option_data.text}}</view>
				<view class="date-week">{{option_data.week}}</view>
				<view class="date-info">{{option_data.info}}</view>
			</view>
			<view class="right">
				<!-- 名称 -->
				<view class="meeting-room">
					<view class="name">{{option_roominfo.roomname}}</view>
					<view class="open-detail" @click="openDetail = !openDetail">
						详细信息
						<image :class="['icon',openDetail?'active':'']" src="@/static/images/right.svg" mode="widthFix"></image>
					</view>
				</view>
				<!-- 会议室详细信息 -->
				<view class="room-info fadeIn" v-if="openDetail">
					<!-- 会议室信息 -->
					<view class="info-view">
						<view class="item">位置：{{option_roominfo.location}}</view>
						<view class="item">人数限制：{{option_roominfo.peoplelimit}}人</view>
					</view>
					<!-- 固定设备 -->
					<view class="fixed-equip" v-if="option_roominfo.fixedEquipment.length">
						<view class="title">固定设备</view>
						<view class="equip-list">
							<view class="item" v-for="(item,index) of option_roominfo.fixedEquipment">
								<image class="icon" :src="iconurl + item.goodsitem.icon" mode="widthFix"></image>
								<view class="name">{{item.goodsname}}</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 已预约 -->
				<view :class="['boooked',openDetail?'active':'']" v-if="option_roominfo.reserveRoomList.length">
					<view class="gray-txt">今日已预约</view>
					<view class="item-booked" v-for="(item,index) of option_roominfo.reserveRoomList" :key="index">
						<view class="time">{{item.timeslotstart}} ~ {{item.timeslotend}}</view>
						<view class="gray-txt" v-if="item.deptname && item.optusername">{{item.deptname + ' - ' + item.optusername}}</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 预约时间 -->
		<view class="view-item input time">
			<view class="input-item">
				<view class="title">
					<image src="@/static/images/date.svg" mode="widthFix" class="icon"></image>
				</view>
				<picker class="content" mode="multiSelector" @columnchange="bindMultiPickerColumnChange" :value="multiIndex" :range="[startTimeList,endTimeList]"
				 v-if="startTimeList.length && endTimeList.length">
					<view class="uni-input content">{{startTimeList[multiIndex[0]]}} - {{endTimeList[multiIndex[1]]}}</view>
				</picker>
			</view>
		</view>
		<!-- 参会人数 -->
		<view class="view-item input">
			<view class="input-item">
				<view class="title">人数</view>
				<input type="number" value="" class="content" placeholder="参会人数" v-model="meetingNumber" />
				<view class="clear" @click="meetingNumber = ''" v-if="meetingNumber">
					<view class="view">×</view>
				</view>
			</view>
			<view class="input-item textarea">
				<view class="title">会议主题</view>
				<textarea v-if="!openMobilepopup" disable-default-padding class="textarea-view fadeIn" placeholder="会议主题" v-model="meetingTitle"
				 auto-height />
				<!-- <input type="text" value="" class="content" placeholder="会议主题" v-model="meetingTitle" /> -->
				<view class="clear" @click="meetingTitle = ''" v-if="meetingTitle">
					<view class="view">×</view>
				</view>
			</view>
		</view>
		<!-- 移动设备 -->
		<!-- <view class="view-item input equip">
			<view class="input-item">
				<view class="title">移动设备</view>
				<view class="content">
					<view class="add-equip" @click="openMobilepopup = true;$refs['mobile_popup'].open()">添加移动设备</view>
				</view>
			</view>
			<view class="input-item equip-list">
				<view class="item" v-for="(item,index) of mobileEquipmentList" :key="index" v-if="item.goodscount">
					<image :src="iconurl + item.goodsitem.icon" class="icon" mode="widthFix"></image>
					<view class="name">{{item.goodsname}}</view>
					<view class="num">×{{item.goodscount}}</view>
					<view class="del" @click="selectMobileEquipment({type:'delItem',item})">×</view>
				</view>
			</view>
		</view> -->
		<!-- 所需设备说明 -->
		<view class="view-item text">
			<view class="title">所需设备说明：</view>
			<view class="title">饮用水、纸巾、会议花等用品请自行准备。</view>
			<view class="title">笔记本电脑等技术支持，请自行联系信息开发-IT运维。</view>
		</view>
		<!-- <uni-popup ref="mobile_popup" type="bottom" :maskClick="false">
			<view class="popup mobile-equipment">
				<view class="title">软件设备</view>
				<view class="item-view-list">
					<view class="item" v-for="(item,index) of mobileEquipmentList" :key="index">
						<image :src="iconurl + item.goodsitem.icon" class="icon" mode="widthFix"></image>
						<view class="name">{{item.goodsname}}</view>
						<view class="num-view">
							<view class="btn" @click="selectMobileEquipment({type:'del',item})">
								<image class="icon" src="@/static/images/minus-circle.svg" mode="widthFix"></image>
							</view>
							<input type="number" :value="item.goodscount" class="num" @input="selectMobileEquipment({type:'input',item},$event)" />
							<view class="btn" @click="selectMobileEquipment({type:'add',item})">
								<image class="icon" src="@/static/images/add-circle.svg" mode="widthFix"></image>
							</view>
						</view>
					</view>
				</view>
				<view class="bottom-control">
					<view class="content">
						<view class="close" @click="getMobileEquipment();selectMobileEquipmentList = []">清空</view>
						<view class="item" @click="openMobilepopup = false;$refs['mobile_popup'].close()">完成</view>
					</view>
				</view>
			</view>
		</uni-popup> -->
		<view class="mh-btn" @click="reserva()">
			<u-loading :show="reserveLoading" mode="circle" size="28"></u-loading>
			{{reserveLoading?'':'预约'}}
		</view>
	</scroll-view>
</template>

<script>
	export default {
		data() {
			return {
				iconurl: "https://hg-kaifa-test.oss-cn-beijing.aliyuncs.com/meetingroom/",
				// 所要预约会议室信息
				option_roominfo: "",
				// 所要预约的天
				option_data: "",
				// 设备类型列表
				typeEquipmentList: [],
				// 移动设备列表
				mobileEquipmentList: [],
				// 已选择移动设备列表
				selectMobileEquipmentList: [],
				// 详细信息查看
				openDetail: true,
				// 预约时段间隔数
				interval: 48,
				startTime: '',
				endTime: '',
				startTimeList: [],
				endTimeList: [],
				multiIndex: [0, 0],
				// 参会人数
				meetingNumber: "",
				// 会议主题
				meetingTitle: "",
				// 预约loading
				reserveLoading: false,
				// 是否打开软件设备选择
				openMobilepopup:false
			}
		},
		computed: {
			mettingSetting() {
				return this.$store.state.metting
			},
			startTimeLimit() {
				return this.moment(new Date()).format("hh:mm")
			},
			endTimeLimit() {
				if (this.startTime == '开会时间') {
					return this.moment(new Date()).format("hh:mm")
				}
				return this.startTime
			},
			setting() {
				return this.$store.state.setting
			},
			userinfo() {
				return this.utils.getUserInfo(uni)
			}
		},
		methods: {
			startTimeChange(e) {
				this.startTime = e.target.value
			},
			endTimeChange(e) {
				this.endTime = e.target.value
			},
			// 软件设备修改
			selectMobileEquipment(options, e) {
				console.log('软件设备修改------>>>',options, e)
				if (options.type == 'add') {
					for (let item of this.mobileEquipmentList) {
						if (item.goodsid == options.item.goodsid) {
							if (item.goodscount >= options.item.count) {
								uni.showToast({
									title: '已达到最大数量',
									icon: 'none',
									position: 'bottom'
								});
							} else {
								item.goodscount += 1
							}
						}
					}
				} else if (options.type == 'del') {
					for (let item of this.mobileEquipmentList) {
						if (item.goodsid == options.item.goodsid) {
							if (item.goodscount != 0) {
								item.goodscount -= 1
							}
							if (item.goodscount <= 0) {
								item.goodscount = null
							}
						}
					}
				} else if (options.type == 'input') {
					let num = Number(e.detail.value);
					for (let item of this.mobileEquipmentList) {
						if (item.goodsid == options.item.goodsid) {
							if (num >= options.item.count) {
								item.goodscount = options.item.count
								uni.showToast({
									title: '已达到最大数量',
									icon: 'none',
									position: 'bottom'
								});
								return options.item.count
							} else {
								item.goodscount = num
							}
						}
					}
				} else if (options.type == 'delItem') {
					for (let item of this.mobileEquipmentList) {
						if (item.goodsid == options.item.goodsid) {
							item.goodscount = null
						}
					}
				}
			},
			async reserva() {
				if (!this.meetingNumber) {
					uni.showToast({
						title: '请填写参会人数',
						icon: 'none'
					});
					return
				}
				if (!this.meetingTitle) {
					uni.showToast({
						title: '请填写会议主题',
						icon: 'none'
					});
					return
				}
				if(this.reserveLoading) return;
				this.reserveLoading = true
				// let selectMobileEquipmentList = [];
				// for (let item of this.mobileEquipmentList) {
				// 	if (item.goodscount) {
				// 		selectMobileEquipmentList.push({
				// 			Goodsid: item.goodsid,
				// 			Usecount: item.goodscount,
				// 			Status: 0,
				// 			Lstuserid: `${this.userinfo.usernumber}/${this.userinfo.username}`
				// 		})
				// 	}
				// }
				// this.selectMobileEquipmentList = selectMobileEquipmentList
				try {
					let data = await uni.request({
						method: 'POST',
						url: this.api.meeting_reserve,
						data: {
							Id: 0,
							Roomid: this.option_roominfo.roomid,
							Deptid: this.userinfo.deptno,
							Deptname: this.userinfo.deptname,
							Optuser: `${this.userinfo.usernumber}/${this.userinfo.username}`,
							Meetingdate: this.moment(new Date(this.option_data.day.replace(/-/g, '/'))).format('YYYY/MM/DD 00:00:00').replace(/-/g, '/'),
							Timeslotdesc: '',
							Timeslotstart: this.moment(new Date(this.moment(new Date(this.option_data.day.replace(/-/g, '/'))).format('YYYY/MM/DD').replace(/-/g, '/') + ' ' +
								this.startTimeList[this.multiIndex[0]])).format('hhmm').replace(/-/g, '/'),
							Timeslotend: this.moment(new Date(this.moment(new Date(this.option_data.day.replace(/-/g, '/'))).format('YYYY/MM/DD').replace(/-/g, '/') + ' ' +
								this.endTimeList[this.multiIndex[1]])).format('hhmm').replace(/-/g, '/'),
							Title: this.meetingTitle,
							Peoplecount: this.meetingNumber,
							Mainpeople: '',
							Mainleader: '',
							Summary: '',
							Remark: '',
							Status: 0,
							Lstuserid: this.userinfo.usernumber,
							FixedEquipmentChoose: [],
							MeetingAppendix: [],
							MobileEquipmentChoose: this.selectMobileEquipmentList
						}
					})
					this.reserveLoading = false
					let [err, success] = data
					console.log('预约成功------>>>', success)
					if (!err && success.data.success) {
						uni.showToast({
							title: '预约成功！',
							icon: 'none'
						});
						await this.delay(1000)
						this.UpdateNavigationBack()
					}else{
						console.log(err?err:success.data.errmsg)
						uni.showToast({
							title: err?err:success.data.errmsg,
							icon: 'none',
							duration:3000
						});
					}
				} catch (e) {
					this.reserveLoading = false
				}
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
			// 获取移动设备列表
			async getMobileEquipment() {
				await this.getGoodsTypeList()
				try {
					let data = await uni.request({
						method: 'POST',
						url: this.api.meeting_getMobileEquipmentList,
						data: {}
					})
					let [err, success] = data
					for (let item of this.typeEquipmentList) {
						for (let itm of success.data.data.goodslist) {
							itm.goodscount = null
							if (item.goodstypeid == itm.goodstypeid) {
								itm.goodsitem = item
							}
						}
					}
					this.mobileEquipmentList = success.data.data.goodslist
					console.log('移动设备列表-------->>>', this.mobileEquipmentList)
				} catch (e) {}
			},
			// 获取固定设备列表
			async getFixedEquipment() {
				await this.getGoodsTypeList()
				for (let item of this.typeEquipmentList) {
					for (let itm of this.option_roominfo.fixedEquipment) {
						if (item.goodstypeid == itm.goodstypeid) {
							itm.goodsitem = item
						}
					}
				}
				console.log('固定设备列表-------->>>', this.option_roominfo.fixedEquipment)
			},
			// 预约开始时间
			getReservaStratList() {
				let interval_time = 86400 / this.mettingSetting.interval * 1000
				let time_list = []
				for (var index = 1; index <= this.mettingSetting.interval; index++) {
					let time_item = this.moment(
						new Date(
							new Date(this.moment().format("YYYY/MM/DD 00:00:00"))
						).getTime() + interval_time * index
					).format('YYYY/MM/DD hh:mm:ss')
					if (new Date(this.moment(this.option_data.day.replace(/-/g, '/')).format("YYYY/MM/DD 00:00:00").replace(/-/g, '/'))
						.getTime() == new Date(this.moment().format("YYYY/MM/DD 00:00:00").replace(/-/g, '/')).getTime()) {
						if (new Date().getTime() && new Date(time_item) > new Date()) {
							if (this.moment(time_item).format('hh:mm') == '00:00') {
								time_list.push('24:00')
							} else {
								time_list.push(this.moment(time_item).format('hh:mm'))
							}
						}
					} else {
							if (this.moment(time_item).format('hh:mm') == '00:00') {
								time_list.push('24:00')
							} else {
								time_list.push(this.moment(time_item).format('hh:mm'))
							}
					}
				}
				time_list.pop()
				this.startTimeList = time_list
				console.log('预约开始时间列表------>>>', this.startTimeList)
			},
			// 预约结束时间
			getReservaEndList() {
				let interval_time = 86400 / this.mettingSetting.interval * 1000
				let time_list = []
				for (var index = 1; index <= this.mettingSetting.interval; index++) {
					let time_item = this.moment(
						new Date(
							new Date(this.moment().format("YYYY/MM/DD 00:00:00").replace(/-/g, '/'))
						).getTime() + interval_time * index
					).format('YYYY/MM/DD hh:mm:ss')
					if (new Date(this.moment(this.option_data.day.replace(/-/g, '/')).format("YYYY/MM/DD 00:00:00").replace(/-/g, '/'))
						.getTime() == new Date(this.moment().format("YYYY/MM/DD 00:00:00").replace(/-/g, '/')).getTime()) {
						if (new Date().getTime() && new Date(time_item) > new Date() + 1800000) {
							if (this.moment(time_item).format('hh:mm') == '00:00') {
								time_list.push('24:00')
							} else {
								time_list.push(this.moment(time_item).format('hh:mm'))
							}
						}
					} else {
						if (this.moment(time_item).format('hh:mm') == '00:00') {
							time_list.push('24:00')
						} else {
							time_list.push(this.moment(time_item).format('hh:mm'))
						}
					}
					if (new Date(time_item) > new Date().getTime() + 1800000) {
						if (this.moment(time_item).format('hh:mm') == '00:00') {
							time_list.push('24:00')
						} else {
							time_list.push(this.moment(time_item).format('hh:mm'))
						}
					}
				}
				time_list.pop()
				this.endTimeList = time_list
				console.log('预约结束时间列表------>>>', this.endTimeList)
			},
			bindMultiPickerColumnChange: function(e) {
				this.multiIndex[e.detail.column] = e.detail.value
				this.$forceUpdate()
			},
			// 返回上一页并更新
			UpdateNavigationBack() {
				let pages = getCurrentPages();
				let beforePage = pages[pages.length - 2];
				console.log(pages,beforePage)
				beforePage.$vm.getDayReservationList(beforePage.$vm.activeBookedDate);
				wx.navigateBack({
					delta: 1
				})
			},
		},
		onLoad: async function(option) {
			uni.showNavigationBarLoading()
			this.option_roominfo = JSON.parse(option.options)[0]
			this.option_data = JSON.parse(option.options)[1]
			console.log('预约会议室信息------>>>', this.option_roominfo)
			console.log('预约天信息------>>>', this.option_data)
			// 去除已过期会议预约
			let _this = this;
			let new_date = new Date().getTime();
			this.option_roominfo.reserveRoomList = this.option_roominfo.reserveRoomList.filter(function(item) {
				return new Date(`${_this.moment(item.meetingdate).format('YYYY/MM/DD ')}${item.timeslotend}:00`).getTime() >
					new_date
			});
			await this.getFixedEquipment()
			// await this.getMobileEquipment()
			await this.getReservaStratList()
			await this.getReservaEndList()
			if (new Date(this.moment(this.option_data.day.replace(/-/g, '/')).format("YYYY/MM/DD 00:00:00").replace(/-/g, '/'))
				.getTime() != new Date(this.moment(new Date())
					.format("YYYY/MM/DD 00:00:00").replace(/-/g, '/')).getTime()) {
				this.multiIndex = [17, 18]
			}
			uni.hideNavigationBarLoading()
		}
	}
</script>

<style lang="scss" scoped>
	page{
		background: #F6F7F9;
	}

	.container {
		box-sizing: border-box;
		height: 100vh;
		background: #F6F7F9;
		padding-top: 1rpx;
		/* IOS XR */
		padding-bottom:env(safe-area-inset-bottom);
		/* ------ */
		
		.top{
			height: 20rpx;
		}
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

						>.equip-list {
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
						margin-bottom: 10rpx;
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
				margin-top: 0;
			}

			// 时间选择
			&.time {
				.input-item {

					.title {
						min-width: auto !important;
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
						.content {
							width: 630rpx;
						}

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
						align-self: flex-start;
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
						top: calc(50% - 40rpx);
						right: 0;
						z-index: 1;
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
					&.textarea{
						padding-right: 80rpx;
						height: auto;
						align-items: center;
						min-height: 80rpx;
						.textarea-view{
							padding: 24rpx 0rpx;
						}
					}
				}
			}

			// 添加可移动设备
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
			
			&.text{
				padding: 20rpx;
				color: #647484;
				margin-bottom: 120rpx;
				.title{
					font-size: 26rpx;
				}
			}
		}

		.mh-btn {
			border-radius: 80rpx;
			line-height: 80rpx;
			width: calc(100% - 40rpx);
			margin: 20rpx;
			margin-top: 40rpx;
			/* IOS XR */
			margin-bottom:calc(env(safe-area-inset-bottom) + 20rpx);
			/* ------ */
			background: #647484;
			color: #fff;
			letter-spacing: 5rpx;
			font-weight: 800;
			text-align: center;
			position: fixed;
			z-index: 999;
			bottom:0;
			transition: .3s;

			&:active {
				opacity: 0.75;
			}
		}

		.popup {
			padding: 30rpx;
			padding-right: 10rpx;
			padding-bottom: 0;

			&.mobile-equipment {
				.bottom-control {
					z-index: 999;
					padding: 20rpx 20rpx;
					position: sticky;
					bottom: 0;
					background: #fff;

					.item {
						line-height: 60rpx;
					}
				}
			}

			.item-view-list {
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				color: #647484;
				margin-bottom: 30rpx;

				.item {
					width: calc(100%/3 - 20rpx);
					margin-right: 20rpx;
					margin-bottom: 20rpx;
					background: #F3F5F7;
					text-align: center;
					border-radius: 10rpx;

					&:nth-child(3n + 3) {
						margin-right: 0px;
					}

					>.icon {
						width: 60rpx;
						height: 60rpx;
						margin-top: 20rpx;
						margin-bottom: 10rpx;
					}

					.name {
						font-size: 22rpx;
						margin-bottom: 14rpx;
					}

					.num-view {
						border-top: 1rpx solid #fff;
						display: flex;
						align-items: center;
						justify-content: center;

						.btn {
							display: flex;
							justify-content: center;
							align-items: center;
							padding: 20rpx;

							&:active {
								opacity: 0.6;
								background: #e2e2e2;
							}

							>.icon {
								width: 32rpx;
								height: 32rpx;
							}
						}

						.num {
							text-align: center;
							flex: 2;
							line-height: 32rpx;
						}
					}
				}
			}
		}
	}
</style>
