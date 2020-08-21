const api = 'http://192.168.128.66:8081'

/* -----会议室预约meeting------ */
// 获取全部房间列表
const meeting_getRoomList = `${api}/MeetingRoom/api/meetingroom/queryAll`
// 获取天预约列表
const meeting_getDayReservationList = `${api}/MeetingRoom/api/appointment/query`
// 获取设备类型
const meeting_getGoodsTypeList = `${api}/MeetingRoom/api/goodstype/queryAll`
// 获取移动设备列表
const meeting_getMobileEquipmentList = `${api}/MeetingRoom/api/mobilegoods/query`
// 预约会议室
const meeting_reserve = `${api}/MeetingRoom/api/appointment/save`
// 获取预约详细信息
const meeting_reserveDetail = `${api}/MeetingRoom/api/appointment/detailInfo`
// 取消会议室预约信息
const meeting_delreserve = `${api}/MeetingRoom/api/appointment/delete`
// 变更会议室预约时间
const meeting_changeReserveTime = `${api}/MeetingRoom/api/appointment/addchange`
// 新增会议室请求置换
const meeting_newReplacement = `${api}/MeetingRoom/api/appointment/addswap`
// 会议置换请求列表
const meeting_replacementList = `${api}/MeetingRoom/api/appointment/queryswap`

export {
	api,
	/* 会议室预约 */
	// 获取全部房间列表
	meeting_getRoomList,
	// 获取天预约列表
	meeting_getDayReservationList,
	// 获取设备类型
	meeting_getGoodsTypeList,
	// 获取移动设备列表
	meeting_getMobileEquipmentList,
	// 预约会议室
	meeting_reserve,
	// 获取预约详细信息
	meeting_reserveDetail,
	// 取消会议室预约信息
	meeting_delreserve,
	// 变更会议室预约时间
	meeting_changeReserveTime,
	// 会议室请求置换
	meeting_newReplacement,
	// 会议置换请求列表
	meeting_replacementList,
}
