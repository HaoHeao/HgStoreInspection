<!-- 界面展示信息 -->
<template>
	<view class="container detail">
		<haoheao-scroll class="haoheao-scroll" ref="scroll" @onPullDown="onPullDown">
			<view class="view-item fadeIn" v-if="detailInfo">
				<view class="detail-control">
					<view :class="['state',detailInfo.meeting_state == 2?'active':'']">{{detailInfo.meeting_state == 1?'会议未开始':detailInfo.meeting_state == 2?'会议正在进行':detailInfo.meeting_state == 3?'会议已结束':''}}</view>
				</view>
				<view class="title">{{detailInfo.title}}</view>
				<view class="item">
					<view class="title">会议室</view>
					<view class="content">{{detailInfo.roomname}}</view>
				</view>
				<view class="item">
					<view class="title">开会日期</view>
					<view class="content">{{moment(new Date(detailInfo.meetingdate)).format("MM-DD ") + detailInfo.timeslotstartTime}}
						~ {{moment(new Date(detailInfo.meetingdate)).format("MM-DD ") + detailInfo.timeslotendTime}}</view>
				</view>
				<view class="item">
					<view class="title">参会人数</view>
					<view class="content">{{detailInfo.peoplecount}}人</view>
				</view>
				<view class="item">
					<view class="title">预约人员</view>
					<view class="content">{{detailInfo.deptname + ' - ' + detailInfo.optuser.replace("/", " - ").split(' - ')[1]}}</view>
				</view>
			</view>
			<view class="view-item">
				<view class="item">
					<view class="title">位置</view>
					<view class="content">{{detailInfo.t_MeetingRoom.location}}</view>
				</view>
				<view class="item">
					<view class="title">房间密码</view>
					<view class="content">{{detailInfo.t_MeetingRoom.password?detailInfo.t_MeetingRoom.password:'无密码'}}</view>
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
			<view class="view-item control-list">
				<view class="item del" @click="controlTap(1)" v-if="detailInfo.meeting_state == 1">
					<image src="@/static/images/del_white.svg" mode="widthFix" class="icon"></image>取消
				</view>
				<view class="item" @click="controlTap(2)" v-if="detailInfo.meeting_state != 3">
					<image src="@/static/images/loading_time.svg" mode="widthFix" class="icon"></image>延时
				</view>
				<view class="item" @click="controlTap(3)" v-if="detailInfo.meeting_state == 1">
					<image src="@/static/images/replacement.svg" mode="widthFix" class="icon"></image>
					<view class="replacement" v-if="replacementList.length">{{replacementList.length}}</view>
					置换
				</view>
			</view>
		</haoheao-scroll>
		<uni-popup ref="loading_time" type="bottom">
			<view class="popup">
				<view class="item-view select">
					<image src="@/static/images/date.svg" class="icon" mode="widthFix"></image>
					<view class="title">{{moment(new Date(detailInfo.meetingdate)).format("MM-DD ") + detailInfo.timeslotendTime}} 散会</view>
					<picker class="content" mode="multiSelector" @change="bindMultiPickerChange" :value="multiIndex" :range="[maxDelayTimeList]">
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
		</uni-popup>
		<uni-popup ref="replacement" type="bottom">
			<view class="popup" v-if="!replacementList.length">
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
			<view class="popup" v-if="replacementList.length">
				<view class="title">请求置换会议</view>
				<radio-group @change="radioReplacementListChange" class="meeting-list">
					<view :class="['item',item.status == 2000?'refuse':'']" v-for="(item,index) of replacementList" :key="index">
						<!-- <view class="item"> -->
						<view class="left">
							<view class="time">{{item.sourceroomname}}</view>
							<view class="time">{{item.sourcetimeslotstart + ' ~ ' + item.sourcetimeslotend}}</view>
							<view class="name">{{item.sourceoptuser.replace('/', ' - ')}}</view>
						</view>
						<view class="refuse-text" v-if="item.status == 2000">已拒绝</view>
						<radio class="radio" :value="item.swapid" color="#647484" />
					</view>
				</radio-group>
				<view class="bottom-control">
					<view class="content">
						<view class="close" @click="$refs['replacement'].close()">取消</view>
						<view class="item refuse fadeIn" @click="refuseReplacement()">
							<!-- <image src="@/static/images/replacement.svg" class="icon" mode="widthFix"></image> -->
							拒绝
						</view>
						<view class="item" @click="agreeReplacement()">
							<image src="@/static/images/replacement.svg" class="icon" mode="widthFix"></image>同意置换
						</view>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				iconurl: "https://hg-kaifa-test.oss-cn-beijing.aliyuncs.com/meetingroom/",
				// 请求置换列表
				replacementList: [],
				// 设备类型列表
				typeEquipmentList: [],
				// 房间列表+房间预约列表
				roomReserveList: [],
				// 有效延时列表
				maxDelayTimeList: [],
				// 选择延时日期
				multiIndex: 0,
				replaceIndex: '',
				// 会议室信息
				roomInfo: '',
				// 预约信息
				reserveInfo: '',
				// 会议室预约详情
				detailInfo: "",
				// 置换会议室选中
				radioChangeCurrent: "",
				radioReplacementListChangeCurrent: ""
			}
		},
		computed: {
			mettingSetting() {
				return this.$store.state.metting
			},
		},
		methods: {
			// 拒绝置换会议室
			async refuseReplacement() {
				if (!this.radioReplacementListChangeCurrent) {
					uni.showToast({
						title: '请选择会议',
						icon: 'none'
					});
					return
				}
				let userinfo = this.utils.getUserInfo(uni);
				let _this = this
				uni.showModal({
					title: '您确定拒绝会议置换吗？',
					success: async function(res) {
						if (res.confirm) {
							let data = await uni.request({
								method: 'POST',
								url: _this.api.meeting_refusereplacement,
								data: {
									Id: _this.radioReplacementListChangeCurrent,
									Lstuserid: `${userinfo.usernumber}/${userinfo.username}`
								}
							})
							let [err, success] = data
							console.log("已拒绝此会议置换申请", success)
							if (success.data.success) {
								uni.showToast({
									title: '已拒绝此会议置换申请！',
									icon: 'none'
								})
								_this.getReplacement()
								_this.$refs['replacement'].close();
							}
						}
					}
				});
			},
			// 同意置换会议室
			async agreeReplacement() {
				if (!this.radioReplacementListChangeCurrent) {
					uni.showToast({
						title: '请选择会议',
						icon: 'none'
					});
					return
				}
				let userinfo = this.utils.getUserInfo(uni);
				let _this = this
				uni.showModal({
					title: '您确定与此会议置换吗？',
					success: async function(res) {
						if (res.confirm) {
							let data = await uni.request({
								method: 'POST',
								url: _this.api.meeting_agreereplacement,
								data: {
									Swapid: _this.radioReplacementListChangeCurrent,
									Checkuserid: `${userinfo.usernumber}/${userinfo.username}`
								}
							})
							let [err, success] = data
							console.log("已同意此会议置换申请", success)
							if (success.data.success) {
								uni.showToast({
									title: '已同意此会议置换申请！',
									icon: 'none'
								})
								_this.getReserveDetail()
								_this.getReplacement()
								_this.$refs['replacement'].close();
							}
						}
					}
				});
			},
			// 置换会议室
			radioChange(evt) {
				this.radioChangeCurrent = evt.target.value.split(',')
			},
			radioReplacementListChange(evt) {
				this.radioReplacementListChangeCurrent = evt.target.value
			},
			// 延时时间修改
			bindMultiPickerChange(e) {
				this.multiIndex = e.detail.value[0];
				this.$forceUpdate()
			},
			// 下拉
			async onPullDown(done) {
				await this.getReserveDetail()
				this.getReplacement()
				done();
			},
			// 请求置换
			async replacement() {
				if (!this.radioChangeCurrent) {
					uni.showToast({
						title: '请选择要置换的会议',
						icon: 'none'
					});
					return
				}
				let userinfo = this.utils.getUserInfo(uni);
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
				try {
					let data = await uni.request({
						method: 'POST',
						url: this.api.meeting_newReplacement,
						data: {
							Lstuserid: `${userinfo.usernumber}/${userinfo.username}`,
							Targetappointmentid: this.detailInfo.id,
							Sourceappointmentid: changeCurrent.id,
						}
					})
					let [err, success] = data
					console.log('请求置换成功------>>>', success)
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
							Id: this.detailInfo.id,
							Reason: '',
							Changetype: 5,
							Timeslotdesc: '',
							Timeslotstart: this.detailInfo.timeslotstart,
							Timeslotend: this.maxDelayTimeList[this.multiIndex].replace(/:/g, ''),
							Remark: '',
							Lstuserid: `${userinfo.usernumber}/${userinfo.username}`
						}
					})
					let [err, success] = data
					console.log('延时成功', success)
					if (success.data.success) {
						uni.showToast({
							title: '延时成功！',
							icon: 'none',
							position: 'bottom'
						});
						this.getReserveDetail()
						this.$refs['loading_time'].close()
						return
					}
				} catch (e) {
					console.log(e)
				}
			},
			// 底部按钮操作
			async controlTap(type) {
				let _this = this;
				let userinfo = this.utils.getUserInfo(uni);
				if (type == 1) {
					// 取消
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
								console.log('已取消此次会议------>>>', success)
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
					// 延时
					await this.getMaxDelayTimeList()
					if (!this.maxDelayTimeList.length) {
						uni.showToast({
							title: '结束时间与下次预约开始时间相同，不可延时',
							icon: 'none',
							duration: 3000
						});
						return
					}
					this.multiIndex = '0'
					this.$refs['loading_time'].open()
				} else if (type == 3) {
					this.replacementList = ''
					this.replaceIndex = null;
					this.radioChangeCurrent = ""
					this.radioReplacementListChangeCurrent = ''
					this.getReplacement()
					uni.showLoading({
						title: '加载中'
					});
					await this.getTodayReserveList()
					uni.hideLoading();
					// 置换
					if (!this.roomReserveList.length) {
						uni.showToast({
							title: '无可置换会议室',
							icon: 'none',
							duration: 3000
						});
						return
					}
					this.$refs['replacement'].open()
					this.$forceUpdate()
				}
			},
			// 置换会议室修改
			bindPickerChange: function(e) {
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
					success.data.data.detailInfo.timeslotstartTime = this.insert_flg(success.data.data.detailInfo.timeslotstart, ':',
						2)
					success.data.data.detailInfo.timeslotendTime = this.insert_flg(success.data.data.detailInfo.timeslotend, ':', 2)
					this.detailInfo = success.data.data.detailInfo
					this.meetingState()
					console.log('会议预约详情-------->>>', this.detailInfo)
				} catch (e) {}
			},
			// 会议状态判断
			meetingState() {
				if (new Date().getTime() < new Date(this.moment(new Date(this.detailInfo.meetingdate)).format("YYYY/MM/DD ").replace(
							/-/g, '/') +
						this.detailInfo.timeslotstartTime).getTime()) {
					// 未开始
					this.detailInfo.meeting_state = 1
				} else if (new Date().getTime() > new Date(this.moment(new Date(this.detailInfo.meetingdate)).format("YYYY/MM/DD ")
						.replace(/-/g, '/') +
						this.detailInfo.timeslotstartTime).getTime() && new Date().getTime() < new Date(this.moment(new Date(this.detailInfo
						.meetingdate)).format("YYYY/MM/DD ") + this.detailInfo.timeslotendTime).getTime()) {
					// 正在进行
					this.detailInfo.meeting_state = 2
				} else if (new Date().getTime() > new Date(this.moment(new Date(this.detailInfo.meetingdate)).format("YYYY/MM/DD ")
						.replace(/-/g, '/') +
						this.detailInfo.timeslotendTime).getTime()) {
					// 已结束
					this.detailInfo.meeting_state = 3
				}
			},
			// 计算可延长最大时段
			getMaxDelayTimeList() {
				let interval_time = 86400 / this.mettingSetting.interval * 1000; // 一天时间-毫秒
				let time_list = []
				for (var index = 1; index <= this.mettingSetting.interval /* vuex定义的天时间分割，没啥用，固定48 */ ; index++) {
					let time_item = this.moment(
						new Date(
							new Date(this.moment().format("YYYY/MM/DD 00:00:00"))
						).getTime() + interval_time * index
					).format('YYYY/MM/DD hh:mm:ss'); //现在往后半小时*时间分割下标
					// 同一天同一会议室多个预定
					if (this.reserveInfo.nextreserve != null) {
						if (new Date(time_item).getTime() > new Date(this.moment().format(
								`YYYY/MM/DD ${this.detailInfo.timeslotendTime}:00`))
							.getTime() && new Date(time_item).getTime() <= new Date(this.moment()
								.format(`YYYY/MM/DD ${this.reserveInfo.nextreserve.timeslotstart}:00`)).getTime()) {
							time_list.push(this.moment(time_item).format('hh:mm'))
						}
					} else {
						if (new Date(time_item).getTime() > new Date(this.moment().format(
								`YYYY/MM/DD ${this.detailInfo.timeslotendTime}:00`)).getTime()) {
							if (this.moment(time_item).format('hh:mm') == '00:00') {
								time_list.push('24:00')
							} else {
								time_list.push(this.moment(time_item).format('hh:mm'))
							}
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
							MeetingdateStart: this.moment(new Date(this.detailInfo.meetingdate)).format('YYYY/MM/DD 00:00:00').replace(
								/-/g, '/'),
							MeetingdateEnd: this.moment(new Date(this.detailInfo.meetingdate)).format('YYYY/MM/DD 00:00:00').replace(/-/g,
								'/')
						}
					})
					let [err, success] = data,
					_this = this;
					for (let index in success.data.data) {
						for (let ind in success.data.data[index]) {
							let item = success.data.data[index][ind]
							item.optusername = item.optuser.replace("/", " - ").split(' - ')[1];
							item.optusernumber = item.optuser.replace("/", " - ").split(' - ')[0];
							item.optuser = item.optuser.replace("/", " - ");
							item.timeslotend = this.insert_flg(item.timeslotend, ':', 2);
							item.timeslotstart = this.insert_flg(item.timeslotstart, ':', 2);
						}
					}
					let new_date = new Date().getTime();
					// 移除已过期会议预约
					for (let index in success.data.data) {
						success.data.data[index] = success.data.data[index].filter(function(itm) {
							return new Date(`${_this.moment(itm.meetingdate).format('YYYY/MM/DD ')}${itm.timeslotstart}:00`).getTime() >
								new_date && itm.id != _this.detailInfo.id
						});
					}
					// 会议室插入对应会议预约
					for (let item of this.roomReserveList) {
						for (let index in success.data.data) {
							if (item.roomid == index) {
								item.reserveRoomList = success.data.data[index]
							}
						}
					}
					// 删除没有会议预约的会议室
					this.roomReserveList = this.roomReserveList.filter(function(item) {
						return item.reserveRoomList.length
					});
					this.$forceUpdate()
					console.log('预约列表------>>>', success.data.data)
					console.log('会议室列表-------->>>', this.roomReserveList)
				} catch (e) {
					console.log(e)
				}
			},
			// 请求置换列表
			async getReplacement() {
				try {
					let data = await uni.request({
						method: 'POST',
						url: this.api.meeting_replacementList,
						data: {
							MeetingdateStart: this.moment(this.detailInfo.meetingdate).format('YYYY/MM/DD'),
							MeetingdateEnd: this.moment(this.detailInfo.meetingdate).format('YYYY/MM/DD'),
							sourceappointmentid: this.detailInfo.id
						}
					})
					let [err, success] = data
					console.log('请求置换列表------>>>', success.data.data.list)
					if (success && success.data.success) {
						for (let item of success.data.data.list) {
							item.sourcetimeslotstart = this.insert_flg(item.sourcetimeslotstart, ':', 2)
							item.sourcetimeslotend = this.insert_flg(item.sourcetimeslotend, ':', 2)
							item.sourceoptusername = item.sourceoptuser.replace("/", " - ").split(' - ')[1];
							item.sourceoptusernumber = item.sourceoptuser.replace("/", " - ").split(' - ')[0];
						}
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
			uni.showLoading({
				title: '加载中'
			});
			this.roomInfo = JSON.parse(option.options)[0]
			this.reserveInfo = JSON.parse(option.options)[1]
			console.log('会议室信息------>>>', this.roomInfo)
			console.log('预约信息------>>>', this.reserveInfo)
			await this.getFixedEquipmentList()
			await this.getReserveDetail()
			this.getReplacement()
			this.getMaxDelayTimeList()
			this.getTodayReserveList()
			uni.hideLoading();
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

			.item {
				margin-bottom: 0;
				.replacement {
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
			}
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

				&.refuse {
					border: 1px dashed #BBBBBB;
					background: #F2F2F2;

					.time {
						color: #B2B2B2;
					}

					.name {
						color: #CCCCCC;
					}

					.radio {
						display: none;
					}

					.refuse-text {
						color: #CCCCCC;
						font-size: 24rpx;
					}
				}
			}
		}

		.bottom-control {
			position: static;

			.left {
				color: #CCCCCC;
				font-size: 26rpx;
			}

			.refuse {
				background: #D56C68 !important;
			}
		}
	}
</style>
