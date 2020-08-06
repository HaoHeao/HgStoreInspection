const api = 'http://192.168.128.66:8081'
/* -----会议室预约------ */
// 获取全部房间列表
const meeting_getRoomList = `${api}/MeetingRoom/api/meetingroom/queryAll`,
	// 获取天预约列表
	meeting_getDayReservationList = `${api}/MeetingRoom/api/appointment/query`

export {
	api,
	/* 会议室预约 */
	// 获取全部房间列表
	meeting_getRoomList,
	// 获取天预约列表
	meeting_getDayReservationList,
}
