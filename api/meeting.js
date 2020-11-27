import baseURL from './http_config.js'

/* 会议室预约 */

// 获取全部房间列表
const meeting_getRoomList = `${baseURL}/hgInspection/meetingroomapi/meetingroom/queryAll`
// const meeting_getRoomList = `${baseURL}/MeetingRoom/api/meetingroom/queryAll`

// 获取天预约列表
const meeting_getDayReservationList = `${baseURL}/hgInspection/meetingroomapi/appointment/query`

// 获取设备类型
const meeting_getGoodsTypeList = `${baseURL}/hgInspection/meetingroomapi/goodstype/queryAll`

// 获取移动设备列表
const meeting_getMobileEquipmentList = `${baseURL}/hgInspection/meetingroomapi/mobilegoods/query`

// 预约会议室
const meeting_reserve = `${baseURL}/hgInspection/meetingroomapi/appointment/save`

// 获取预约详细信息
const meeting_reserveDetail = `${baseURL}/hgInspection/meetingroomapi/appointment/detailInfo`

// 取消会议室预约信息
const meeting_delreserve = `${baseURL}/hgInspection/meetingroomapi/appointment/delete`

// 变更会议室预约时间
const meeting_changeReserveTime = `${baseURL}/hgInspection/meetingroomapi/appointment/addchange`

// 会议室请求置换
const meeting_newReplacement = `${baseURL}/hgInspection/meetingroomapi/appointment/addswap`

// 会议置换请求列表
const meeting_replacementList = `${baseURL}/hgInspection/meetingroomapi/appointment/queryswap`

// 拒绝会议置换申请
const meeting_refusereplacement = `${baseURL}/hgInspection/meetingroomapi/appointment/refuseswap`

// 同意会议置换申请
const meeting_agreereplacement = `${baseURL}/hgInspection/meetingroomapi/appointment/checkswap`

export {
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
	// 拒绝会议置换申请
	meeting_refusereplacement,
	// 同意会议置换申请
	meeting_agreereplacement,
}
