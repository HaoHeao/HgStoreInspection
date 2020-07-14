const {
	root,
	api
} = require("../api.js");

// ---------------------------------------获取数据----------------------------------------------------
// 获取部门列表
const getMarketDeptList = () => {
	return uni.request({
		url: `${api}baseinfo/deptlist`,
		method: "GET"
	})
}

// 获取人员列表
const getMarketUserList = () => {
	return uni.request({
		url: `${api}baseinfo/userlist`,
		method: "GET"
	})
}

// 卖场巡检搜索列表-----------------------------------------------------
const searchList = `${api}inspection/load/list`

// 卖场巡检获取最近30天你发出的巡检--------------------------------------
const getList30 = `${api}inspection/load/list/thirtydays`

// 卖场巡检获取全部列表信息
// method:POST,
// data:{
// 	usernumber: "string",
// 	sdate: "string",
// 	edate: "string",
// 	status: 0,
// 	senddpetid: [
// 		"string"
// 	],
// 	inspectioncode: "string",
// 	pagesize: 0,
// 	pageindex: 0
// }
const getAllList = (option) => {
	return uni.request({
		url: `${api}log/all`,
		method: "POST",
		data: {
			usernumber: option.usernumber,
			sdate: option.sdate,
			edate: option.edate,
			status: option.status,
			senddpetid: option.senddpetid,
			inspectioncode: option.inspectioncode,
			pagesize: option.pagesize,
			pageindex: option.pageindex
		}
	})
}

// 卖场巡检获取最近列表信息
// method:POST,
// data:{
//   "usernumber": "string",
//   "sdate": "string",
//   "edate": "string",
//   "status": 0,
//   "senddpetid": [
//     "string"
//   ],
//   "inspectioncode": "string",
//   "pagesize": 0,
//   "pageindex": 0
// }
const getNearList = (option) => {
	return uni.request({
		url: `${api}log/near`,
		method: "POST",
		data: {
			usernumber: option.usernumber,
			sdate: option.sdate,
			edate: option.edate,
			status: option.status,
			senddpetid: option.senddpetid,
			inspectioncode: option.inspectioncode,
			pagesize: option.pagesize,
			pageindex: option.pageindex
		}
	})
}

// 卖场巡检获取问题列表信息
// method:POST,
// data:{
//   "usernumber": "string",
//   "sdate": "string",
//   "edate": "string",
//   "status": 0,
//   "senddpetid": [
//     "string"
//   ],
//   "inspectioncode": "string",
//   "pagesize": 0,
//   "pageindex": 0
// }
const getQuestionList = (option) => {
	return uni.request({
		url: `${api}log/notice`,
		method: "POST",
		data: {
			usernumber: option.usernumber,
			sdate: option.sdate,
			edate: option.edate,
			status: option.status,
			senddpetid: option.senddpetid,
			inspectioncode: option.inspectioncode,
			pagesize: option.pagesize,
			pageindex: option.pageindex
		}
	})
}

// 卖场巡检获取巡检详细信息
const getDetail = (data) => {
	return uni.request({
		url: `${api}inspection/load/`,
		method: "GET",
		data
	})
}
// 卖场巡检获取归属
const getUder = `${api}inspection/type`

// 卖场巡检修改巡检状态
const changeStatus = `${api}inspection/confirm`

// 卖场巡检查询当前巡检单那些用户看过
const getDetailLook = `${api}inspection/view/`
// ${api}inspection/view/id

// 卖场巡检撤回巡检
const drawInfo = `${api}inspection/del`

// 撤回巡检回复内容
// ${api}inspection/question/del/{questionid}
const drawInfoReply = `${api}inspection/question/del/`


// ---------------------------------------上传操作----------------------------------------------------
// 卖场巡检上传巡检
const addDetail = (data) => {
	return uni.request({
		url: `${api}inspection/save`,
		method: "POST",
		data
	})
}

// 上传图片
const upImg = `${root}file/upload-picture`

// 卖场巡检添加巡检讨论
const saveQiestion = `${api}inspection/question/save`

// 卖场巡检讨论回复
const replyQiestion = `${api}inspection/question/reply`




// ----------------------------------------计划巡检-------------------
// 计划巡检获取计划列表
const getPlanList = (data) => {
	return uni.request({
		url: `${api}plan/load`,
		method: "GET",
		data
	})
}

// 计划巡检获取巡检详细信息
const getPlanDetail = (id) => {
	return uni.request({
		url: `${api}plan/load/${id}`,
		method: "GET"
	})
}

// 计划巡检获取巡检详细信息
const sendPlanReply = (data) => {
	return uni.request({
		url: `${api}plan/question/save`,
		method: "POST",
		data
	})
}

// 计划巡检问题反馈回复
const sendQuestionReply = (data) => {
	return uni.request({
		url: `${api}plan/reply/save`,
		method: "POST",
		data
	})
}

// 确认计划巡检问题已解决
const confirmPlanQuestion = (data) => {
	return uni.request({
		url: `${api}plan/confirm`,
		method: "POST",
		data
	})
}

// 计划巡检问题撤回
const delPlanQuestion = (data) => {
	console.log(data)
	return uni.request({
		url: `${api}plan/question/del`,
		method: "POST",
		data
	})
}

export {
	// 获取部门列表
	getMarketDeptList,
	// 获取人员列表
	getMarketUserList,
	// 搜索列表
	searchList,
	// 获取巡检详细信息
	getDetail,
	// 上传巡检
	addDetail,
	// 上传图片
	upImg,
	// 添加巡检讨论
	saveQiestion,
	// 巡检讨论回复
	replyQiestion,
	// 获取归属
	getUder,
	// 获取最近30天你发出的巡检
	getList30,
	// 修改巡检状态
	changeStatus,
	// 查询当前巡检单那些用户看过
	getDetailLook,
	// 撤回巡检
	drawInfo,
	// 撤回巡检回复内容
	drawInfoReply,
	// 获取全部列表信息
	getAllList,
	// 获取最近列表信息
	getNearList,
	// 获取问题列表信息
	getQuestionList,


	// 计划巡检
	// 计划巡检获取计划列表
	getPlanList,
	// 计划巡检获取巡检详细信息
	getPlanDetail,
	// 计划巡检获取巡检详细信息
	sendPlanReply,
	// 计划巡检问题反馈回复
	sendQuestionReply,
	// 确认计划巡检问题已解决
	confirmPlanQuestion,
	// 计划巡检问题撤回
	delPlanQuestion
}
