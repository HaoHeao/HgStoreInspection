import baseURL from './http_config.js'

/* 计划巡检 */

// 获取卖场巡检列表
// const store_getQuestonList = `${baseURL}/hgInspection/storeapi/log/notice` //正式、测试
const store_getQuestonList = `${baseURL}/hgInspection/storeapi/log/notice`

// 获取卖场巡检最近发布列表
const store_getQuestonNearList = `${baseURL}/hgInspection/storeapi/log/near`

// 卖场巡检提交巡检
const store_submitQuestion = `${baseURL}/hgInspection/storeapi/inspection/save`

// 卖场巡检获取巡检明细
const store_getQuestionDetail = `${baseURL}/hgInspection/storeapi/inspection/load`

// 卖场巡检问题提交回复
const store_feedback = `${baseURL}/hgInspection/storeapi/inspection/question/save`

// 卖场巡检问题撤回
const store_questionWidthdraw = `${baseURL}/hgInspection/storeapi/inspection/del`

// 查询那些人查看过此问题
const store_getLookList = `${baseURL}/hgInspection/storeapi/inspection/view/`

// 卖场巡检获取归属
const store_getUderList = `${baseURL}/hgInspection/storeapi/inspection/type`

// 卖场巡检回复讨论
const store_replyFeedback = `${baseURL}/hgInspection/storeapi/inspection/question/reply`

// 卖场巡检问题确认已解决
const store_questionResolved = `${baseURL}/hgInspection/storeapi/inspection/confirm`

export {
	// 获取卖场巡检列表
	store_getQuestonList,
	// 获取卖场巡检最近发布列表
	store_getQuestonNearList,
	// 卖场巡检提交巡检
	store_submitQuestion,
	// 卖场巡检获取巡检明细
	store_getQuestionDetail,
	// 卖场巡检问题提交回复
	store_feedback,
	// 卖场巡检问题撤回
	store_questionWidthdraw,
	// 查询那些人查看过此问题
	store_getLookList,
	// 卖场巡检获取归属
	store_getUderList,
	// 卖场巡检回复讨论
	store_replyFeedback,
	// 卖场巡检问题确认已解决
	store_questionResolved
}
