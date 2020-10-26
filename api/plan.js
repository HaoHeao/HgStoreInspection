/* 计划巡检 */
// const api = 'https://vipapi.hanguangbaihuo.com';
const api = 'https://vipapi-cs.hanguangbaihuo.com';
// const api = 'http://192.168.128.66:8081'

// 待整改
// const plan_questionWait = `${api}/hgInspection/storeapi/plan/load/question/wait` //正式、测试
const plan_questionWait = `${api}/hgInspection/storeapi/plan/load/question/wait`

// 已整改
const plan_questionCompleted = `${api}/hgInspection/storeapi/plan/load/question/adjusted`

// 已完成
const plan_questionFinish = `${api}/hgInspection/storeapi/plan/load/question/finish`

// 请求筛选条件
const plan_getFilterData = `${api}/hgInspection/storeapi/plan/load/question/selectitem`

// 复核请求列表
const plan_getReviewlist = `${api}/hgInspection/storeapi/plan/load/question/confirm`

// 复核筛选列表
const plan_getReviewFilterlist = `${api}/hgInspection/storeapi/plan/load/question/confirm/selectit`

// 撤回整改回复
const plan_delReplydeep = `${api}/hgInspection/storeapi/plan/reply/del`

// 计划巡检获取某一条巡检记录明细
const plan_getPlaninspectionDetail = `${api}/hgInspection/storeapi/plan/load/questionstatus`

// 计划巡检巡检问题复核
const plan_submitInspectionReview = `${api}/hgInspection/storeapi/plan/confirm`

// 计划巡检列表
const plan_getPlanList = `${api}/hgInspection/storeapi/plan/load`


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
}
