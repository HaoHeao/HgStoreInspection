import baseURL from './http_config.js'

/* 计划巡检 */

// 待整改
// const plan_questionWait = `${baseURL}/hgInspection/storeapi/plan/load/question/wait` //正式、测试
const plan_questionWait = `${baseURL}/hgInspection/storeapi/plan/load/question/wait`

// 已整改
const plan_questionCompleted = `${baseURL}/hgInspection/storeapi/plan/load/question/adjusted`

// 已完成
const plan_questionFinish = `${baseURL}/hgInspection/storeapi/plan/load/question/finish`

// 请求筛选条件
const plan_getFilterData = `${baseURL}/hgInspection/storeapi/plan/load/question/selectitem`

// 复核请求列表
const plan_getReviewlist = `${baseURL}/hgInspection/storeapi/plan/load/question/confirm`

// 复核筛选列表
const plan_getReviewFilterlist = `${baseURL}/hgInspection/storeapi/plan/load/question/confirm/selectit`

// 撤回整改回复
const plan_delReplydeep = `${baseURL}/hgInspection/storeapi/plan/reply/del`

// 计划巡检获取某一条巡检记录明细
const plan_getPlaninspectionDetail = `${baseURL}/hgInspection/storeapi/plan/load/questionstatus`

// 计划巡检巡检问题复核
const plan_submitInspectionReview = `${baseURL}/hgInspection/storeapi/plan/confirm`

// 计划巡检列表
const plan_getPlanList = `${baseURL}/hgInspection/storeapi/plan/load`

// 计划巡检问题整改回复
const plan_getQuestionReply = `${baseURL}/hgInspection/storeapi/plan/reply/save`

// 计划巡检撤回问题整改回复
const plan_withdrawQuestionFeedBack = `${baseURL}/hgInspection/storeapi/plan/question/del`

// 计划巡检提出问题
const plan_submitQuestion = `${baseURL}/hgInspection/storeapi/plan/question/save`

export {
	// 待整改
	plan_questionWait,
	// 已整改
	plan_questionCompleted,
	// 已完成
	plan_questionFinish,
	// 请求筛选条件
	plan_getFilterData,
	// 复核请求列表
	plan_getReviewlist,
	// 复核筛选列表
	plan_getReviewFilterlist,
	// 撤回整改回复
	plan_delReplydeep,
	// 计划巡检获取某一条巡检记录明细
	plan_getPlaninspectionDetail,
	// 计划巡检巡检问题复核
	plan_submitInspectionReview,
	// 计划巡检列表
	plan_getPlanList,
	// 计划巡检问题整改回复
	plan_getQuestionReply,
	// 计划巡检撤回问题整改回复
	plan_withdrawQuestionFeedBack,
	// 计划巡检提出问题
	plan_submitQuestion,
}
