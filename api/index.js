const api = 'http://vipapi-cs.hanguangbaihuo.com'

/* -----会议室预约------ */
// 获取全部房间列表
const meeting_getRoomList = `${api}/hgInspection/meetingroomapi/meetingroom/queryAll`
// 获取天预约列表
const meeting_getDayReservationList = `${api}/hgInspection/meetingroomapi/appointment/query`

export {
	api,
	/* 会议室预约 */
	// 获取全部房间列表
	meeting_getRoomList,
	// 获取天预约列表
	meeting_getDayReservationList,
}
